import React, { useEffect, useState, useRef } from "react";
import { FaEye } from "react-icons/fa";
import { AiOutlinePrinter } from "react-icons/ai";
import { axiosServer } from "@/axiosServer";
import buildLink from "@/urls";
import { useRouter } from "next/router";
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment";
import "bootstrap-daterangepicker/daterangepicker.css";
export default function orders() {
  const [orders, setOrders] = useState([]);
  const [holds, setHolds] = useState([]);
  const [holdsDetails, setHoldsDetails] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState("");
  const [date, setDate] = useState("");
  const [orderID, setOrderID] = useState("");
  const [update, setUpdate] = useState("");

  const [total, setTotal] = useState({ order: 0, hold: 0 });

  const router = useRouter();
  const dbName = "posDB";
  const orderId = useRef("");

  useEffect(() => {
    console.log(date);
    setOrders([]);
    getData("orders");
  }, [date, orderID, update]);

  useEffect(() => {
    setHolds([]);
    getData("hold_orders");
  }, []);

  function filter(e) {
    setOrders([]);

    const value = e.target.value;
    setOrderID(value);
  }

  useEffect(() => {
    setDate({});

    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    const date = [year, month, day].join("-");
    const startDate = date;
    const endDate = [year, month, Number(day) + 1].join("-");
    const finalDate = startDate + "-" + endDate;

    setDate({ startDate, endDate, finalDate });
  }, [router.asPath]);

  const handleCallback = (start, end) => {
    setOrders([]);
    setDate({});
    setOrderID("");
    const startDate =
      start.year() +
      "-" +
      (start.month() + 1 < 10 ? "0" + (start.month() + 1) : start.month() + 1) +
      "-" +
      (start.date() < 10 ? "0" + start.date() : start.date());

    const endDate =
      end.year() +
      "-" +
      (end.month() + 1 < 10 ? "0" + (end.month() + 1) : end.month() + 1) +
      "-" +
      (end.date() < 10 ? "0" + end.date() : end.date());

    const finalDate = startDate + "-" + endDate;

    setDate({ startDate, endDate, finalDate });
  };

  useEffect(() => {
    var sumHold = 0;

    holds?.map((item) => {
      // console.log(item);
      // console.log(item?.order_total)
      if (item?.total !== undefined) sumHold += Number(item?.total); // Replace "columnName" with the actual column you want to sum
    });

    var sumOrder = 0;
    orders?.map((item) => {
      // console.log(item);
      // console.log(item?.order_total)
      if (item?.data.total !== undefined) sumOrder += Number(item?.data.total); // Replace "columnName" with the actual column you want to sum
    });

    setTotal({ order: sumOrder, hold: sumHold });
  }, [holds, orders, router]);

  function handlePrint(type, value) {
    localStorage.setItem("print_order", JSON.stringify(value));

    const url = "/posSystem/hold/";

    const windowFeatures =
      " toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=302.36220472441, height=250";

    window.open(url, "_blank", windowFeatures);
  }

  function getData(storeName) {
    // Open a connection to the IndexedDB database
    var request = indexedDB.open("posDB", 8);

    // Handle database open success
    request.onsuccess = function (event) {
      var db = event.target.result;

      // Start a transaction on the object store
      var transaction = db.transaction(storeName, "readonly");
      var objectStore = transaction.objectStore(storeName);

      // Open a cursor to iterate over all records
      var cursorRequest = objectStore.openCursor();

      // Handle cursor success
      cursorRequest.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
          // Access the data in the cursor
          var data = cursor.value;

          //   console.log(data) ;
          if (storeName === "hold_orders") {
            holds.push(data);
            setHolds([...holds]);
          } else {
            // alert(date);
            // console.log(date.startDate, date.endDate  , data.data.date)

            // console.log("task")
            const startDate = new Date(date.startDate).getTime(); // Convert start date to timestamp
            const endDate = new Date(date.endDate).getTime();
            var orderDate = new Date(data.data.date); // Convert start date to timestamp

            var month = "" + (orderDate.getMonth() + 1);
            var day = "" + orderDate.getDate();
            var year = orderDate.getFullYear();

            if (month.length < 2) month = "0" + month;
            if (day.length < 2) day = "0" + day;

            orderDate = [year, month, day].join("-");

            console.log(orderDate);
            orderDate = new Date(orderDate).getTime();


            if ( data.id === parseInt(orderID)) {
              orders.push(data);
            } else {
              if (
                orderDate != NaN &&
                data.data.date &&
                orderDate >= startDate &&
                orderDate <= endDate &&
                !orderID
              ) {
                orders.push(data);
              }
            }

            setOrders([...orders]);
          }
          // Move to the next cursor
          cursor.continue();
        }
      };

      // Handle cursor error
      cursorRequest.onerror = function (event) {
        console.error("Error opening cursor:", event.target.error);
      };
    };

    // Handle database open error
    request.onerror = function (event) {
      console.error("Error opening database:", event.target.error);
    };
  }

  function detailsHoldShow(value) {
    setShowDetails(false);
    setHoldsDetails("");
    setShowDetails(true);
    setHoldsDetails(value);
  }

  function sync() {
    holdsDetails.telephone =
      holdsDetails.telephone.indexOf("961") < 0
        ? "961" + holdsDetails.telephone
        : holdsDetails.telephone;

    const currentDate = new Date();
    const formattedDateTime = currentDate.toLocaleString();
    holdsDetails.date = formattedDateTime;
    console.log(holdsDetails);
    axiosServer
      .post(
        buildLink("manual", undefined, undefined, window.config["site-url"]),
        holdsDetails
      )
      .then((response) => {
        // setManualResponse(response?.data?.data);

        if (response?.data?.success === false) {
          // console.log(response?.data);
          setError(response?.data?.message);

          if (
            response?.data?.errors.length === 1 &&
            response?.data.message === "OUT OF STOCK"
          ) {
            return;
          }
        } else {
          setError("");

          var res = response?.data?.data;
          res.date = formattedDateTime;

          paymentForm(true, "cod", res);
        }
      });
  }
  function print() {
    const url =
      "/posSystem/print?&startDate=" +
      date.startDate +
      "&endDate=" +
      date.endDate;

    const windowFeatures =
      " toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=yes";

    window.open(url, "", windowFeatures);
  }

  function paymentForm(confirm, p_m, orderData) {
    axiosServer
      .post(
        buildLink(
          "payment_form",
          undefined,
          undefined,
          window.config["site-url"]
        ),
        { payment_method: p_m }
      )
      .then((response) => {
        const data = response.data;
        try {
          document.getElementById("simp-id").outerHTML = "";
        } catch (e) {}
        const script = document.createElement("script");
        script.src = "https://www.simplify.com/commerce/simplify.pay.js";
        script.async = false;
        script.id = "simp-id";
        document.body.appendChild(script);

        if (data.success) {
          if (p_m === "cod" && confirm) {
            confirmOrder(data.confirm_url, data.success_url, orderData);
          }
        } else {
          localStorage.setItem("payment_error-2", data);
        }
      });
  }

  function confirmOrder(c_url, s_url, orderData) {
    axiosServer.post(c_url).then((response) => {
      const data = response.data;
      if (data.success) {
        successOrder(s_url, orderData);
      }
    });
  }

  function successOrder(url, orderData) {
    axiosServer.get(url).then((response) => {
      const data = response.data;

      if (data.success) {
        addOrder("orders", orderData);
        deleteRow("hold_orders", holdsDetails.id);
        setShowDetails(false);
        setHoldsDetails("");
      }
    });
  }

  function addOrder(type, data) {
    const objectStoreName = type;

    const request = indexedDB.open(dbName);

    request.onsuccess = function (event) {
      const db = event.target.result;

      // Start a transaction on the object store for readwrite access
      const transaction = db.transaction(objectStoreName, "readwrite");

      // Get a reference to the object store
      const objectStore = transaction.objectStore(objectStoreName);

      // Use the add method to add the data to the object store
      var dataValue = {};
      if (type === "orders") {
        dataValue = { id: data.order_id, data: data };
      }
      if (type === "hold_orders") {
        dataValue = data;
      }

      const addRequest = objectStore.add(dataValue);

      addRequest.onsuccess = function (event) {
        // console.log("Data added successfully:", event.target.result);
      };

      addRequest.onerror = function (event) {
        // console.error("Error adding data:", event.target.error);
      };
    };

    request.onerror = function (event) {
      console.error("Error opening database:", event.target.error);
    };
  }

  function deleteRow(storeName, keyToDelete) {
    setUpdate(false);
    // Open a connection to the database
    const request = indexedDB.open(dbName);

    request.onerror = (event) => {
      console.error("Database error:", event.target.error);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;

      // Start a transaction on the object store
      const transaction = db.transaction(storeName, "readwrite");
      const objectStore = transaction.objectStore(storeName);

      // Delete the record using the key
      const deleteRequest = objectStore.delete(keyToDelete);

      deleteRequest.onsuccess = (event) => {
        setUpdate(true);
        console.log("Record deleted successfully");
      };

      deleteRequest.onerror = (event) => {
        console.error("Error deleting record:", event.target.error);
      };
    };

    request.onupgradeneeded = (event) => {
      // Handle database upgrades if needed
      console.log("Database upgrade needed");
    };
  }
  return (
    <div>
      <div className="flex justify-start bg-white py-2">
        <a
          target="_blank"
          className="text-dblue text-xl"
          rel="noreferrer"
          href={"/posSystem/pos"}
        >
          Pos
        </a>
        <a
          target="_blank"
          className="px-6 text-dblue text-xl"
          rel="noreferrer"
          href={"/posSystem/orders"}
        >
          orders list
        </a>
      </div>
      {showDetails && (
        <div
          id="overlay"
          className="fixed  z-40 w-screen h-screen inset-0 bg-dblack bg-opacity-60"
        ></div>
      )}

      {(showDetails || showDetails === 0) && (
        <div className="fixed left-0 top-0   h-full w-full overflow-y-auto overflow-x-hidden outline-none z-50">
          <div className="pointer-events-none relative w-8/12 top-1/3 left-1/4 right-1/3  translate-y-[-50px]  transition-all duration-300 ease-in-out">
            <div className="p-5  pointer-events-auto relative flex w-full flex-col rounded-md border-dinputBorder bg-white  text-current shadow-lg outline-none">
              <div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-dinputBorder z-50	 ">
                <span
                  className="text-xl font-medium leading-normal"
                  id="exampleModalLabel"
                >
                  Order Details
                </span>

                <span className="text-xl font-medium leading-normal text-dbase">
                  {error}{" "}
                </span>

                {/* {error?.length > 0 &&
                  error?.map(
                    (err) =>
                      (err?.errorCode === "stock" ||
                        err?.errorCode === "option") && (
                        <p className="  m-1 text-dbase text-d22">
                          {error[0]?.errorMsg}
                        </p>
                      )
                  )} */}
                <button onClick={() => setShowDetails("")}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div>
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border font-medium border-DarkGrey">
                    <tr>
                      <th scope="col" className="px-2 py-4">
                        #
                      </th>
                      <th scope="col" className="py-4">
                        product
                      </th>
                      <th scope="col" className="pr-4 py-4">
                        sku
                      </th>
                      <th scope="col" className=" py-4">
                        Model
                      </th>
                      <th scope="col">price</th>
                      <th scope="col" className=" py-4">
                        QTY
                      </th>

                      <th scope="col" className="py-4 text-center">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdsDetails &&
                      holdsDetails?.order_product?.map((order, key) => (
                        <tr className="border border-DarkGrey ">
                          <td className="whitespace-nowrap px-4 py-2 font-medium">
                            {key + 1}
                          </td>
                          <td className="whitespace-nowrap py-2">
                            {order?.name} - {"  "}
                            {order?.order_option?.length > 0 &&
                              order?.order_option[0] &&
                              order?.order_option[0]?.name +
                                " : " +
                                order?.order_option[0]?.value}
                          </td>
                          {/* <td className="whitespace-nowrap px-6 py-4">${order.sub_total}</td> */}
                          <td className="whitespace-nowrap  py-2">
                            {order?.sku}
                          </td>
                          <td className="whitespace-nowrap  py-2">
                            {order?.model}
                          </td>
                          <td className="whitespace-nowrap  py-2">
                            {order?.price}
                          </td>
                          <td className="whitespace-nowra py-2">
                            {order?.quantity}
                          </td>

                          <td className="whitespace-nowrap text-center py-2">
                            {order?.total}
                          </td>
                        </tr>
                      ))}

                    {holdsDetails &&
                      holdsDetails?.data?.order_product?.map((order, key) => (
                        <tr className="border border-DarkGrey ">
                          <td className="whitespace-nowrap px-4 py-2 font-medium">
                            {key + 1}
                          </td>
                          <td className="whitespace-nowrap py-2">
                            {order?.name} -{" "}
                            {order?.option?.length > 0 &&
                              order?.option[0] &&
                              order?.option[0]?.name +
                                ":" +
                                order?.option[0]?.value}
                          </td>
                          {/* <td className="whitespace-nowrap px-6 py-4">${order.sub_total}</td> */}
                          <td className="whitespace-nowrap  py-2">
                            {order?.sku}
                          </td>
                          <td className="whitespace-nowrap  py-2">
                            {order?.model}
                          </td>
                          <td className="whitespace-nowrap  py-2">
                            {order?.unit_price}
                          </td>
                          <td className="whitespace-nowra py-2">
                            {order?.quantity}
                          </td>

                          <td className="whitespace-nowrap  text-center py-2">
                            {order?.price}
                          </td>
                        </tr>
                      ))}
                  </tbody>

                  <tfoot>
                    {holdsDetails?.data?.order_total ? (
                      holdsDetails?.data?.order_total?.map(
                        (item) =>
                          item.code !== "shipping" && (
                            <tr className="border border-DarkGrey ">
                              <td
                                className="whitespace-nowrap  py-2 pr-8 font-medium text-right"
                                colspan="6"
                              >
                                {item?.title}
                              </td>{" "}
                              <td className="whitespace-nowrap text-center py-2">
                                {item?.text}
                              </td>
                            </tr>
                          )
                      )
                    ) : (
                      <>
                        {holdsDetails &&
                          !holdsDetails?.totals &&
                          holdsDetails?.sub_total && (
                            <tr className="border border-DarkGrey ">
                              <td
                                className="whitespace-nowrap  py-2 pr-8 font-medium text-right"
                                colspan="6"
                              >
                                {"Sub Total"}
                              </td>
                              <td className="text-center ">
                                {holdsDetails.sub_total}
                              </td>
                            </tr>
                          )}

                        {holdsDetails &&
                          !holdsDetails?.totals &&
                          holdsDetails?.modification && (
                            <tr className="border border-DarkGrey ">
                              <td
                                className="whitespace-nowrap  py-2 pr-8 font-medium text-right"
                                colspan="6"
                              >
                                {holdsDetails.modification_remarque}
                              </td>
                              <td className="text-center ">
                                {holdsDetails.modification}
                              </td>
                            </tr>
                          )}

                        {holdsDetails &&
                          !holdsDetails?.totals &&
                          holdsDetails?.order_total && (
                            <tr className="border border-DarkGrey ">
                              <td
                                className="whitespace-nowrap  py-2 pr-8 font-medium text-right"
                                colspan="6"
                              >
                                {"Total"}
                              </td>
                              <td className="text-center ">
                                {holdsDetails.order_total -
                                  holdsDetails.modification}
                              </td>
                            </tr>
                          )}
                      </>
                    )}

                    {holdsDetails &&
                      holdsDetails &&
                      holdsDetails?.totals
                        ?.sort((a, b) => a.sort_order - b.sort_order)
                        ?.map(
                          (item) =>
                            item.code !== "shipping" && (
                              <tr className="border border-DarkGrey ">
                                <td
                                  className="whitespace-nowrap  py-2 pr-8 font-medium text-right"
                                  colspan="6"
                                >
                                  {item?.title}
                                </td>{" "}
                                <td className="whitespace-nowrap  py-2 text-center">
                                  {item?.text}
                                </td>
                              </tr>
                            )
                        )}
                  </tfoot>
                </table>
              </div>
              <div className="flex justify-between">
                {holdsDetails?.hold_reason && (
                  <div className="text-dbase pt-2 ">
                    Reason {holdsDetails?.hold_reason}
                  </div>
                )}
                <div></div>
                <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-dinputBorder pt-3">
                  {!holdsDetails?.data && (
                    <button
                      className="bg-dblue text-white py-2 px-3 rounded ml-3"
                      onClick={() => sync("")}
                    >
                      sync
                    </button>
                  )}
                  <button
                    className="bg-dgreyRate p-2  rounded ml-3"
                    onClick={() => setShowDetails("")}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div classname="w-full px-5">
        <div className="flex justify-between mt-6">
          <div className="flex justify-center items-center pl-5">
            {" "}
            Order ID{" "}
            <div className="px-2 ">
              <input
                className="border-2 border-dinputBorder p-1.5"
                ref={orderId}
                onKeyUp={(e) => filter(e)}
              />
            </div>
          </div>
          <div className="px-5 flex w-1/3 justify-center items-center">
            {" "}
            Date{" "}
            <div className="pr-2 mb- w-full">
              {/* <label className="block text-xs mb-2" for="date_added">
                        Date Added:
                      </label> */}
              <div className="flex px-2">
                <DateRangePicker
                  initialSettings={{
                    ranges: {
                      Today: [
                        moment().startOf("day"),
                        moment().endOf("day") + 1
                      ],

                      Yesterday: [
                        moment().subtract(1, "days").toDate(),
                        moment().subtract(1, "days").toDate()
                      ],
                      "Last 7 Days": [
                        moment().subtract(6, "days").toDate(),
                        moment().toDate()
                      ],
                      "Last 30 Days": [
                        moment().subtract(29, "days").toDate(),
                        moment().toDate()
                      ],
                      "This Month": [
                        moment().startOf("month").toDate(),
                        moment().endOf("month").toDate()
                      ],
                      "Last Month": [
                        moment().subtract(1, "month").startOf("month").toDate(),
                        moment().subtract(1, "month").endOf("month").toDate()
                      ]
                    }
                  }}
                  onCallback={handleCallback}
                >
                  <div
                    id="reportrange"
                    className="col-4 form-control text-dbluegray h-10 text-sm flex items-center"
                    style={{
                      background: "#fff",
                      cursor: "pointer",
                      padding: "5px 10px",
                      width: "100%"
                    }}
                  >
                    <i className="fa fa-calendar"></i>&nbsp;
                    <span>{date.finalDate}</span>{" "}
                    <i className="fa fa-caret-down"></i>
                  </div>
                </DateRangePicker>
                <button
                  className="-ml-8 w-8"
                  style={{ borderLeft: "1px solid #e2e5ec" }}
                  onClick={() => {
                    setDate();
                  }}
                >
                  X
                </button>
              </div>
            </div>
          </div>

          <button
            className="px-5 bg-dblue text-white py-2 rounded-md ml-5 float-right mr-6 mt-3"
            onClick={(e) => print(date.finalDate)}
          >
            Print
          </button>
        </div>
        <table className="table border-collapse border w-full mt-5">
          <thead>
            <tr className="border border-gray-400 p-2">
              <th className="border border-gray-400 p-2"> Order id</th>
              <th className="border border-gray-400 p-2">name</th>
              <th className="border border-gray-400 p-2">Telephone</th>
              <th className="border border-gray-400 p-2">date</th>

              <th className="border border-gray-400 p-2">sub Total</th>

              <th className="border border-gray-400 p-2">Discount</th>
              <th className="border border-gray-400 p-2">total</th>
              <th className="border border-gray-400 p-2">details</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((o, key) => (
              <tr>
                <td className="border border-gray-400 p-2">{o.id}</td>
                <td className="border border-gray-400 p-2">
                  {o.data.social_data.firstname}{" "}
                  {o.data.social_data.lastname != "Local Customer" &&
                    o.data.social_data.lastname}
                </td>
                <td className="border border-gray-400 p-2">
                  {o.data.social_data.telephone}
                </td>
                <td className="border border-gray-400 p-2">{o.data.date}</td>
                <td className="border border-gray-400 p-2">
                  {" "}
                  {o?.data.order_total?.map(
                    (item) => item?.code === "sub_total" && item?.text
                  )}
                </td>
                <td className="border border-gray-400 p-2">
                  {" "}
                  {o?.data.order_total?.map(
                    (item) =>
                      item?.code !== "total" &&
                      item?.code !== "sub_total" &&
                      item?.code !== "shipping" &&
                      item?.text
                  )}
                </td>
                <td className="border border-gray-400 p-2">
                  {" "}
                  {o?.data.order_total?.map(
                    (item) => item?.code === "total" && item?.text
                  )}
                </td>
                <td className="border border-gray-400 p-2">
                  <button
                    className="bg-transparent hover:bg-dblue text-blue-700 font-semibold hover:text-white py-3 px-3 border border-blue-500 hover:border-transparent rounded-full"
                    onClick={() => detailsHoldShow(o)}
                  >
                    <FaEye />
                  </button>

                  <button
                    href={"/posprint/" + o?.order_id}
                    // target="_blank"
                    className="ml-2 bg-transparent hover:bg-dblue text-blue-700 font-semibold hover:text-white py-3 px-3 border border-blue-500 hover:border-transparent rounded-full"
                    onClick={() => handlePrint("order", o)}
                  >
                    <AiOutlinePrinter />
                  </button>
                </td>
              </tr>
            ))}

            {holds &&
              holds?.map((h, key) => (
                <tr className="text-dbase opacity-70 border border-dbase">
                  <td className="border border-gray-400 p-2">{"Hold"}</td>
                  <td className="border border-gray-400 p-2">{h.firstname}</td>
                  <td className="border border-gray-400 p-2">{h?.telephone}</td>
                  <td className="border border-gray-400 p-2">{h?.date}</td>
                  <td className="border border-gray-400 p-2">
                    ${h?.sub_total}
                  </td>
                  <td className="border border-gray-400 p-2">
                    {h?.modification}
                  </td>
                  <td className="border border-gray-400 p-2">
                    ${h?.order_total}
                  </td>
                  <td className="border border-gray-400 p-2">
                    <button
                      className="bg-transparent hover:bg-dblue text-blue-700 font-semibold hover:text-white py-3 px-3 border border-blue-500 hover:border-transparent rounded-full"
                      onClick={() => detailsHoldShow(h)}
                    >
                      <FaEye />
                    </button>

                    <button
                      className="ml-2 bg-transparent hover:bg-dblue text-blue-700 font-semibold hover:text-white py-3 px-3 border border-blue-500 hover:border-transparent rounded-full"
                      onClick={() => handlePrint("hold", h)}
                    >
                      <AiOutlinePrinter />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className=" pr-7 fixed bottom-0 px-12 py-6 w-full  text-xxl font-semibold bg-white border-t border-DarkGrey">
          <div className="flex justify-between">
            <div className=""></div>
            <div className=""></div>
            <div className="text-dbase">
              {" "}
              Total Hold ${total.hold > 0 ? total.hold : 0}
            </div>{" "}
            <div className="">
              {" "}
              Total ${total?.order > 0 ? total?.order : 0}
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}

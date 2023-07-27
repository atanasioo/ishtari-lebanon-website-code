import { useState, useEffect, useContext, useRef } from "react";
import buildLink from "../urls";
import { axiosServer } from "@/axiosServer";
import { FaEye } from "react-icons/fa";
import { AiOutlinePrinter } from "react-icons/ai";
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment";
import "bootstrap-daterangepicker/daterangepicker.css";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
export default function PosOrders() {
  const [storedArray, setMyArray] = useState([]);
  const [holdArray, setHoldArray] = useState();
  const router = useRouter();
  const [showDetails, setShowDetails] = useState();
  const [printShow, setPrinthow] = useState();

  const [details, setDetails] = useState();
  const [holdDetails, setHoldDetails] = useState();

  const [date, setDate] = useState("");
  const [totalsHold, setTotalsHold] = useState("");
  const [totals, setTotals] = useState("");

  const [myFilter, setMyFilter] = useState();
  const [manualResponse, setManualResponse] = useState();
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [stored, setStored] =
    useState();
    //   JSON.parse(typeof window !== 'undefined' && localStorage.getItem("orders"))

  const orderId = useRef("");

  function handlePrint(id) {
    const url = "/posprint/order/" + id;

    const windowFeatures =
      "toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=302.36220472441, height=250";

    window.open(url, "_blank", windowFeatures);
  }
  useEffect(() => {
    const storedData = localStorage.getItem("orders");
    try {
      const parsedData = JSON.parse(storedData);
      setStored(parsedData);
      // Use the parsedData as needed
    } catch (error) {
      console.error("Error parsing data from localStorage:", error);
    }

    const storedDataHolder = localStorage.getItem("hold-order");
    try {
      const storedHolder = JSON.parse(storedDataHolder);
      console.log(storedHolder);
      setHoldArray(storedHolder);

      var sumHold = 0;

   storedHolder?.map((item) => {
    console.log(item)
        // console.log(item?.order_total)
        if (item?.total !== undefined)
          sumHold += Number(item?.total); // Replace "columnName" with the actual column you want to sum
      });

      setTotalsHold(sumHold);
      // Use the parsedData as needed
    } catch (error) {
      console.error("Error parsing data from localStorage:", error);
    }
  }, [holdArray]);

  function filter(e) {
    if (e.keyCode === 13 && e.target.value > 0) {
      var sum = 0;
      axiosServer
        .get(
          buildLink(
            "order_details",
            undefined,
            undefined,
            window.config["site-url"]
          ) +
            [e.target.value] +
            "&pos=true&date_added=" +
            date?.finalDate
        )
        .then((response) => {
          if (response.data.success) {
            // setMyArray(response?.data?.data);
            console.log(date);
            // calculateSum(date);
            setMyArray(response?.data?.data);
            response?.data?.data?.map((order) => {
              // console.log(order);
              // if (date === order?.date_added) {
              // storedArray.push(order)

              order.totals.map((item) => {
                if (item.code === "total")
                  sum += Number(item?.text?.replace("$", "")); // Replace "columnName" with the actual column you want to sum
              });
              // }
            });
          }
          setTotals(sum);
        });
    } else {
      getOrders(date);
    }
  }

  const handleCallback = (start, end) => {
    const finalDate =
      start.year() +
      "-" +
      (start.month() + 1 < 10 ? "0" + (start.month() + 1) : start.month() + 1) +
      "-" +
      (start.date() < 10 ? "0" + start.date() : start.date()) +
      " - " +
      end.year() +
      "-" +
      (end.month() + 1 < 10 ? "0" + (end.month() + 1) : end.month() + 1) +
      "-" +
      (end.date() < 10 ? "0" + end.date() : end.date());

    // alert(finalDate)

    // alert(start)
    // alert(end)
    setDate({ start, end, finalDate });
  };

  function addToLocalStorage(order, id) {
    setHoldArray(holdArray?.filter((item, key) => key !== id));

    setShowDetails("");

    const storedArrayString = localStorage.getItem("orders");

    // Convert the string back to an array
    let storedArray = JSON.parse(storedArrayString);

    // Make changes to the array
    storedArray.push(order);
    // storedArray.push("50718");
    // Adding a new element to the array
    // Convert the modified array back to a string
    const updatedArrayString = JSON.stringify(storedArray);

    localStorage.setItem("orders", updatedArrayString);

    // Update the stored array in local storage
    localStorage.setItem("myArraytest", updatedArrayString);

    setStored(JSON.parse(localStorage.getItem("orders")));
  }

  useEffect(() => {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    const date = [year, month, day].join("-");
    const start = date;
    const end = date;
    const finalDate = start + " - " + end;

    setDate({ start, end, finalDate });
  }, [router.asPath]);

  useEffect(() => {
    getOrders(date);
  }, [date, stored]);

  function print(date) {
    const url = "/posprint/" + date;

    const windowFeatures =
      " toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=yes";

    window.open(url, "", windowFeatures);
  }

  function getOrders(date) {
    var sum = 0;
    const stored = localStorage.getItem("orders");
    // alert(storedArray)
    if (stored && date != undefined) {
      var param = JSON.parse(stored);

      // alert(param)
      axiosServer
        .get(
          buildLink(
            "order_details",
            undefined,
            undefined,
            window.config["site-url"]
          ) +
            param +
            "&pos=true&date_added=" +
            date?.finalDate
        )
        .then((response) => {
          if (response.data.success) {
            // setMyArray(response?.data?.data);
            console.log(date);
            // calculateSum(date);
            setMyArray(response?.data?.data);
            response?.data?.data?.map((order) => {
              // console.log(order);
              // if (date === order?.date_added) {
              // storedArray.push(order)

              order.totals.map((item) => {
                if (item.code === "total")
                  sum += Number(item?.text?.replace("$", "")); // Replace "columnName" with the actual column you want to sum
              });
              // }
            });
          }
          setTotals(sum);
        });
    }
  }
  function handlePrintHolder(id) {
    const url = "/posprint/hold/" + id;

    const windowFeatures =
      " toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=302.36220472441, height=250";

    window.open(url, "_blank", windowFeatures);
  }
  // useEffect(() => {
  //   // Load the array from local storage on component mount
  //   const storedHold = localStorage.getItem("hold-order");
  //   // console.log(JSON.parse(storedHold));
  //   if (storedHold) {
  //     setHoldArray(JSON.parse(storedHold));
  //   }
  // }, [router.asPath]);

  function detailsShow(value) {
    setHoldDetails("");
    setShowDetails(value);

    setDetails(storedArray?.filter((item) => item?.order_id?.includes(value)));
  }

  function detailsHoldShow(value) {
    setDetails("");
    setShowDetails(value);
    // console.lof(value)
    setHoldDetails(holdArray[value]);
  }
  function filterDate(e) {
    setMyFilter("");
    // console.log(dateref.current.value)
    var d = new Date(e.target.value),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    const date = [year, month, day].join("-");
    console.log(date);
    // setDate(date + "-" + date);

    // console.log("storedArray");
    // console.log(storedArray);
    // console.log("myf");
    // console.log(myFilter);
    // // calculateSum(date)
  }
  function filterID(e) {
    e.target.value != ""
      ? setMyArray(
          storedArray?.filter((item) =>
            item?.order_id?.includes(e.target.value)
          )
        )
      : getOrders();
  }
  function filterName(e) {
    e.target.value != ""
      ? setMyArray(
          storedArray?.filter(
            (item) =>
              item?.includes(e.target.value) ||
              item?.lastname?.includes(e.target.value)
          )
        )
      : setMyArray(JSON.parse(localStorage.getItem("orders")));
  }

  function sync() {
    holdDetails.telephone =
      holdDetails.telephone.indexOf("961") < 0
        ? "961" + holdDetails.telephone
        : holdDetails.telephone;
    axiosServer
      .post(
        buildLink("manual", undefined, undefined, window.config["site-url"]),
        holdDetails
      )
      .then((response) => {
        setManualResponse(response?.data?.data);

        if (response?.data?.success === false) {
          console.log(response?.data);
          setError(response?.data?.errors);

          if (
            response?.data?.errors.length === 1 &&
            response?.data.message === "OUT OF STOCK"
          ) {
            return;
          }
        } else {
          setError("");
          paymentForm(true, "cod");
          setManualResponse(response?.data?.data);
        }
      });
  }

  function paymentForm(confirm, p_m) {
    // setLoading(true);
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
          // setId(data.order_id);

          if (p_m === "cod" && confirm) {
            // if (Object.keys(manualErrors.current).length === 0) {
            confirmOrder(data.confirm_url, data.success_url);
            // }
          }
        }
      });
  }
  function confirmOrder(c_url, s_url) {
    axiosServer.post(c_url).then((response) => {
      const data = response.data;
      if (data.success) {
        successOrder(s_url);
        setSuccess(true);
      } else {
        localStorage.setItem("hold-error-success", data);
      }
    });
  }

  function successOrder(url) {
    axiosServer.get(url).then((response) => {
      const data = response.data;
      if (data.success) {
        addToLocalStorage(data?.data?.orderDetails?.order_id, showDetails);
      } else {
        localStorage.setItem("hold-error", data);
      }
    });
  }

  // useEffect(() => {
  //   // Save the array to local storage whenever it changes
  //   if (stored?.length > 0)
  //     localStorage.setItem("orders", JSON.stringify(stored));
  // }, [stored]);

  useEffect(() => {
    // Save the array to local storage whenever it changes
    localStorage.setItem("hold-order", JSON.stringify(holdArray));
  }, [holdArray]);

  return (
    <div>
      {showDetails && (
        <div
          id="overlay"
          className="fixed  z-40 w-screen h-screen inset-0 bg-dblack bg-opacity-60"
        ></div>
      )}

      {(showDetails || showDetails === 0) && (
        <div class="fixed left-0 top-0   h-full w-full overflow-y-auto overflow-x-hidden outline-none z-50">
          <div class="pointer-events-none relative w-1/2 top-1/3 left-1/4 right-1/4  translate-y-[-50px]  transition-all duration-300 ease-in-out">
            <div class="p-5  pointer-events-auto relative flex w-full flex-col rounded-md border-dinputBorder bg-white  text-current shadow-lg outline-none">
              <div class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-dinputBorder z-50	 ">
                <h5
                  class="text-xl font-medium leading-normal"
                  id="exampleModalLabel"
                >
                  Order Details
                </h5>

                {error?.length > 0 &&
                  error?.map(
                    (err) =>
                      (err?.errorCode === "stock" ||
                        err?.errorCode === "option") && (
                        <p className="  m-1 text-dbase text-d22">
                          {error[0]?.errorMsg}
                        </p>
                      )
                  )}
                <button onClick={() => setShowDetails("")}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-6 w-6"
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
                <table class="min-w-full text-left text-sm font-light">
                  <thead class="border font-medium border-DarkGrey">
                    <tr>
                      <th scope="col" class="px-2 py-4">
                        #
                      </th>
                      <th scope="col" class="py-4">
                        product
                      </th>
                      <th scope="col" class="pr-4 py-4">
                        sku
                      </th>
                      <th scope="col" class=" py-4">
                        Model
                      </th>
                      <th scope="col">price</th>
                      <th scope="col" class=" py-4">
                        QTY
                      </th>

                      <th scope="col" class="py-4">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {details &&
                      details[0]?.products?.map((order, key) => (
                        <tr class="border border-DarkGrey ">
                          <td class="whitespace-nowrap px-4 py-2 font-medium">
                            {key + 1}
                          </td>
                          <td class="whitespace-nowrap py-2">{order?.name}</td>
                          {/* <td class="whitespace-nowrap px-6 py-4">${order.sub_total}</td> */}
                          <td class="whitespace-nowrap  py-2">{order?.sku}</td>
                          <td class="whitespace-nowrap  py-2">
                            {order?.model}
                          </td>
                          <td class="whitespace-nowrap  py-2">
                            {order?.price}
                          </td>
                          <td class="whitespace-nowra py-2">
                            {order?.quantity}
                          </td>

                          <td class="whitespace-nowrap  py-2">
                            {order?.total}
                          </td>
                        </tr>
                      ))}

                    {holdDetails &&
                      holdDetails?.order_product?.map((order, key) => (
                        <tr class="border border-DarkGrey ">
                          <td class="whitespace-nowrap px-4 py-2 font-medium">
                            {key + 1}
                          </td>
                          <td class="whitespace-nowrap py-2">
                            {order?.name} -{" "}
                            {order?.order_option?.length > 0 &&
                              order?.order_option[0] &&
                              order?.order_option[0]?.name +
                                ":" +
                                order?.order_option[0]?.value}
                          </td>
                          {/* <td class="whitespace-nowrap px-6 py-4">${order.sub_total}</td> */}
                          <td class="whitespace-nowrap  py-2">{order?.sku}</td>
                          <td class="whitespace-nowrap  py-2">
                            {order?.model}
                          </td>
                          <td class="whitespace-nowrap  py-2">
                            {order?.unit_price}
                          </td>
                          <td class="whitespace-nowra py-2">
                            {order?.quantity}
                          </td>

                          <td class="whitespace-nowrap  py-2">
                            {order?.price}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  {details && details[0] && (
                    <tfoot>
                      <tr class="border border-DarkGrey ">
                        <td
                          class="whitespace-nowrap  py-2 pr-8 font-medium text-right"
                          colspan="6"
                        >
                          Sub-total
                        </td>{" "}
                        <td class="whitespace-nowrap px-6 py-2  text-center">
                          {details[0]?.totals?.map(
                            (item) => item?.code === "sub_total" && item?.text
                          )}
                        </td>
                      </tr>
                      <tr class="border border-DarkGrey ">
                        <td
                          class="whitespace-nowrap  py-2 pr-8 font-medium text-right"
                          colspan="6"
                        >
                          Modification
                        </td>
                        <td class="whitespace-nowrap px-6 py-2">
                          {details[0]?.totals?.map(
                            (item) =>
                              item?.code === "modification" &&
                              item?.text + " (" + item.title + ")"
                          )}
                        </td>
                      </tr>
                      <tr class="border border-DarkGrey ">
                        <td
                          class="whitespace-nowrap  py-2 pr-8 font-medium text-right"
                          colspan="6"
                        >
                          coupon
                        </td>
                        <td class="whitespace-nowrap px-6 py-2">
                          {details[0]?.totals?.map(
                            (item) =>
                              item?.code === "coupon" && (item?.text || 0)
                          )}
                        </td>
                      </tr>
                      <tr class="border border-DarkGrey ">
                        <td
                          class="whitespace-nowrap  py-2 pr-8 font-medium text-right"
                          colspan="6"
                        >
                          Total
                        </td>
                        <td class="whitespace-nowrap px-6 py-4">
                          {details[0]?.totals?.map(
                            (item) =>
                              item?.code === "total" && (item?.text || 0)
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                  {holdDetails && (
                    <tfoot>
                      <tr class="border border-DarkGrey ">
                        <td
                          class="whitespace-nowrap  py-2 pr-8 font-medium text-right"
                          colspan="5"
                        >
                          Sub Total
                        </td>
                        <td class="whitespace-nowrap  py-2">
                          {holdDetails?.sub_total}
                        </td>
                      </tr>
                      {holdDetails?.modification_type && (
                        <tr class="border border-DarkGrey ">
                          <td
                            class="whitespace-nowrap  py-2 pr-8 font-medium text-right"
                            colspan="5"
                          >
                            {holdDetails?.modification_type}
                          </td>
                          <td class="whitespace-nowrap  py-2">
                            {holdDetails?.modification}
                          </td>
                        </tr>
                      )}

                      {holdDetails?.coupon && (
                        <tr class="border border-DarkGrey ">
                          <td
                            class="whitespace-nowrap  py-2 pr-8 font-medium text-right"
                            colspan="5"
                          >
                            Coupon
                          </td>
                          <td class="whitespace-nowrap  py-2">
                            {holdDetails?.coupon}
                          </td>
                        </tr>
                      )}
                      <tr class="border border-DarkGrey ">
                        <td
                          class="whitespace-nowrap  py-2 pr-8 font-medium text-right"
                          colspan="5"
                        >
                          Total
                        </td>
                        <td class="whitespace-nowrap  py-2">
                          {holdDetails?.total || holdDetails?.order_total}
                        </td>
                      </tr>
                    </tfoot>
                  )}

                  {/* {details && (
                    <tfoot>
                      <tr class="border border-DarkGrey ">
                        <td
                          class="whitespace-nowrap  py-2 pr-8 font-medium text-right"
                          colspan="5"
                        >
                          Sub Total
                        </td>
                        <td class="whitespace-nowrap  py-2">
                          {details?.sub_total}
                        </td>
                      </tr>
                      {details?.modification_amount && (
                        <tr class="border border-DarkGrey ">
                          <td
                            class="whitespace-nowrap  py-2 pr-8 font-medium text-right"
                            colspan="5"
                          >
                            {details?.modification_type}
                          </td>
                          <td class="whitespace-nowrap  py-2">
                            {details?.modification_amount}
                          </td>
                        </tr>
                      )}

                      {holdDetails?.coupon && (
                        <tr class="border border-DarkGrey ">
                          <td
                            class="whitespace-nowrap  py-2 pr-8 font-medium text-right"
                            colspan="5"
                          >
                            Coupon
                          </td>
                          <td class="whitespace-nowrap  py-2">
                            {holdDetails?.coupon}
                          </td>
                        </tr>
                      )}
                      <tr class="border border-DarkGrey ">
                        <td
                          class="whitespace-nowrap  py-2 pr-8 font-medium text-right"
                          colspan="5"
                        >
                          Total
                        </td>
                        <td class="whitespace-nowrap  py-2">
                          {holdDetails?.total || holdDetails?.order_total}
                        </td>
                      </tr>
                    </tfoot>
                  )} */}
                </table>
              </div>
              <div className="flex justify-between">
                {holdDetails?.hold_reason && (
                  <div class="text-dbase pt-2 ">
                    Reason {holdDetails?.hold_reason}
                  </div>
                )}
                <div></div>
                <div class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-dinputBorder pt-3">
                  {holdDetails && (
                    <button
                      className="bg-dblue text-white py-2 px-3 rounded ml-3"
                      onClick={() => sync("")}
                    >
                      sync
                    </button>
                  )}
                  <button
                    className="bg-dgreyRate p-2  rounded ml-3"
                    onClick={() => detailsShow("")}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
                    Today: [moment().startOf("day"), moment().endOf("day") + 1],

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
          onClick={(e) =>print(date.finalDate)}
        >
          Print
        </button>
      </div>

      <div class="flex w-full flex-col p-5">
        <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div class="overflow-hidden">
              <table class="min-w-full text-left  font-light stripe hover">
                <thead class="border-b font-medium border-DarkGrey">
                  <tr>
                    <th scope="col" class="px-6 py-4  w-1/12">
                      OrderID
                    </th>
                    <th scope="col" class="px-6 py-4 w-2/12">
                      customer name
                    </th>
                    <th scope="col" class="px-6 py-4 w-2/12">
                      telephone
                    </th>
                    <th scope="col" class="px-6 py-4">
                      sub total
                    </th>
                    <th scope="col" class="px-6 py-4">
                      discount
                    </th>
                    <th scope="col" class="px-6 py-4">
                      coupon
                    </th>
                    <th scope="col" class="px-6 py-4 w-1/12">
                      total
                    </th>
                    <th scope="col" class="px-6 py-4">
                      Order Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* <tr class="border-b border-DarkGrey">
                    <td class="whitespace-nowrap px-6 py-4 font-medium">
                      <input
                        className="w-full border border p-2 rounded border-DarkGrey"
                        onChange={(e) => filterID(e)}
                      />
                    </td>
                    <td class="whitespace-nowrap">
                      <input
                        className="w-full border border-DarkGrey p-2 rounded "
                        onChange={(e) => filterName(e)}
                      />
                    </td>
                    <td class="whitespace-nowrap px-6 py-4"></td>
                    <td class="whitespace-nowrap px-6 py-4"></td>
                  </tr> */}
                  {storedArray?.length > 0 &&
                    storedArray?.map(
                      (order) => (
                        // date === order.date_added && (
                        <tr class="border border-DarkGrey ">
                          <td class="whitespace-nowrap px-6 py-2 font-medium">
                            {order?.order_id}
                          </td>
                          <td class="whitespace-nowrap px-6 py-2 font-medium">
                            {order?.firstname + " "}{" "}
                            {order?.lastname !== "Local Customer" &&
                              order?.lastname}
                          </td>
                          <td class="whitespace-nowrap px-6 py-2 font-medium">
                            {order?.telephone}
                          </td>
                          <td class="whitespace-nowrap px-6 py-4">
                            {order?.totals?.map(
                              (item) => item?.code === "sub_total" && item?.text
                            )}
                          </td>

                          <td class="whitespace-nowrap px-6 py-4">
                            {order?.totals?.map(
                              (item) =>
                                item?.code === "modification" &&
                                item?.text + " (" + item.title + ")"
                            )}
                          </td>

                          <td class="whitespace-nowrap px-6 py-4">
                            {order?.totals?.map(
                              (item) => item?.code === "coupon" && item?.text
                            )}
                          </td>
                          <td class="whitespace-nowrap px-6 py-4">
                            {order?.totals?.map(
                              (item) => item?.code === "total" && item?.text
                            )}
                          </td>
                          <td class="whitespace-nowrap px-6 py-2 flex">
                            <button
                              class="bg-transparent hover:bg-dblue text-blue-700 font-semibold hover:text-white py-3 px-3 border border-blue-500 hover:border-transparent rounded-full"
                              onClick={() => detailsShow(order?.order_id)}
                            >
                              <FaEye />
                            </button>

                            <button
                              href={"/posprint/" + order?.order_id}
                              // target="_blank"
                              class="ml-2 bg-transparent hover:bg-dblue text-blue-700 font-semibold hover:text-white py-3 px-3 border border-blue-500 hover:border-transparent rounded-full"
                              onClick={() => handlePrint(order?.order_id)}
                            >
                              <AiOutlinePrinter />
                            </button>
                          </td>
                        </tr>
                      )
                      // )
                    )}

                  {holdArray?.length > 0 &&
                    holdArray?.map(
                      (order, key) => (
                        // date === order.date_added && (
                        <tr class="border border-DarkGrey bg-dmenusep bg-opacity-40 ">
                          <td class="whitespace-nowrap px-6 py-2 font-medium ">
                            hold
                          </td>
                          <td class="whitespace-nowrap px-6 py-2 font-medium">
                            {order?.firstname + " "}{" "}
                            {order?.lastname !== "Local Customer" &&
                              order?.lastname}
                          </td>
                          <td class="whitespace-nowrap px-6 py-2 font-medium">
                            {order?.telephone}
                          </td>
                          <td class="whitespace-nowrap px-6 py-4">
                            ${order.sub_total}
                          </td>

                          <td class="whitespace-nowrap px-6 py-4">
                            {order.modification  && order.modification +
                              "  (" +
                              order.modification_type +
                              ":" +
                              order.modification +
                              ")"}
                          </td>

                          <td class="whitespace-nowrap px-6 py-4">
                            {order.coupon  && "$"+ order.coupon }
                          </td>
                          <td class="whitespace-nowrap px-6 py-4">
                            ${order?.total || order?.order_total}
                          </td>
                          <td class="whitespace-nowrap px-6 py-2 flex">
                            <button
                              class="bg-transparent hover:bg-dblue text-blue-700 font-semibold hover:text-white py-3 px-3 border border-blue-500 hover:border-transparent rounded-full"
                              onClick={() => detailsHoldShow(key)}
                            >
                              <FaEye />
                            </button>

                            <button
                              href={"/posprinthold/" + key}
                              // target="_blank"
                              class="ml-2 bg-transparent hover:bg-dblue text-blue-700 font-semibold hover:text-white py-3 px-3 border border-blue-500 hover:border-transparent rounded-full"
                              onClick={() => handlePrintHolder(key)}
                            >
                              <AiOutlinePrinter />
                            </button>
                          </td>
                        </tr>
                      )
                      // )
                    )}
                </tbody>
              </table>
            </div>
          </div>

          <div className=" pr-7 fixed bottom-0 px-12 py-6 w-full  text-xxl font-semibold bg-white border-t border-DarkGrey">
            <div className="flex justify-between">
              <div className=""></div>
              <div className=""></div>
              <div className="">
                {" "}
                Total Hold ${totalsHold > 0 ? totalsHold : 0}
              </div>{" "}
              <div className=""> Total ${totals > 0 ? totals : 0}</div>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import _axios from "../../axios";
import SellerHeader from "@/components/seller/SellerHeader";
import useDeviceSize from "@/components/useDeviceSize";
import { BsEyeFill, BsPrinter } from "react-icons/bs";
import { VscSearch, VscClose } from "react-icons/vsc";
import { useSellerContext } from "../../contexts/SellerContext";
import Link from "next/link";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment";
import "bootstrap-daterangepicker/daterangepicker.css";
import { MdSelectAll } from "react-icons/md";
import Cookies from "js-cookie";

const OrdersSeller = () => {
  const { width } = useDeviceSize();
  const [data, setData] = useState();
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState();
  const [showMenu, setShowMenu] = useState(false);
  // const { toggle } = useSellerContext();
  const toggle= true
  const [totalValue, setTotalValue] = useState("");
  const router = useRouter();
  const [selected, setSelected] = useState([]);
  //var selected = [];
  const [status, setStatus] = useState(
    getDefault("filter_status") === "" ? "0" : getDefault("filter_status")
  );
  const [filterID, setFilterID] = useState(getDefault("filter_order_id"));
  const [productQuantity, setProductQuantity] = useState(
    getDefault("filter_product_quantity")
  );
  const [date, setDate] = useState(getDefault("filter_date"));

  const statusColor = {
    processing: "#5578eb",
    prepare: "#9816f4",
    ready: "green",
    given: "#ffb822",
    store: "#ffb822",
    complete: "rgb(29, 201, 183)",
    failed: "rgb(191, 27, 38)",
    cancel: "rgb(191, 27, 38)",
    trash: "rgb(191, 27, 38)",
    Awaitingfailed: "",
    paidtoseller: "",
    delayed: "rgb(191, 27, 38)",
  };

  const handleCallback = (start, end) => {
    const finalDate =
      start.year() +
      "-" +
      (start.month() + 1) +
      "-" +
      start.date() +
      " - " +
      end.year() +
      "-" +
      (end.month() + 1) +
      "-" +
      end.date();

    // alert(finalDate)

    // alert(start)
    // alert(end)
    setDate({ start, end, finalDate });
  };

  function getDefault(temp) {
    return JSON.parse(Cookies.get("seller_filter") ? Cookies.get("seller_filter") : 0) &&
      JSON.parse(Cookies.get("seller_filter"))[temp]
      ? JSON.parse(Cookies.get("seller_filter"))[temp]
      : "";
  }

  const label =  date === null || date === "" || date === undefined  ?
  "Select Date"
    : date?.start?.date() +
      "/" +
      (date?.start?.month() + 1) +
      "/" +
      date?.start?.year() +
      " - " +
      date?.end?.date() +
      "/" +
      (date?.end?.month() + 1) +
      "/" +
      date?.end?.year()


  useEffect(() => {
    setLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    const filter_status = status !== "0" ? `&filter_status=${status}` : "";
    const filter_order_id =
      filterID !== "" ? `&filter_order_id=${filterID}` : "";
    const filter_product_quantity =
      productQuantity !== ""
        ? `&filter_product_quantity=${productQuantity}`
        : "";
    const filter_date = date?.finalDate ? `&filter_date=${date.finalDate}` : "";
    const filter_total = totalValue !== "" ? `&filter_total=${totalValue}` : "";

    window.localStorage.setItem(
      "seller_filter",
      JSON.stringify({
        filter_status: status !== "0" ? status : "",
        filter_order_id: filterID !== "" ? filterID : "",
        filter_product_quantity: productQuantity !== "" ? productQuantity : "",
        filter_date: date?.finalDate ? date.finalDate : "",
      })
    );

    _axios
      .get(
        `https://www.ishtari.com/motor/v2/index.php?route=seller_report/orders&limit=${limit}&page=${currentPage}${filter_status}${filter_order_id}${filter_product_quantity}${filter_date}${filter_total}`
      )
      .then((response) => {
        setData(response.data.data);
        setTotal(response?.data?.data?.total);
        setLoading(false);
      });
  }, [limit, currentPage, status, search]);

  const resetFilter = () => {
    setLoading(true);
    setLimit(10);
    setCurrentPage(1);
    setStatus("0");
    setFilterID("");
    setProductQuantity("");
    setDate();
    setTotalValue("");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    _axios
      .get(
        `https://www.ishtari.com/motor/v2/index.php?route=seller_report/orders&limit=10&page=1`
      )
      .then((response) => {
        setData(response.data.data);
        setTotal(response.data.data.total);
        setLoading(false);
      });
  };

  const handleChangeDisplay = (event) => {
    setCurrentPage(1);
    setLimit(event.target.value);
  };

  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
    setCurrentPage(1);
  };

  function toggleMenuu() {
    setShowMenu(!showMenu);
  }

  function addSelected(order_id) {
    if (selected.includes(order_id)) {
      setSelected(selected.filter((sel) => sel !== order_id));
    } else {
      setSelected(selected.concat(order_id));
    }
  }

  function SelectAll() {
    const check_all = document.getElementById("check_all");
    const allOrders = [];
    // console.log(document.getElementById("check_all").checked);
     setSelected([]);
    if (!document.getElementById("check_all").checked) {
      data.orders.map((order) => {
        document.getElementById(order.order_id).checked = false;
      });
    } else {
      data.orders.map((order) => {
        allOrders.push(order.order_id);
        document.getElementById(order.order_id).checked = true;
      });
    }

    setSelected(allOrders);
    // console.log(selected);
  }

  return data ? (
    <div className="absolute top-0 left-0 right-0 w-full h-full bg-slate200">
      <div
        className={`flex-auto min-w-0 flexflex-col aside-animation ${
          toggle ? "pl-64" : width < 1025 ? "pl-0" : "pl-20"
        } max-w-full box-border`}
      >
        <SellerHeader showMenu={showMenu} toggleMenuu={toggleMenuu} />

        <div className="flex flex-col pt-0 pb-10  bg-slate200">
          <div className="px-3.5 flex items-center py-4">
            <p className="text-lg ml-3 ">Orders</p>
            <Link
              href={`/seller_report/home`}
              className={`pl-1 ml-3  text-dgrey1 hover:text-dblue`}
            >
              <AiOutlineHome />
            </Link>
            <span className="seller-dot  p-2"></span>
            <p className="text-dblue text-sm">Orders</p>
          </div>
          <div className="w-full px-6 box-border">
            <div className="box-border">
              <div className="transition-opacity block box-border">
                <div className="orders-table items-stretch justify-between relative  px-0 py-25 border-b-1 border-borderbottom bg-white">
                  <div className="border-b flex justify-between items-center border-dinputBorder p-4">
                    <span>Orders</span>{" "}
                    <div className="flex justify-center items-center">
                      {" "}
                      <Link
                        href={`/seller_report/printOrderInvoice?orders=${selected}`}
                        target="_blank"
                        className={`search_button text-xs mr-5 font-semibold text-white flex items-center justify-center
                        ${selected.length == 0 ? "pointer-events-none opacity-60" : ""}`}
                      >
                        <BsPrinter className="mr-1.5" />
                        PRINT INVOICES
                      </Link>{" "}
                      <span className=" text-xs mr-4 font-semibold text-dgrey1">
                        DISPLAY
                      </span>
                      <select
                        className="bg-white relative w-20 h-8 px-4 border text-sm font-semibold cursor-pointer rounded  "
                        value={limit}
                        onChange={handleChangeDisplay}
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                  </div>
                  <div
                    className={`flex ${
                      width < 1025 ? "flex-col" : "flex-row"
                    } w-full p-4 text-dbluegray`}
                  >
                    <div className="pr-2 mb-4 w-full">
                      <label className="block  mb-2 text-xs" for="orderId">
                        Order ID:
                      </label>
                      <input
                        className="form-control h-10 text-dbluegray text-xs"
                        id="orderId"
                        type="text"
                        value={filterID}
                        onChange={(e) => setFilterID(e.currentTarget.value)}
                      />
                    </div>
                    <div className="pr-2 mb-4 w-full">
                      <label className="block  text-xs mb-2" for="status">
                        Status:
                      </label>
                      <div className="flex justify-center items-center">
                        {" "}
                        <select
                          className="bg-white relative w-full h-10 px-4 border text-sm cursor-pointer text-dbluegray rounded  "
                          value={status}
                          onChange={handleChangeStatus}
                        >
                          <option value={"0"}>All</option>
                          {data.order_statuses.map((status) => {
                            return (
                              <option value={status.g_id}>
                                {status.g_name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="pr-2 mb-4 w-full">
                      <label className="block  text-xs mb-2" for="prod_qty">
                        Product Quantity:
                      </label>
                      <input
                        className="form-control h-10 text-dbluegray text-xs"
                        id="prod_qty"
                        type="text"
                        value={productQuantity}
                        onChange={(e) =>
                          setProductQuantity(e.currentTarget.value)
                        }
                      />
                    </div>
                    <div className="pr-2 mb-4 w-full">
                      <label className="block text-xs mb-2" for="date_added">
                        Date Added:
                      </label>
                      <div className="flex">
                        <DateRangePicker
                          initialSettings={{
                            ranges: {
                              Today: [
                                moment().startOf("day"),
                                moment().endOf("day"),
                              ],

                              Yesterday: [
                                moment().subtract(1, "days").toDate(),
                                moment().subtract(1, "days").toDate(),
                              ],
                              "Last 7 Days": [
                                moment().subtract(6, "days").toDate(),
                                moment().toDate(),
                              ],
                              "Last 30 Days": [
                                moment().subtract(29, "days").toDate(),
                                moment().toDate(),
                              ],
                              "This Month": [
                                moment().startOf("month").toDate(),
                                moment().endOf("month").toDate(),
                              ],
                              "Last Month": [
                                moment()
                                  .subtract(1, "month")
                                  .startOf("month")
                                  .toDate(),
                                   moment()
                                  .subtract(1, "month")
                                  .endOf("month")
                                  .toDate(),
                              ]
                            },
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
                              width: "100%",
                            }}
                          >
                            <i className="fa fa-calendar"></i>&nbsp;
                            <span>{label}</span>{" "}
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
                    <div className="pr-2 mb-4 w-full">
                      <label className="block  text-xs mb-2" for="total">
                        Total:
                      </label>
                      <input
                        className="form-control text-dbluegray h-10 text-xs"
                        id="total"
                        value={totalValue}
                        type="text"
                        onChange={(e) => {
                          setTotalValue(e.target.value);
                        }}
                      />
                    </div>
                    <div
                      className={`pr-2 mb-4 w-full pt-6 flex ${
                        width < 1025 ? "flex-col" : "flex-row"
                      } items-center justify-around`}
                    >
                      <button
                        className={`search_button ${
                          width < 1025 && "mb-4  w-full"
                        } flex justify-center items-center h-10 text-xs`}
                        onClick={() => setSearch(!search)}
                      >
                        <span className="">
                          <VscSearch />
                        </span>{" "}
                        <span className="pl-2"> Search</span>
                      </button>
                      <button
                        className={`reset_button ${
                          width < 1025 && "mb-4  w-full"
                        } flex justify-center items-center h-10 text-xs`}
                        onClick={() => {
                          resetFilter();
                        }}
                      >
                        <span className="">
                          <VscClose />
                        </span>{" "}
                        <span className="pl-2"> Reset</span>
                      </button>
                    </div>
                  </div>
                  <div className=" flex flex-col px-2 rounded box-border overflow-auto overflow-x-scroll ">
                    <div className="table-wrapper">
                      <div className="flex flex-wrap box-border pb-3">
                        {!loading ? (
                          <div className=" w-full relative pr-2  pl-2">
                            <table className=" dashboard-table ">
                              <thead className="box-border text-left text-xs">
                                <tr>
                                  <th>
                                    <input
                                      type="checkbox"
                                      name="all_orders"
                                      id="check_all"
                                      onClick={() => SelectAll()}
                                    />
                                  </th>
                                  <th>Order ID</th>
                                  <th>Status</th>
                                  <th>Product Quantity</th>
                                  <th>Date Added</th>
                                  <th>Total</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tfoot className="text-xs">
                                {" "}
                                <tr>
                                  <th></th>
                                  <th>Order ID</th>
                                  <th>Status</th>
                                  <th>Product Quantity</th>
                                  <th>Date Added</th>
                                  <th>Total</th>
                                  <th>Actions</th>
                                </tr>
                              </tfoot>
                              <tbody>
                                {data.orders.map((order) => {
                                  return (
                                    <tr className="text-d13">
                                      <td>
                                        <input
                                          type="checkbox"
                                          name="selected_order"
                                          id={order.order_id}
                                          onClick={() =>
                                            addSelected(order.order_id)
                                          }
                                        />
                                      </td>
                                      <td>{order.order_id}</td>
                                      <td>
                                        <span
                                          className="w-auto p-1 h-0 text-white rounded-2xl text-xs"
                                          style={{
                                            background:
                                              statusColor[order.status],
                                          }}
                                        >
                                          {order.status}
                                        </span>
                                      </td>
                                      <td>{order.product_quantity}</td>
                                      <td>{order.date_added}</td>
                                      <td>{order.op_total}</td>
                                      <td>
                                        <Link
                                          href={`/seller_report/orderDetails/${order.order_id}`}
                                          className={`w-full flex justify-center`}
                                        >
                                          <BsEyeFill
                                            className="w-4 h-4"
                                            style={{ color: "#93a2dd" }}
                                          />
                                        </Link>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="flex w-full justify-center items-center h-96 text-center">
                            {" "}
                            Loading...
                          </div>
                        )}
                        {/* PAGINATION LIMIT */}
                        {Number(total) !== 0 && (
                          <div className="p-6 flex justify-between items-center seller-pagination w-full">
                            {width > 650 && (
                              <div className="flex justify-start relative p-3 text-d13">
                                {data.pagination}
                                {/* Showing 1 to {data.orders.length} of {total} entries */}
                              </div>
                            )}
                            <ReactPaginate
                              pageCount={Math.ceil(total / limit)}
                              containerClassName={"seller-report-pagination"}
                              onPageChange={(page) =>
                                setCurrentPage(page.selected + 1)
                              }
                              pageRangeDisplayed={width > 680 ? 2 : 3}
                              marginPagesDisplayed={width > 680 ? 2 : 1}
                              previousLabel={"<"}
                              nextLabel={">"}
                              activeClassName={"active-pagination"}
                            ></ReactPaginate>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div></div>
  );
};
export default OrdersSeller;

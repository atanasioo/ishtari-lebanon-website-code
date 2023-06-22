import React, { useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import _axios from "../../axios";

import { BsEyeFill } from "react-icons/bs";
import { VscSearch, VscClose } from "react-icons/vsc";
import { useSellerContext } from "../../contexts/SellerContext";
import ReactPaginate from "react-paginate";
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment";
import useDeviceSize from "@/components/useDeviceSize";
import "bootstrap-daterangepicker/daterangepicker.css";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
const ReturnOrdersSeller = () => {
  const [data, setData] = useState();
  // const { toggle } = useSellerContext();
  const { width } = useDeviceSize();
const toggle = true
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState();
  const [showMenu, setShowMenu] = useState(false);
  const [totalValue, setTotalValue] = useState("");
  const [page, setPage] = useState(1);
  const [productQuantity, setProductQuantity] = useState(
    getDefault("filter_product_quantity")
  );
  const [status, setStatus] = useState(
    getDefault("filter_status") === "" ? "0" : getDefault("filter_status")
  );
  const [filterID, setFilterID] = useState(getDefault("filter_order_id"));
  const [filterReturnID, setFilterReturnID] = useState(
    getDefault("filter_return_order_id")
  );

  const filter_status = status !== "0" ? `&filter_status=${status}` : "";
  const filter_return_order_id =
    filterReturnID !== "" ? `&filter_return_order_id=${filterReturnID}` : "";
  const filter_order_id = filterID !== "" ? `&filter_order_id=${filterID}` : "";
  const filter_product_quantity =
    productQuantity !== "" ? `&filter_product_quantity=${productQuantity}` : "";

  const [date, setDate] = useState(getDefault("filter_date"));
  function getDefault(temp) {
    return JSON.parse(Cookies.get("seller_filter") ? Cookies.get("seller_filter") : 0) &&
      JSON.parse(Cookies.get("seller_filter"))[temp]
      ? JSON.parse(Cookies.get("seller_filter"))[temp]
      : "";
  }

  const filter_date = date?.finalDate ? `&filter_date=${date.finalDate}` : "";
  const filter_total = totalValue !== "" ? `&filter_total=${totalValue}` : "";
  const label =
    date === null || date === "" || date === undefined
      ? "Select Date"
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
        date?.end?.year();

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

    setDate({ start, end, finalDate });
  };
  const resetFilter = () => {
    setLoading(true);
    setLimit(10);
    setPage(1);
    setStatus("0");
    setFilterID("");
    setFilterReturnID("");
    setProductQuantity("");
    setDate();
    setTotalValue("");
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    _axios
    .get(
      `https://www.ishtari.com/motor/v2/index.php?route=seller_report/ReturnOrders&limit=10&page=1`
    )
    .then((response) => {
      setData(response.data.data);
      setTotal(response.data.data.total);
      setLoading(false);
    });
  };
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
    delayed: "rgb(191, 27, 38)"
  };
  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  useEffect(() => {
    _axios
      .get(
        `https://www.ishtari.com/motor/v2/index.php?route=seller_report/return_order&limit=${limit}&page=${page}${filter_date}${filter_total}${filter_status}${filter_order_id}${filter_product_quantity}${filter_return_order_id}`
      )
      .then((response) => {
        setData(response.data.data);
        setTotal(response?.data?.data?.total_item);
        setLoading(false);
      });
  }, [limit, page, search, status]);

  return (
    <div>
      <div className="absolute top-0 left-0 right-0 w-full h-full bg-slate200">
        <div
          className={`flex-auto min-w-0 flexflex-col aside-animation ${
            toggle ? "pl-64" : width < 1025 ? "pl-0" : "pl-20"
          } max-w-full box-border`}
        >
          <div className="px-3.5 flex items-center py-4 bg-white">
            <p className="text-lg ml-3 ">Home</p>
            <Link
              href={`/seller_report/home`}
              className={`pl-1 ml-3  text-dgrey1 hover:text-dblue`}
            >
              <AiOutlineHome />
            </Link>
            <span className="seller-dot  p-2"></span>
            <p className="text-dblue text-sm">Return Orders</p>
          </div>
          <div className="m-5 flex flex-col px-2 rounded box-border overflow-auto overflow-x-scroll  bg-white">
            <div
              className={`flex  ${
                width < 1025 ? "flex-col" : "flex-row"
              } w-full p-4 text-dbluegray`}
            >
              <div className="pr-2 mb-4 w-full">
                <label className="block  mb-2 text-xs" for="orderId">
                  Return Order ID:
                </label>
                <input
                  className="form-control h-10 text-dbluegray text-xs"
                  id="orderId"
                  type="text"
                  value={filterReturnID}
                  onChange={(e) => setFilterReturnID(e.currentTarget.value)}
                />
              </div>
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
                    {data?.order_statuses.map((status) => {
                      return (
                        <option value={status.g_id}>{status.g_name}</option>
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
                  onChange={(e) => setProductQuantity(e.currentTarget.value)}
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
                        Today: [moment().startOf("day"), moment().endOf("day")],

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
                          moment()
                            .subtract(1, "month")
                            .startOf("month")
                            .toDate(),
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
                      <span>{label}</span> <i className="fa fa-caret-down"></i>
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
            <div className="table-wrapper">
              <div className="flex flex-wrap box-border pb-3"></div>
              {/* {!loading ? ( */}
              <div className=" w-full relative pr-2  pl-2">
                <table className=" dashboard-table ">
                  <thead className="box-border text-left text-xs">
                    <tr>
                      <th>Return Order ID</th>
                      <th>Order ID</th>

                      <th>Status</th>
                      <th>Product Quantity</th>
                      <th>Date Added</th>
                      <th>Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  {/* <tfoot className="text-xs">
                                {" "}
                                <tr>
                                  <th>Order ID</th>
                                  <th>Status</th>
                                  <th>Product Quantity</th>
                                  <th>Date Added</th>
                                  <th>Total</th>
                                  <th>Actions</th>
                                </tr>
                              </tfoot> */}
                  <tbody>
                    {data?.return_order?.map((Rorder) => {
                      return (
                        <tr className="text-d13">
                          <td>{Rorder.return_order_id}</td>
                          <td>{Rorder.order_id}</td>

                          <td>
                            <span
                              className="w-auto p-1 h-0 text-white rounded-2xl text-xs"
                              style={{
                                background: statusColor[Rorder.status]
                              }}
                            >
                              {Rorder.status}
                            </span>
                          </td>
                          <td>{Rorder.product_quantity}</td>
                          <td>{Rorder.date_added}</td>
                          <td>{Rorder.total}</td>
                          <td>
                            <Link
                              href={`/seller_report/returnOrderDetails/${Rorder.return_order_id}`}
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
                {/* PAGINATION LIMIT */}
                {Number(total) !== 0 && (
                  <div className="p-6 flex justify-between items-center seller-pagination w-full">
                    {width > 650 && (
                      <div className="flex justify-start relative p-3 text-d13">
                        {data?.pagination}
                        {/* Showing 1 to {data.orders.length} of {total} entries */}
                      </div>
                    )}
                    <ReactPaginate
                      pageCount={Math.ceil(total / limit)}
                      containerClassName={"seller-report-pagination"}
                      onPageChange={(page) => setPage(page.selected + 1)}
                      pageRangeDisplayed={width > 680 ? 2 : 3}
                      marginPagesDisplayed={width > 680 ? 2 : 1}
                      previousLabel={"<"}
                      nextLabel={">"}
                      activeClassName={"active-pagination"}
                    ></ReactPaginate>
                  </div>
                )}
              </div>
            </div>{" "}
          </div>{" "}
        </div>
      </div>
    </div>
  );
};
export default ReturnOrdersSeller;

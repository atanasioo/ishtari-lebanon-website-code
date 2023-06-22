import React, { useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { axiosServer } from "@/axiosServer";
import SellerHeader from "@/components/seller/SellerHeader";
import useDeviceSize from "@/components/useDeviceSize";
import { BsEyeFill } from "react-icons/bs";
import { VscSearch, VscClose } from "react-icons/vsc";
import { useSellerContext } from "../../contexts/SellerContext";
import Link from "next/link";
import ReactPaginate from "react-paginate";
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment";
import "bootstrap-daterangepicker/daterangepicker.css";
import Cookies from "js-cookie";
const AccountingSeller = () => {
  const { width } = useDeviceSize();
  const [data, setData] = useState();
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState();
  const [showMenu, setShowMenu] = useState(false);
  const [type, setType] = useState(getDefault("filter_type"));
  // const { toggle } = useSellerContext();
  const [bank, setBank] = useState("");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [date, setDate] = useState();
  const [dueDate, setDueDate] = useState();
  const [method, setMethod] = useState("");
  const [balance, setBalance] = useState("");
  const toggle = true;
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

  const handleCallbackDueDate = (start, end) => {
    const dueDate =
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
    setDueDate({ start, end, dueDate });
  };

  function getDefault(temp) {
    return JSON.parse(
      Cookies.get("seller_filter") ? Cookies.get("seller_filter") : 0
    ) && JSON.parse(Cookies.get("seller_filter"))[temp]
      ? JSON.parse(Cookies.get("seller_filter"))[temp]
      : "";
  }

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

  const labelDueDate =
    dueDate === null || dueDate === "" || dueDate === undefined
      ? "Select Date"
      : dueDate?.start?.date() +
        "/" +
        (dueDate?.start?.month() + 1) +
        "/" +
        dueDate?.start?.year() +
        " - " +
        dueDate?.end?.date() +
        "/" +
        (dueDate?.end?.month() + 1) +
        "/" +
        dueDate?.end?.year();

  useEffect(() => {
    setLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    /// DUE DATE STILL NOT DONE
    const filter_bank = bank !== "" ? `&filter_bank=${bank}` : "";
    const filter_type = type !== "" ? `&filter_type=${type}` : "";
    const filter_method = method !== "" ? `&filter_method=${method}` : "";
    const filter_description =
      description !== "" ? `&filter_description=${description}` : "";
    const filter_reference =
      reference !== "" ? `&filter_reference=${reference}` : "";
    const filter_balance = balance !== "" ? `&filter_balance=${balance}` : "";
    const filter_date = date?.finalDate ? `&filter_date=${date.finalDate}` : "";
    const filter_due_date = dueDate?.dueDate
      ? `&filter_due_date=${dueDate.dueDate}`
      : "";

    window.localStorage.setItem(
      "seller_filter",
      JSON.stringify({
        filter_bank: bank !== "" ? bank : "",
        filter_type: type !== "" ? type : "",
        filter_method: method !== "" ? method : "",
        filter_description: description !== "" ? description : "",
        filter_reference: reference !== "" ? reference : "",
        filter_balance: balance !== "" ? balance : "",
        filter_date: date?.finalDate ? date.finalDate : "",
        filter_due_date: dueDate?.finalDate ? dueDate.finalDate : ""
      })
    );

    axiosServer
      .get(
        `https://www.ishtari.com/motor/v2/index.php?route=seller_report/accounting&limit=${limit}&page=${currentPage}${filter_description}${filter_reference}${filter_bank}${filter_type}${filter_method}${filter_balance}${filter_date}${filter_due_date}`
      )
      .then((response) => {
        setData(response.data.data);
        setTotal(response.data.data.totals);
        setLoading(false);
      });
  }, [limit, currentPage, type, method, bank, search]);

  const resetFilter = () => {
    setLoading(true);
    setLimit(10);
    setCurrentPage(1);
    setBank("");
    setType("");
    setDescription("");
    setReference("");
    setDate();
    setDueDate();
    setMethod("");
    setBalance("");
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    axiosServer
      .get(
        `https://www.ishtari.com/motor/v2/index.php?route=seller_report/accounting&limit=10&page=1`
      )
      .then((response) => {
        setData(response.data.data);
        setTotal(response.data.data.totals);
        setLoading(false);
      });
  };

  const handleChangeDisplay = (event) => {
    setCurrentPage(1);
    setLimit(event.target.value);
  };

  const handleChangeBank = (event) => {
    setBank(event.target.value);
    setCurrentPage(1);
  };

  const handleChangeType = (event) => {
    setType(event.target.value);
    setCurrentPage(1);
  };

  const handleChangeMethod = (event) => {
    setMethod(event.target.value);
    setCurrentPage(1);
  };

  function toggleMenuu() {
    setShowMenu(!showMenu);
  }

  return data ? (
    <div className="absolute top-0 left-0 right-0 w-full h-full bg-slate200 z-50">
      <div
        className={`flex-auto min-w-0 flexflex-col aside-animation ${
          toggle ? "pl-64" : width < 1025 ? "pl-0" : "pl-20"
        } max-w-full box-border`}
      >
        <SellerHeader showMenu={showMenu} toggleMenuu={toggleMenuu} />

        <div className="flex flex-col pt-0 pb-10  bg-slate200">
          <div className="px-3.5 flex items-center py-4">
            <p className="text-lg ml-3 ">{data.heading_title}</p>
            <Link
              href={`/seller_report/home`}
              className={`pl-1 ml-3  text-dgrey1 hover:text-dblue`}
            >
              <AiOutlineHome />
            </Link>
            <span className="seller-dot  p-2"></span>
            <p className="text-dblue text-sm">{data.heading_title}</p>
          </div>

          <div
            className={`flex ${
              width < 1025 ? "flex-col gap-2" : "flex-row"
            } flex-wrap w-full justify-between px-6 box-border mb-4 text-dblackk`}
          >
            <div
              className={`${
                width < 1025 ? "max-w-full" : "seller-accounting pr-2 "
              } w-full relative `}
            >
              <div className="  w-full h-52 rounded  bg-white">
                <div className="p-10 h-full flex flex-col justify-between">
                  <div className=" pt-2 flex flex-col justify-between items-center">
                    <div className=" font-thin text-xl">Statement Balance</div>
                    <span className="font-semibold text-2xl">
                      {data.statement_balance}
                    </span>
                  </div>
                  <div className=" flex flex-col justify-between h-8">
                    {" "}
                    <div className="w-full bg-dbase rounded-sm h-1"></div>
                    <div
                      className=" flex justify-between items-center text-d10 font-semibold"
                      style={{ color: "rgba(17, 17, 17, 0.5)" }}
                    >
                      <div>Statement Balance</div>
                      <span>{data.statement_balance}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`${
                width < 1025 ? "max-w-full" : "seller-accounting pl-2 "
              } w-full relative`}
            >
              {" "}
              <div className="  w-full h-52 rounded text-dblackk bg-white">
                <div className="p-10 h-full flex flex-col justify-between">
                  <div className=" pt-2 flex flex-col justify-between items-center">
                    <div className="font-thin text-xl">Stock Cost</div>
                    <span className="font-semibold text-2xl">
                      {data.stock_cost}
                    </span>
                  </div>
                  <div className=" flex flex-col justify-between h-8">
                    {" "}
                    <div className="w-full bg-dbase rounded-sm h-1"></div>
                    <div
                      className=" flex justify-between items-center text-d10 font-semibold"
                      style={{ color: "rgba(17, 17, 17, 0.5)" }}
                    >
                      <div>Stock Cost</div>
                      <span>{data.stock_cost}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`${
                width < 1025 ? "max-w-full" : "seller-accounting pl-2 "
              } w-full relative`}
            >
              {" "}
              <div className="  w-full h-52 rounded text-dblackk bg-white">
                <div className="p-10 h-full flex flex-col justify-between">
                  <div className=" pt-2 flex flex-col justify-between items-center">
                    <div className="font-thin text-xl">Total Credit</div>
                    <span className="font-semibold text-2xl">
                      {data.total_credit}
                    </span>
                  </div>
                  <div className=" flex flex-col justify-between h-8">
                    {" "}
                    <div className="w-full bg-dbase rounded-sm h-1"></div>
                    <div
                      className=" flex justify-between items-center text-d10 font-semibold"
                      style={{ color: "rgba(17, 17, 17, 0.5)" }}
                    >
                      <div>Total Credit</div>
                      <span>{data.total_credit}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`${
                width < 1025 ? "max-w-full" : "seller-accounting pl-2 "
              } w-full relative`}
            >
              {" "}
              <div className="  w-full h-52 rounded text-dblackk bg-white">
                <div className="p-10 h-full flex flex-col justify-between">
                  <div className=" pt-2 flex flex-col justify-between items-center">
                    <div className="font-thin text-xl">Total Debit</div>
                    <span className="font-semibold text-2xl">
                      {data.total_debit}
                    </span>
                  </div>
                  <div className=" flex flex-col justify-between h-8">
                    {" "}
                    <div className="w-full bg-dbase rounded-sm h-1"></div>
                    <div
                      className=" flex justify-between items-center text-d10 font-semibold"
                      style={{ color: "rgba(17, 17, 17, 0.5)" }}
                    >
                      <div>Total Debit</div>
                      <span>{data.total_debit}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full px-6 box-border">
            <div className="box-border">
              <div className="transition-opacity block box-border">
                <div className="orders-table items-stretch justify-between relative  px-0 py-25 border-b-1 border-borderbottom bg-white">
                  <div className="border-b flex justify-between items-center border-dinputBorder p-4">
                    <span>{data.heading_title}</span>{" "}
                    <div className="flex justify-center items-center">
                      {" "}
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
                  <div className=" flex flex-col ">
                    <div
                      className={`flex ${
                        width < 1025 ? "flex-col" : "flex-row"
                      } w-full p-4 text-dbluegray`}
                    >
                      <div className="pr-2 mb-4 w-full">
                        <label className="block text-xs mb-2" for="date_added">
                          Date:
                        </label>
                        <div className="flex">
                          <DateRangePicker
                            initialSettings={{
                              ranges: {
                                Today: [
                                  moment().startOf("day"),
                                  moment().endOf("day")
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
                                  moment()
                                    .subtract(1, "month")
                                    .startOf("month")
                                    .toDate(),
                                  moment()
                                    .subtract(1, "month")
                                    .endOf("month")
                                    .toDate()
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
                        <label className="block  mb-2 text-xs" for="orderId">
                          Description:
                        </label>
                        <input
                          className="form-control h-10 text-dbluegray text-xs"
                          id="orderId"
                          type="text"
                          value={description}
                          onChange={(e) =>
                            setDescription(e.currentTarget.value)
                          }
                        />
                      </div>
                      <div className="pr-2 mb-4 w-full">
                        <label className="block  mb-2 text-xs" for="orderId">
                          Reference:
                        </label>
                        <input
                          className="form-control h-10 text-dbluegray text-xs"
                          id="orderId"
                          type="text"
                          value={reference}
                          onChange={(e) => setReference(e.currentTarget.value)}
                        />
                      </div>
                      <div className="pr-2 mb-4 w-full">
                        <label className="block  mb-2 text-xs" for="orderId">
                          Balance:
                        </label>
                        <input
                          className="form-control h-10 text-dbluegray text-xs"
                          id="orderId"
                          type="text"
                          value={balance}
                          onChange={(e) => setBalance(e.currentTarget.value)}
                        />
                      </div>
                      <div className="pr-2 mb-4 w-full">
                        <label className="block text-xs mb-2" for="date_added">
                          Due Date:
                        </label>
                        <div className="flex">
                          <DateRangePicker
                            initialSettings={{
                              ranges: {
                                Today: [
                                  moment().startOf("day"),
                                  moment().endOf("day")
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
                                  moment()
                                    .subtract(1, "month")
                                    .startOf("month")
                                    .toDate(),
                                  moment()
                                    .subtract(1, "month")
                                    .endOf("month")
                                    .toDate()
                                ]
                              }
                            }}
                            onCallback={handleCallbackDueDate}
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
                              <span>{labelDueDate}</span>{" "}
                              <i className="fa fa-caret-down"></i>
                            </div>
                          </DateRangePicker>
                          <button
                            className="-ml-8 w-8"
                            style={{ borderLeft: "1px solid #e2e5ec" }}
                            onClick={() => {
                              setDueDate();
                            }}
                          >
                            X
                          </button>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`flex ${
                        width < 1025 ? "flex-col" : "flex-row"
                      } w-full px-4 text-dbluegray`}
                    >
                      <div className="pr-2 mb-4 w-full">
                        <label className="block  text-xs mb-2" for="bank">
                          Bank:
                        </label>
                        <div className="flex justify-center items-center">
                          {" "}
                          <select
                            className="bg-white relative w-full h-10 px-4 border text-sm cursor-pointer text-dbluegray rounded  "
                            value={bank}
                            onChange={handleChangeBank}
                          >
                            <option value={""}>All</option>
                            {data.acc_bank.map((bank) => {
                              return (
                                <option value={bank.id}>{bank.name}</option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="pr-2 mb-4 w-full">
                        <label className="block  text-xs mb-2" for="bank">
                          Type:
                        </label>
                        <div className="flex justify-center items-center">
                          {" "}
                          <select
                            className="bg-white relative w-full h-10 px-4 border text-sm cursor-pointer text-dbluegray rounded  "
                            value={type}
                            onChange={handleChangeType}
                          >
                            <option value={""}>All</option>
                            <option value={"Credit"}>Credit</option>
                            <option value={"Debit"}>Debit</option>
                          </select>
                        </div>
                      </div>

                      <div className="pr-2 mb-4 w-full">
                        <label className="block  text-xs mb-2" for="bank">
                          Payment Method:
                        </label>
                        <div className="flex justify-center items-center">
                          {" "}
                          <select
                            className="bg-white relative w-full h-10 px-4 border text-sm cursor-pointer text-dbluegray rounded  "
                            value={method}
                            onChange={handleChangeMethod}
                          >
                            <option value={""}>All</option>
                            {data.payment_method.map((method) => {
                              return (
                                <option value={method.name}>
                                  {method.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>

                      <div
                        className={` mb-4 w-full pt-6 flex ${
                          width < 1025 ? "flex-col" : "flex-row"
                        } items-center justify-around`}
                      >
                        <button
                          className={`search_button w-2/5 ${
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
                          className={`reset_button w-2/5 ${
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
                  </div>

                  <div className=" flex flex-col px-2 rounded box-border overflow-auto overflow-x-scroll ">
                    <div className="table-wrapper">
                      <div className="flex flex-wrap box-border pb-3">
                        {!loading ? (
                          <div className=" w-full relative pr-2  pl-2">
                            <table className=" dashboard-table ">
                              <thead className="box-border text-left text-xs">
                                <tr>
                                  <th>Date</th>
                                  <th>Description</th>
                                  <th>Reference</th>
                                  <th>Credit</th>
                                  <th>Debit</th>
                                  <th>Type</th>
                                  <th>Payment Method</th>
                                  <th>Bank</th>
                                  <th>Due Date</th>
                                  <th>Balance</th>
                                </tr>
                              </thead>
                              <tfoot className="text-xs">
                                {" "}
                                <tr>
                                  <th>Date</th>
                                  <th>Description</th>
                                  <th>Reference</th>
                                  <th>Credit</th>
                                  <th>Debit</th>
                                  <th>Type</th>
                                  <th>Payment Method</th>
                                  <th>Bank</th>
                                  <th>Due Date</th>
                                  <th>Balance</th>
                                </tr>
                              </tfoot>
                              <tbody>
                                {data.info.map((info) => {
                                  return (
                                    <tr className="text-d13">
                                      <td>{info.date}</td>
                                      <td>{info.description}</td>
                                      <td>{info.reference}</td>
                                      <td className="text-dgreen">
                                        {info.credit}
                                      </td>
                                      <td className="text-dbase">
                                        {info.debit}
                                      </td>
                                      <td>
                                        {info.type === "Debit" ? (
                                          <span className="w-auto px-2 py-1 h-0 text-white rounded-2xl bg-dbase text-xs">
                                            {info.type}
                                          </span>
                                        ) : (
                                          <span className="w-auto px-2 py-1 h-0 text-white bg-dsuccess rounded-2xl text-xs">
                                            {info.type}
                                          </span>
                                        )}
                                      </td>
                                      <td>{info.payment_method}</td>
                                      <td>{info.bank}</td>
                                      <td>{info.due_date}</td>
                                      <td>{info.balance}</td>
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
                              pageRangeDisplayed={width > 680 ? 8 : 3}
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
export default AccountingSeller;

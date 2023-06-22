import React, { useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import _axios from "../../axios";
import useDeviceSize from "@/components/useDeviceSize";
import SellerHeader from "@/components/seller/SellerHeader";
import { BsEyeFill } from "react-icons/bs";
import { VscSearch, VscClose } from "react-icons/vsc";
import { useSellerContext } from "../../contexts/SellerContext";
import ReactPaginate from "react-paginate";
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment";
import "bootstrap-daterangepicker/daterangepicker.css";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
const ReportsSeller = () => {
  const { width } = useDeviceSize();
  const [data, setData] = useState();
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState();
  const [productName, setName] = useState(getDefault("filter_name"));
  const [sku, setSku] = useState(getDefault("filter_sku"));
  const [cost, setCost] = useState(getDefault("filter_cost"));
  const [price, setPrice] = useState(getDefault("filter_price"));
  const [filterTotal, setFilterTotal] = useState(getDefault("filter_total"));
  const [status, setStatus] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  // const { toggle } = useSellerContext();
const toggle = true
const router = useRouter()

  const [date, setDate] = useState(getDefault("filter_date"));
  function getDefault(temp) {
    return JSON.parse(Cookies.get("seller_filter") ? Cookies.get("seller_filter") : 0) &&
      JSON.parse(Cookies.get("seller_filter"))[temp]
      ? JSON.parse(Cookies.get("seller_filter"))[temp]
      : "";
  }
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

  const label = date?.start?.day()
    ? date?.start?.date() +
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
    : "Select Date";

  useEffect(() => {
    setLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    const filter_name = productName !== "" ? `&filter_name=${productName}` : "";
    const filter_sku = sku !== "" ? `&filter_sku=${sku}` : "";
    const filter_cost = cost !== "" ? `&filter_cost=${cost}` : "";
    const filter_price = price !== "" ? `&filter_price=${price}` : "";
    const filter_total =
      filterTotal !== "" ? `&filter_total=${filterTotal}` : "";
    const filter_date = date?.finalDate ? `&filter_date=${date.finalDate}` : "";

    window.localStorage.setItem(
      "seller_filter",
      JSON.stringify({
        filter_name: productName !== "" ? productName : "",
        filter_sku: sku !== "" ? sku : "",
        filter_cost: cost !== "" ? cost : "",
        filter_price: price !== "" ? price : "",
        filter_total: filterTotal !== "" ? filterTotal : "",
        filter_date: date?.finalDate ? date.finalDate : "",
      })
    );

    _axios
      .get(
        `https://www.ishtari.com/motor/v2/index.php?route=seller_report/reports&limit=${limit}&page=${currentPage}${filter_name}${filter_sku}${filter_cost}${filter_price}${filter_total}${filter_date}`
      )
      .then((response) => {
        setData(response.data.data);
        setTotal(response.data.data.total);
        setLoading(false);
      });
  }, [limit, currentPage, search]);

  const resetFilter = () => {
    setLoading(true);
    setLimit(10);
    setCurrentPage(1);
    setDate();
    setName("");
    setSku("");
    setPrice("");
    setCost("");
    setFilterTotal("");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    _axios
      .get(
        `https://www.ishtari.com/motor/v2/index.php?route=seller_report/reports&limit=10&page=1`
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
            <p className="text-lg ml-3 ">Reports</p>
            <Link
              href={`/seller_report/home`}
              className={`pl-1 ml-3  text-dgrey1 hover:text-dblue`}
            >
              <AiOutlineHome />
            </Link>
            <span className="seller-dot  p-2"></span>
            <p className="text-dblue text-sm">Reports</p>
          </div>
          <div className="w-full px-6 box-border">
            <div className="box-border">
              <div className="transition-opacity block box-border">
                <div className="orders-table items-stretch justify-between relative  px-0 py-25 border-b-1 border-borderbottom bg-white">
                  <div className="border-b flex justify-between items-center border-dinputBorder p-4">
                    <span>Reports</span>{" "}
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
                  <div
                    className={`flex ${
                      width < 1025 ? "flex-col" : "flex-row"
                    } w-full p-4 text-dbluegray`}
                  >
                    <div className="pr-2 mb-4 w-full">
                      <label className="block  mb-2 text-xs" for="orderId">
                        Product Name:
                      </label>
                      <input
                        className="form-control h-10 text-dbluegray text-xs"
                        id="orderId"
                        type="text"
                        value={productName}
                        onChange={(e) => setName(e.currentTarget.value)}
                      />
                    </div>

                    <div className="pr-2 mb-4 w-full">
                      <label className="block  text-xs mb-2" for="prod_qty">
                        Sku:
                      </label>
                      <input
                        className="form-control h-10 text-dbluegray text-xs"
                        id="prod_qty"
                        type="text"
                        value={sku}
                        onChange={(e) => setSku(e.currentTarget.value)}
                      />
                    </div>

                    <div className="pr-2 mb-4 w-full">
                      <label className="block  text-xs mb-2" for="prod_qty">
                        Cost:
                      </label>
                      <input
                        className="form-control h-10 text-dbluegray text-xs"
                        id="prod_qty"
                        type="text"
                        value={cost}
                        onChange={(e) => setCost(e.currentTarget.value)}
                      />
                    </div>

                    <div className="pr-2 mb-4 w-full">
                      <label className="block  text-xs mb-2" for="prod_qty">
                        Price:
                      </label>
                      <input
                        className="form-control h-10 text-dbluegray text-xs"
                        id="prod_qty"
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.currentTarget.value)}
                      />
                    </div>
                    <div className="pr-2 mb-4 w-full">
                      <label className="block text-xs mb-2" for="date_added">
                        Date Added:
                      </label>

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
                            ],
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
                    </div>
                    <div className="pr-2 mb-4 w-full">
                      <label className="block  text-xs mb-2" for="total">
                        Total:
                      </label>
                      <input
                        className="form-control h-10 text-dbluegray text-xs"
                        id="total"
                        type="text"
                        value={filterTotal}
                        onChange={(e) => setFilterTotal(e.currentTarget.value)}
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
                              <thead className="box-border text-xs">
                                <tr>
                                  <th>Image</th>
                                  <th>Name</th>
                                  <th>Sku</th>
                                  <th> Cost</th>
                                  <th>Price</th>
                                  <th>AVG Sold Price</th>
                                  <th>Sold Quantity</th>
                                  <th>Total</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tfoot className="text-xs">
                                {" "}
                                <tr>
                                  <th>Image</th>
                                  <th>Name</th>
                                  <th>Sku</th>
                                  <th> Cost</th>
                                  <th>Price</th>
                                  <th>AVG Sold Price</th>
                                  <th>Sold Quantity</th>
                                  <th>Total</th>
                                  <th>Actions</th>
                                </tr>
                              </tfoot>
                              <tbody>
                                {data.products.map((product) => {
                                  return (
                                    <tr className="text-d13">
                                      <td>
                                        <img
                                          className="w-full"
                                          src={`${product.image}`}
                                        />
                                      </td>
                                      <td>{product.name}</td>
                                      <td>{product.sku}</td>
                                      <td>{product.cost}</td>
                                      <td>{product.price}</td>
                                      <td>{product.sold_price}</td>
                                      <td className="text-center">
                                        {product.sold_qunatity}
                                      </td>
                                      <td>{product.total}</td>
                                      <td>
                                        <Link
                                          href={`/seller_report/soldProductDetails/${product.product_id}`}
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
export default ReportsSeller;

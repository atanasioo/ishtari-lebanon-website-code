import React, { useEffect, useState } from "react";
import Link from "next/link";
import _axios from "../../axios";
import { BiEdit } from "react-icons/bi";
import { AiOutlineHome } from "react-icons/ai";
import useDeviceSize from "@/components/useDeviceSize";
import { useSellerContext } from "@/contexts/SellerContext";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { VscSearch, VscClose } from "react-icons/vsc";
import moment from "moment";
import ReactPaginate from "react-paginate";
import "bootstrap-daterangepicker/daterangepicker.css";
import XLSX from "sheetjs-style";
import SellerHeader from "@/components/seller/SellerHeader";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

function ProductsSeller() {
  const [data, setData] = useState();
  const { width } = useDeviceSize();
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState(false);
  const [total, setTotal] = useState();
  const [showMenu, setShowMenu] = useState(false);
  // const { toggle } = useSellerContext();
  const toggle = true
  const router = useRouter();
  const [model, setModel] = useState(getDefault("filter_modelP"));
  const [productName, setName] = useState(getDefault("filter_nameP"));
  const [sku, setSku] = useState(getDefault("filter_skuP"));
  const [cost, setCost] = useState(getDefault("filter_costP"));
  const [price, setPrice] = useState(getDefault("filter_priceP"));
  const [quantity, setQuantity] = useState(getDefault("filter_quantityP"));
  const [status, setStatus] = useState(getDefault("filter_statusP"));
  const [dateAdded, setDateAdded] = useState();
  const [dateModified, setDateModified] = useState();

  function getDefault(temp) {
    return JSON.parse(Cookies.get("seller_filter") ? Cookies.get("seller_filter") : 0) &&
      JSON.parse(Cookies.get("seller_filter"))[temp]
      ? JSON.parse(Cookies.get("seller_filter"))[temp]
      : "";
  }

  // function test(id) {
  //   _axios
  //     .get(
  //       `https://www.ishtari.com/motor/v2/index.php?route=seller_report/products/getForm&product_id=${id}`
  //     )
  //     .then((response) => {
  //       console.log(response.data);
  //     });
  // }

  useEffect(() => {
    setLoading(true);
    // window.scrollTo({
    //   top: 0,
    //   behavior: "smooth"
    // });

    const filter_name = productName !== "" ? `&filter_name=${productName}` : "";
    const filter_model = model !== "" ? `&filter_model=${model}` : "";
    const filter_sku = sku !== "" ? `&filter_sku=${sku}` : "";
    const filter_cost = cost !== "" ? `&filter_cost=${cost}` : "";
    const filter_price = price !== "" ? `&filter_price=${price}` : "";
    const filter_quantity =
      quantity !== "" ? `&filter_quantity=${quantity}` : "";
    const filter_status = status !== "" ? `&filter_status=${status}` : "";
    const filter_date_added = dateAdded?.DateAdded
      ? `&filter_date=${dateAdded.DateAdded}`
      : "";
    const filter_date_modified = dateModified?.DateModified
      ? `&filter_date_modified=${dateModified.DateModified}`
      : "";

    window.localStorage.setItem(
      "seller_filter",
      JSON.stringify({
        filter_nameP: productName !== "" ? productName : "",
        filter_skuP: sku !== "" ? sku : "",
        filter_costP: cost !== "" ? cost : "",
        filter_priceP: price !== "" ? price : "",
        filter_modelP: model !== "" ? model : "",
        filter_quantityP: quantity !== "" ? quantity : "",
        filter_statusP: status !== "" ? status : ""
      })
    );

    _axios
      .get(
        `https://www.ishtari.com/motor/v2/index.php?route=seller_report/products&limit=${limit}&page=${currentPage}${filter_name}${filter_model}${filter_sku}${filter_cost}${filter_price}${filter_quantity}${filter_status}${filter_date_added}${filter_date_modified}`
      )
      .then((response) => {
        setData(response.data.data);
        setTotal(response.data.data.total);
        setLoading(false);
      });
  }, [
    limit,
    currentPage,
    productName,
    model,
    sku,
    cost,
    price,
    quantity,
    status,
    search
  ]);

  const resetFilter = () => {
    setLoading(true);
    setLimit(10);
    setCurrentPage(1);
    setDateAdded();
    setDateModified();
    setName("");
    setSku("");
    setPrice("");
    setCost("");
    setStatus("");
    setModel("");
    setQuantity("");
    // window.scrollTo({
    //   top: 0,
    //   behavior: "smooth"
    // });
    _axios
      .get(
        `https://www.ishtari.com/motor/v2/index.php?route=seller_report/products&limit=10&page=1`
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

  const handleDateAdded = (start, end) => {
    const DateAdded =
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
    setDateAdded({ start, end, DateAdded });
  };

  const handleDateModified = (start, end) => {
    const DateModified =
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
    setDateModified({ start, end, DateModified });
  };

  const labelDateAdded =
    dateAdded === null || dateAdded === "" || dateAdded === undefined
      ? "Select Date"
      : dateAdded?.start?.date() +
        "/" +
        (dateAdded?.start?.month() + 1) +
        "/" +
        dateAdded?.start?.year() +
        " - " +
        dateAdded?.end?.date() +
        "/" +
        (dateAdded?.end?.month() + 1) +
        "/" +
        dateAdded?.end?.year();

  const labelDateModified =
    dateModified === null || dateModified === "" || dateModified === undefined
      ? "Select Date"
      : dateModified?.start?.date() +
        "/" +
        (dateModified?.start?.month() + 1) +
        "/" +
        dateModified?.start?.year() +
        " - " +
        dateModified?.end?.date() +
        "/" +
        (dateModified?.end?.month() + 1) +
        "/" +
        dateModified?.end?.year();

  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
    setCurrentPage(1);
  };

  function toggleMenuu() {
    setShowMenu(!showMenu);
  }

  function exportExcel() {
    setExportLoading(true);
    _axios
      .get(
        "https://www.ishtari.com/motor/v2/index.php?route=seller_report/products&export_all=1"
      )
      .then((response) => {
        exportToExcel(response.data);
      });
  }

  function exportToExcel(excelData) {
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "products.xlsx");
    setExportLoading(false);
  }

  return data ? (
    <div className="absolute top-0 left-0 right-0 w-full  bg-white z-50">
      <div
        className={`flex-auto min-w-0 flexflex-col aside-animation ${
          toggle ? "pl-64" : width < 1025 ? "pl-0" : "pl-20"
        } max-w-full box-border`}
      >
        <SellerHeader showMenu={showMenu} toggleMenuu={toggleMenuu} />

        <div className="flex flex-col pt-0 pb-10  bg-slate200">
          <div className="px-3.5 flex items-center py-4">
            <p className="text-lg ml-3 ">Products</p>
            <Link
              href={`/seller_report/home`}
              className={`pl-1 ml-3  text-dgrey1 hover:text-dblue`}
            >
              <AiOutlineHome />
            </Link>
            <span className="seller-dot  p-2"></span>
            <p className="text-dblue text-sm">Products</p>
          </div>
          <div className="w-full px-6 box-border">
            <div className="box-border">
              <div className="transition-opacity block box-border">
                <div className="orders-table items-stretch justify-between relative  px-0 py-25 border-b-1 border-borderbottom bg-white">
                  <div className="border-b flex justify-between items-center border-dinputBorder p-4">
                    <span>Products</span>{" "}
                    <div className="flex justify-center items-center">
                      {" "}
                      {exportLoading ? (
                        <span className="search_button text-xs mr-5">
                          LOADING...
                        </span>
                      ) : (
                        <span
                          className="search_button text-xs mr-5"
                          onClick={() => exportExcel()}
                        >
                          EXPORT
                        </span>
                      )}{" "}
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
                    } w-full px-4 pt-4 text-dbluegray`}
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
                        Model:
                      </label>
                      <input
                        className="form-control h-10 text-dbluegray text-xs"
                        id="prod_qty"
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.currentTarget.value)}
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
                  </div>
                  <div
                    className={`flex ${
                      width < 1025 ? "flex-col" : "flex-row"
                    } w-full p-4 text-dbluegray`}
                  >
                    <div className="pr-2 mb-4 w-full">
                      <label className="block  text-xs mb-2" for="bank">
                        Status :
                      </label>
                      <div className="flex justify-center items-center">
                        {" "}
                        <select
                          className="bg-white relative w-full h-10 px-4 border text-sm cursor-pointer text-dbluegray rounded  "
                          value={status}
                          onChange={handleChangeStatus}
                        >
                          <option value={""}>All</option>
                          <option value={"1"}>Enable</option>
                          <option value={"0"}>Disable</option>
                        </select>
                      </div>
                    </div>
                    <div className="pr-2 mb-4 w-full">
                      <label className="block  text-xs mb-2" for="prod_qty">
                        Quantity :
                      </label>
                      <input
                        className="form-control h-10 text-dbluegray text-xs"
                        id="prod_qty"
                        type="text"
                        value={quantity}
                        onChange={(e) => setQuantity(e.currentTarget.value)}
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
                          onCallback={handleDateAdded}
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
                            <span>{labelDateAdded}</span>{" "}
                            <i className="fa fa-caret-down"></i>
                          </div>
                        </DateRangePicker>
                        <button
                          className="-ml-8 w-8"
                          style={{ borderLeft: "1px solid #e2e5ec" }}
                          onClick={() => {
                            setDateAdded();
                          }}
                        >
                          X
                        </button>
                      </div>
                    </div>

                    <div className="pr-2 mb-4 w-full">
                      <label className="block text-xs mb-2" for="date_modified">
                        Date Modified:
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
                          onCallback={handleDateModified}
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
                            <span>{labelDateModified}</span>{" "}
                            <i className="fa fa-caret-down"></i>
                          </div>
                        </DateRangePicker>
                        <button
                          className="-ml-8 w-8"
                          style={{ borderLeft: "1px solid #e2e5ec" }}
                          onClick={() => {
                            setDateModified();
                          }}
                        >
                          X
                        </button>
                      </div>
                    </div>

                    <div
                      className={`pr-2 mb-4 w-full pt-6 flex ${
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
                                  <th>Model</th>
                                  <th>Sku</th>
                                  <th> Cost</th>
                                  <th>Price</th>
                                  <th>Quantity</th>
                                  <th>Status</th>
                                  <th>Date Added</th>
                                  <th>Date Modified</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tfoot className="text-xs">
                                {" "}
                                <tr>
                                  <th>Image</th>
                                  <th>Name</th>
                                  <th>Model</th>
                                  <th>Sku</th>
                                  <th> Cost</th>
                                  <th>Price</th>
                                  <th>Quantity</th>
                                  <th>Status</th>
                                  <th>Date Added</th>
                                  <th>Date Modified</th>
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
                                          alt="1"
                                        />
                                      </td>
                                      <td>{product.name}</td>
                                      <td>{product.model}</td>
                                      <td>{product.sku}</td>
                                      <td>{product.cost}</td>
                                      <td>{product.price}</td>
                                      <td className="text-center">
                                        {product.quantity}
                                      </td>
                                      <td>
                                        {product.Status === "0" ? (
                                          <span className="w-auto p-1 h-0 text-white rounded-2xl bg-dbase">
                                            Disabled
                                          </span>
                                        ) : (
                                          <span className="w-auto p-1 h-0 text-white bg-dgreen rounded-2xl text-xs">
                                            Enabled
                                          </span>
                                        )}
                                      </td>
                                      <td>{product.date_added}</td>
                                      <td>{product.date_modified}</td>
                                      <td>
                                        <Link
                                          href={`/seller_report/EditProduct/${product.product_id}`}
                                          className={`w-full flex justify-center`}
                                        >
                                          <BiEdit
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
                          <div className="p-6 flex  justify-between items-center seller-pagination w-full">
                            {width > 650 && (
                              <div className="flex justify-start relative p-3 text-d13">
                                {data.pagination}
                                {/* Showing 1 to {data.orders.length} of {total} entries */}
                              </div>
                            )}
                            <ReactPaginate
                            className="flex w-auto"
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
}

export default ProductsSeller;

import React, { useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { axiosServer } from "@/axiosServer";
import ReactPaginate from "react-paginate";
import SellerHeader from "@/components/seller/SellerHeader";
import useDeviceSize from "@/components/useDeviceSize";
import { useSellerContext } from "../../../contexts/SellerContext";
import { BsEyeFill } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/router";
import buildLink from "@/urls";

const OrderDetails = () => {
  const router = useRouter();
  const {id } = router.query
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState();
  const [status, setStatus] = useState("0");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMenu, setShowMenu] = useState(false);
  const [ width ] = useDeviceSize();
  const { toggle } = useSellerContext();
  useEffect(() => {
    setLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    axiosServer
      .get(
        buildLink("seller_order_info")
        + `&order_id=${id}&limit=${limit}&page=${currentPage}`
      )
      .then((response) => {
        setData(response.data.data);
        setTotal(response.data.data.total);
        setLoading(false);
      });
  }, [limit, currentPage]);

  function toggleMenuu() {
    setShowMenu(!showMenu);
  }

  const handleChangeDisplay = (event) => {
    setCurrentPage(1);
    setLimit(event.target.value);
  };

  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
    setCurrentPage(1);
  };

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
            <Link
              href={`/seller_report/orders`}
              className={`pl-1 ml-3  text-dgrey1 hover:text-dblue`}
            >
              <p className="text-sm">Orders</p>
            </Link>

            <span className="seller-dot  p-2"></span>
            <p className="text-dblue text-sm">Products</p>
          </div>
          <div className="w-full px-6 box-border">
            <div className="box-border">
              <div className="transition-opacity block box-border">
                <div className="orders-table items-stretch justify-between relative  px-0 py-25 border-b-1 border-borderbottom bg-white">
                  <div className="border-b flex justify-between items-center border-dinputBorder p-4">
                    <span>Orders</span>{" "}
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

                  <div className=" flex flex-col px-2 rounded box-border overflow-auto overflow-x-scroll ">
                    <div className="table-wrapper">
                      <div className="flex flex-wrap box-border pb-3">
                        {!loading ? (
                          <div className=" w-full relative pr-2  pl-2">
                            <table className=" dashboard-table ">
                              <thead className="box-border text-left text-xs">
                                <tr>
                                  <th>Image</th>
                                  <th>Product Name</th>
                                  <th>Sku</th>
                                  <th>Cost</th>
                                  <th>Price</th>
                                  <th>Sold Price</th>
                                  <th>Order Quantity</th>
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tfoot className="text-xs">
                                {" "}
                                <tr>
                                  <th>Image</th>
                                  <th>Product Name</th>
                                  <th>Sku</th>
                                  <th>Cost</th>
                                  <th>Price</th>
                                  <th>Sold Price</th>
                                  <th>Order Quantity</th>
                                  <th>Total</th>
                                </tr>
                              </tfoot>
                              <tbody>
                                {data.products.map((order) => {
                                  return (
                                    <tr className="text-d13">
                                      <td>
                                        <img alt="1"
                                          src={`${order.image}`}
                                        />
                                      </td>
                                      <td>{order.name}</td>
                                      <td>{order.sku}</td>
                                      <td>{order.cost}</td>
                                      <td>{order.price}</td>
                                      <td>{order.sold_price}</td>
                                      <td className="text-center">{order.quantity}</td>
                                      <td>{order.total}</td>
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
                        <div className="p-6 flex justify-between items-center seller-pagination w-full">
                          <div className="flex justify-start relative p-3 text-d13">
                            {data.pagination}
                            {/* Showing 1 to {data.orders.length} of {total} entries */}
                          </div>
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
export default OrderDetails;

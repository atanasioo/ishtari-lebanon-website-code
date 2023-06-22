import React, { useEffect, useState } from "react";
import {
  AiOutlineShoppingCart,
  AiOutlineDashboard,
  AiOutlineInbox,
  AiOutlineMail,
  AiOutlineShopping,
  AiOutlineRight,
} from "react-icons/ai";
import _axios from "../../axios";
import { GiChart } from "react-icons/gi";
import { HiOutlinePresentationChartLine } from "react-icons/hi";
import useDeviceSize from "@/components/useDeviceSize";
import { BiEdit } from "react-icons/bi";
import { useSellerContext } from "../../contexts/SellerContext";
import Link from "next/link";
import SellerHeader from "@/components/seller/SellerHeader";

const DashboardSeller = () => {
  const { width } = useDeviceSize();
  const [data, setData] = useState();
  const [showMenu, setShowMenu] = useState(false);
  const toggle = true;
  // const { toggle } = useSellerContext();
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

  useEffect(() => {
    _axios
      .get(
        "https://www.ishtari.com/motor/v2/index.php?route=seller_report/home"
      )
      .then((response) => {
        setData(response.data.data);
      });
  }, []);

  function toggleMenuu() {
    setShowMenu(!showMenu);
  }

  return data ? (
    <div className="absolute top-0 left-0 right-0 w-full h-full bg-slate200">
      <div
        className={`flex-auto min-w-0 flex flex-col aside-animation ${
          toggle ? "pl-64" : width < 1025 ? "pl-0" : "pl-20"
        } max-w-full box-border`}
      >
        <SellerHeader
          image={data.seller_image}
          sellerName={data.seller_name.split(" ")[0]}
          showMenu={showMenu}
          toggleMenuu={toggleMenuu}
        />

        <div className="flex flex-col pt-0 pb-6 bg-slate200">
          <div className=" flex items-center py-4 px-3.5">
            <p className="text-d22 ml-3">Dashboard</p>
            <span className="p-2">
              <AiOutlineRight />
            </span>
            <p className="text-dblue ">Dashboard</p>
          </div>
          <div className="w-full pr-6 pl-6 box-border">
            <div
              className={`flex ${
                width < 1025 ? "flex-col" : "flex-row"
              } rounded bg-white py-6 px-4 mb-4`}
            >
              <div
                className={`flex items-center ${
                  width > 1025 ? "border-r" : "border-b pb-6"
                }  border-dinputBorder flex-1 mr-4`}
              >
                <img
                  src={data.seller_image}
                  alt=""
                  className="rounded-full w-20 h-20"
                />
                <div className="flex flex-col justify-start ml-6">
                  <p className="font-bold text-lg">{data.seller_name}</p>
                  <p className="text-dgrey1 text-xs">{data.seller_name}</p>
                  <Link href={`/seller_report/edit`} className="text-dbluedark">
                    {" "}
                    <BiEdit />
                  </Link>
                </div>
              </div>
              <div
                className={`flex text-dgrey1 items-center ${
                  width > 1025 ? "border-r" : "border-b"
                } border-dinputBorder flex-1 mr-4`}
              >
                <div className="flex flex-col">
                  <div className="flex p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 1219.547 1225.016"
                    >
                      <path
                        fill="#E0E0E0"
                        d="M1041.858 178.02C927.206 63.289 774.753.07 612.325 0 277.617 0 5.232 272.298 5.098 606.991c-.039 106.986 27.915 211.42 81.048 303.476L0 1225.016l321.898-84.406c88.689 48.368 188.547 73.855 290.166 73.896h.258.003c334.654 0 607.08-272.346 607.222-607.023.056-162.208-63.052-314.724-177.689-429.463zm-429.533 933.963h-.197c-90.578-.048-179.402-24.366-256.878-70.339l-18.438-10.93-191.021 50.083 51-186.176-12.013-19.087c-50.525-80.336-77.198-173.175-77.16-268.504.111-278.186 226.507-504.503 504.898-504.503 134.812.056 261.519 52.604 356.814 147.965 95.289 95.36 147.728 222.128 147.688 356.948-.118 278.195-226.522 504.543-504.693 504.543z"
                      />
                      <linearGradient
                        id="a"
                        x1="609.77"
                        x2="609.77"
                        y1="1190.114"
                        y2="21.084"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0" stop-color="#20b038" />
                        <stop offset="1" stop-color="#60d66a" />
                      </linearGradient>
                      <path
                        fill="url(#a)"
                        d="M27.875 1190.114l82.211-300.18c-50.719-87.852-77.391-187.523-77.359-289.602.133-319.398 260.078-579.25 579.469-579.25 155.016.07 300.508 60.398 409.898 169.891 109.414 109.492 169.633 255.031 169.57 409.812-.133 319.406-260.094 579.281-579.445 579.281-.023 0 .016 0 0 0h-.258c-96.977-.031-192.266-24.375-276.898-70.5l-307.188 80.548z"
                      />
                      <path
                        fill="#FFF"
                        fill-rule="evenodd"
                        d="M462.273 349.294c-11.234-24.977-23.062-25.477-33.75-25.914-8.742-.375-18.75-.352-28.742-.352-10 0-26.25 3.758-39.992 18.766-13.75 15.008-52.5 51.289-52.5 125.078 0 73.797 53.75 145.102 61.242 155.117 7.5 10 103.758 166.266 256.203 226.383 126.695 49.961 152.477 40.023 179.977 37.523s88.734-36.273 101.234-71.297c12.5-35.016 12.5-65.031 8.75-71.305-3.75-6.25-13.75-10-28.75-17.5s-88.734-43.789-102.484-48.789-23.75-7.5-33.75 7.516c-10 15-38.727 48.773-47.477 58.773-8.75 10.023-17.5 11.273-32.5 3.773-15-7.523-63.305-23.344-120.609-74.438-44.586-39.75-74.688-88.844-83.438-103.859-8.75-15-.938-23.125 6.586-30.602 6.734-6.719 15-17.508 22.5-26.266 7.484-8.758 9.984-15.008 14.984-25.008 5-10.016 2.5-18.773-1.25-26.273s-32.898-81.67-46.234-111.326z"
                        clip-rule="evenodd"
                      />
                      <path
                        fill="#FFF"
                        d="M1036.898 176.091C923.562 62.677 772.859.185 612.297.114 281.43.114 12.172 269.286 12.039 600.137 12 705.896 39.633 809.13 92.156 900.13L7 1211.067l318.203-83.438c87.672 47.812 186.383 73.008 286.836 73.047h.255.003c330.812 0 600.109-269.219 600.25-600.055.055-160.343-62.328-311.108-175.649-424.53zm-424.601 923.242h-.195c-89.539-.047-177.344-24.086-253.93-69.531l-18.227-10.805-188.828 49.508 50.414-184.039-11.875-18.867c-49.945-79.414-76.312-171.188-76.273-265.422.109-274.992 223.906-498.711 499.102-498.711 133.266.055 258.516 52 352.719 146.266 94.195 94.266 146.031 219.578 145.992 352.852-.118 274.999-223.923 498.749-498.899 498.749z"
                      />
                    </svg>
                    <p className="ml-4 flex justify-center items-center text-xs">
                      {data.seller_telephone}
                    </p>
                  </div>
                  <div className="flex p-2">
                    <span className="text-d15 w-6 h-6 flex justify-center items-center text-dhotPink">
                      <AiOutlineMail />
                    </span>
                    <p className="ml-4 flex justify-center items-center text-xs">
                      {data.seller_email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center pt-8 flex-1 mr-4 text-dgrey1">
                <div className="text-center ml-2 bg-dgrey pt-3 pb-3 pr-4 pl-4 rounded">
                  <p className="font-semibold text-dblue">
                    {data.total_orders}
                  </p>
                  <p className="text-xs">Orders</p>
                </div>
                <div className="text-center ml-2 bg-dgrey pt-3 pb-3 pr-4 pl-4 rounded">
                  <p className="font-semibold text-dblue">
                    {data.total_products}
                  </p>
                  <p className="text-xs">All Products</p>
                </div>
              </div>
            </div>

            <div className="box-border">
              <div className="transition-opacity block box-border">
                <div
                  className={`flex flex-wrap ${
                    width < 1400 ? "flex-col" : "flex-row"
                  } box-border justify-between`}
                >
                  <div
                    className={`order-status ${
                      width < 1400 ? "w-full max-w-full" : ""
                    } rounded bg-white relative`}
                  >
                    <div className="border-b border-dinputBorder p-4">
                      <p>Order Status</p>
                    </div>
                    {data.order_status_group &&
                      data.order_status_group.map((status) => (
                        <div className="p-4">
                          <div className="flex justify-between">
                            <p>{status.name}</p>
                            <p>
                              {status.nbOfOrder}{" "}
                              <span className="text-dgrey1">/ {data.total_orders}</span>
                            </p>
                          </div>
                          <div className="w-full bg-dinputBorder rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full `}
                              style={{
                                width: status.progressbar_width + "%",
                                background: statusColor[status.name],
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div
                    className={`order-table bg-white ${
                      width < 1400 ? "w-full min-w-full mt-3" : ""
                    } relative rounded`}
                  >
                    <div className="flex flex-col ">
                      <div className=" flex items-stretch justify-between pr-6 pl-6 relative table-header">
                        <div className=" flex items-center">
                          <AiOutlineShoppingCart />
                          <h3 className="ml-4 p-0 font-medium text-xl">
                            Latest {data.orders.length} Orders
                          </h3>
                        </div>
                      </div>{" "}
                      <div className=" flex flex-col p-6 rounded box-border overflow-auto overflow-x-scroll ">
                        <div className="table-wrapper">
                          <div className="flex flex-wrap box-border">
                            <div className=" w-full relative pr-2 pl-2">
                              <table className=" dashboard-table ">
                                <thead className="box-border text-left">
                                  <tr>
                                    <th>Order ID</th>
                                    <th>Status</th>
                                    <th>Date Added</th>
                                    <th>Total</th>
                                  </tr>
                                </thead>
                                <tfoot className="text-xs">
                                  {" "}
                                  <tr>
                                    <th>Order ID</th>
                                    <th>Status</th>
                                    <th>Date Added</th>
                                    <th>Total</th>
                                  </tr>
                                </tfoot>
                                <tbody>
                                  {data.orders.map((order) => {
                                    return (
                                      <tr className="text-d13">
                                        <td>{order.order_id}</td>
                                        <td>
                                          {order.status === "trash" ? (
                                            <span className="w-auto p-1 h-0 rounded-2xl bg-dtrash">
                                              {order.status}
                                            </span>
                                          ) : (
                                            <span
                                              className={`w-auto p-1 h-0 text-white rounded-2xl text-xs`}
                                              style={{
                                                background:
                                                  statusColor[order.status] !==
                                                  ""
                                                    ? statusColor[order.status]
                                                    : "rgb(191, 27, 38)",
                                              }}
                                            >
                                              {order.status}
                                            </span>
                                          )}
                                        </td>
                                        <td>{order.date_added}</td>
                                        <td>{order.total}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="flex justify-start relative pr-3 pl-3 text-d13">
                            {" "}
                            Showing 1 to {data.orders.length} of{" "}
                            {data.total_orders} entries
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
    </div>
  ) : (
    <div></div>
  );
};

export default DashboardSeller;

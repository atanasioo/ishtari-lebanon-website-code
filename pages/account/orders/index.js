import { axiosServer } from "@/axiosServer";
import UserSidebar from "@/components/account/UserSidebar";
import UserSidebarMobile from "@/components/account/UserSidebarMobile";
import useDeviceSize from "@/components/useDeviceSize";
import { AccountContext } from "@/contexts/AccountContext";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import buildLink from "@/urls";
import Cookies from "js-cookie";
import { getServerSession } from "next-auth";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import cookie from "cookie";
import { getHost } from "@/functions";
import orders from "@/pages/posSystem/orders";
import { useMessage } from "@/contexts/MessageContext";

function Orders() {
  const [width, height] = useDeviceSize();
  const [data, setData] = useState("");
  const [loading, setLoading] = useState("");
  const [state, dispatch] = useContext(AccountContext);
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const path = "";
  const { setGlobalMessage, setSuccessMessage, setErrorMessage } = useMessage();

  function reOrder(order_id) {
    let obj = {
      order_id,
      source:'website'
    };
    // console.log(obj);
    axiosServer.post(buildLink("reorder"), obj).then((response) => {
      if (response.data.success) {
        setSuccessMessage(true);
        setGlobalMessage(response.data.message);
        router.push(`${path}/cart`);
      } else {
        setErrorMessage(true);
        setGlobalMessage(response.data.message);
      }
    });
  }

  useEffect(() => {
    if (!state.loading && !state.loged) {
      router.push("/");
    } else if (state.loged) {
      setLoading(true);
      axiosServer
        .get(buildLink("orders", undefined, window.innerWidth))
        .then((response) => {
          if (response.data.success) {
            setData(response.data.data);
            setLoading(false);
          } else {
            setLoading(false);
            dispatch({ type: "setLoading", payload: false });
          }
        });
    }
  }, [state.loading, success]);

  function cancelOrder(id) {
    setLoading(true);

    axiosServer
      .get(
        buildLink("cancelOrder", undefined, undefined, window.location.host) +
          id
      )
      .then((resp) => {
        // console.log(resp);
        if (resp.data.succes) {
          setSuccess(true);
          setLoading(false);
        }
      });
  }

  return (
    <div className="container text-dblack">
      <Head>
        <title>My Account | ishtari</title>
      </Head>
      <div>
        <div className="flex-row md:flex">
          <div className="w-full mb-3 md:w-1/5">
            {width > 650 ? (
              <UserSidebar active={"orders"} />
            ) : (
              <UserSidebarMobile active={"orders"} />
            )}
          </div>
          <div className="w-full md:w-4/5 px-2 md:px-0 md:pl-8 mb-5">
            {/* Header */}
            <div className="flex items-center mb-8 mt-4">
              <div>
                <p className="text-lg font-semibold">Orders</p>
                <p className=" font-light">Manage your Order details</p>
              </div>
            </div>
            {data?.orders?.length !== 0 &&
              data?.orders?.map((data) => (
                <div
                  className="bg-white rounded-md shadow-lg  pb-5"
                  key={data.order_id}
                >
                  <div className="md:mt-5  md:pb-5">
                    <div className="flex flex-col justify-start items-center text-dblue sm:flex-row cart-header text-center sm:text-dblack">
                      <div
                        className={` w-8/12 ${
                          width > 650 ? "text-left" : "text-center"
                        }`}
                      >
                        {" "}
                        #{data.order_id} - {data?.status}{" "}
                      </div>

                      {(Cookies.get("site-local-name") === "ishtari" ||
                        window.location.host === "www.ishtari.com") &&
                      data?.status === "Complete 2021" ? (
                        <div className="my-2 text-right justify-end">
                          <Link
                            className="flex"
                            href={`${path}/account/order-reviews/${data.order_id}`}
                            key={data.order_id}
                          >
                            <svg
                              width="15"
                              height="15"
                              fill="currentColor"
                              className="mt-1"
                              viewBox="0 0 16 16"
                            >
                              {" "}
                              <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />{" "}
                            </svg>
                            <span className=" mx-2 whitespace-nowrap hover:text-dbase">
                              {" "}
                              Write a review
                            </span>
                          </Link>
                        </div>
                      ) : (
                        <div></div>
                      )}

                      <div className="mx-4 text-right justify-end ">
                        <Link
                          className="flex mx-4"
                          href={`${path}/account/orders/${data.order_id}`}
                          key={data.order_id}
                        >
                          {/* <span className="text-dblue">&#x1f441;</span> */}
                          <span>
                            <svg
                              width="19"
                              height="18"
                              viewBox="0 0 24 24"
                              className="mt-1"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              {" "}
                              <path
                                d="M21.2572 10.9622C21.7314 11.5813 21.7314 12.4187 21.2572 13.0378C19.764 14.9868 16.1818 19 12 19C7.81823 19 4.23598 14.9868 2.74284 13.0378C2.26857 12.4187 2.26856 11.5813 2.74283 10.9622C4.23598 9.01321 7.81823 5 12 5C16.1818 5 19.764 9.01321 21.2572 10.9622Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>{" "}
                              <circle
                                cx="12"
                                cy="12"
                                r="3"
                                stroke="black"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></circle>{" "}
                            </svg>
                          </span>

                          <span className="mx-1 whitespace-nowrap hover:text-dbase">
                            {" "}
                            Order details
                          </span>
                        </Link>
                      </div>
                      <div className="flex items-center hover:text-dbase">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            version="1.1"
                            id="Layer_1"
                            x="0px"
                            y="0px"
                            width="19"
                            height="18"
                            viewBox="0 0 122.879 101.794"
                            xmlSpace="preserve"
                            className="mr-2"
                          >
                            <path
                            fill={width > 650 ?"" : "#4169E1"}
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M16.253,48.033c-1.306-19.004,1.611-30.676,22.395-30.676h3.042l0.006-5.797 c0-2.894,0.682-3.391,2.764-1.412l11.28,10.72c1.359,1.292,1.172,2.133-0.129,3.38L44.473,34.921 c-1.945,1.968-2.822,1.413-2.784-1.302v-6.811c-18.682-1.177-15.875,10.173-15.875,21.225H16.253L16.253,48.033z M75.473,0h41.531 c1.619,0,3.09,0.66,4.152,1.723c1.064,1.063,1.723,2.534,1.723,4.152v32.291c0,1.62-0.66,3.089-1.723,4.152 c-0.117,0.117-0.24,0.226-0.369,0.326c-1.023,0.87-2.346,1.397-3.783,1.397H75.473c-1.619,0-3.09-0.66-4.152-1.723 c-0.123-0.124-0.236-0.253-0.34-0.389c-0.863-1.026-1.383-2.34-1.383-3.764V5.875c0-1.619,0.66-3.09,1.723-4.152 C72.383,0.66,73.854,0,75.473,0L75.473,0z M115.006,7.874H77.471v28.294h37.535V7.874L115.006,7.874z M5.875,57.753h41.532 c1.62,0,3.089,0.659,4.152,1.723c1.063,1.063,1.723,2.533,1.723,4.152v32.291c0,1.619-0.661,3.09-1.724,4.152 s-2.532,1.723-4.152,1.723H5.875c-1.618,0-3.089-0.659-4.152-1.723C0.66,99.009,0,97.538,0,95.919V63.628 c0-1.619,0.66-3.089,1.723-4.152C2.786,58.413,4.257,57.753,5.875,57.753L5.875,57.753z M45.409,65.626H7.874v28.295h37.536V65.626 L45.409,65.626z M100.766,55.864c1.305,19.005-1.611,30.677-22.395,30.677h-3.043l-0.006,5.797c0,2.894-0.68,3.392-2.764,1.412 L61.279,83.03c-1.359-1.292-1.172-2.134,0.129-3.381l11.136-10.672c1.945-1.969,2.822-1.414,2.783,1.301v6.811 c18.682,1.177,15.875-10.173,15.875-21.225H100.766L100.766,55.864z"
                            />
                          </svg>

                        <button
                          onClick={() => reOrder(data.order_id)}
                          className="text-blue-500"
                        >
                          <span className="w-full"> ReOrder</span>
                        </button>
                      </div>

                      {/* {!data?.eligible_to_cancel && (
                        <div
                          className="flex mx-4 text-right justify-end bg-dbase text-white p-2 rounded-full font-bold cursor-pointer"
                          onClick={(e) => cancelOrder(data.order_id)}
                        >

                          <span className="mx-1 whitespace-nowrap space-x-2">
                            {" "}
                            Cancel Order
                          </span>
                        </div>
                      )} */}
                    </div>

                    <div className="cart-body">
                      <div className="flex md:px-2 py-1 justify-between items-center mt-4 md:ml-5 bg-white">
                        <div className="focus:text-dblue flex-row  items-center space-y-4  border-dblue">
                          <p className="flex space-x-1 text-sm">
                            <span>Name:</span> <span>{data.name}</span>
                          </p>
                          <p className="flex space-x-1 text-sm">
                            <span className=" text-d12 md:text-base ">
                              Number of products:
                            </span>{" "}
                            <span className="font-semibold text-d13">
                              {" "}
                              {" " + data.products}
                            </span>
                          </p>
                        </div>
                        <div className="flex-row items-center space-y-4 md:mr-5 ">
                          <p className="text-sm flex space-x-1">
                            <span className="hidden  md:block">
                              Date Added:
                            </span>{" "}
                            <span className="font-semibold text-dgrey1 md:text-dblack">
                              {data.date_added}
                            </span>
                          </p>
                          <p className=" text-sm space-x-1">
                            <span>Total:</span>
                            <span className="font-semibold text-d13">
                              {data.total}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;

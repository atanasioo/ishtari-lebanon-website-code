import { axiosServer } from "@/axiosServer";
import UserSidebar from "@/components/account/UserSidebar";
import UserSidebarMobile from "@/components/account/UserSidebarMobile";
import useDeviceSize from "@/components/useDeviceSize";
import { AccountContext } from "@/contexts/AccountContext";
import buildLink from "@/urls";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

function Orders() {
  const [width, height] = useDeviceSize();
  const [data, setData] = useState("");
  const [loading, setLoading] = useState("");
  const [state, dispatch] = useContext(AccountContext);
  const router = useRouter();
  const path = "";

  useEffect(() => {
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
          if (!state.loading && !state.loged) {
            router.push("/");
          }
        }
      });
  }, []);

  return (
    <div className="container text-dblack">
      <div>
        <div className="flex-row md:flex">
          <div className="w-full mb-3 md:w-1/5">
            {width > 650 ? (
              <UserSidebar active={"addresses"} />
            ) : (
              <UserSidebarMobile active={"addresses"} />
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
                <div className="bg-white rounded-md shadow-lg  pb-5">
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
                            href={{
                              pathname: `${path}/account/order-reviews`,
                              state: {
                                id: data.order_id,
                              },
                            }}
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
                            <span className=" mx-2 whitespace-nowrap">
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
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>{" "}
                              <circle
                                cx="12"
                                cy="12"
                                r="3"
                                stroke="black"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></circle>{" "}
                            </svg>
                          </span>

                          <span className="mx-1 whitespace-nowrap">
                            {" "}
                            Order details
                          </span>
                        </Link>
                      </div>
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
                            <span> {" " + data.products}</span>
                          </p>
                        </div>
                        <div className="flex-row items-center space-y-4 md:mr-52 ">
                          <p className="text-sm flex space-x-1">
                            <span className="hidden  md:block">
                              Date Added:
                            </span>{" "}
                            <span className="font-semibold text-dgrey1 md:text-dblack">
                              {data.date_added}
                            </span>
                          </p>
                          <p className="text-sm space-x-1">
                            <span>Total:</span>
                            <span className="font-semibold">{data.total}</span>
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

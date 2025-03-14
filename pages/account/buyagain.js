import { axiosServer } from "@/axiosServer";
import UserSidebar from "@/components/account/UserSidebar";
import UserSidebarMobile from "@/components/account/UserSidebarMobile";
import SingleProduct from "@/components/product/SingleProduct";
import useDeviceSize from "@/components/useDeviceSize";
import { AccountContext } from "@/contexts/AccountContext";
import buildLink from "@/urls";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

import PointsLoader from "@/components/PointsLoader";
function buyagain() {
  const router = useRouter();
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [showLimit, setShowLimit] = useState(false);
  const [limit, setLimit] = useState(48);
  const [mobileSort, showMobileSort] = useState(false);
  const [total, setTotal] = useState(0);
  const [state, dispatch] = useContext(AccountContext);
  const [loading, setLoading] = useState(true);
  const [width, height] = useDeviceSize();

  function pageSetter(page) {
    setPage(page["selected"] + 1);
    router.push(
      `/account/buyagain&page=${page["selected"] + 1}&limit=${limit}`
    );
  }

  function limitSetter(lim) {
    setLimit(lim);
    history.push({
      pathname: "/account/buyagain",
      search: `&page=${page}&limit=${lim}`,
    });
  }

  useEffect(() => {
    if (!state.loading && !state.loged) {
      router.push("/");
      setLoading(false);
    } else if (state.loged) {
      axiosServer
        .get(buildLink("buyagain", undefined, window.innerWidth))
        .then((response) => {
          if (response?.data?.success) {
            const data = response?.data?.data?.products;
            setData(data);
            setTotal(data?.length);
            setLoading(false);
            if (!state.loged) {
            }
          } else {
            setLoading(false);
          }
        });
    }
  }, [page, limit, state.loading]);

  return (
    <div className="container text-dblack">
      <Head>
        <title>My Account | ishtari</title>
      </Head>
      <div className="pb-2">
        <div className="flex-row md:flex">
          <div className="w-full mb-3 md:w-1/5">
            {width > 650 ? (
              <UserSidebar active={"buyagain"} />
            ) : (
              <UserSidebarMobile active={"buyagain"} />
            )}
          </div>
          {loading ? (
            <div className="flex justify-center w-full">
              <PointsLoader />
            </div>
          ) : (
            <div className="w-full px-2 md:w-4/5 md:pl-8 mb-8">
              <div className="flex justify-between">
                <p className="text-lg pr-semibold py-4">Buy Again </p>
                {width > 650
                  ? total > 48 && (
                      <div className="hidden md:px-8 md:flex items-center">
                        <span className=" text-xs font-semibold text-dgrey1">
                          DISPLAY
                        </span>
                        <div className=" relative">
                          <button
                            className="bg-white px-2 md:px-8 py-1 ml-4 border text-sm font-semibold cursor-pointer rounded flex items-start"
                            onClick={() => setShowLimit(!showLimit)}
                          >
                            <span className="text-d13">{limit} PER PAGE</span>

                            <i
                              className={`block icon icon-angle-down ml-2 transition-all ${
                                showLimit && "transform  rotate-180"
                              }`}
                            ></i>
                          </button>
                          {showLimit && (
                            <div className="bg-white py-4 w-44 shadow-2xl absolute z-10 right-0 top-9">
                              <span
                                onClick={() => {
                                  limitSetter(48);
                                  setShowLimit(false);
                                }}
                                className=" block text-sm font-light px-4 py-2 cursor-pointer hover:bg-dblue hover:text-white"
                              >
                                48 PER PAGE
                              </span>
                              <span
                                onClick={() => {
                                  limitSetter(96);
                                  setShowLimit(false);
                                }}
                                className=" block text-sm font-light px-4 py-2 cursor-pointer hover:bg-dblue hover:text-white"
                              >
                                96 PER PAGE
                              </span>
                              <span
                                onClick={() => {
                                  limitSetter(144);
                                  setShowLimit(false);
                                }}
                                className=" block text-sm font-light px-4 py-2 cursor-pointer hover:bg-dblue hover:text-white"
                              >
                                144 PER PAGE
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  : total > 48 && (
                      <div>
                        <button
                          className="my-10 bg-white px-2 py-1"
                          onClick={() => showMobileSort(true)}
                        >
                          <span>Display</span>
                          <i className="icon icon-sort ml-1"></i>
                        </button>
                        <div
                          onClick={() => showMobileSort(false)}
                          className={
                            mobileSort
                              ? `bg-dblack bg-opacity-20 w-screen h-screen fixed z-10 top-0 left-0 flex justify-end`
                              : "hidden"
                          }
                        >
                          <div className="bg-white w-3/5 p-2 ">
                            <button
                              className="flex items-center justify-between  w-full"
                              onClick={() => setLimit(48)}
                            >
                              <span className=" block text-sm font-light px-4 py-2 cursor-pointer hover:bg-dblue hover:text-white">
                                48 PER PRODUCT
                              </span>
                              <i
                                className={`icon ${
                                  limit === 48
                                    ? "icon-ok text-dblue"
                                    : "icon-check-empty text-dgrey1"
                                }`}
                              ></i>
                            </button>
                            <button
                              className="flex items-center justify-between  w-full"
                              onClick={() => setLimit(96)}
                            >
                              <span className=" block text-sm font-light px-4 py-2 cursor-pointer hover:bg-dblue hover:text-white">
                                96 PER PRODUCT
                              </span>
                              <i
                                className={`icon ${
                                  limit === 96
                                    ? "icon-ok text-dblue"
                                    : "icon-check-empty text-dgrey1"
                                }`}
                              ></i>
                            </button>
                            <button
                              className="flex items-center justify-between  w-full"
                              onClick={() => setLimit(144)}
                            >
                              <span className=" block text-sm font-light px-4 py-2 cursor-pointer hover:bg-dblue hover:text-white">
                                144 PER PRODUCT
                              </span>
                              <i
                                className={`icon ${
                                  limit === 144
                                    ? "icon-ok text-dblue"
                                    : "icon-check-empty text-dgrey1"
                                }`}
                              ></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
              </div>{" "}
              <div className="grid grid-cols-2  lg:grid-cols-6 gap-2">
                {data?.map((item) => (
                  <SingleProduct
                    item={item}
                    addToCart={true}
                    key={item.product_id}
                  />
                ))}
              </div>
              {total > 48 &&
                (width > 650 ? (
                  <ReactPaginate
                    pageCount={Math.ceil(total / limit)}
                    containerClassName={"pagination"}
                    onPageChange={pageSetter}
                    pageRangeDisplayed={8}
                    marginPagesDisplayed={2}
                    previousLabel={"<"}
                    nextLabel={">"}
                    activeClassName={"active-pagination"}
                    forcePage={page ? parseInt(page) - 1 : 0}
                  ></ReactPaginate>
                ) : (
                  <ReactPaginate
                    pageCount={Math.ceil(total / limit)}
                    containerClassName={"pagination"}
                    onPageChange={pageSetter}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={1}
                    previousLabel={"<"}
                    nextLabel={">"}
                    activeClassName={"active-pagination"}
                    forcePage={page ? parseInt(page) - 1 : 0}
                  ></ReactPaginate>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default buyagain;

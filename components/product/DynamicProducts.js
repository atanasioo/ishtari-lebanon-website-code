import { axiosServer } from "@/axiosServer";
import buildLink from "@/urls";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import SingleProduct from "./SingleProduct";
import useDeviceSize from "../useDeviceSize";
import NoData from "../NoData";
import LatestPlaceholder from "./DynamicPlaceholder";

function DynamicProducts() {
  const router = useRouter();
  const [data, setData] = useState();
  const [showLimit, setShowLimit] = useState(false);
  const [limit, setLimit] = useState(router.query.limit || 48);
  const title = router.query.catalog.replaceAll("_", " ");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(router.query.page || 1);
  const [width] = useDeviceSize();
  const type =
    router.query.catalog === "coming_soon"
      ? "comingsoon"
      : router.query.catalog === "back_to_stock"
      ? "backtostock"
      : router.query.catalog === "latest"
      ? "latest"
      : "";

  useEffect(() => {
    setLoading(true);
    axiosServer
      .get(
        buildLink("dynamicproducts", undefined, undefined) +
          `${`${type}&page=${page}&limit=${limit}`}`
      )
      .then((response) => {
        console.log(response.data);
        setData(response.data.data);
        setLoading(false);
      });
  }, [page, limit, type]);

  const handlePageClick = (event) => {
    const new_page = parseInt(event.selected) + 1;
    const query = { ...router.query };

    query.page = new_page;

    setPage(new_page);

    if (typeof query.limit !== "undefined") {
      query.limit = router.query.limit;
    }

    router.push({
      pathname: router.pathname,
      query,
    });
  };

  const handleLimitClick = (value) => {
    const new_limit = parseInt(value);
    const query = { ...router.query };

    query.limit = new_limit;

    if (typeof query.page !== "undefined") {
      query.page = router.query.page;
    }

    router.push({
      pathname: router.pathname,
      query,
    });
  };

  return (
    <div>
      {loading ? (
        <div>
          <LatestPlaceholder />
        </div>
      ) : data.products.length > 0 ? (
        <div>
          <div className="flex justify-between w-full p-3">
            <h1 className="text-2xl font-bold capitalize">{title} products</h1>
            <div>
              {" "}
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
                    <div className="bg-white py-4 w-44 shadow-2xl absolute z-20 right-0 top-9">
                      <span
                        onClick={() => {
                          handleLimitClick(48);
                          setLimit(48);
                          setShowLimit(false);
                        }}
                        className=" block text-sm font-light px-4 py-2 cursor-pointer hover:bg-dblue hover:text-white"
                      >
                        48 PER PAGE
                      </span>
                      <span
                        onClick={() => {
                          handleLimitClick(96);
                          setLimit(96);
                          setShowLimit(false);
                        }}
                        className=" block text-sm font-light px-4 py-2 cursor-pointer hover:bg-dblue hover:text-white"
                      >
                        96 PER PAGE
                      </span>
                      <span
                        onClick={() => {
                          handleLimitClick(144);
                          setLimit(144);
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
            </div>
          </div>
          <div
            className={`grid grid-cols-2 xl:grid-cols-6 lg:grid-cols-6 gap-2 px-2 ${
              loading ? "h-screen" : ""
            }`}
          >
            {data?.products?.map((product) => (
              <SingleProduct
                key={product.product_id}
                item={product}
              ></SingleProduct>
            ))}
          </div>
          {data.total_pages > 1 && (
            <div className="h-12">
              <ReactPaginate
                className={"category-pagination"}
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={width < 650 ? 1 : 2}
                marginPagesDisplayed={width < 650 ? 1 : 2}
                pageCount={data?.total_pages}
                previousLabel="<"
                activeClassName={"active-pagination-category"}
                renderOnZeroPageCount={null}
                forcePage={
                  router.query.page ? parseInt(router.query.page) - 1 : 0
                }
              />
            </div>
          )}
        </div>
      ) : (
        <NoData />
      )}
    </div>
  );
}

export default DynamicProducts;

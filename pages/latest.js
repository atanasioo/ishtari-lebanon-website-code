import React, { useState } from "react";
import cookie from "cookie";
import buildLink from "@/urls";
import { axiosServer } from "@/axiosServer";
import SingleProducts from "@/components/product/SingleProduct";
import ReactPaginate from "react-paginate";
import useDeviceSize from "@/components/useDeviceSize";
import { useRouter } from "next/router";
export default function latest(props) {
  const router = useRouter();
  const { limit, page } = router.query;
  const { data } = props;
  const [showLimit, setShowLimit] = useState(false);
//   const [pageNow, setpageNow] = useState(0);
//   const [limitNow, setLimitNow] = useState(48);

  const [width, height] = useDeviceSize();
  const handlePageClick = (event) => {
    const new_page = parseInt(event.selected) + 1;
    alert(page)

    var now = "&page" + new_page;
    if(limit == undefined){
        now = "?" + now
    }
    if (page === undefined) {
      router.push(router.asPath + now);
    } else {
      let old = "&page" + page;
      alert(old)
      alert(now)
      router.push(router.asPath.replace(old, now));
    }
  };
  console.log(data);
  return (
    <div>
      <div className="flex justify-between w-full p-3">
        <h1 className="text-2xl font-bold">Latest Products</h1>
        <div>
          {" "}
          <div className="hidden md:px-8 md:flex items-center">
            <span className=" text-xs font-semibold text-dgrey1">DISPLAY</span>
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
        </div>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-6 lg:grid-cols-8 gap-2 px-2">
        {data.products?.map((product) => (
          <SingleProducts
            key={product.product_id}
            item={product}
            //
          ></SingleProducts>
        ))}
      </div>

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
          forcePage={data?.page > 0 ? Number(data?.page) - 1 : 0}
        />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const { page, limit } = context.query;
  const host = req.headers.host;

  console.log("host isss" + host);
  const cookies = req.headers.cookie;
  const parsedCookies = cookie.parse(cookies);

  const host_cookie = parsedCookies["site-local-name"];
  const token = parsedCookies["api-token"];
  var data = {};
  let site_host = "";
  if (host_cookie === undefined || typeof host_cookie === "undefined") {
    site_host = host;
  } else {
    site_host = host_cookie;
  }
  let link =
    buildLink("latest", undefined, undefined, site_host) +
    "&source_id=1" +
    `${page != undefined && "&page=" + page}` +
    `${limit != undefined && "&limit=" + limit}`;
  const response = await axiosServer.get(link, {
    headers: {
      Authorization: "Bearer " + token
    }
  });
  if (!response.data.success) {
    return {
      notFound: true
    };
  }

  data = response.data.data;

  return {
    props: {
      data
    }
  };
}

import { axiosServer } from "@/axiosServer";
import ClearCacheLink from "@/components/ClearCacheLink";
import SingleProduct from "@/components/product/SingleProduct";
import useDeviceSize from "@/components/useDeviceSize";
import buildLink from "@/urls";
import cookie from "cookie";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import ReactPaginate from "react-paginate";

function search(props) {
  const { data, filters } = props;
  const router = useRouter();
  const [baseURL, setBaseURL] = useState("?keyword=" + router.query.keyword);
  const [successClear, setSuccessClear] = useState(false);
  const encodedKeyword = encodeURIComponent(router.query.keyword);
  const [width] = useDeviceSize();

  // );
  const ClearCacheLink = dynamic(() => import("@/components/ClearCacheLink"), {
    ssr: false, // Disable server-side rendering
  });

  function handleFilter(type, name) {
    const Name = encodeURIComponent(name);

    if (router.query.hasOwnProperty(Name) > 0) {
      router.push(`/search${baseURL.replace("&" + type + "=" + Name, "")}`);
    } else {
      router.push(`/search${baseURL + "&" + type + "=" + Name}`);
      setBaseURL(router.query.keyword);
    }
  }

  console.log(router.query);

  // CheckFilter
  function checkFilter(filter) {
    const Fil = encodeURIComponent(filter);
    console.log(Fil);
    console.log(router.query);
    console.log(router.query.hasOwnProperty(Fil));
    if (router.query.hasOwnProperty(Fil) < 0) {
      return <input type="checkbox" className="" checked />;
    } else {
      return <input type="checkbox" className="" />;
    }
  }

  function clearCache() {
    axiosServer
      .get(
        buildLink("clearCache", undefined, window.innerWidth) + encodedKeyword
      )
      .then((response) => {
        if (response.data.success) {
          setSuccessClear(true);
        }
      });
  }

  //  Pagination
  function pageSetter(page) {
    console.log(page);
    const new_page = parseInt(page["selected"]);
    router.push("/search?keyword=" + encodedKeyword + "&page=" + new_page);
  }

  console.log(data);

  return (
    <div>
      <div className="flex">
        <div className="w-full mobile:w-1/5 mobile:px-5 ">
          {filters.length > 0 ? (
            filters?.map((filter) => (
              <div key={filter.name} className="hidden mobile:block">
                {filter["new_items"].length > 0 && (
                  <div
                    className=" capitalize mb-3 mt-5 text-base pr-semibold  text-dblack flex items-center justify-between cursor-pointer hover:opacity-80 relative "
                    onClick={(e) => toggleVisibility(e.target)}
                  >
                    <div className="absolute w-full h-full"></div>
                    <span>{filter.name}</span>
                    <i className="icon icon-angle-down text-dgrey1 text-2xl transition-all"></i>
                  </div>
                )}
                <div className="block">
                  <div>
                    {filter["new_items"].slice(0, 5).map((sub_filter) => (
                      <div
                        className="my-2 float flex justify-between  items-center cursor-pointer hover:text-dblue"
                        key={sub_filter.name}
                        onClick={() => {
                          handleFilter(filter.name, sub_filter.name);
                        }}
                      >
                        <div className="flex gap-1">
                          <div className={`icon mr-1 text-base `}>
                            {checkFilter(sub_filter.name)}
                          </div>
                          <span className="text-d13 font-light">
                            {sub_filter.name}
                          </span>
                        </div>

                        <span className="float-right text-d13 font-light">
                          ({sub_filter.count})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="hidden md:block w-2/12 pr-4 pt-2"></div>
          )}
        </div>
        <div className="w-full md:w-10/12 pl-0 md:pl-2 md:mt-5">
          <div className="text-lg my-2">
            {data.nbHits} Results found for{" "}
            <span className="pr-semibold">"{router.query.keyword}"</span>
            <ClearCacheLink
              successClear={successClear}
              clearCache={clearCache}
            />
          </div>
          {/* Mobile setting */}
          <div className="w-screen md:hidden bg-white -mx-4 my-4">
            <div className="flex items-center w-full px-4 justify-center ">
              <div className="flex items-center justify-center divide-x w-full shadow-lg divide-dinputBorder bg-white py-2 rounded">
                <button className="" onClick={() => showMobileFilter(true)}>
                  <span>Filter</span>
                  <i className="icon icon-filter ml-1"></i>
                </button>
              </div>
            </div>
          </div>
          {/* End Mobile setting */}

          <div className=" grid grid-cols-2  md:grid-cols-5 gap-2">
            {data.data.products?.map((product) => (
              <SingleProduct
                item={product}
                key={product.product_id}
              ></SingleProduct>
            ))}
          </div>

          {/* Pagination */}
          {data.data.result && data.data.result["nbHits"] > 50 && (
            <ReactPaginate
              pageCount={Math.ceil(data.data.result["nbHits"] / 50)}
              containerClassName={"pagination"}
              onPageChange={pageSetter}
              pageRangeDisplayed={width > 650 ? 3 : 2}
              marginPagesDisplayed={1}
              previousLabel={"<"}
              nextLabel={">"}
              activeClassName={"active-pagination"}
              forcePage={
                router.query.page ? parseInt(router.query.page) : 0
              }
            ></ReactPaginate>
          )}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { keyword, brand, seller, category, page } = context.query;

  let encodedKeyword = encodeURIComponent(keyword);

  console.log(context.query);
  const { req } = context;
  let data = null;
  let type = "";
  var p = "";
  if (page !== undefined) {
    p = page;
  }
  const host = req.headers.host;

  const cookies = req.headers.cookie;
  const parsedCookies = cookie.parse(cookies);
  const host_cookie = parsedCookies["site-local-name"];
  const token = parsedCookies["api-token"];
  let site_host = "";
  if (host_cookie === undefined || typeof host_cookie === "undefined") {
    site_host = host;
  } else {
    site_host = host_cookie;
  }

  let link =
    buildLink("alg", undefined, undefined, site_host) +
    encodedKeyword +
    "&limit=50&page=" +
    Number(p);

  if (brand) {
    link += "&brand=" + brand.replaceAll(" & ", "--");
  }
  if (seller) {
    link += "&seller=" + seller.replaceAll(" & ", "--");
  }
  if (category) {
    link += "&category=" + category.replaceAll(" & ", "--");
  }

  const response = await axiosServer.get(link, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  console.log(link);

  data = response.data;

  console.log(data);

  return {
    props: {
      data,
      filters: data.data.facets,
    },
  };
}

export default search;

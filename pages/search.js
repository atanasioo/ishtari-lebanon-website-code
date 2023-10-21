import { axiosServer } from "@/axiosServer";
import ClearCacheLink from "@/components/ClearCacheLink";
import NoData from "@/components/NoData";
import CatalogMobilePlaceholder from "@/components/catalog/CatalogMobilePlaceholder";
import CatalogPlaceholder from "@/components/catalog/CatalogPlaceholder";
import SingleProduct from "@/components/product/SingleProduct";
import useDeviceSize from "@/components/useDeviceSize";
import buildLink from "@/urls";
import cookie from "cookie";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi";
import ReactPaginate from "react-paginate";

function search(props) {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState([]);
  const [baseURL, setBaseURL] = useState("?keyword=" + router.query.keyword);
  const [successClear, setSuccessClear] = useState(false);
  const [mobileFilter, showMobileFilter] = useState(false);
  const encodedKeyword = encodeURIComponent(router.query.keyword);
  const queryParameters = ["brand", "seller", "category"];
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const [width] = useDeviceSize();

  // );
  const ClearCacheLink = dynamic(() => import("@/components/ClearCacheLink"), {
    ssr: false, // Disable server-side rendering
  });

  useEffect(() => {
    setLoading(true);
    const { keyword, brand, seller, category, page } = router.query;
    let encodedKeyword = encodeURIComponent(keyword);
    var p = "";
    if (page !== undefined) {
      p = page;
    }

    let link =
      buildLink("alg", undefined, undefined) +
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

    axiosServer.get(link).then((response) => {
      const data = response.data;

      if (data?.data?.redirect === "1") {
        router.push(
          `/` +
            encodedKeyword.replaceAll("%20", "-") +
            "/" +
            data.data.type.slice(0, 1) +
            "=" +
            data.data.type_id
        );
      }else if (data?.data?.nbHits === 0 || data?.success === false) {
        setNoData(true);
      } else {
        setData(data);
        setFilters(data.data.facets);
      }
      setLoading(false);
    });
  }, [router]);



  function handleFilter(type, name) {
    const query = { ...router.query };

    if (query[type] === name) {
      // Remove the filter from the query if it already exists
      delete query[type];
    } else {
      // Add or update the filter in the query
      query[type] = name;
    }

    const queryString = Object.keys(query)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`
      )
      .join("&");

    router.push(`/search?${queryString}`);
  }

  // CheckFilter
  function checkFilter(filter) {
    const Fil = encodeURIComponent(filter);

    const hasFilterQuery = queryParameters.some(
      (param) => encodeURIComponent(router.query[param]) === Fil
    );

    if (hasFilterQuery) {
      // return <input type="checkbox" className="" checked />;
      return "icon-ok-squared text-dblue";
    } else {
      // return <input type="checkbox" className="" />;
      return "icon-check-empty";
    }
  }

  function clearCache() {
    axiosServer
      .get(
        buildLink(
          "clearCache",
          undefined,
          window.innerWidth,
          window.config["site-url"]
        ) + encodedKeyword
      )
      .then((response) => {
        if (response.data.success) {
          setSuccessClear(true);
        }
      });
  }

  // Toggle Visibility
  function toggleVisibility(e) {
    const h_sender = e;
    const sender_parent = h_sender.parentNode;
    const next_filters = sender_parent.nextElementSibling;
    const icon = sender_parent.lastChild;
    const next_filters_display = next_filters.style.display;
    if (next_filters_display === "block") {
      next_filters.style.display = "none";
      icon.style.transform = "rotate(-90deg)";
    } else {
      next_filters.style.display = "block";
      icon.style.transform = "rotate(0deg)";
    }
  }

  // function toggleVisibility(e) {
  //   const h_sender = e;
  //   const sender_parent = h_sender.parentNode;
  //   const next_filters = sender_parent.nextElementSibling;

  //   if (next_filters && next_filters.nodeType === 1) {
  //     // Check if next_filters exists and is an element node
  //     const icon = sender_parent.lastChild;
  //     const next_filters_display = next_filters.style.display;

  //     if (next_filters_display === "block") {
  //       next_filters.style.display = "none";
  //       icon.style.transform = "rotate(-90deg)";
  //     } else {
  //       next_filters.style.display = "block";
  //       icon.style.transform = "rotate(0deg)";
  //     }
  //   }
  // }

  // Toggle filters
  function toggleFilters(e) {
    const h_sender = e;
    const sender_parent = h_sender.parentNode;
    const next_filters = sender_parent.nextElementSibling;
    const next_filters_display = next_filters.style.display;
    if (next_filters_display === "block") {
      next_filters.style.display = "none";
    } else {
      next_filters.style.display = "block";
    }
  }

  //  Pagination
  function pageSetter(page) {
    const new_page = parseInt(page["selected"]);
    router.push("/search?keyword=" + encodedKeyword + "&page=" + new_page);
  }

  useEffect(() => {
    if (width < 650) showMobileFilter(false);
  }, [router]);

  return (
    <div className="overflow-x-hidden">
      {loading && width > 650 ? (
        <CatalogPlaceholder />
      ) : loading && width < 650 ?  (
        <CatalogMobilePlaceholder />
      ): noData ? (
        <NoData />
      ) : (
        <div>
          {mobileFilter && (
            <div className="bg-dblack bg-opacity-20 w-screen min-h-screen fixed top-0 left-0 bottom-0 z-10 right-0 overflow-y-scroll">
              <div className="bg-white min-h-screen pb-12 ">
                <h2 className=" px-2 text-xl border-b py-2 border-dinputBorder font-semibold flex items-center justify-between ">
                  <span>Filter</span>
                  <button onClick={() => showMobileFilter(false)}>
                    <i className="icon icon-cancel text-2xl"></i>
                  </button>
                </h2>

                <div className="px-2">
                  {filters?.map((filter) => (
                    <div key={filter.name}>
                      {filter["new_items"].length > 0 && (
                        <h1
                          className="capitalize mb-3 mt-1 text-base font-semibold text-dblack flex items-center justify-between cursor-pointer hover:opacity-80 relative "
                          onClick={(e) => toggleVisibility(e.target)}
                        >
                          <div className="absolute w-full h-full"></div>
                          <span>{filter.name}</span>
                          <i className="icon icon-angle-down text-dgrey1 text-2xl transition-all"></i>
                        </h1>
                      )}
                      <div style={{ display: "block" }}>
                        <div>
                          {filter["new_items"].slice(0, 5).map((sub_filter) => (
                            <p
                              className="my-2 float items-center cursor-pointer hover:text-dblue"
                              key={sub_filter.name}
                              onClick={() => {
                                handleFilter(filter.name, sub_filter.name);
                              }}
                            >
                              <i
                                className={`icon mr-1 text-base ${checkFilter(
                                  sub_filter.name
                                )}`}
                              ></i>
                              <span className="text-d13 font-light">
                                {sub_filter.name}
                              </span>
                              <span className="float-right text-d13 font-light">
                                ({sub_filter.count})
                              </span>
                            </p>
                          ))}
                        </div>
                        <div>
                          <label
                            className={`text-dblue text-xs cursor-pointer select-none ${
                              filter["new_items"].length < 6 && "hidden"
                            }`}
                            onClick={(e) => toggleFilters(e.target)}
                          >
                            Show More
                          </label>
                        </div>
                        <div style={{ display: "none" }}>
                          {filter["new_items"]
                            .slice(5, filter["new_items"].length)
                            .map((sub_filter) => (
                              <p
                                className="my-2 float items-center cursor-pointer hover:text-dblue select-none"
                                key={sub_filter.name}
                                onClick={() => {
                                  handleFilter(filter.name, sub_filter.name);
                                }}
                              >
                                <i
                                  className={`icon mr-1 text-base ${checkFilter(
                                    sub_filter.name
                                  )}`}
                                ></i>
                                <span className="text-d13 font-light">
                                  {sub_filter.name}
                                </span>
                                <span className="float-right text-d13 font-light">
                                  ({sub_filter.count})
                                </span>
                              </p>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="container flex">
            <div className="w-full hidden mobile:block mobile:w-1/5 mobile:px-5 ">
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
                        {/* <div className="text-dgrey1 text-2xl transition-all" >hii</div> */}
                      </div>
                    )}
                    <div style={{ display: "block" }}>
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
                              {/* <div className={`icon mr-1 text-base `}>
                            {checkFilter(sub_filter.name)}
                          </div> */}
                              <i
                                className={`icon mr-1 text-base ${checkFilter(
                                  sub_filter.name
                                )}`}
                              ></i>
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
                      <div>
                        <label
                          className={`text-dblue text-xs cursor-pointer select-none ${
                            filter["new_items"].length < 6 && "hidden"
                          }`}
                          onClick={(e) => toggleFilters(e.target)}
                        >
                          Show More
                        </label>
                      </div>
                      <div style={{ display: "none" }}>
                        {filter["new_items"]
                          .slice(5, filter["new_items"].length)
                          .map((sub_filter) => (
                            <div
                              className="my-2 float flex justify-between items-center cursor-pointer hover:text-dblue select-none"
                              key={sub_filter.name}
                              onClick={() => {
                                handleFilter(filter.name, sub_filter.name);
                              }}
                            >
                              <div className="flex gap-1">
                                {/* <div className={`icon mr-1 text-base `}>
                              {checkFilter(sub_filter.name)}
                            </div> */}
                                <i
                                  className={`icon mr-1 text-base ${checkFilter(
                                    sub_filter.name
                                  )}`}
                                ></i>
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
                {data.data?.products?.map((product) => (
                  <SingleProduct
                    item={product}
                    key={product.product_id}
                  ></SingleProduct>
                ))}
              </div>

              {/* Pagination */}
              {data.data?.result && data.data.result["nbHits"] > 50 && (
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
      )}
    </div>
  );
}

// export async function getServerSideProps(context) {
//   const { keyword, brand, seller, category, page } = context.query;

//   let encodedKeyword = encodeURIComponent(keyword);

//   const { req } = context;
//   let data = null;
//   let type = "";
//   var p = "";
//   if (page !== undefined) {
//     p = page;
//   }
//   const host = req.headers.host;

//   const cookies = req.headers.cookie;
//   const parsedCookies = cookie.parse(cookies);
//   const host_cookie = parsedCookies["site-local-name"];
//   const token = parsedCookies["api-token"];
//   let site_host = "";
//   if (host_cookie === undefined || typeof host_cookie === "undefined") {
//     site_host = host;
//   } else {
//     site_host = host_cookie;
//   }

//   let link =
//     buildLink("alg", undefined, undefined, site_host) +
//     encodedKeyword +
//     "&limit=50&page=" +
//     Number(p);

//   if (brand) {
//     link += "&brand=" + brand.replaceAll(" & ", "--");
//   }
//   if (seller) {
//     link += "&seller=" + seller.replaceAll(" & ", "--");
//   }
//   if (category) {
//     link += "&category=" + category.replaceAll(" & ", "--");
//   }

//   const response = await axiosServer.get(link, {
//     headers: {
//       Authorization: "Bearer " + token,
//     },
//   });

//   data = response.data;

//   if (data?.data?.redirect === "1") {
//     return {
//       redirect: {
//         permanent: false,
//         destination:
//           `/` +
//           encodedKeyword.replaceAll("%20", "-") +
//           "/" +
//           data.data.type.slice(0, 1) +
//           "=" +
//           data.data.type_id,
//       },
//       props: {},
//     };
//   }

//   if (data?.data?.nbHits === 0 || data?.success === false) {
//     return {
//       notFound: true,
//     };
//   } else {
//     return {
//       props: {
//         data,
//         filters: data.data.facets,
//       },
//     };
//   }
// }

export default search;

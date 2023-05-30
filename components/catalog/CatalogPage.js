import React, { useState, useEffect } from "react";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { useRouter } from "next/router";
import SingleProduct from "../product/SingleProduct";
import Link from "next/link";
import buildLink from "@/urls";
import { axiosServer } from "@/axiosServer";
import { loader } from "/public/images/loader.gif";
function CatalogPage(props) {
  const [filters, setFilters] = useState(props.data?.filters );
  const [data, setData] = useState(props.data  || state);
  const router = useRouter();
  const {
    catalog,
    filter_categories,
    filter_manufacturers,
    filter_sellers,
    filter_options,
    adv_filters,
    has_filter,
    last,
    slug,
    page,
    sort,
    order,
    limit
  } = router.query;

  // Access the query parameter values
  console.log("Param1:", filter_categories);
  console.log("Param2:", filter_manufacturers);
  console.log("Param3:", filter_sellers);
  console.log("Param4:", filter_options);
  console.log("Param5:", last);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };

    const handleComplete = () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    // router.events.on("routeChangeComplete", handleComplete);
    // router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      // router.events.off("routeChangeComplete", handleComplete);
      // router.events.off("routeChangeError", handleComplete);
    };
  }, []);

  useEffect(() => {
    router.asPath.indexOf("has_filter") < 0 && setIsLoading(false);
    if (router.asPath.indexOf("has_filter") > -1 && !data.products) {
    axiosServer.get(parseUrl()).then((response) => {
      const data = response.data.data;
      setData(data);
      setFilters(response.data.data?.filters);
      setIsLoading(false);
    });
    }
  }, [router]);

  function parseUrl(queries = false) {
    let url_type =
      router.asPath.indexOf("has_filter") < 0 ? "default" : "filter";
    // setData({});
    // console.log(router);
    const type_id = slug[0].slice(2);

    if (url_type === "default") {
      const q_s = "";
      // q_s.page = page ? page : page;
      // q_s.limit = limit ? limit : limit.value;
      // q_s.sort = sort ? sort : "p2co.sort_order";
      // q_s.order = order ? order : "ASC";
      // q_s.source_id = 1;

      // // Preapare url
      let final_queries = "&"; // + stringify(q_s);
      return (
        buildLink(props.type, undefined, window.innerWidth) +
        type_id +
        final_queries
      );
      //+
      // `${state.admin ? "&adm_quantity=true" : ""}`
      //   : final_queries + `${state.admin ? "&adm_quantity=true" : ""
      // }`
      // ;
    } else {
      const q_s = router.asPath?.slice(router.asPath.indexOf("?"));
      let type = props.type;
      return (
        buildLink("filter", undefined, window.innerWidth) +
        "&path=" +
        type_id +
        "" +
        q_s.replace("?", "&")
        // "&limit=" +
        // limit.value
        // +
        // `${state.admin ? "&adm_quantity=true" : ""}`
      );
    }
  }
  function checkFilter(type, name, filter) {
    // console.log(router.asPath);
    // console.log(type);
    if (
      filter_options != undefined &&
      (name === "Color" || name === "Light Color")
    ) {
      if (filter_options.indexOf(filter["id"]) > -1) {
        return "rounded-full border border-dblue";
      } else {
        return "rounded-full border relative border-dgreyRate cursor-pointer hover:shadow";
      }
    } else if (
      filter_options != undefined &&
      (name === "Shoes Size" ||
        name === "Size by Age" ||
        name === "jeans Size" ||
        name === "Socks")
    ) {
      if (filter_options.indexOf(filter["id"]) > -1) {
        return "border rounded text-dblue border-dblue p-2";
      } else {
        return "border rounded relative border-dgreyRate cursor-pointer hover:shadow p-2";
      }
    } else if (
      type === "filter_categories" ||
      type === "filter_manufacturers" ||
      type === "filter_sellers" ||
      type === "adv_filters"
    ) {
      if (filter_categories != undefined && type === "filter_categories") {
        if (filter_categories.indexOf(filter["id"]) > -1)
          return <input type="checkbox" className="" checked />;
      }

      if (
        filter_manufacturers != undefined &&
        type === "filter_manufacturers"
      ) {
        if (filter_manufacturers.indexOf(filter["id"]) > -1)
          return <input type="checkbox" className="" checked />;
      }

      if (filter_sellers != undefined && type === "filter_sellers") {
        if (filter_sellers.indexOf(filter["id"]) > -1)
          return <input type="checkbox" className="" checked />;
      }

      if (adv_filters != undefined && type === "adv_filters") {
        if (adv_filters.indexOf(filter["id"]) > -1)
          return <input type="checkbox" className="" checked />;
      }

      return <input type="checkbox" className="" />;
    } else {
      if (filter_options != undefined && type === "filter_options") {
        if (filter_options.indexOf(filter["id"]) > -1)
          return <input type="checkbox" className="" checked />;
      }
      return <input type="checkbox" className="" />;
    }
  }

  function parseFilter(filter_type, id) {
    var url = "";
    var type = "";
    console.log(filter_type);
    console.log(id);

    if (filter_type === "filter_manufacturers") {
      type = "filter_manufacturers";
      if (filter_manufacturers != undefined) {
        if (filter_manufacturers?.indexOf(id) > -1) {
          // console.log("exist");
          const value = filter_manufacturers
            ?.split(",")
            .filter((value) => value != id);
          if (value.length > 0) url += "&" + type + "=" + value;
        } else {
          url += "&" + type + "=" + filter_manufacturers + "," + id;
          console.log("Not exist but has filter maufacturers ");
        }
      } else {
        url += "&" + type + "=" + id;
      }
    } else {
      type = "filter_manufacturers";
      if (filter_manufacturers != undefined) {
        url += "&" + type + "=" + filter_manufacturers;
      }
    }

    if (filter_type === "filter_sellers") {
      type = "filter_sellers";
      if (filter_sellers != undefined) {
        if (filter_sellers?.indexOf(id) > -1) {
          console.log("exist");
          const value = filter_sellers
            ?.split(",")
            .filter((value) => value != id);
          if (value.length > 0) url += "&" + type + "=" + value;
        } else {
          url += "&" + type + "=" + filter_sellers + "," + id;
          console.log("Not exist but has filter sellers ");
        }
      } else {
        type = "filter_sellers";
        url += "&" + type + "=" + id;
      }
    } else {
      type = "filter_sellers";
      if (filter_sellers != undefined) {
        url += "&" + type + "=" + filter_sellers;
      }
    }

    if (filter_type === "filter_categories") {
      type = "filter_categories";
      if (filter_categories != undefined) {
        if (filter_categories?.indexOf(id) > -1) {
          console.log("exist");
          const value = filter_categories
            ?.split(",")
            .filter((value) => value != id);
          if (value.length > 0) url += "&" + type + "=" + value;
        } else {
          url += "&" + type + "=" + filter_categories + "," + id;
          console.log("Not exist but has filter  ");
        }
      } else {
        url += "&" + type + "=" + id;
      }
    } else {
      type = "filter_categories";
      if (filter_categories != undefined) {
        url += "&" + type + "=" + filter_categories;
      }
    }

    if (filter_type === "filter_options") {
      type = "filter_options";
      if (filter_options != undefined) {
        if (filter_options?.indexOf(id) > -1) {
          console.log("exist");
          const value = filter_options
            ?.split(",")
            .filter((value) => value != id);
          if (value.length > 0) url += "&" + type + "=" + value;
        } else {
          url += "&" + type + "=" + filter_options + "," + id;
          console.log("Not exist but has filter  ");
        }
      } else {
        url += "&" + type + "=" + id;
      }
    } else {
      type = "filter_options";
      if (filter_options != undefined) {
        url += "&" + type + "=" + filter_options;
      }
    }

    if (filter_type === "adv_filters") {
      type = "adv_filters";
      if (adv_filters != undefined) {
        if (adv_filters?.indexOf(id) > -1) {
          console.log("exist");
          const value = adv_filters?.split(",").filter((value) => value != id);
          if (value.length > 0) url += "&" + type + "=" + value;
        } else {
          url += "&" + type + "=" + adv_filters + "," + id;
          console.log("Not exist but has filter  ");
        }
      } else {
        url += "&" + type + "=" + id;
      }
    } else {
      type = "adv_filters";
      if (adv_filters != undefined) {
        url += "&" + type + "=" + adv_filters;
      }
    }

    if (filter_type != "adv_filters") {
      url += "&last=" + filter_type.slice(7, 8);
    } else {
      url += "&last=f";
    }

    if (url.length > 0) {
      router.push("/" + catalog + "/" + slug[0] + "?has_filter=true" + url);
    } else {
      router.push("/" + catalog + "/" + slug[0]);
    }
  }
  // Toggle filters
  function toggleFilters(e) {
    const h_sender = e;
    const sender_parent = h_sender.parentNode;
    const next_filters = sender_parent.nextElementSibling;
    console.log(sender_parent);
    const next_filters_display = next_filters.style.display;
    if (next_filters_display === "block") {
      next_filters.style.display = "none";
      h_sender.textContent = "See all";
      // sender_parent.class ="text-d13 text-dblue"
    } else {
      next_filters.style.display = "block";
      h_sender.textContent = "See Less";

      // sender_parent.nextElementSibling.textContent ="See All"
    }
  }
  return (
    <div className="">
      {isLoading && (
        <div className="absolute z-50 w-screen h-screen text-center  opacity-50 bg-dTransparentWhite flex items-center justify-center">
          <img
            src={"/images/loader.gif"}
            alt="loader-gif"
            heigh="110"
            width="110"
          />
        </div>
      )}
      <div className="w-full px-5">
        <div className=" hidden xl:flex lg:flex pt-2 pb-2  items-center text-xs  text-dgrey1 ">
          <div className="flex items-center">
            <Link
              href="/"
              className="hidden md:block text-dblack font-light truncate text-d12 md:text-tiny mr-2 hover:text-dblue"
              dangerouslySetInnerHTML={{
                __html: "Home"
              }}
            />{" "}
            <span className="text-d11 mt-1">{" >"}</span>
          </div>
          {data?.breadcrumbs?.map((bread) => (
            <div className="flex items-center text-d12" key={bread.text}>
              <p className=" mx-2">{bread.text.replace("&amp;", "&")}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex">
        <div className="w-1/5 px-5 ">
          {filters &&
            Object.keys(filters).map((key) => (
              <div>
                {filters[key].items.length > 0 && (
                  <div className="text-dcf pr-semibold leading-lfc font-bold capitalize ">
                    {filters[key].name}
                  </div>
                )}
                <div style={{ display: "block" }}>
                  {key ? (
                    <div>
                      {filters[key].items.slice(0, 5).map((filter) => (
                        <div key={Math.random()}>
                          {filters[key].name === "Light Color" ||
                          filters[key].name === "Color" ? (
                            <div
                              className="my-2 flex items-center cursor-pointer hover:text-dblue"
                              key={filter.name}
                              onClick={() =>
                                parseFilter(filters[key].id, filter.id)

                              }
                            >
                              <span className="flex w-10/12">
                                <span
                                  className={`flex w-7 h-7 ${checkFilter(
                                    filters[key].id,
                                    filters[key].name,
                                    filter
                                  )}`}
                                >
                                  <img
                                    src={filter.image}
                                    style={{
                                      padding: `1px`
                                    }}
                                    className={`w-12/12 rounded-full border border-dgreyRate`}
                                    alt="Not Found"
                                  />
                                </span>
                                <p className="py-2 mx-2 text-d14 leading-dtight w-8/12 font-light">
                                  {" "}
                                  {filter.name}
                                </p>
                              </span>
                              <span className="flex w-1/12"></span>
                              <span className="text-d14 text-right font-light opacity-70">
                                ({filter.count})
                              </span>
                            </div>
                          ) : (
                            <div>
                              <p
                                className="my-2 flex  items-center cursor-pointer hover:text-dblue "
                                key={filter.name}
                                onClick={() =>
                                  parseFilter(filters[key].id, filter.id)
                                }
                              >
                                <i>
                                  {checkFilter(
                                    filters[key].id,
                                    filter.name,
                                    filter
                                  )}
                                </i>
                                <span className="mx-2 text-d14 font-light w-full leading-dtight mb-1">
                                  {filter.name}
                                </span>

                                <span className="text-d14 text-right font-light opacity-70">
                                  ({filter.count})
                                </span>
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                      <div>
                        <label
                          className={
                            filters[key].items.length > 5
                              ? `text-dblue text-xs cursor-pointer`
                              : "hidden"
                          }
                          onClick={(e) => toggleFilters(e.target)}
                        >
                          See All
                        </label>
                      </div>
                      <div style={{ display: "none" }}>
                        {filters[key].items
                          .slice(5, filters[key].items.length)
                          .map((filter) => (
                            <div key={Math.random()}>
                              {filters[key].name === "Light Color" ||
                              filters[key].name === "Color" ? (
                                <div
                                  className="my-2 flex items-center cursor-pointer hover:text-dblue"
                                  key={filter.name}
                                  // onClick={() => parseFilter(filters[key].id, filter)}
                                >
                                  <span className="flex w-10/12">
                                    <span
                                      className={`flex w-7 h-7 ${checkFilter(
                                        filters[key].id,
                                        filters[key].name,
                                        filter
                                      )}`}
                                    >
                                      <img
                                        src={filter.image}
                                        style={{
                                          padding: `1px`
                                        }}
                                        className={`w-12/12 rounded-full border border-dgreyRate`}
                                        alt="Not Found"
                                      />
                                    </span>
                                    <p className="py-2 mx-2 text-d14 leading-dtight w-8/12 font-light">
                                      {" "}
                                      {filter.name}
                                    </p>
                                  </span>
                                  <span className="flex w-1/12"></span>
                                  <span className="text-d14 text-right font-light opacity-70">
                                    ({filter.count})
                                  </span>
                                </div>
                              ) : (
                                <div>
                                  <p
                                    className="my-2 flex float items-center cursor-pointer hover:text-dblue "
                                    key={filter.name}
                                    onClick={() =>
                                      parseFilter(filters[key].id, filter)
                                    }
                                  >
                                    <i>
                                      {checkFilter(
                                        filters[key].id,
                                        filter.name,
                                        filter
                                      )}
                                    </i>
                                    <span className="mx-2 text-d14 font-light w-full leading-dtight mb-1">
                                      {filter.name}
                                    </span>

                                    <span className="text-d14 text-right font-light opacity-70">
                                      ({filter.count})
                                    </span>
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ))}
        </div>
        <div className="w-4/5 ">
          <div className="grid grid-cols-5 min-h-screen">
            {data?.products?.map((item) => (
              <div className="p-1">
                <SingleProduct item={item}></SingleProduct>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CatalogPage;

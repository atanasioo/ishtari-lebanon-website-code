import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import SingleProduct from "../product/SingleProduct";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/swiper.min.css";
// import 'swiper/css/pagination.min.css';
// import 'swiper/css/navigation.min.css';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
// import { Navigation } from "swiper";
import { loader } from "/public/images/loader.gif";
import ReactPaginate from "react-paginate";
import WidgetsLoop from "../WidgetsLoop";
import {
  IoIosArrowDown,
  IoIosCheckbox,
  IoIosCheckboxOutline,
  IoMdCheckbox
} from "react-icons/io";
import { sanitizeHTML } from "../Utils";
import { FaList } from "react-icons/fa";
import { BsGrid } from "react-icons/bs";
import useDeviceSize from "../useDeviceSize";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import ScrollToTop from "react-scroll-to-top";
function CatalogPage(props) {
  // const [filters, setFilters] = useState(props.data?.filters );
  const { data } = props; //instead of productData
  // const {filters} = data; //instead of productData
  const filters = data?.filters;
  var isLoading = useRef(false);
  // const [data, setData] = useState(props.data);
  const [showSort, setShowSort] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [productDisplay, setProductDisplay] = useState("grid");
  const [width] = useDeviceSize();

  const productSetting = {
    speed: 200,
    slidesToShow: 8,
    slidesToScroll: 3,
    infinite: false
    // prevArrow: <CustomPrevArrows direction={"l"} />,
    // nextArrow: <CustomNextArrows direction={"r"} />
  };

  const productMSetting = {
    speed: 200,
    slidesToShow: 3.5,
    slidesToScroll: 3,
    infinite: false
  };

  function CustomPrevArrows({ direction, onClick, style, className }) {
    return (
      <div
        style={{ ...style, padding: "2px 5px" }}
        onClick={onClick}
        className="mySwiper"
      >
        <div className="swiper-button-prev"></div>
      </div>
    );
  }
  function CustomNextArrows({ direction, onClick, style, className }) {
    return (
      <div
        style={{ ...style, padding: "2px 5px" }}
        onClick={onClick}
        className="mySwiper"
      >
        <div className="swiper-button-next"></div>
      </div>
    );
  }

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

  const sortRef = useRef(null);
  const [sortValue, setSort] = useState({
    value: "p2co.sort_order-ASC",
    text: "Default"
  });
  const [topFilter, setTopFilter] = useState({
    show: false,
    name: "",
    offset: 0
  });

  const [showLimit, setShowLimit] = useState(false);

  const [limitValue, setLimit] = useState({
    value: "50",
    text: "50"
  });

  const limitRef = useRef(null);
  useOutsideLimit(limitRef);

  function useOutsideLimit(limitRef) {
    useEffect(() => {
      const checkIfClickedOutside = (e) => {
        // If the menu is open and the clicked target is not within the menu,
        if (
          showLimit &&
          limitRef.current &&
          !limitRef.current.contains(e.target)
        ) {
          if (showLimit) setTimeout(() => setShowLimit(false), 200);
        }
      };

      document.addEventListener("mousedown", checkIfClickedOutside);

      return () => {
        // Cleanup the event listener

        document.removeEventListener("mousedown", checkIfClickedOutside);
      };
    }, [showLimit]);
  }

  useOutsideSort(sortRef);

  function useOutsideSort(sortRef) {
    useEffect(() => {
      const checkIfClickedOutside = (e) => {
        // If the menu is open and the clicked target is not within the menu,
        if (
          // showSort &&
          sortRef.current &&
          !sortRef.current.contains(e.target)
        ) {
          if (showSort) setTimeout(() => setShowSort(false), 200);
        }
      };

      document.addEventListener("mousedown", checkIfClickedOutside);

      return () => {
        // Cleanup the event listener

        document.removeEventListener("mousedown", checkIfClickedOutside);
      };
    }, [showSort]);
  }

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */

      if (topFilter.show) {
        function handleClickOutside(event) {
          if (ref.current && !ref.current.contains(event.target)) {
            setTopFilter({
              show: false,
              name: topFilter.name,
              offset: topFilter.offset
            });
          }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }
    }, [ref, topFilter]);
  }

  function sortSetter(sortData) {
    setSort(sortData);
    setShowSort(false);
    let val = sortData["value"];
    let _order = "";
    let _sort = "";
    const i_o = val.indexOf("-");
    _sort = val.substring(0, i_o);
    _order = val.substring(i_o + 1);
    // const data = { sort: _sort, order: order };
    let now = "&sort=" + _sort + "&order=" + _order;

    if (sort == undefined) {
      if (!has_filter && page === undefined && limit === undefined) {
        now = "?" + now;
      }
      router.push(router.asPath + now);
    } else {
      const old = "&sort=" + sort + "&order=" + order;
      router.push(router.asPath.replace(old, now));
    }
  }

  function limitSetter(limitData) {
    setShowLimit(false);

    setLimit({
      value: limitData.value,
      text: limitData.text
    });
    // alert(now);
    var now = "&limit=" + limitData.value;

    if (limit == undefined) {
      if (!has_filter && page === undefined && sort === undefined) {
        now = "?" + now;
      }
      router.push(router.asPath + now);
    } else {
      const old = "&limit=" + limit;

      // alert(old);
      router.push(router.asPath.replace(old, now));
    }
  }

  const checkMainFilter = (filter) => {
    // let temp = "catalog-top-filter-not-selected";
    // filter.items.map((item) => {
    //   if (filter.id != undefined && filter_id==="filter_options")

    //   if( filter.includes(item.id)) {

    let filter_id = "";
    if (filter.id != undefined && filter.id === "filter_options") {
      filter_id = filter_options;
    }
    if (filter.id != undefined && filter.id === "filter_manufacturers") {
      filter_id = filter_manufacturers;
    }
    if (filter.id != undefined && filter.id === "filter_sellers") {
      filter_id = filter_sellers;
    }
    if (filter.id != undefined && filter.id === "filter_categories") {
      filter_id = filter_categories;
    }

    if (filter.id != undefined && filter.id === "adv_filters") {
      filter_id = adv_filters;
    }
    var count = 0;
    filter.items?.map((item) => {
      // console.log("###################### ")
      // console.log("Param1:", filter_categories);
      // console.log("Param2:", filter_manufacturers);
      // console.log("Param3:", filter_sellers);
      // console.log("Param4:", filter_options);
      // console.log("Param5:", page);
      // console.log(item.id)
      // console.log(filter_id)
      // console.log(filter.id)
      // console.log(filter_manufacturers )
      // console.log("###################### ")
      if ([filter_id]?.includes(item.id)) {
        count++;
      }
    });
    //   }
    // });
    if (count > 0) {
      return "catalog-top-filter-selected bg-white";
    } else {
      return "";
    }
  };

  const handleTopFilter = (name) => {
    const off = document.getElementById(`${name}`).offsetLeft;

    if (700 > 650) {
      if (topFilter.name === name && topFilter.show === true) {
        setTopFilter({
          show: false,
          name: name,
          offset: topFilter.offset
        });
      } else if (topFilter.name !== name && topFilter.show === true) {
        setTopFilter({
          show: true,
          name: name,
          offset: off > 531 ? 531 : off
        });
      } else {
        setTopFilter({
          show: true,
          name: name,
          offset: off > 531 ? 531 : off
        });
      }
    } else {
      setTopFilter({
        show: true,
        name: name,
        offset: off > 531 ? 531 : off
      });
    }
  };

  const handlePageClick = (event) => {
    const new_page = parseInt(event.selected) + 1;

    var now = "&page=" + new_page;
    if (page == undefined) {
      if (!has_filter && sort == undefined && limit == undefined) {
        now = "?" + now;
      } else {
        now = now;
      }
      router.push(router.asPath + now);
    } else {
      let old = "&page=" + page;
      router.push(router.asPath.replace(old, now));
    }
  };

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

    if (filter_type === "filter_manufacturers") {
      type = "filter_manufacturers";
      if (filter_manufacturers != undefined) {
        if (filter_manufacturers?.indexOf(id) > -1) {
          const value = filter_manufacturers
            ?.split(",")
            .filter((value) => value != id);
          if (value.length > 0) url += "&" + type + "=" + value;
        } else {
          url += "&" + type + "=" + filter_manufacturers + "," + id;
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
          const value = filter_sellers
            ?.split(",")
            .filter((value) => value != id);
          if (value.length > 0) url += "&" + type + "=" + value;
        } else {
          url += "&" + type + "=" + filter_sellers + "," + id;
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
          const value = filter_categories
            ?.split(",")
            .filter((value) => value != id);
          if (value.length > 0) url += "&" + type + "=" + value;
        } else {
          url += "&" + type + "=" + filter_categories + "," + id;
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
          const value = filter_options
            ?.split(",")
            .filter((value) => value != id);
          if (value.length > 0) url += "&" + type + "=" + value;
        } else {
          url += "&" + type + "=" + filter_options + "," + id;
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
          const value = adv_filters?.split(",").filter((value) => value != id);
          if (value.length > 0) url += "&" + type + "=" + value;
        } else {
          url += "&" + type + "=" + adv_filters + "," + id;
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
    // if (last !== undefined) {
    //   url += "&last=" + last;
    // }
    if (filter_type === "page") {
    } else {
      if (filter_type != "adv_filters") {
        url += "&last=" + filter_type.slice(7, 8);
      } else {
        url += "&last=f";
      }
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
    <div className="overflow-x-hidden">
      {width < 650 && (
        <ScrollToTop
          smooth
          className="rounded-full  bg-dgreyBlack text-white text-center opacity-70"
          width="36"
          height="30"
          color="white"
          top="1000"
          style={{ width: "50px", height: "50px", padding: "7px" }}
        />
      )}
      {data.isLoading && isLoading && (
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
        <div className="w-full mobile:w-1/5 mobile:px-5 ">
        {filters &&
            Object.keys(filters).map((key) => (
              <div className="hidden mobile:block">
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
                                    filters[key]?.id,
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
                                <p className="py-1 mx-2 text-d14 leading-dtight w-8/12 font-light">
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
        <div className=" w-full mobile:w-4/5 leading-dtight">
          <div className="flex justify-between">
            {/* Results found */}
            <div className="flex mx-1 mobile:w-4/12 pt-2 mobile:pt-1 ">
              <span className=" mr-2 font-light">
                {data.product_total} Results {data.heading_title && "for"}
              </span>
              {data.heading_title && '"'}
              <h1
                className="font-semibold capitalize text-d16"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHTML(data.heading_title)
                }}
              />
              {data.heading_title && '"'}
            </div>
            {/* Settings */}
            {/* Desktop setting */}

          </div>

          <div className="flex  mobile:hidden">
            <div className="w-screen bg-white -mx-4 mt-3">
              <div className="grid grid-cols-2 divide-x divide-dinputBorder bg-white py-2 rounded">
                <button
                  onClick={() => setShowMobileFilter(true)}
                  // onClick={() => setShowSort(!showSort)}
                >
                  <span>Filter</span>
                  <i className="icon icon-filter ml-1"></i>
                </button>
                {data?.products?.length > 0 && (
                  <button onClick={() => setShowMobileSort(!showSort)}>
                    <span>Sort By</span>
                    <i className="icon icon-sort ml-1"></i>
                  </button>
                )}
              </div>
              {showMobileSort && (
                <div
                  onClick={() => setShowMobileSort(false)}
                  className="bg-dblack bg-opacity-20 z-50 w-screen h-screen fixed top-0 left-0 flex justify-end"
                >
                  <div className="bg-white w-3/5 p-2">
                    {data?.sorts?.map((s) => (
                      <button
                        className="flex items-center justify-between  w-full"
                        onClick={() => sortSetter(s)}
                      >
                        <span
                          className=" block text-sm font-light px-4 py-2 cursor-pointer hover:bg-dblue hover:text-white"
                          key={s.value}
                          dangerouslySetInnerHTML={{
                            __html: s.text
                          }}
                        ></span>

                        {sort + "-" + order === s.value ? (
                          <input
                            type="checkbox"
                            className="font-light text-xl p-1"
                            checked
                          />
                        ) : (
                          <input
                            type="checkbox"
                            className="font-light text-xl p-1"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {data?.categories?.length > 0 &&
            data?.sub_category_status === "1" && (
              <div>
                {/* Desktop Categories */}
                <div className=" hidden lg:block w-full mt-3 mb-2 bg-white justify-cente mx-1">
      
                </div>
                {/* Mobile Categories */}
                <div className="block xl:hidden lg:hidden w-screen  -mx-4 mb-2">
                  {/* <div className="overflow-x-scroll flex px-2 "> */}
           
                </div>
              </div>
            )}
          {/* <div className="hidden mobile:block">
            {(page === undefined || page < 2) &&
              (data?.category_widget_status === "1" ||
                data?.desktop_widget_status === "1") &&
              data?.desktop_widgets?.map((widget) => (
                <div className="px-3">
                  {" "}
                  <WidgetsLoop widget={widget} />{" "}
                </div>
              ))}
          </div> */}
          {/* <div className="mobile:hidden">
            {
              //  page === undefined ||
              //   page < 2 &&
              (page === undefined || page < 2) &&
                (data?.category_widget_status === "1" ||
                  data?.mobile_widget_status === "1") &&
                data?.mobile_widgets?.map((widget) => (
                  <div className="px-3">
                    {" "}
                    <WidgetsLoop widget={widget} />
                  </div>
                ))
            }
            {(page === undefined || page < 2) &&
              (data?.category_widget_status === "1" ||
                data?.mobile_widget_status === "1") &&
              data?.widgets?.map((widget) => (
                <div className="px-3">
                  <WidgetsLoop widget={widget} />{" "}
                </div>
              ))}
          </div> */}
     
     {filters &&
            (filters[0]?.items?.length > 0 ||
              filters[1]?.items?.length > 0) && (
              <div className="  w-full block relative z-20 ">
                <div className="relative flex items-center mb-3 mt-4">
                  <div
                    className={`catalog-top-filter hidden mobile:block  ${
                      topFilter.show ? "catalog-top-filter-open " : ""
                    }`}
                    style={{ left: topFilter.offset }}
                    ref={wrapperRef}
                  >
                    <div className="px-1 ">
                      {data.filters.findIndex(
                        (x) => x.name === topFilter.name
                      ) !== -1 && (
                        <div className="pb-4 px-3">
                          <div className="flex place-content-between place-items-center px-4 w-52">
                            {" "}
                            <div className=" w-full py-4">
                              {data.filters[
                                data.filters.findIndex(
                                  (x) => x.name === topFilter.name
                                )
                              ].name
                                .charAt(0)
                                .toUpperCase() +
                                data.filters[
                                  data.filters.findIndex(
                                    (x) => x.name === topFilter.name
                                  )
                                ].name.slice(1)}
                            </div>
                            <button
                              className="sizeClear"
                              onClick={() =>
                                clearFilter(
                                  data.filters[
                                    data.filters.findIndex(
                                      (x) => x.name === topFilter.name
                                    )
                                  ]
                                )
                              }
                            ></button>
                          </div>
                          <div className="h-auto pb-4">
                            {filters && (
                              <div className="">
                                {filters[
                                  data.filters.findIndex(
                                    (x) => x.name === topFilter.name
                                  )
                                ]?.items?.map((filter, key) => (
                                  <div
                                    className="w-auto px-3 py-1"
                                    key={Math.random()}
                                  >
                                    {filters[
                                      data.filters.findIndex(
                                        (x) => x.name === topFilter.name
                                      )
                                    ].name === "Light Color" ||
                                    filters[
                                      data.filters.findIndex(
                                        (x) => x.name === topFilter.name
                                      )
                                    ].name === "Color" ? (
                                      <p
                                        className=" flex items-center justify-between  cursor-pointer hover:text-dblue"
                                        key={filter.name}
                                        onClick={() =>
                                          parseFilter(
                                            filters[
                                              data.filters.findIndex(
                                                (x) => x.name === topFilter.name
                                              )
                                            ].id,
                                            filter.id
                                          )
                                        }
                                      >
                                        <span className="flex">
                                          <img
                                            src={filter.image}
                                            style={{
                                              padding: `2px`
                                            }}
                                            className={`w-7 h-7 rounded-full mr-1 ${checkFilter(
                                              filters[key]?.id,
                                              filter.name,
                                              filter
                                            )}`}
                                            alt={filters[key]?.id}
                                          />

                                          <p className="pt-1 mx-2 text-d13 w-8/12 font-light">
                                            {" "}
                                            {filter.name}
                                          </p>
                                        </span>
                                        <span className="text-d13 text-right font-light ">
                                          ({filter.count})
                                        </span>
                                      </p>
                                    ) : filters[
                                        data.filters.findIndex(
                                          (x) => x.name === topFilter.name
                                        )
                                      ].name === "jeans Size" ||
                                      filters[
                                        data.filters.findIndex(
                                          (x) => x.name === topFilter.name
                                        )
                                      ].name === "Shoes Size" ? (
                                      <div
                                        className={` ${
                                          1500 >= 1400 ? "w-48" : "w-28"
                                        } `}
                                        onClick={() =>
                                          parseFilter(
                                            filters[
                                              data.filters.findIndex(
                                                (x) => x.name === topFilter.name
                                              )
                                            ].id,
                                            filter.id
                                          )
                                        }
                                      >
                                        {checkFilter(
                                          filters[
                                            data.filters.findIndex(
                                              (x) => x.name === topFilter.name
                                            )
                                          ]?.id,
                                          filter.name,
                                          filter
                                        )}
                                        <span className="text-d13 font-light">
                                          {filter.name}
                                        </span>
                                        {data.filters.findIndex(
                                          (x) => x.name === topFilter.name
                                        )}

                                        <span className="float-right text-d13 font-light">
                                          ({filter.count})
                                        </span>
                                      </div>
                                    ) : (
                                      filters[
                                        data.filters.findIndex(
                                          (x) => x.name === topFilter.name
                                        )
                                      ].name !== "Socks" &&
                                      filters[
                                        data.filters.findIndex(
                                          (x) => x.name === topFilter.name
                                        )
                                      ].name !== "Size by Age" && (
                                        <div>
                                          <p
                                            className=" flex justify-between items-center cursor-pointer hover:text-dblue"
                                            key={filter.name}
                                            onClick={() =>
                                              parseFilter(
                                                filters[
                                                  data.filters.findIndex(
                                                    (x) =>
                                                      x.name === topFilter.name
                                                  )
                                                ].id,
                                                filter.id
                                              )
                                            }
                                          >
                                            <div className="">
                                              <i>
                                                {checkFilter(
                                                  filters[
                                                    data.filters.findIndex(
                                                      (x) =>
                                                        x.name ===
                                                        topFilter.name
                                                    )
                                                  ]?.id,
                                                  filter.name,
                                                  filter
                                                )}
                                              </i>
                                              <span className="text-d13 font-light ml-1">
                                                {filter.name}
                                              </span>
                                            </div>
                                            <span className="float-right text-d13 font-light">
                                              ({filter.count})
                                            </span>
                                          </p>
                                        </div>
                                      )
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`mobile-catalog-filter block mobile:hidden ${
                      topFilter.show && "mobile-catalog-filter-open"
                    }`}
                  >
                    <div
                      className={`${
                        topFilter.show && "opacity-100"
                      }  mobile-catalog-blur`}
                      onClick={() =>
                        setTopFilter({
                          show: false,
                          name: topFilter.name,
                          offset: 0
                        })
                      }
                    ></div>
                    <div
                      className={` ${
                        topFilter.show && "bottom-0"
                      } mobile-catalog-container`}
                    >
                      <div
                        className="w-full h-5 mobile-catalog-container-before"
                        onTouchEnd={() =>
                          setTopFilter({
                            show: false,
                            name: topFilter.name,
                            offset: 0
                          })
                        }
                      ></div>
                      <div
                        className={`relative px-6 py-8`}
                        style={{ maxHeight: "700px" }}
                      >
                        <div className="flex place-content-between place-items-center pb-2 ">
                          <h3 className="font-bold text-lg">
                            {data.filters[
                              data.filters.findIndex(
                                (x) => x.name === topFilter.name
                              )
                            ]?.name
                              .charAt(0)
                              .toUpperCase() +
                              data.filters[
                                data.filters.findIndex(
                                  (x) => x.name === topFilter.name
                                )
                              ]?.name.slice(1)}
                          </h3>
                          <button
                            className="text-dblue cursor-pointer text-sm bg-transparent"
                            onClick={() =>
                              clearFilter(
                                data.filters[
                                  data.filters.findIndex(
                                    (x) => x.name === topFilter.name
                                  )
                                ]
                              )
                            }
                          >
                            Clear
                          </button>
                        </div>
                        <div
                          className="overflow-y-auto pt-4 pb-4 -mr-6 pr-6  catalog-mobile-scroll"
                          style={{ height: "65vh" }}
                        >
                          {filters && (
                            <div className="grid grid-cols-1">
                              {filters[
                                data.filters.findIndex(
                                  (x) => x.name === topFilter.name
                                )
                              ]?.items?.map((filter, key) => (
                                <div
                                  className="w-full px-3 py-1"
                                  key={Math.random()}
                                >
                                  {filters[
                                    data.filters.findIndex(
                                      (x) => x.name === topFilter.name
                                    )
                                  ].name === "Light Color" ||
                                  filters[
                                    data.filters.findIndex(
                                      (x) => x.name === topFilter.name
                                    )
                                  ].name === "Color" ? (
                                    <p
                                      className=" flex items-center justify-between cursor-pointer hover:text-dblue"
                                      key={filter.name}
                                      onClick={() =>
                                        parseFilter(filters[key].id, filter.id)
                                      }
                                    >
                                      <span className="flex">
                                        <img
                                          src={filter.image}
                                          style={{
                                            padding: `2px`
                                          }}
                                          className={`w-7 h-7 rounded-full  pt-5 ${checkFilter(
                                            filters[key]?.id,
                                            filter.name,
                                            filter
                                          )}`}
                                          alt={filter.name}
                                        />

                                        <p className="p-2 mx-2 text-d13 w-8/12 font-light">
                                          {" "}
                                          {filter.name} -{" "}
                                          {data.filters.findIndex(
                                            (x) => x.name === topFilter.name
                                          )}
                                        </p>
                                      </span>
                                      <span className="text-d13  text-right font-light ">
                                        ({filter.count})
                                      </span>
                                    </p>
                                  ) : (
                                    <div>
                                      <p
                                        className="my-1 float items-center cursor-pointer hover:text-dblue"
                                        key={filter.name}
                                        onClick={() =>
                                          parseFilter(
                                            filters[key].id,
                                            filter.id
                                          )
                                        }
                                      >
                                        <i
                                          className={`icon mr-1 text-base  ${checkFilter(
                                            filters[
                                              data.filters.findIndex(
                                                (x) => x.name === topFilter.name
                                              )
                                            ].id,
                                            filter.name,
                                            filter
                                          )}`}
                                        ></i>
                                        <span className="text-d13 font-light">
                                          {filter.name}
                                          {data.filters.findIndex(
                                            (x) => x.name === topFilter.name
                                          )}
                                        </span>

                                        <span className="float-right text-d13 font-light">
                                          ({filter.count})
                                        </span>
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div
                    className={` ${
                      700 > 650
                        ? "button-wrapper overflow-hidden"
                        : "overflow-x-auto py-1"
                    } items-center w-full whitespace-nowrap`}
                    id={`button-wrapper`}
                  >
                    <Swiper
                      slidesPerView={"auto"}
                      freeMode={true}
                      draggable={false}
                      pagination={false}
                      navigation={true}
                      // modules={[Navigation]}
                      className="myFilterSwiper"
                    >
                      {data.filters.map((filter) => {
                        return (
                          filter.items.length > 0 &&
                          filter.name !== "Socks" &&
                          filter.name !== "Size by Age" && (
                            <SwiperSlide
                              key={Math.random()}
                              id={filter.name}
                              onClick={() => handleTopFilter(filter.name)}
                            >
                              <button className="p-1 " id={filter.name}>
                                <div
                                  className={`text-d14 px-3 py-1 flex-nowrap bg-dgreyRate flex justify-between items-center rounded-2xl ${checkMainFilter(
                                    filter
                                  )}`}
                                  // style={{
                                  //   paddingTop: "5px",
                                  //   paddingBottom: "5px"
                                  // }}
                                >
                                  <span className="w-max">
                                    {filter.name.charAt(0).toUpperCase() +
                                      filter.name.slice(1)}
                                  </span>
                                  <span className="ml-2">
                                    <IoIosArrowDown className="text-d18" />
                                  </span>
                                </div>
                              </button>
                            </SwiperSlide>
                          )
                        );
                      })}
                      {data.filters.map((filter) => {
                        return (
                          filter.items.length > 0 &&
                          filter.items.map((item) => {
                            if (
                              filter.id != undefined &&
                              filter.id.replace('"', "").includes(item.id)
                            ) {
                              // console.log(userFilters);
                              return (
                                <SwiperSlide>
                                  <button
                                    className="p-1 "
                                    onClick={() => parseFilter(filter.id, item)}
                                  >
                                    <div
                                      className={`text-d14 bg-dgreyRate px-3 flex-nowrap flex justify-between items-center rounded-2xl catalog-top-filter-selected`}
                                      // style={{
                                      //   paddingTop: "6px",
                                      //   paddingBottom: "6px"
                                      // }}
                                    >
                                      <span className="w-max">{item.name}</span>
                                      <span className="ml-2">
                                        <AiOutlineClose className="text-d18" />
                                      </span>
                                    </div>
                                  </button>
                                </SwiperSlide>
                              );
                            }
                          })
                        );
                      })}
                      {data.filters.map((filter) => {
                        return (
                          filter.items.length > 0 &&
                          filter.items.slice(0, 3).map((item) => {
                            if (
                              filter.id != undefined &&
                              !filter.id.includes(item.id)
                            ) {
                              if (filter.name === "Sellers") {
                                const temp = Math.max(
                                  ...filter.items.map((o) => {
                                    if (
                                      filter.id != undefined &&
                                      !filter.id.includes(o.id)
                                    ) {
                                      return Number(o.count);
                                    }
                                  })
                                );

                                if (temp && Number(item.count) === temp) {
                                  return (
                                    <SwiperSlide>
                                      <button
                                        className="p-1 "
                                        onClick={() =>
                                          parseFilter(filter.id, item.id)
                                        }

                                        // onClick={() =>
                                        //   parseFilter(
                                        //     filters[
                                        //       data.filters.findIndex(
                                        //         (x) => x.name === topFilter.name
                                        //       )
                                        //     ].id,
                                        //     item.id
                                        //   )
                                        // }
                                      >
                                        <div
                                          className={`text-d14 px-3 py-1 overflow-hidden flex-nowrap flex justify-between items-center bg-dgreyRate rounded-2xl `}
                                          // style={{
                                          //   paddingTop: "6px",
                                          //   paddingBottom: "6px"
                                          // }}
                                        >
                                          <span className="w-max">
                                            <span className="font-bold mr-1">
                                              Seller:
                                            </span>
                                            {item.name}
                                          </span>
                                        </div>
                                      </button>
                                    </SwiperSlide>
                                  );
                                }
                              } else if (filter.name === "Brands") {
                                const temp = Math.max(
                                  ...filter.items.map((o) => {
                                    if (
                                      filter.id != undefined &&
                                      !filter.id.includes(o.id)
                                    ) {
                                      return Number(o.count);
                                    }
                                  })
                                );
                                if (temp && Number(item.count) === temp) {
                                  return (
                                    <SwiperSlide>
                                      <button
                                        className="p-1"
                                        onClick={() =>
                                          parseFilter(filter.id, item.id)
                                        }
                                      >
                                        <div
                                          className={`text-d14 px-3 py-1  flex-nowrap flex justify-between items-center rounded-2xl bg-dgreyRate catalog-top-filter-not-selected`}
                                        >
                                          <span className="w-max">
                                            <span className="font-bold mr-1">
                                              Brand:
                                            </span>
                                            {item.name}
                                          </span>
                                        </div>
                                      </button>
                                    </SwiperSlide>
                                  );
                                }
                              } else if (filter.name === "Color") {
                                const temp = Math.max(
                                  ...filter.items.map((o) => {
                                    if (
                                      filter.id != undefined &&
                                      !filter.id.includes(o.id)
                                    ) {
                                      return Number(o.count);
                                    }
                                  })
                                );
                                if (temp && Number(item.count) === temp) {
                                  return (
                                    <SwiperSlide>
                                      <button
                                        className="p-1"
                                        onClick={() =>
                                          parseFilter(filter.id, item.id)
                                        }
                                      >
                                        <div
                                          className={`text-d14 py-1 px-3 flex-nowrap flex justify-between items-center rounded-2xl bg-dgreyRate catalog-top-filter-not-selected`}
                                        >
                                          <span className="w-max">
                                            <span className="font-bold mr-1">
                                              Color:
                                            </span>
                                            {item.name}
                                          </span>
                                        </div>
                                      </button>
                                    </SwiperSlide>
                                  );
                                }
                              } else if (filter.name === "Shoes size") {
                                const temp = Math.max(
                                  ...filter.items.map((o) => {
                                    if (
                                      filter.id != undefined &&
                                      filter.id
                                        .replaceAll('"', "")
                                        .includes(o.id)
                                    ) {
                                      return Number(o.count);
                                    }
                                  })
                                );
                                if (
                                  temp &&
                                  Number(item.count) === temp &&
                                  filter.items.length < 3
                                ) {
                                  return (
                                    <SwiperSlide>
                                      <button
                                        className="p-1"
                                        onClick={() =>
                                          parseFilter(filter.id, item.id)
                                        }
                                      >
                                        <div
                                          className={`text-d14 px-3 flex-nowrap flex justify-between items-center rounded-2xl bg-dgreyRate catalog-top-filter-not-selected`}
                                          // style={{
                                          //   paddingTop: "6px",
                                          //   paddingBottom: "6px"
                                          // }}
                                        >
                                          <span className="w-max">
                                            <span className="font-bold mr-1">
                                              Shoes Size:
                                            </span>
                                            {item.name}
                                          </span>
                                        </div>
                                      </button>
                                    </SwiperSlide>
                                  );
                                } else {
                                  return (
                                    <SwiperSlide>
                                      <button
                                        className="p-1"
                                        onClick={() =>
                                          parseFilter(filter.id, item.id)
                                        }
                                      >
                                        <div
                                          className={`text-d14 bg-dgreyRate px-3 py-1 flex-nowrap flex justify-between items-center rounded-2xl catalog-top-filter-not-selected`}
                                        >
                                          <span className="w-max">
                                            <span className="font-bold mr-1">
                                              Shoes Size:
                                            </span>
                                            {item.name}
                                          </span>
                                        </div>
                                      </button>
                                    </SwiperSlide>
                                  );
                                }
                              }
                            }
                          })
                        );
                      })}
                    </Swiper>
                  </div> */}
                </div>
              </div>
            )}
          <div
            className={`grid transition-all mobile:pt-2 ${
              productDisplay === "grid"
                ? "grid-cols-2 xl:grid-cols-5 lg:grid-cols-5 gap-2 "
                : "grid-cols-1"
            }`}
          >
            {" "}
            {data?.products?.map((item) => (
              <div className="p-1">
                <SingleProduct
                  item={item}
                  isSlider={true}
                  isList={productDisplay === "grid" ? false : true}
                ></SingleProduct>
              </div>
            ))}
          </div>
          {data?.total_pages > 1 && (
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
                forcePage={Number(page) > 0 ? Number(page) - 1 : 0}
              />
            </div>
          )}
        </div>
      </div>

      {filters && showMobileFilter && (
        <div className="bg-white fixed w-full z-30 top-0 pl-2 pr-7 h-screen py-3">
          <div className="flex justify-between">
            <div className="text-d22">Filters</div>{" "}
            <div
              className="text-d25 py-2"
              onClick={() => setShowMobileFilter(false)}
            >
              <AiOutlineClose />
            </div>
          </div>
          {Object.keys(filters).map((key) => (
            <div className="py-2">
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
                                  filters[key]?.id,
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
                              <p className="py-1 mx-2 text-d14 leading-dtight w-8/12 font-light">
                                {" "}
                                {filter.name}
                              </p>
                            </span>
                            <span className="flex w-2/12"></span>
                            <span className="text-d14 text-right font-light opacity-70 ">
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
      )}
    </div>
  );
}

export default CatalogPage;

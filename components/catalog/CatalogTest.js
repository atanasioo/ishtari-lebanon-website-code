import React, { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/router";
import SingleProduct from "../product/SingleProduct";
import Link from "next/link";
import dynamic from "next/dynamic";
import Slider from "react-slick";
import Image from "next/image";
import ReactPaginate from "react-paginate";
import WidgetsLoop from "../WidgetsLoop";
import { IoIosArrowDown } from "react-icons/io";
import { sanitizeHTML } from "../Utils";
import { FaList } from "react-icons/fa";
import { BsChevronLeft, BsChevronRight, BsGrid } from "react-icons/bs";
import useDeviceSize from "../useDeviceSize";
import { AiOutlineClose } from "react-icons/ai";
import ScrollToTop from "react-scroll-to-top";
import { useMarketingData } from "@/contexts/MarketingContext";
import { axiosServer } from "@/axiosServer";
import Cookies from "js-cookie";
import buildLink, { pixelID } from "@/urls";
import { AccountContext } from "@/contexts/AccountContext";
import CatalogPlaceholder from "./CatalogPlaceholder";
import NoData from "../NoData";
import CatalogMobilePlaceholder from "./CatalogMobilePlaceholder";
function CatalogTest(props) {
  const { slugId, type_id, AdminToken, catalogId } = props; //instead of productData
  // console.log(props)
  const [data, setData] = useState([]);
  const filters = data?.filters;
  var isLoading = useRef(false);
  const [showSort, setShowSort] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const { showStats } = useMarketingData();
  const [bannerStats, setBannerStats] = useState([]);
  const [state] = useContext(AccountContext);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [productDisplay, setProductDisplay] = useState("grid");
  const [width] = useDeviceSize();
  const { marketingData, setMarketingData } = useMarketingData();

  const SwiperComponent = dynamic(() => import("./SwiperComponent"), {
    ssr: false
  });
  const productSetting = {
    speed: 200,
    slidesToShow: 8,
    slidesToScroll: 3,
    infinite: false,
    prevArrow: <CustomPrevArrows direction={"l"} />,
    nextArrow: <CustomNextArrows direction={"r"} />
  };

  const productMSetting = {
    speed: 200,
    slidesToShow: 3.5,
    slidesToScroll: 3,
    infinite: false
  };

  const sliderRef = useRef(null);

  const handleLinkClick = () => {
    //for marketing
    setMarketingData({
      ignore: false,
      banner_image_id: "",
      source_type: props.type,
      source_type_id: catalog_id
    });
  };

  // const SingleProduct = dynamic(() => import('../product/SingleProduct'), {
  //   loading: () => <p>Loading...</p>,
  // })
  useEffect(() => {
    const isOverflowingRight = false;
    const isOverflowingLeft = false;

    const sliderElement = sliderRef.current;
    if (!sliderElement) return;

    const slider = sliderElement.querySelector(".slider-con");

    const contentElement = sliderElement.querySelector(".slider-content");
    const arrowLeftElement = sliderElement.querySelector(".slider-arrow-left");
    const arrowRightElement = sliderElement.querySelector(
      ".slider-arrow-right"
    );

    const handleResize = () => {
      // const isOverflowing = contentElement.offsetWidth < contentElement.scrollWidth;
      const maxScroll = contentElement.scrollWidth - contentElement.clientWidth;
      var scrollRight = maxScroll - contentElement.scrollLeft;
      const sliderWidth = sliderElement.offsetWidth;
      const contentWidth = contentElement.scrollWidth;
      const maxScrolld = contentWidth - sliderWidth;
      // alert(maxScrolld)

      // const sliderWidth = sliderElement.offsetWidth;
      // const contentWidth = contentElement.scrollWidth;
      // const maxScroll = contentWidth - sliderWidth;
      const isOverflowingLeft = true;
      const isOverflowingRight =
        contentElement.scrollLeft + contentElement.clientWidth <
        contentElement.scrollWidth;

      // arrowLeftElement.style.display = isOverflowingLeft ? "block" : "none";
      arrowRightElement.style.display = isOverflowingRight ? "block" : "none";

      if (isOverflowingRight) {
        // arrowLeftElement.addEventListener('click', slideLeft);
        arrowRightElement.addEventListener("click", slideRight);
      } else {
        arrowLeftElement.addEventListener("click", slideLeft);
      }
      arrowLeftElement.addEventListener("click", slideLeft);
      arrowRightElement.addEventListener("click", slideRight);

      // if (isOverflowingLeft) {
      //   alert(1)
      //   arrowLeftElement.addEventListener("click", slideLeft);
      // } else {
      //   // arrowLeftElement.removeEventListener('click', slideLeft);
      //   // arrowLeftElement.addEventListener("click", slideRight);

      // }
    };

    const slideLeft = () => {
      contentElement.style.transform = `translateX(0px)`;
      contentElement.style.behavior = "smooth";

      arrowLeftElement.style.display = "none";
      arrowRightElement.style.display = "block";
    };

    const slideRight = () => {
      const sliderWidth = sliderElement.offsetWidth;
      const contentWidth = contentElement.scrollWidth;
      const maxScroll = contentWidth - sliderWidth;

      contentElement.style.transform = `translateX(-${maxScroll}px)`;

      arrowLeftElement.style.display = "block";
      arrowRightElement.style.display = "none";
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  function setLeft() {
    contentElement.style.transform = "translateX(0)";
  }
  function CustomPrevArrows({ direction, onClick, style, className }) {
    return (
      <div
        style={{ ...style, padding: "2px 5px" }}
        onClick={onClick}
        className="mySwiper cursor-pointer"
      >
        <div className="swiper-button-prev flex justify-center items-center">
          <BsChevronLeft className="text-dblack" />
        </div>
      </div>
    );
  }
  function CustomNextArrows({ direction, onClick, style, className }) {
    return (
      <div
        style={{ ...style, padding: "2px 5px" }}
        onClick={onClick}
        className="mySwiper cursor-pointer"
      >
        <div className="swiper-button-next flex justify-center items-center mr-1">
          <BsChevronRight className="text-dblack" />
        </div>
      </div>
    );
  }

  const router = useRouter();
  // console.log(router.query);
  const catalog_id = type_id;

  const {
    filter_categories,
    filter_manufacturers,
    filter_sellers,
    filter_options,
    filter,
    adv_filters,
    has_filter,
    last,
    page,
    sort,
    order,
    limit
  } = router.query;

  const slug = router.query.slug || slugId;
  const catalog = catalogId || router.query.catalog;

  // console.log(slug);
  // console.log("catalogid", catalog);

  useEffect(() => {
    setLoading(true);
    var type;
    var id;
    var link;
    var path = "&path=";
    if (
      catalog === "category" ||
      catalog === "manufacturer" ||
      catalog === "seller" ||
      slug[0].includes("c=") ||
      slug[0].includes("m=") ||
      slug[0].includes("s=")
    ) {
      // console.log(slug);
      if (catalog === "category" || slug[0].includes("c=")) {
        type = "category";
        if (slug[0].includes("c=")) {
          id = slug[0].split("=")[1];
        } else {
          id = slug[0];
        }
      } else if (catalog === "manufacturer" || slug[0].includes("m=")) {
        type = "manufacturer";
        if (slug[0].includes("m=")) {
          id = slug[0].split("=")[1];
        } else {
          id = slug[0];
        }
        path = "&manufacturer_id=";
      } else if (catalog === "seller" || slug[0].includes("s=")) {
        type = "seller";
        if (slug[0].includes("s=")) {
          id = slug[0].split("=")[1];
        } else {
          id = slug[0];
        }
        path = "&seller_id=";
      }
      var filters = "";
      if (!has_filter) {
        if (filter != undefined) {
          filters += "?&filters=" + filter;
        }

        if (limit != undefined) {
          filters += "&limit=" + limit;
        } else {
          filters += "&limit=50";
        }
        if (page != undefined) {
          filters += "&page=" + page;
        }

        if (sort !== undefined && order !== undefined) {
          filters += "&sort=" + sort;
          filters += "&order=" + order;
        }
        // } else {

        link =
          buildLink(type, undefined, undefined) +
          id +
          "&source_id=1" +
          filters +
          (typeof AdminToken !== "undefined" ? "&adm_quantity=true" : "");
        // console.log("FFFFFFFFFFFFFF1111");
        // console.log(link);
        axiosServer.get(link).then((response) => {
          if (
            response?.data.success == false ||
            (response.data?.data?.products?.length < 1 &&
              response.data?.data?.desktop_widgets?.length < 1 &&
              response.data?.data?.widgets?.length < 1)
          ) {
            // router.push("/404");
            setNotFound(true);
            setLoading(false);
          } else {
            setLoading(false);
            setData(response?.data?.data);
          }
        });

        // console.log(data);
      } else {
        var filters = "";
        if (has_filter !== undefined) {
          filters += "&has_filter=" + has_filter;
        }
        if (filter_categories !== undefined) {
          filters += "&filter_categories=" + filter_categories;
        }
        if (filter_manufacturers !== undefined) {
          filters += "&filter_manufacturers=" + filter_manufacturers;
        }
        if (filter_sellers !== undefined) {
          filters += "&filter_sellers=" + filter_sellers;
        }
        if (filter_options != undefined) {
          filters += "&filter_options=" + filter_options;
        }
        if (adv_filters != undefined) {
          filters += "&adv_filters=" + adv_filters;
        }

        if (filter != undefined) {
          filters += "&filters=" + filter;
        }
        if (page != undefined) {
          filters += "&page=" + page;
        }
        if (last != undefined) {
          filters += "&last=" + last;
        }

        if (sort !== undefined && order !== undefined) {
          filters += "&sort=" + sort;
          filters += "&order=" + order;
        }

        if (limit != undefined) {
          filters += "&limit=" + limit;
        } else {
          filters += "&limit=50";
        }

        link =
          buildLink("filter", undefined, undefined) +
          path +
          id +
          filters +
          (typeof AdminToken !== "undefined" ? "&adm_quantity=true" : "");

        axiosServer.get(link).then((response) => {
          if (
            response.data.success == false ||
            (response.data.data.products.length < 1 &&
              response.data.data.desktop_widgets.length < 1 &&
              response.data.data.widgets.length < 1)
          ) {
            setNotFound(true);
            setLoading(false);
            // router.push("/404");
          } else {
            setLoading(false);
            setData(response?.data?.data);
          }
        });

        // console.log(data);
      }
    } else {
      //redirect to 404
       setNotFound(true);
       setLoading(false);

    }
  }, [router]);

  const clearFilter = (filter) => {
    setTopFilter({
      show: false,
      name: "",
      offset: 0
    });

    let params = new URLSearchParams(location.search);
    if (filter.id === "filter_sellers") {
      params && params.delete("filter_sellers");
    } else if (filter.id === "filter_manufacturers") {
      params && params.delete("filter_manufacturers");
    } else if (filter.id === "filter_options") {
      params && params.delete("filter_options");
    } else if (filter.id === "filter_categories") {
      params && params.delete("filter_categories");
    } else if (filter.id === "adv_filters") {
      params && params.delete("adv_filters");
    } else if (filter.id === "filter_price") {
      params && params.delete("filter_price");
    }

    if (
      params &&
      (typeof params === "string" || params instanceof String) &&
      !params.includes("filters") &&
      !params.includes("&filter_") &&
      params.includes("has_filter")
    ) {
      params.delete("has_filter");
      params.delete("last");
    }
    router.push({ pathname: "/" + catalog + "/" + slug, search: params });
  };

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
          if (
            ref.current &&
            !ref.current.contains(event.target) &&
            width > 650
          ) {
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
      if ([filter_id]?.includes(item.id)) {
        count++;
      }
    });

    if (count > 0) {
      return "catalog-top-filter-selected bg-white";
    } else {
      return "";
    }
  };

  const handleTopFilter = (name) => {
    const off = document.getElementById(`${name}`).offsetLeft;

    if (width > 650) {
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
    if (
      filter_options != undefined &&
      (name === "Color" || name === "Light color")
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
    // console.log(url);
    if (url.length > 8) {
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

  async function initializeReactPixel() {
    return import("react-facebook-pixel").then((module) => module.default);
  }



  //marketing analytics

  let productArray = [];

  useEffect(() => {
    // console.log(data?.social_data)
    var dataSocial = data?.social_data;
    if (typeof dataSocial !== "undefined") {
      dataSocial["fbp"] = Cookies.get("_fbp");
      dataSocial["fbc"] = Cookies.get("_fbc");
      dataSocial["ttp"] = Cookies.get("_ttp");
      dataSocial["link"] = window.location.href;
      dataSocial["view_type"] = props.type;
      dataSocial["view_type_id"] = catalog_id;
      if (
        marketingData.source_type === "" ||
        marketingData.source_type === null ||
        typeof marketingData.source_type === "undefined"
      ) {
        dataSocial["ignore"] = true;
      } else {
        dataSocial["source_type"] = marketingData.source_type;
        dataSocial["source_type_id"] = marketingData.source_type_id;
        dataSocial["banner_image_id"] = marketingData.banner_image_id
          ? marketingData.banner_image_id
          : "";
      }

      if (typeof window !== "undefined" && !state.admin) {
        const productDetails = [];
        data?.products?.map((p) => {
          productArray.push(p.product_id);
          productDetails.push({ id: p.product_id, quantity: p.quantity });
        });
        let ReactPixel;

        // ---> Facebook PIXEL <---

        const advancedMatching = {
          em: data?.social_data?.email,
          fn: data?.social_data?.firstname,
          ln: data?.social_data?.lastname,
          external_id: data?.social_data?.external_id,
          country: data?.social_data?.country_code,
          fbp: Cookies.get("_fbp")
        };

        initializeReactPixel().then((reactPixelModule) => {
          ReactPixel = reactPixelModule; // Assign the default export to the variable
          ReactPixel.init(pixelID, advancedMatching, {
            debug: true,
            autoConfig: false
          });
          ReactPixel.pageView();
          ReactPixel.fbq("track", "PageView");

          window.fbq(
            "track",
            "ViewContent",
            {
              content_type: "product",
              content_ids: productArray,
              contents: productDetails,
              content_name: data?.social_data?.name
            },
            { eventID: data?.social_data?.event_id }
          );
        });
      }

      axiosServer
        .post(buildLink("pixel", undefined, window.innerWidth), dataSocial)
        .then((response) => {
          const data = response.data;
          if (data.success === true) {
          }
        });
    }
  }, [router , data]);

  //page view conversion for google ads
  useEffect(() => {
    if (!state.admin) {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      if (
        window.location.host === "www.ishtari.com" ||
        window.location.host === "next.ishtari.com" ||
        window.location.host === "ishtari-mobile.com"
      ) {
        gtag("event", "conversion", {
          send_to: "AW-991347483/pc3dCIaww44YEJuG29gD",
          ids: data?.social_data?.content_ids
        });
      } else if (
        window.location.host === "www.ishtari.com.gh" ||
        window.location.host === "next.ishtari.com.gh"
      ) {
        gtag("event", "conversion", {
          send_to: "AW-10993907106/31DICLmKppEYEKLrpvoo",
          ids: data?.social_data?.content_ids
        });
      }
    }
  }, [data, state.admin]);

  function fetchBannerStats(widgets) {
    const banner_image_ids = [];

    widgets.forEach((widget) => {
      if (widget.display === "grid" || widget.display === "slider") {
        widget.items.forEach((item) => {
          banner_image_ids.push(item.banner_image_id);
        });
      }
    });

    return banner_image_ids.join(",");
  }

  useEffect(() => {
    if (
      state.admin &&
      showStats &&
      (data?.category_widget_status === "1" ||
        data?.desktop_widget_status === "1" ||
        data?.mobile_widget_status === "1")
    ) {
      let widgets = [];
      if (width > 650 && data?.desktop_widgets?.length > 0) {
        widgets = data.desktop_widgets;
      } else if (width < 650 && data?.mobile_widgets?.length > 0) {
        widgets = data.mobile_widgets;
      } else if (width < 650 && data?.widgets?.length > 0) {
        widgets = data.widgets;
      }

      if (widgets.length > 0) {
        const banner_image_ids = fetchBannerStats(widgets);

        const obj = {
          source_type: props.type,
          source_type_id: catalog_id,
          banner_image_ids
        };

        axiosServer.post(buildLink("banner_stats"), obj).then((response) => {
          setBannerStats(response.data.data);
        });
      }
    }
  }, [state.admin, showStats, data]);

  return (
    <>
      {" "}
      {loading ? (
        width > 650 ?
        <CatalogPlaceholder />
        :
        <CatalogMobilePlaceholder />
      ) : notFound ? (
        <NoData />
      ) : (
        <div className="h-full product-page-wrapper">
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
          {data?.isLoading && isLoading && (
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

          <div className="container flex h-full">
            <div
              className={`${
                !filters || (filters && Object.keys(filters)?.length < 1)
                  ? "w-0"
                  : "mobile:w-1/5"
              } flex-child hidden mobile:block  mb-6`}
            >
              <div className="sticky top-0 ">
                <div className="overflow-auto hover:overflow-scroll h-screen pb-5  mobile:pr-5 mobile:pl-5 hover:scrollbar  hover:test">
                  <div className=" ">
                    {filters &&
                      Object.keys(filters).map((key) => (
                        <div className="hidden mobile:block" key={key.id}>
                          {filters[key].items.length > 0 && (
                            <div className="text-dcf pr-semibold leading-lfc font-bold capitalize ">
                              {filters[key].name}
                            </div>
                          )}
                          <div style={{ display: "block" }}>
                            {key ? (
                              <div>
                                {filters[key].items
                                  .slice(0, 5)
                                  .map((filter) => (
                                    <div key={Math.random()}>
                                      {(filters[key].name === "Light color" ||
                                        filters[key].name === "Color") &&
                                      filters[key].option_id ? (
                                        <div
                                          className="my-2 flex items-center cursor-pointer hover:text-dblue"
                                          key={filter.name}
                                          onClick={() =>
                                            parseFilter(
                                              filters[key].id,
                                              filter.id
                                            )
                                          }
                                        >
                                          <div className="flex w-10/12">
                                            <span
                                              className={`flex w-7 h-7 ${checkFilter(
                                                filters[key]?.id,
                                                filters[key].name,
                                                filter
                                              )}`}
                                            >
                                              {filter.image && (
                                                <Image
                                                  src={filter?.image}
                                                  style={{
                                                    padding: `1px`
                                                  }}
                                                  width="28"
                                                  height="28"
                                                  className={`w-12/12 rounded-full border border-dgreyRate`}
                                                  alt="Not Found"
                                                />
                                              )}
                                            </span>
                                            <p className="py-1 mx-2 text-d14 leading-dtight w-8/12 font-light">
                                              {" "}
                                              {filter.name}
                                            </p>
                                          </div>
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
                                              parseFilter(
                                                filters[key].id,
                                                filter.id
                                              )
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
                                        {(filters[key].name === "Light color" ||
                                          filters[key].name === "Color") &&
                                        filters[key].option_id ? (
                                          <div
                                            className="my-2 flex items-center cursor-pointer hover:text-dblue"
                                            key={filter.name}
                                            onClick={() =>
                                              parseFilter(
                                                filters[key].id,
                                                filter.id
                                              )
                                            }
                                          >
                                            <div className="flex w-10/12">
                                              <span
                                                className={`flex w-7 h-7 ${checkFilter(
                                                  filters[key].id,
                                                  filters[key].name,
                                                  filter
                                                )}`}
                                              >
                                                {filter?.image && (
                                                  <Image
                                                    src={filter.image}
                                                    style={{
                                                      padding: `1px`
                                                    }}
                                                    width="28"
                                                    height="28"
                                                    className={`w-12/12 rounded-full border border-dgreyRate`}
                                                    alt="Not Found"
                                                  />
                                                )}
                                              </span>
                                              <p className="py-2 mx-2 text-d14 leading-dtight w-8/12 font-light">
                                                {" "}
                                                {filter.name}
                                              </p>
                                            </div>
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
                                                parseFilter(
                                                  filters[key].id,
                                                  filter.id
                                                )
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
                </div>
              </div>
            </div>
            <div
              className={` w-full  ${
                !filters || (filters && Object.keys(filters)?.length < 1)
                  ? "mobile:w-full"
                  : "mobile:w-4/5 mobile:pl-5"
              }  leading-dtight  overflow-x-hidden`}
            >
              <div className="flex justify-between pb-2">
                {/* Results found */}
                <div className="flex mx-1 mobile:w-auto pt-2 mobile:pt-1 ">
                  <span className=" mr-2 font-light">
                    {data?.product_total} Results {data?.heading_title && "for"}
                  </span>
                  {data?.heading_title && '"'}
                  <h1
                    className="font-semibold capitalize text-d16"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML(data?.heading_title)
                    }}
                  />
                  {data?.heading_title && '"'}
                </div>
                {/* Settings */}
                {/* Desktop setting */}

                <div className="mobile:flex justify-end  hidden">
                  {/* Sorts */}
                  {data?.products?.length > 0 && (
                    <div className=" px-8 flex items-center">
                      <span className=" text-xs font-semibold text-dgrey1 pb-1 ">
                        SORT BY
                      </span>
                      <div className="relative pb-1">
                        <button
                          className="bg-white px-3 py-1 ml-4 border text-sm font-semibold cursor-pointer rounded  flex items-start space-x-2"
                          onClick={() => setShowSort(!showSort)}
                          ref={sortRef}
                        >
                          <span
                            className=" uppercase text-d12 leading-tight font-bold mt-0.5"
                            dangerouslySetInnerHTML={{
                              __html: sanitizeHTML(sortValue?.text)
                            }}
                          />
                          <span
                            className={`block ml-2 transition-all ${
                              showSort && "transform  rotate-180"
                            }`}
                          >
                            {" "}
                            <IoIosArrowDown className=" text-d18" />
                          </span>
                        </button>
                        {showSort && (
                          <div
                            className="bg-white py-4 w-44 shadow-2xl absolute z-40 right-0 top-9"
                            ref={sortRef}
                          >
                            {data?.sorts?.map((sort) => (
                              <span
                                onClick={() => {
                                  sortSetter(sort);
                                }}
                                className=" block text-sm font-light px-4 py-2 cursor-pointer hover:bg-dblue hover:text-white"
                                key={sort.value}
                                dangerouslySetInnerHTML={{
                                  __html: sanitizeHTML(sort.text)
                                }}
                              ></span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Sorts */}
                  {data?.products?.length > 0 && (
                    <div className=" px-8 flex items-center">
                      <span className=" text-xs font-semibold text-dgrey1 pb-1 ">
                        DISPLAY
                      </span>
                      <div className="relative p-1">
                        <button
                          className="bg-white px-3 py-1 ml-4 border text-d14 font-semibold cursor-pointer rounded flex items-start space-x-2"
                          onClick={() => setShowLimit(!showLimit)}
                        >
                          <span
                            className=" uppercase text-d12 leading-tight font-bold mt-0.5"
                            dangerouslySetInnerHTML={{
                              __html: sanitizeHTML(
                                limitValue.text + " PER PAGE"
                              )
                            }}
                          />
                          {/* {!showLimit ? (
                        <IoIosArrowDown className="ml-2 text-d18" />
                      ) : (
                        <IoIosArrowUp className="ml-2 text-d18" />
                      )} */}

                          <span
                            className={`block ml-2 transition-all ${
                              showLimit && "transform  rotate-180"
                            }`}
                          >
                            {" "}
                            <IoIosArrowDown className=" text-d18" />
                          </span>
                        </button>
                        {showLimit && (
                          <div
                            className="bg-white py-4 w-44 shadow-2xl absolute z-40 right-0 top-9"
                            ref={limitRef}
                          >
                            {data?.limits?.map((limit) => (
                              <span
                                onClick={() => limitSetter(limit)}
                                className=" block text-sm font-light px-4 py-2 cursor-pointer hover:bg-dblue hover:text-white"
                                key={limit.value}
                                dangerouslySetInnerHTML={{
                                  __html: sanitizeHTML(limit.text)
                                }}
                              ></span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {data?.products?.length > 0 && (
                    <div className="flex  items-center">
                      <span className=" text-d14 font-semibold text-dgrey1">
                        {productDisplay === "grid" ? "Grid" : "List"}
                      </span>
                      <button
                        className={`bg-white ml-4 text-lg border rounded block icon  transition-all p-1.5`}
                        onClick={() =>
                          setProductDisplay(
                            productDisplay === "grid" ? "list" : "grid"
                          )
                        }
                        // style={{ width: "30px", height: "30px" }}
                      >
                        {productDisplay === "grid" ? <FaList /> : <BsGrid />}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex  mobile:hidden">
                <div className="w-full  bg-white  mt-3">
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
                            key={s.text}
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
                      <Slider {...productSetting}>
                        {data?.categories.map((category, idx) => {
                          return (
                            <Link
                              href={`/${
                                category.name
                                  .replace(/\s+&amp;\s+|\s+&gt;/g, "-")
                                  .replace(/\s+/g, "-")
                                  .replace("/", "-") +
                                "/c=" +
                                category.id
                              }`}
                              key={category.id}
                              onClick={() => handleLinkClick()}
                              className="inline-flex w-24 xl:w-28 lg:w-28 text-center  items-center justify-center flex-col p-2 mx-2 hover:opacity-80 mb-1"
                            >
                              <Image
                                alt={category.name}
                                src={category.thumb}
                                width={"100"}
                                height={"100"}
                                placeholdersrc="https://ishtari.com/static/product_placeholder_square.png"
                              />
                              <h2
                                dangerouslySetInnerHTML={{
                                  __html: sanitizeHTML(category.name)
                                }}
                                className="text-xs xl:text-xs lg:text-xs w-full font-medium xl:font-semibold lg:font-semibold mt-2 line-clamp-2"
                              ></h2>
                            </Link>
                          );
                        })}
                      </Slider>
                    </div>
                    {/* Mobile Categories */}
                    <div className="block xl:hidden lg:hidden w-screen  -mx-4 mb-2">
                      {/* <div className="overflow-x-scroll flex px-2 "> */}
                      <Slider {...productMSetting}>
                        {data.categories.map((category) => (
                          <Link
                            href={
                              // state.admin
                              //   ? `${path}/category/${category.id}`
                              //   :
                              `/${
                                category.name
                                  .replace(/\s+&amp;\s+|\s+&gt;/g, "-")
                                  .replace(/\s+/g, "-")
                                  .replace("/", "-") +
                                "/c=" +
                                category.id
                              }`
                            }
                            key={category.id}
                            onClick={() => handleLinkClick()}
                            className="inline-flex text-center  items-center justify-center flex-col p-2 mx-2 hover:opacity-80 mb-1"
                          >
                            <Image
                              alt={category.name}
                              src={category.thumb}
                              width={110}
                              height={110}
                              placeholdersrc="https://ishtari.com/static/product_placeholder_square.png"
                              className="h-20 w-20"
                            />

                            <h2
                              dangerouslySetInnerHTML={{
                                __html: sanitizeHTML(category.name)
                              }}
                              className="text-xs xl:text-xs lg:text-xs w-full font-medium xl:font-semibold lg:font-semibold mt-2 line-clamp-2"
                            ></h2>
                          </Link>
                        ))}
                        {/* </div> */}
                      </Slider>
                    </div>
                  </div>
                )}
              <div className="hidden mobile:block">
                {(page === undefined || page < 2) &&
                  (data?.category_widget_status === "1" ||
                    data?.desktop_widget_status === "1") &&
                  data?.desktop_widgets?.map((widget) => (
                    <div className="px-3" key={widget.mobile_widget_id}>
                      {" "}
                      <WidgetsLoop
                        widget={widget}
                        bannerStats={bannerStats}
                      />{" "}
                    </div>
                  ))}
              </div>
              <div className="mobile:hidden">
                {(page === undefined || page < 2) &&
                  (data?.category_widget_status === "1" ||
                    data?.mobile_widget_status === "1") &&
                  data?.mobile_widgets?.map((widget) => (
                    <div className="px-3" key={widget.mobile_widget_id}>
                      {" "}
                      <WidgetsLoop widget={widget} bannerStats={bannerStats} />
                    </div>
                  ))}
                {(page === undefined || page < 2) &&
                  (data?.category_widget_status === "1" ||
                    data?.mobile_widget_status === "1") &&
                  data?.widgets?.map((widget) => (
                    <div className="px-3" key={widget.mobile_widget_id}>
                      <WidgetsLoop widget={widget} bannerStats={bannerStats} />{" "}
                    </div>
                  ))}
              </div>
              <div className="hidden mobile:block pt-3">
                <SwiperComponent
                  data={data}
                  onButtonClick={parseFilter}
                  onHandleClickTopFilter={handleTopFilter}
                />
              </div>
              {filters &&
                (filters[0]?.items?.length > 0 ||
                  filters[1]?.items?.length > 0) && (
                  <div className=" w-full block relative z-100 ">
                    <div className="relative flex items-center mb-3">
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
                                        {(filters[
                                          data.filters.findIndex(
                                            (x) => x.name === topFilter.name
                                          )
                                        ].name === "Light color" ||
                                          filters[
                                            data.filters.findIndex(
                                              (x) => x.name === topFilter.name
                                            )
                                          ].name === "Color") &&
                                        filters[
                                          data.filters.findIndex(
                                            (x) => x.name === topFilter.name
                                          )
                                        ].option_id ? (
                                          <p
                                            className=" flex items-center justify-between  cursor-pointer hover:text-dblue"
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
                                            <div className="flex">
                                              <Image
                                                src={filter.image}
                                                style={{
                                                  padding: `2px`
                                                }}
                                                className={`w-7 h-7 rounded-full  mr-1 
                                            ${checkFilter(
                                              filters[
                                                data.filters.findIndex(
                                                  (x) =>
                                                    x.name === topFilter.name
                                                )
                                              ].id,
                                              filters[
                                                data.filters.findIndex(
                                                  (x) =>
                                                    x.name === topFilter.name
                                                )
                                              ].name,
                                              filter
                                            )}
                                            `}
                                                alt={filters[key]?.id}
                                                width="28"
                                                height="28"
                                              />

                                              <p className="pt-1 mx-2 text-d13 w-8/12 font-light">
                                                {" "}
                                                {filter.name}
                                              </p>
                                            </div>
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
                                                    (x) =>
                                                      x.name === topFilter.name
                                                  )
                                                ].id,
                                                filter.id
                                              )
                                            }
                                          >
                                            {checkFilter(
                                              filters[
                                                data.filters.findIndex(
                                                  (x) =>
                                                    x.name === topFilter.name
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
                                                          x.name ===
                                                          topFilter.name
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
                                      {(filters[
                                        data.filters.findIndex(
                                          (x) => x.name === topFilter.name
                                        )
                                      ].name === "Light color" ||
                                        filters[
                                          data.filters.findIndex(
                                            (x) => x.name === topFilter.name
                                          )
                                        ].name === "Color") &&
                                      filters[
                                        data.filters.findIndex(
                                          (x) => x.name === topFilter.name
                                        )
                                      ].option_id ? (
                                        <p
                                          className=" flex items-center justify-between cursor-pointer hover:text-dblue"
                                          key={filter.name}
                                          onClick={() =>
                                            parseFilter(
                                              // filters[key].id,
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
                                          <span className="flex">
                                            {filter?.image && (
                                              <Image
                                                src={filter.image}
                                                style={{
                                                  padding: `2px`
                                                }}
                                                width="28"
                                                height="28"
                                                className={`w-7 h-7 rounded-full 
                                          ${checkFilter(
                                            filters[
                                              data.filters.findIndex(
                                                (x) => x.name === topFilter.name
                                              )
                                            ].id,
                                            filters[
                                              data.filters.findIndex(
                                                (x) => x.name === topFilter.name
                                              )
                                            ].name,
                                            filter
                                          )}
                                          `}
                                                alt={filter.name}
                                              />
                                            )}

                                            <p className="p-2 mx-2 text-d13 w-8/12 font-light">
                                              {" "}
                                              {filter.name}
                                              {/* -{" "}
                                          {data.filters.findIndex(
                                            (x) => x.name === topFilter.name
                                          )} */}
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
                                              className={`icon mr-1 text-base`}
                                            >
                                              {checkFilter(
                                                filters[
                                                  data.filters.findIndex(
                                                    (x) =>
                                                      x.name === topFilter.name
                                                  )
                                                ].id,
                                                filter.name,
                                                filter
                                              )}
                                            </i>
                                            <span className="text-d13 font-light ml-1">
                                              {filter.name}
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

                      {/* <div className={`w-full ${styles.slider} `} ref={sliderRef}>
                    <div
                      className={`${styles["slider-content"]} slider-content`}
                    >
                      {data.filters.map((filter) => {
                        return (
                          filter.items.length > 0 &&
                          filter.name !== "Socks" &&
                          filter.name !== "Size by Age" && (
                            <div
                              key={Math.random()}
                              id={filter.name}
                              onClick={() => handleTopFilter(filter.name)}
                            >
                              <button className="p-1 " id={filter.name}>
                                <div
                                  className={`text-d14 px-3 py-1 flex-nowrap bg-dgreyRate flex justify-between items-center rounded-2xl ${checkMainFilter(
                                    filter
                                  )}`}
                            
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
                            </div>
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
                              return (
                                <div>
                                  <button
                                    className="p-1 "
                                    onClick={() => parseFilter(filter.id, item)}
                                  >
                                    <div
                                      className={`text-d14 bg-dgreyRate px-3 flex-nowrap flex justify-between items-center rounded-2xl catalog-top-filter-selected`}
                                 
                                    >
                                      <span className="w-max">{item.name}</span>
                                      <span className="ml-2">
                                        <AiOutlineClose className="text-d18" />
                                      </span>
                                    </div>
                                  </button>
                                </div>
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
                                    <div>
                                      <button
                                        className="p-1 "
                                        onClick={() =>
                                          parseFilter(filter.id, item.id)
                                        }

                                    
                                      >
                                        <div
                                          className={`text-d14 px-3 py-1 overflow-hidden flex-nowrap flex justify-between items-center bg-dgreyRate rounded-2xl `}
                                       
                                        >
                                          <span className="w-max">
                                            <span className="font-bold mr-1">
                                              Seller:
                                            </span>
                                            {item.name}
                                          </span>
                                        </div>
                                      </button>
                                    </div>
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
                                    <div>
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
                                    </div>
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
                                    <div>
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
                                    </div>
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
                                    <div>
                                      <button
                                        className="p-1"
                                        onClick={() =>
                                          parseFilter(filter.id, item.id)
                                        }
                                      >
                                        <div
                                          className={`text-d14 px-3 flex-nowrap flex justify-between items-center rounded-2xl bg-dgreyRate catalog-top-filter-not-selected`}
                                      
                                        >
                                          <span className="w-max">
                                            <span className="font-bold mr-1">
                                              Shoes Size:
                                            </span>
                                            {item.name}
                                          </span>
                                        </div>
                                      </button>
                                    </div>
                                  );
                                } else {
                                  return (
                                    <div>
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
                                    </div>
                                  );
                                }
                              }
                            }
                          })
                        );
                      })}
                    </div>

                    <div
                      className={`${styles["slider-arrow"]} ${styles["slider-arrow-left"]} slider-arrow-left  bg-white p-3 `}
                    >
               
                      <MdOutlineArrowBackIos className="text-d18" />
                    </div>
                    <div
                      className={`${styles["slider-arrow"]} ${styles["slider-arrow-right"]} slider-arrow-right  text-dbgray bg-white p-3 `}
                    >
                
                      <MdOutlineArrowForwardIos className="text-d18" />
                    </div>
                  </div> */}

                      <div className="flex overflow-x-scroll py-3 mobile:hidden min-w-full">
                        <div className="flex w-full">
                          {data.filters.map((filter) => {
                            return (
                              filter.items.length > 0 &&
                              filter.name !== "Socks" &&
                              filter.name !== "Size by Age" && (
                                <div
                                  key={Math.random()}
                                  id={filter.name}
                                  onClick={() => handleTopFilter(filter.name)}
                                >
                                  <button className="p-1 " id={filter.name}>
                                    <div
                                      className={`text-d14 px-3 py-1 flex-nowrap bg-dgreyRate flex justify-between items-center rounded-2xl ${checkMainFilter(
                                        filter
                                      )}`}
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
                                </div>
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
                                  return (
                                    <div key={item.id}>
                                      <button
                                        className="p-1 "
                                        onClick={() =>
                                          parseFilter(filter.id, item)
                                        }
                                      >
                                        <div
                                          className={`text-d14 bg-dgreyRate px-3 flex-nowrap flex justify-between items-center rounded-2xl catalog-top-filter-selected`}
                                        >
                                          <span className="w-max">
                                            {item.name}
                                          </span>
                                          <span className="ml-2">
                                            <AiOutlineClose className="text-d18" />
                                          </span>
                                        </div>
                                      </button>
                                    </div>
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
                                        <div key={item.id}>
                                          <button
                                            className="p-1 "
                                            onClick={() =>
                                              parseFilter(filter.id, item.id)
                                            }
                                          >
                                            <div
                                              className={`text-d14 px-3 py-1 overflow-hidden flex-nowrap flex justify-between items-center bg-dgreyRate rounded-2xl `}
                                            >
                                              <span className="w-max">
                                                <span className="font-bold mr-1">
                                                  Seller:
                                                </span>
                                                {item.name}
                                              </span>
                                            </div>
                                          </button>
                                        </div>
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
                                        <div key={item.id}>
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
                                        </div>
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
                                        <div key={item.id}>
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
                                        </div>
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
                                        <div key={item.id}>
                                          <button
                                            className="p-1"
                                            onClick={() =>
                                              parseFilter(filter.id, item.id)
                                            }
                                          >
                                            <div
                                              className={`text-d14 px-3 flex-nowrap flex justify-between items-center rounded-2xl bg-dgreyRate catalog-top-filter-not-selected`}
                                            >
                                              <span className="w-max">
                                                <span className="font-bold mr-1">
                                                  Shoes Size:
                                                </span>
                                                {item.name}
                                              </span>
                                            </div>
                                          </button>
                                        </div>
                                      );
                                    } else {
                                      return (
                                        <div>
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
                                        </div>
                                      );
                                    }
                                  }
                                }
                              })
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              <div
                className={`grid transition-all  ${
                  productDisplay === "grid"
                    ? !filters || (filters && Object.keys(filters)?.length < 1)
                      ? "grid-cols-2 xl:grid-cols-6 lg:grid-cols-6 gap-2"
                      : "grid-cols-2 xl:grid-cols-5 lg:grid-cols-5 gap-2 mobile:pt-2"
                    : "grid-cols-1"
                }`}
              >
                {" "}
                {data?.products?.map((item) => (
                  <div className="p-1" key={item.product_id}>
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
            <div className="bg-white fixed w-full z-50 top-0  h-screen py-3 pb-12">
              <div className="flex justify-between pl-2 pr-7">
                <div className="text-d22">Filters</div>{" "}
                <div
                  className="text-d25 py-2"
                  onClick={() => setShowMobileFilter(false)}
                >
                  <AiOutlineClose />
                </div>
              </div>
              <div className=" w-full h-screen pl-2 pr-7 pb-12 overflow-y-auto bg-white">
                {Object.keys(filters).map((key) => (
                  <div className="py-2" key={key.id}>
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
                              {(filters[key].name === "Light color" ||
                                filters[key].name === "Color") &&
                              filter?.option_id ? (
                                <div
                                  className="my-2 flex items-center cursor-pointer hover:text-dblue"
                                  key={filter.name}
                                  onClick={() =>
                                    parseFilter(filters[key].id, filter.id)
                                  }
                                >
                                  <div className="flex w-10/12">
                                    <span
                                      className={`flex w-7 h-7 ${checkFilter(
                                        filters[key]?.id,
                                        filters[key].name,
                                        filter
                                      )}`}
                                    >
                                      {filter?.image && (
                                        <Image
                                          src={filter.image}
                                          style={{
                                            padding: `1px`
                                          }}
                                          className={`w-12/12 rounded-full border border-dgreyRate`}
                                          alt="Not Found"
                                          width="28"
                                          height="28"
                                        />
                                      )}
                                    </span>
                                    <p className="py-1 mx-2 text-d14 leading-dtight w-8/12 font-light">
                                      {" "}
                                      {filter.name}
                                    </p>
                                  </div>
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
                                  {(filters[key].name === "Light color" ||
                                    filters[key].name === "Color") &&
                                  filters[key]?.option_id ? (
                                    <div
                                      className="my-2 flex items-center cursor-pointer hover:text-dblue"
                                      key={filter.name}
                                      // onClick={() => parseFilter(filters[key].id, filter)}
                                    >
                                      <div className="flex w-10/12">
                                        <span
                                          className={`flex w-7 h-7 ${checkFilter(
                                            filters[key].id,
                                            filters[key].name,
                                            filter
                                          )}`}
                                        >
                                          {filter?.image && (
                                            <Image
                                              src={filter.image}
                                              style={{
                                                padding: `1px`
                                              }}
                                              className={`w-12/12 rounded-full border border-dgreyRate`}
                                              alt="Not Found"
                                              width="28"
                                              height="28"
                                              loading="lazy"
                                            />
                                          )}
                                        </span>
                                        <p className="py-2 mx-2 text-d14 leading-dtight w-8/12 font-light">
                                          {" "}
                                          {filter.name}
                                        </p>
                                      </div>
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
                                          parseFilter(
                                            filters[key].id,
                                            filter.id
                                          )
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
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default CatalogTest;

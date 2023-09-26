// import { useLocation, useParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { axiosServer } from "@/axiosServer";
import buildLink from "@/urls";
// import SingleProducts from "../components/SingleProduct";
import SingleProducts from "../product/SingleProduct";
import { useRouter } from "next/router";
import queryString, { parse } from "query-string";
import ReactPaginate from "react-paginate";
// import { LazyLoadImage } from "react-lazy-load-image-component";
// import notFound from "../assets/images/page-404.webp";
// import CatalogPlaceholder from "./CatalogPlaceholder";
// import { useWindowDimensions } from "../components/TopHeader";
import useDeviceSize from "../useDeviceSize";
// import CatalogMobilePlaceholder from "../components/CatalogMobilePlaceholder";
// import SeoHandler from "../components/SeoHandler";
import { AccountContext } from "@/contexts/AccountContext";
import WidgetsLoop from "../WidgetsLoop";
// import { useFiltersContext } from "../contexts/FiltersContext";
import { useFiltersContext } from "@/contexts/FiltersContext";
import ReactPixel from "react-facebook-pixel";
// import ScrollToTop from "react-scroll-to-top";
// import { CurrencyContext } from "../contexts/CurrencyContext";
import DOMPurify from "dompurify";
import Image from "next/image";
import {
  IoIosArrowForward,
  IoIosArrowBack,
  IoIosArrowDown,
} from "react-icons/io";
import { AiOutlineRight, AiOutlineLeft, AiOutlineClose } from "react-icons/ai";
// import { LoadingContext } from "react-router-loading";
import Slider from "react-slick";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
// import "swiper/swiper.min.css";
// import "swiper/modules/pagination/pagination.min.css";
// import "swiper/modules/navigation/navigation.min.css";
import { Navigation } from "swiper";
import Cookies from "js-cookie";
// import { ExportProductContext } from "../contexts/ExportProductContext";
// import JsPDF from "jspdf";
import ReactDOM from "react-dom";
// import SingleProductExport from "../components/SingleProductExport";

function CategoryTest({ type, id }) {
  const [state] = useContext(AccountContext);
  const [noProductData, setNoProductData] = useState(false);
//   const loadingContext = useContext(LoadingContext);
  const [productDisplay, setProductDisplay] = useState("grid");
  const [noDataNoError, setNoDataNoError] = useState(false);
//   const { exportProduct, setExportProduct } = useContext(ExportProductContext);
//   const { loadingExport, setLoadingExport } = useContext(ExportProductContext);
  // const [isError, setIsError] = useState(false);
  // const [uiFilters, setUiFilters] = useState([])
//   const router = useHistory();
  const location = useLocation();
  const banner_image_id = location.state?.banner_image_id
    ? location.state?.banner_image_id
    : "";
  const source_type = location.state?.source_type
    ? location.state?.source_type
    : "";
  const source_type_id = location.state?.source_type_id
    ? location.state?.source_type_id
    : "";
  console.log(location.state);
  const [display, setDisplay] = useState("grid");
  const [empty, setEmpty] = useState(true);
//   const curr = useContext(CurrencyContext);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({
    value: "p2co.sort_order-ASC",
    text: "Default",
  });
  const [limit, setLimit] = useState({
    value: "50",
    text: "50",
  });
  const path1 = location.pathname;
  const lastLocation = useRef({
    path: "",
  });
const router = useRouter()
  const { userFilters, setUserFilters } = useFiltersContext();
  const { width } = useDeviceSize();
  const oldFilters = location.state?.oldFilters;
  const [showSort, setShowSort] = useState(false);
  const [showLimit, setShowLimit] = useState(false);
  const [data, setData] = useState();
  const [filters, setFilters] = useState();
  const [likedData, setLikedData] = useState([]);
  const catalog_id = id;
  const catalog_name = useParams().name;
  const url = location.pathname;
  const parsedQueryString = queryString.parse(location.search);
  // Get current route type (category,seller,manufacturer)
  const [mobileSort, showMobileSort] = useState(false);
  const [mobileFilter, showMobileFilter] = useState(false);
  const urlRef = useRef(location?.pathname);
  const { errPermission, setErrPermission } = useContext(ExportProductContext);
  const [topFilter, setTopFilter] = useState({
    show: false,
    name: "",
    offset: 0,
  });

  const priceFrom = useRef("");
  const priceTo = useRef("");
  const [filterValue, setFilterValue] = useState({
    start_price: priceFrom?.current?.value,
    end_price: priceTo?.current?.value,
  });
  // const [firstAttemp, setFirstAttemp] = useState(true);

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  function statesSetter(data) {
    const parsedQueryString = queryString.parse(location.search);
    if (parsedQueryString.sort) {
      data?.sorts?.map((s) => {
        if (s.value === parsedQueryString.sort) {
          setSort(s);
        }
        return s;
      });
    }
    if (parsedQueryString.limit) {
      data?.limits?.map((l) => {
        if (l.value === parsedQueryString.limit) {
          setLimit(l);
        }
        return l;
      });
    }
    if (parsedQueryString.page) {
      setPage(parsedQueryString.page);
    }
  }

  const checkErrorFilters = () => {
    let params = new URLSearchParams(location.search);
    /// GET THE LAST CLICKED ELEMENT
    const last = params && params.get("last");

    /// CHECK WHICH TYPE IT IS THEN DELETING IT FROM THE URL
    if (last === "s") {
      params && params.delete("filter_sellers");
    } else if (last === "m") {
      params && params.delete("filter_manufacturers");
    } else if (last === "o") {
      params && params.delete("filter_options");
    } else if (last === "c") {
      params && params.delete("filter_categories");
    } else if (last === "f") {
      params && params.delete("adv_filters");
    }
    //// PUSH WITH THE SAME PATHNAME AND NEW SEARCH VALUE TO SOLVE THE PROBLEM
    router.push( location.pathname+ "?" + params.toString());
  };

  const checkMainFilter = (filter) => {
    let temp = "catalog-top-filter-not-selected";
    filter.items.map((item) => {
      if (userFilters[filter.id].includes(item.id)) {
        return (temp = "catalog-top-filter-selected");
      }
    });
    return temp;
  };

  const clearFilter = (filter) => {
    setTopFilter({
      show: false,
      name: "",
      offset: 0,
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
    }

    let temp = "";

    if (
      params.get("filter_sellers") ||
      params.get("filter_manufacturers") ||
      params.get("filter_options") ||
      params.get("filter_categories") ||
      params.get("adv_filters")
    ) {
      temp = "?" + params.toString();
    }

    //// PUSH WITH THE SAME PATHNAME AND NEW SEARCH VALUE TO SOLVE THE PROBLEM
    router.push( location.pathname+ temp);
  };

  const handleTopFilter = (name) => {
    const off = document.getElementById(`${name}`).offsetLeft;

    if (width > 650) {
      if (topFilter.name === name && topFilter.show === true) {
        setTopFilter({
          show: false,
          name: name,
          offset: topFilter.offset,
        });
      } else if (topFilter.name !== name && topFilter.show === true) {
        setTopFilter({
          show: true,
          name: name,
          offset: off > 531 ? 531 : off,
        });
      } else {
        setTopFilter({
          show: true,
          name: name,
          offset: off > 531 ? 531 : off,
        });
      }
    } else {
      setTopFilter({
        show: true,
        name: name,
        offset: off > 531 ? 531 : off,
      });
    }
  };

  //page view conversion for google ads
//   useEffect(() => {
//     if (!state.admin) {
//       window.dataLayer = window.dataLayer || [];
//       function gtag() {
//         window.dataLayer.push(arguments);
//       }
//       if (router.Path.host === "www.ishtari.com") {
//         gtag("event", "conversion", {
//           send_to: "AW-991347483/pc3dCIaww44YEJuG29gD",
//           ids: data?.social_data?.content_ids,
//         });
//       } else if (router.Path.host === "www.ishtari.com.gh") {
//         gtag("event", "conversion", {
//           send_to: "AW-10993907106/31DICLmKppEYEKLrpvoo",
//           ids: data?.social_data?.content_ids,
//         });
//       }
//     }
//   }, [data, state.admin]);

  useEffect(() => {
    // console.log(showLimit, showSort);
    document.removeEventListener("mousedown", handleClick);
  });
  function handleClick() {
    if (showLimit === true) setShowLimit(!showLimit);
    if (showSort === true) setShowSort(!showSort);
  }
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
          if (showLimit) setShowLimit(false);
        }
      };

      document.addEventListener("mousedown", checkIfClickedOutside);

      return () => {
        // Cleanup the event listener

        document.removeEventListener("mousedown", checkIfClickedOutside);
      };
    }, [showLimit]);
  }

  const sortRef = useRef(null);
  useOutsideSort(sortRef);

  function useOutsideSort(sortRef) {
    useEffect(() => {
      const checkIfClickedOutside = (e) => {
        // If the menu is open and the clicked target is not within the menu,
        if (
          showSort &&
          sortRef.current &&
          !sortRef.current.contains(e.target)
        ) {
          if (showSort) setShowSort(false);
        }
      };

      document.addEventListener("mousedown", checkIfClickedOutside);

      return () => {
        // Cleanup the event listener

        document.removeEventListener("mousedown", checkIfClickedOutside);
      };
    }, [showSort]);
  }
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
              offset: topFilter.offset,
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

  // useEffect(() => {
  //   axiosServer
  //     .get(buildLink("getLikeProduct", undefined, undefined))
  //     .then((response) => {
  //       if (response.data.success) {
  //         setLikedData(response.data.data);
  //       }
  //     });
  // }, []);

  //Get product data

  // useEffect(()=> {
  //   var obj = {
  //     currency: "USD"
  //   };

  //   if (width > 650) {
  //     if (
  //       // localStorage.getItem("currency") &&
  //       // localStorage.getItem("currency") !== "USD" &&
  //       // (window.config["site-url"] === "https://www.ishtari.com" ||
  //       //   localStorage.getItem("site-local-name") === "ishtari")
  //       curr?.data?.allow_change_currency_in_checkout ==="true" &&
  //       curr?.data?.allow_change_currency_in_website ==="false"
  //     ) {
  //       axiosServer
  //         .post(buildLink("currency", undefined, undefined), obj)
  //         .then((response) => {
  //           const data = response.data;

  //           if (data.success === true) {
  //              localStorage.setItem("currency", "USD");
  //            // getData();
  //           }
  //         });
  //     } else {
  //      // getData();
  //     }
  //   } else {
  //     if (
  //       // localStorage.getItem("currency") &&
  //       // localStorage.getItem("currency") !== "USD" &&
  //       // (window.config["site-url"] === "https://www.ishtari.com" ||
  //       //   localStorage.getItem("site-local-name") === "ishtari")
  //       curr?.data?.allow_change_currency_in_checkout ==="true" &&
  //       curr?.data?.allow_change_currency_in_website ==="false"
  //     ) {
  //       axiosServer
  //         .post(buildLink("currency", undefined, undefined), obj)
  //         .then((response) => {
  //           const data = response.data;

  //           if (data.success === true) {
  //             localStorage.setItem("currency", "USD");
  //             //getMData();
  //           }
  //         });
  //     } else {
  //       //getMData();
  //     }
  //   }
  // },[width, page])

  function changeCurrency() {
    // if (
    //   window.config["site-url"] === "https://www.ishtari.com" ||
    //   localStorage.getItem("site-local-name") === "ishtari"
    // ) {
    //   var obj = {
    //     currency: "USD"
    //   };
    //   axiosServer
    //     .post(buildLink("currency", undefined, undefined), obj)
    //     .then((response) => {
    //       const data = response.data;
    //       if (data.success === true) {
    //         localStorage.setItem("currency", "USD");
    //       }
    //     });
    //   // }else{
    //   // getData()
    // }

    getData();
  }

  function getData() {
    axiosServer.get(parseUrl()).then((response) => {
      if (response.data.error || response.data.breadcrumbs?.length === 0) {
        setEmpty(true);
        setData(response?.data?.data);
        setNoDataNoError(true);
        // loadingContext.done();
        return;
      }

      const is_filter = router.Path.indexOf("has_filter") > 0;
      let data;
      if (is_filter) {
        data = response?.data?.data;
      } else {
        data = response?.data?.data;
      }
      if (data?.error) {
        // console.log("found error in useEffect");
        checkErrorFilters();
      }
      //console.log(data);
      statesSetter(data);
      setData(data);
    //   loadingContext.done();
      location.state = {
        oldFilters: data?.filters,
      };

      setFilters(!is_filter ? data?.filters : data?.filters); //replace filters with test_fillter

      // if (!state.admin) {

      var dataSocial = data?.social_data;

      if (
        typeof dataSocial !== "undefined" &&
        dataSocial?.content_ids.length !== 0
      ) {
        dataSocial["fbp"] = Cookies.get("_fbp");
        dataSocial["fbc"] = Cookies.get("_fbc");
        dataSocial["ttp"] = Cookies.get("_ttp");
        dataSocial["link"] = router.path
        dataSocial["view_type"] = getType();
        dataSocial["view_type_id"] = catalog_id;
        if (
          source_type === "" ||
          source_type === null ||
          typeof source_type === "undefined"
        ) {
          dataSocial["ignore"] = false;
        } else {
          dataSocial["source_type"] = source_type;
          dataSocial["source_type_id"] = source_type_id;
          dataSocial["banner_image_id"] = banner_image_id
            ? banner_image_id
            : "";
        }

        axiosServer
          .post(buildLink("pixel", undefined, undefined), dataSocial)
          .then((response) => {
            const data = response.data;
            if (data.success === true) {
            }
          });
      }
    });
  }

  const firstPath = router.Path.split("/")[3];

  useEffect(() => {
    // if (
    //   (window.config["site-url"] === "https://www.flo-lebanon.com" ||
    //     localStorage.getItem("site-local-name") === "flo" ||
    //     firstPath === "bey") &&
    //   !state.admin
    // ) {
    //   router.Path = "/";
    // }
  }, [state.admin]);

  useEffect(() => {
    // window.scrollTo({
    //   top: 0,
    //   // behavior: "smooth",
    // });
    var url1 = new URL(router.Path);
    var filter_price = url1.searchParams.get("filter_price");
    setFilterValue({
      start_price: filter_price?.split("-")[0],
      end_price: filter_price?.split("-")[1],
    });

    changeCurrency();
    if (location.pathname !== urlRef.current) {
      setUserFilters({
        filter_sellers: [],
        filter_categorie: [],
        filter_manufacturers: [],
        adv_filters: [],
        filter_options: [],
      });
      urlRef.current = location.pathname;
    }
    if (router.action === "POP") {
      let sellerIndex;
      let brandIndex;
      // let optionsIndexLast;
      let optionsIndex;
      let advfiltersIndex;
      let categoryIndex;
      // if(router.Path.indexOf("filter_seller_id")){
      // setUserFilters({...userFilters,
      //   filter_options: [],
      //   filter_category_id: [],
      //   filter_manufacturer_id: [],
      //   })
      // }
      sellerIndex = router.Path.indexOf("filter_sellers");
      brandIndex = router.Path.indexOf("filter_manufacturers");
      categoryIndex = router.Path.indexOf("filter_categories");
      advfiltersIndex = router.Path.indexOf("adv_filters");

      optionsIndex = router.Path.indexOf("filter_options");
      // optionsIndexLast = router.Path.indexOf("last=o");

      const value = Math.max(
        sellerIndex,
        brandIndex,
        optionsIndex,
        advfiltersIndex,
        categoryIndex
      );
      if (value === sellerIndex) {
        setUserFilters({
          ...userFilters,
          filter_options: [],
          filter_categories: [],
          filter_manufacturers: [],
          adv_filters: [],
        });
      }
      if (value === categoryIndex) {
        setUserFilters({
          ...userFilters,
          filter_options: [],
          filter_manufacturers: [],
          filter_sellers: [],
          adv_filters: [],
        });
      }
      if (value === brandIndex) {
        setUserFilters({
          ...userFilters,
          filter_sellers: [],
          filter_categories: [],
          filter_options: [],
          adv_filters: [],
        });
      }
      if (value === advfiltersIndex) {
        setUserFilters({
          ...userFilters,
          filter_sellers: [],
          filter_categories: [],
          filter_manufacturers: [],
          filter_options: [],
        });
      }
      // if (value === optionsIndex  && optionsIndexLast > -1) {
      //   setUserFilters({
      //     ...userFilters,
      //     filter_sellers: [],
      //     filter_categories: []
      //     filter_manufacturers: []
      //   });
      // }
    }
    // axiosServer.get(parseUrl()).then((response) => {
    //   if (response.data.error || response.data.breadcrumbs?.length === 0) {
    //     setEmpty(true);
    //     setData(response?.data?.data);
    //     setNoDataNoError(true);
    //     loadingContext.done();
    //     return;
    //   }

    //   const is_filter = router.Path.indexOf("has_filter") > 0;
    //   let data;
    //   let catID;
    //   if (is_filter) {
    //     data = response?.data?.data;
    //   } else {
    //     data = response?.data?.data;
    //   }
    //   if (data?.error) {
    //     // console.log("found error in useEffect");
    //     checkErrorFilters();
    //   }

    //   statesSetter(data);
    //   setData(data);
    //   loadingContext.done();
    //   location.state = {
    //     oldFilters: data?.filters,
    //   };

    //   setFilters(!is_filter ? data?.filters : data?.filters); //replace filters with test_fillter

    //   if (!state.admin) {
    //     const obj = {
    //       content_ids: data?.social_data?.content_ids,
    //       contents: data?.social_data?.contents,
    //       email: data?.social_data?.email,
    //       fb_login_id: data?.social_data?.fb_login_id,
    //       firstname: data?.social_data?.firstname,
    //       ip: data?.social_data?.ip,
    //       lastname: data?.social_data?.lastname,
    //       name: data?.social_data?.name,
    //       //  quantity: data.social_data.quantity,
    //       telephone: data?.social_data?.telephone,
    //       user_agent: data?.social_data?.user_agent,
    //       //  value: data.social_data.value,
    //       from: "category",
    //     };

    //     // axiosServer
    //     //   .post(buildLink("pixel", undefined, undefined), obj)
    //     //   .then((response) => {
    //     //     const data = response.data;
    //     //     if (data.success === true) {
    //     //     }
    //     //   });
    //   }
    // });
    if (id !== lastLocation.current.path) {
      lastLocation.current.path = id;
      setSort({
        value: "p2co.sort_order-ASC",
        text: "Default",
      });
      setDisplay({
        value: "50",
        text: "50",
      });
    }
    return () => {
      setEmpty(false);
      //setIsError(false);

      // setUserFilters({
      //   filter_seller_id: [],
      //   filter_category_id: [],
      //   filter_manufacturer_id: [],
      //   filter_options: [],
      // })
    };
  }, [location, state.admin]);

  let productArray = [];
  useEffect(() => {
    if (!state.admin) {
      const productDetails = [];

      data?.products?.map((p) => {
        productArray.push(p.product_id);
        productDetails.push({ id: p.product_id, quantity: p.quantity });
      });
      // ---> Facebook PIXEL <---
      const advancedMatching = {
        em: data?.social_data?.email,
        fn: data?.social_data?.firstname,
        ln: data?.social_data?.lastname,
        external_id: data?.social_data?.external_id,
        country: data?.social_data?.country_code,
        fbp: Cookies.get("_fbp"),
      };
      ReactPixel.init(pixelID, advancedMatching, {
        debug: true,
        autoConfig: false,
      });
      ReactPixel.pageView();
      ReactPixel.fbq("track", "PageView");

      if (data && data?.products.length > 0) {
        // window.fbq(
        //   "track",
        //   "ViewContent",
        //   {
        //     content_type: "product",
        //     content_ids: productArray,
        //     contents: productDetails,
        //     content_name: data?.social_data?.name,
        //   },
        //   { eventID: data?.social_data?.event_id }
        // );
      }

      return () => {
        setEmpty(false);
        productArray = [];
      };
    }
  }, [filters]);

  // function checkCookies() {
  //   const adminToken = Cookies.get("ATDetails");
  //   console.log(adminToken);
  //   if (typeof adminToken != "undefined") {
  //     return true;
  //   } else{
  //     return false;
  //   }
  // }

  // useEffect(()=>{
  //   checkCookies();
  // },[state.admin])

  // Prepare the url
  function parseUrl(queries = false, exportProducts = false) {
    let url_type =
      router.Path.indexOf("has_filter") < 0 ? "default" : "filter";
    if (!exportProducts) {
      setData({});
    }

    if (url_type === "default") {
      const q_s = queryString.parse(location.search);
      q_s.page = q_s.page ? q_s.page : page;
      q_s.limit = q_s.limit ? q_s.limit : limit.value;
      q_s.sort = q_s.sort ? q_s.sort : "p2co.sort_order";
      q_s.order = q_s.order ? q_s.order : "ASC";
      // if (width > 650) {
      q_s.source_id = 1;
      // }

      // const adminToken = Cookies.get("ATDetails");
      // console.log(adminToken);
      // var url =''
      // if (location.search.indexOf("&utid=addedollar") > -1) {
      //    url = '&utid=addedollar'
      // }
      // // Preapare url
      let final_queries = "&" + queryString.stringify(q_s);
      return !queries
        ? buildLink(getType(), undefined, undefined) +
            catalog_id +
            final_queries +
            `${state.admin ? "&adm_quantity=true" : ""}`
        : final_queries + `${state.admin ? "&adm_quantity=true" : ""}`;
    } else {
      //heree
      console.log(catalog_id);
      const q_s = queryString.parse(location.search);
      console.log(location);
      let type = getType()
        .replace("category", "path")
        .replace("manufacturer", "manufacturer_id")
        .replace("seller", "seller_id")
        .replace("option", "option_id");
      return (
        buildLink("filter", undefined, undefined) +
        "&" +
        type +
        "=" +
        catalog_id +
        "&" +
        queryString.stringify(q_s).replaceAll("%2C", ",") +
        "&limit=" +
        limit.value +
        `${state.admin ? "&adm_quantity=true" : ""}`
      );
    }
  }
  // Set page
  function pageSetter(page) {
    const new_page = parseInt(page["selected"]) + 1;
    pushRoute({ page: new_page });
  }
  // Set Sort
  function sortSetter(sort) {
    setSort(sort);
    setShowSort(false);
    let val = sort["value"];
    let order = "";
    let _sort = "";
    const i_o = val.indexOf("-");
    _sort = val.substring(0, i_o);
    order = val.substring(i_o + 1);
    const obj = { sort: _sort, order: order };
    pushRoute(obj);
  }
  // Set limit
  function limitSetter(limit) {
    setLimit(limit);
    setShowLimit(false);
    pushRoute({ limit: limit.value });
  }
  // Push Route
  function pushRoute(data) {
    const q_s = queryString.parse(location.search);
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const element = data[key];
        q_s[key] = element;
      }
    }
    router.push( "/" + catalog_name + `/${type.slice(0, 1)}=` + catalog_id+ queryString.stringify(q_s).replaceAll("%2C", ","));
  }
  // Get the route name
  function getType() {
    return type;
  }
  // Toggle filters headers
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

  const productSetting = {
    speed: 200,
    slidesToShow: 8,
    slidesToScroll: 3,
    infinite: false,
    prevArrow: <CustomPrevArrows direction={"l"} />,
    nextArrow: <CustomNextArrows direction={"r"} />,
  };
  const productMSetting = {
    speed: 200,
    slidesToShow: 3.5,
    slidesToScroll: 3,
    infinite: false,
  };

  function priceFilter(param) {
    // console.log(filterValue.start_value);
    var url = "";
    var url1 = new URL(router.Path);
    var filter_price = url1.searchParams.get("filter_price");

    setUserFilters({
      ...userFilters,
      filter_price: [],
    });

    if (
      priceFrom.current.value !== "" &&
      priceTo.current.value !== "" &&
      priceFrom.current.value < priceTo.current.value &&
      filter_price === null &&
      param !== "clear"
    ) {
      setUserFilters({
        ...userFilters,
        filter_price: [priceFrom.current.value + "-" + priceTo.current.value],
      });
      if (!url1?.searchParams?.get("has_filter")) {
        url += "?has_filter=true";
      }
      if (location.pathname.indexOf("filter_price")) {
        url +=
          "&filter_price=" +
          priceFrom.current.value +
          "-" +
          priceTo.current.value;
      }
    }
    if (!url1?.searchParams?.get("has_filter")) {
      router.push( path + url);
    } else {
      let active_filters = {};
      for (const key in userFilters) {
        if (Object.hasOwnProperty.call(userFilters, key)) {
          const element = userFilters[key];

          if (element.length > 0 && key !== "type_key") {
            active_filters[key] = element;
          }
        }
      }
      var query = "";

      query = "?has_filter=true&";

      let q = new URLSearchParams(active_filters).toString();

      q = decodeURIComponent(q);
      query += q;

      if (param === "clear") {
        setFilterValue({ start_price: "", end_price: "" });
        priceFrom.current.value = "";
        priceTo.current.value = "";
        if (
          router.Path.indexOf("filter_sellers") < 0 &&
          router.Path.indexOf("filter_munufacturers") < 0 &&
          router.Path.indexOf("filter_options") < 0 &&
          router.Path.indexOf("filter_advs") < 0
        ) {
          router.push( path);
        } else {
          router.push( path+ query.replace("&filter_price=" + filter_price, "") + "&last=p");
        }
      } else {
        router.push( path+ query + url);
      }
    }


  }
  const handleChange = (event) => {
    setFilterValue({ ...filterValue, start_price: event.target.value });

    // console.log("value is:", event.target.value);
  };

  const handleChangeEnd = (event) => {
    setFilterValue({ ...filterValue, end_price: event.target.value });

    // console.log("value is:", event.target.value);
  };
  // Check filters
  function parseFilter(typekey, filter) {
    setTopFilter({
      show: false,
      name: "",
      offset: 0,
    });
    const id = filter["id"];
    var last = "";
    let type_key = typekey;
    // var sort="";
    // var order="";
    // var limit ='';
    last = filter["last"];

    let values_array = userFilters[type_key];
    let c;
    let indexOfId = -1;
    let url1 = new URL(router.Path);
    var filter_type = typekey;
    c = url1.searchParams.get(filter_type);

    if (c !== null) {
      indexOfId = c.split(",").indexOf(filter["id"]);
    }
    if (indexOfId < 0) {
      // // console.log("Test from if");
      values_array.push(filter["id"]);

      setUserFilters({
        ...userFilters,
        type_key: values_array,
      });

      let active_filters = {};
      for (const key in userFilters) {
        if (Object.hasOwnProperty.call(userFilters, key)) {
          const element = userFilters[key];

          if (element.length > 0 && key !== "type_key") {
            active_filters[key] = element;
          }
        }
      }

      // if(url1.searchParams.get("sort")!=null){
      //   sort = "&sort=" + url1.searchParams.get("sort");
      // }
      // if(url1.searchParams.get("order")!=null){
      //   order = "&order=" + url1.searchParams.get("order");
      // }

      // if(url1.searchParams.get("limit")!=null){
      //   limit = "&limit=" + url1.searchParams.get("limit");
      // }
      let query = "?has_filter=true&";
      let q = new URLSearchParams(active_filters).toString();

      q = decodeURIComponent(q);
      query += q;

      router.push( path+ query + "&last=" + last);
    } else {
      let query = type_key + "=" + id;
      let q = new URLSearchParams(query).toString();
      q = decodeURIComponent(q);
      // console.log("q" + q);

      // console.log("query" + query);
      let url1 = "?has_filter=false";
      values_array.pop();
      setUserFilters({
        ...userFilters,
        type_key: values_array,
      });

      if (location.search.indexOf(id) > -1) {
        let c = "";
        var array;
        let lastLink;

        url1 = new URL(router.Path);
        // if(url1.searchParams.get("sort")!=null){
        //   sort = "&sort=" +url1.searchParams.get("sort");
        // }
        // if(url1.searchParams.get("order")!=null){
        //    order = "&order=" +url1.searchParams.get("order");
        // }
        // filter_type = "filter_" + type;
        c = url1.searchParams.get(filter_type);
        if (c != null) {
          array = c.split(",");
          let indexOfId = array.indexOf(id);
          let lengthArray = array.length;
          if (indexOfId >= 0) {
            lastLink = url1.searchParams.get("last");
            if (indexOfId === 0 && lengthArray === 1) {
              if (location.search.indexOf("&" + q) > 0) {
                url1 = location.search.replace("&" + q, "");
              } else {
                url1 = location.search.replace(q, "");
              }

              if (url1 === "?has_filter=true&last=" + lastLink) {
                url1 = "";
              }
              if (url1 !== "") {
                url1 = url1
                  .toString()
                  .replace("&last=" + lastLink, "&last=" + last);
              }
            } else if (indexOfId === 0 && lengthArray > 1) {
              url1 = location.search.replace(id + ",", "");
              url1 = url1
                .toString()
                .replace("&last=" + lastLink, "&last=" + last);
            } else {
              url1 = location.search.replace("," + id, "");
              url1 = url1
                .toString()
                .replace("&last=" + lastLink, "&last=" + last);
            }
          }
        }
        router.push( url+ url1);
      } else {
        router.push({
          pathname: "/" + path1,
        });
      }
    }
  }

  function checkFilter(type, name, filter) {
    location.state = {
      oldFilters: data && data.filters,
    };

    var url = new URL(router.Path);
    //  console.log("type=" + name);
    var c = url.searchParams.get(type);

    // console.log(filter["id"]);
    let array = Array("");
    array[type] = c?.split(",");
    // console.log("ccccc" + c);

    // console.log("ccccc" + c);
    if (name === "Color" || name === "Light Color") {
      // console.log("omar" + filter["id"]);
      if (c !== null && array[type].includes(filter["id"]) === true) {
        return "rounded-full border border-dblue";
      } else {
        return "rounded-full border relative border-dgreyRate cursor-pointer hover:shadow";
      }
    } else if (
      name === "Shoes Size" ||
      name === "Size by Age" ||
      name === "jeans Size" ||
      name === "Socks"
    ) {
      if (c !== null && array[type].includes(filter["id"]) === true) {
        return "border rounded text-dblue border-dblue p-2";
      } else {
        return "border rounded relative border-dgreyRate cursor-pointer hover:shadow p-2";
      }
    } else {
      if (c !== null && array[type].includes(filter["id"]) === true) {
        return "icon-ok-squared text-dblue";
      } else {
        return "icon-check-empty";
      }
    }
  }

  //export products pdf for flo
  useEffect(() => {
    if (exportProduct) {
      setLoadingExport(true);
      const url =
        parseUrl(false, true) +
        `&export_all=true&user_id=${Cookies.get("user_id")}`;

      axiosServer.get(url).then((response) => {
        if (!response.data?.success) {
          setErrPermission(response?.data?.message);
          setLoadingExport(false);
          setExportProduct(false);
          setTimeout(() => {
            setErrPermission("");
          }, 4000);
          return;
        }

        if (response.data.error || response.data.breadcrumbs?.length === 0) {
          setEmpty(true);
          setData(response.data);
          setNoDataNoError(true);
          loadingContext.done();
          setLoadingExport(false);
          setExportProduct(false);
          return;
        }

        const is_filter = router.Path.indexOf("has_filter") > 0;
        let data;
        if (is_filter) {
          data = response.data.data;
        } else {
          data = response.data.data;
        }

        // statesSetter(data);
        // setData(data);
        // loadingContext.done();

        // if (data?.error) {
        //   checkErrorFilters();
        // }

        // setFilters(!is_filter ? data?.filters : data?.filters);
        const products_arr = response?.data?.data?.products;
        // const pdf_export = new JsPDF("landscape", "pt", "a4");
        // pdf_export.html(document.querySelector("#grid-div")).then(() => {
        //   pdf_export.save("products.pdf");
        //   setLoadingExport(false);
        //   setExportProduct(false)
        // });

        const productsPerPage = 1500; // You can adjust this value based on your requirements
        const totalPages = Math.ceil(products_arr.length / productsPerPage);
        generatePDF(products_arr, 1, totalPages);
      });
    }
  }, [exportProduct]);

  const generatePDF = (products, currentPage, totalPages) => {
    const pdf_export = new JsPDF("landscape", "pt", "a4");

    let productsPerPage = 1500;

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = Math.min(startIndex + productsPerPage, products.length);
    const pageData = products.slice(startIndex, endIndex);

    const pageDiv = document.createElement("div");
    pageDiv.id = "temp-page-div";
    pageDiv.style.display = "grid";
    pageDiv.style.width = "70%";
    pageDiv.style.marginLeft = "10px";
    pageDiv.style.gridTemplateColumns = "1fr 1fr"; // Two columns for each row
    document.body.appendChild(pageDiv);

    // pageData.forEach((product) => {
    //   const productColumn = document.createElement("div");
    //   productColumn.className = "grid-column";
    //   console.log(product);
    //   const singleProduct = (
    //     <SingleProductExport
    //       item={product}
    //       style={{ width: "100%", maxWidth: "100%" }}
    //     ></SingleProductExport>
    //   );
    //   ReactDOM.render(singleProduct, productColumn);
    //   pageDiv.appendChild(productColumn);
    // });

    pdf_export.html(pageDiv).then(() => {
      pdf_export.save(`products_page_${currentPage}.pdf`);

      document.body.removeChild(pageDiv);

      if (currentPage < totalPages) {
        generatePDF(products, currentPage + 1, totalPages);
      } else {
        // All pages have been generated, so finish the export process
        setLoadingExport(false);
        setExportProduct(false);
      }
    });
  };

  if (
    (data?.products?.length < 1 && data?.widgets?.length < 1) ||
    data?.error ||
    noDataNoError
  ) {
    return (
      <div className="flex items-center justify-center mt-20 pb-5 flex-col">
        {/* <img src={notFound} className=" w-2/12" alt="Not Found" /> */}
        <h2 className="text-2xl mt-4">Sorry, there is nothing here!</h2>
        <Link
          href={`${path}/`}
          className="bg-dblue text-white px-10 py-3 rounded mt-4"
        >
          START SHOPPING
        </Link>
        <button
        //   onClick={() => router.goBack()}
          className="bg-dbase text-white px-10 py-3 rounded mt-4"
        >
          Go back
        </button>
      </div>
    );
  } else {
    return (
      <div className="w-full h-full bg-dinputBorder">
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
        <div
          className="container h-full pt-2 pb-2"
          style={{ backgroundColor: "#f7f7fa" }}
        >
          {data ? (
            // If there is a response
            <div>
              {!data.products ? (
                width > 650 ? (
                <div></div>
                ) : (
                //   <CatalogMobilePlaceholder />
                <div></div>
                )
              ) : (
                1 === 1 && (
                  <div>
                    {/* Breadcrumbs */}
                    {
                      <div className=" hidden xl:flex lg:flex pt-2 pb-2  items-center text-xs  text-dgrey1">
                        <div className="flex items-center">
                          <Link
                            href="/"
                            className="hidden md:block text-dblack font-light truncate text-d11 md:text-tiny mr-2 hover:text-dblue"
                            dangerouslySetInnerHTML={{
                              __html: "Home",
                            }}
                          />{" "}
                          <i className="icon icon-angle-right"></i>
                        </div>
                        {data?.breadcrumbs?.map((bread) => (
                          <div className="flex items-center" key={bread.text}>
                            <p className=" mx-2">
                              {bread.text.replace("&amp;", "&")}
                            </p>
                          </div>
                        ))}
                      </div>
                    }
                    {/* <SeoHandler
                      data={{
                        title: data?.heading_title,
                        description: data.meta?.meta_description,
                        keyword: data.meta?.meta_keyword,
                        // tag: data.meta.meta_tags,
                      }}
                    /> */}
                    <div className="flex text-dblack items-start">
                      {/* Filters */}
                      <div className=" w-2/12 pr-8 hidden xl:block lg:block">
                        <div>
                          {filters &&
                            Object.keys(filters).map((key) => (
                              <div key={key}>
                                {filters[key].items.length > 0 ? (
                                  <div>
                                    <h1
                                      className="
                                                                capitalize
                                                                mb-3
                                                                mt-1
                                                                text-base
                                                                font-semibold
                                                                text-dblack
                                                                flex
                                                                items-center
                                                                justify-between
                                                                cursor-pointer
                                                                hover:opacity-80
                                                                relative
                                                                    
                                                                "
                                      onClick={(e) =>
                                        toggleVisibility(e.target)
                                      }
                                    >
                                      <div className="absolute w-full h-full"></div>
                                      <span>{filters[key].name}</span>
                                      <i className="icon icon-angle-down text-dgrey1 text-2xl transition-all"></i>
                                    </h1>

                                    <div style={{ display: "block" }}>
                                      {key ? (
                                        <div>
                                          {filters[key].items
                                            .slice(0, 5)
                                            .map((filter) => (
                                              <div key={Math.random()}>
                                                {filters[key].name ===
                                                  "Light Color" ||
                                                filters[key].name ===
                                                  "Color" ? (
                                                  <p
                                                    className="my-2 flex items-center cursor-pointer hover:text-dblue"
                                                    key={filter.name}
                                                    onClick={() =>
                                                      parseFilter(
                                                        filters[key].id,
                                                        filter
                                                      )
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
                                                            padding: `1px`,
                                                          }}
                                                          className={`w-12/12 rounded-full border border-dgreyRate`}
                                                          alt="Not Found"
                                                        />
                                                      </span>
                                                      <p className="py-2 mx-2 text-d13 w-8/12 font-light">
                                                        {" "}
                                                        {filter.name}
                                                      </p>
                                                    </span>
                                                    <span className="flex w-1/12"></span>
                                                    <span className="text-d13 text-right font-light ">
                                                      ({filter.count})
                                                    </span>
                                                  </p>
                                                ) : (
                                                  <div>
                                                    <p
                                                      className="my-2 float items-center cursor-pointer hover:text-dblue"
                                                      key={filter.name}
                                                      onClick={() =>
                                                        parseFilter(
                                                          filters[key].id,
                                                          filter
                                                        )
                                                      }
                                                    >
                                                      <i
                                                        className={`icon mr-1 text-base  ${checkFilter(
                                                          filters[key].id,
                                                          filter.name,
                                                          filter
                                                        )}`}
                                                      ></i>
                                                      <span className="text-d13 font-light">
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
                                          <div>
                                            <label
                                              className={
                                                filters[key].items.length > 5
                                                  ? `text-dblue text-xs cursor-pointer`
                                                  : "hidden"
                                              }
                                              onClick={(e) =>
                                                toggleFilters(e.target)
                                              }
                                            >
                                              Show More
                                            </label>
                                          </div>
                                          <div style={{ display: "none" }}>
                                            {filters[key].items
                                              .slice(
                                                5,
                                                filters[key].items.length
                                              )
                                              .map((filter) => (
                                                <div key={Math.random()}>
                                                  {filters[key].name ===
                                                    "Light Color" ||
                                                  filters[key].name ===
                                                    "Color" ? (
                                                    <p
                                                      className="my-2 flex items-center cursor-pointer hover:text-dblue"
                                                      key={filter.name}
                                                      onClick={() =>
                                                        parseFilter(
                                                          filters[key].id,
                                                          filter
                                                        )
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
                                                              padding: `1px`,
                                                            }}
                                                            className={`w-12/12 rounded-full border border-dgreyRate`}
                                                            alt="Not Found"
                                                          />
                                                        </span>
                                                        <p className="py-2 mx-2 text-d13 w-8/12 font-light">
                                                          {" "}
                                                          {filter.name}
                                                        </p>
                                                      </span>
                                                      <span className="flex w-1/12"></span>
                                                      <span className="text-d13 text-right font-light ">
                                                        ({filter.count})
                                                      </span>
                                                    </p>
                                                  ) : (
                                                    <div>
                                                      <p
                                                        className="my-2 float items-center cursor-pointer hover:text-dblue"
                                                        key={filter.name}
                                                        onClick={() =>
                                                          parseFilter(
                                                            filters[key].id,
                                                            filter
                                                          )
                                                        }
                                                      >
                                                        <i
                                                          className={`icon mr-1 text-base  ${checkFilter(
                                                            filters[key].id,
                                                            filter.name,
                                                            filter
                                                          )}`}
                                                        ></i>
                                                        <span className="text-d13 font-light">
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
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                  // filters[key].name === "Price" && (
                                  //   <div>
                                  //     <h1
                                  //       className="
                                  //                               capitalize
                                  //                               mb-3
                                  //                               mt-3
                                  //                               text-base
                                  //                               font-semibold
                                  //                               text-dblack

                                  //                               items-center
                                  //                               justify-between
                                  //                               cursor-pointer
                                  //                               hover:opacity-80
                                  //                               relative

                                  //                               "
                                  //       onClick={(e) =>
                                  //         toggleVisibility(e.target)
                                  //       }
                                  //     >
                                  //       <div className="absolute  h-full"></div>
                                  //       <span className="">
                                  //         {filters[key].name} (USD)
                                  //       </span>{" "}
                                  //       {filters[key].start_price !== null && (
                                  //         <span
                                  //           className="text-dblue text-d12 text-left ml-4"
                                  //           onClick={() => priceFilter("clear")}
                                  //         >
                                  //           clear
                                  //         </span>
                                  //       )}
                                  //     </h1>
                                  //     <div className="flex pt-2 text-d14">
                                  //       {" "}
                                  //       <input
                                  //         type="number"
                                  //         className="mx-1 w-14 px-2 py-1  border-dborderColor focus:outline-none text-d12"
                                  //         ref={priceFrom}
                                  //         onChange={handleChange}
                                  //         value={filterValue.start_price}
                                  //       />{" "}
                                  //       <span className="text-dgrey1 p-1 ">
                                  //         To
                                  //       </span>
                                  //       <input
                                  //         type="number"
                                  //         className="mx-1 w-14 px-2 py-1 border border-dborderColor hover:border-dborderColor focus:outline-none text-d12"
                                  //         ref={priceTo}
                                  //         onChange={handleChangeEnd}
                                  //         value={filterValue.end_price}
                                  //       />
                                  //       <button
                                  //         className="text-dgrey1 pl-1  hover:opacity-40"
                                  //         onClick={() => priceFilter("")}
                                  //       >
                                  //         GO
                                  //       </button>
                                  //     </div>{" "}
                                  //   </div>
                                  // )
                                )}
                              </div>
                            ))}
                        </div>
                        {/* <button className="block w-full text-center bg-dbluedark text-white rounded py-2 hover:bg-dblue" onClick={() => applyFilters()}>APPLY FILTERS</button> */}
                      </div>
                      {/* Products */}
                      <div className="w-full xl:w-10/12 lg:w-10/12">
                        <div className="block xl:flex lg:flex justify-between  pb-2 items-center">
                          {/* Results found */}
                          <div className=" pb-4 xl:pb-0 lg:pb-0 flex mx-1">
                            <span className=" mr-1 font-light">
                              {data.product_total} Results{" "}
                              {data.heading_title && "for"}
                            </span>
                            {data.heading_title && '"'}
                            <h1
                              className="font-semibold capitalize"
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(data.heading_title),
                              }}
                            />
                            {data.heading_title && '"'}
                          </div>
                          {/* Settings */}
                          {/* Desktop setting */}
                          <div className="hidden xl:flex lg:flex">
                            {/* Sorts */}
                            {data?.products?.length > 0 && (
                              <div className=" px-8 flex items-center">
                                <span className=" text-xs font-semibold text-dgrey1">
                                  SORT BY
                                </span>
                                <div className="relative">
                                  <button
                                    className="bg-white px-8 py-1 ml-4 border text-sm font-semibold cursor-pointer rounded flex items-start"
                                    onClick={() => setShowSort(!showSort)}
                                  >
                                    <span>
                                      {
                                        <span
                                          dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                              sort.text
                                            ),
                                          }}
                                        ></span>
                                      }
                                    </span>
                                    <i
                                      className={`block icon icon-angle-down ml-2 transition-all ${
                                        showSort && "transform  rotate-180"
                                      }`}
                                    ></i>
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
                                            __html: DOMPurify.sanitize(
                                              sort.text
                                            ),
                                          }}
                                        ></span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            {/* Per Page */}
                            {data?.products?.length > 0 && (
                              <div className=" px-8 flex items-center">
                                <span className=" text-xs font-semibold text-dgrey1">
                                  DISPLAY
                                </span>
                                <div className="relative">
                                  <button
                                    className="bg-white px-8 py-1 ml-4 border text-sm font-semibold cursor-pointer rounded flex items-start"
                                    onClick={() => setShowLimit(!showLimit)}
                                  >
                                    <span>
                                      {
                                        <span
                                          dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                              limit.text
                                            ),
                                          }}
                                        ></span>
                                      }
                                    </span>
                                    <i
                                      className={`block icon icon-angle-down ml-2 transition-all ${
                                        showLimit && "transform  rotate-180"
                                      }`}
                                    ></i>
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
                                            __html: DOMPurify.sanitize(
                                              limit.text
                                            ),
                                          }}
                                        ></span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            {/* Display GRID OR LIST */}
                            {data?.products?.length > 0 && (
                              <div className="flex items-center">
                                <span className=" text-xs font-semibold text-dgrey1">
                                  {productDisplay === "grid" ? "Grid" : "List"}
                                </span>
                                <button
                                  className={`bg-white ml-4 text-lg border rounded block icon  transition-all ${
                                    productDisplay === "grid"
                                      ? "icon-th-list"
                                      : "icon-th-thumb-empty"
                                  }`}
                                  onClick={() =>
                                    setProductDisplay(
                                      productDisplay === "grid"
                                        ? "list"
                                        : "grid"
                                    )
                                  }
                                  style={{ width: "30px", height: "30px" }}
                                ></button>
                              </div>
                            )}
                          </div>
                          {/* Mobile Setting */}
                          <div className="block xl:hidden lg:hidden">
                            {/* Mobile sorts */}
                            {mobileSort && (
                              <div
                                onClick={() => showMobileSort(false)}
                                className="bg-dblack bg-opacity-20 z-50 w-screen h-screen fixed top-0 left-0 flex justify-end"
                              >
                                <div className="bg-white w-3/5 p-2">
                                  {data?.sorts?.map((_sort) => (
                                    <button
                                      className="flex items-center justify-between  w-full"
                                      onClick={() => sortSetter(_sort)}
                                      key={_sort.value}
                                    >
                                      <span
                                        className=" block text-sm font-light px-4 py-2 cursor-pointer hover:bg-dblue hover:text-white"
                                        key={_sort.value}
                                        dangerouslySetInnerHTML={{
                                          __html: DOMPurify.sanitize(
                                            _sort.text
                                          ),
                                        }}
                                      ></span>

                                      <i
                                        className={`icon ${
                                          sort.value === _sort.value
                                            ? "icon-ok text-dblue"
                                            : "icon-check-empty text-dgrey1"
                                        }`}
                                      ></i>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                            {/* Mobile filters */}

                            {mobileFilter && (
                              <div className="bg-dblack bg-opacity-20 w-screen z-50 min-h-screen fixed top-0 left-0 bottom-0 right-0 overflow-y-scroll">
                                <div className="bg-white min-h-screen pb-12  ">
                                  <h2 className=" px-2 text-xl border-b py-2 border-dinputBorder font-semibold flex items-center justify-between ">
                                    <span>Filter</span>
                                    <button
                                      onClick={() => showMobileFilter(false)}
                                    >
                                      <i className="icon icon-cancel text-2xl"></i>
                                    </button>
                                  </h2>
                                  {/* Filters */}
                                  <div className="px-2">
                                    {filters &&
                                      Object.keys(filters).map((key) => (
                                        <div key={key}>
                                          {filters[key].items.length > 0 ? (
                                            <h1
                                              className="
                                                                capitalize
                                                                mb-3
                                                                mt-1
                                                                text-base
                                                                font-semibold
                                                                text-dblack
                                                                flex
                                                                items-center
                                                                justify-between
                                                                cursor-pointer
                                                                hover:opacity-80
                                                                relative
                                                                    
                                                                "
                                              onClick={(e) =>
                                                toggleVisibility(e.target)
                                              }
                                            >
                                              <div className="absolute w-full h-full"></div>
                                              <span>{filters[key].name}</span>
                                              <i className="icon icon-angle-down text-dgrey1 text-2xl transition-all"></i>
                                            </h1>
                                          ) : (
                                            ""
                                            // filters[key].name === "Price" && (
                                            //   <div>
                                            //     <h1
                                            //       className="
                                            //                               capitalize
                                            //                               mb-3
                                            //                               mt-3
                                            //                               text-base
                                            //                               font-semibold
                                            //                               text-dblack

                                            //                               items-center
                                            //                               justify-between
                                            //                               cursor-pointer
                                            //                               hover:opacity-80
                                            //                               relative

                                            //                               "
                                            //       onClick={(e) =>
                                            //         toggleVisibility(e.target)
                                            //       }
                                            //     >
                                            //       <div className="absolute  h-full"></div>
                                            //       <span>
                                            //         {filters[key].name} (USD)
                                            //       </span>{" "}
                                            //       {filters[key].start_price !==
                                            //         null && (
                                            //         <span className="text-dblue text-d12 text-left ml-4">
                                            //           clear
                                            //         </span>
                                            //       )}
                                            //     </h1>
                                            //     <div className="flex pt-2 text-d14">
                                            //       {" "}
                                            //       <input
                                            //         type="number"
                                            //         className="mx-1 w-18 px-2 py-1  border  border-dborderColor  hover:border-dborderColor focus:outline-none text-d12"
                                            //         onChange={handleChange}
                                            //         value={
                                            //           filterValue.start_price
                                            //         }
                                            //         ref={priceFrom}
                                            //       />{" "}
                                            //       <span className="text-dgrey1 p-1 ">
                                            //         To
                                            //       </span>
                                            //       <input
                                            //         type="number"
                                            //         className="mx-1 w-18 px-2 py-1 border border-dborderColor hover:border-dborderColor focus:outline-none text-d12"
                                            //         ref={priceTo}
                                            //         onChange={handleChangeEnd}
                                            //         value={
                                            //           filterValue.end_price
                                            //         }
                                            //       />
                                            //       <button
                                            //         className="text-dgrey1 pl-1  hover:opacity-40"
                                            //         onClick={() =>
                                            //           priceFilter()
                                            //         }
                                            //       >
                                            //         GO
                                            //       </button>
                                            //     </div>{" "}
                                            //   </div>
                                            // )
                                          )}
                                          <div style={{ display: "block" }}>
                                            {key &&
                                            filters[key].items.length > 0 ? (
                                              <div>
                                                {filters[key].items
                                                  .slice(0, 5)
                                                  .map((filter) => (
                                                    <div key={Math.random()}>
                                                      {filters[key].name ===
                                                        "Light Color" ||
                                                      filters[key].name ===
                                                        "Color" ? (
                                                        <p
                                                          className="my-2 flex items-center cursor-pointer hover:text-dblue"
                                                          key={filter.name}
                                                          onClick={() =>
                                                            parseFilter(
                                                              filters[key].id,
                                                              filter
                                                            )
                                                          }
                                                        >
                                                          <span className="flex w-10/12">
                                                            <span
                                                              className={`flex w-7 h-7 ${checkFilter(
                                                                filters[key].id,
                                                                filters[key]
                                                                  .name,
                                                                filter
                                                              )}`}
                                                            >
                                                              <img
                                                                src={
                                                                  filter.image
                                                                }
                                                                style={{
                                                                  padding: `1px`,
                                                                }}
                                                                className={`w-12/12 rounded-full border border-dgreyRate`}
                                                                alt="Not Found"
                                                              />
                                                            </span>
                                                            <p className="py-2 mx-2 text-d13 w-8/12 font-light">
                                                              {" "}
                                                              {filter.name}
                                                            </p>
                                                          </span>
                                                          <span className="flex w-10/12"></span>
                                                          <span className="text-d13 text-right font-light ">
                                                            ({filter.count})
                                                          </span>
                                                        </p>
                                                      ) : (
                                                        <div>
                                                          <p
                                                            className="my-2 float items-center cursor-pointer hover:text-dblue"
                                                            key={filter.name}
                                                            onClick={() =>
                                                              parseFilter(
                                                                filters[key].id,
                                                                filter
                                                              )
                                                            }
                                                          >
                                                            <i
                                                              className={`icon mr-1 text-base  ${checkFilter(
                                                                filters[key].id,
                                                                filter.name,
                                                                filter
                                                              )}`}
                                                            ></i>
                                                            <span className="text-d13 font-light">
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
                                                <div>
                                                  <label
                                                    className={
                                                      filters[key].items
                                                        .length > 5
                                                        ? `text-dblue text-xs cursor-pointer`
                                                        : "hidden"
                                                    }
                                                    onClick={(e) =>
                                                      toggleFilters(e.target)
                                                    }
                                                  >
                                                    Show More
                                                  </label>
                                                </div>
                                                <div
                                                  style={{ display: "none" }}
                                                >
                                                  {filters[key].items
                                                    .slice(
                                                      5,
                                                      filters[key].items.length
                                                    )
                                                    .map((filter) => (
                                                      <div key={Math.random()}>
                                                        {filters[key].name ===
                                                          "Light Color" ||
                                                        filters[key].name ===
                                                          "Color" ? (
                                                          <p
                                                            className="my-2 flex items-center cursor-pointer hover:text-dblue"
                                                            key={filter.name}
                                                            onClick={() =>
                                                              parseFilter(
                                                                filters[key].id,
                                                                filter
                                                              )
                                                            }
                                                          >
                                                            <span className="flex w-10/12">
                                                              <span
                                                                className={`flex w-7 h-7 ${checkFilter(
                                                                  filters[key]
                                                                    .id,
                                                                  filters[key]
                                                                    .name,
                                                                  filter
                                                                )}`}
                                                              >
                                                                <img
                                                                  src={
                                                                    filter.image
                                                                  }
                                                                  style={{
                                                                    padding: `1px`,
                                                                  }}
                                                                  className={`w-12/12 rounded-full border border-dgreyRate`}
                                                                  alt="Not Found"
                                                                />
                                                              </span>
                                                              <p className="py-2 mx-2 text-d13 w-8/12 font-light">
                                                                {" "}
                                                                {filter.name}
                                                              </p>
                                                            </span>
                                                            <span className="flex w-1/12"></span>
                                                            <span className="text-d13 text-right font-light ">
                                                              ({filter.count})
                                                            </span>
                                                          </p>
                                                        ) : (
                                                          <div>
                                                            <p
                                                              className="my-2 float items-center cursor-pointer hover:text-dblue"
                                                              key={filter.name}
                                                              onClick={() =>
                                                                parseFilter(
                                                                  filters[key]
                                                                    .id,
                                                                  filter
                                                                )
                                                              }
                                                            >
                                                              <i
                                                                className={`icon mr-1 text-base  ${checkFilter(
                                                                  filters[key]
                                                                    .id,
                                                                  filter.name,
                                                                  filter
                                                                )}`}
                                                              ></i>
                                                              <span className="text-d13 font-light">
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
                                              </div>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                  {/* End Filters */}
                                </div>
                              </div>
                            )}

                            {/* End mobile filters */}
                            <div className="w-screen bg-white -mx-4">
                              <div className="grid grid-cols-2 divide-x divide-dinputBorder bg-white py-2 rounded">
                                <button onClick={() => showMobileFilter(true)}>
                                  <span>Filter</span>
                                  <i className="icon icon-filter ml-1"></i>
                                </button>
                                {data?.products?.length > 0 && (
                                  <button onClick={() => showMobileSort(true)}>
                                    <span>Sort By</span>
                                    <i className="icon icon-sort ml-1"></i>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {filters &&
                          (filters[0]?.items?.length > 0 ||
                            filters[1]?.items?.length > 0) && (
                            <div className="  w-full block relative z-20">
                              <div className="relative flex items-center mb-3 mt-4">
                                {width > 650 ? (
                                  <div
                                    className={`catalog-top-filter  ${
                                      topFilter.show
                                        ? "catalog-top-filter-open "
                                        : ""
                                    }`}
                                    style={{ left: topFilter.offset }}
                                    ref={wrapperRef}
                                  >
                                    <div className="catalog-top-filter-container px-1 pb-2">
                                      {data.filters.findIndex(
                                        (x) => x.name === topFilter.name
                                      ) !== -1 && (
                                        <div className="pb-4 px-3">
                                          <div className="flex place-content-between place-items-center px-4">
                                            {" "}
                                            <div className=" w-full py-4">
                                              {data.filters[
                                                data.filters.findIndex(
                                                  (x) =>
                                                    x.name === topFilter.name
                                                )
                                              ].name
                                                .charAt(0)
                                                .toUpperCase() +
                                                data.filters[
                                                  data.filters.findIndex(
                                                    (x) =>
                                                      x.name === topFilter.name
                                                  )
                                                ].name.slice(1)}
                                            </div>
                                            <button
                                              className="sizeClear"
                                              onClick={() =>
                                                clearFilter(
                                                  data.filters[
                                                    data.filters.findIndex(
                                                      (x) =>
                                                        x.name ===
                                                        topFilter.name
                                                    )
                                                  ]
                                                )
                                              }
                                            >
                                              Clear
                                            </button>
                                          </div>
                                          {filters && (
                                            <div className="grid grid-cols-3">
                                              {filters[
                                                data.filters.findIndex(
                                                  (x) =>
                                                    x.name === topFilter.name
                                                )
                                              ]?.items?.map((filter) => (
                                                <div
                                                  className="w-auto px-3 py-1"
                                                  key={Math.random()}
                                                >
                                                  {filters[
                                                    data.filters.findIndex(
                                                      (x) =>
                                                        x.name ===
                                                        topFilter.name
                                                    )
                                                  ].name === "Light Color" ||
                                                  filters[
                                                    data.filters.findIndex(
                                                      (x) =>
                                                        x.name ===
                                                        topFilter.name
                                                    )
                                                  ].name === "Color" ? (
                                                    <p
                                                      className=" flex items-center justify-between cursor-pointer hover:text-dblue"
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
                                                          filter
                                                        )
                                                      }
                                                    >
                                                      <span className="flex">
                                                        <img
                                                          src={filter.image}
                                                          style={{
                                                            padding: `2px`,
                                                          }}
                                                          className={`w-7 h-7 rounded-full ${checkFilter(
                                                            filters[
                                                              data.filters.findIndex(
                                                                (x) =>
                                                                  x.name ===
                                                                  topFilter.name
                                                              )
                                                            ].id,
                                                            filters[
                                                              data.filters.findIndex(
                                                                (x) =>
                                                                  x.name ===
                                                                  topFilter.name
                                                              )
                                                            ].name,
                                                            filter
                                                          )}`}
                                                          alt=""
                                                        />

                                                        <p className="py-2 mx-2 text-d13 w-8/12 font-light">
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
                                                        (x) =>
                                                          x.name ===
                                                          topFilter.name
                                                      )
                                                    ].name === "jeans Size" ||
                                                    filters[
                                                      data.filters.findIndex(
                                                        (x) =>
                                                          x.name ===
                                                          topFilter.name
                                                      )
                                                    ].name === "Shoes Size" ? (
                                                    <div
                                                      className={` ${
                                                        width >= 1400
                                                          ? "w-48"
                                                          : "w-28"
                                                      } `}
                                                    >
                                                      <p
                                                        className={`flex justify-between items-center cursor-pointer hover:text-dblue ${checkFilter(
                                                          filters[
                                                            data.filters.findIndex(
                                                              (x) =>
                                                                x.name ===
                                                                topFilter.name
                                                            )
                                                          ].id,
                                                          data.filters[
                                                            data.filters.findIndex(
                                                              (x) =>
                                                                x.name ===
                                                                topFilter.name
                                                            )
                                                          ].name,
                                                          filter
                                                        )}`}
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
                                                            filter
                                                          )
                                                        }
                                                      >
                                                        <span className="text-d13 font-light">
                                                          {filter.name}
                                                        </span>

                                                        <span className="float-right text-d13 font-light">
                                                          ({filter.count})
                                                        </span>
                                                      </p>
                                                    </div>
                                                  ) : (
                                                    filters[
                                                      data.filters.findIndex(
                                                        (x) =>
                                                          x.name ===
                                                          topFilter.name
                                                      )
                                                    ].name !== "Socks" &&
                                                    filters[
                                                      data.filters.findIndex(
                                                        (x) =>
                                                          x.name ===
                                                          topFilter.name
                                                      )
                                                    ].name !==
                                                      "Size by Age" && (
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
                                                              filter
                                                            )
                                                          }
                                                        >
                                                          <div className="mr-1">
                                                            {" "}
                                                            <i
                                                              className={`icon mr-1 text-base  ${checkFilter(
                                                                filters[
                                                                  data.filters.findIndex(
                                                                    (x) =>
                                                                      x.name ===
                                                                      topFilter.name
                                                                  )
                                                                ].id,
                                                                filter.name,
                                                                filter
                                                              )}`}
                                                            ></i>
                                                            <span className="text-d13 font-light">
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
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className={`mobile-catalog-filter ${
                                      topFilter.show &&
                                      "mobile-catalog-filter-open"
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
                                          offset: 0,
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
                                            offset: 0,
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
                                                  (x) =>
                                                    x.name === topFilter.name
                                                )
                                              ]?.name.slice(1)}
                                          </h3>
                                          <button
                                            className="text-dblue cursor-pointer text-sm bg-transparent"
                                            onClick={() =>
                                              clearFilter(
                                                data.filters[
                                                  data.filters.findIndex(
                                                    (x) =>
                                                      x.name === topFilter.name
                                                  )
                                                ]
                                              )
                                            }
                                          >
                                            Clear
                                          </button>
                                        </div>
                                        <div
                                          className="overflow-y-auto pt-4 pb-4 -mr-6 pr-6 catalog-mobile-scroll"
                                          style={{ height: "65vh" }}
                                        >
                                          {filters && (
                                            <div className="grid grid-cols-1">
                                              {filters[
                                                data.filters.findIndex(
                                                  (x) =>
                                                    x.name === topFilter.name
                                                )
                                              ]?.items?.map((filter) => (
                                                <div
                                                  className="w-full px-3 py-1"
                                                  key={Math.random()}
                                                >
                                                  {filters[
                                                    data.filters.findIndex(
                                                      (x) =>
                                                        x.name ===
                                                        topFilter.name
                                                    )
                                                  ].name === "Light Color" ||
                                                  filters[
                                                    data.filters.findIndex(
                                                      (x) =>
                                                        x.name ===
                                                        topFilter.name
                                                    )
                                                  ].name === "Color" ? (
                                                    <p
                                                      className=" flex items-center justify-between cursor-pointer hover:text-dblue"
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
                                                          filter
                                                        )
                                                      }
                                                    >
                                                      <span className="flex">
                                                        <img
                                                          src={filter.image}
                                                          style={{
                                                            padding: `2px`,
                                                          }}
                                                          className={`w-7 h-7 rounded-full ${checkFilter(
                                                            filters[
                                                              data.filters.findIndex(
                                                                (x) =>
                                                                  x.name ===
                                                                  topFilter.name
                                                              )
                                                            ].id,
                                                            filters[
                                                              data.filters.findIndex(
                                                                (x) =>
                                                                  x.name ===
                                                                  topFilter.name
                                                              )
                                                            ].name,
                                                            filter
                                                          )}`}
                                                          alt=""
                                                        />

                                                        <p className="py-2 mx-2 text-d13 w-8/12 font-light">
                                                          {" "}
                                                          {filter.name}
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
                                                            filters[
                                                              data.filters.findIndex(
                                                                (x) =>
                                                                  x.name ===
                                                                  topFilter.name
                                                              )
                                                            ].id,
                                                            filter
                                                          )
                                                        }
                                                      >
                                                        <i
                                                          className={`icon mr-1 text-base  ${checkFilter(
                                                            filters[
                                                              data.filters.findIndex(
                                                                (x) =>
                                                                  x.name ===
                                                                  topFilter.name
                                                              )
                                                            ].id,
                                                            filter.name,
                                                            filter
                                                          )}`}
                                                        ></i>
                                                        <span className="text-d13 font-light">
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
                                )}
                                <div
                                  className={` ${
                                    width > 650
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
                                    navigation={width > 650 ? true : false}
                                    modules={[Navigation]}
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
                                            onClick={() =>
                                              handleTopFilter(filter.name)
                                            }
                                          >
                                            <button
                                              className="p-1 "
                                              id={filter.name}
                                            >
                                              <div
                                                className={`text-sm px-3 flex-nowrap flex justify-between items-center rounded-2xl  ${checkMainFilter(
                                                  filter
                                                )}`}
                                                style={{
                                                  paddingTop: "6px",
                                                  paddingBottom: "6px",
                                                }}
                                              >
                                                <span className="w-max">
                                                  {filter.name
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    filter.name.slice(1)}
                                                </span>
                                                <span className="ml-2">
                                                  <IoIosArrowDown />
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
                                            userFilters[filter.id].includes(
                                              item.id
                                            )
                                          ) {
                                            // console.log(userFilters);
                                            return (
                                              <SwiperSlide key={filter.id}>
                                                <button
                                                  className="p-1 "
                                                  onClick={() =>
                                                    parseFilter(filter.id, item)
                                                  }
                                                >
                                                  <div
                                                    className={`text-sm px-3 flex-nowrap flex justify-between items-center rounded-2xl catalog-top-filter-selected`}
                                                    style={{
                                                      paddingTop: "6px",
                                                      paddingBottom: "6px",
                                                    }}
                                                  >
                                                    <span className="w-max">
                                                      {item.name}
                                                    </span>
                                                    <span className="ml-2">
                                                      <AiOutlineClose />
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
                                            !userFilters[filter.id].includes(
                                              item.id
                                            )
                                          ) {
                                            if (filter.name === "Sellers") {
                                              const temp = Math.max(
                                                ...filter.items.map((o) => {
                                                  if (
                                                    !userFilters[
                                                      filter.id
                                                    ].includes(o.id)
                                                  ) {
                                                    return Number(o.count);
                                                  }
                                                })
                                              );

                                              if (
                                                temp &&
                                                Number(item.count) === temp
                                              ) {
                                                return (
                                                  <SwiperSlide>
                                                    <button
                                                      className="p-1 "
                                                      onClick={() =>
                                                        parseFilter(
                                                          filter.id,
                                                          item
                                                        )
                                                      }
                                                    >
                                                      <div
                                                        className={`text-sm px-3 overflow-hidden flex-nowrap flex justify-between items-center rounded-2xl catalog-top-filter-not-selected`}
                                                        style={{
                                                          paddingTop: "6px",
                                                          paddingBottom: "6px",
                                                        }}
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
                                            } else if (
                                              filter.name === "Brands"
                                            ) {
                                              const temp = Math.max(
                                                ...filter.items.map((o) => {
                                                  if (
                                                    !userFilters[
                                                      filter.id
                                                    ].includes(o.id)
                                                  ) {
                                                    return Number(o.count);
                                                  }
                                                })
                                              );
                                              if (
                                                temp &&
                                                Number(item.count) === temp
                                              ) {
                                                return (
                                                  <SwiperSlide>
                                                    <button
                                                      className="p-1"
                                                      onClick={() =>
                                                        parseFilter(
                                                          filter.id,
                                                          item
                                                        )
                                                      }
                                                    >
                                                      <div
                                                        className={`text-sm px-3 flex-nowrap flex justify-between items-center rounded-2xl catalog-top-filter-not-selected`}
                                                        style={{
                                                          paddingTop: "6px",
                                                          paddingBottom: "6px",
                                                        }}
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
                                            } else if (
                                              filter.name === "Color"
                                            ) {
                                              const temp = Math.max(
                                                ...filter.items.map((o) => {
                                                  if (
                                                    !userFilters[
                                                      filter.id
                                                    ].includes(o.id)
                                                  ) {
                                                    return Number(o.count);
                                                  }
                                                })
                                              );
                                              if (
                                                temp &&
                                                Number(item.count) === temp
                                              ) {
                                                return (
                                                  <SwiperSlide>
                                                    <button
                                                      className="p-1"
                                                      onClick={() =>
                                                        parseFilter(
                                                          filter.id,
                                                          item
                                                        )
                                                      }
                                                    >
                                                      <div
                                                        className={`text-sm px-3 flex-nowrap flex justify-between items-center rounded-2xl catalog-top-filter-not-selected`}
                                                        style={{
                                                          paddingTop: "6px",
                                                          paddingBottom: "6px",
                                                        }}
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
                                            } else if (
                                              filter.name === "Shoes size"
                                            ) {
                                              const temp = Math.max(
                                                ...filter.items.map((o) => {
                                                  if (
                                                    !userFilters[
                                                      filter.id
                                                    ].includes(o.id)
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
                                                        parseFilter(
                                                          filter.id,
                                                          item
                                                        )
                                                      }
                                                    >
                                                      <div
                                                        className={`text-sm px-3 flex-nowrap flex justify-between items-center rounded-2xl catalog-top-filter-not-selected`}
                                                        style={{
                                                          paddingTop: "6px",
                                                          paddingBottom: "6px",
                                                        }}
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
                                                        parseFilter(
                                                          filter.id,
                                                          item
                                                        )
                                                      }
                                                    >
                                                      <div
                                                        className={`text-sm px-3 flex-nowrap flex justify-between items-center rounded-2xl catalog-top-filter-not-selected`}
                                                        style={{
                                                          paddingTop: "6px",
                                                          paddingBottom: "6px",
                                                        }}
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
                                </div>
                              </div>
                            </div>
                          )}

                        {data?.categories?.length > 0 &&
                          data?.sub_category_status === "1" && (
                            <div>
                              {/* Desktop Categories */}
                              <div className=" hidden lg:block w-full bg-white mb-2">
                                <Slider {...productSetting}>
                                  {data?.categories.map((category) => (
                                    <Link
                                      key={category.id}
                                      href={{
                                        // state.admin
                                        pathname:
                                          //   ? `${path}/category/${category.id}`
                                          //   :
                                          `${path}/${
                                            category.name
                                              .replace(
                                                /\s+&amp;\s+|\s+&gt;/g,
                                                "-"
                                              )
                                              .replace(/\s+/g, "-")
                                              .replaceAll("/", "-") +
                                            "/c=" +
                                            category.id
                                          }`,
                                        state: {
                                          source_type: getType(),
                                          source_type_id: catalog_id,
                                        },
                                      }}
                                      className="inline-flex w-32 xl:w-32 lg:w-32 text-center  items-center justify-center flex-col p-2 mx-2 hover:opacity-80 mb-1"
                                    >
                                      <Image
                                        alt={category.name}
                                        src={category.thumb}
                                        className="h-20"
                                        placeholdersrc="https://ishtari.com/static/product_placeholder_square.png"
                                      />
                                      <h2
                                        dangerouslySetInnerHTML={{
                                          __html: DOMPurify.sanitize(
                                            category.name
                                          ),
                                        }}
                                        className="text-xs xl:text-xs lg:text-xs w-full font-medium xl:font-semibold lg:font-semibold mt-2 line-clamp-2"
                                      ></h2>
                                    </Link>
                                  ))}
                                </Slider>
                              </div>
                              {/* Mobile Categories */}
                              <div className="block xl:hidden lg:hidden w-screen bg-white -mx-4 mb-2">
                                <Slider {...productMSetting}>
                                  {data.categories.map((category) => (
                                    <Link
                                      key={category.id}
                                      href={
                                        // state.admin
                                        //   ? `${path}/category/${category.id}`
                                        //   :
                                        `${path}/${
                                          category.name
                                            .replace(
                                              /\s+&amp;\s+|\s+&gt;/g,
                                              "-"
                                            )
                                            .replace(/\s+/g, "-")
                                            .replaceAll("/", "-") +
                                          "/c=" +
                                          category.id
                                        }`
                                      }
                                      className="inline-flex w-24 xl:w-28 lg:w-28 text-center  items-center justify-center flex-col p-2 mx-2 hover:opacity-80 mb-1"
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
                                          __html: DOMPurify.sanitize(
                                            category.name
                                          ),
                                        }}
                                        className="text-xs xl:text-xs lg:text-xs w-full font-medium xl:font-semibold lg:font-semibold mt-2 line-clamp-2"
                                      ></h2>
                                    </Link>
                                  ))}
                                </Slider>
                              </div>
                            </div>
                          )}
                        {width > 650 &&
                          page < 2 &&
                          (data?.category_widget_status === "1" ||
                            data?.desktop_widget_status === "1") &&
                          data?.desktop_widgets?.map((widget) => (
                            <div className="px-3" key={widget.mobile_widget_id}>
                              <WidgetsLoop
                                widget={widget}
                                category="category"
                              />{" "}
                            </div>
                          ))}
                        {width < 650 &&
                          page < 2 &&
                          (data?.category_widget_status === "1" ||
                            data?.mobile_widget_status === "1") &&
                          data?.mobile_widgets?.map((widget) => (
                            <div className="px-3">
                              <WidgetsLoop widget={widget} />{" "}
                            </div>
                          ))}
                        {width < 650 &&
                          page < 2 &&
                          (data?.category_widget_status === "1" ||
                            data?.mobile_widget_status === "1") &&
                          data?.widgets?.map((widget) => (
                            <div className="px-3">
                              <WidgetsLoop widget={widget} />{" "}
                            </div>
                          ))}
                        <div
                          id="grid-div"
                          className={`grid transition-all pt-1 ${
                            productDisplay === "grid"
                              ? "grid-cols-2 xl:grid-cols-5 lg:grid-cols-5 gap-2"
                              : "grid-cols-1"
                          }`}
                          // style={{marginRight: exportProduct ? "165px" : "0px"}}
                        >
                          {data.product_list_status !== "0" &&
                            data.products.map((product) => (
                              <SingleProducts
                                key={product.product_id}
                                item={product}
                                likedData={likedData}
                                display={display}
                                products={productArray}
                                isSlider={true}
                                noBorder={true}
                                isList={
                                  productDisplay === "grid" ? false : true
                                }
                              ></SingleProducts>
                            ))}
                        </div>
                      </div>
                    </div>
                    {/* Pagination */}
                    {Math.ceil(data["product_total"] / limit["value"]) > 1 && (
                      <ReactPaginate
                        pageCount={Math.ceil(
                          data["product_total"] / limit["value"]
                        )}
                        containerClassName={"category-pagination"}
                        onPageChange={pageSetter}
                        pageRangeDisplayed={width > 650 ? 2 : 1}
                        marginPagesDisplayed={width > 650 ? 1 : 1}
                        previousLabel={<IoIosArrowBack />}
                        previousLinkClassName={"arrowLink"}
                        nextLinkClassName={"arrowLink"}
                        nextLabel={<IoIosArrowForward />}
                        activeClassName={"active-pagination-category"}
                        forcePage={
                          parsedQueryString.page
                            ? parseInt(parsedQueryString.page) - 1
                            : 0
                        }
                      ></ReactPaginate>
                    )}
                  </div>
                )
              )}
            </div>
          ) : (
            // If no product list
            // <div> Something Went Wrong </div>
            <div className="flex items-center justify-center mt-20 pb-5 flex-col h-screen">
              {/* <img src={notFound} className=" w-2/12" alt="Not Found" /> */}
              <h2 className="text-2xl mt-4">Sorry, there is nothing here!</h2>
              <Link
                href={`${path}/`}
                className="bg-dblue text-white px-10 py-3 rounded mt-4"
              >
                START SHOPPING
              </Link>
              <button
                // onClick={() => router.goBack()}
                className="bg-dbase text-white px-10 py-3 rounded mt-4"
              >
                Go back
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default Catalogv2;

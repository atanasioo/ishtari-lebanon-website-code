import Link from "next/link";
import { Helmet } from "react-helmet";
import Head from "next/head";

import {
  BsChevronLeft,
  BsChevronRight,
  BsFillAwardFill,
  BsFillHeartFill
} from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { FaBus } from "react-icons/fa";
import { AiOutlineShop, AiFillStar } from "react-icons/ai";
import Image from "next/image";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import useDeviceSize from "@/components/useDeviceSize";
import { axiosServer } from "@/axiosServer";
import buildLink, { path, pixelID } from "@/urls";
import ProductPart2 from "./ProductPart2";
import dynamic from "next/dynamic";
import NotifyMe from "./NotifyMe";
import { sanitizeHTML, slugify } from "../Utils";
import ProductZoom from "./ProductZoom";
import { CartContext } from "../../contexts/CartContext";
import { AccountContext } from "../../contexts/AccountContext";
import CartSideModal from "./CartSideModal";
import { WishlistContext } from "../../contexts/WishlistContext";
import SingleProductBundle from "./SingleProductBundle";
import Slider from "react-slick";
import ProductOptionModal from "./ProductOptionModal";
import WhatsappBtn from "./WhatsappBtn";
import { useMarketingData } from "@/contexts/MarketingContext";
import { useReviewCenterData } from "@/contexts/ReviewCenterContext";
import WarrantyPopup from "./WarrantyPopup";
import Timer from "./Timer";
import ProductPlaceholder from "./ProductPlaceholder";
import NoData from "../NoData";
import SingleProduct from "./SingleProduct";

function ProductPage(props) {
  //Server props
  const { host, hovered, config, meta } = props; //instead of productData
  //contexts
  const [accountState, dispatchAccount] = useContext(AccountContext);
  const [state, dispatch] = useContext(CartContext);
  const [stateW, dispatchW] = useContext(WishlistContext);
  const { marketingData, setMarketingData } = useMarketingData();
  const { reviewCenterData, setReviewCenterData } = useReviewCenterData();
  //states
  const [data, setData] = useState([]);
  const [additionalData, setAdditionalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countDownPointer, setCountDownPointer] = useState();
  const [hasAddToCartError, setHasAddToCartError] = useState(false);
  const [AddToCartError, setAddToCartError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [successAdded, setSuccessAdded] = useState(false);
  const [toggleQty, setToggleQty] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [countDown, setCountDown] = useState();
  const [hasBannerEvent, setHasBannerEvent] = useState();
  const [nonrefundable, setNonrefundable] = useState(false);
  const [returnPolicy, setReturnPolicy] = useState([]);
  const [bundles, setProductBundle] = useState();
  const [scroll, setScroll] = useState(false);
  const [loader, setLoader] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [productData2, setProductData2] = useState({});
  const [showNotify, setShowNotify] = useState(false);
  const [viewColor, setViewColor] = useState();
  const [activeOption, setActiveOption] = useState({});
  const [optionParent, setOptionParent] = useState("");
  const [sellerData, setSellerData] = useState({});
  const [sizeGuide, setSizeGuide] = useState();
  const [colorSelected, setColorSelected] = useState();
  const [reviews, setReviews] = useState();
  const [activeImageOption, setImageActiveOption] = useState({});
  const [images, setImages] = useState([]); //instead of data.images initially
  const [hasOption, setHasOption] = useState(false);
  const [activeImage, setActiveImage] = useState({});
  const [isWishlist, setIsWishlist] = useState(false);
  const [GroupWishlist, setGroupsWishlist] = useState([]);
  const [showGroup, setShowGroup] = useState(false);
  const [checked, setChecked] = useState(["0"]);
  const [showModel, setShowModel] = useState(false);
  // const [additionalData, setAdditionalData] = useState({});
  const [warrantyPlan, setWarrantyPlan] = useState({});
  const [warrantyPopup, setWarrantyPopup] = useState(false);
  const [isDetails, setIsDetails] = useState(false);
  const [viewSeriesVal, setViewSeriesVal] = useState();
  const [loadingReviews, setLoadingReviews] = useState(false);
  // const [sellerReview, setSellerReview] = useState();
  const [purchased, setPurchased] = useState();

  // const [additionalData, setAdditionalData] = useState({});
  const [additional, setAdditional] = useState();
  const [value, setValue] = useState(0);
  const [result, setResult] = useState();
  const [nameValue, setName] = useState("");
  const [descriptionValue, setDescription] = useState("");
  const descriptionRef = useRef();
  const [showOptionModal, setShowOptionModal] = useState({
    show: false,
    bundle: null
  });
  const [noData, setNoData] = useState(false);

  async function initializeReactPixel() {
    const module = await import("react-facebook-pixel");
    return module.default;
  }

  const [width, height] = useDeviceSize();

  const SellerImage = dynamic(() => import("./SellerImage"), {
    ssr: false // Disable server-side rendering
  });

  const router = useRouter();
  const product_id = router.query.slug[0].includes("p=")
    ? router.query.slug[0].split("=")[1]
    : router.query.slug[0];

  const productBundlesSetting = {
    speed: 200,
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: false,
    prevArrow: <CustomPrevArrows direction={"l"} />,
    nextArrow: <CustomNextArrows direction={"r"} />
  };
  const productMobileBundlesSetting = {
    speed: 200,
    slidesToShow: 2,
    slidesToScroll: 1,
    infinite: false,
    prevArrow: <CustomPrevArrows direction={"l"} />,
    nextArrow: <CustomNextArrows direction={"r"} />
  };

  function handleHoveredSeries(key, name) {
    const seriesOp_name = document.getElementById(key);
    setViewSeriesVal(name);
    seriesOp_name.textContent = name;
  }
  function handleLeavedSeries(key) {
    const seriesOp_name = document.getElementById(key);
    setViewSeriesVal();
    seriesOp_name.textContent = "";
  }

  //fetch product part1 data
  //fetch product part1 data
  useEffect(() => {
    setLoading(true);
    window.scrollTo({
      top: 0,
    });
    setData([])
    const fromSearch =
      typeof router.query.fromSearch !== "undefined" ? true : false;
    const AdminToken = Cookies.get("ATDetails");
    const link =
      buildLink("product", undefined, undefined) +
      product_id +
      "&source_id=1&part_one" +
      (AdminToken !== undefined || typeof AdminToken !== "undefined"
        ? "&employer=true"
        : "") +
      (fromSearch ? "&from_search=1" : "")+"&test_aya=true";

    axiosServer.get(link).then((response) => {
      if (!response.data.success) {
        setNoData(true);
        // router.push("/404");
      } else {
        setData(response?.data?.data);
        // setSellerReview("");
        // axiosServer
        //   .get(
        //     buildLink(
        //       "sellerReview",
        //       undefined,
        //       undefined,
        //       window.location.host
        //     ) + response.data.data.seller_id
        //   )
        //   .then((resp) => {
        //     if (response?.data?.success) setSellerReview(resp?.data?.data);
        //   });

        axiosServer
          .get(
            buildLink("getProductAdditionalData", undefined, undefined) +
              "&product_id=" +
              product_id
          )
          .then((resp) => {
            setAdditionalData(resp.data.data);
          });

        const data = response.data?.data;
        if (data.special_end !== null && data.special_end !== 0) {
          setHasBannerEvent(data?.bannerevent);
        }

        setProductBundle(

          data?.product_bundles?.length > 0 ? data?.product_bundles : null
        );
       
        setReviews(data?.product_reviews?.reviews);

        //banner_event
        // if (data?.special_end !== null && data?.special_end !== 0) {
        setHasBannerEvent(data?.bannerevent);
        //}

        setHasOption(data?.options?.length > 0);

        data.options.length > 0 &&
          setOptionParent(data.options[0]["product_option_id"]);

        const includesImage = data?.images.some((image) => {
          return image.popup === data.popup && image.thumb === data.thumb;
        });

        if (!includesImage) {
          data?.images.unshift({
            popup: data.popup,
            thumb: data.thumb
          });
        }

        handleWishlist(0);
        setImages(data.images);

        axiosServer
          .post(buildLink("purchased", undefined, undefined), {
            product_id: product_id
          })
          .then((resp) => {
            if (resp.data.success) setPurchased(resp?.data?.purchased_count);
          });

        // ---> Facebook PIXEL <---
        if (!accountState.admin) {
          const advancedMatching = {
            em: data?.social_data?.email,
            fn: data?.social_data?.firstname,
            ln: data?.social_data?.lastname,
            external_id: data?.social_data?.external_id,
            country: data?.social_data?.country_code,
            fbp: Cookies.get("_fbp")
          };
          if (typeof window !== "undefined") {
            let ReactPixel; // Define a variable to hold the reference to ReactPixel

            initializeReactPixel().then((ReactPixel) => {
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
                  content_ids: [product_id],
                  content_name: data?.social_data?.name,
                  value: data?.social_data?.value,
                  currency: data?.social_data?.currency
                },
                { eventID: data?.social_data?.event_id }
              );
            });
          }
        }
        var dataSocial = data.social_data;
        dataSocial["fbp"] = Cookies.get("_fbp");
        dataSocial["fbc"] = Cookies.get("_fbc");
        dataSocial["ttp"] = Cookies.get("_ttp");
        dataSocial["link"] = window.location.href;
        dataSocial["view_type"] = "product";
        dataSocial["view_type_id"] = product_id;

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

        axiosServer
          .post(
            buildLink(
              "pixel",
              undefined,
              window.innerWidth,
              window.config["site-url"]
            ),
            dataSocial
          )
          .then((response) => {
            const data = response.data;
          });
        //seller recommendations (excluding ishtari)
        // if (
        //   data?.seller_id > 0 &&
        //   data.seller !== "" &&
        //   data.seller_id !== "168"
        // ) {
        const link =
          buildLink("seller", undefined, undefined) +
          data.seller_id +
          "&source_id=1&limit=5";
        axiosServer.get(link).then((response) => {
          if (response.data.success) {
            setSellerData(response.data.data);
          }
        });
      }
      // }

      setLoading(false);
    });
  }, [product_id]);

  useEffect(() => {
    // to force re-render when navigating using client side
    setAdditional(false);
    setLoader(true);
    setQuantity(1);
    setToggleQty(false);
    setHasBannerEvent();
    setNoData(false);
    // setLoading(true);
  }, [router]);

  // console.log("data", data);

  useEffect(() => {
    const fetchDataAndScroll = async () => {
      if (
        reviewCenterData.scrollToReview &&
        reviewCenterData.product_id === product_id
      ) {
        await getProductPart2();

        // if (titleRef.current !== null) {
        //   if(window.innerWidth > 768){
        //    titleRef?.current?.scrollIntoView({ behavior: "smooth" });
        //   }else{
        //     titleRef?.current?.scrollIntoView();
        //   }
        // }

        const handleScroll = () => {
          if (titleRef.current && descriptionRef.current) {
            const titleRect = titleRef.current.getBoundingClientRect();
            const descriptionRect =
              descriptionRef.current.getBoundingClientRect();
            const titleTopOffset = titleRect.top;
            const descriptionTopOffset = descriptionRect.top;
            if (
              titleTopOffset <= window.innerHeight ||
              descriptionTopOffset <= window.innerHeight
            ) {
              setReviewCenterData({});

              // Remove the event listener once the scrolling is done
              window.removeEventListener("scroll", handleScroll);
            }
          }
        };
        window.addEventListener("scroll", handleScroll);
      }
    };
    fetchDataAndScroll();
  }, []);

  function CustomPrevArrows({ direction, onClick, style, className }) {
    return (
      <div
        style={{ ...style, padding: "2px 5px", marginLeft: "15px" }}
        onClick={onClick}
        className="mySwiper "
      >
        <div className="swiper-button-prev flex justify-center items-center cursor-pointer">
          <BsChevronLeft className="text-dblack" />
        </div>
      </div>
    );
  }

  function CustomNextArrows({ direction, onClick, style, className }) {
    return (
      <div
        style={{ ...style, padding: "2px 15px", marginRight: " 15px" }}
        onClick={onClick}
        className="mySwiper "
      >
        <div className="swiper-button-next flex justify-center items-center cursor-pointer">
          <BsChevronRight className="text-dblack" />
        </div>
      </div>
    );
  }

  function handleWarranty(state) {
    if (state === "close") {
      setWarrantyPopup(false);
    } else {
      setWarrantyPlan(state);
    }
  }

  // useEffect(() => {
  //   if (data.special_end !== null && data.special_end !== 0) {
  //     setHasBannerEvent(data?.bannerevent);
  //   }
  //   setProductBundle(
  //     data?.product_bundles?.length > 0 ? data?.product_bundles[0] : null
  //   );

  //   setReviews(data?.product_reviews?.reviews);

  //   //banner_event
  //   if (data?.special_end !== null && data?.special_end !== 0) {
  //     setHasBannerEvent(data?.bannerevent);
  //   }

  //   setHasOption(data?.options?.length > 0);

  //   data.options.length > 0 &&
  //     setOptionParent(data.options[0]["product_option_id"]);

  //   const includesImage = data?.images.some((image) => {
  //     return image.popup === data.popup && image.thumb === data.thumb;
  //   });

  //   if (!includesImage) {
  //     data?.images.unshift({
  //       popup: data.popup,
  //       thumb: data.thumb,
  //     });
  //   }

  //   // ---> Facebook PIXEL <---
  //   if (!accountState.admin) {
  //     const advancedMatching = {
  //       em: data?.social_data?.email,
  //       fn: data?.social_data?.firstname,
  //       ln: data?.social_data?.lastname,
  //       external_id: data?.social_data?.external_id,
  //       country: data?.social_data?.country_code,
  //       fbp: Cookies.get("_fbp"),
  //     };
  //     if (typeof window !== "undefined") {
  //       let ReactPixel; // Define a variable to hold the reference to ReactPixel

  //       initializeReactPixel().then((ReactPixel) => {
  //         ReactPixel.init(pixelID, advancedMatching, {
  //           debug: true,
  //           autoConfig: false,
  //         });
  //         ReactPixel.pageView();
  //         ReactPixel.fbq("track", "PageView");

  //         window.fbq(
  //           "track",
  //           "ViewContent",
  //           {
  //             content_type: "product",
  //             content_ids: [product_id],
  //             content_name: data?.social_data?.name,
  //             value: data?.social_data?.value,
  //             currency: data?.social_data?.currency,
  //           },
  //           { eventID: data?.social_data?.event_id }
  //         );
  //       });

  //       var dataSocial = data.social_data;
  //       dataSocial["fbp"] = Cookies.get("_fbp");
  //       dataSocial["fbc"] = Cookies.get("_fbc");
  //       dataSocial["ttp"] = Cookies.get("_ttp");
  //       dataSocial["link"] = window.location.href;
  //       dataSocial["view_type"] = "product";
  //       dataSocial["view_type_id"] = product_id;

  //       if (
  //         marketingData.source_type === "" ||
  //         marketingData.source_type === null ||
  //         typeof marketingData.source_type === "undefined"
  //       ) {
  //         dataSocial["ignore"] = true;
  //       } else {
  //         dataSocial["source_type"] = marketingData.source_type;
  //         dataSocial["source_type_id"] = marketingData.source_type_id;
  //         dataSocial["banner_image_id"] = marketingData.banner_image_id
  //           ? marketingData.banner_image_id
  //           : "";
  //       }

  //       axiosServer
  //         .post(
  //           buildLink(
  //             "pixel",
  //             undefined,
  //             window.innerWidth,
  //             window.config["site-url"]
  //           ),
  //           dataSocial
  //         )
  //         .then((response) => {
  //           const data = response.data;
  //         });
  //     }
  //   }

  //   //seller recommendations (excluding ishtari)
  //   if (data?.seller_id > 0 && data.seller !== "" && data.seller_id !== "168") {
  //     const link =
  //       buildLink("seller", undefined, undefined) +
  //       data.seller_id +
  //       "&source_id=1&limit=5";
  //     axiosServer.get(link).then((response) => {
  //       if (response.data.success) {
  //         setSellerData(response.data.data);
  //       }
  //     });
  //   }
  // }, [router]);

  function fetchAdditionalData() {
    axiosServer
      .get(
        buildLink("getProductAdditionalData", undefined, window.innerWidth) +
          "&product_id=" +
          product_id
      )
      .then((response) => {
        setAdditional(response.data.data);
      });
  }

  function unescapeHTML(str) {
    if (!str) {
      return;
    }
    return str.replace(/\&([^;]+);/g, function (entity, entityCode) {
      var match;

      if (entityCode in htmlEntities) {
        return htmlEntities[entityCode];
        /*eslint no-cond-assign: 0*/
      } else if ((match = entityCode.match(/^#x([\da-fA-F]+)$/))) {
        return String.fromCharCode(parseInt(match[1], 16));
        /*eslint no-cond-assign: 0*/
      } else if ((match = entityCode.match(/^#(\d+)$/))) {
        return String.fromCharCode(~~match[1]);
      } else {
        return entity;
      }
    });
  }

  var htmlEntities = {
    nbsp: " ",
    cent: "¢",
    pound: "£",
    yen: "¥",
    euro: "€",
    copy: "©",
    reg: "®",
    lt: "<",
    gt: ">",
    quot: '"',
    amp: "&",
    apos: "'"
  };

  function handleReturnPolicy() {
    axiosServer
      .get(
        buildLink(
          "information",
          undefined,
          window.innerWidth,
          window.location.href
        ) + "&information_id=10"
      )
      .then((response) => {
        const data = response.data.data;
        setReturnPolicy(data);
      });
  }

  const observer = useRef();

  const lastElementRef = useCallback(
    (node) => {
      if (!loader) {
        return;
      }
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          loader &&
          !reviewCenterData.scrollToReview
        ) {
          setLoader(true);
          getProductPart2();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loader, router.asPath]
  );

  const titleRef = useRef();
  function handleClick() {
    if (titleRef.current !== null) {
      titleRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      descriptionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  async function getProductPart2(filter_value) {
    if (typeof filter_value !== "undefined") {
      setLoadingReviews(true);
    }

    setProductData2([])
    var link =
      buildLink("product", undefined, window.innerWidth) +
      `${
        Cookies.get("ATDetails")
          ? product_id +
            `${
              window.config["site-url"].indexOf("ishtari") > -1 ||
              Cookies.get("site-local-name").includes("ishtari")
                ? "&employer=true"
                : "&admin=true"
            }`
          : product_id
      }&source_id=1&part_two=true&test_review${
        typeof filter_value !== "undefined"
          ? "&filter_product_reviews=" + filter_value
          : ""
      }`;
    axiosServer.get(link).then((response) => {
      const data = response.data;

      if (data?.success) {
        setReviews(data?.data?.product_reviews?.reviews);

        setProductData2(data.data);
        setLoader(false);
        if (typeof filter_value !== "undefined") {
          setLoadingReviews(false);
        }
        if (
          reviewCenterData.scrollToReview &&
          reviewCenterData.product_id === product_id
        ) {
          if (titleRef.current !== null) {
            // if (window.innerWidth > 768) {
            titleRef?.current?.scrollIntoView({ behavior: "smooth" });
            // } else {
            //   titleRef?.current?.scrollIntoView();
            // }
          }
        }
      }
    });
  }

  function setOption(option) {
    const option_id = option["product_option_value_id"];

    var count = 0;
    var i = 0;

    while (i < images?.length) {
      if (images[i]?.product_option_value_id > 0) {
        count++;
      }

      i++;
    }

    if (
      images[1]?.product_option_value_id > 0 ||
      data?.options[0].option_value.length === count
    ) {
      for (const key in images) {
        if (Object.hasOwnProperty.call(images, key)) {
          const element = images[key];
          if (element["product_option_value_id"] === option_id) {
            setActiveOption(option);
            setImageActiveOption(option);
            setActiveImage({
              popup: element["popup"],
              thumb: element["thumb"]
            });
          }
        }
      }
    }
    setActiveOption(option);
  }

  //page view conversion for google ads
  useEffect(() => {
    if (!accountState.admin) {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }

      if (
        window.location.host === "www.ishtari.com" ||
        window.location.host === "next.ishtari.com" ||
        window.location.host === "ishtari-mobile.com"
      ) {
        var price = 10;
        if (data.special_net_value) {
          price = data.special_net_value;
        } else {
          price = data.price_net_value;
        }

        gtag("event", "conversion", {
          send_to: "AW-991347483/pc3dCIaww44YEJuG29gD",
          value: price,
          currency: "USD"
        });
      } else if (
        window.location.host === "www.ishtari.com.gh" ||
        window.location.host === "next.ishtari.com.gh"
      ) {
        var price = 10;
        if (data.special_net_value) {
          price = data.special_net_value;
        } else {
          price = data.price_net_value;
        }

        gtag("event", "conversion", {
          send_to: "AW-10993907106/31DICLmKppEYEKLrpvoo",
          value: price,
          currency: "USD"
        });
      }
    }
  }, []);

  function gtag_report_conversion(obj) {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    if (!accountState.admin) {
      var price = 10;
      if (data.special_net_value) {
        price = data.special_net_value;
      } else {
        price = data.price_net_value;
      }
      if (
        window.location.host === "www.ishtari.com" ||
        window.location.host === "next.ishtari.com" ||
        window.location.host === "ishtari-mobile.com"
      ) {
        var callback = addToCart(obj);
        gtag("event", "conversion", {
          send_to: "AW-991347483/FGk5CJ3V3owYEJuG29gD",
          value: price,
          currency: "USD",
          event_callback: callback
        });
        return false;
      } else if (
        window.location.host === "next.ishtari.com.gh" ||
        window.location.host === "www.ishtari.com.gh"
      ) {
        const callback = addToCart(obj);
        gtag("event", "conversion", {
          send_to: "AW-10993907106/6Y9jCLfUipEYEKLrpvoo",
          value: price,
          currency: "USD",
          event_callback: callback
        });
        return false;
      } else {
        addToCart(obj);
      }
    } else {
      addToCart(obj);
    }
  }

  function addToCart(bundle) {
    setCountDownPointer(true);

    setHasAddToCartError(false);
    setAddingToCart(true);
    let obj = {
      product_id,
      quantity
    };
    if (hasOption) {
      let o = {};
      const op = optionParent.toString();
      o[op] = activeOption["product_option_value_id"];
      obj["option"] = o;
    }

    if (Object.keys(warrantyPlan).length > 0) {
      let w = {};
      w["warranty_option_id"] = warrantyPlan.warranty_option_id;
      obj["warranty"] = w;
    }

    let error = "";
    axiosServer
      .post(
        buildLink(
          "cart",
          undefined,
          window.innerWidth,
          window.config["site-url"]
        ) + "&source_id=1",
        bundle === undefined ? obj : bundle
      )
      .then((response) => {
        const data1 = response.data;
        if (data1.success !== true) {
          // There is an error
          setHasAddToCartError(true);
          if (!hasOption) {
            error = data1?.errors[0]?.errorMsg;
          } else {
            error = data1?.errors[0]?.errorMsg;
          }
          // alert(error)
          setAddToCartError(error);
          setAddingToCart(false);
        } else {
          setCountDown(true);
          setCountDownPointer(true);
          setTimeout(() => {
            setCountDownPointer(false);
          }, 1000);
          setTimeout(() => {
            setCountDown(false);
          }, 3000);
          dispatch({
            type: "loading",
            payload: true
          });
          axiosServer
            .get(
              buildLink(
                "cart",
                undefined,
                window.innerWidth,
                window.config["site-url"]
              )
            )
            .then((response_data) => {
              dispatch({
                type: "setProducts",
                payload: response_data.data?.data?.products
              });

              dispatch({
                type: "setProductsCount",
                payload: response_data?.data?.data?.total_product_count
              });
              dispatch({
                type: "setTotals",
                payload: response_data.data?.data?.totals
              });
              dispatch({
                type: "loading",
                payload: false
              });
              dispatch({
                type: "setAsidecart",
                payload: true
              });

              dispatch({
                type: "setProduct",
                payload: { name: data.name, image: data?.mobile_image }
              });
            });

          if (data) {
            const data = response?.data?.data?.social_data;

            initializeReactPixel().then((ReactPixel) => {
              ReactPixel.fbq(
                "track",
                "AddToCart",
                {
                  content_type: "product",
                  content_ids: data?.content_ids,
                  content_name: data?.name,
                  value: data?.value,
                  content_category: data?.breadcrumbs?.category[0]?.name,
                  currency: data?.currency,
                  fbp: Cookies.get("_fbp")
                },
                { eventID: data?.event_id }
              );
            });
          }
          // }

          var dataSocial = response?.data?.data?.social_data;
          dataSocial["link"] = window.location.href;
          dataSocial["fbp"] = Cookies.get("_fbp");
          dataSocial["fbc"] = Cookies.get("_fbc");
          dataSocial["ttp"] = Cookies.get("_ttp");

          axiosServer
            .post(
              buildLink(
                "pixel",
                undefined,
                window.innerWidth,
                window.config["site-url"]
              ),
              dataSocial
            )
            .then((response) => {
              const data = response.data;
              if (data.success === true) {
              }
            });
          // setSuccessAdded(true);

        
            // setCountDown(false)
            setAddingToCart(false);
         
          setQuantity(1);
        }
      });
  }

  function toggleSucccessAdded(bool) {
    setSuccessAdded(bool);
  }

  function addGroup() {
    setResult("");

    // alert(1)
    var obj = {};

    obj = {
      name: nameValue,
      description: descriptionValue
    };
    axiosServer
      .post(
        buildLink(
          "wishlistAdd",
          undefined,
          undefined,
          window.config["site-url"]
        ),
        obj
      )
      .then((response) => {
        if (response.data.success) {
          setShowModel(false);
        }
        setResult(response.data);
      });

    setName("");
    setDescription("");
  }

  useEffect(() => {
    if (showGroup === true) {
      axiosServer
        .get(
          buildLink(
            "wishlist_group",
            undefined,
            undefined,
            window.config["site-url"]
          )
        )
        .then((response) => {
          setGroupsWishlist(response.data.data);
        });
    }
  }, [showGroup]);

  useEffect(() => {
    // setChecked(data?.data?.groups_wishlist);
    // handleWishlist(0);
    // setImages(data.images);
    return () => {
      setImages([]);
      setActiveImage({}); //comment it for magic zoom //
      setHasOption(false);
    };
  }, [product_id]);

  function handleWishlist(counter) {
    if (counter < 1) {
      if (stateW?.pIds?.indexOf(product_id) > -1) {
        setIsWishlist(true);
        counter++;
      } else {
        setIsWishlist(false);
      }
    } else {
    }
  }

  function addToWishList() {
    const obj = {
      id: checked,
      product_id: product_id
    };
    axiosServer
      .post(
        buildLink(
          "addToWishlist_5",
          undefined,
          window.innerWidth,
          window.config["site-url"]
        ),
        obj
      )
      .then(() => {
        axiosServer
          .get(
            buildLink(
              "wishlistCount",
              undefined,
              window.innerWidth,
              window.config["site-url"]
            )
          )
          .then((response) => {
            if (response.data.success) {
              dispatchW({
                type: "setProductsCount",
                payload: response.data.data.total
              });
              dispatchW({
                type: "setProductIds",
                payload: response.data.data.products
              });
            }
          });

        setShowGroup(false);
        //update wishlist count
        fetchAdditionalData();
      });
  }
  useEffect(() => {
    handleWishlist(0);
  }, [stateW]);

  function deleteItemFromAllGroup() {
    axiosServer
      .post(
        buildLink(
          "removeAll",
          undefined,
          undefined,
          window.config["site-url"]
        ) +
          "&product_id=" +
          product_id
      )
      .then((response) => {
        if (response.data.success) {
          setIsWishlist(false);
          axiosServer
            .get(
              buildLink(
                "wishlistCount",
                undefined,
                window.innerWidth,
                window.config["site-url"]
              )
            )
            .then((response) => {
              //if (response.data.success) {
              dispatchW({
                type: "setProductsCount",
                payload: response.data.data.total
              });
              dispatchW({
                type: "setProductIds",
                payload:
                  response.data.data.total !== "0"
                    ? response.data.data.products
                    : []
              });
              //}
            });
        }
        setShowGroup(false);
        fetchAdditionalData();
      });
  }

  function updateState(id) {
    var checkboxes = document.getElementsByName("wish");
    var checkboxesChecked = [];
    // loop over them all
    for (var i = 0; i < checkboxes.length; i++) {
      // And stick the checked ones onto an array...
      if (checkboxes[i].checked) {
        checkboxesChecked.push(checkboxes[i].value);
      }
      setChecked(checkboxesChecked);
    }
  }

  function addBundle(bundle) {
    if (
      bundle.products.filter((p) => p.product_options?.length > 0).length == 0
    ) {
      bundle.products.map((p) => {
        const obj = {
          product_id: p.product_id,
          quantity: Number(p.required_quantity)
        };
        gtag_report_conversion(obj);
      });
    } else {
      setShowOptionModal({ show: true, bundle: bundle });
    }
  }

  const checkIfLogged = () => {
    if (accountState.loged === true) {
      setShowNotify(true);
    } else {
      dispatchAccount({ type: "setShowOver", payload: true });
      dispatchAccount({ type: "setShowLogin", payload: true });
      dispatchAccount({ type: "setShowSignup", payload: false });
    }
  };

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      if (state.aside) {
        function handleClickOutside(event) {
          if (state.aside) {
            setTimeout(
              () =>
                dispatch({
                  type: "setAsidecart",
                  payload: false
                }),
              200
            );
          }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }
    }, [ref]);
  }

  return (
    <>
      {" "}
      {loading ? (
        <ProductPlaceholder meta={meta} />
      ) : !loading && noData ? (
        <NoData />
      ) : (
        <div className="product-page-wrapper bg-[#f8f8f9]">
          <div>
            {!meta && (
              <Head>
                <title>
                  {" "}
                  {data?.heading_title
                    ?.replace(/&amp;/g, "&")
                    .replace(/&lt;/g, "<")
                    .replace(/&gt;/g, ">")
                    .replace(/&quot;/g, '"') +
                    +" - ishtari | Online Shopping in Lebanon"}
                </title>
              </Head>
            )}
            {/* Your page content */}
          </div>
          {/* {!meta && !loading && (
            <Helmet>
              <title>
                {data?.heading_title
                  ?.replace(/&amp;/g, "&")
                  .replace(/&lt;/g, "<")
                  .replace(/&gt;/g, ">")
                  .replace(/&quot;/g, '"') + window.config["seo-title-base"]}
              </title>
              <meta name="description" content="App Description" />
              <meta name="theme-color" content="#008f68" />
            </Helmet>
          )} */}
          <div className="">
            {/* <CartSideModal
          successAdded={successAdded}
          data={data}
          toggleSucccessAdded={toggleSucccessAdded}
          hasBannerEvent={hasBannerEvent}
        /> */}

            {showOptionModal.show && (
              <ProductOptionModal
                setShowOptionModal={setShowOptionModal}
                bundle={showOptionModal.bundle}
                addCart={addToCart}
              />
            )}

            <div className="flex flex-col px-2 mx-auto">
              <div className="breadcrumbs py-3 hidden md:block">
                <div className="flex items-center">
                  {data?.breadcrumbs.category && (
                    <div className="flex items-center">
                      <Link
                        href={"/"}
                        className="text-dblack font-light truncate text-d11 md:text-sm mr-2"
                      >
                        Home
                      </Link>
                      <BsChevronRight className="hidden sm:block icon icon-angle-right text-d11 md:text-xs text-dgrey1" />

                      <Link
                        href={`/category/${data?.breadcrumbs?.category[0]?.category_id}`}
                        className="hidden md:block text-dblack font-light truncate text-d11 md:text-sm mx-2"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHTML(
                            data?.breadcrumbs?.category[0]?.name
                          )
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div
                className={` ${
                  accountState.admin && data?.status === "0"
                    ? "bg-dPink"
                    : "bg-white"
                } product-div flex items-stretch  w-full md:px-2`}
              >
                <div className="flex flex-col md:flex-row py-3 pr-2 w-full md:w-3/4">
                  <div className="product-zoom w-full md:w-6/12 ">
                    {/* <img width={380} height={518} src={data.popup} /> */}
                    <ProductZoom
                      activeOption={activeImageOption.product_option_value_id}
                      images={data.images}
                      hovered={hovered}
                      productData={data}
                      additionalData={additionalData}
                      sellerData={sellerData}
                    />
                    {/* {data.images?.length > 0 && (
                  <MagicZoom
                    activeOption={activeImageOption.product_option_value_id}
                    productData={data}
                    images={data.images}
                  />
                )} */}
                  </div>
                  <div className="product-info w-full md:w-6/12 px-4">
                    {/* TOP SELLING */}

                    {typeof additionalData?.product_rank !== "undefined" &&
                      Object.keys(additionalData?.product_rank).length > 0 && (
                        <Link
                          href={{
                            pathname: "/categoryTopSelling",
                            query: {
                              category_id: `${additionalData?.product_rank?.category_id}`
                            }
                          }}
                          className="flex items-center gap-3  mt-3 md:mt-0 mb-3 w-fit px-2 py-1 rounded-full"
                          style={{ backgroundColor: "#ffeced" }}
                        >
                          <div className="relative">
                            <BsFillAwardFill className="text-dyellow w-8 h-8 " />
                            <div className="absolute pr-semibold top-0 left-0 right-0 bottom-0 m-auto text-d16 pr-bold flex justify-center items-center mb-1.5 text-white">
                              {additionalData?.product_rank?.index}
                            </div>
                          </div>
                          <div className="text-d14">
                            {" "}
                            Top Selling in{" "}
                            <span
                              className="pr-semibold"
                              dangerouslySetInnerHTML={{
                                __html: sanitizeHTML(
                                  additionalData?.product_rank?.category_name
                                )
                              }}
                            ></span>
                          </div>
                          <div className="text-xs">
                            <BsChevronRight />
                          </div>
                        </Link>
                      )}

                    {/* BRAND NAME */}
                    {data?.manufacturer.length > 0 && (
                      <Link
                        href={`/${
                          data?.manufacturer + "/m=" + data.manufacturer_id
                        }`}
                        className="text-dgrey1 hover:text-dblue"
                      >
                        {data?.manufacturer_image ? (
                          <Image
                            src={data.manufacturer_image}
                            alt={data.manufacturer_id}
                            className="w-24"
                            width={96}
                            height={38}
                          />
                        ) : (
                          data?.manufacturer?.toUpperCase()
                        )}
                      </Link>
                    )}

                    <h1
                      className="text-dblack font-semibold text-d22 mb-3 leading-pn"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHTML(data.name)
                      }}
                    ></h1>
                    <div className="mb-3 product-info">
                      <div className="mb-3">
                        <div className="product-model-rating mb-3 text-d14 text-dgreyProduct flex flex-wrap items-center">
                          <div className="modelNumber mr-1.5">
                            Model Number: {data.sku}
                          </div>
                          {data?.rating > 0 && (
                            <div className="divider h-4 w-0.5 bg-dplaceHolder mx-1.5"></div>
                          )}
                          <div className="product-rating">
                            {data?.rating > 0 && (
                              <div
                                className="flex items-center"
                                onClick={handleClick}
                              >
                                <div
                                  className="flex justify-center items-center flex-row  rounded-full h-4 space-x-0.5 p-1 -mt-1 cursor-pointer"
                                  style={{
                                    backgroundColor:
                                      data?.rating >= 4.5
                                        ? "rgb(0,158,0)"
                                        : data?.rating < 4.5 &&
                                          data?.rating >= 4
                                        ? "rgb(110, 159, 0)"
                                        : data?.rating < 4 &&
                                          data?.rating >= 3.5
                                        ? "rgb(243, 153, 22)"
                                        : "rgb(246,90,31)"
                                  }}
                                >
                                  <div className=" font-bold text-white text-d14 ">
                                    {data?.rating || "0.0"}
                                  </div>

                                  <AiFillStar className="text-white text-d12" />
                                  {/* <StarRatings
                                containerClassName=" text-white text-bold"
                                starEmptyColor="#FFFFFF"
                                numberOfStars={1}
                                starDimension="13px"
                                isReadOnly="true"
                              />{" "} */}
                                </div>
                                <p className=" flex text-dgrey1 text-d15  md:mb-3 font-light  ml-2 underline_effect cursor-pointer">
                                  {data.nb_of_reviews} Rating
                                  {data.nb_of_reviews > 1 ? "s" : ""}
                                </p>
                              </div>
                            )}{" "}
                          </div>
                        </div>
                        <div className="product-price">
                          <div
                            className={`${
                              data.special !== "0"
                                ? "flex items-center mb-3"
                                : "hidden"
                            }`}
                          >
                            <div
                              className={`${
                                data.special !== "0"
                                  ? "mr-9 text-d14 text-dblack"
                                  : "hidden"
                              }`}
                            >
                              Was:
                            </div>
                            <div
                              className={`${
                                data.special !== "0"
                                  ? "text-dgreyProduct line-through"
                                  : "hidden"
                              }`}
                            >
                              {data.price}
                            </div>
                          </div>
                          <div className="flex items-center mb-3">
                            <div className="mr-9 text-d14 text-dblack">
                              {data.special !== "0" ? "Now:" : "Price:"}
                            </div>
                            <div
                              className={`text-dblack ${
                                data.special !== "0"
                                  ? "text-d20 font-bold "
                                  : ""
                              }`}
                            >
                              {data.special !== "0" ? data.special : data.price}
                            </div>
                          </div>

                          {/* missing span */}
                          {/* <video className="h-full w-full rounded-lg" controls>
      <source src={ data?.videos && data?.videos[0]} type="video/mp4" />
      Your browser does not support the video tag.
    </video> */}
                          {data.special !== "0" && (
                            <div className="flex items-center mb-3">
                              <div className="mr-9 text-d14 text-dblack">
                                Saving:
                              </div>
                              <div className={`text-dblack`}>
                                <span
                                  className={
                                    data.special !== "0"
                                      ? "bg-dgreenop text-dgreen font-semibold px-2 text-xs"
                                      : "invisible"
                                  }
                                >
                                  {data.saving + "% OFF"}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* product points */}
                        {/* {data.points !== "" && data.points !== "0" && (
                      <div className="flex items-center">
                        <div className="mr-9 text-d14 text-dblack">Points:</div>
                        <div className={`text-dblack `}>
                          <span className={"pl-2 pr-1"}>{data.points}</span>
                        </div>
                      </div>
                    )} */}
                      </div>
                      {/* Add to cart */}
                      {data["quantity"] <= 5 && data["quantity"] > 0 && (
                        <div className="flex text-d15 mt-4">
                          <div className="w-16 font-semibold">Quantity</div>

                          <div className="text-dbase ml-2">
                            Low stock: only {data["quantity"]} left
                          </div>
                        </div>
                      )}
                      <div
                        className={`flex  mt-4 mb-4 ${
                          data["quantity"] <= 5 ? "mt-1" : "mt-4"
                        }`}
                      >
                        {accountState.admin ? (
                          <input
                            onChange={(e) => setQuantity(e.target.value)}
                            type="number"
                            value={quantity}
                            className={`${
                              data["quantity"] === "0" ? "hidden" : ""
                            }border w-16 h-12 rounded text-dblack text-center border-dgrey1 text-xl `}
                          />
                        ) : (
                          <div
                            className="qty-picker font-semibold cursor-pointer"
                            onClick={() => setToggleQty(!toggleQty)}
                          >
                            <div className="relative box-border">
                              <div className="flex items-center justify-center border border-dgreyQtyProduct rounded-md relative h-12 py-2 px-1.5">
                                <div className="mx-3">{quantity}</div>
                                <div className="flex items-center">
                                  <div
                                    style={{ width: "1px" }}
                                    className="dividor h-7 bg-dgreyQtyProduct "
                                  ></div>
                                  <div className="px-1">
                                    <FiChevronDown
                                      className="text-dgreyQtyProduct h-6 w-6"
                                      style={{
                                        // transform: toggleQty ? "rotate(-180deg)" : "",
                                        transition: "transform 0.2s ease"
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div
                                className={`${
                                  toggleQty ? "" : "hidden"
                                } absolute bg-white flex flex-col items-center z-10 justify-center rounded-md border border-dgreyQtyProduct mt-1.5 w-full`}
                              >
                                <div
                                  className="overflow-y-scroll w-full"
                                  style={{ maxHeight: "200px" }}
                                  ref={wrapperRef}
                                >
                                  {Array.from(
                                    {
                                      length:
                                        data?.maximum === 0
                                          ? data.quantity
                                          : data?.maximum
                                    },
                                    (_, index) => index + 1
                                  ).map((value) => (
                                    <div
                                      key={value}
                                      onClick={() => setQuantity(value)}
                                      className={`py-1  hover:bg-dblue hover:text-white w-full text-center`}
                                    >
                                      {value}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="flex flex-col w-full">
                          <button
                            className={` text-white  h-12 relative rounded  ml-1  ${
                              data["quantity"] === "0"
                                ? "bg-dbase mr-1"
                                : "bg-dblue mx-1 hover:bg-dbluedark"
                            } flex items-center justify-center rounded-md text-white `}
                            onClick={() => {
                              data["quantity"] === "0"
                                ? console.log("")
                                : gtag_report_conversion();
                            }}
                          >
                            <span>
                              {data["quantity"] === "0" ? (
                                "Out Of Stock"
                              ) : (
                                <div>
                                  <p
                                    className={`absolute z-10  transition duration-100 ease-in left-5 md:left-14 top-3 text-white ${
                                      successAdded &&
                                      countDown &&
                                      !countDownPointer
                                        ? "translate-x-0 "
                                        : "translate-x-full invisible"
                                    } `}
                                  >
                                    <span className="bg-white  px-2 rounded-full text-dblue">
                                      1
                                    </span>{" "}
                                    item Added to the Cart
                                  </p>
                                  {countDownPointer === true &&
                                  hasAddToCartError === false ? (
                                    <div className="top-5 lds-ellipsis">
                                      <div />
                                      <div />
                                      <div />
                                      <div />
                                    </div>
                                  ) : (
                                    !addingToCart && (
                                      <span className="">Add To Cart </span>
                                    )
                                  )}
                                </div>
                              )}
                            </span>{" "}
                          </button>
                          <div className="w-full flex items-center justify-center pr-semibold mt-1 mobile:text-d18 text-dbluedark">
                            {purchased &&
                              purchased > 100 &&
                              purchased + " Customers Purchased"}
                          </div>
                        </div>

                        {accountState.loged && (
                          <div className="flex flex-col items-center justify-center ml-3 text-xs text-dgreyProduct -mt-1.5">
                            <button
                              style={{
                                border: "1px solid rgba(0, 0, 0, 0.1)",
                                boxShadow:
                                  "rgba(0, 0, 0, 0.1) 0px 0px 15px 1px inset",
                                transition: "all 0.3s ease-in-out 0s"
                              }}
                              className={`h-12 w-12 flex items-center justify-center bg-dgrey rounded-full `}
                              onClick={() => {
                                stateW.pIds.filter((i) => i === product_id)
                                  .length > 1
                                  ? setShowGroup(true)
                                  : stateW.pIds.indexOf(product_id) > -1
                                  ? deleteItemFromAllGroup()
                                  : setShowGroup(true);
                              }}
                            >
                              <BsFillHeartFill
                                className={
                                  isWishlist
                                    ? " text-dbase text-xl"
                                    : " text-dgrey1 text-xl"
                                }
                              />
                            </button>
                            <div>
                              {additional
                                ? additional?.wishlist?.total
                                : additionalData?.wishlist?.total}
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        {data.quantity === "0" && (
                          <div className="flex mobile:block justify-center">
                            {width > 650 ? (
                              <div
                                onClick={() => checkIfLogged()}
                                className=" bg-dblue   text-white rounded-md flex cursor-pointer items-center px-3 py-2  md:px-3 justify-center w-3/4 "
                              >
                                <p className="text-sm md:text-md font-semibold">
                                  Notify Me When Available
                                </p>
                                <p>
                                  {" "}
                                  <HiOutlineMail className=" text-white w-5 h-5 ml-3" />
                                </p>
                              </div>
                            ) : (
                              <div
                                onClick={() => checkIfLogged()}
                                className="fixed z-10 bottom-1 bg-dblue text-white rounded-full py-1  cursor-pointer  px-3  md:px-3  w-3/4 "
                              >
                                <div className="my-1 flex justify-around items-center">
                                  <p className="text-sm md:text-md font-semibold">
                                    Notify Me When Available
                                  </p>
                                  <div>
                                    {" "}
                                    <HiOutlineMail className=" text-white w-5 h-5" />
                                  </div>
                                </div>
                              </div>
                            )}

                            <NotifyMe
                              showNotify={showNotify}
                              pname={data.name}
                              pid={product_id}
                              setShowNotify={setShowNotify}
                            />
                          </div>
                        )}
                      </div>

                      {hasAddToCartError && (
                        <div className=" bg-dbase text-white text-center h-11 rounded bg-opacity-80 capitalize relative flex items-center justify-center ">
                          <span className="px-8">{AddToCartError}</span>
                          <span
                            onClick={() => {
                              setHasAddToCartError(false);
                              setCountDownPointer(false);
                            }}
                            className=" rounded absolute top-0 right-0 cursor-pointer w-11 h-11 flex items-center justify-center hover:bg-white hover:text-dbase border border-dbase border-l-0"
                          >
                            <span className="text-xl">X</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Options */}
                    <div className="my-1 md:my-4">
                      <div className="flex justify-between">
                        {data?.options && data.options?.length > 0 && (
                          <div className="flex justify-between items-center">
                            <h3
                              className="text-sm"
                              style={{ color: "rgb(126, 133, 155)" }}
                            >
                              {`${data["options"]["0"]["name"]} ${
                                viewColor ? ":" : ""
                              }`}
                            </h3>
                            <span className="flex ml-1 font-semibold text-sm w-28">
                              {viewColor}
                            </span>
                          </div>
                        )}
                        {data?.datasheet && (
                          <div
                            className={` text-right cursor-pointer text-sm ${
                              data.options?.length > 0 ? "w-1/2" : "w-full"
                            } `}
                            onClick={() => downloadDatasheet()}
                          >
                            <div className="tooltipp">
                              <span className="tooltiptextt text-xs">
                                preview to download
                              </span>
                              <u className="underline_effect">Datasheet</u>
                            </div>
                          </div>
                        )}
                        {data?.options &&
                          data.options?.length > 0 &&
                          data["options"]["0"]["size_guide"] && (
                            <p
                              className="w-1/2 text-right "
                              onClick={() => setSizeGuide(true)}
                            >
                              {" "}
                              <u className="underline_effect cursor-pointer text-sm">
                                Size Guide
                              </u>
                            </p>
                          )}
                      </div>{" "}
                      {data?.options && data.options?.length > 0 && (
                        <div className="flex flex-wrap ">
                          {data["options"]["0"]["option_value"].map(
                            (option) => (
                              <div className="mr-3" key={option.image}>
                                {/* <p className="text-xs text-center">
                                {option["name"]}
                              </p> */}
                                <div
                                  key={option.image}
                                  className={`p-1 border mr-2 my-2 cursor-pointer hover:shadow w-10 md:w-12 md:h-12 rounded relative ${
                                    option.product_option_value_id ===
                                    activeOption.product_option_value_id
                                      ? "border-dblue"
                                      : " border-dgrey"
                                  }`}
                                  onClick={() => {
                                    setOption(option);
                                    setColorSelected(option["name"]);
                                  }}
                                  onMouseOver={() => {
                                    setViewColor(option["name"]);
                                  }}
                                  onMouseLeave={() => {
                                    setViewColor(colorSelected);
                                  }}
                                >
                                  {option.quantity === "0" && (
                                    <div className=" bg-dgrey bg-opacity-50 w-full h-full absolute top-0 left-0 flex items-center justify-center cursor-not-allowed">
                                      <div className=" text-dblack text-4xl font-bold">
                                        X
                                      </div>
                                    </div>
                                  )}
                                  <Image
                                    src={option["image"]}
                                    key={option.image}
                                    alt={"Option"}
                                    width={80}
                                    height={80}
                                  />
                                </div>
                                {accountState.admin && (
                                  <div className="w-full text-center font-bold">
                                    {option?.quantity}
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      )}
                      {data?.options &&
                        data.options?.length > 0 &&
                        sizeGuide && (
                          <div
                            className="fixed w-full h-full min-h-screen top-0 left-0  bg-opacity-30 bg-dblack z-30"
                            onClick={() => setSizeGuide(false)}
                          ></div>
                        )}
                      <div>
                        {data?.options && data.options?.length > 0 && (
                          <div
                            className=""
                            // onClick={() => setShowNewSizeGuide(false)}
                          >
                            <div
                              className={` top-0  bg-white right-0 lg:w-1/3 w-10/12 min-h-screen transform  fixed h-full z-40 
                               ease-in-out duration-300 ${
                                 sizeGuide
                                   ? "translate-x-0 "
                                   : "translate-x-full"
                               }`}
                            >
                              <div>
                                <div
                                  className={`border-b-4 border-dborderColor ${
                                    width < 650 ? "mx-4" : "mx-6"
                                  }  `}
                                >
                                  <p className="mt-2 font-light text-dgrey1 text-d16">
                                    Size Guide
                                  </p>
                                </div>
                                <div
                                  className={`flex flex-wrap justify-center items-center pr-1  `}
                                >
                                  <div>
                                    {sizeGuide && (
                                      <Image
                                        src={data["options"]["0"]["size_guide"]}
                                        className={`${
                                          width < 650 ? "pb-24" : "pb-1 "
                                        }`}
                                        alt="express"
                                        width={1000}
                                        height={1000}
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Warranties */}
                    <div className="my-1 md:my-4">
                      {data?.warranties && data?.warranties?.length > 0 && (
                        <div>
                          <h3
                            className="text-sm"
                            style={{ color: "rgb(126, 133, 155)" }}
                          >
                            Warranty
                          </h3>
                          <div className="flex flex-wrap items-center justify-start">
                            <div
                              className={`py-1.5 px-3 border mr-2 my-2 cursor-pointer hover:shadow rounded-sm ${
                                Object.keys(warrantyPlan).length === 0
                                  ? "border-dblue border-2"
                                  : "border-dgreyQtyProduct"
                              }`}
                              onClick={() => setWarrantyPlan({})}
                            >
                              None
                            </div>
                            <div
                              onClick={() => setWarrantyPopup(true)}
                              className={`py-1.5 px-3 border mr-2 my-2 cursor-pointer hover:shadow rounded-sm ${
                                Object.keys(warrantyPlan).length > 0
                                  ? "border-dblue border-2"
                                  : "border-dgreyQtyProduct"
                              }`}
                            >
                              {Object.keys(warrantyPlan).length === 0 ? (
                                "Select a plan ..."
                              ) : (
                                <div>
                                  {warrantyPlan.warranty_titles + " / "}{" "}
                                  <span>${warrantyPlan.warranty_fees}</span>...
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* warranty popup */}
                    {warrantyPopup && (
                      <WarrantyPopup
                        warranties={data?.warranties}
                        warrantyPlan={warrantyPlan}
                        handleWarranty={handleWarranty}
                      />
                    )}

                    {/* TIMER */}
                    {data?.special_end !== 0 &&
                      typeof data?.special_end !== typeof null &&
                      data?.special_end !== "0" && <Timer data={data} />}
                    {/*banner */}
                    {hasBannerEvent && hasBannerEvent.thumb && (
                      <div className="mt-5">
                        <Image
                          src={hasBannerEvent.thumb}
                          alt={hasBannerEvent.name}
                          width={483}
                          height={64}
                          className="w-full"
                        />
                      </div>
                    )}
                    {/* PDS */}
                    {/* { data?.pds && 
                      data.pds.length > 0 &&
                      data["series_options"].length < 1 && (
                        <div className="my-2 md:my-4">
                          <p className="font-semibold text-d15 md:text-xl text-dblack mb-2">
                            In the same series
                          </p>
                          <div className=" overflow-x-auto">
                            <div className="flex flex-wrap">
                              {data.pds.map((product) => (
                               product.is_primary&& <Link
                                  key={product.product_id}
                                  href={`/product/` + product.product_id}
                                  className={`flex justify-center items-center w-20 mr-5 mb-5  border-2 hover:shadow cursor-pointer p-1 rounded-md ${
                                    product.product_id === product_id
                                      ? " border-dblue"
                                      : "border-dgrey"
                                  }`}
                                >
                                  <Image
                                    src={product.product_main_image}
                                    alt={product.product_name}
                                    className="w-full"
                                    width={80}
                                    height={80}
                                  />
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      )} */}


<div className="flex  flex-wra gap-2">
                              { data.series.map((serie) => (
                <div className=" flex flex-col gap-3 justify-start">
                  { serie.is_primary && serie.group_type&& <p className="font-semibold text-d15 md:text-xl text-dblack mb-2">{serie.group_type} :</p>  }
                  <div className=" flex flex-wap gap-2"> 
                                      {serie.products && serie.is_primary && serie.products.map((product)=>(
                                      
                                           <Link
                                           key={product.product_id}
                                           href={`/product/` + product.product_id}
                                           className={`flex justify-center items-center  w-36 mr-5 mb-5 transition-all  border-2 hover:bg-dgrey  hover:shadow cursor-pointer p-1 rounded-md ${
                                             product.product_id === product_id
                                               ? " border-dblue"
                                               : "border-dgrey"
                                           }`}
                                         >
                                            <div className=" flex flex-col justify-center text-center gap-2 px-1 py-1">

                                     
                                              <Image
                                              title={product.type}
                                    src={product.image}
                                    alt={product.product_name}
                                    className="w-full rounded-md"
                                    width={100}
                                    height={100}
                                  /> 
                                
                                <div className=" text-sm text-dblack">{product.type}</div>
                                  <div className=" text-dbase">{product.special}</div>
                                  <div className=" text-dlabelColor text-xs line-through">{product.price}</div>
                                </div>
                                            </Link>

                                     
                                      ))}
                                      </div>
                                  </div>
                              ))}
                            </div>


                      

     {/* PDS */}
                




                    { data["series_options"] &&
                      // productData?.pds?.length === 0 &&
                      data["series_options"]?.map(
                        (series_option, key) =>
                          series_option?.series_option_id !== null && (
                            <div className="my-2 md:my-4">
                              <div className="flex justify-between">
                                <div className="flex justify-between items-center">
                                  <h3
                                    className="text-sm"
                                    style={{ color: "rgb(126, 133, 155)" }}
                                  >
                                    {`${
                                      series_option.series_option_name
                                    } ${":"}`}
                                  </h3>
                                  {series_option?.options?.map(
                                    (op_val) =>
                                      op_val.product_id === product_id &&
                                      !viewSeriesVal && (
                                        <span className="flex ml-1 font-semibold text-sm w-28">
                                          {op_val.name}
                                        </span>
                                      )
                                  )}
                                  <span
                                    id={key}
                                    className={`${
                                      viewSeriesVal ? "block" : "hidden"
                                    } ml-1 font-semibold text-sm w-28`}
                                  >
                                    {" "}
                                  </span>
                                </div>
                              </div>
                              <div className="flex fkex-wrap">
                                {series_option?.options?.map((option_val) => (
                                  <Link
                                    key={option_val?.product_id}
                                    href={
                                      `${path}/product/` +
                                      option_val?.product_id
                                    }
                                    className={`flex justify-center items-center w-20 mr-5 mb-5  border-2 hover:shadow cursor-pointer p-1 rounded-md
                                ${
                                  option_val.product_id === product_id
                                    ? " border-dblue"
                                    : "border-dgrey"
                                }
                              `}
                                    // onClick={() =>
                                    //   setSeriesOpSelected(option_val.name)
                                    // }
                                    onMouseOver={() => {
                                      handleHoveredSeries(key, option_val.name);
                                    }}
                                    onMouseLeave={() => handleLeavedSeries(key)}
                                  >
                                    {option_val?.image !== null && (
                                      <Image
                                        src={option_val?.image}
                                        alt={option_val?.name}
                                        className="w-full"
                                        width={80}
                                        height={80}

                                        // placeholderSrc="https://www.sari3.com/ishtaridemo/product_placeholder.png"
                                      />
                                    )}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )
                      )}
      {bundles &&
                      <div className="h-[350px]  overflow-y-auto relative my-3">
                    {bundles && bundles.map((bundle)=>
                      <div className="bg-dfooterbg py-2 px-4 mb-4 mt-8 ">
                        <p className="font-black pr-semibold text-sm mb-2 ml-2">
                          Frequently Bought Together
                        </p>
                        <div className="bg-white">
                          <Slider
                            className="hidden mobile:block"
                            {...productBundlesSetting}
                          >
                            {bundle &&
                              bundle?.products?.map((product, i) => (
                                <div
                                  key={product.product_id}
                                  className="w-12/12 flex  flex-row items-center"
                                >
                                  <div
                                    className={`${width < 650 && "w-10/12"}`}
                                  >
                                    <SingleProductBundle
                                      item={product}
                                      i={i}
                                      len={bundle.products?.length}
                                    />
                                  </div>
                                  {i !== bundle?.products?.length - 1 && (
                                    <span className="text-3xl font-bold mt-2">
                                      +
                                    </span>
                                  )}
                                </div>
                              ))}
                          </Slider>
                          <Slider
                            className=" mobile:hidden"
                            {...productMobileBundlesSetting}
                          >
                            {bundle &&
                              bundle?.products?.map((product, i) => (
                                <div
                                  key={product.product_id}
                                  className="w-12/12 flex flex-row items-center"
                                >
                                  <div
                                    className={`${width < 650 && "w-10/12"}`}
                                  >
                                    <SingleProductBundle
                                      item={product}
                                      i={i}
                                      len={bundle.products?.length}
                                    />
                                  </div>
                                  {i !== bundle?.products?.length - 1 && (
                                    <span className="text-3xl font-bold mt-2">
                                      +
                                    </span>
                                  )}
                                </div>
                              ))}
                          </Slider>
                        </div>

                        {bundle && (
                          <button
                            className="w-full h-12 text-center text-sm flex items-center justify-center font-semibold my-2 rounded bg-white text-dbluedark py-4 border-2 border-dbluedark"
                            onClick={() => {
                              addBundle(bundle);
                            }}
                          >
                            {countDownPointer === true &&
                            hasAddToCartError === false ? (
                              <div className="top-5 lds-ellipsis">
                                <div className="bg-dbluedark" />
                                <div className="bg-dbluedark" />
                                <div className="bg-dbluedark" />
                                <div className="bg-dbluedark" />
                              </div>
                            ) : (
                              !addingToCart && (
                                <span className="">
                                  {  bundle?.description ==""?(
                               <>  Buy This Bundle For </>
                                     ):(<>  {bundle?.description} {" "}</>) }
                                  {bundle?.total_amount_after_discount}{" "}
                                </span>
                              )
                            )}
                          </button>
                        )}
                      </div>
                    )}
                    </div>
      }

                    <div className="my-4 hidden mobile:block">
                      <WhatsappBtn product_id={product_id} config={config} />
                    </div>
                  </div>
                </div>
                
                <div className="pl-3 hidden md:block border-l border-dborderProduct w-1/4">
                  {/* EXTRA */}
                  {/* admin div */}

                  {accountState.admin && (
                    <div className=" shadow-lg p-6 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xl">Quantity: </span>
                        <span
                          className={`text-2xl`}
                          style={{
                            color: data.quantity > 5 ? "black" : "red"
                          }}
                        >
                          {data.quantity}
                        </span>
                      </div>
                      <div className="flex items-center justify-between my-2">
                        <span className="text-xl">UPC: </span>
                        <span className="text-2xl">{data.upc}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl">SKU: </span>
                        <span className="text-2xl">{data.sku}</span>
                      </div>
                      <br />
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={`${
                          window.config["admin-update-product"] + product_id
                        }&token=${accountState.adminToken}`}
                        className="text-dblack  bg-dgrey px-6 py-2 rounded my-2 inline-block"
                      >
                        Edit Product
                      </a>
                    </div>
                  )}

                  {data?.no_refundable === true && (
                    <>
                      <div className=" md:flex-row w-1/2 md:w-full md:flex md:items-center text-dblack py-6 border-b border-dinputBorder">
                        <svg
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15.8776 17.036C15.0639 17.5674 14.0921 17.8764 13.0466 17.8764C12.2313 17.8764 11.4612 17.6885 10.7761 17.3541C9.9253 16.9389 9.20453 16.2972 8.69273 15.5076C8.16748 14.6971 7.86243 13.731 7.86243 12.6921C7.86243 11.521 8.2502 10.4418 8.90457 9.57402C9.85159 8.3182 11.3544 7.50793 13.0466 7.50793C15.9098 7.50793 18.2308 9.82898 18.2308 12.6921C18.2308 13.4268 18.0783 14.1246 17.8037 14.7565C17.3974 15.6913 16.7231 16.4837 15.8776 17.036Z"
                            fill="#bf1b26"
                            stroke="#bf1b26" //this
                          />
                          <path
                            d="M14.8878 10.6484L11.2352 14.7798"
                            stroke="#eee"
                            strokeLinecap="round"
                          />
                          <path
                            d="M11.2352 10.6484L14.8878 14.7798"
                            stroke="#eee"
                            strokeLinecap="round"
                          />
                          <path
                            d="M3.84345 5.11316L13.0203 5.11316C17.2061 5.11316 20.5993 8.50637 20.5993 12.6921V12.6921C20.5993 16.8778 17.2061 20.2711 13.0203 20.2711H10.5951"
                            stroke="#bf1b26"
                            strokeLinecap="round"
                          />
                          <path
                            d="M5.29549 3.25525L3.40076 5.11319L5.29549 7.30388"
                            stroke="#bf1b26"
                            strokeLinecap="round"
                          />
                          <path
                            d="M8.18159 20.2711H6.19393"
                            stroke="#bf1b26"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className=" ml-2">
                          <span className="text-dgrey2 font-light text-sm">
                            This item cannot be exchanged or returned
                          </span>
                          <br />
                          <u
                            className="underline_effect cursor-pointer"
                            onClick={() => {
                              setNonrefundable(true);
                              handleReturnPolicy();
                            }}
                          >
                            Learn more
                          </u>
                        </div>
                      </div>

                      {nonrefundable && (
                        <div
                          className="fixed w-screen h-full min-h-screen top-0 left-0  bg-opacity-30 bg-dblack z-30"
                          onClick={() => setNonrefundable(false)}
                        ></div>
                      )}

                      <div>
                        <div
                          className={` top-0  bg-white right-0 sm:w-1/2 w-10/12  min-h-screen transform  fixed h-full z-40 
                              ease-in-out duration-300 overflow-y-scroll ${
                                nonrefundable
                                  ? "translate-x-0 "
                                  : "translate-x-full"
                              }`}
                        >
                          <div className="relative -top-9">
                            <div className="absolute z-40">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: unescapeHTML(
                                    sanitizeHTML(returnPolicy?.description)
                                  )
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {data?.seller_id > 0 && data.seller !== "" && (
                    <Link
                      href={`/sellerReview/${data.seller_id}`}
                      className="hidden md:flex items-center border-b border-dinputBorder  cursor-pointer mr-5 md:mr-0 hover:opacity-80 py-2 md:py-6"
                    >
                      {data.seller_image.length > 0 ? (
                        <div className="rounded-full p-0.5 flex justify-center items-center w-16 h-16 mr-1.5 ">
                          <SellerImage src={data.seller_image} />
                        </div>
                      ) : (
                        <AiOutlineShop className=" text-dbase text-3xl mr-4" />
                      )}
                      <div className="flex flex-col">
                        <div className="flex">
                          <span className="text-dblack text-sm">Sold by</span>{" "}
                          <h1 dangerouslySetInnerHTML={{__html: sanitizeHTML(data.seller)}} className="text-dblue underline ml-2 text-d14 uppercase pr-semibold">                            
                          </h1>
                        </div>
                        {sellerData?.seller_reviews?.average_rating ? (
                          <div className="flex ">
                            <div
                              className="flex justify-center items-center flex-row  rounded-full h-4 space-x-0.5 p-1 mr-3 cursor-pointer w-10 mt-1"
                              style={{
                                backgroundColor:
                                  sellerData.seller_reviews?.average_rating >=
                                  4.5
                                    ? "rgb(0,158,0)"
                                    : sellerData.seller_reviews
                                        ?.average_rating < 4.5 &&
                                      sellerData.seller_reviews
                                        ?.average_rating >= 4
                                    ? "rgb(110, 159, 0)"
                                    : sellerData.seller_reviews
                                        ?.average_rating < 4 &&
                                      sellerData.seller_reviews
                                        ?.average_rating >= 3.5
                                    ? "rgb(243, 153, 22)"
                                    : "rgb(246,90,31)"
                              }}
                            >
                              <div className=" font-bold text-white text-d14 ">
                                {sellerData.seller_reviews?.average_rating ||
                                  "0.0"}
                              </div>

                              <AiFillStar className="text-white text-d12" />
                            </div>
                            <div className=" text-d14 flex  text-dgrey1 mt-0.5 font-semibold ">
                              {"  "}
                              {sellerData.seller_reviews?.percentage &&
                                sellerData.seller_reviews?.percentage +
                                  " positive Ratings"}
                            </div>
                          </div>
                        ) : (
                          <div className=" text-d14 flex  text-dgrey1 mt-o.5 font-semibold opacity-80">
                            Not enough ratings to show{" "}
                            <AiFillStar className=" text-d16 mt-0.5 ml-1 " />
                          </div>
                        )}
                      </div>
                    </Link>
                  )}
                  {data?.market === "0" && (
                    <div className="hidden md:flex-row w-1/2 md:w-full md:flex md:items-center text-dblack py-6">
                      <img
                        src={"/images/express.png"}
                        className="w-16"
                        alt="express"
                        width={90}
                        height={90}
                      />
                      <div className="ml-2">
                        <h1 className="font-semibold text-sm">
                          Express delivery
                        </h1>
                        <p className="text-dgrey1 font-light text-d13">
                          Always in stock, ready to ship, faster delivery
                        </p>
                      </div>
                    </div>
                  )}

                  {data?.market === "1" && (
                    <div className="hidden md:flex-row w-1/2 md:w-full md:flex md:items-center text-dblack py-6">
                      <img
                        src={"/images/market.svg"}
                        className="w-16"
                        alt="express"
                        width={90}
                        height={90}
                      />
                      <div className="ml-2">
                        <p className="text-dgrey1 font-light text-d13">
                          All seller's warehouse; usually ships slower than
                          express items
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="hidden md:flex w-full items-center text-dblack border-t border-dinputBorder py-2 md:py-6">
                    <FaBus className=" text-dbase w-6 h-6 mr-4" />
                    <div>
                      <p className="font-semibold text-sm">TRUSTED SHIPPING</p>
                      <p className="text-dgrey1 font-light text-d13">
                        We will make sure to deliver your order within 5 days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="scroll-container">
  <div className="scroll-content flex  animate-500">
   Your content goes here If you want to create an auto-scrolling effect for a where it    jkwerkgwekjrgwekrhkejfhsdkjfsdkfgskdfgskdfgsdhjfgshjfgshdfghdsfghdghdgdhsghsdfghdfgjdfgdhjsfghjdsgf
  </div>
</div> */}
              {/* Product Description */}

              <div className="my-4 container block mobile:hidden">
                <WhatsappBtn product_id={product_id} config={config} />
              </div>





              { data?.series &&
                      data.series.length > 0 &&
                      data["series_options"].length < 1 && (
                        <div className=" border-t-8 border-dinputBorder bg-dinputBorder ">
                        <div className=" px-5 mobile:px-12 bg-white py-4">
                          {/* <p className="font-semibold text-d15 md:text-xl text-dblack mb-2">
                            In the same series
                          </p> */}
                          <div className=" overflow-x-auto">
                            <div className="flex  flex-col gap-2">
                              { data.series.map((serie) => (
                                
                              <div className=" h-fit w-full  py-2 px-3  " >
                               { !serie.is_primary && serie.group_type&& <p className="font-semibold text-d15 md:text-xl text-dblack mb-2">{serie.group_type} :</p>  }
                                     <div className=" flex flex-wrap px-3 py-3 w-fit   gap-2">
                                      {!serie.is_primary && serie.products && serie.products.map((product)=>(
                                      
                                           <Link
                                           key={product.product_id}
                                           href={`/product/` + product.product_id}
                                           className={`flex justify-center items-center  w-36 mr-5 mb-5 transition-all  border-2 hover:bg-dgrey  hover:shadow cursor-pointer p-1 rounded-md ${
                                             product.product_id === product_id
                                               ? " border-dblue"
                                               : "border-dgrey"
                                           }`}
                                         >
                                            <div className=" flex flex-col justify-center text-center gap-2 px-1 py-1">

                                     
                                              <Image
                                              title={product.type}
                                    src={product.image}
                                    alt={product.product_name}
                                    className="w-full rounded-md"
                                    width={100}
                                    height={100}
                                  /> 
                                  <div className=" text-sm text-dblack">{product.type}</div>
                                  <div className=" text-dbase">{product.special}</div>
                                  <div className=" text-dlabelColor text-xs line-through">{product.price}</div>

                                
                                </div>
                                            </Link>

                                     
                                      ))}
                                     </div>
                              </div>
                              ))}
                            </div>
                            </div>
                          </div>
                        </div>
                      )}







              <div
                ref={lastElementRef}
                className="border-t-8 border-dinputBorder bg-dinputBorder"
                onScroll={() => setScroll(!scroll && true)}
              ></div>
              <div className="hidden mobile:block w-full bg-white"></div>

              <div className="flex  px-5 mobile:px-12 bg-white">
                <p
                  onClick={() => setShowReview(false)}
                  className={`${
                    !showReview &&
                    "border-b-4 border-dblue scale-110 transform ease-in-out duration-300"
                  } hidden : mobile:block font-semibold text-xl text-dblack cursor-pointer py-4`}
                >
                  Product Information
                </p>
              </div>
              <div className=" hidden mobile:flex mobile:px-6 bg-white">
                <div
                  className={` ${
                    data?.attribute_groups.length > 0 ? "w-1/2" : "w-full"
                  }  bg-white mb-4  px-6 my-content  text-d14 pb-2 `}
                >
                  <div className="flex  space-x-10 text-d16 text-left w-full py-5">
                    <p
                      onClick={() => setShowReview(false)}
                      className={`text-d20`}
                    >
                      Description
                    </p>
                  </div>
                  <div
                    id="desc"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML(data.description)
                    }}
                  />{" "}
                </div>
                {data?.attribute_groups.length > 0 && (
                  <div className=" bg-white mb-4  w-full mobile:w-1/2 px-5 ">
                    <div className="px-5  flex  flex-col items-center justify-center align-middle pb-5 ">
                      <div className="flex  space-x-10 text-d16 text-left w-full pt-5">
                        <p
                          onClick={() => setShowReview(false)}
                          className={`text-d20`}
                        >
                          Features
                        </p>
                      </div>

                      <div className="pt-5 mobile:pt-4 w-full">
                        <table className="w-full text-d14 text-dgrey1">
                          <tbody>
                            {data?.attribute_groups?.map((grp) => (
                              <tr className="even:bg-dgrey">
                                <td className="px-2.5 w-1/2 py-1">
                                  {grp.name}
                                </td>
                                <td className="px-1">
                                  {grp?.attribute?.map((attr) => attr.name)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="my-2 container bg-white mobile:hidden">
                <div
                  className="flex justify-between items-center"
                  onClick={() => setIsDetails((prev) => !prev)}
                >
                  <p className="font-semibold text-xl py-2 text-dblack mb-1">
                    Product Details
                  </p>
                  <i
                    className={
                      !isDetails
                        ? "icon icon-angle-right text-dgrey1 text-2xl transition-all"
                        : "icon icon-angle-down text-dgrey1 text-2xl transition-all"
                    }
                  ></i>
                </div>

                <div className={!isDetails ? "hidden" : "block"}>
                  <div
                    id="desc"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML(data.description)
                    }}
                  />
                  {data?.attribute_groups.length > 0 && (
                    <div className="px-3  flex  flex-col items-center justify-center align-middle pb-5 ">
                      <div className="flex   text-d16 text-left w-full pt-5">
                        <p
                          onClick={() => setShowReview(false)}
                          className={`text-d20`}
                        >
                          Features
                        </p>
                      </div>

                      <div className="pt-5 mobile:pt-4 w-full">
                        <table className="w-full text-d14 text-dgrey1">
                          <tbody>
                            {data?.attribute_groups?.map((grp) => (
                              <tr className="even:bg-dgrey">
                                <td className="px-2.5 w-1/2 py-1">
                                  {grp.name}
                                </td>
                                <td className="px-1">
                                  {grp?.attribute?.map((attr) => attr.name)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div></div>
                    </div>
                  )}
                </div>
              </div>
              {data?.seller_id > 0 && data.seller !== "" && (
                <Link
                  href={`/sellerReview/${data.seller_id}`}
                  className="flex mobile:hidden items-center border-b border-dinputBorder  cursor-pointer  hover:opacity-80 py-2 md:py-6 bg-white"
                >
                  {data.seller_image.length > 0 ? (
                    <div className="rounded-full p-0.5 flex justify-center items-center w-16 h-16 mr-1.5 ">
                      <SellerImage src={data.seller_image} />
                    </div>
                  ) : (
                    <AiOutlineShop className=" text-dbase text-3xl mr-4" />
                  )}
                  <div className="flex flex-col">
                    <div className="flex">
                      <span className="text-dblack text-sm">Sold by</span>{" "}
                      <h1 dangerouslySetInnerHTML={{__html: sanitizeHTML(data.seller)}} className="text-dblue underline ml-2 text-d14 uppercase pr-semibold">
                      </h1>
                    </div>
                    {sellerData?.seller_reviews?.average_rating ? (
                      <div className="flex ">
                        <div
                          className="flex justify-center items-center flex-row  rounded-full h-4 space-x-0.5 p-1 mr-3 cursor-pointer w-10 mt-1"
                          style={{
                            backgroundColor:
                              sellerData.seller_reviews?.average_rating >= 4.5
                                ? "rgb(0,158,0)"
                                : sellerData.seller_reviews?.average_rating <
                                    4.5 &&
                                  sellerData.seller_reviews?.average_rating >= 4
                                ? "rgb(110, 159, 0)"
                                : sellerData.seller_reviews?.average_rating <
                                    4 &&
                                  sellerData.seller_reviews?.average_rating >=
                                    3.5
                                ? "rgb(243, 153, 22)"
                                : "rgb(246,90,31)"
                          }}
                        >
                          <div className=" font-bold text-white text-d14 ">
                            {sellerData.seller_reviews?.average_rating || "0.0"}
                          </div>

                          <AiFillStar className="text-white text-d12" />
                        </div>
                        <div className=" text-d14 flex  text-dgrey1 mt-0.5 font-semibold ">
                          {"  "}
                          {sellerData.seller_reviews?.percentage &&
                            sellerData.seller_reviews?.percentage +
                              " positive Ratings"}
                        </div>
                      </div>
                    ) : (
                      <div className=" text-d14 flex  text-dgrey1 mt-o.5 font-semibold opacity-80">
                        Not enough ratings to show{" "}
                        <AiFillStar className=" text-d16 mt-0.5 ml-1 " />
                      </div>
                    )}
                  </div>
                </Link>
              )}
              <div ref={descriptionRef}></div>
              <ProductPart2
                titleRef={titleRef}
                loader={loader}
                productData2={productData2}
                data={data}
                reviews={reviews}
                host={host}
                product_id={product_id}
                sellerData={sellerData}
                getProductPart2={getProductPart2}
                loadingReviews={loadingReviews}
              />
            </div>
          </div>

          {/* wishlist group */}

          {showGroup && (
            <div className="w-full relative px-4">
              <div
                id="overlay"
                className="fixed  z-40 w-screen h-screen inset-0 bg-dblack bg-opacity-60"
              ></div>

              <div
                id="dialog"
                className={`fixed z-50 top-0 left-0 right-0 bottom-0 m-auto w-full h-fit  md:w-1/2 lg:w-1/3  bg-white rounded-md px-8 py-6 space-y-5 drop-shadow-lg `}
              >
                <button
                  id="close"
                  className=" ml-3 top-0 -mt-10 w-10 h-10 hover:bg-indigo-700 bg-dgreyRate cursor-pointer float-right rounded-full  font-semibold text-dbluegray"
                  onClick={() => setShowGroup(false)}
                >
                  X
                </button>
                <div className="flex w-full">
                  <span className="text-l font-semibold w-1/2">
                    Select Group
                  </span>
                  <button
                    className=" font-semibold text-dblue text-right ml-4"
                    onClick={() => deleteItemFromAllGroup()}
                  >
                    Remove from all
                  </button>
                </div>
                <div className="flex flex-col py-2 border-t border-dinputBorder overflow-y-auto h-80">
                  {GroupWishlist.map((p, i) => (
                    <div
                      className="flex  mb-4 pb-2 border border-dinputBorder"
                      onClick={() => {
                        updateState(p.wishlist_group_id);
                      }}
                    >
                      <label className="text-sm ml-3 font-medium text-gray-900 w-10/12 mt-1">
                        {p.name}
                      </label>
                      <input
                        name="wish"
                        id="checkbox-1"
                        aria-describedby="checkbox-1"
                        type="checkbox"
                        value={p.wishlist_group_id}
                        className="h-4 w-4 float-right mt-2 border-dgrey"
                        onClick={() => setValue(p.wishlist_group_id)}
                        checked={
                          checked?.indexOf(p.wishlist_group_id.toString()) >
                            -1 && "checked"
                        }
                      />
                    </div>
                  ))}
                </div>

                <div
                  className="flex  mb-4  bg-dgreyRate px-2 py-2"
                  onClick={() => {
                    setShowGroup(false);
                    setShowModel(true);
                  }}
                >
                  <label className="flex text-sm  font-medium text-gray-900 w-10/12 ">
                    <div className="text-sm rounded-full bg-white w-5 h-5 mr-1 text-center text-dgreyBlack">
                      +
                    </div>
                    Create New wishlist
                  </label>
                </div>
                <div className=" justify-end border-t-2 border-dinputBorder p-2">
                  <button
                    id="close"
                    className="px-5 py-2 w-full bg-dblue hover:bg-indigo-700 text-white cursor-pointer rounded-md"
                    onClick={addToWishList}
                  >
                    Done
                  </button>

                  <div
                    onClick={() => router.push("/account/wishlist")}
                    className="text-dblue text-center w-full pt-3 cursor-pointer"
                  >
                    Go to Wishlist{" "}
                  </div>
                </div>
              </div>
            </div>
          )}

          {showModel && (
            <div className="container">
              <div
                id="overlay"
                className="fixed  z-40 w-screen h-screen inset-0 bg-dblack bg-opacity-60"
              ></div>

              <div
                id="dialog"
                className={` fixed z-50 top-1/3  bg-white rounded-md px-8 py-6 space-y-5 drop-shadow-lg ${
                  window.innerWidth > 650
                    ? "left-1/3 top-1/3 w-1/3"
                    : "top-1 w-10/12 "
                }`}
              >
                <button
                  id="close"
                  className=" ml-3 top-0 -mt-10 w-10 h-10 hover:bg-indigo-700 bg-dgreyRate cursor-pointer float-right rounded-full  font-semibold text-dbgrey hover:opacity-90"
                  onClick={() => setShowModel(false)}
                >
                  X
                </button>
                <span className="text-l font-semibold">New Group</span>

                <div className="py-1 border-t border-dinputBorder">
                  <div className="text-dbase w-full">
                    {result?.errors && result?.errors[0]?.errorMsg}
                  </div>
                  <div className="mt-5">
                    <div className="input mb-6 required">
                      <label htmlFor=""> Name </label>{" "}
                      <input
                        onChange={(event) => setName(event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="input mb-6 ">
                    <label htmlFor=""> Description </label>
                    <input
                      onChange={(event) => setDescription(event.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    id="close"
                    className="w-full px-5 py-1 bg-dblue hover:bg-indigo-700 text-white cursor-pointer rounded-md"
                    onClick={() => addGroup()}
                  >
                    save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}{" "}
    </>
  );
}

export default ProductPage;

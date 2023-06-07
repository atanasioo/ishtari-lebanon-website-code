import Link from "next/link";
import { BsChevronRight, BsWhatsapp } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { FaBus } from "react-icons/fa";
import { AiOutlineShop } from "react-icons/ai";
import DOMPurify from "dompurify";
import Image from "next/image";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import useDeviceSize from "@/components/useDeviceSize";
import { axiosServer } from "@/axiosServer";
import buildLink, { path, pixelID } from "@/urls";
import ProductPart2 from "./ProductPart2";
import dynamic from "next/dynamic";
import NotifyMe from "./NotifyMe";
import { sanitizeHTML } from "../Utils";
import ProductZoom from "./ProductZoom";
import { CartContext } from "../../contexts/CartContext";
import { AccountContext } from "../../contexts/AccountContext";
import ReactPixel from "react-facebook-pixel";

function ProductPage(props) {
  //Server props
  const { data, host, hovered } = props; //instead of productData
  //contexts
  const [accountState] = useContext(AccountContext);
  const [state, dispatch] = useContext(CartContext);
  //states
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
  const [sizeGuide, setSizeGuide] = useState();
  const [colorSelected, setColorSelected] = useState();
  const [reviews, setReviews] = useState();
  const [activeImageOption, setImageActiveOption] = useState({});
  const [images, setImages] = useState(data.images);
  const [hasOption, setHasOption] = useState(false);
  const [activeImage, setActiveImage] = useState({});

  const [width, height] = useDeviceSize();
  const Timer = dynamic(() => import("./Timer"), {
    ssr: false, // Disable server-side rendering
  });

  const router = useRouter();
  const product_id = router.query.slug[0].includes("p=")
    ? router.query.slug[0].split("=")[1]
    : router.query.slug[0];

  useEffect(() => {
    if (data.special_end !== null && data.special_end !== 0) {
      setHasBannerEvent(data?.bannerevent);
    }
    setProductBundle(
      data?.product_bundles?.length > 0 ? data?.product_bundles[0] : null
    );

    setReviews(data?.product_reviews?.reviews);

    //banner_event
    if (data?.special_end !== null && data?.special_end !== 0) {
      setHasBannerEvent(data?.bannerevent);
    }

    setHasOption(data?.options?.length > 0);

    data.options.length > 0 &&
      setOptionParent(data.options[0]["product_option_id"]);

    const includesImage = data?.images.some((image) => {
      return image.popup === data.popup && image.thumb === data.thumb;
    });
    if (!includesImage) {
      data?.images.unshift({
        popup: data.popup,
        thumb: data.thumb,
      });
    }

    // ---> Facebook PIXEL <---
    if (!accountState.admin) {
      const advancedMatching = {
        em: data?.data?.social_data?.email,
        fn: data?.data?.social_data?.firstname,
        ln: data?.data?.social_data?.lastname,
        external_id: data?.data?.social_data?.external_id,
        country: data?.data?.social_data?.country_code,
        fbp: Cookies.get("_fbp"),
      };
      ReactPixel.init(pixelID, advancedMatching, {
        debug: true,
        autoConfig: false,
      });
      ReactPixel.pageView();
      ReactPixel.fbq("track", "PageView");

      window.fbq(
        "track",
        "ViewContent",
        {
          content_type: "product",
          content_ids: [product_id],
          content_name: data?.data?.social_data?.name,
          value: data?.data?.social_data?.value,
          currency: data?.data?.social_data?.currency,
        },
        { eventID: data?.data?.social_data?.event_id }
      );
    }
    var dataSocial = data.social_data;
    dataSocial["fbp"] = Cookies.get("_fbp");
    dataSocial["fbc"] = Cookies.get("_fbc");
    dataSocial["ttp"] = Cookies.get("_ttp");
    dataSocial["link"] = window.location.href;

    axiosServer
      .post(buildLink("pixel", undefined, window.innerWidth), dataSocial)
      .then((response) => {
        const data = response.data;
      });
  }, []);

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
    apos: "'",
  };

  function handleReturnPolicy() {
    axiosServer
      .get(
        buildLink("information", undefined, window.innerWidth) +
          "&information_id=10"
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
      // console.log("omar")
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && loader) {
          setLoader(true);
          getProductPart2();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loader]
  );

  const titleRef = useRef();
  function handleClick() {
    titleRef.current.scrollIntoView({ behavior: "smooth" });
  }

  function getProductPart2() {
    // console.log("entered");
    var link =
      buildLink("product", undefined, window.innerWidth) +
      `${product_id}&source_id=1&part_tow=true`;
    axiosServer.get(link).then((response) => {
      const data = response.data;
      console.log(data);
      if (data?.success) {
        setReviews(data?.data?.product_reviews?.reviews);

        setProductData2(data.data);
        setLoader(false);
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
              thumb: element["thumb"],
            });
          }
        }
      }
    }
    setActiveOption(option);
  }

  function gtag_report_conversion(obj) {
    if (!accountState.admin) {
      var price = 10;
      if (data.special_net_value) {
        price = data.special_net_value;
      } else {
        price = data.price_net_value;
      }
      if (window.location.host === "www.ishtari.com") {
        var callback = addToCart(obj);
        gtag("event", "conversion", {
          send_to: "AW-991347483/FGk5CJ3V3owYEJuG29gD",
          value: price,
          currency: "USD",
          event_callback: callback,
        });
        return false;
      } else if (window.location.host === "www.ishtari.com.gh") {
        const callback = addToCart(obj);
        gtag("event", "conversion", {
          send_to: "AW-10993907106/6Y9jCLfUipEYEKLrpvoo",
          value: price,
          currency: "USD",
          event_callback: callback,
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
      quantity,
    };
    if (hasOption) {
      let o = {};
      const op = optionParent.toString();
      o[op] = activeOption["product_option_value_id"];
      obj["option"] = o;
    }
    let error = "";
    axiosServer
      .post(
        buildLink("cart", undefined, window.innerWidth) + "&source_id=1",
        bundle === undefined ? obj : bundle
      )
      .then((response) => {
        const data = response.data;
        if (data.success !== true) {
          // There is an error
          setHasAddToCartError(true);
          if (!hasOption) {
            error = data?.errors[0]?.errorMsg;
          } else {
            error = data?.errors[0]?.errorMsg;
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
            payload: true,
          });
          axiosServer
            .get(buildLink("cart", undefined, window.innerWidth))
            .then((response_data) => {
              dispatch({
                type: "setProducts",
                payload: response_data.data?.data?.products,
              });

              dispatch({
                type: "setProductsCount",
                payload: response_data?.data?.data?.total_product_count,
              });
              dispatch({
                type: "setTotals",
                payload: response_data.data?.data?.totals,
              });
              dispatch({
                type: "loading",
                payload: false,
              });
            });

          if (data) {
            const data = response?.data?.data?.social_data;

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
                fbp: Cookies.get("_fbp"),
              },
              { eventID: data?.event_id }
            );
          }
          // }

          var dataSocial = response?.data?.data?.social_data;
          dataSocial["link"] = window.location.href;
          dataSocial["fbp"] = Cookies.get("_fbp");
          dataSocial["fbc"] = Cookies.get("_fbc");
          dataSocial["ttp"] = Cookies.get("_ttp");

          axiosServer
            .post(buildLink("pixel", undefined, window.innerWidth), dataSocial)
            .then((response) => {
              const data = response.data;
              if (data.success === true) {
              }
            });
          setSuccessAdded(true);

          setTimeout(() => {
            // setCountDown(false)
            setAddingToCart(false);
          }, 3000);
        }
      });
  }

  return (
    <div style={{ backgroundColor: "#f8f8f9" }} className="overflow-x-hidden">
      <div className="">
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
                      ),
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="product-div flex items-stretch bg-white w-full">
            <div className="flex flex-col md:flex-row py-3 pr-2 w-full md:w-3/4">
              <div className="product-zoom w-full md:w-7/12">
                {/* <Image width={380} height={518} src={data.popup} /> */}
                <ProductZoom
                  activeOption={activeImageOption.product_option_value_id}
                  images={data.images}
                  hovered={hovered}
                  productData={data}
                />
              </div>
              <div className="product-info w-full md:w-5/12">
                {/* BRAND NAME */}
                <Link href={"/"} className="text-dgrey1 hover:text-dblue">
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
                <h1
                  className="text-dblack font-semibold text-d22 mb-3 leading-pn"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHTML(data.name),
                  }}
                ></h1>
                <div className="mb-3 product-info">
                  <div className="mb-3">
                    <div className="product-model-rating mb-3 text-d14 text-dgreyProduct flex flex-wrap items-center">
                      <div className="modelNumber mr-1.5">
                        Model Number: {data.sku}
                      </div>
                      <div className="divider h-4 w-0.5 bg-dplaceHolder mr-1.5"></div>
                      <div className="product-rating"></div>
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
                            data.special !== "0" ? "text-d20 font-bold " : ""
                          }`}
                        >
                          {data.special !== "0" ? data.special : data.price}
                        </div>
                      </div>

                      {/* missing span */}

                      {data.special !== "0" && (
                        <div className="flex items-center">
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
                  </div>
                  {/* Add to cart */}

                  <div className="flex text-d15 mt-4">
                    <div className="w-16 font-semibold">Quantity</div>
                    {data["quantity"] <= 5 && data["quantity"] > 0 && (
                      <div className="text-dbase ml-2">
                        Low stock: only {data["quantity"]} left
                      </div>
                    )}
                  </div>

                  <div
                    className={`flex items-center mt-4 mb-4 ${
                      data["quantity"] <= 5 ? "mt-1" : "mt-4"
                    }`}
                  >
                    {/* <input
                      onChange={(e) => setQuantity(e.target.value)}
                      type="number"
                      value={quantity}
                      className={`${productData["quantity"] === "0" && "hidden"}
                                            border
                                            w-16
                                            h-12
                                            rounded
                                            text-dblack text-center
                                            border-dgrey1
                                            text-xl
                                            `}
                    /> */}

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
                                  transform: toggleQty ? "rotate(-180deg)" : "",
                                  transition: "transform 0.2s ease",
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
                          >
                            {Array.from(
                              { length: data.quantity },
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

                    <button
                      className={` text-white flex-grow h-12 relative rounded  ml-1  ${
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
                                successAdded && countDown && !countDownPointer
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
                            // onClick={() => checkIfLogged()}
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
                          setCountDonwPointer(false);
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
                        <h2
                          className="w-1/2 text-right "
                          onClick={() => setSizeGuide(true)}
                        >
                          {" "}
                          <u className="underline_effect cursor-pointer text-sm">
                            Size Guide
                          </u>
                        </h2>
                      )}
                  </div>{" "}
                  {data?.options && data.options?.length > 0 && (
                    <div className="flex flex-wrap ">
                      {data["options"]["0"]["option_value"].map((option) => (
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
                          {/* {accountstate.admin && (
                              <div className="w-full text-center font-bold">
                                {option?.quantity}
                              </div>
                            )} */}
                        </div>
                      ))}
                    </div>
                  )}
                  {data?.options && data.options?.length > 0 && sizeGuide && (
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
                                <Image
                                  src={data["options"]["0"]["size_guide"]}
                                  className={`${
                                    width < 650 ? "pb-24" : "pb-1 "
                                  }`}
                                  alt="express"
                                  width={80}
                                  height={80}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* TIMER */}
                {/* {data?.special_end !== 0 &&
                  typeof data?.special_end !== typeof null &&
                  data?.special_end !== "0" &&
                   (
                    <Timer
                     
                      data={data}
                    />
                  )} */}
                {/*banner */}
                {hasBannerEvent && hasBannerEvent.thumb && (
                  <div className="mt-5">
                    <img
                      src={hasBannerEvent.thumb}
                      alt={hasBannerEvent.name}
                      className="w-full"
                    />
                  </div>
                )}
                {/* PDS */}
                {data?.pds && data.pds.length > 0 && (
                  <div className="my-2 md:my-4">
                    <p className="font-semibold text-d15 md:text-xl text-dblack mb-2">
                      In the same series
                    </p>
                    <div className=" overflow-x-auto">
                      <div className="flex flex-wrap">
                        {data.pds.map((product) => (
                          <Link
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
                )}
                {bundles && (
                  <div className="bg-dfooterbg py-2 px-4 mb-4 mt-8">
                    <h6 className="font-black text-sm mb-2 ml-2">
                      Frequently Bought Together
                    </h6>
                    <div className="bg-white">
                      <Swiper>
                        {bundles &&
                          bundles?.products?.map((product, i) => (
                            <SwiperSlide
                              key={product.product_id}
                              className="w-12/12 flex flex-row items-center"
                            >
                              <div className={`${width < 650 && "w-10/12"}`}>
                                {/* <SingleProductNew
                                  item={product}
                                  i={i}
                                  len={bundles.products?.length}
                                /> */}
                                hii
                              </div>
                              {i !== bundles?.products?.length - 1 && (
                                <span className="text-3xl font-bold mt-2">
                                  +
                                </span>
                              )}
                            </SwiperSlide>
                          ))}
                      </Swiper>
                    </div>

                    {bundles && (
                      <button
                        className="w-full h-12 text-center text-sm flex items-center justify-center font-semibold my-2 rounded bg-white text-dbluedark py-4 border-2 border-dbluedark"
                        onClick={() => {
                          addBundle(bundles);
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
                              Buy This Bundle For{" "}
                              {bundles?.total_amount_after_discount}{" "}
                            </span>
                          )
                        )}
                      </button>
                    )}
                  </div>
                )}

                <div className="my-4 hidden mobile:block">
                  <a
                    className="flex justify-start"
                    // href={`https://api.whatsapp.com/send?phone=${
                    //   window.config["countryCode"] + accountstate.wtspNumber
                    // }&text=Hi%20there%20i%27m%20interested%20in%20${
                    //   window.config["site-url"]
                    // }/product/${product_id}`}
                  >
                    <div className=" flex justify-start items-center rounded-md bg-dgreen py-2 px-4 text-white">
                      <BsWhatsapp className="w-5 h-5" />
                      <p className="text-md ml-4">Whatsapp Support</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div className="pl-3 hidden md:block border-l border-dborderProduct w-1/4">
              {/* EXTRA */}
              {/* admin div */}
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
                              ),
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
                  href={"/"}
                  className="hidden md:flex items-center  cursor-pointer mr-5 md:mr-0 hover:opacity-80 py-2 md:py-6"
                >
                  <AiOutlineShop className=" text-dbase text-3xl mr-4" />
                  <span className="text-dblack text-sm">Sold by</span>

                  <h1 className="text-dblue underline font-semibold ml-2 text-sm">
                    {data.seller}
                  </h1>
                </Link>
              )}
              {data?.market === "0" && (
                <div className="hidden md:flex-row w-1/2 md:w-full md:flex md:items-center text-dblack py-6">
                  <Image
                    src={"/images/express.png"}
                    className="w-16"
                    alt="express"
                    width={90}
                    height={90}
                  />
                  <div className="ml-2">
                    <h1 className="font-semibold text-sm">Express delivery</h1>
                    <p className="text-dgrey1 font-light text-d13">
                      Always in stock, ready to ship, faster delivery
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

          {/* Product Description */}

          <div className="my-4 container block mobile:hidden">
            <a
              className=""
              // href={`https://api.whatsapp.com/send?phone=${
              //   window.config["countryCode"] + accountstate.wtspNumber
              // }&text=Hi%20there%20i%27m%20interested%20in%20${
              //   window.config["site-url"]
              // }/product/${product_id}`}
            >
              <div className=" flex justify-around items-center bg-dgreen w-8/12 py-2 px-4 text-white rounded-md">
                <BsWhatsapp className="w-5 h-5" />
                <p className="text-md ml-4">Whatsapp Support</p>
              </div>
            </a>
          </div>

          <div
            ref={lastElementRef}
            className="border-t-8 border-dinputBorder bg-dinputBorder"
            onScroll={() => setScroll(!scroll && true)}
          ></div>
          <div className="w-full bg-white">
            <div className="my-1 bg-white mb-4 container px-6 my-content">
              <div className="flex border-b border-dinputBorder space-x-10 px-6">
                <p
                  onClick={() => setShowReview(false)}
                  className={`${
                    !showReview &&
                    "border-b-4 border-dblue scale-110 transform ease-in-out duration-300"
                  }  font-semibold text-xl text-dblack cursor-pointer py-4`}
                >
                  Product Description
                </p>
              </div>
              <div
                id="desc"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHTML(data.description),
                }}
              />{" "}
            </div>
          </div>
          <ProductPart2
            titleRef={titleRef}
            loader={loader}
            productData2={productData2}
            data={data}
            reviews={reviews}
            host={host}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductPage;

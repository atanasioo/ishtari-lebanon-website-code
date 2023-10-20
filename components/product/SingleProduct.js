import Image from "next/legacy/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlinePlus, AiFillStar } from "react-icons/ai";
import { MdAddShoppingCart } from "react-icons/md";
import { sanitizeHTML } from "../Utils";
import { useContext, useState } from "react";
import useDeviceSize from "../useDeviceSize";
import ImageFilter from "react-image-filter/lib/ImageFilter";
import { AccountContext } from "@/contexts/AccountContext";
import NewImage from "./NewImage";
import Slider from "./Slider";
import { useMarketingData } from "@/contexts/MarketingContext";
import TimerSingleProduct from "./TimerSingleProduct";
import { IoIosUnlock } from "react-icons/io";
import { axiosServer } from "@/axiosServer";
import { CartContext } from "@/contexts/CartContext";
import Cookies from "js-cookie";
import CartSideModal from "./CartSideModal";
import buildLink from "@/urls";
import { useRef, useEffect } from "react";
function SingleProduct(props) {
  const { item, addToCart, topSelling, carousel, noAddCart } = props;
  const [state] = useContext(AccountContext);
  const [copied, setCopied] = useState(false);
  const [bannerStyles, setBannerStyles] = useState({});
  const router = useRouter();
  const path = "";
  const [cart, dispatch] = useContext(CartContext);
  const [width] = useDeviceSize();
  const { setMarketingData } = useMarketingData();
  const [cartData, setCartData] = useState();
  const date1 = new Date(props.coming_soon_date); // Assuming 'YYYY-MM-DD' format
  const date2 = new Date();
  const [successAdded, setSuccessAdded] = useState(false);
  const [toggleQty, setToggleQty] = useState(false);

  function getProductQuantity(productId) {
    const product = cart?.products?.find(
      (item) => item.product_id === productId
    );
    return product ? product.quantity : null;
  }
  const source_type =
    router.asPath === "/"
      ? "home"
      : router.asPath.startsWith("/category") || router.asPath.includes("c=")
      ? "category"
      : router.asPath.startsWith("/seller") || router.asPath.includes("s=")
      ? "seller"
      : router.asPath.startsWith("/manufacturer") ||
        router.asPath.includes("m=")
      ? "manufacturer"
      : router.asPath.startsWith("/latest")
      ? "new_arrival"
      : router.asPath.startsWith("/account/buyagain")
      ? "buyAgain"
      : router.asPath.startsWith("/account/recentlyViewed")
      ? "recentlyViewed"
      : topSelling
      ? "topSelling"
      : "";

  const source_type_id =
    Object.keys(router.query).length > 0
      ? router.query?.slug &&
        (router.query?.slug[0]?.includes("p=") ||
          router.query?.slug[0]?.includes("s=") ||
          router.query?.slug[0]?.includes("m=") ||
          router.query?.slug[0]?.includes("c="))
        ? router.query?.slug[0]?.split("=")[1]
        : router?.query?.slug && router?.query?.slug[0]
      : "";

  const fromSearch = router.asPath.startsWith("/search");

  const linkQuery = fromSearch ? { fromSearch: 1 } : {};

  function toggleSucccessAdded(bool) {
    setSuccessAdded(bool);
  }

  const handleLinkClick = () => {
    //for marketing
    setMarketingData({
      ignore: false,
      banner_image_id: "",
      source_type: source_type,
      source_type_id: source_type_id,
    });
  };

  function copyContent(e, sku) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    const el = document.createElement("input");
    el.value = sku;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }
  const [hoveredIndex, setHoveredIndex] = useState(null);

  function addProductToCart(e, product_id, name) {
    if (props?.item?.check_if_has_options) {
      router.push(
        `${path}/${name
          .replaceAll(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
          .replaceAll("%", "")
          .replaceAll(/\s+/g, "-")
          .replaceAll("..", "")
          .replaceAll("/", "-")
          .replaceAll("---", "-")
          .replaceAll("--", "-")
          .replaceAll("100%", "")
          .replaceAll("#", "")
          .replaceAll("/", "")}/p=${product_id}`
      );
    }
    var quantity = 1;
    e.preventDefault();
    let obj = {
      product_id,
      quantity,
    };

    let error = "";
    axiosServer
      .post(
        buildLink(
          "cart",
          undefined,
          window.innerWidth,
          window.config["site-url"]
        ) + "&source_id=1",
        obj
      )
      .then((response) => {
        const data = response.data;
        if (data.success !== true) {
          // There is an error
          // setHasAddToCartError(true);
          // if (!hasOption) {
          //   error = data?.errors[0]?.errorMsg;
          // } else {
          //   error = data?.errors[0]?.errorMsg;
          // }
          // alert(error)
          // setAddToCartError(error);
          // setAddingToCart(false);
          // setCartData(data.data)
        } else {
          dispatch({
            type: "loading",
            payload: true,
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
                type: "setAsidecart",
                payload: true,
              });

              dispatch({
                type: "setProduct",
                payload: {
                  name: data?.data?.product.name,
                  image: props?.item?.thumb,
                },
              });
              dispatch({
                type: "loading",
                payload: false,
              });
            });
          setCartData(data.data);
          // setSuccessAdded(true)

          if (data) {
            const data = response?.data?.data?.social_data;

            // ReactPixel.fbq(
            //   "track",
            //   "AddToCart",
            //   {
            //     content_type: "product",
            //     content_ids: data?.content_ids,
            //     content_name: data?.name,
            //     value: data?.value,
            //     content_category: data?.breadcrumbs?.category[0]?.name,
            //     currency: data?.currency,
            //     fbp: Cookies.get("_fbp"),
            //   },
            //   { eventID: data?.event_id }
            // );
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
        }
      });
  }

  // const wrapperRef = useRef(null);
  // useOutsideAlerter(wrapperRef);

  // function useOutsideAlerter(ref) {
  useEffect(() => {
    // if (toggleQty) {
    function handleClickOutside(event) {
      if (cart.aside) {
        setTimeout(
          () =>
            dispatch({
              type: "setAsidecart",
              payload: false,
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
    // }
  }, [cart]);
  // }

  // useEffect(() => {
  //   const sliderRef = sliderRef?.current;
  //   if (sliderRef) {
  //     if (hoveredIndex !== null) {
  //       sliderRef.slickPause();
  //     } else {
  //       sliderRef.slickPlay();
  //     }
  //   }
  // }, [hoveredIndex]);

  // banner event possible styles:
  // style1: (image)
  // style2: (image& timer)
  // style3: (background and timer)

  useEffect(() => {
    const banner_event_styles = {
      backgroundColor:
        props.item.bannerevent?.background_color !== ""
          ? props.item.bannerevent?.background_color
          : "",
      textAlign:
        props.item.bannerevent?.title_display !== "none"
          ? props.item.bannerevent?.title_display
          : "left",
      color:
        props.item.bannerevent?.font_color !== ""
          ? props.item.bannerevent?.font_color
          : "",
      fontSize:
        props.item.bannerevent?.font_size !== ""
          ? props.item.bannerevent?.font_size + "px"
          : "14px",
    };
    setBannerStyles(banner_event_styles);
  }, [item]);

  return (
    <>
      {/* { cartData &&  <CartSideModal
           successAdded={successAdded}
           data={cartData?.product}
           image ={props?.item?.thumb} 
           toggleSucccessAdded={toggleSucccessAdded}
          // hasBannerEvent={hasBannerEvent}
        />} */}
      <Link
        onClick={handleLinkClick}
        href={{
          pathname: `${path}/${item.name
            .replaceAll(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
            .replaceAll("%", "")
            .replaceAll(/\s+/g, "-")
            .replaceAll("..", "")
            .replaceAll("/", "-")
            .replaceAll("---", "-")
            .replaceAll("--", "-")
            .replaceAll("100%", "")
            .replaceAll("#", "")
            .replaceAll("/", "")}/p=${props.item.product_id}`,
          query: linkQuery,
        }}
        onClickCapture={props.click}
        className={` cursor-pointer   ${props.isList && "mb-3"}  `}
      >
        <div className={`relative ${props?.coming_soon_date && ""}`}>
          {props?.item?.coming_soon_date && (
            <div className="absolute z-10 flex justify-center items-center w-full h-full bg-dTransparentWhite2">
              <div className="absolute z-10 rounded-full text-white w-auto top-3 px-3 py-1 bg-dblack pr-bold">
                Coming Soon
              </div>

              <div className="flex flex-col justify-center items-center border-4 rounded-full border-dblack w-44 h-44 ">
                <div
                  className="rounded-full w-10 h-10 mb-2 flex justify-center items-center"
                  style={{ backgroundColor: "#ff00002b" }}
                >
                  <IoIosUnlock className=" text-dbase text-2xl mb-2 pr-bold" />
                </div>

                <div className="flex h-8 mb-2 justify-center items-center px-5">
                  <img
                    width={200}
                    height={100}
                    src={"/images/ezgif.com-crop.gif"}
                    className="w-8  "
                    alt={"market image"}
                  />
                  <div className="px-2">
                    <TimerSingleProduct data={props?.item?.coming_soon_date} />
                  </div>
                </div>

                <p className="text-d22 pr-semibold">
                  {item.special !== "0" &&
                  item.special !== "" &&
                  item.special !== false
                    ? item.special
                    : item.price}
                </p>
                <span className="text-d16 line-through  pr-light">
                  {item.price}
                </span>
              </div>
            </div>
          )}
          {props.item.new && <NewImage className="w-10 bg-dpinterest" />}
          <div
            className={`flex flex-col h-full ${
              props.scroll && "w-150px"
            } md:w-unset bg-white text-dblack p-2.5 relative ${
              props.isList ? "p-4 relative" : "pb-2"
            }`}
            style={{ height: props.isList ? "260px" : "unset" }}
          >
            <div
              className={`flex ${
                props.isList ? "flex-row gap-4" : "flex-col"
              } h-full `}
            >
              <div
                className={`product-image h-full relative ${
                  !props.isList && "-mt-1.5 -mx-1.5"
                } `}
              >
                <div
                  className={` relative ${
                    props.isList &&
                    "flex-shrink-0 flex-grow-0 w-40 -my-4 -ml-4 mr-4"
                  }`}
                  // onMouseEnter={handleMouseEnter}
                  // onMouseLeave={handleMouseLeave}
                >
                  {props.item.quantity === "0" &&
                    !props?.item?.coming_soon_date && (
                      <div
                        className={
                          width > 650
                            ? "absolute z-40 text-dbase w-full text-center  bottom-0"
                            : "absolute z-40 text-dbase w-full text-center bottom-00"
                        }
                      >
                        Out Of Stock
                      </div>
                    )}
                  {props.item.quantity === "0" &&
                  !props?.item?.coming_soon_date ? (
                    <ImageFilter
                      image={props.item.thumb}
                      filter={"duotone"} // see docs beneath
                      colorOne={[96, 96, 96]}
                      colorTwo={[255, 255, 255]}
                      style={{ height: !topSelling ? "243px" : "150px" }}
                    />
                  ) : !props?.isSlider ||
                    item?.images?.length === 0 ||
                    !item?.images ? (
                    <Image
                      alt={item.name}
                      src={item.thumb}
                      width={!topSelling ? 194 : 100}
                      height={!topSelling ? 267 : 150}
                      // className="max-w-full max-h-full"

                      style={{
                        backgroundImage: `url(${"/images/product_placeholder.png"})`,
                        height: "auto", // Set the desired height
                        width: "100%", // Set the desired width
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                      }}
                    />
                  ) : (
                    <div>
                      <Slider
                        images={props?.item?.images?.slice(0, 2)}
                        autoplay={true}
                        primary={item?.thumb}
                      />
                      {props?.item?.option_color_count &&
                      props?.item?.option_color_count > 1 ? (
                        <div className="flex items-center flex-col ">
                          <div
                            className="text-d12 absolute bottom-0 z-10 font-semibold mb-2 px-3 overflow-hidden whitespace-nowrap overflow-ellipsis w-auto bg-dprimarybg"
                            style={{
                              borderRadius: "30px",
                              // background: "rgb(239, 243, 253)",
                              border: "1px solid rgba(255, 255, 255, 0.7)",
                              maxWidth: width > 650 ? "45%" : "55%",
                              paddingTop: "0.5px",
                              paddingBottom: "0.5px",
                            }}
                          >
                            {props?.item?.option_color_count} Colours
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  )}

                  {props.item?.bannerevent &&
                    Object.keys(props.item.bannerevent).length > 0 && (
                      <div className="w-full absolute bottom-0 z-10 mb-2.5">
                        <div style={bannerStyles} className={`relative `}>
                          {props.item.bannerevent.style === "1" ? ( //image
                            <div className="relative link-span">
                              <Image
                                width={192}
                                height={30}
                                src={props.item.bannerevent?.thumb}
                                className="w-full h-auto"
                              />
                            </div>
                          ) : props.item.bannerevent.style === "2" ? ( //image & timer
                            <div className="relative link-span">
                              <Image
                                width={192}
                                height={30}
                                src={props.item.bannerevent?.thumb}
                                className="w-full h-auto"
                              />
                              {props.item.bannerevent.datediff > 0 && (
                                <div
                                  className={`absolute  inset-0 flex flex-col justify-center pr-2 ${
                                    props.item.bannerevent?.title_display ===
                                    "left"
                                      ? "items-end"
                                      : props.item.bannerevent
                                          ?.title_display === "right"
                                      ? "items-start"
                                      : "items-end"
                                  }`}
                                >
                                  <TimerSingleProduct
                                    data={props?.item?.bannerevent.end_date}
                                    bannerEvent={true}
                                  />
                                </div>
                              )}
                            </div>
                          ) : (
                            //background & timer
                            <div className="relative py-1 px-1.5 ">
                              {props.item.bannerevent.datediff > 0 && (
                                <div
                                  className={`flex gap-2 items-center text-sm ${
                                    props.item.bannerevent?.title_display ===
                                    "left"
                                      ? "justify-end"
                                      : props.item.bannerevent
                                          ?.title_display === "right"
                                      ? "justify-start"
                                      : "justify-start"
                                  }`}
                                >
                                  <div>Ends in</div>
                                  <TimerSingleProduct
                                    data={props?.item?.bannerevent.end_date}
                                    bannerEvent={true}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
              <div className="product-info pt-3 flex flex-col w-full">
                <div
                  className={`${
                    props.item.quantity === "0" &&
                    !props?.item?.coming_soon_date &&
                    "opacity-40"
                  } ${props.isList && "flex justify-between"}`}
                >
                  <div className="product-name text-d14 font-semibold leading-spn h-9 mb-2 overflow-hidden">
                    <div className="h-12 overflow-hidden">
                      <span
                        className={`text-dblack ${
                          props.isList ? " pr-semibold" : "text-d13 "
                        }  mb-1 h-10 pr-semibold`}
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHTML(props.item.manufacturer_name),
                        }}
                      />
                      {props.isList && <br />}

                      {item?.name?.split(" ")[0] === item.manufacturer_name &&
                      item.manufacturer_name !== undefined ? (
                        <span
                          className={`text-dblack ${
                            props.isList
                              ? "text-base leading-6"
                              : "ml-1 text-d13 md:text-thin font-light"
                          }   mb-1 h-10 `}
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHTML(
                              item?.name?.split(item.manufacturer_name)[1]
                            ),
                          }}
                        />
                      ) : (
                        <span
                          className={`text-dblack ${
                            props.isList
                              ? "text-base leading-6"
                              : "ml-1 text-d13 md:text-thin font-light"
                          }   mb-1 h-10 `}
                          dangerouslySetInnerHTML={{
                            __html: props.isList ? item.full_name : item.name,
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="">
                    <div className="w-full flex justify-between">
                      <strong className="pr-bold text-d18">
                        {item.special !== "0" &&
                        item.special !== "" &&
                        item.special !== false
                          ? item.special
                          : item.price}
                      </strong>
                      {(item?.check_if_has_options === false ||
                        item?.check_if_has_options === true) && (
                        <div
                          className="relative shadow shadow-dgrey1  z-20 rounded-full px-2  text-d18 pr-light py-1"
                          onClick={(e) =>
                            addProductToCart(e, item?.product_id, item.name)
                          }
                        >
                          {getProductQuantity(item?.product_id) > 0 && (
                            <div className="w-4 h-4  bg-dbase1 flex text-white items-center justify-center rounded-full text-xs absolute right-1 mobile:-right-1.5 -top-1.5 mobile:-top-2.6 border border-white -mr-2 mobile:mr-1">
                              {getProductQuantity(item?.product_id)}
                            </div>
                          )}
                          <MdAddShoppingCart />
                        </div>
                      )}
                    </div>

                    <div
                      className={`mt-0.5 text-d12 flex items-center ${
                        (item.special === "0" ||
                          item.special === "" ||
                          item.special === false) &&
                        "invisible"
                      } ${props.isList && "m-px"}`}
                    >
                      <div
                        className={`oldPrice text-d13 line-through text-dgreyProduct mr-1.5 font-normal`}
                      >
                        {item.price}
                      </div>
                      <div className="discount text-dgreen pr-bold whitespace-nowrap">
                        {item.saving + "% OFF"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* PRODUCT DESCRIPTION LIST */}
                {props.isList && props.item.description && (
                  <div className="mt-2 overflow-ellipsis overflow-hidden w-full h-28 text-d12 text-dlabelColor">
                    {" "}
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          sanitizeHTML(props.item.description.slice(0, 500)) +
                          "...",
                      }}
                    ></div>
                  </div>
                )}

                <div className={`flex pt-2 ${topSelling ? "hidden" : ""}`}>
                  <div
                    className="mt-3 flex flex-row justify-between w-full"
                    style={{ minHeight: "16px" }}
                  >
                    <div className="express w-6/12 -mt-1">
                      {props.item.market === "0" ? (
                        <img
                          width={64}
                          height={24}
                          src={"/images/express.png"}
                          className="h-6 w-16 py-1 mobile:py-0 lg:py-1"
                          alt="Express delivery"
                        />
                      ) : (
                        <img
                          width={64}
                          height={24}
                          src={"/images/market.svg"}
                          className="h-6 w-16 py-1 mobile:py-0 lg:py-1 "
                          alt={"market image"}
                        />
                      )}
                    </div>
                    {item?.nb_of_reviews > 0 && (
                      <div className=" flex  justify-center items-center">
                        <div
                          className="flex justify-center items-center rounded-full  place-content-end h-4  align-bottom pl-1 px-0.5 space-x-0.5"
                          style={{
                            backgroundColor:
                              item?.rating >= 4.5
                                ? "rgb(0,158,0)"
                                : item?.rating < 4.5 && item?.rating >= 4
                                ? "rgb(110, 159, 0)"
                                : item?.rating < 4 && item?.rating >= 3.5
                                ? "rgb(243, 153, 22)"
                                : "rgb(246,90,31)",
                          }}
                        >
                          <div
                            className="text-d12 font-bold text-white"
                            style={{ paddingTop: "0.5px" }}
                          >
                            {item?.rating || "0.0"}
                          </div>
                          <AiFillStar
                            className=" text-white text-bold text-d11"
                            // emptyColor="#FFFFFF"
                          />{" "}
                        </div>
                        <div className="font-light text-d11 pl-0.5">
                          ({" "}
                          {props?.item?.reviews?.length < 1 &&
                          props?.item?.reviews?.length === ""
                            ? "0"
                            : item?.nb_of_reviews}{" "}
                          )
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {addToCart && (
                  <div className="flex flex-col justify-between gap-3 mt-3">
                    {/* <div className="min-w-full bg-dgreyZoom mt-3" style={{height: "1px"}}></div> */}
                    <div className="w-full flex justify-center items-center text-dblue h-6 border border-dblue py-4 rounded-full">
                      Add To Cart
                      <AiOutlinePlus className="ml-5" />
                    </div>
                  </div>
                )}
                <div
                  className={`relative flex mt-2.5 text-d12 ${
                    addToCart ? "hidden" : ""
                  }`}
                ></div>
                {state.admin && (
                  <div className="my-1 px-1 flex justify-between z-10">
                    {/* <button className=" text-dgrey1">Add To Cart</button> */}
                    <span
                      className={`p-1  ${copied ? "text-dgreen" : ""}`}
                      onClick={(e) => copyContent(e, props.item.sku)}
                    >
                      {" "}
                      {!copied ? props.item.sku : "Copied!"}
                    </span>
                    <span className="bg-dgrey1 bg-opacity-25 p-1 rounded">
                      {props.item.quantity}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

export default SingleProduct;

import Image from "next/legacy/image";
import Link from "next/link";
import { HiStar } from "react-icons/hi";
import { useRouter } from "next/router";
import { AiOutlinePlus } from "react-icons/ai";
import { sanitizeHTML } from "../Utils";
import dynamic from "next/dynamic";
import { useContext, useRef, useState } from "react";
import useDeviceSize from "../useDeviceSize";
import ImageFilter from "react-image-filter/lib/ImageFilter";
import { AccountContext } from "@/contexts/AccountContext";
import { CartContext } from "@/contexts/CartContext";
import { MdAddShoppingCart } from "react-icons/md";
import { axiosServer } from "@/axiosServer";
import buildLink from "@/urls";
import { useEffect } from "react";
import Cookies from "js-cookie";

function SingleProductTest(props) {
  const { item, host, addToCart } = props;
  const [state] = useContext(AccountContext);
  const [cart, dispatch] = useContext(CartContext);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const [cartData, setCartData] = useState();
  const [loading, setLoading] = useState(false);


  const path = "";
  //   const swiperRef = useRef(null);
  //   const onInit = (Swiper) => {
  //     swiperRef.current = Swiper;
  //   };
  const [width] = useDeviceSize();

  const NewImage = dynamic(() => import("./NewImage"), {
    ssr: false // Disable server-side rendering
  });

  useEffect(() => {
    // if (toggleQty) {
    function handleClickOutside(event) {
      if (cart.aside) {
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
    // }
  }, [cart]);
  function getProductQuantity(productId) {
    const product = cart?.products?.find(
      (item) => item.product_id === productId
    );
    return product ? product.quantity : null;
  }
  function addProductToCart(e, product_id, name) {
    setLoading(product_id)
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
      quantity
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
                type: "setAsidecart",
                payload: true
              });

              dispatch({
                type: "setProduct",
                payload: {
                  name: data?.data?.product.name,
                  image: props?.item?.thumb
                }
              });
              dispatch({
                type: "loading",
                payload: false
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
setLoading(false)
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

  //   const handleMouseEnter = () => {
  //     if (swiperRef.current !== null) {
  //       swiperRef?.current?.autoplay?.start();
  //       if(swiperRef.current.params !== null && swiperRef.current.params !== undefined){
  //         swiperRef.current.params.autoplay.delay = 1000;
  //       }

  //     }
  //   };

  //   const handleMouseLeave = () => {
  //     if (swiperRef.current !== null && swiperRef.current.autoplay !== undefined) {
  //       swiperRef.current.autoplay.stop();
  //       swiperRef.current.slideTo(1);
  //     }
  //   };

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
  const mobileViews = [
    "web_mobile",
    "seller_mobile",
    "category_mobile",
    "manufacturer_mobile"
  ];

  return (
    <Link
      href={`${path}/${item.name
        .replaceAll(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
        .replaceAll("%", parseInt(""))
        .replaceAll(/\s+/g, "-")
        .replaceAll("..", "")
        .replaceAll("/", "-")
        .replaceAll("---", "-")
        .replaceAll("--", "-")
        .replaceAll("100%", "")
        .replaceAll("#", "")
        .replaceAll("/", "")}/p=${props.item.product_id}`}
      onClickCapture={props?.click}
      className={` cursor-pointer block w-full  ${props.isList && "mb-3"}`}
    >
      {props.item.new && <NewImage />}
      <div
        // className={`flex flex-col h-full ${props.scroll && "w-150px"} ${!mobileViews.includes(router.query.view) && "w-unset"}  bg-white text-dblack p-2.5 relative ${
        //   props.isList ? "p-4 relative" : "pb-2"
        // }`}
        className={`flex flex-col h-full ${
          props.scroll && "w-150px"
        } md:w-unset bg-white text-dblack p-2.5 relative ${
          props.isList ? "p-4 relative" : "pb-2"
        }`}
        style={{ height: props.isList && "260px" }}
      >
        <div
          className={`flex ${
            props.isList ? "flex-row gap-4" : "flex-col"
          } h-full `}
        >
          <div
            className={`product-image relative ${
              !props.isList && "-mt-1.5 -mx-1.5"
            } `}
          >
            <div
              className={` relative ${
                props.isList && "flex-shrink-0 flex-grow-0 w-40  -ml-4 mr-4 "
              }`}
              //   onMouseEnter={handleMouseEnter}
              //   onMouseLeave={handleMouseLeave}
            >
              {props.item.quantity === "0" && (
                <div
                  className={
                    width > 650
                      ? "absolute z-10 text-dbase w-full text-center  bottom-0"
                      : "absolute z-10 text-dbase  w-full text-center  bottom-0 "
                  }
                >
                  Out Of Stock 
                </div>
              )}
              {props.item.quantity === "0" ? (
                <ImageFilter
                  image={props.item.thumb}
                  filter={"duotone"} // see docs beneath
                  colorOne={[96, 96, 96]}
                  colorTwo={[255, 255, 255]}
                />
              ) : !props?.isSlider ||
                item?.images?.length === 0 ||
                !item?.images ? (
                <div>
                  <Image
                    alt={item.name}
                    src={item.thumb}
                    width={194}
                    height={267}
                    style={{
                      backgroundImage: `url(${"/images/product_placeholder.png"})`,
                      height: "auto", // Set the desired height
                      width: "100%", // Set the desired width
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center"
                    }}
                    className="min-w-full max-h-full"
                  />
                </div>
              ) : (
                // <div></div>
                <></>
              )}
            </div>
          </div>
          <div className="product-info pt-3 flex flex-col w-full">
            <div
              className={`${props.item.quantity === "0" && "opacity-40"} ${
                props.isList && "flex justify-between"
              }`}
            >
              <div className="product-name text-d14 font-semibold leading-spn h-9 mb-2 overflow-hidden">
                <div className="h-12 overflow-hidden">
                  <span
                    className={`text-dblack ${
                      props.isList ? " pr-semibold" : "text-d13 "
                    }  mb-1 h-10 pr-semibold`}
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML(props.item.manufacturer_name)
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
                        )
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
                        __html: props.isList ? item.full_name : item.name
                      }}
                    />
                  )}
                </div>
                {/* <span>{item.name}</span> */}
              </div>
              <div className="">
                <div className="flex justify-between">
                  <div>
                    <strong className="pr-bold text-d18">
                      {item.special !== "0" &&
                      item.special !== "" &&
                      item.special !== false
                        ? item.special
                        : item.price}
                    </strong>
                  </div>
                  {(item?.check_if_has_options === false ||
                    item?.check_if_has_options === true) && (
                    <>
                      {loading === item.product_id ? (
                        <div className="relative   z-30 flex items-center justify-center mr-2">
                          <div className="animate-ping h-1 w-1.5 bg-dblue rounded-full absolute"></div>
                          <div className="animate-ping h-1.5 w-2 bg-dblue2 rounded-full absolute opacity-50 "></div>
                          <div className="animate-ping h-2 w-2.5 bg-dblue1 rounded-full absolute  "></div>
                          <div className="animate-ping  h-2.5 w-3 bg-dblue2 rounded-full absolute"></div>
                          <div className="animate-ping  h-3.5 w-5 bg-dblue rounded-full absolute"></div>

                        </div>
                      ) : (
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
                  </>
                  )}
                </div>
                <div
                  className={`mt-0.5 text-d12 flex items-center ${
                    !item.special && "invisible"
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
                      sanitizeHTML(props.item.description.slice(0, 500)) + "..."
                  }}
                ></div>
              </div>
            )}

            <div className="flex pt-2">
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
                      className="h-6 w-16 py-1"
                      alt="Express delivery"
                    />
                  ) : (
                    <img
                      width={64}
                      height={24}
                      src={"/images/market.svg"}
                      className="h-6 w-16 py-1 "
                      alt={"market image"}
                    />
                  )}
                </div>
                {item?.nb_of_reviews > 0 && (
                  <div className=" flex ">
                    <div
                      className="flex rounded-full  place-content-end h-4  align-bottom pl-1"
                      style={{
                        backgroundColor:
                          item?.rating >= 4.5
                            ? "rgb(0,158,0)"
                            : item?.rating < 4.5 && item?.rating >= 4
                            ? "rgb(110, 159, 0)"
                            : item?.rating < 4 && item?.rating >= 3.5
                            ? "rgb(243, 153, 22)"
                            : "rgb(246,90,31)"
                      }}
                    >
                      <div
                        className="text-d11 font-bold text-white"
                        style={{ paddingTop: "0.5px" }}
                      >
                        {item?.rating || "0.0"}
                      </div>
                      <HiStar
                        className="pt-1 text-white text-bold text-d12"
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
                  Add To Basket
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
    </Link>
  );
}

export default SingleProductTest;

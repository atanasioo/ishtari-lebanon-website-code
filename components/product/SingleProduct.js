import Image from "next/legacy/image";
import Link from "next/link";
import { HiStar } from "react-icons/hi";
import { useRouter } from "next/router";
import { AiOutlinePlus } from "react-icons/ai";
import { sanitizeHTML } from "../Utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { useContext, useRef, useState, useEffect } from "react";
import useDeviceSize from "../useDeviceSize";
// import "swiper/modules/pagination/pagination.min.css";
// import "swiper/modules/navigation/navigation.min.css";
import { Pagination, Autoplay } from "swiper";
import ImageFilter from "react-image-filter/lib/ImageFilter";
import { AccountContext } from "@/contexts/AccountContext";
import NewImage from "./NewImage";
import Slider from "./Slider";
import { useMarketingData } from "@/contexts/MarketingContext";

function SingleProduct(props) {
  const { item, host, addToCart, topSelling } = props;
  const [state] = useContext(AccountContext);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const path = "";
  const swiperRef = useRef(null);
  const onInit = (Swiper) => {
    swiperRef.current = Swiper;
  };
  const [width] = useDeviceSize();
  const { setMarketingData } = useMarketingData();

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
      : "";

  const source_type_id =
    Object.keys(router.query).length > 0
      ? router.query?.slug &&( router.query?.slug[0]?.includes("p=") ||
        router.query?.slug[0]?.includes("s=") ||
        router.query?.slug[0]?.includes("m=") ||
        router.query?.slug[0]?.includes("c="))
        ? router.query?.slug[0]?.split("=")[1]
        : router?.query?.slug && router?.query?.slug[0]
      : "";

  const handleLinkClick = () => {
    //for marketing
    setMarketingData({
      ignore: false,
      banner_image_id: "",
      source_type: source_type,
      source_type_id: source_type_id,
    });
  };

  // const NewImage = dynamic(() => import("./NewImage"), {
  //   ssr: false, // Disable server-side rendering
  // });

  const handleMouseEnter = () => {
    if (swiperRef.current !== null) {
      swiperRef?.current?.autoplay?.start();
      if (
        swiperRef.current.params !== null &&
        swiperRef.current.params !== undefined
      ) {
        swiperRef.current.params.autoplay.delay = 1000;
      }
    }
  };

  const handleMouseLeave = () => {
    if (
      swiperRef.current !== null &&
      swiperRef.current.autoplay !== undefined
    ) {
      swiperRef.current.autoplay.stop();
      swiperRef.current.slideTo(1);
    }
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

  const images = [
    "image-url-1.jpg",
    "image-url-2.jpg",
    "image-url-3.jpg",
    // Add more image URLs here
  ];

  const handleImageHover = (index) => {
    setHoveredIndex(index);
  };

  useEffect(() => {
    const sliderRef = sliderRef?.current;
    if (sliderRef) {
      if (hoveredIndex !== null) {
        sliderRef.slickPause();
      } else {
        sliderRef.slickPlay();
      }
    }
  }, [hoveredIndex]);

  return (
    <Link
      onClick={handleLinkClick}
      href={`${path}/${item.name
        .replaceAll(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
        .replaceAll("%", "")
        .replaceAll(/\s+/g, "-")
        .replaceAll("..", "")
        .replaceAll("/", "-")
        .replaceAll("---", "-")
        .replaceAll("--", "-")
        .replaceAll("100%", "")
        .replaceAll("#", "")
        .replaceAll("/", "")}/p=${props.item.product_id}`}
   
      onClickCapture={props.click}
 
      className={` cursor-pointer   ${props.isList && "mb-3"}`}
    >
      {props.item.new && <NewImage />}
      <div
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
            className={`product-image h-full relative ${
              !props.isList && "-mt-1.5 -mx-1.5"
            } `}
          >
            <div
              className={` relative ${
                props.isList &&
                "flex-shrink-0 flex-grow-0 w-40 -my-4 -ml-4 mr-4"
              }`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {props.item.quantity === "0" && (
                <div
                  className={
                    width > 650
                      ? "absolute z-20 text-dbase w-full text-center  bottom-0"
                      : "absolute z-20 text-dbase  w-full text-center  bottom-0 "
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
                  style={{height: !topSelling ? "246.4px" : "200px"}}
                />
              ) : !props?.isSlider ||
                item?.images?.length === 0 ||
                !item?.images ? (
                <Image
                  alt={item.name}
                  src={item.thumb}
                  width={!topSelling ? 200 : 150}
                  height={!topSelling ? 300 : 200}
                  // priority={true}
                  className="max-w-full max-h-full"
                />
              ) : (
               
                <div>
                  <Slider
                    images={props?.item?.images?.slice(0, 2)}
                    autoplay={true}
                    primary={item?.popup}
                  />
                  {props?.item?.option_color_count &&
                  props?.item?.option_color_count > 1 ? (
                    <div className="flex items-center flex-col ">
                      <div
                        className="text-d12 absolute bottom-0 z-30 font-semibold mb-2 px-3 overflow-hidden whitespace-nowrap overflow-ellipsis w-auto bg-dprimarybg"
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
                {/* <span>{item.name}</span> */}
              </div>
              <div className="">
                <div>
                  <strong className="pr-bold text-d18">
                    {item.special !== "0" &&
                    item.special !== "" &&
                    item.special !== false
                      ? item.special
                      : item.price}
                  </strong>
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
                    <Image
                      width={64}
                      height={24}
                      src={"/images/express.png"}
                      className="h-6 w-16 py-1 mobile:py-0 lg:py-1"
                      alt="Express delivery"
                      priority={true}
                    />
                  ) : (
                    <Image
                      width={64}
                      height={24}
                      src={"/images/market.svg"}
                      className="h-6 w-16 py-1 mobile:py-0 lg:py-1 "
                      alt={"market image"}
                      priority={true}
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
                            : "rgb(246,90,31)",
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
    </Link>
  );
}

export default SingleProduct;

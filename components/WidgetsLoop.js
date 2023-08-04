import SingleProduct from "./product/SingleProduct.js";
import Slider from "react-slick";
import Image from "next/legacy/image";
import { useRef, useState, useCallback, useEffect, useContext } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/swiper-bundle.min.css";
// import "swiper/swiper.min.css";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
// import { SliderPlaceholder } from "/images/placeholder_slideshow.png";
// import { ProductPlaceholder } from "/images/product_placeholder_square.png";

import { Pagination, Navigation, Autoplay } from "swiper";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import ImageClient from "./imageClient";
import Link from "next/link";
import dynamic from "next/dynamic";
import useDeviceSize from "./useDeviceSize.js";
import SingleProductTest from "./product/SingleProductTest.js";
import { useRouter } from "next/router.js";
import { useMarketingData } from "@/contexts/MarketingContext.js";
import { HostContext } from "@/contexts/HostContext.js";

function WidgetsLoop({ widget, likedData, initialLoading }) {
  const ImageClient = dynamic(() => import("./ImageClient.js"), { ssr: false });

  const [showNext, setShowNext] = useState(false);
  const [showPrev, setShowPrev] = useState(false);
  const swiperNavNextRef = useRef(null);
  const swiperNavPrevRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [width] = useDeviceSize();
  const router = useRouter();
  const { setMarketingData } = useMarketingData();
  const host = useContext(HostContext);
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
      : "home";

  const source_type_id =
    Object.keys(router.query).length > 0
      ? router.query.slug[0].includes("p=") ||
        router.query.slug[0].includes("s=") ||
        router.query.slug[0].includes("m=") ||
        router.query.slug[0].includes("c=")
        ? router.query.slug[0].split("=")[1]
        : router.query.slug[0]
      : "";

  const types = {
    1: "product",
    2: "category",
    3: "manufacturer",
    4: "seller",
  };

  const handleLinkClick = (banner_image_id) => {
    //for marketing
    setMarketingData({
      ignore: false,
      banner_image_id: banner_image_id,
      source_type: source_type,
      source_type_id: source_type_id,
    });
  };

  const handleMouseEnter = () => {
    setShowNext(true);
  };

  const handleMouseLeave = () => {
    setShowNext(false);
  };

  const handleMouseEnterPrev = () => {
    setShowPrev(true);
  };

  const handleMouseLeavePrev = () => {
    setShowPrev(false);
  };

  const handleBeforeChange = useCallback(() => {
    setDragging(true);
    setTimeout(() => {
      setDragging(false);
    }, 200);
  }, [setDragging]);

  const handleAfterChange = useCallback(() => {
    setDragging(false);
  }, [setDragging]);

  const handleOnItemClick = useCallback(
    (e) => {
      console.log(dragging);
      if (dragging) {
        // e.stopPropagation()
        e.preventDefault();
      }
    },
    [dragging]
  );

  const settingM = {
    dots: true,
    speed: 1000,
    slidesToShow: 1,
    swipeToSlide: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    lazyLoad: true,
  };
  const settingSliderD = {
    dots: true,
    speed: 1000,
    slidesToShow: 1,
    swipeToSlide: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    prevArrow: <CustomSliderPrevArrows />,
    nextArrow: <CustomSliderNextArrows />,
    lazyLoad: true,
  };
  const productMobile = {
    dots: false,
    speed: 1000,
    slidesToShow:
      widget?.type === "banner"
        ? widget?.display === "carousel"
          ? 2.5
          : widget.column_number - 0.5
        : 2.5,
    swipeToSlide: false,
    slidesToScroll: 1,
    infinite: false,
    arrows: false,
    lazyLoad: true,
  };
  const productSetting = {
    speed: 200,
    slidesToShow: widget?.items?.length < 7 ? widget?.items?.length : 7,
    slidesToScroll: 7,
    infinite: true,
    prevArrow: <CustomPrevArrows direction={"l"} />,
    nextArrow: <CustomNextArrows direction={"r"} />,
  };

  function CustomSliderPrevArrows({ direction, onClick, style, className }) {
    return (
      <div
        className="swiper-button-next"
        ref={swiperNavPrevRef}
        onClick={onClick}
        onMouseEnter={handleMouseEnterPrev}
        onMouseLeave={handleMouseLeavePrev}
      >
        <svg
          width="44"
          height="502"
          viewBox="0 0 44 502"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`heEmBF 
          ${
            showPrev
              ? "activeTransform"
              : `${
                  showPrev && widget.banner_height < 400
                    ? "activeTransformSmaller"
                    : ""
                }`
          }
          `}
        >
          <path
            className={`wave ${showPrev ? "activeFill" : ""}`}
            d="M0.999973 501C32.9999 301.5 42.9999 308 42.9999 252.5C42.9999 197 29.4999 189 1.00002 0.999996L0.999973 501Z"
            fill="rgba(255,255,255,.4)"
          ></path>
        </svg>
        <div
          className={`swiper-button-circle-left ${
            showPrev ? "active-circle-left" : ""
          }`}
        >
          <svg
            width={`${showPrev ? "312" : "221"}`}
            height="403"
            viewBox={`${showPrev ? "0 0 312 403" : "0 0 221 403"}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="gHFIbo"
          >
            {!showPrev ? (
              <path
                d="M216 383.885C221.5 389.385 218.5 395.885 216 398.385C213.5 400.885 206.5 404.385 200.5 398.385L0.99997 216.385L200.5 4.38534C205.5 -0.614703 212 0.385379 216 4.38535C220 8.38531 221.5 17.3853 216 22.8853L29 216.385L216 383.885Z"
                fill="black"
                stroke="none"
              ></path>
            ) : (
              <>
                <path
                  d="M307.416 383.885C312.916 389.385 309.916 395.885 307.416 398.385C304.916 400.885 297.915 404.385 291.916 398.385L92.4157 216.385L291.916 4.38534C296.916 -0.614703 303.416 0.385379 307.416 4.38535C311.416 8.38531 312.916 17.3853 307.416 22.8853L120.416 216.385L307.416 383.885z"
                  fill="black"
                ></path>

                <path
                  d="M153.5 319.385C159 324.885 156 331.385 153.5 333.885C151 336.385 144 339.885 138 333.885L0.999986 216.385L143.5 72.8853C148.5 67.8853 155 68.8854 159 72.8853C163 76.8853 164.5 85.8853 159 91.3853L28.9999 216.385L153.5 319.385z"
                  fill="black"
                ></path>
              </>
            )}
          </svg>
        </div>
        <div className="swiper-button-circle-back-left"></div>
      </div>
    );
  }
  function CustomSliderNextArrows({ direction, onClick, style, className }) {
    return (
      <div
        className="swiper-button-prev"
        ref={swiperNavNextRef}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <svg
          width="44"
          height="501"
          viewBox="0 0 44 501"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`sc-fxvKuh izCJif ${
            showNext
              ? "activeTransform"
              : `${
                  showNext && widget.banner_height < 400
                    ? "activeTransformSmaller"
                    : ""
                }`
          }`}
        >
          <path
            className={`wave ${showNext ? "activeFill" : ""}`}
            d="M42.9999 0.5C11 200 1 193.5 1 249C1 304.5 14.5 312.5 42.9999 500.5V0.5Z"
            fill="rgba(255,255,255,.4)"
          ></path>
        </svg>
        <div
          className={`swiper-button-circle-right ${
            showNext ? "active-circle-right" : ""
          }`}
        >
          <svg
            width={`${showNext ? "312" : "220"}`}
            height="403"
            viewBox={`${showNext ? "0 0 312 403" : "0 0 220 403"}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="gHFIbo"
          >
            {!showNext ? (
              <path
                d="M4.08419 18.813C-1.41579 13.313 1.58419 6.81288 4.08419 4.31288C6.58419 1.81289 13.5842 -1.68707 19.5842 4.31291L219.084 186.313L19.5842 398.313C14.5842 403.313 8.08416 402.313 4.08419 398.313C0.0842264 394.313 -1.41584 385.313 4.08419 379.813L191.084 186.313L4.08419 18.813Z"
                fill="black"
                stroke="black"
              ></path>
            ) : (
              <>
                <path
                  d="M4.58444 18.813C-0.91555 13.313 2.08444 6.81288 4.58444 4.31288C7.08444 1.81289 14.0845 -1.68707 20.0845 4.31291L219.584 186.313L20.0845 398.313C15.0844 403.313 8.5844 402.313 4.58444 398.313C0.584471 394.313 -0.915597 385.313 4.58444 379.813L191.584 186.313L4.58444 18.813z"
                  fill="black"
                ></path>
                <path
                  d="M158.5 83.3131C153 77.8131 156 71.313 158.5 68.813C161 66.313 168 62.813 174 68.813L311 186.313L168.5 329.813C163.5 334.813 157 333.813 153 329.813C149 325.813 147.5 316.813 153 311.313L283 186.313L158.5 83.3131Z"
                  fill="black"
                ></path>

                <path
                  d="M4.58444 18.813C-0.91555 13.313 2.08444 6.81288 4.58444 4.31288C7.08444 1.81289 14.0845 -1.68707 20.0845 4.31291L219.584 186.313L20.0845 398.313C15.0844 403.313 8.5844 402.313 4.58444 398.313C0.584471 394.313 -0.915597 385.313 4.58444 379.813L191.584 186.313L4.58444 18.813Z"
                  stroke="black"
                ></path>

                <path
                  d="M158.5 83.3131C153 77.8131 156 71.313 158.5 68.813C161 66.313 168 62.813 174 68.813L311 186.313L168.5 329.813C163.5 334.813 157 333.813 153 329.813C149 325.813 147.5 316.813 153 311.313L283 186.313L158.5 83.3131Z"
                  stroke="black"
                ></path>
              </>
            )}
          </svg>
        </div>
        <div className={`swiper-button-circle-back-right`}></div>
      </div>
    );
  }

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

  return (
    <div
      key={widget?.mobile_widget_id}
      style={{
        backgroundColor:
          widget?.background_color !== "#000000" && widget?.background_color,
        paddingLeft: widget.padding_left !== "-1" && widget.padding_left + "%",
        paddingRight:
          widget.padding_right !== "-1" && widget.padding_right + "%",
        paddingBottom:
          widget.padding_bottom !== "-1" && widget.padding_bottom + "%",
        paddingTop: widget.padding_top !== "-1" && widget.padding_top + "%",
        marginLeft: widget.margin_left !== "-1" ? widget.margin_left + "%" : "",
        marginRight: widget.margin_right !== "-1" && widget.margin_right + "%",
        marginBottom:
          widget.margin_bottom !== "-1" && widget.margin_bottom + "%",
        marginTop: widget.margin_top !== "-1" && widget.margin_top + "%",
      }}
    >
      {/* view all button */}
      {widget?.display === "carousel" && widget?.view_title !== "0" && (
        <div className="flex items-center justify-between  mb-3">
          {widget.view_title !== "0" && (
            <h1
              className="pr-semibold p-2 text-d16"
              dangerouslySetInnerHTML={{
                __html: widget.title,
              }}
            />
          )}
          {widget.view_all !== "0" && (
            <div>
              {widget.type === "seller" ? (
                <Link
                  href={
                    widget.filters !== false && widget.filters !== ""
                      ? "/" +
                        widget.title
                          .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                          .replace(/\s+/g, "-")
                          .replaceAll("/", "-")
                          .replace("%", "") +
                        "/s=" +
                        widget.type_id +
                        "?has_filter=true" +
                        (widget?.filters?.filter_categories
                          ? "&filter_categories=" +
                            widget?.filters?.filter_categories.map(
                              (fc) => fc.id
                            )
                          : "") +
                        (widget?.filters?.filter_manufacturers
                          ? "&filter_manufacturers=" +
                            widget?.filters?.filter_manufacturers.map(
                              (fm) => fm.id
                            )
                          : "") +
                        (widget?.filters?.filter_sellers
                          ? "&filter_sellers=" +
                            widget?.filters?.filter_sellers.map((fs) => fs.id)
                          : "") +
                        (widget?.filters?.filter_options
                          ? "&filter_options=" +
                            widget?.filters?.filter_options.map((fo) => fo.id)
                          : "")
                      : "/" +
                        //ToSeoUrl(widget.title)
                        widget.title
                          .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                          .replace(/\s+/g, "-")
                          .replaceAll("/", "-")
                          .replace("%", "") +
                        "/s=" +
                        widget.type_id
                  }
                >
                  <h1 className="font-bold text-xs border px-2 py-1 cursor-pointer hover:opacity-80">
                    VIEW ALL
                  </h1>
                </Link>
              ) : widget.type === "manufacturer" ? (
                <Link
                  href={
                    widget.filters !== false && widget.filters !== ""
                      ? "/" +
                        widget.title
                          .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                          .replace(/\s+/g, "-")
                          .replaceAll("/", "-")
                          .replace("%", "") +
                        "/m=" +
                        widget.type_id +
                        "?has_filter=true" +
                        (widget?.filters?.filter_categories
                          ? "&filter_categories=" +
                            widget?.filters?.filter_categories.map(
                              (fc) => fc.id
                            )
                          : "") +
                        (widget?.filters?.filter_manufacturers
                          ? "&filter_manufacturers=" +
                            widget?.filters?.filter_manufacturers.map(
                              (fm) => fm.id
                            )
                          : "") +
                        (widget?.filters?.filter_sellers
                          ? "&filter_sellers=" +
                            widget?.filters?.filter_sellers.map((fs) => fs.id)
                          : "") +
                        (widget?.filters?.filter_options
                          ? "&filter_options=" +
                            widget?.filters?.filter_options.map((fo) => fo.id)
                          : "")
                      : "/" +
                        // ToSeoUrl(widget.title)
                        widget.title
                          .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                          .replace(/\s+/g, "-")
                          .replaceAll("/", "-")
                          .replace("%", "") +
                        "/m=" +
                        widget.type_id
                  }
                >
                  <h1 className="font-bold text-xs border px-2 py-1 cursor-pointer hover:opacity-80">
                    VIEW ALL
                  </h1>
                </Link>
              ) : (
                <Link
                  href={
                    widget.type === "new_arrival"
                      ? "/latest"
                      : widget.filters !== false && widget.filters !== ""
                      ? "/" +
                        widget.title
                          .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                          .replace(/\s+/g, "-")
                          .replaceAll("/", "-")
                          .replace("%", "") +
                        "/c=" +
                        widget.type_id +
                        "?has_filter=true" +
                        (widget?.filters?.filter_categories
                          ? "&filter_categories=" +
                            widget?.filters?.filter_categories.map(
                              (fc) => fc.id
                            )
                          : "") +
                        (widget?.filters?.filter_manufacturers
                          ? "&filter_manufacturers=" +
                            widget?.filters?.filter_manufacturers.map(
                              (fm) => fm.id
                            )
                          : "") +
                        (widget?.filters?.filter_sellers
                          ? "&filter_sellers=" +
                            widget?.filters?.filter_sellers.map((fs) => fs.id)
                          : "") +
                        (widget?.filters?.filter_options
                          ? "&filter_options=" +
                            widget?.filters?.filter_options.map((fo) => fo.id)
                          : "")
                      : "/" +
                        // ToSeoUrl(widget.title)
                        widget.title
                          .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                          .replace(/\s+/g, "-")
                          .replaceAll("/", "-")
                          .replace("%", "") +
                        "/c=" +
                        widget.type_id
                  }
                >
                  <h1 className="font-bold text-xs border px-2 py-1 cursor-pointer hover:opacity-80">
                    VIEW ALL
                  </h1>
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {/* Slider  */}
      {widget?.display === "slider" &&
        widget.type !== "text" &&
        (widget.items.length > 1 ? (
          <div className="-mx-4 py-2">
            {/* <div className="sliderSwiper">
              <div
              className="swiper-button-next"
              ref={swiperNavPrevRef}
              // onClick={onClick}
              onMouseEnter={handleMouseEnterPrev}
              onMouseLeave={handleMouseLeavePrev}
            >
              <svg
                width="44"
                height="502"
                viewBox="0 0 44 502"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`heEmBF 
          ${
            showPrev
              ? "activeTransform"
              : `${
                  showPrev && widget.banner_height < 400
                    ? "activeTransformSmaller"
                    : ""
                }`
          }
          `}
              >
                <path
                  className={`wave ${showPrev ? "activeFill" : ""}`}
                  d="M0.999973 501C32.9999 301.5 42.9999 308 42.9999 252.5C42.9999 197 29.4999 189 1.00002 0.999996L0.999973 501Z"
                  fill="rgba(255,255,255,.4)"
                ></path>
              </svg>
              <div
                className={`swiper-button-circle-left ${
                  showPrev ? "active-circle-left" : ""
                }`}
              >
                <svg
                  width={`${showPrev ? "312" : "221"}`}
                  height="403"
                  viewBox={`${showPrev ? "0 0 312 403" : "0 0 221 403"}`}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="gHFIbo"
                >
                  {!showPrev ? (
                    <path
                      d="M216 383.885C221.5 389.385 218.5 395.885 216 398.385C213.5 400.885 206.5 404.385 200.5 398.385L0.99997 216.385L200.5 4.38534C205.5 -0.614703 212 0.385379 216 4.38535C220 8.38531 221.5 17.3853 216 22.8853L29 216.385L216 383.885Z"
                      fill="black"
                      stroke="none"
                    ></path>
                  ) : (
                    <>
                      <path
                        d="M307.416 383.885C312.916 389.385 309.916 395.885 307.416 398.385C304.916 400.885 297.915 404.385 291.916 398.385L92.4157 216.385L291.916 4.38534C296.916 -0.614703 303.416 0.385379 307.416 4.38535C311.416 8.38531 312.916 17.3853 307.416 22.8853L120.416 216.385L307.416 383.885z"
                        fill="black"
                      ></path>

                      <path
                        d="M153.5 319.385C159 324.885 156 331.385 153.5 333.885C151 336.385 144 339.885 138 333.885L0.999986 216.385L143.5 72.8853C148.5 67.8853 155 68.8854 159 72.8853C163 76.8853 164.5 85.8853 159 91.3853L28.9999 216.385L153.5 319.385z"
                        fill="black"
                      ></path>
                    </>
                  )}
                </svg>
              </div>
              <div className="swiper-button-circle-back-left"></div>
            </div>
            </div> */}

            {width > 650 ? (
              <Slider {...settingSliderD} className="sliderSwiper">
                {widget.items.map((item, index) =>
                  item.mobile_type_id === "0" ? (
                    <div data-index={index} key={`sliderM` + index}>
                      <Image
                        alt={item?.name}
                        src={host.host + "/image/" + item.image}
                        className="w-full"
                        height={widget.banner_height}
                        width={widget.banner_width}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,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"
                        // placeholder={"/images/placeholder_slideshow.png"}
                      />
                    </div>
                  ) : (
                    <Link
                      data-index={index}
                      onClick={() => handleLinkClick(item.banner_image_id)}
                      href={
                        item?.name?.length > 0 && item.filters != false
                          ? "/" +
                            item?.name
                              .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                              .replace(/\s+/g, "-")
                              .replaceAll("/", "-")
                              .replace("%", "") +
                            "/" +
                            types[item.mobile_type].slice(0, 1) +
                            "=" +
                            item.mobile_type_id +
                            "?has_filter=true" +
                            (item?.filters?.filter_categories
                              ? "&filter_categories=" +
                                item?.filters?.filter_categories.map(
                                  (fc) => fc.id
                                )
                              : "") +
                            (item?.filters?.filter_manufacturers
                              ? "&filter_manufacturers=" +
                                item?.filters?.filter_manufacturers.map(
                                  (fm) => fm.id
                                )
                              : "") +
                            (item?.filters?.filter_sellers
                              ? "&filter_sellers=" +
                                item?.filters?.filter_sellers.map((fs) => fs.id)
                              : "")
                          : item?.name?.length > 0
                          ? "/" +
                            item?.name
                              .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                              .replace(/\s+/g, "-")
                              .replaceAll("/", "-")
                              .replace("%", "") +
                            "/" +
                            types[item.mobile_type].slice(0, 1) +
                            "=" +
                            item.mobile_type_id
                          : "cat/c=" + item.mobile_type_id
                      }
                      key={Math.random()}
                    >
                      <Image
                        alt={item?.name}
                        src={host.host + "/image/" + item.image}
                        className="w-full"
                        height={widget.banner_height}
                        width={widget.banner_width}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,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"
                        // placeholder={"/images/placeholder_slideshow.png"}
                      />
                    </Link>
                  )
                )}
              </Slider>
            ) : (
              // <Swiper
              //   slidesPerView={1}
              //   autoplay={true}
              //   loop={true}
              //   pagination={{ clickable: true }}
              //   navigation={{
              //     nextEl: swiperNavNextRef.current,
              //     prevEl: swiperNavPrevRef.current,
              //   }}
              //   modules={[Pagination, Navigation, Autoplay]}
              //   className="sliderSwiper"
              // >
              //   {widget.items.map((item, index) => {
              //     return (
              //       <SwiperSlide key={`sliderr` + index}>
              //         {item.mobile_type_id === "0" ? (
              //           item?.mobile_type == "6" ? (
              //             <Link
              //               data-index={index}
              //               href={"/latest"}
              //               key={Math.random()}
              //               // onClick={() => {
              //               //   if (
              //               //     types[item.mobile_type]?.slice(0, 1) === "p"
              //               //   ) {
              //               //     setProductHolder({});
              //               //   }
              //               // }}
              //             >
              //               {/* <ImageClient
              //                 alt={item?.name}
              //                 src={item.image}
              //                 className="w-full"
              //                 width={widget.banner_width}
              //                 height={widget.banner_height}
              //                 placeholder={"//placeholder_slideshow.png"}
              //               /> */}
              //               <Image
              //                 alt={item?.name}
              //                 src={
              //                   "https://www.ishtari.com/image/" + item.image
              //                 }
              //                 className="w-full"
              //                 width={widget.banner_width}
              //                 height={widget.banner_height}
              //                 placeholder="blur"
              //                 blurDataURL="data:image/png;base64,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"
              //                 // placeholder={"//placeholder_slideshow.png"}
              //               />
              //             </Link>
              //           ) : (
              //             <div data-index={index} key={`slider` + index}>
              //               {/* <ImageClient
              //                 alt={item?.name}
              //                 src={item.image}
              //                 className="w-full"
              //                 width={widget.banner_width}
              //                 height={widget.banner_height}
              //                 placeholder={"/images/placeholder_slideshow.png"}
              //               /> */}
              //               <Image
              //                 alt={item?.name}
              //                 src={
              //                   "https://www.ishtari.com/image/" + item.image
              //                 }
              //                 className="w-full"
              //                 width={widget.banner_width}
              //                 height={widget.banner_height}
              //                 placeholder="blur"
              //                 blurDataURL="data:image/png;base64,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"
              //                 // placeholder={"/images/placeholder_slideshow.png"}
              //               />
              //             </div>
              //           )
              //         ) : (
              //           <Link
              //             data-index={index}
              //             href={
              //               // accountState.admin
              //               //   ? `${path}/${types[item.mobile_type]}/${
              //               //       item.mobile_type_id
              //               //     }`
              //               //   :
              //               item?.name?.length > 0 && item.filters != false
              //                 ? "/" +
              //                   item?.name
              //                     ?.replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
              //                     ?.replace(/\s+/g, "-")
              //                     ?.replaceAll("/", "-")
              //                     ?.replace("%", "") +
              //                   "/" +
              //                   types[item.mobile_type]?.slice(0, 1) +
              //                   "=" +
              //                   item.mobile_type_id +
              //                   "?has_filter=true" +
              //                   (item?.filters?.filter_categories
              //                     ? "&filter_categories=" +
              //                       item?.filters?.filter_categories.map(
              //                         (fc) => fc.id
              //                       )
              //                     : "") +
              //                   (item?.filters?.filter_manufacturers
              //                     ? "&filter_manufacturers=" +
              //                       item?.filters?.filter_manufacturers.map(
              //                         (fm) => fm.id
              //                       )
              //                     : "") +
              //                   (item?.filters?.filter_sellers
              //                     ? "&filter_sellers=" +
              //                       item?.filters?.filter_sellers.map(
              //                         (fs) => fs.id
              //                       )
              //                     : "")
              //                 : item?.name?.length > 0
              //                 ? "/" +
              //                   item?.name
              //                     .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
              //                     .replace(/\s+/g, "-")
              //                     .replaceAll("/", "-")
              //                     .replace("%", "") +
              //                   "/" +
              //                   types[item.mobile_type].slice(0, 1) +
              //                   "=" +
              //                   item.mobile_type_id
              //                 : "cat/c=" + item.mobile_type_id
              //             }
              //             key={Math.random()}
              //             // onClick={() => {
              //             //   if (types[item.mobile_type]?.slice(0, 1) === "p") {
              //             //     setProductHolder({});
              //             //   }
              //             // }}
              //           >
              //             {/* <ImageClient
              //               src={item.image}
              //               alt={item?.name}
              //               width={widget.banner_width}
              //               height={widget.banner_height}
              //               className="w-full"
              //               placeholder={"/images/placeholder_slideshow.png"}
              //             /> */}
              //             <Image
              //               src={item.image}
              //               alt={"https://www.ishtari.com/image/" + item?.name}
              //               width={widget.banner_width}
              //               height={widget.banner_height}
              //               className="w-full"
              //               placeholder="blur"
              //               blurDataURL="data:image/png;base64,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"
              //               // placeholder={"/images/placeholder_slideshow.png"}
              //             />
              //           </Link>
              //         )}
              //       </SwiperSlide>
              //     );
              //   })}
              //   <div
              //     className="swiper-button-next"
              //     ref={swiperNavPrevRef}
              //     onMouseEnter={handleMouseEnterPrev}
              //     onMouseLeave={handleMouseLeavePrev}
              //   >
              //     <svg
              //       width="44"
              //       height="502"
              //       viewBox="0 0 44 502"
              //       fill="none"
              //       xmlns="http://www.w3.org/2000/svg"
              //       className={`heEmBF ${
              //         showPrev
              //           ? "activeTransform"
              //           : `${
              //               showPrev && widget.banner_height < 400
              //                 ? "activeTransformSmaller"
              //                 : ""
              //             }`
              //       }`}
              //     >
              //       <path
              //         className={`wave ${showPrev ? "activeFill" : ""}`}
              //         d="M0.999973 501C32.9999 301.5 42.9999 308 42.9999 252.5C42.9999 197 29.4999 189 1.00002 0.999996L0.999973 501Z"
              //         fill="rgba(255,255,255,.4)"
              //       ></path>
              //     </svg>
              //     <div
              //       className={`swiper-button-circle-left ${
              //         showPrev ? "active-circle-left" : ""
              //       }`}
              //     >
              //       <svg
              //         width={`${showPrev ? "312" : "221"}`}
              //         height="403"
              //         viewBox={`${showPrev ? "0 0 312 403" : "0 0 221 403"}`}
              //         fill="none"
              //         xmlns="http://www.w3.org/2000/svg"
              //         className="gHFIbo"
              //       >
              //         {!showPrev ? (
              //           <path
              //             d="M216 383.885C221.5 389.385 218.5 395.885 216 398.385C213.5 400.885 206.5 404.385 200.5 398.385L0.99997 216.385L200.5 4.38534C205.5 -0.614703 212 0.385379 216 4.38535C220 8.38531 221.5 17.3853 216 22.8853L29 216.385L216 383.885Z"
              //             fill="black"
              //             stroke="none"
              //           ></path>
              //         ) : (
              //           <>
              //             <path
              //               d="M307.416 383.885C312.916 389.385 309.916 395.885 307.416 398.385C304.916 400.885 297.915 404.385 291.916 398.385L92.4157 216.385L291.916 4.38534C296.916 -0.614703 303.416 0.385379 307.416 4.38535C311.416 8.38531 312.916 17.3853 307.416 22.8853L120.416 216.385L307.416 383.885z"
              //               fill="black"
              //             ></path>

              //             <path
              //               d="M153.5 319.385C159 324.885 156 331.385 153.5 333.885C151 336.385 144 339.885 138 333.885L0.999986 216.385L143.5 72.8853C148.5 67.8853 155 68.8854 159 72.8853C163 76.8853 164.5 85.8853 159 91.3853L28.9999 216.385L153.5 319.385z"
              //               fill="black"
              //             ></path>
              //           </>
              //         )}
              //       </svg>
              //     </div>
              //     <div className="swiper-button-circle-back-left"></div>
              //   </div>
              //   <div
              //     className="swiper-button-prev"
              //     ref={swiperNavNextRef}
              //     onMouseEnter={handleMouseEnter}
              //     onMouseLeave={handleMouseLeave}
              //   >
              //     <svg
              //       width="44"
              //       height="501"
              //       viewBox="0 0 44 501"
              //       fill="none"
              //       xmlns="http://www.w3.org/2000/svg"
              //       className={`sc-fxvKuh izCJif ${
              //         showNext
              //           ? "activeTransform"
              //           : `${
              //               showNext && widget.banner_height < 400
              //                 ? "activeTransformSmaller"
              //                 : ""
              //             }`
              //       }`}
              //     >
              //       <path
              //         className={`wave ${showNext ? "activeFill" : ""}`}
              //         d="M42.9999 0.5C11 200 1 193.5 1 249C1 304.5 14.5 312.5 42.9999 500.5V0.5Z"
              //         fill="rgba(255,255,255,.4)"
              //       ></path>
              //     </svg>
              //     <div
              //       className={`swiper-button-circle-right ${
              //         showNext ? "active-circle-right" : ""
              //       }`}
              //     >
              //       <svg
              //         width={`${showNext ? "312" : "220"}`}
              //         height="403"
              //         viewBox={`${showNext ? "0 0 312 403" : "0 0 220 403"}`}
              //         fill="none"
              //         xmlns="http://www.w3.org/2000/svg"
              //         className="gHFIbo"
              //       >
              //         {!showNext ? (
              //           <path
              //             d="M4.08419 18.813C-1.41579 13.313 1.58419 6.81288 4.08419 4.31288C6.58419 1.81289 13.5842 -1.68707 19.5842 4.31291L219.084 186.313L19.5842 398.313C14.5842 403.313 8.08416 402.313 4.08419 398.313C0.0842264 394.313 -1.41584 385.313 4.08419 379.813L191.084 186.313L4.08419 18.813Z"
              //             fill="black"
              //             stroke="black"
              //           ></path>
              //         ) : (
              //           <>
              //             <path
              //               d="M4.58444 18.813C-0.91555 13.313 2.08444 6.81288 4.58444 4.31288C7.08444 1.81289 14.0845 -1.68707 20.0845 4.31291L219.584 186.313L20.0845 398.313C15.0844 403.313 8.5844 402.313 4.58444 398.313C0.584471 394.313 -0.915597 385.313 4.58444 379.813L191.584 186.313L4.58444 18.813z"
              //               fill="black"
              //             ></path>
              //             <path
              //               d="M158.5 83.3131C153 77.8131 156 71.313 158.5 68.813C161 66.313 168 62.813 174 68.813L311 186.313L168.5 329.813C163.5 334.813 157 333.813 153 329.813C149 325.813 147.5 316.813 153 311.313L283 186.313L158.5 83.3131Z"
              //               fill="black"
              //             ></path>

              //             <path
              //               d="M4.58444 18.813C-0.91555 13.313 2.08444 6.81288 4.58444 4.31288C7.08444 1.81289 14.0845 -1.68707 20.0845 4.31291L219.584 186.313L20.0845 398.313C15.0844 403.313 8.5844 402.313 4.58444 398.313C0.584471 394.313 -0.915597 385.313 4.58444 379.813L191.584 186.313L4.58444 18.813Z"
              //               stroke="black"
              //             ></path>

              //             <path
              //               d="M158.5 83.3131C153 77.8131 156 71.313 158.5 68.813C161 66.313 168 62.813 174 68.813L311 186.313L168.5 329.813C163.5 334.813 157 333.813 153 329.813C149 325.813 147.5 316.813 153 311.313L283 186.313L158.5 83.3131Z"
              //               stroke="black"
              //             ></path>
              //           </>
              //         )}
              //       </svg>
              //     </div>
              //     <div className={`swiper-button-circle-back-right`}></div>
              //   </div>
              // </Swiper>
              <Slider {...settingM}>
                {widget.items.map((item, index) =>
                  item.mobile_type_id === "0" ? (
                    <div data-index={index} key={`sliderM` + index}>
                      <Image
                        alt={item?.name}
                        src={host.host + "/image/" + item.image}
                        className="w-full"
                        height={widget.banner_height}
                        width={widget.banner_width}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,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"
                        // placeholder={"/images/placeholder_slideshow.png"}
                      />
                    </div>
                  ) : (
                    <Link
                      data-index={index}
                      onClick={() => handleLinkClick(item.banner_image_id)}
                      href={
                        item?.name?.length > 0 && item.filters != false
                          ? "/" +
                            item?.name
                              .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                              .replace(/\s+/g, "-")
                              .replaceAll("/", "-")
                              .replace("%", "") +
                            "/" +
                            types[item.mobile_type].slice(0, 1) +
                            "=" +
                            item.mobile_type_id +
                            "?has_filter=true" +
                            (item?.filters?.filter_categories
                              ? "&filter_categories=" +
                                item?.filters?.filter_categories.map(
                                  (fc) => fc.id
                                )
                              : "") +
                            (item?.filters?.filter_manufacturers
                              ? "&filter_manufacturers=" +
                                item?.filters?.filter_manufacturers.map(
                                  (fm) => fm.id
                                )
                              : "") +
                            (item?.filters?.filter_sellers
                              ? "&filter_sellers=" +
                                item?.filters?.filter_sellers.map((fs) => fs.id)
                              : "")
                          : item?.name?.length > 0
                          ? "/" +
                            item?.name
                              .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                              .replace(/\s+/g, "-")
                              .replaceAll("/", "-")
                              .replace("%", "") +
                            "/" +
                            types[item.mobile_type].slice(0, 1) +
                            "=" +
                            item.mobile_type_id
                          : "cat/c=" + item.mobile_type_id
                      }
                      key={Math.random()}
                    >
                    
                      <Image
                        alt={item?.name}
                        src={host.host + "/image/" + item.image}
                        className="w-full"
                        height={widget.banner_height}
                        width={widget.banner_width}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,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"
                        // placeholder={"/images/placeholder_slideshow.png"}
                      />
                    </Link>
                  )
                )}
              </Slider>
            )}
          </div>
        ) : (
          <div className="flex  justify-between">
            {widget.items.map((item) => {
              const bool = widget.items.length > 1;

              return item.mobile_type_id !== "0" ? (
                <div
                  className={`p-1 ${
                    true && "w-full"
                  } cursor-pointer flex justify-center hover:opacity-80 w-1/${
                    widget.column_number
                  } md:w-1/${widget.column_number}`}
                  key={item.banner_image_id}
                >
                  <Link
                    onClick={() => handleLinkClick(item.banner_image_id)}
                    href={
                      item?.name?.length > 0 && item.filters != false
                        ? "/" +
                          item?.name
                            .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                            .replace(/\s+/g, "-")
                            .replaceAll("/", "-")
                            .replace("%", "") +
                          "/" +
                          types[item.mobile_type].slice(0, 1) +
                          "=" +
                          item.mobile_type_id +
                          "?has_filter=true" +
                          (item?.filters?.filter_categories
                            ? "&filter_categories=" +
                              item?.filters?.filter_categories.map(
                                (fc) => fc.id
                              )
                            : "") +
                          (item?.filters?.filter_manufacturers
                            ? "&filter_manufacturers=" +
                              item?.filters?.filter_manufacturers.map(
                                (fm) => fm.id
                              )
                            : "") +
                          (item?.filters?.filter_sellers
                            ? "&filter_sellers=" +
                              item?.filters?.filter_sellers.map((fs) => fs.id)
                            : "")
                        : item?.name?.length > 0
                        ? "/" +
                          item?.name
                            .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                            .replace(/\s+/g, "-")
                            .replaceAll("/", "-")
                            .replace("%", "") +
                          "/" +
                          types[item.mobile_type].slice(0, 1) +
                          "=" +
                          item.mobile_type_id
                        : "cat/c=" + item.mobile_type_id
                    }
                    className="w-full"
                  >
                    
                    <Image
                      alt={item?.name}
                      src={host.host + "/image/" + item.image}
                      width={widget.banner_width}
                      height={widget.banner_height}
                      title={item?.name
                        ?.replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                        ?.replace("%", "")
                        ?.replace(/\s+/g, "-")
                        ?.replaceAll("/", "-")}
                      className={`${true && "w-full"}`}
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,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"
                    />
                  </Link>
                </div>
              ) : (
                <div
                  className={`p-1 w-full hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                  key={item.banner_image_id}
                >
                  <div>
                   
                    <Image
                      alt={item?.name}
                      src={host.host + "/image/" + item.image}
                      width={widget.banner_width}
                      height={widget.banner_height}
                      title={item?.name
                        .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                        .replace("%", "")
                        .replace(/\s+/g, "-")
                        .replaceAll("/", "-")}
                      className={"w-full"}
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,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"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ))}

      {/* Grid */}
      {widget?.display === "grid" && widget.column_number < 7 && (
        <div className="flex -mx-4 flex-wrap justify-between">
          {widget.items.map((item) => {
            const bool = widget.items.length > 0;

            return item.mobile_type_id !== "0" ? (
              <div
                className={`  ${
                  !bool && "w-full"
                } cursor-pointer flex justify-center hover:opacity-80  `}
                key={item.banner_image_id}
                style={{
                  padding: "1px",
                  width: `calc(100% / ${widget.column_number}) `,
                }}
              >
                <Link
                  onClick={() => handleLinkClick(item.banner_image_id)}
                  href={
                    item?.name?.length > 0 && item?.filters != false
                      ? "/" +
                        item?.name
                          ?.replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                          .replace("%", "")
                          .replace(/\s+/g, "-")
                          .replaceAll("/", "-") +
                        "/" +
                        types[item.mobile_type]?.slice(0, 1) +
                        "=" +
                        item.mobile_type_id +
                        "?has_filter=true" +
                        (item?.filters?.filter_categories
                          ? "&filter_categories=" +
                            item?.filters?.filter_categories.map((fc) => fc.id)
                          : "") +
                        (item?.filters?.filter_manufacturers
                          ? "&filter_manufacturers=" +
                            item?.filters?.filter_manufacturers.map(
                              (fm) => fm.id
                            )
                          : "") +
                        (item?.filters?.filter_sellers
                          ? "&filter_sellers=" +
                            item?.filters?.filter_sellers.map((fs) => fs.id)
                          : "")
                      : item?.name?.length > 0
                      ? "/" +
                        item?.name
                          ?.replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                          .replace("%", "")
                          .replace(/\s+/g, "-")
                          .replaceAll("/", "-") +
                        "/" +
                        types[item.mobile_type]?.slice(0, 1) +
                        "=" +
                        item.mobile_type_id
                      : "cat/c=" + item.mobile_type_id
                  }
                 
                >
               
                  <Image
                    alt={item?.name}
                    src={host.host + "/image/" + item.image}
                    width={widget?.banner_width}
                    height={widget?.banner_height}
                    title={item?.name
                      .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                      .replace("%", "")
                      .replace(/\s+/g, "-")
                      .replaceAll("/", "-")}
                    className={`${!bool && "w-full"}`}
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,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"
                  />
                </Link>
              </div>
            ) : item.mobile_type === "6" ? (
              <div
                className={`hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                key={item.banner_image_id}
              >
                <Link
                  onClick={() => handleLinkClick(item.banner_image_id)}
                  href={"/latest"}
                >
                 
                  <Image
                    alt={item?.name}
                    src={host.host + "/image/" + item.image}
                    width={widget.banner_width}
                    height={widget.banner_height}
                    title={item?.name}
                    className={"w-full"}
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,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"
                  />
                </Link>
              </div>
            ) : (
              <div
                className={`hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                key={item.banner_image_id}
              >
              
                <Image
                  alt={item?.name}
                  src={host.host + "/image/" + item.image}
                  width={widget.banner_width}
                  height={widget.banner_height}
                  title={item?.name
                    .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                    .replace("%", "")
                    .replace(/\s+/g, "-")
                    .replaceAll("/", "-")}
                  className={`${"w-full"}`}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,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"
                />
              </div>
            );
          })}
        </div>
      )}

      {widget?.display === "grid" &&
        widget.type !== "text" &&
        widget.column_number > 6 && (
          <div className="flex -mx-4 flex-row justify-between">
            {widget.items.map((item) => {
              const bool = widget.items.length > 1;

              return item.mobile_type_id !== "0" ? (
                <div
                  className={`${
                    !bool && "w-full"
                  } cursor-pointer flex justify-center hover:opacity-80 w-1/${
                    widget.column_number
                  } md:w-1/${widget.column_number}`}
                  key={item.banner_image_id}
                  style={{ padding: "1px" }}
                >
                  <Link
                    onClick={() => handleLinkClick(item.banner_image_id)}
                    href={
                      item?.name?.length > 0 && item?.filters != false
                        ? "/" +
                          item?.name
                            ?.replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                            .replace("%", "")
                            .replace(/\s+/g, "-")
                            .replaceAll("/", "-") +
                          "/" +
                          types[item.mobile_type]?.slice(0, 1) +
                          "=" +
                          item.mobile_type_id +
                          "?has_filter=true" +
                          (item?.filters?.filter_categories
                            ? "&filter_categories=" +
                              item?.filters?.filter_categories.map(
                                (fc) => fc.id
                              )
                            : "") +
                          (item?.filters?.filter_manufacturers
                            ? "&filter_manufacturers=" +
                              item?.filters?.filter_manufacturers.map(
                                (fm) => fm.id
                              )
                            : "") +
                          (item?.filters?.filter_sellers
                            ? "&filter_sellers=" +
                              item?.filters?.filter_sellers.map((fs) => fs.id)
                            : "")
                        : item?.name?.length > 0
                        ? "/" +
                          item?.name
                            ?.replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                            .replace("%", "")
                            .replace(/\s+/g, "-")
                            .replaceAll("/", "-") +
                          "/" +
                          types[item.mobile_type]?.slice(0, 1) +
                          "=" +
                          item.mobile_type_id
                        : "cat/c=" + item.mobile_type_id
                    }
                   
                  >
                   
                    <Image
                      alt={item?.name}
                      src={host.host + "/image/" + item.image}
                      width={widget.banner_width}
                      height={widget.banner_height}
                      title={item?.name
                        .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                        .replace("%", "")
                        .replace(/\s+/g, "-")
                        .replaceAll("/", "-")}
                      className={`${"w-full"}`}
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYkAAAGJCAIAAADwv1jqAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAFGlJREFUeJzt3Ql7olgWgOH5/79uFFFxAdw3XFBwNz0HSWXSVZoCE+Wg3/s46equ6rik/eaCl3v/8w8A6POfrB8AAFxAmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEm57N4XBY/1v4mfx9EK59f71YhL4f+stguVwtl0t/MZ/Pp9PpZDIZjUbD4XAwGPT/0JP/Oe6g0Rw4Tt91e26r47otx7GbTbvRqNfrNcuqVquVSkW+dpq2NxptN5usXxLkEm16Im9vs9nMqlqlvzPjvxhyOysmVyoVTLMgXw2j8PW/eP5d0zQHvd7xeMz61UHO0KbnsV0FUppiqtA8Rslwm8230ynrVwh5QpuehxyUZR2h6wqFmedl/QohT2jT89itN2Y0bso6Q5fI0Z/daLy9vWX9IiE3aNNTWc5mjUajLEzz/SxSSUurSqXShvPiSIw2PZvT6bQTm81qtfKmntfvD3s923FqllWrVEzTjDpRKDy+TdLKMAyzfnmQG7Tphbyd3mTk4ovzdIFOt9tyXbfZtCyrfGaWTONXSP5/Tv2HTq7LuIk2ITnahGhK1FZsNtswlHBNxHDY73YbzWZdRlvVaikebX2vUYybkAptwlVvb29yhHg8HNfr9VLM5t543G63HdsupR9MWbWaRDDr54TcoE24xWq1qlSt5GEqFIuDTjfrR408oU240aTfT34qSo4K10GQ9UNGntAm3GgxniQfN9UbjRPzwpEGbcKN3JabvE3eaJT140XO0CbcYr1cGaVSwjBVKpXDbpf1Q0bO0Cak9vb21m21kg+a+r1e1g8Z+UObkNp+tyuXywnDZBhGwFlwpEebkFqqT+hs2+YSX9yANiGd4/FoJR40iclkkvVDRi7RJqQznc2Sh6lsmrvtNuuHjFyiTUjhdDrVarXkbep2mQuOG9EmpOD7fvIwGcVisFpl/ZCRV7QJKbTb7eRtajIXHN9Am5DUdrN5X5oumel4nPVDRo7RJiQ17PWSh6lUKnEWHN9Bm17a29vb8XBYh2Hg+18v/LbbbE0z6UUqotPpPOxZ4CnRptdyOh5lOBNt4TuZSD7seiNa1vK8g6Z8nY2vzkUadrvJ51vKd1sul498Xng+tOlpyZgo2tMgXM9ns2G/P+h0HMepnBcFv9YUu16/+K1Op1M9zdSBer3OWXB8E216Esfj8bDfB0Ew96aj4bDlujImOm9P8OtA7K+jHsPoue7Fb+7P0u3KedtccN/32+22q0C3253NZjvWTsgUbcql4+Gw3WyC5dKbTge9XqfVjnZ4KpeNzwFKuaR3tDTlev3nfcn4q2nbyb+PBHGf/l09HA5TPdp7K5yXdhkPBhL9n/iJITXapF10uvp43G63MqyYTSbRxk22XbMs44e2ZvrQajYvPoDVapX8vuQt3badtM8xDAK5iwz2zPtS/HgajcZ+v//mDxE3oE3qnE6nzXYTrFbj8XjQ6zuOU6tWy6b5acO4u7wV59PpxceTar6lWPp+2qe88Ly7PKWfUCgUXMdh9PR4tEmX/Xbr1Oqlsvnjw6KvNRuNiyuZbDabUuL1LYu3ngWPx033e3bfJHkaDAY/8eNFCrRJlyAMfmof3VTm8/nFxzMajZJ/k4JRnAyHNzzraCHNbvd+z+6bCvFJNI7sHos26SLvUn+xmIzHk4fwPE/qs5jPLw6ajoeDVa0mfw+b5fLNc8FltDWbzdxoC/SmhCDVYO0x5OF972eLdGgTrhqnGTQVf2hFFKnkdrtdh6EM5UbDoXzPWq1mWdE+nR8nyx9/1lzucdRl1fOHok24LFrfMs2gSdxpLni07/nxGKyC5Xw+HA6dZtNxnGq1+tspqrsG67+Fwvimw1XcjDbhsvlslvzMV+F8FvyRH2btD4cwDFfLpdSq3+s1Gg0ZW31eJuFnU1UoFkZ9Toc/FG16RcdD5Os/067Xi6VS8rf4KNNhRTS2klqtowt0vMnEdV3Htj9vBvP9VI3Y/vOxaNOTO54v7g2CYOp5o8Gw1W43ZYghR0SWJf/k2r+1Tjl1QAYsm83mkc/rr+LzVjK2kucuWZGxlW3b1fNMsRs6Ja/GxUnzuB/a9FTi63uD1WrhTbvdbtt1rVpN3o0XZw/J+2175WO1TqeT6q3barUe/ExvIC+OjBbl9RmPx+XrFzz/qVAoNJtNdrJ6MNqUV/JW2e/3281mvlhMJ5NJf+C4ri0lSrxBkwyd9peO7CRYqda3jHbHTD8XPFvzNLvFiCEnwh+ONuXG6XQKzmd/5Qil2247zaYcoVTMXyWKR0bJ520axeGVj/wHada3LJ7Pgr/lbUUUyXqqrYm/XngP90CbNJIMydHHfreLru8dT3rdbuN8ksj4uUvqZGS0u3QC5YapA3kcUwRprpKp1WosR/V4tCl78VnbYLWSA41oDbhWW94M1UqlEh9Y3eMSFsPoXzlDNJ9OU92jwrPgSQwGg+TPkYvpMkGbMjb1PBkTRccXD7yMrmSWNheXajq9NS0r1SNpuW7uThJHy3jW68mf44pd9rJAm7IkB27vVTLutfLJRe0rgybfm6b9VovF4sEv2velWpGqWq3+dS4Y7oE2ZUlGHJ7nuY1my7ajm+P8yM2Nbu6Fm3xxnLbrXps6IL+bvErRXHDLyt1Z8H/OB3SFQtJJTmybnhXahHfrMEx79f84h7tjHo/HVAd0ft6mRzwN2oR3/X4/VZhyOlU61QFdhQO67NAmRPb7faVSSdUmJ59Tpaeel/CATv5Qv93O+vG+Ltr0/E5nX/+ZVOtbRoziPJ9rraU4p2YYqwUHdJmhTU8o3pdFDl6kOIN+v9Fo1BuNxWz+z5VhzmG/Tzvf0rKsPC7vv9tuk59TK5crrMObIdqUb/EMcsnQYrGYT6edTsd1HAlHvI345yFAxTT3Vz6emw1HaWcwZLsiys2SH9AJ98pOongM2pQn8TID281mNpvJmKjTfp9BnuTkbqVSubZRrd1opgqTaZrXZiFoJq+ebdvJ2+RdX0MGD0CblIoXopUxURAE/nnl7Ha77ZxnkKdaJOCdYbRs++Kp69D3jZRTB2zHyeNZ8GinqcTPVAaeebwW55nQJi2kRPvdLjgvMzDs9eNFZq0/VsW+jbwng/mlCdxvb62qVUzVJsNYjCcPf3l+gNQ5+apyTj77+0xoUwbkP3oZFu3Op6sX02mv1+u0WrXqz28j/sG+sp/4er1OO9+yUq0ec3iGeDwep3qak0ku+/tMaNNDyQHasNeT/0+u12qVcvkH1zz5imHMr0zgTjvfspjPi/JlKJqq+1+sCIqHoU0PVa1WH71tr2HUKpXTpc/7D/t9NeV8y3Le3rQyMGy3WmlfMz6h04A2PdSo25VjooepVCpWrba4MklyOk256oBRtMrlY6bXcMRrfu/3+90lm80mOJvNZnIQJ4mREVDanQsKhQJbqmhAmx7tcIx3YHqQazMkozWMarWUb9tiySgFty5m9PaJ3Lv0RVIS74MiwvMt+lDS9yWa0a5z/X73rN/pxL9qtVrNZtOyLGlu/HmleP/LWTyr65un7aLlz4PgGz9h/Aza9KIWXrr1LT9IGhaLxcdQJdoffL2O1g6ezTzPm3jedDyeyi8mk2jnpX5fguI4TvPMPt9EvV6XYd3nmnz48x4Lj91knBV4laBNr0jGLc1KVUZBN7+Bo3HLWdyXz7/1RUceXJnbSE+z/vkgQpteUeAv7zdfIe9YgVcJ2vSKep3Ooz8uzAk5oMvjNcxPiTa9nO1maxrp5lu+jjzO3npWtOnlpNr+6NUsl8usfz54R5tey+FwSLtU04soFAqVCgs2KUKbXstiscg6AnrxCZ0qtOm1TCeTrAugVK1WY9sCVWjTa5nQpkssy2K1Jm1o02th3PTb5M9SqdTtdq+tCIoM0abX4r/A+aZrU88Nw6hWq3LsVotW7bMcxxmPxwyX1KJNryV3n9MVvvzb4nng83G5b1Qc1+20Iu12ezAYzGazpX+2XIZhGF/8HMv6R4G/oE0vJ+0KkPf2R33e/8H7MMeyolut1mw25eBrKAYD+TKZTKLuLJfr9Xq7iWy3W05mPxPa9HJOp5Nt249v0EdxYu/DHMdpt97Fwxw56oxuvi/DnP1+/zHMYfXuV0ObXtFut2s0GjfX5Vp0yuVyvKadRKder0sB5cCq3+8PevKlPxqNFouFDHN2MsbZbOQxcGCFL9CmFyVdGPR6Zqn0e2v+/XelUsn8fDbHtlu27bquDHMkN9PpdD6dymBHohMEgQxzPta0k9GZkpHObDplHcs8ok0vbROux4Nhy3Gq55FOdP642xv2+8PhcDwey4HVOlxv1uv3szn5PLBqNpuFYnFyZTcHqEWbENEzzPlZh/1ejjSlTTJCDLiON1doE57ZfDr7+BywUqkyxzJHaBOe1n63q3za5Kpw3tzp4nZYUIg24TkdD4eW4/w+V7NQ6HbaWT80JEKb8DziDaaOx6Pv+/V6/dpch/l0mvUjxd/RJqj2ebPM/a8NMuM97DzPm04m8nU0GnU6HTles88sy/rbDC0jZAc69WgTMhCPbuK97cIwjLbQDEMpzmQyed8ys9PpdbvtdjveLLNcLlfON/HbllO/H7R9naVfOm2O7LSjTbjd6XSKBzX7X7uAB0GwWCxm0Uaa0bTMeFDT6/WkMjKucYRtu79GN6ZpJivJz5N7Z1a6crQJX5H0hKtVsFrN5/N4n14JTU8GNZ1uu9VuNBrRDuDVakWYpgxqkmx7p2H7THmoLA2uHG3CVTKykPo85T52zUaDjcWVo024SgZNn+cHXZDPDTgLhYIcbGb96uIvaBO+stlsFvP5bDaLD+g6nU67/WtRE8dpNZvy1bWdZrNZq9Wq54O7csyMzlp/rPomSqXSxSO+QnyUd/1Ir/Cjh4HyrRzb4WSTfrQJPyD+3C0+Ib6NbbabMFr1LV74TazX6yAIfN+PTpR73iQ2Hk+HQ28sfx0Ph8NeryfRk9I1zuqNRrNel1v063o9/sDut8/p/lquwqc/I1/bjsMSdLlAm6DO22enk9xikr94flMYhqvVankmtQvPv1gsFtPzciifx3fRci6uG4/05Kv8mae8pPkp0SYAGtEmABrRJgAa0SZ8ZbfbnfdPWh4feP74sN/H+zZx0vqV0SZc9nY6DQf96q/N7GrVqjeZPOBEsud51q9JVXLvw+GQSZKviTbhAmlQz7aLpd+nI42Gw7ver5Toz0kAnU6HD9deEG3CBcvZrHjpcv+yaW7vtqztZr2+fDmeYSx9/053CrVoEy7oue7l61FKxmxwr6GTHM1dnjxpGL1W6053CrVoEy5wWq3LmTDNaeteKx/1B4PLd1os9tqdO90p1KJNuGDUbl8eNxnGfHKvq2TnciB5Zdw06NCml0ObcME2DEuXFn6rVe+4JNt+v7+47IFpmpvN5k53CrVoEy6beVOj+K9VUKRW/mJx1zv1ff9fi2EakSlbD7wk2oSrlr7fbbWr1aplWf1ebx2GD7jTMAx73a51vtOe21qyGe+rok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADT6H6xYY8Vnx8fZAAAAAElFTkSuQmCC"
                    />
                  </Link>
                </div>
              ) : item.mobile_type === "6" ? (
                <div
                  className={` w-full hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                  key={item.banner_image_id}
                >
                  <Link
                    onClick={() => handleLinkClick(item.banner_image_id)}
                    href={"/latest"}
                  >
                    
                    <Image
                      alt={item?.name}
                      src={host.host + "/image/" + item.image}
                      width={widget.banner_width}
                      height={widget.banner_height}
                      title={item?.name}
                      className={"w-full"}
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,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"
                    />
                  </Link>
                </div>
              ) : (
                <div
                  className={`  hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                  key={item.banner_image_id}
                >
                  <div>
                 
                    <Image
                      alt={item?.name}
                      src={host.host + "/image/" + item.image}
                      width={widget.banner_width}
                      height={widget.banner_height}
                      title={item?.name
                        ?.replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                        ?.replace(/\s+/g, "-")
                        ?.replaceAll("/", "-")}
                      className={"w-full"}
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,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"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {widget?.display === "carousel" && widget.type !== "text" && (
        <div>
          {widget?.items?.length < 7 ? (
            <div className="mobile:flex">
              {/* {width > 650 ? ( */}
              <div className="hidden mobile:block px-6">
                <Slider
                  {...productSetting}
                  beforeChange={handleBeforeChange}
                  afterChange={handleAfterChange}
                >
                  {widget.items?.map((item) => {
                    if (item.product_id) {
                      return (
                        <div className="pr-2" key={item.product_id}>
                          <SingleProduct
                            likedData={likedData}
                            item={item}
                            click={handleOnItemClick}
                            dragging={dragging}
                          ></SingleProduct>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          className={`p-1 cursor-pointer hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                          key={item.banner_image_id}
                        >
                          <Link
                            onClick={() => {
                              handleOnItemClick();
                              handleLinkClick(item.banner_image_id);
                            }}
                            href={`${
                              item?.name?.length > 0 && item?.filters != false
                                ? "/" +
                                  item?.name
                                    ?.replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                                    ?.replace(/\s+/g, "-")
                                    ?.replaceAll("/", "-") +
                                  "/" +
                                  types[item.mobile_type].slice(0, 1) +
                                  "=" +
                                  item.mobile_type_id +
                                  "?has_filter=true" +
                                  (item?.filters?.filter_categories
                                    ? "&filter_categories=" +
                                      item?.filters?.filter_categories.map(
                                        (fc) => fc.id
                                      )
                                    : "") +
                                  (item?.filters?.filter_manufacturers
                                    ? "&filter_manufacturers=" +
                                      item?.filters?.filter_manufacturers.map(
                                        (fm) => fm.id
                                      )
                                    : "") +
                                  (item?.filters?.filter_sellers
                                    ? "&filter_sellers=" +
                                      item?.filters?.filter_sellers.map(
                                        (fs) => fs.id
                                      )
                                    : "")
                                : item?.name?.length > 0
                                ? "/" +
                                  item?.name
                                    ?.replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                                    ?.replace("%", "")
                                    ?.replace(/\s+/g, "-")
                                    ?.replaceAll("/", "-") +
                                  "/" +
                                  types[item.mobile_type]?.slice(0, 1) +
                                  "=" +
                                  item.mobile_type_id
                                : "cat/c=" + item.mobile_type_id
                            }`}
                          >
                            
                            <Image
                              alt={item?.name}
                              src={host.host + "/image/" + item.image}
                              width={widget.banner_width}
                              height={widget.banner_height}
                              title={item?.name
                                ?.replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                                ?.replace(/\s+/g, "-")
                                ?.replaceAll("/", "-")}
                              // placeholder={
                              //   "/images/product_placeholder_square.png"
                              // }
                              placeholder="blur"
                              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYkAAAGJCAIAAADwv1jqAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAFGlJREFUeJzt3Ql7olgWgOH5/79uFFFxAdw3XFBwNz0HSWXSVZoCE+Wg3/s46equ6rik/eaCl3v/8w8A6POfrB8AAFxAmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEm57N4XBY/1v4mfx9EK59f71YhL4f+stguVwtl0t/MZ/Pp9PpZDIZjUbD4XAwGPT/0JP/Oe6g0Rw4Tt91e26r47otx7GbTbvRqNfrNcuqVquVSkW+dpq2NxptN5usXxLkEm16Im9vs9nMqlqlvzPjvxhyOysmVyoVTLMgXw2j8PW/eP5d0zQHvd7xeMz61UHO0KbnsV0FUppiqtA8Rslwm8230ynrVwh5QpuehxyUZR2h6wqFmedl/QohT2jT89itN2Y0bso6Q5fI0Z/daLy9vWX9IiE3aNNTWc5mjUajLEzz/SxSSUurSqXShvPiSIw2PZvT6bQTm81qtfKmntfvD3s923FqllWrVEzTjDpRKDy+TdLKMAyzfnmQG7Tphbyd3mTk4ovzdIFOt9tyXbfZtCyrfGaWTONXSP5/Tv2HTq7LuIk2ITnahGhK1FZsNtswlHBNxHDY73YbzWZdRlvVaikebX2vUYybkAptwlVvb29yhHg8HNfr9VLM5t543G63HdsupR9MWbWaRDDr54TcoE24xWq1qlSt5GEqFIuDTjfrR408oU240aTfT34qSo4K10GQ9UNGntAm3GgxniQfN9UbjRPzwpEGbcKN3JabvE3eaJT140XO0CbcYr1cGaVSwjBVKpXDbpf1Q0bO0Cak9vb21m21kg+a+r1e1g8Z+UObkNp+tyuXywnDZBhGwFlwpEebkFqqT+hs2+YSX9yANiGd4/FoJR40iclkkvVDRi7RJqQznc2Sh6lsmrvtNuuHjFyiTUjhdDrVarXkbep2mQuOG9EmpOD7fvIwGcVisFpl/ZCRV7QJKbTb7eRtajIXHN9Am5DUdrN5X5oumel4nPVDRo7RJiQ17PWSh6lUKnEWHN9Bm17a29vb8XBYh2Hg+18v/LbbbE0z6UUqotPpPOxZ4CnRptdyOh5lOBNt4TuZSD7seiNa1vK8g6Z8nY2vzkUadrvJ51vKd1sul498Xng+tOlpyZgo2tMgXM9ns2G/P+h0HMepnBcFv9YUu16/+K1Op1M9zdSBer3OWXB8E216Esfj8bDfB0Ew96aj4bDlujImOm9P8OtA7K+jHsPoue7Fb+7P0u3KedtccN/32+22q0C3253NZjvWTsgUbcql4+Gw3WyC5dKbTge9XqfVjnZ4KpeNzwFKuaR3tDTlev3nfcn4q2nbyb+PBHGf/l09HA5TPdp7K5yXdhkPBhL9n/iJITXapF10uvp43G63MqyYTSbRxk22XbMs44e2ZvrQajYvPoDVapX8vuQt3badtM8xDAK5iwz2zPtS/HgajcZ+v//mDxE3oE3qnE6nzXYTrFbj8XjQ6zuOU6tWy6b5acO4u7wV59PpxceTar6lWPp+2qe88Ly7PKWfUCgUXMdh9PR4tEmX/Xbr1Oqlsvnjw6KvNRuNiyuZbDabUuL1LYu3ngWPx033e3bfJHkaDAY/8eNFCrRJlyAMfmof3VTm8/nFxzMajZJ/k4JRnAyHNzzraCHNbvd+z+6bCvFJNI7sHos26SLvUn+xmIzHk4fwPE/qs5jPLw6ajoeDVa0mfw+b5fLNc8FltDWbzdxoC/SmhCDVYO0x5OF972eLdGgTrhqnGTQVf2hFFKnkdrtdh6EM5UbDoXzPWq1mWdE+nR8nyx9/1lzucdRl1fOHok24LFrfMs2gSdxpLni07/nxGKyC5Xw+HA6dZtNxnGq1+tspqrsG67+Fwvimw1XcjDbhsvlslvzMV+F8FvyRH2btD4cwDFfLpdSq3+s1Gg0ZW31eJuFnU1UoFkZ9Toc/FG16RcdD5Os/067Xi6VS8rf4KNNhRTS2klqtowt0vMnEdV3Htj9vBvP9VI3Y/vOxaNOTO54v7g2CYOp5o8Gw1W43ZYghR0SWJf/k2r+1Tjl1QAYsm83mkc/rr+LzVjK2kucuWZGxlW3b1fNMsRs6Ja/GxUnzuB/a9FTi63uD1WrhTbvdbtt1rVpN3o0XZw/J+2175WO1TqeT6q3barUe/ExvIC+OjBbl9RmPx+XrFzz/qVAoNJtNdrJ6MNqUV/JW2e/3281mvlhMJ5NJf+C4ri0lSrxBkwyd9peO7CRYqda3jHbHTD8XPFvzNLvFiCEnwh+ONuXG6XQKzmd/5Qil2247zaYcoVTMXyWKR0bJ520axeGVj/wHada3LJ7Pgr/lbUUUyXqqrYm/XngP90CbNJIMydHHfreLru8dT3rdbuN8ksj4uUvqZGS0u3QC5YapA3kcUwRprpKp1WosR/V4tCl78VnbYLWSA41oDbhWW94M1UqlEh9Y3eMSFsPoXzlDNJ9OU92jwrPgSQwGg+TPkYvpMkGbMjb1PBkTRccXD7yMrmSWNheXajq9NS0r1SNpuW7uThJHy3jW68mf44pd9rJAm7IkB27vVTLutfLJRe0rgybfm6b9VovF4sEv2velWpGqWq3+dS4Y7oE2ZUlGHJ7nuY1my7ajm+P8yM2Nbu6Fm3xxnLbrXps6IL+bvErRXHDLyt1Z8H/OB3SFQtJJTmybnhXahHfrMEx79f84h7tjHo/HVAd0ft6mRzwN2oR3/X4/VZhyOlU61QFdhQO67NAmRPb7faVSSdUmJ59Tpaeel/CATv5Qv93O+vG+Ltr0/E5nX/+ZVOtbRoziPJ9rraU4p2YYqwUHdJmhTU8o3pdFDl6kOIN+v9Fo1BuNxWz+z5VhzmG/Tzvf0rKsPC7vv9tuk59TK5crrMObIdqUb/EMcsnQYrGYT6edTsd1HAlHvI345yFAxTT3Vz6emw1HaWcwZLsiys2SH9AJ98pOongM2pQn8TID281mNpvJmKjTfp9BnuTkbqVSubZRrd1opgqTaZrXZiFoJq+ebdvJ2+RdX0MGD0CblIoXopUxURAE/nnl7Ha77ZxnkKdaJOCdYbRs++Kp69D3jZRTB2zHyeNZ8GinqcTPVAaeebwW55nQJi2kRPvdLjgvMzDs9eNFZq0/VsW+jbwng/mlCdxvb62qVUzVJsNYjCcPf3l+gNQ5+apyTj77+0xoUwbkP3oZFu3Op6sX02mv1+u0WrXqz28j/sG+sp/4er1OO9+yUq0ec3iGeDwep3qak0ku+/tMaNNDyQHasNeT/0+u12qVcvkH1zz5imHMr0zgTjvfspjPi/JlKJqq+1+sCIqHoU0PVa1WH71tr2HUKpXTpc/7D/t9NeV8y3Le3rQyMGy3WmlfMz6h04A2PdSo25VjooepVCpWrba4MklyOk256oBRtMrlY6bXcMRrfu/3+90lm80mOJvNZnIQJ4mREVDanQsKhQJbqmhAmx7tcIx3YHqQazMkozWMarWUb9tiySgFty5m9PaJ3Lv0RVIS74MiwvMt+lDS9yWa0a5z/X73rN/pxL9qtVrNZtOyLGlu/HmleP/LWTyr65un7aLlz4PgGz9h/Aza9KIWXrr1LT9IGhaLxcdQJdoffL2O1g6ezTzPm3jedDyeyi8mk2jnpX5fguI4TvPMPt9EvV6XYd3nmnz48x4Lj91knBV4laBNr0jGLc1KVUZBN7+Bo3HLWdyXz7/1RUceXJnbSE+z/vkgQpteUeAv7zdfIe9YgVcJ2vSKep3Ooz8uzAk5oMvjNcxPiTa9nO1maxrp5lu+jjzO3npWtOnlpNr+6NUsl8usfz54R5tey+FwSLtU04soFAqVCgs2KUKbXstiscg6AnrxCZ0qtOm1TCeTrAugVK1WY9sCVWjTa5nQpkssy2K1Jm1o02th3PTb5M9SqdTtdq+tCIoM0abX4r/A+aZrU88Nw6hWq3LsVotW7bMcxxmPxwyX1KJNryV3n9MVvvzb4nng83G5b1Qc1+20Iu12ezAYzGazpX+2XIZhGF/8HMv6R4G/oE0vJ+0KkPf2R33e/8H7MMeyolut1mw25eBrKAYD+TKZTKLuLJfr9Xq7iWy3W05mPxPa9HJOp5Nt249v0EdxYu/DHMdpt97Fwxw56oxuvi/DnP1+/zHMYfXuV0ObXtFut2s0GjfX5Vp0yuVyvKadRKder0sB5cCq3+8PevKlPxqNFouFDHN2MsbZbOQxcGCFL9CmFyVdGPR6Zqn0e2v+/XelUsn8fDbHtlu27bquDHMkN9PpdD6dymBHohMEgQxzPta0k9GZkpHObDplHcs8ok0vbROux4Nhy3Gq55FOdP642xv2+8PhcDwey4HVOlxv1uv3szn5PLBqNpuFYnFyZTcHqEWbENEzzPlZh/1ejjSlTTJCDLiON1doE57ZfDr7+BywUqkyxzJHaBOe1n63q3za5Kpw3tzp4nZYUIg24TkdD4eW4/w+V7NQ6HbaWT80JEKb8DziDaaOx6Pv+/V6/dpch/l0mvUjxd/RJqj2ebPM/a8NMuM97DzPm04m8nU0GnU6HTles88sy/rbDC0jZAc69WgTMhCPbuK97cIwjLbQDEMpzmQyed8ys9PpdbvtdjveLLNcLlfON/HbllO/H7R9naVfOm2O7LSjTbjd6XSKBzX7X7uAB0GwWCxm0Uaa0bTMeFDT6/WkMjKucYRtu79GN6ZpJivJz5N7Z1a6crQJX5H0hKtVsFrN5/N4n14JTU8GNZ1uu9VuNBrRDuDVakWYpgxqkmx7p2H7THmoLA2uHG3CVTKykPo85T52zUaDjcWVo024SgZNn+cHXZDPDTgLhYIcbGb96uIvaBO+stlsFvP5bDaLD+g6nU67/WtRE8dpNZvy1bWdZrNZq9Wq54O7csyMzlp/rPomSqXSxSO+QnyUd/1Ir/Cjh4HyrRzb4WSTfrQJPyD+3C0+Ib6NbbabMFr1LV74TazX6yAIfN+PTpR73iQ2Hk+HQ28sfx0Ph8NeryfRk9I1zuqNRrNel1v063o9/sDut8/p/lquwqc/I1/bjsMSdLlAm6DO22enk9xikr94flMYhqvVankmtQvPv1gsFtPzciifx3fRci6uG4/05Kv8mae8pPkp0SYAGtEmABrRJgAa0SZ8ZbfbnfdPWh4feP74sN/H+zZx0vqV0SZc9nY6DQf96q/N7GrVqjeZPOBEsud51q9JVXLvw+GQSZKviTbhAmlQz7aLpd+nI42Gw7ver5Toz0kAnU6HD9deEG3CBcvZrHjpcv+yaW7vtqztZr2+fDmeYSx9/053CrVoEy7oue7l61FKxmxwr6GTHM1dnjxpGL1W6053CrVoEy5wWq3LmTDNaeteKx/1B4PLd1os9tqdO90p1KJNuGDUbl8eNxnGfHKvq2TnciB5Zdw06NCml0ObcME2DEuXFn6rVe+4JNt+v7+47IFpmpvN5k53CrVoEy6beVOj+K9VUKRW/mJx1zv1ff9fi2EakSlbD7wk2oSrlr7fbbWr1aplWf1ebx2GD7jTMAx73a51vtOe21qyGe+rok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADT6H6xYY8Vnx8fZAAAAAElFTkSuQmCC"
                            />
                          </Link>
                        </div>
                      );
                    }
                  })}
                </Slider>
              </div>
              {/* ) : ( */}
              <div className="block mobile:hidden">
                <div className="flex overflow-x-auto space-x-2 ">
                  {widget?.display === "carousel" &&
                    widget.type !== "text" &&
                    widget?.items[0]?.product_id &&
                    widget.items?.map((item) => {
                      return (
                        <div className="" key={item.product_id}>
                          <SingleProduct
                            scroll={true}
                            item={item}
                          ></SingleProduct>
                        </div>
                      );
                    })}
                </div>
                {/* <Slider {...productMobile}>
                    {widget.items?.map((item) => {
                      if (item.product_id) {
                        return (
                          <div
                            className="pr-2 "
                            key={item.product_id}
                          >
                            
                            <SingleProduct
                              item={item}
                            ></SingleProduct>
                          </div>
                        );
                      } else {
                        return (
                          <div className={`pr-2`} key={item.banner_image_id}>
                            <Link
                              href={
                                // accountState.admin
                                //   ? `${path}/${types[item.mobile_type]}/${
                                //       item.mobile_type_id
                                //     }`
                                //   :
                                item?.name?.length > 0 && item.filters != false
                                  ? "/" +
                                    item?.name
                                      ?.replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                                      ?.replace(/\s+/g, "-")
                                      ?.replaceAll("/", "-")
                                      ?.replace("%", "") +
                                    "/" +
                                    types[item.mobile_type]?.slice(0, 1) +
                                    "=" +
                                    item.mobile_type_id +
                                    "?has_filter=true" +
                                    (item?.filters?.filter_categories
                                      ? "&filter_categories=" +
                                        item?.filters?.filter_categories.map(
                                          (fc) => fc.id
                                        )
                                      : "") +
                                    (item?.filters?.filter_manufacturers
                                      ? "&filter_manufacturers=" +
                                        item?.filters?.filter_manufacturers.map(
                                          (fm) => fm.id
                                        )
                                      : "") +
                                    (item?.filters?.filter_sellers
                                      ? "&filter_sellers=" +
                                        item?.filters?.filter_sellers.map(
                                          (fs) => fs.id
                                        )
                                      : "")
                                  : item?.name?.length > 0
                                  ? "/" +
                                    item?.name
                                      ?.replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                                      ?.replace(/\s+/g, "-")
                                      ?.replaceAll("/", "-")
                                      ?.replace("%", "") +
                                    "/" +
                                    types[item.mobile_type].slice(0, 1) +
                                    "=" +
                                    item.mobile_type_id
                                  : "cat/c=" + item.mobile_type_id
                              }
                            >
                              <ImageClient
                                alt={item?.name}
                                src={item.image}
                                width={widget.banner_width}
                                height={widget.banner_height}
                                title={item?.name
                                  ?.replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                                  ?.replace(/\s+/g, "-")
                                  ?.replaceAll("/", "-")}
                                placeholder={
                                  "/images/product_placeholder_square.png"
                                }
                              />
                            </Link>
                          </div>
                        );
                      }
                    })}
                  </Slider> */}
              </div>
              {/* )} */}
            </div>
          ) : (
            <div className="">
              <div className="flex overflow-x-auto space-x-2 mobile:hidden">
                {widget?.display === "carousel" &&
                  widget.type !== "text" &&
                  widget?.items[0]?.product_id &&
                  widget.items?.map((item) => {
                    return (
                      <div className="" key={item.product_id}>
                        {/* <SingleProduct
                          scroll={true}
                          item={item}
                        ></SingleProduct> */}
                        <SingleProductTest
                          scroll={true}
                          item={item}
                        ></SingleProductTest>
                      </div>
                    );
                  })}
              </div>

              {/* kmn by3ml mshkle */}
              {width > 650 && (
                <div className=" hidden mobile:block">
                  <Slider
                    {...productSetting}
                    beforeChange={handleBeforeChange}
                    afterChange={handleAfterChange}
                  >
                    {widget.items?.map((item) => {
                      if (item.product_id) {
                        return (
                          <div className="pr-3" key={item.product_id}>
                            <SingleProduct
                              item={item}
                              click={handleOnItemClick}
                              dragging={dragging}
                            ></SingleProduct>
                          </div>
                        );
                      } else {
                        return (
                          <div
                            className={`p-1 cursor-pointer hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                            key={item.banner_image_id}
                          >
                            <Link
                              onClick={() =>
                                handleLinkClick(item.banner_image_id)
                              }
                              onClickCapture={handleOnItemClick}
                              href={
                                item?.name?.length > 0 && item.filters != false
                                  ? "/" +
                                    item?.name
                                      ?.replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                                      ?.replace(/\s+/g, "-")
                                      ?.replaceAll("/", "-")
                                      ?.replace("%", "") +
                                    "/" +
                                    types[item.mobile_type].slice(0, 1) +
                                    "=" +
                                    item.mobile_type_id +
                                    "?has_filter=true" +
                                    (item?.filters?.filter_categories
                                      ? "&filter_categories=" +
                                        item?.filters?.filter_categories.map(
                                          (fc) => fc.id
                                        )
                                      : "") +
                                    (item?.filters?.filter_manufacturers
                                      ? "&filter_manufacturers=" +
                                        item?.filters?.filter_manufacturers.map(
                                          (fm) => fm.id
                                        )
                                      : "") +
                                    (item?.filters?.filter_sellers
                                      ? "&filter_sellers=" +
                                        item?.filters?.filter_sellers.map(
                                          (fs) => fs.id
                                        )
                                      : "")
                                  : item?.name?.length > 0
                                  ? "/" +
                                    item?.name
                                      ?.replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                                      ?.replace(/\s+/g, "-")
                                      ?.replaceAll("/", "-")
                                      ?.replace("%", "") +
                                    "/" +
                                    types[item.mobile_type].slice(0, 1) +
                                    "=" +
                                    item.mobile_type_id
                                  : "cat/c=" + item.mobile_type_id
                              }
                            >
                            
                              <Image
                                alt={item?.name}
                                src={host.host + "/image/" + item.image}
                                width={widget.banner_width}
                                height={widget.banner_height}
                                title={item?.name
                                  ?.replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                                  ?.replace(/\s+/g, "-")
                                  ?.replaceAll("/", "-")}
                                placeholder="blur"
                                blurDataURL="data:image/png;base64,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"
                                // placeholder={
                                //   "/images/product_placeholder_square.png"
                                // }
                              />
                            </Link>
                          </div>
                        );
                      }
                    })}

                  </Slider>
                </div>
              )}
            </div>
          )}{" "}
        </div>
      )}
    </div>
  );
}

export default WidgetsLoop;

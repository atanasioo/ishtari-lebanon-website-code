import SingleProduct from "./product/SingleProduct.js";
import Slider from "react-slick";
import DOMPurify from "dompurify";
import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { SliderPlaceholder } from "/public/images/placeholder_slideshow.png";
import { ProductPlaceholder } from "/public/images/product_placeholder_square.png";

import { Pagination, Navigation, Autoplay } from "swiper";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import ImageClient from "./imageClient";
import Link from "next/link";
import dynamic from "next/dynamic";

function WidgetsLoop({ widget, likedData, width, initialLoading }) {
  const ImageClient = dynamic(() => import("./ImageClient.js"), { ssr: false });

  const [showNext, setShowNext] = useState(false);
  const [showPrev, setShowPrev] = useState(false);
  const swiperNavNextRef = useRef(null);
  const swiperNavPrevRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const types = {
    1: "product",
    2: "category",
    3: "manufacturer",
    4: "seller",
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
  }, [setDragging]);

  const handleAfterChange = useCallback(() => {
    setDragging(false);
  }, [setDragging]);

  const handleOnItemClick = useCallback(
    (e) => {
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
                <div
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
                </div>
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
            {width === "desktop" ? (
              <Swiper
                slidesPerView={1}
                autoplay={true}
                loop={true}
                pagination={{ clickable: true }}
                navigation={{
                  nextEl: swiperNavNextRef.current,
                  prevEl: swiperNavPrevRef.current,
                }}
                modules={[Pagination, Navigation, Autoplay]}
                className="sliderSwiper"
              >
                {widget.items.map((item, index) => {
                  return (
                    <SwiperSlide key={`sliderr` + index}>
                      {item.mobile_type_id === "0" ? (
                        item?.mobile_type == "6" ? (
                          <Link
                            data-index={index}
                            href={"/latest"}
                            key={Math.random()}
                            onClick={() => {
                              if (
                                types[item.mobile_type]?.slice(0, 1) === "p"
                              ) {
                                setProductHolder({});
                              }
                            }}
                          >
                            <ImageClient
                              alt={item?.name}
                              src={item.image}
                              className="w-full"
                              width={widget.banner_width}
                              height={widget.banner_height}
                              placeholder={SliderPlaceholder}
                            />
                          </Link>
                        ) : (
                          <div data-index={index} key={`slider` + index}>
                            <ImageClient
                              alt={item?.name}
                              src={item.image}
                              className="w-full"
                              width={widget.banner_width}
                              height={widget.banner_height}
                              placeholder={SliderPlaceholder}
                            />
                          </div>
                        )
                      ) : (
                        <Link
                          data-index={index}
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
                          onClick={() => {
                            if (types[item.mobile_type]?.slice(0, 1) === "p") {
                              setProductHolder({});
                            }
                          }}
                        >
                          <ImageClient
                            src={item.image}
                            alt={item?.name}
                            width={widget.banner_width}
                            height={widget.banner_height}
                            className="w-full"
                            placeholder={SliderPlaceholder}
                          />
                        </Link>
                      )}
                    </SwiperSlide>
                  );
                })}
                <div
                  className="swiper-button-next"
                  ref={swiperNavPrevRef}
                  onMouseEnter={handleMouseEnterPrev}
                  onMouseLeave={handleMouseLeavePrev}
                >
                  <svg
                    width="44"
                    height="502"
                    viewBox="0 0 44 502"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`heEmBF ${
                      showPrev
                        ? "activeTransform"
                        : `${
                            showPrev && widget.banner_height < 400
                              ? "activeTransformSmaller"
                              : ""
                          }`
                    }`}
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
                <div
                  className="swiper-button-prev"
                  ref={swiperNavNextRef}
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
              </Swiper>
            ) : (
              <Slider {...settingM}>
                {widget.items.map((item, index) =>
                  item.mobile_type_id === "0" ? (
                    <div data-index={index} key={`sliderM` + index}>
                      <ImageClient
                        alt={item?.name}
                        src={item.image}
                        className="w-full"
                        height={widget.banner_height}
                        width={widget.banner_width}
                        placeholder={SliderPlaceholder}
                      />
                    </div>
                  ) : (
                    <Link
                      data-index={index}
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
                      <ImageClient
                        alt={item?.name}
                        src={item.image}
                        className="w-full"
                        height={widget.banner_height}
                        width={widget.banner_width}
                        placeholder={SliderPlaceholder}
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
                    <ImageClient
                      alt={item?.name}
                      src={item.image}
                      width={widget.banner_width}
                      height={widget.banner_height}
                      title={item?.name
                        ?.replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                        ?.replace("%", "")
                        ?.replace(/\s+/g, "-")
                        ?.replaceAll("/", "-")}
                      className={`${true && "w-full"}`}
                    />
                  </Link>
                </div>
              ) : (
                <div
                  className={`p-1 w-full hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                  key={item.banner_image_id}
                >
                  <div>
                    <ImageClient
                      alt={item?.name}
                      src={item.image}
                      width={widget.banner_width}
                      height={widget.banner_height}
                      title={item?.name
                        .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                        .replace("%", "")
                        .replace(/\s+/g, "-")
                        .replaceAll("/", "-")}
                      className={"w-full"}
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
                  onClick={() => {
                    if (types[item.mobile_type]?.slice(0, 1) === "p") {
                      setProductHolder(item);
                    }
                  }}
                >
                  <ImageClient
                    alt={item?.name}
                    src={item.image}
                    width={widget?.banner_width}
                    height={widget?.banner_height}
                    title={item?.name
                      .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                      .replace("%", "")
                      .replace(/\s+/g, "-")
                      .replaceAll("/", "-")}
                    className={`${!bool && "w-full"}`}
                  />
                </Link>
              </div>
            ) : item.mobile_type === "6" ? (
              <div
                className={`hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                key={item.banner_image_id}
              >
                <Link href={"/latest"}>
                  <ImageClient
                    alt={item?.name}
                    src={item.image}
                    width={widget.banner_width}
                    height={widget.banner_height}
                    title={item?.name}
                    className={"w-full"}
                  />
                </Link>
              </div>
            ) : (
              <div
                className={`hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                key={item.banner_image_id}
              >
                <ImageClient
                  alt={item?.name}
                  src={item.image}
                  width={widget.banner_width}
                  height={widget.banner_height}
                  title={item?.name
                    .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                    .replace("%", "")
                    .replace(/\s+/g, "-")
                    .replaceAll("/", "-")}
                  className={`${"w-full"}`}
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
                    onClick={() => {
                      if (types[item.mobile_type]?.slice(0, 1) === "p") {
                        setProductHolder(item);
                      }
                    }}
                  >
                    <ImageClient
                      alt={item?.name}
                      src={item.image}
                      width={widget.banner_width}
                      height={widget.banner_height}
                      title={item?.name
                        .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                        .replace("%", "")
                        .replace(/\s+/g, "-")
                        .replaceAll("/", "-")}
                      className={`${"w-full"}`}
                    />
                  </Link>
                </div>
              ) : item.mobile_type === "6" ? (
                <div
                  className={` w-full hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                  key={item.banner_image_id}
                >
                  <Link href={"/latest"}>
                    <ImageClient
                      alt={item?.name}
                      src={item.image}
                      width={widget.banner_width}
                      height={widget.banner_height}
                      title={item?.name}
                      className={"w-full"}
                    />
                  </Link>
                </div>
              ) : (
                <div
                  className={`  hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                  key={item.banner_image_id}
                >
                  <div>
                    <ImageClient
                      alt={item?.name}
                      src={item.image}
                      width={widget.banner_width}
                      height={widget.banner_height}
                      title={item?.name
                        ?.replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                        ?.replace(/\s+/g, "-")
                        ?.replaceAll("/", "-")}
                      className={"w-full"}
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
            <div className="flex">
              {/* {width > 650 ? ( */}
              <div classNsame="hidden mobile:block px-6">
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
                            onClick={handleOnItemClick}
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
                            <ImageClient
                              alt={item?.name}
                              src={item.image}
                              width={widget.banner_width}
                              height={widget.banner_height}
                              title={item?.name
                                ?.replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                                ?.replace(/\s+/g, "-")
                                ?.replaceAll("/", "-")}
                              placeholder={ProductPlaceholder}
                            />
                          </Link>
                        </div>
                      );
                    }
                  })}
                </Slider>
              </div>
              {/* ) : ( */}
              <div className=" block mobile:hidden">
                <Slider {...productMobile}>
                  {widget.items?.map((item) => {
                    if (!item.product_id) {
                      //   return (

                      //     // <div className="pr-2" key={item.product_id}>
                      //     //   <SingleProduct
                      //     //     item={item}
                      //     //   ></SingleProduct>
                      //     // </div>
                      //   );
                      // } else {
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
                            <ImageClient
                              alt={item?.name}
                              src={item.image}
                              width={widget.banner_width}
                              height={widget.banner_height}
                              title={item?.name
                                ?.replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                                ?.replace(/\s+/g, "-")
                                ?.replaceAll("/", "-")}
                              placeholder={ProductPlaceholder}
                            />
                          </Link>
                        </div>
                      );
                    }
                  })}
                </Slider>
              </div>
              {/* )} */}
            </div>
          ) : (
            <div className="">
              <div className="flex overflow-x-auto space-x-2  mobile:hidden">
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
              <div className=" bg-white hidden mobile:block  ">
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
                            <ImageClient
                              alt={item?.name}
                              src={item.image}
                              width={widget.banner_width}
                              height={widget.banner_height}
                              title={item?.name
                                ?.replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                                ?.replace(/\s+/g, "-")
                                ?.replaceAll("/", "-")}
                              placeholder={ProductPlaceholder}
                            />
                          </Link>
                        </div>
                      );
                    }
                  })}

                  {/* <div>omar</div> */}
                </Slider>
              </div>

              <div className=" block mobile:hidden">
                <Slider {...productMobile}>
                  {widget.items?.map((item) => {
                    if (item.product_id) {
                      return (
                        <div className="pr-2" key={item.product_id}>
                          {/* <SingleProduct
                              likedData={likedData}
                              item={item}
                            ></SingleProduct> */}
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
                            <ImageClient
                              alt={item?.name}
                              src={item.image}
                              width={widget.banner_width}
                              height={widget.banner_height}
                              title={item?.name
                                ?.replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                                ?.replace(/\s+/g, "-")
                                ?.replaceAll("/", "-")}
                              placeholder={ProductPlaceholder}
                            />
                          </Link>
                        </div>
                      );
                    }
                  })}
                </Slider>
              </div>
            </div>
          )}{" "}
        </div>
      )}
    </div>
  );
}

export default WidgetsLoop;

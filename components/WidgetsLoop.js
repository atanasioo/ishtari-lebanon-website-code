import SingleProduct from "./product/SingleProduct.js";
import Slider from "react-slick";
import Image from "next/legacy/image";
import { useRef, useState, useCallback, useEffect, useContext } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import useDeviceSize from "./useDeviceSize.js";
import SingleProductTest from "./product/SingleProductTest.js";
import { useRouter } from "next/router.js";
import { useMarketingData } from "@/contexts/MarketingContext.js";
import { HostContext } from "@/contexts/HostContext.js";
import { sanitizeHTML } from "./Utils.js";
import { AccountContext } from "@/contexts/AccountContext.js";
import BannerLink from "./widgetsComponents/BannerLink.js";

function WidgetsLoop({ widget, likedData, bannerStats }) {
  const [showNext, setShowNext] = useState(false);
  const [showPrev, setShowPrev] = useState(false);
  const swiperNavNextRef = useRef(null);
  const swiperNavPrevRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [width] = useDeviceSize();
  const router = useRouter();
  const { setMarketingData } = useMarketingData();
  const [appliedStyles, setAppliedStyles] = useState({});
  const [correspondingStats, setCorrespondingStats] = useState({});
  const { showStats } = useMarketingData();
  const [accountState] = useContext(AccountContext);
  const host = useContext(HostContext);
  const  noAddCart= true
  const catalog =
    router.asPath.startsWith("/category") ||
    router.asPath.includes("c=") ||
    router.asPath.startsWith("/seller") ||
    router.asPath.includes("s=") ||
    router.asPath.startsWith("/manufacturer") ||
    router.asPath.includes("m=")
      ? true
      : false;
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
    Object.keys(router.query).length > 0 &&
    typeof router.query.slug !== "undefined"
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

  // console.log(bannerStats);

  useEffect(() => {
    // Apply styles after component mounts
    const styles = {
      backgroundColor:
        widget?.background_color !== "#000000" && widget?.background_color,
      paddingLeft: widget.padding_left !== "-1" && widget.padding_left + "%",
      paddingRight: widget.padding_right !== "-1" && widget.padding_right + "%",
      paddingBottom:
        widget.padding_bottom !== "-1" && widget.padding_bottom + "%",
      paddingTop: widget.padding_top !== "-1" && widget.padding_top + "%",
      marginLeft: widget.margin_left !== "-1" ? widget.margin_left + "%" : "",
      marginRight: widget.margin_right !== "-1" && widget.margin_right + "%",
      marginBottom: widget.margin_bottom !== "-1" && widget.margin_bottom + "%",
      marginTop: widget.margin_top !== "-1" && widget.margin_top + "%",
    };
    // setAppliedStyles(styles);
  }, [widget]);

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
    slidesToShow:
      widget?.items?.length < 7 ? widget?.items?.length  : (catalog && widget?.items && widget?.items[0]?.product_id)  ? 6 : 7,
    slidesToScroll: 7,
    infinite: true,
    prevArrow: <CustomPrevArrows direction={"l"} />,
    nextArrow: <CustomNextArrows direction={"r"} />,
  };

  // slidesToShow: widget?.items?.length < 7 ? widget?.items?.length : 7,
  // slidesToScroll: 7,

  const twoRowsSettings = {
    slidesPerRow: 7,
    rows: 2,
    infinite: false,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesPerRow: 1,
          rows: 2,
        },
      },
    ],
    arrows: true,
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
        style={{ ...style, padding: "2px 5px" }}
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
      style={appliedStyles}
      className={
        widget.padding_left > -1
          ? "-mx-3"
          : widget.display === "grid" && widget?.background_color !== "#000000"
          ? "-mx-4 md:mx-0"
          : ""
      }
    >
      {/* view all button */}
      {widget?.display === "carousel" && widget?.view_title !== "0" && (
        <div className="flex items-center justify-between  mb-3">
          {widget.view_title !== "0" && (
            <h1
              className="pr-semibold p-2 text-xl"
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

      {/* text */}
      {widget.type === "text" && (
        <div
          className="w-full widget_text"
          dangerouslySetInnerHTML={{
            __html: sanitizeHTML(widget.html_content),
          }}
        />
      )}

      {/* Slider  */}
      {widget?.display === "slider" &&
        widget.type !== "text" &&
        (widget.items.length > 1 ? (
          <div className="-mx-4 mb-2">
            {width > 650 ? (
              <Slider {...settingSliderD} className="sliderSwiper">
                {widget.items.map((item, index) =>
                  item.mobile_type_id === "0" ? (
                    <div
                      data-index={index}
                      key={`sliderM` + index}
                      className="relative placeHolderSlideCSS"
                    >
                      <Image
                        alt={item?.name}
                        src={host.host + "/image/" + item.image}
                        className="w-full"
                        height={widget.banner_height}
                        width={widget.banner_width}
                        
                       
                      />
                    </div>
                  ) : (
                    <BannerLink
                      widget={widget}
                      item={item}
                      bannerStats={bannerStats}
                      handleLinkClick={handleLinkClick}
                      types={types}
                      sliderBanner={true}
                      index={index}
                    />
                  )
                )}
              </Slider>
            ) : (
              <Slider {...settingM}>
                {widget.items.map((item, index) =>
                  item.mobile_type_id === "0" ? (
                    <div
                      data-index={index}
                      key={`sliderM` + index}
                      className="relative"
                    >
                      <Image
                        alt={item?.name}
                        src={host.host + "/image/" + item.image}
                        className="w-full placeHolderSlideCSS"
                        height={widget.banner_height}
                        width={widget.banner_width}
                         
              
                      />
                    </div>
                  ) : (
                    <BannerLink
                      widget={widget}
                      item={item}
                      bannerStats={bannerStats}
                      handleLinkClick={handleLinkClick}
                      types={types}
                      sliderBanner={true}
                      index={index}
                    />
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
                  <BannerLink
                    widget={widget}
                    item={item}
                    bannerStats={bannerStats}
                    handleLinkClick={handleLinkClick}
                    types={types}
                    sliderSingleBanner={true}
                  />
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
                      className={"w-full placeHolderSlideCSS"}
                      
                    
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ))}

      {/* Grid */}
      {widget?.display === "grid" &&
        widget.type !== "text" &&
        widget.column_number < 7 && (
          <div className="flex -mx-4 flex-wrap justify-between">
            {widget.items.map((item) => {
              const bool = widget.items.length > 0;

              return item.mobile_type_id !== "0" ? (
                <div
                  className={`  ${
                    !bool && "w-full"
                  } cursor-pointer flex justify-center p-[1px] hover:opacity-80 w-1/${
                    widget.column_number
                  } md:w-1/${widget.column_number}`}
                  key={item.banner_image_id}
                  style={{
                    width:
                      widget.column_number === "1"
                        ? "unset"
                        : `calc(100% / ${widget.column_number}) `,
                  }}
                >
                  <BannerLink
                    widget={widget}
                    item={item}
                    bannerStats={bannerStats}
                    handleLinkClick={handleLinkClick}
                    types={types}
                    bool={bool}
                  />
                </div>
              ) : item.mobile_type === "6" ? (
                <div
                  className={`hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                  key={item.banner_image_id}
                >
                  <Link
                    onClick={() => handleLinkClick(item.banner_image_id)}
                    href={"/latest"}
                    className="relative"
                  >
                    <Image
                      alt={item?.name}
                      src={host.host + "/image/" + item.image}
                      width={widget.banner_width}
                      height={widget.banner_height}
                      title={item?.name}
                      className={"w-full placeHolderSlideCSS"}
                                     
                    />
                    {showStats &&
                      typeof bannerStats !== "undefined" &&
                      bannerStats.length > 0 &&
                      bannerStats.some(
                        (stats) =>
                          stats.banner_image_id === item.banner_image_id
                      ) && (
                        <div
                          className="absolute z-10 bottom-5 right-3 text-d10 md:text-d13 px-2.5 py-1.5 pr-semibold rounded-full"
                          style={{ background: "hsla(0,0%,100%,.9)" }}
                        >
                          {bannerStats
                            .filter(
                              (stats) =>
                                stats.banner_image_id === item.banner_image_id
                            )
                            .map((stats) => (
                              <div key={stats.banner_image_id}>
                                Clicks: {stats.clicks}, Source: {stats.source}
                              </div>
                            ))}
                        </div>
                      )}
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
                    className={`${"w-full placeHolderSlideCSS"}`}

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
                  } cursor-pointer flex justify-center hover:opacity-80 p-[1px] w-1/${
                    widget.column_number
                  } md:w-1/${widget.column_number}`}
                  key={item.banner_image_id}
                >
                  <BannerLink
                    widget={widget}
                    item={item}
                    bannerStats={bannerStats}
                    handleLinkClick={handleLinkClick}
                    types={types}
                    bool={bool}
                  />
                </div>
              ) : item.mobile_type === "6" ? (
                <div
                  className={` w-full hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                  key={item.banner_image_id}
                >
                  <Link
                    onClick={() => handleLinkClick(item.banner_image_id)}
                    href={"/latest"}
                    className="relative"
                  >
                    <Image
                      alt={item?.name}
                      src={host.host + "/image/" + item.image}
                      width={widget.banner_width}
                      height={widget.banner_height}
                      title={item?.name}
                      className={"w-full placeHolderSlideCSS"}
                  
                     
                    />
                    {showStats &&
                      typeof bannerStats !== "undefined" &&
                      bannerStats.length > 0 &&
                      bannerStats.some(
                        (stats) =>
                          stats.banner_image_id === item.banner_image_id
                      ) && (
                        <div
                          className="absolute z-10 bottom-5 right-3 text-d10 md:text-d13 px-2.5 py-1.5 pr-semibold rounded-full"
                          style={{ background: "hsla(0,0%,100%,.9)" }}
                        >
                          {bannerStats
                            .filter(
                              (stats) =>
                                stats.banner_image_id === item.banner_image_id
                            )
                            .map((stats) => (
                              <div key={stats.banner_image_id}>
                                Clicks: {stats.clicks}, Source: {stats.source}
                              </div>
                            ))}
                        </div>
                      )}
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
                      className={"w-full placeHolderSlideCSS"}
        
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {widget?.display === "carousel" && widget.type !== "text" && (
        <div>
          {/* <AutoScroll     widget={widget}/> */}
          {widget?.items?.length < 7 ? (
            <div className="mobile:flex">
              {width > 650 ? (
                <div className="hidden mobile:block px-6">
                  {widget.row_number === "2" ? (
                    <Slider {...twoRowsSettings}>
                      {widget.items?.slice(0, 12).map((item) => {
                        if (item.product_id) {
                          return (
                            <div className="pr-2" key={item.product_id}>
                              <SingleProduct
                                likedData={likedData}
                                item={item}
                                click={handleOnItemClick}
                                dragging={dragging}
                                noAddCart={noAddCart}
                              ></SingleProduct>
                            </div>
                          );
                        } else {
                          return (
                            <div
                              className={`p-1 cursor-pointer hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                              key={item.banner_image_id}
                            >
                              <BannerLink
                                widget={widget}
                                item={item}
                                bannerStats={bannerStats}
                                handleLinkClick={handleLinkClick}
                                handleOnItemClick={handleOnItemClick}
                                types={types}
                                carouselBanner={true}
                              />
                            </div>
                          );
                        }
                      })}
                      {widget.items?.slice(12, 24).map((item) => {
                        if (item.product_id) {
                          return (
                            <div className="pr-2" key={item.product_id}>
                              <SingleProduct
                                likedData={likedData}
                                item={item}
                                click={handleOnItemClick}
                                dragging={dragging}
                                noAddCart={noAddCart}
                              ></SingleProduct>
                            </div>
                          );
                        } else {
                          return (
                            <div
                              className={`p-1 cursor-pointer hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                              key={item.banner_image_id}
                            >
                              <BannerLink
                                widget={widget}
                                item={item}
                                bannerStats={bannerStats}
                                handleLinkClick={handleLinkClick}
                                handleOnItemClick={handleOnItemClick}
                                types={types}
                                carouselBanner={true}
                              />
                            </div>
                          );
                        }
                      })}
                    </Slider>
                  ) : (
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
                                noAddCart={noAddCart}
                              ></SingleProduct>
                            </div>
                          );
                        } else {
                          return (
                            <div
                              className={`p-1 cursor-pointer hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                              key={item.banner_image_id}
                            >
                              <BannerLink
                                widget={widget}
                                item={item}
                                bannerStats={bannerStats}
                                handleLinkClick={handleLinkClick}
                                handleOnItemClick={handleOnItemClick}
                                types={types}
                                carouselBanner={true}
                              />
                            </div>
                          );
                        }
                      })}
                    </Slider>
                  )}
                </div>
              ) : (
                <div className="block mobile:hidden">
                  <div className="flex overflow-x-auto space-x-2 ">
                    {widget?.display === "carousel" &&
                      widget.type !== "text" &&
                      widget?.items[0]?.product_id &&
                      widget.items?.map((item) => {
                        if (item.product_id) {
                          return (
                            <div className="" key={item.product_id}>
                              <SingleProduct
                                scroll={true}
                                item={item}
                                noAddCart={noAddCart}
                              ></SingleProduct>
                            </div>
                          );
                        } else {
                          return (
                            <BannerLink
                              widget={widget}
                              item={item}
                              bannerStats={bannerStats}
                              handleLinkClick={handleLinkClick}
                              handleOnItemClick={handleOnItemClick}
                              types={types}
                              carouselBannerCap={true}
                            />
                          );
                        }
                      })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full ">
              {widget.row_number === "2" ? (
                <div className="mobile:hidden">
                  <div className="flex flex-col overflow-x-auto">
                    <div className="flex space-x-2 mb-2">
                      {widget?.display === "carousel" &&
                        widget.type !== "text" &&
                        widget?.items[0]?.product_id &&
                        widget.items?.slice(0, 12).map((item) => {
                          return (
                            <div className="" key={item.product_id}>
                              <SingleProductTest
                                scroll={true}
                                item={item}
                                noAddCart={noAddCart}
                              ></SingleProductTest>
                            </div>
                          );
                        })}
                    </div>
                    <div className="flex space-x-2 mb-2">
                      {widget?.display === "carousel" &&
                        widget.type !== "text" &&
                        widget?.items[0]?.product_id &&
                        widget.items?.slice(12, 24).map((item) => {
                          return (
                            <div className="" key={item.product_id}>
                              <SingleProductTest
                                scroll={true}
                                item={item}
                              ></SingleProductTest>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="">
                  <div className="flex overflow-x-auto space-x-2 mobile:hidden overflow-hidden">
                    {widget?.display === "carousel" &&
                      widget.type !== "text" &&
                      widget.items?.map((item) => {
                        if (item?.product_id)
                          return (
                            <div className="" key={item.product_id}>
                              <SingleProductTest
                                scroll={true}
                                item={item}
                              ></SingleProductTest>
                            </div>
                          );
                        else
                          return (
                            <div
                              className={`p-1 min-w-max `}
                              key={item.banner_image_id}
                            >
                              {!widget?.scrolling && (
                                <BannerLink
                                  widget={widget}
                                  item={item}
                                  bannerStats={bannerStats}
                                  handleLinkClick={handleLinkClick}
                                  handleOnItemClick={handleOnItemClick}
                                  types={types}
                                  // carouselBannerCap={true}
                                />
                              )}
                            </div>
                          );
                      })}
                  </div>
                </div>
              )}

              {/* kmn by3ml mshkle */}
              {width > 650 && !widget?.scrolling && (
                <div className=" hidden mobile:block">
                  {widget.row_number === "2" ? (
                    <Slider
                      {...twoRowsSettings}
                      beforeChange={handleBeforeChange}
                      afterChange={handleAfterChange}
                    >
                      {widget.items?.slice(0, 12).map((item) => {
                        if (item.product_id) {
                          return (
                            <div className="pr-3 mb-3" key={item.product_id}>
                              <SingleProduct
                                item={item}
                                click={handleOnItemClick}
                                dragging={dragging}
                                carousel={true}
                                noAddCart={noAddCart}
                              ></SingleProduct>
                            </div>
                          );
                        } else {
                          return (
                            <div
                              className={`p-1 cursor-pointer mb-3 hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                              key={item.banner_image_id}
                            >
                              <BannerLink
                                widget={widget}
                                item={item}
                                bannerStats={bannerStats}
                                handleLinkClick={handleLinkClick}
                                handleOnItemClick={handleOnItemClick}
                                types={types}
                                carouselBannerCap={true}
                              />
                            </div>
                          );
                        }
                      })}
                      {widget.items?.slice(12, 24).map((item) => {
                        if (item.product_id) {
                          return (
                            <div className="pr-3 mb-3" key={item.product_id}>
                              <SingleProduct
                                item={item}
                                click={handleOnItemClick}
                                dragging={dragging}
                                carousel={true}
                                noAddCart={noAddCart}
                              ></SingleProduct>
                            </div>
                          );
                        } else {
                          return (
                            <div
                              className={`p-1 cursor-pointer mb-3 hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                              key={item.banner_image_id}
                            >
                              <BannerLink
                                widget={widget}
                                item={item}
                                bannerStats={bannerStats}
                                handleLinkClick={handleLinkClick}
                                handleOnItemClick={handleOnItemClick}
                                types={types}
                                carouselBannerCap={true}
                              />
                            </div>
                          );
                        }
                      })}
                    </Slider>
                  ) : (
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
                                carousel={true}
                                noAddCart={noAddCart}
                              ></SingleProduct>
                            </div>
                          );
                        } else {
                          return (
                            <div
                              className={`p-1 cursor-pointer hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                              key={item.banner_image_id}
                            >
                              {/* here */}
                              <BannerLink
                                widget={widget}
                                item={item}
                                bannerStats={bannerStats}
                                handleLinkClick={handleLinkClick}
                                handleOnItemClick={handleOnItemClick}
                                types={types}
                                carouselBannerCap={true}
                              />
                            </div>
                          );
                        }
                      })}
                    </Slider>
                  )}
                </div>
              )}
              {/* test */}
              {widget?.scrolling && (
                <div className="">
                  <div class="scroll-container" style={{ width: "1100%" }}>
                    <div
                      class="content flex "
                      id="content"
                      style={{
                        animation: `scroll ${
                          widget.duration > 0 ? widget.duration - 350 : 200
                        }s linear infinite `,
                      }}
                    >
                      {widget.row_number === "2" ? (
                        <div className="mobile:hidden">
                          <div className="flex flex-col overflow-x-auto">
                            <div className="flex space-x-2 mb-2">
                              {widget?.display === "carousel" &&
                                widget.type !== "text" &&
                                widget?.items[0]?.product_id &&
                                widget.items?.slice(0, 12).map((item) => {
                                  return (
                                    <div className="" key={item.product_id}>
                                      <SingleProductTest
                                        scroll={true}
                                        item={item}
                                        noAddCart={noAddCart}
                                      ></SingleProductTest>
                                    </div>
                                  );
                                })}
                            </div>
                            <div className="flex space-x-2 mb-2">
                              {widget?.display === "carousel" &&
                                widget.type !== "text" &&
                                widget?.items[0]?.product_id &&
                                widget.items?.slice(12, 24).map((item) => {
                                  return (
                                    <div className="" key={item.product_id}>
                                      <SingleProductTest
                                        scroll={true}
                                        item={item}
                                      ></SingleProductTest>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          {[1, 2, 3, 4, 5, 6, 7, 8]?.map((index) =>
                            widget.items?.map((item) => {
                              if (item.product_id) {
                                return (
                                  <div
                                    className="min-w-max  mobile:pr-0  placeholder-dblackOverlay3"
                                    key={item.product_id}
                                  >
                                    <SingleProduct
                                      scroll={width < 650 && true}
                                      item={item}
                                      click={handleOnItemClick}
                                      dragging={dragging}
                                      noAddCart={noAddCart}
                                    ></SingleProduct>
                                  </div>
                                );
                              } else {
                                return (
                                  <div
                                    className={`min-w-max  cursor-pointer hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                                    key={item.banner_image_id}
                                  >
                                    <BannerLink
                                      widget={widget}
                                      item={item}
                                      bannerStats={bannerStats}
                                      handleLinkClick={handleLinkClick}
                                      handleOnItemClick={handleOnItemClick}
                                      types={types}
                                      carouselBannerCap={true}
                                    />
                                  </div>
                                );
                              }
                            })
                          )}
                          {widget.items?.map((item) => {
                            if (item.product_id) {
                              return (
                                <div className="pr-3" key={item.product_id}>
                                  <SingleProduct
                                    item={item}
                                    scroll={true}
                                    noAddCart={noAddCart}
                                  ></SingleProduct>
                                </div>
                              );
                            } else {
                              return (
                                <div
                                  className={`p-1 min-w-max cursor-pointer hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                                  key={item.banner_image_id}
                                >
                                  <BannerLink
                                    widget={widget}
                                    item={item}
                                    bannerStats={bannerStats}
                                    handleLinkClick={handleLinkClick}
                                    handleOnItemClick={handleOnItemClick}
                                    types={types}
                                    carouselBannerCap={true}
                                  />
                                </div>
                              );
                            }
                          })}
                        </>
                      )}
                    </div>
                  </div>
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

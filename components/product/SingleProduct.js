import Image from "next/legacy/image";
import Link from "next/link";
import { HiStar } from "react-icons/hi";
import { useRouter } from "next/router";
import { AiOutlinePlus } from "react-icons/ai";
import { sanitizeHTML } from "../Utils";
import dynamic from "next/dynamic";
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
  const { item, host, addToCart } = props;
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
        .replaceAll("%", parseInt(""))
        .replaceAll(/\s+/g, "-")
        .replaceAll("..", "")
        .replaceAll("/", "-")
        .replaceAll("---", "-")
        .replaceAll("--", "-")
        .replaceAll("100%", "")
        .replaceAll("#", "")
        .replaceAll("/", "")}/p=${props.item.product_id}`}
      // onClick={() =>
      //   router.push(
      //     `${path}/${item.name
      //       .replaceAll(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
      //       .replaceAll("%", parseInt(""))
      //       .replaceAll(/\s+/g, "-")
      //       .replaceAll("..", "")
      //       .replaceAll("/", "-")
      //       .replaceAll("---", "-")
      //       .replaceAll("--", "-")
      //       .replaceAll("100%", "")
      //       .replaceAll("#", "")
      //       .replaceAll("/", "")}/p=${props.item.product_id}`
      //   )
      // }
      onClickCapture={props.click}
      // onClick={(e) => {
      //   dragging === false && getProductData(e);
      //   setProductHolder(props.item);
      // }}
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
            className={`product-image relative ${
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
                />
              ) : !props?.isSlider ||
                item?.images?.length === 0 ||
                !item?.images ? (
                <Image
                  alt={item.name}
                  src={item.thumb}
                  width={200}
                  height={300}
                  priority={true}
                  className="max-w-full max-h-full"
                />
              ) : (
                // <Swiper
                //   pagination={{
                //     el: ".my-custom-pagination-div",
                //     clickable: true,
                //     renderBullet: (index, className) => {
                //       return '<span class="' + className + '">' + "</span>";
                //     },
                //   }}
                //   loop={true}
                //   preventClicks={false}
                //   allowTouchMove={width > 650 ? false : true}
                //   modules={[Pagination, Autoplay]}
                //   autoplay={false}
                //   onInit={onInit}
                //   className="single-product-swiper"
                // >
                //   <SwiperSlide>
                //     {" "}
                //     <Image
                //       alt={item.name}
                //       src={item.thumb}
                //       width={200}
                //       height={300}
                //       priority={true}
                //       className="max-w-full max-h-full"
                //       placeholder={"blur"}
                //       // blurDataURL="/images/product_placeholder.png"
                //       blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYkAAAIdCAIAAABHoBYiAAAACXBIWXMAAAsTAAALEwEAmpwYAAANBmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOS0wOC0wMVQxNjoyNTozOCswMzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wOC0yNlQwMjo1NzoyNiswMzowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDgtMjZUMDI6NTc6MjYrMDM6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjhhZTI3MzUtOTRmMS1lZTQwLWFjYjktNDcxNjM1NWY3MDE0IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6OTc4OTdjNWQtYTM3Ni1kZTQ1LWJlYjAtOWMxMWE2YjFlMjQzIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTYwYjM0MjMtY2QzMi02MzQ4LTg0YjQtYmIzYWFmNmE5MWNiIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB0aWZmOk9yaWVudGF0aW9uPSIxIiB0aWZmOlhSZXNvbHV0aW9uPSI3MjAwMDAvMTAwMDAiIHRpZmY6WVJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIgZXhpZjpDb2xvclNwYWNlPSIxIiBleGlmOlBpeGVsWERpbWVuc2lvbj0iNDYzIiBleGlmOlBpeGVsWURpbWVuc2lvbj0iNTQxIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1NjBiMzQyMy1jZDMyLTYzNDgtODRiNC1iYjNhYWY2YTkxY2IiIHN0RXZ0OndoZW49IjIwMTktMDgtMDFUMTY6MjU6MzgrMDM6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YWU5YzM4YzgtYjNmYi05NzQxLWE1MzQtYmY0NzI3ZWQxZWRlIiBzdEV2dDp3aGVuPSIyMDE5LTA4LTAxVDE2OjI1OjM4KzAzOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjIzMTgzMTMxLWVjMGMtOWM0OS1iYzJiLTI0YzI0MTZmYThlNSIgc3RFdnQ6d2hlbj0iMjAyMC0wOC0xMVQxMzowNzo0NCswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGltYWdlL3BuZyB0byBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBpbWFnZS9wbmcgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NTFiMDg2OTktOTBmZi01YTRjLWI0NjQtYWEwYjVhN2UyYjlmIiBzdEV2dDp3aGVuPSIyMDIwLTA4LTExVDEzOjA3OjQ0KzAzOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo5ZWRkM2UyMy0xM2JlLTAyNGQtYmIzMS1lMjliMzA5N2JhNmMiIHN0RXZ0OndoZW49IjIwMjAtMDgtMjZUMDI6NTc6MjYrMDM6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjY4YWUyNzM1LTk0ZjEtZWU0MC1hY2I5LTQ3MTYzNTVmNzAxNCIgc3RFdnQ6d2hlbj0iMjAyMC0wOC0yNlQwMjo1NzoyNiswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OWVkZDNlMjMtMTNiZS0wMjRkLWJiMzEtZTI5YjMwOTdiYTZjIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6Yjg4NzVhZDQtYWYwYy0wMTQ3LWJjMGMtODkzZWU3ZDQ1YWRkIiBzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTYwYjM0MjMtY2QzMi02MzQ4LTg0YjQtYmIzYWFmNmE5MWNiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+AAuhhwAAE29JREFUeNrt3YlaW0eCgNF5/6cboX3f933fEJ6S5HiIIzm6xAJkzvlo7O44BgT6u+qqbtX/fAP4fP7HQwBoE4A2AdoEoE2ANgFoE4A2AdoEoE2ANgFoE6BNANoEoE2ANgFoE6BNANoEaBOANgFoE6BNANoEaBOANgHaBKBNANoEaBOANgHaBKBNgDYBaBOANgHaBKBNgDYBaBOgTQDaBKBNgDYBaBOgTQDaBGgTgDYBaBOgTQDaBGgTgDYB2gSgTQDaBGgTgDYB2gSgTYA2AWgTgDYB2gSgTYA2AWgTgDYB2gSgTYA2AWgToE0A2gSgTYA2AWgToE0A2gRoE4A2AWgToE0A2gRoE4A2AdoEoE0A2gRoE4A2AdoEoE2ANgFoE4A2AdoEoE2ANgFoE6BNANoEoE2ANgFoE6BNANoEaBOANgFoE6BNANoEaBOANgHaBKBNANoEaBOANgHaBKBNgDYBaBOANgHaBKBNgDYBaBOgTR4CQJsAtAnQJgBtArQJQJsAtAnQJgBtArQJQJsAbQLQJgBtArQJQJsAbQLQJkCbALQJQJsAbQLQJkCbALQJ0CYAbQLQJkCbALQJ0CYAbQK0CUCbALQJ0CYAbQK0CUCbAG0C0CYAbQK0CUCbAG0C0CZAmwC0CUCbAG0C0CZAmwC0CdAmAG0C0CZAmwC0CdAmAG0CtAlAmwC0CdAmAG0CtAlAmwC0CdAmAG0CtAlAmwBtAtAmAG0CtAlAmwBtAtAmQJsAtAlAmwBtAtAmQJsAtAnQJh7Ufr9f/d3ytfDfF8vVdLqaTJbT6XI6W8xm89lsNp2Mx+PhcNjv97vdbqfTabfbrX9ohv+UK+1CsV0utyqVZqVar1Sq5XKpWCwVCvl8PpfNZjKZdDod3teLpUG3u1mvfVPQpq/t5WU0GmUz2cS/S55/iYe3k6fbJRKxZDIW3sfjsV//i6d/mkwm283m8/Oz7w/a9EVt5otQmqdIoXkfiXilWHw5HHyP0KavKEzKnj6tWGw0GPgeoU1f0Xa1Th7HTZ8yTfF4qVB4eXnxbUKbvqLZaFQoFFJBMvn9KlLis7QqkUisXRdHm76sw+GwDdbr+Xw+GA4GrVan2SyVy7lsNpdOJ5PJ8wzr/dsUWrlcLn2D0CZ+9nJ4CSOXaXBaLlBvNKqVSqVYzGazqZNkIhn/8RLbj2vqv+niehg3aRPaRAT7/X4TrNeb5TKEqx90Oq1Go1As5sNoK5NJnEdbceMmtInPMM56eQkzxOf982q1mgWj8aDXq9Vq5VIpEX0wlc3lQgQ9qmgTdzSfz9OZbITX6Z6e2vWGxw1t4u76rdbtl6LCrHC1WHjQ0CbubtLr3z5uyhcKB+vC0SbeQaVaub1Ng27XI4Y2cXer2TyeSNwYpnQ6vd9uPWhoE/f18vLSqFZvHzS1mk0PGtrE3e2221QqdfuypoWr4GgT7yDSK3SlUsktvmgTd/f8/Jy9edAU9Pt9DxraxN0NR6Pbw5RKJrebjQcNbeK+DodDLpe7vU2NhrXgaBP3N51OI9zc+/S0mM89aGgTd1er1W5vU9FacLSJd7BZr79vTXebYa/nQUObuLtOsxlpJzlXwdEm3ujl5eV5v18tl4vp9Ncbv23Xm2QycXub6vW6hxdt4laH5+cwnDke4dvvh3yU8oXjtpanEzTD+1Hv6lqkTqNx+3rL8LfNZjOPNtrE5THR8UyD5Wo8GnVarXa9Xi6X06dNwa+u4c7nLxftcMhHWTqQz+ddBUebOHp+ft7vdovFYjwYdjudaqUSxkSn4wkStx5JEI83K5WLf/l0FO1UzretBZ9Op7VarfIJNBqN0Wi0tXeCNhG5RPv9Zr1ezGaD4bDdbNarteMJT6lU/HWAIm7pfdyacrW6OP4qlkoR1oKnUrvoz+pOp/O5Dvs8be3Sa7dD9P28aROXp2bh6bHZbMKwYtTvHw9uKpVy2Ww8/psPxawWixc/gfl8fvvHCk/pWqkc9WtcLhbhQ8Senj5bnoJCobDb7fwcahPHizvrzXoxn/d6vXazVS6Xc5lMKpl8dWDcXZ6K4+Hw4ucTab1lMJtOo37Jk8Hg6bOKxWKVctnoSZu+ut1mU87lE6nkbx8W/esa7os7mazX60Qice+r4Odx02fOU7vd9sOpTV/aYrl4+ohn6Xg8vvj5dLvdCM/h+FO/03nbvLXRaHzeNp0vopnZadMXv7o0nUz6vV7/XQwGg1CfyXh8cdD0vN9nM5nbn8PJVOrNa8HDaGs0Gp2OQC+GEEQarL2P8On5+dQmPoVelEHT79oRJVRys9mslsswlOt2OuHvzOVy2Wz2x8Xp1795z6FTt2HXc23iEzjubxll0HS8Cn6fteDHc8+fnxfzxWw87nQ65WKxXC5nMpmfLlHdNVj/G4v13jRdRZv4zcaj0VOUpQP5fP49X8za7ffL5XI+m4VatZrNQqEQxlavt0mI/eZxU6zbcjlcm7j3mGh/9Os/U8vnnxKJ25/i3Q8dVhzHVqFWq+MNOoN+v1KplEul14fB/PdUdR3/qU383qnZdrNZLBbDwaDb7lRrtWIYYoQZUTYb/pdr/9Yq4tKBMGBZr9ef6gs/X7cKY6vwtYeshLFVqVTKnFaKvaFT4dG4uGgebeLWJ+R2u13M55PBsNFo1CqVbC4Xno0XVw+F59vmystq9Xo92pryavUhHpwwWgyPT6/XSyUibJIXi8WKxaKTrLSJW59pu91us16PJ5Nhv99vtcuVSimU6OYDmsLQaXdpZheCFWl/y+PpmNHXgn+scZTTYoKOC+HaxC8uqSxOV3/DDKVRq5WLxTBDSSdTf7uz9/Z1m/GnzpWX/NtR9rc8rwV/ebQdUULWIx1N/OuN99CmL5ShMPvYbbfH+3t7/WajUThdJIr/vlvqwshoe+kCyhuWDjzimGIR5S6ZXC5nOypt+qKzszCNWsznYaJx3AOuWgtPhkw6nT5PrO5xC0s83rpyhWg8HEb6iJ/wKvgt2u327V+jm+m06SsaDgZhTHScX7zjbXSJZGJ9caumw0sxm430mVQrlYe7SHzcxjOfv/1rnDtlT5u+mjBx+16l+L12PrmodmXQNB0Mo/5Vk8nk4R72SDtSZTKZf10Lhjb9gbO5wWBQKRSrpdLxrVz+LW+V41vlwlt4Vy7XKpVrSwfCP410i1k+m315wAsxYY4Wi926yMmx6drEB1stl1Hv/u894OmYz8/PkSZ000dbHqFN/GlardZXWCodaUKXNqHTJj7WbrdLp9OR2lR+zKXSw8Hgxgld+EOtWs3PhjZxL4eTX/+ZbsStmp7iT+PH3GstwjW1eHw+MaHTJn7rJZXNZhMmL6E47VarUCjkC4XJaPztyjBnv9tFXW+ZzWYfcXv/7WZz+zW1VCptH15t4u1jov1+HzI0mUzGw2G9Xq+UyyEc52PEXw8B0snk7srLc6NON+oKhu5j3l92+4QuqFw5SRRt4mfnbQY26/VoNApjonrt+wryWy7uptPpawfVlgrFqPe7bN66L/jHPnqlUun2Ng2u7yGDNn3pAdHxGPH9frFYTE87Z9dqtfJpBXmkTQJ+jJuqpdLFS9fL6TQecelAqVx+xKvgx5Ombv5Kw8DzEe/F0SbucpFot90uTtsMdJqt8yaz2X/siv3G++cSicV4cnEsUc1knyK1KR6f9PqP+AiHOt++q1z5MfurTfzXyUUYFm1Pl6snw2Gz2axXq7lM9n7nR5aunCe+Wq2irrdMZzLPD3iFuNfrRfoy+/2+H1Rt+kLCBK3TbIb/T87nculUKn7nY8R/jHTGVxZwR11v+aA35YehaKTu/2JHULTpz5TJZN772N54PJdOHy693r/f7TIR11umHu1JGwaGtWo16mPmFTpt+nK6jUaYE72bdDqdzeUmVxZJDocRdx2IP2VTqecPvYfjvOf3brfbXrJerxcno9EoTOJCYsIIKOrJBbFYzJEq2vQV7Z/PJzC9k2srJI97GOVykTd+iicWb93M6OWV8NFDX0JKzuegBMvT2/FFyek0RPN46lyr1Thp1evn31Wr1WKxmM1mQ3PPr1cG3385Oa/q+o+X7Y7bny8WflC1iY8xGQzfNrsMaZhMJj+GKsfzwVer497Bo9FgMOgPBsNebxh+0+8fT15qtUJQyuVy8aR0egvy+XwY1r2uyQ8X72t7z0PG7cCrTXzczOhwKKYzYRT05ifwcdxycu7LjWd/v3Nl3ib01E+INvExFtNZ/J0vyT8OO/BqEx+mWa8/adOVCd0j3sOsTfwJNutNMp6QIUeqaBOfS6Tjj76a2WzmJ0Sb+AD7/T7qVk1fRCwWS6dt2KRNfJDJZCJDXqHTJj6dYb+vQdeugju2QJv4MH1turKg1G5N2oRx04deV/rHlgONRuPajqBoE+9k+gWuN8Wu3yiXyWTC3C133LUvWy6Xe72e4ZI28Sk83Ot0sX/rThj4/Ljd91icSqVeParVau12ezQazaYns9lyuTzf/Hzmh0Gb+Fyi7gD57vWJ/W2Yk80e33K5YrEYJl+doN0O7/r9/rE7s9lqtdqsjzabjYvZ2sQDOxwOpVLpo0r0Y7+B78OccrlW/e48zAmzzuPbdBqGObvd7scwx+7d2sSfb7vdFgqFN9flWnRSqdR5T7sQnXw+HwoYJlatVqvdDO9a3W53MpmEYc42jHHW6/A5mFihTfwsdKHdbCYTiZ9bE//5ak7y9dWcUqlaKlUqlTDMCbkZDofj4TAMdkJ0FotFGOb82NMujM4+yUhnNBzax1KbeDDr5arX7lTL5cxppHO8ftxodlqtTqfT6/XCxGq1XK1Xq+9Xcx5zYlUsFmNPT/0rpzmgTXxqn2eY83vtd7sw0wxtCiPEhft4tQk+ifFw9ON1wHQ6Y42lNsHH22236VeHXMVOhzsdXIDXJvhAz/t9tVyO/WMnlEa95sHRJnhX5wOmnp+fp9NpPp+/ttZhPBx6rLQJ/mtufhyWufvrgMzzGXaDwWDY74f33W63Xq+H+VrpJJvN/uv6z6UT6LQJLhYnjG7OZ9stl8vjEZrLZShOv9//fmRmvd5sNGq12vmwzFQqlT69BT8dOXXjjb4/qdfM7LSJP9fhcDgPanZ/nQK+WCwmk8noeJDmcVnmeVDTbDZDZcK4phyUSpW/RjfJZPIDN2yyKl2beGAhPcv5fDGfj8fj8zm9ITTNMKipN2rVWqFQOJ4Ansmkg2QyDGpuOfbuMxyfGT5VW4NrE48qjCxCff7Ic+yKhYKDxbWJBx40vV4fdPt9v5//SJUw2fT91SYe2Hq9nozHo9HoPKGr1+u12l+bmpTL1WIxvK+UysViMZfLZU6Tu9RZ8njV+seub0Eikbg444udZ3mxX80Bf+M0MPxV5VLZxSZt4ks4v+52viC+OVtv1svjrm/njd+C1Wq1WCym0+nxQvlg0D/r9YadzqAXfu11Op1msxmiF0pXOMkXCsV8Prwdf5/Pn1+w++l1un8tV+zVnwnva+WyLei0Cd5Yuv93OIS3s5C/8/qm5XI5n89nJ6F2y9NvJpPJ8LQdyuvx3XE7l0rlPNIL78OfsUedNgFoE6BNANrER9put6fzk2bP73j9eL/bnc9tctFam+BnL4dDp93K/HWYXS6TGfT773AheTAYZP9aVBU+eqfTsUhSm+CvML28NEulp8TPy5G6nc5dP24o0YX7cut1L65pExzNRqOnS7f7p5LJzd22tV2vVpdvx4vHZ9Opb4o2wbdmpXL5fpREfNS+19ApzOYuL56Mx5vVqm+KNsG3crV6ORPJ5LB6r52PWu32tYXdzVrdN0Wb4Fu3Vnu6Mr0a9+91l+w4TCSvjJvadW3SJvj2bbNcJi5t/JbL3HFLtt1ud3Hbg2QyuV6vfVO0CY5Gg2H877ughFpNJ5O7ftDpdPq3zTDjR0NHD2gTvDabThvVWiaTyWazrWZztVy+wwddLpfNRiN7+qDNSnXmMF5tAtAmAG0CtAlAmwBtAtAmQJsAtAlAmwBtAtAmQJsAtAnQJgBtAtAmQJsAtAnQJgBtAtAmQJsAtAnQJgBtArQJQJsAtAnQJgBtArQJQJsAbQLQJgBtArQJQJsAbQLQJkCbALQJQJsAbQLQJkCbALQJ0CYAbQLQJkCbALQJ0CYAbQK0CUCbALQJ0CYAbQK0CUCbAG0C0CYAbQK0CUCbAG0C0CZAmwC0CUCbAG0C0CZAmwC0CdAmAG0C0CZAmwC0CdAmAG0C0CZAmwC0CdAmAG0CtAlAmwC0CdAmAG0CtAlAmwBtAtAmAG0CtAlAmwBtAtAmQJsAtAlAmwBtAtAmQJsAtAnQJgBtAtAmQJsAtAnQJgBtArQJQJsAtAnQJgBtArQJQJsAbQLQJgBtArQJQJsAbQLQJkCbALQJQJsAbQLQJkCbALQJ0CYAbQLQJkCbALQJ0CYAbQK0CUCbALQJ0CYAbQK0CUCbALQJ0CYAbQK0CUCbAG0C0CYAbQK0CUCbAG0C0CZAmwC0CUCbAG0C0CZAmwC0CdAmAG0C0CZAmwC0CdAmAG0CtAlAmwC0CdAmAG0CtAlAmwBtAtAmAG0CtAlAmwBtAtAmQJsAtAlAmwBtAtAmQJsAtAnQJgBtAtAmQJsAtAnQJgBtArQJQJsAtAnQJgBtArQJQJsAtAnQJgBtArQJQJsAbQJ4f/8H78p98t0G+0QAAAAASUVORK5CYII="

                //     />
                //   </SwiperSlide>
                //   {props?.item?.images?.slice(0, 2).map((image) => {
                //     return (
                //       <SwiperSlide key={image.mobile_image}>
                //         {" "}
                //         <Image
                //           alt={item.name}
                //           src={item.thumb}
                //           width={200}
                //           height={300}
                //           priority={true}
                //           className="max-w-full max-h-full"
                //           placeholder={"blur"}
                //           // blurDataURL="/images/product_placeholder.png"
                //           blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYkAAAIdCAIAAABHoBYiAAAACXBIWXMAAAsTAAALEwEAmpwYAAANBmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOS0wOC0wMVQxNjoyNTozOCswMzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wOC0yNlQwMjo1NzoyNiswMzowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDgtMjZUMDI6NTc6MjYrMDM6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjhhZTI3MzUtOTRmMS1lZTQwLWFjYjktNDcxNjM1NWY3MDE0IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6OTc4OTdjNWQtYTM3Ni1kZTQ1LWJlYjAtOWMxMWE2YjFlMjQzIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTYwYjM0MjMtY2QzMi02MzQ4LTg0YjQtYmIzYWFmNmE5MWNiIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB0aWZmOk9yaWVudGF0aW9uPSIxIiB0aWZmOlhSZXNvbHV0aW9uPSI3MjAwMDAvMTAwMDAiIHRpZmY6WVJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIgZXhpZjpDb2xvclNwYWNlPSIxIiBleGlmOlBpeGVsWERpbWVuc2lvbj0iNDYzIiBleGlmOlBpeGVsWURpbWVuc2lvbj0iNTQxIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1NjBiMzQyMy1jZDMyLTYzNDgtODRiNC1iYjNhYWY2YTkxY2IiIHN0RXZ0OndoZW49IjIwMTktMDgtMDFUMTY6MjU6MzgrMDM6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YWU5YzM4YzgtYjNmYi05NzQxLWE1MzQtYmY0NzI3ZWQxZWRlIiBzdEV2dDp3aGVuPSIyMDE5LTA4LTAxVDE2OjI1OjM4KzAzOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjIzMTgzMTMxLWVjMGMtOWM0OS1iYzJiLTI0YzI0MTZmYThlNSIgc3RFdnQ6d2hlbj0iMjAyMC0wOC0xMVQxMzowNzo0NCswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGltYWdlL3BuZyB0byBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBpbWFnZS9wbmcgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NTFiMDg2OTktOTBmZi01YTRjLWI0NjQtYWEwYjVhN2UyYjlmIiBzdEV2dDp3aGVuPSIyMDIwLTA4LTExVDEzOjA3OjQ0KzAzOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo5ZWRkM2UyMy0xM2JlLTAyNGQtYmIzMS1lMjliMzA5N2JhNmMiIHN0RXZ0OndoZW49IjIwMjAtMDgtMjZUMDI6NTc6MjYrMDM6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjY4YWUyNzM1LTk0ZjEtZWU0MC1hY2I5LTQ3MTYzNTVmNzAxNCIgc3RFdnQ6d2hlbj0iMjAyMC0wOC0yNlQwMjo1NzoyNiswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OWVkZDNlMjMtMTNiZS0wMjRkLWJiMzEtZTI5YjMwOTdiYTZjIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6Yjg4NzVhZDQtYWYwYy0wMTQ3LWJjMGMtODkzZWU3ZDQ1YWRkIiBzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTYwYjM0MjMtY2QzMi02MzQ4LTg0YjQtYmIzYWFmNmE5MWNiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+AAuhhwAAE29JREFUeNrt3YlaW0eCgNF5/6cboX3f933fEJ6S5HiIIzm6xAJkzvlo7O44BgT6u+qqbtX/fAP4fP7HQwBoE4A2AdoEoE2ANgFoE4A2AdoEoE2ANgFoE6BNANoEoE2ANgFoE6BNANoEaBOANgFoE6BNANoEaBOANgHaBKBNANoEaBOANgHaBKBNgDYBaBOANgHaBKBNgDYBaBOgTQDaBKBNgDYBaBOgTQDaBGgTgDYBaBOgTQDaBGgTgDYB2gSgTQDaBGgT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"
                //         />
                //       </SwiperSlide>
                //     );
                //   })}
                //   <div
                //     className={`my-custom-pagination-div absolute left-0 z-50 right-0 ${
                //       props?.item?.option_color_count &&
                //       props?.item?.option_color_count > 1
                //         ? "bottom-9"
                //         : "bottom-3"
                //     }`}
                //   ></div>

                //   {props?.item?.option_color_count &&
                //   props?.item?.option_color_count > 1 ? (
                //     <div className="flex items-center flex-col ">
                //       <div
                //         className="text-d12 absolute bottom-0 z-50 font-semibold mb-2 px-3 overflow-hidden whitespace-nowrap overflow-ellipsis w-auto"
                //         style={{
                //           borderRadius: "30px",
                //           background: "rgb(239, 243, 253)",
                //           border: "1px solid rgba(255, 255, 255, 0.7)",
                //           maxWidth: width > 650 ? "45%" : "50%",
                //           paddingTop: "2px",
                //           paddingBottom: "2px",
                //         }}
                //       >
                //         {props?.item?.option_color_count} Colours
                //       </div>
                //     </div>
                //   ) : (
                //     ""
                //   )}
                // </Swiper>
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
                        className="text-d12 absolute bottom-0 z-50 font-semibold mb-2 px-3 overflow-hidden whitespace-nowrap overflow-ellipsis w-auto bg-dprimarybg"
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

                  {/* <div className="thumbnails">
                    {props?.item?.images?.slice(0, 2).map((image, index) => (
                      <div
                        key={index}
                        className={`thumbnail ${
                          index === hoveredIndex ? "active" : ""
                        }`}
                        onMouseEnter={() => handleImageHover(index)}
                        onMouseLeave={() => handleImageHover(null)}
                      >
                        <span>.</span>
                      </div>
                    ))}
                  </div> */}
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
                      sanitizeHTML(props.item.description.slice(0, 500)) +
                      "...",
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

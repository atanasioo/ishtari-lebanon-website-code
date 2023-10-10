import Link from "next/link";
import React, { useContext } from "react";
import Image from "next/legacy/image";
import { HostContext } from "@/contexts/HostContext";
import { useMarketingData } from "@/contexts/MarketingContext";

function BannerLink(props) {
  const {
    widget,
    item,
    bannerStats,
    handleLinkClick,
    handleOnItemClick,
    types,
    bool,
    carouselBanner,
    carouselBannerCap,
    sliderSingleBanner,
    sliderBanner,
    index,
  } = props;
  const { showStats } = useMarketingData();
  const { host } = useContext(HostContext);

  return (
    <Link
      data-index={sliderBanner ? index : null}
      onClick={() => {
        carouselBanner && handleOnItemClick();
        handleLinkClick(item.banner_image_id);
      }}
      onClickCapture={carouselBannerCap && handleOnItemClick}
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
                item?.filters?.filter_manufacturers.map((fm) => fm.id)
              : "") +
            (item?.filters?.filter_sellers
              ? "&filter_sellers=" +
                item?.filters?.filter_sellers.map((fs) => fs.id)
              : "") +
              (item?.filters?.filter_options
                ? "&filter_options=" +
                  item?.filters?.filter_options.map((fo) => fo.id)
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
      className={`relative ${sliderSingleBanner ? "w-full link-span" : ""}`}
    >
      {/* {widget.display === "slider" || widget.display === "carousel" ? ( */}
        <Image
          alt={item?.name}
          src={host + "/image/" + item.image}
          width={widget?.banner_width}
          height={widget?.banner_height}
          title={item?.name
            .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
            .replace("%", "")
            .replace(/\s+/g, "-")
            .replaceAll("/", "-")}
          className={`${!bool && "w-full"} max-w-full placeHolderSlideCSS1`}

       
        // loading="lazy"
        />
      {/* ) : (
        <LazyLoadImage
          alt={item?.name}
          src={host + "/image/" + item.image}
          width={widget?.banner_width}
          // height={widget?.banner_height}
          title={item?.name
            .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
            .replace("%", "")
            .replace(/\s+/g, "-")
            .replaceAll("/", "-")}
          className={`${!bool && "w-full"} max-w-full 
       
        `}
          placeholder={
            widget.column_number === "1" ? (
              <SlideshowPlaceholder
                alt={item?.name}
                width={widget?.banner_width}
                height={widget?.banner_height}
              />
            ) : (
              <SquarePlaceholder
                width={widget?.banner_width}
                height={widget?.banner_height}
                alt={item?.name}
              />
            )
          }
        />
      )} */}

      {showStats &&
        typeof bannerStats !== "undefined" &&
        bannerStats.length > 0 &&
        bannerStats.some(
          (stats) => stats.banner_image_id === item.banner_image_id
        ) && (
          <div
            className="absolute z-10 bottom-5 right-3 text-d10 md:text-d13 px-2.5 py-1.5 pr-semibold rounded-full"
            style={{ background: "hsla(0,0%,100%,.9)" }}
          >
            {bannerStats
              .filter((stats) => stats.banner_image_id === item.banner_image_id)
              .map((stats) => (
                <div key={stats.banner_image_id}>
                  Clicks: {stats.clicks}, Source: {stats.source}
                </div>
              ))}
          </div>
        )}
    </Link>
  );
}

export default BannerLink;

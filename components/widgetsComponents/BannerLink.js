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
    index
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
        className={`${!bool && "w-full"}`}
        placeholder="blur"
        blurDataURL="data:image/png;base64,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"
      />
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

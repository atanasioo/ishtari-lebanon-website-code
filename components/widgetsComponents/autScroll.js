// components/AutoScroll.js
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import BannerLink from "./BannerLink";
import SingleProduct from "../product/SingleProduct";

const AutoScroll = (props) => {
  const containerRef = useRef(null);
  const widgets = props.widget;
  const [widget, setState] = useState([widgets]);
  const handleOnItemClick = useCallback(
    (e) => {
      if (dragging) {
        // e.stopPropagation()
        e.preventDefault();
      }
    },
    [dragging]
  );

  const handleLinkClick = (banner_image_id) => {
    //for marketing
    setMarketingData({
      ignore: false,
      banner_image_id: banner_image_id,
      source_type: source_type,
      source_type_id: source_type_id
    });
  };
  return (
    <>
 

      <div class="scroll-container">
        <div
          class="content flex "
          id="content"
          style={{
            animation: `scroll ${
              props.widget.duration > 0 ? props.widget.duration : 25
            }s linear infinite `
          }}
        >
          {widget.row_number === "2" ? (
            <Slider
              {...twoRowsSettings}
              beforeChange={handleBeforeChange}
              afterChange={handleAfterChange}
            >
              {widget.items?.slice(0, 12).map((item) => {
                if (item.product_id) {
                  return (
                    <div className="w-1/12">
                    <SingleProduct item={item}></SingleProduct>
                  </div>
                  );
                } else {
                  return (
                    <div
                      className={`p-1 cursor-pointer mb-3 hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                      key={item.banner_image_id}
                    >
                          <div
                    className={` p-1 cursor-pointer mb-3 hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                    key={item.banner_image_id}
                  >
                    <BannerLink
                      widget={widget}
                      item={item}
                      // bannerStats={bannerStats}
                      // handleLinkClick={handleLinkClick}
                      // handleOnItemClick={handleOnItemClick}
                      types={props.types}
                      // carouselBannerCap={true}
                    />
                  </div>
                    </div>
                  );
                }
              })}
              {widget.items?.slice(12, 24).map((item) => {
                if (item.product_id) {
                  return (
                    <div className="w-1/12">
                    {" "}
                    <SingleProduct item={item}></SingleProduct>
                  </div>
                  );
                } else {
                  return (
                    <div
                    className={` p-1 cursor-pointer mb-3 hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                    key={item.banner_image_id}
                  >
                    <BannerLink
                      widget={widget}
                      item={item}
                      // bannerStats={bannerStats}
                      // handleLinkClick={handleLinkClick}
                      // handleOnItemClick={handleOnItemClick}
                      types={props.types}
                      // carouselBannerCap={true}
                    />
                  </div>
                  );
                }
              })}
            </Slider>
          ) : (
            <>
              {props.widget.items?.map((item) =>
                item.product_id ? (
                  <div className="w-1/12">
                    {" "}
                    <SingleProduct item={item}></SingleProduct>
                  </div>
                ) : (
                  <div
                    className={` p-1 cursor-pointer mb-3 hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                    key={item.banner_image_id}
                  >
                    <BannerLink
                      widget={widget}
                      item={item}
                      bannerStats={props.bannerStats}
                      handleLinkClick={handleLinkClick}
                      handleOnItemClick={handleOnItemClick}
                      types={props.types}
                      // carouselBannerCap={true}
                    />
                  </div>
                )
              )}

              {props.widget.items?.map((item) =>
                item.product_id ? (
                  <SingleProduct item={item}></SingleProduct>
                ) : (
                  <div
                    className={` p-1 cursor-pointer mb-3 hover:opacity-80 w-1/${widget.column_number} md:w-1/${widget.column_number}`}
                    key={item.banner_image_id}
                  >
                    <BannerLink
                      widget={widget}
                      item={item}
                      // bannerStats={bannerStats}
                      // handleLinkClick={handleLinkClick}
                      // handleOnItemClick={handleOnItemClick}
                      types={props.types}
                      // carouselBannerCap={true}
                    />
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AutoScroll;

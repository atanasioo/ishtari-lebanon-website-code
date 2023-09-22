import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import { Navigation } from "swiper";
import { useRouter } from "next/router";
import { IoIosArrowDown } from "react-icons/io";

export default function SwiperComponent(props) {
  const router = useRouter();
  const {
    catalog,
    filter_categories,
    filter_manufacturers,
    filter_sellers,
    filter_options,
    adv_filters,
    has_filter,
    last,
    slug,
    page,
    sort,
    order,
    limit
  } = router.query;

  const { data } = props;
  const checkMainFilter = (filter) => {
    let filter_id = "";
    if (filter.id != undefined && filter.id === "filter_options") {
      filter_id = filter_options;
    }
    if (filter.id != undefined && filter.id === "filter_manufacturers") {
      filter_id = filter_manufacturers;
    }
    if (filter.id != undefined && filter.id === "filter_sellers") {
      filter_id = filter_sellers;
    }
    if (filter.id != undefined && filter.id === "filter_categories") {
      filter_id = filter_categories;
    }

    if (filter.id != undefined && filter.id === "adv_filters") {
      filter_id = adv_filters;
    }
    var count = 0;
    filter.items?.map((item) => {
      if ([filter_id]?.includes(item.id)) {
        count++;
      }
    });
    //   }
    // });
    if (count > 0) {
      return "catalog-top-filter-selected bg-white";
    } else {
      return "";
    }
  };

  function parseFilter(id, v) {
    // Call the function from the parent component and pass a message
    props.onButtonClick(id, v);
  }

  function handleTopFilter(id, v) {
    // Call the function from the parent component and pass a message
    props.onHandleClickTopFilter(id, v);
  }
  return (
    <div
      className={` ${
        700 > 650 ? "button-wrapper overflow-hidden" : "overflow-x-auto py-1"
      } items-center w-full whitespace-nowrap`}
      id={`button-wrapper`}
    >
      <Swiper
        slidesPerView={"auto"}
        freeMode={true}
        draggable={false}
        pagination={false}
        navigation={true}
        modules={[Navigation]}
        className="myFilterSwiper"
      >
        {data.filters.map((filter) => {
          return (
            filter.id !="adv_filters" &&  filter.items.length > 0 &&
            filter.name !== "Socks" &&
            filter.name !== "Size by Age" && (
              <SwiperSlide
                key={Math.random()}
                id={filter.name}
                onClick={() => handleTopFilter(filter.name)}
              >
                <button className="p-1 " id={filter.name}>
                  <div
                    className={`text-d14 px-3 py-1 flex-nowrap bg-dgreyRate flex justify-between items-center rounded-2xl ${checkMainFilter(
                      filter
                    )}`}
                    style={{
                      paddingTop: "5px",
                      paddingBottom: "5px"
                    }}
                  >
                    <span className="w-max">
                      {filter.name.charAt(0).toUpperCase() +
                        filter.name.slice(1)}
                    </span>
                    <span className="ml-2">
                      <IoIosArrowDown className="text-d18" />
                    </span>
                  </div>
                </button>
              </SwiperSlide>
            )
          );
        })}
        {data.filters.map((filter) => {
          return (
            filter.items.length > 0 &&
            filter.items.map((item) => {
              if (
                filter.id != undefined &&
                filter.id.replace('"', "").includes(item.id)
              ) {
                // console.log(userFilters);
                return (
                  <SwiperSlide>
                    <button
                      className="p-1 "
                      onClick={() => parseFilter(filter.id, item)}
                    >
                      <div
                        className={`text-d14 bg-dgreyRate px-3 flex-nowrap flex justify-between items-center rounded-2xl catalog-top-filter-selected`}
                        style={{
                          paddingTop: "6px",
                          paddingBottom: "6px"
                        }}
                      >
                        <span className="w-max">{item.name}</span>
                        <span className="ml-2">
                          <AiOutlineClose className="text-d18" />
                        </span>
                      </div>
                    </button>
                  </SwiperSlide>
                );
              }
            })
          );
        })}
        {data.filters.map((filter) => {
          return (
            filter.items.length > 0 &&
            filter.items.slice(0, 3).map((item) => {
              if (filter.id != undefined && !filter.id.includes(item.id)) {
                if (filter.name === "Sellers") {
                  const temp = Math.max(
                    ...filter.items.map((o) => {
                      if (filter.id != undefined && !filter.id.includes(o.id)) {
                        return Number(o.count);
                      }
                    })
                  );

                  if (temp && Number(item.count) === temp) {
                    return (
                      <SwiperSlide>
                        <button
                          className="p-1 "
                          onClick={() => parseFilter(filter.id, item.id)}

                          // onClick={() =>
                          //   parseFilter(
                          //     filters[
                          //       data.filters.findIndex(
                          //         (x) => x.name === topFilter.name
                          //       )
                          //     ].id,
                          //     item.id
                          //   )
                          // }
                        >
                          <div
                            className={`text-d14 px-3 py-1 overflow-hidden flex-nowrap flex justify-between items-center bg-dgreyRate rounded-2xl `}
                            // style={{
                            //   paddingTop: "6px",
                            //   paddingBottom: "6px"
                            // }}
                          >
                            <span className="w-max">
                              <span className="font-bold mr-1">Seller:</span>
                              {item.name}
                            </span>
                          </div>
                        </button>
                      </SwiperSlide>
                    );
                  }
                } else if (filter.name === "Brands") {
                  const temp = Math.max(
                    ...filter.items.map((o) => {
                      if (filter.id != undefined && !filter.id.includes(o.id)) {
                        return Number(o.count);
                      }
                    })
                  );
                  if (temp && Number(item.count) === temp) {
                    return (
                      <SwiperSlide>
                        <button
                          className="p-1"
                          onClick={() => parseFilter(filter.id, item.id)}
                        >
                          <div
                            className={`text-d14 px-3 py-1  flex-nowrap flex justify-between items-center rounded-2xl bg-dgreyRate catalog-top-filter-not-selected`}
                          >
                            <span className="w-max">
                              <span className="font-bold mr-1">Brand:</span>
                              {item.name}
                            </span>
                          </div>
                        </button>
                      </SwiperSlide>
                    );
                  }
                } else if (filter.name === "Color") {
                  const temp = Math.max(
                    ...filter.items.map((o) => {
                      if (filter.id != undefined && !filter.id.includes(o.id)) {
                        return Number(o.count);
                      }
                    })
                  );
                  if (temp && Number(item.count) === temp) {
                    return (
                      <SwiperSlide>
                        <button
                          className="p-1"
                          onClick={() => parseFilter(filter.id, item.id)}
                        >
                          <div
                            className={`text-d14 py-1 px-3 flex-nowrap flex justify-between items-center rounded-2xl bg-dgreyRate catalog-top-filter-not-selected`}
                          >
                            <span className="w-max">
                              <span className="font-bold mr-1">Color:</span>
                              {item.name}
                            </span>
                          </div>
                        </button>
                      </SwiperSlide>
                    );
                  }
                } else if (filter.name === "Shoes size") {
                  const temp = Math.max(
                    ...filter.items.map((o) => {
                      if (
                        filter.id != undefined &&
                        filter.id.replaceAll('"', "").includes(o.id)
                      ) {
                        return Number(o.count);
                      }
                    })
                  );
                  if (
                    temp &&
                    Number(item.count) === temp &&
                    filter.items.length < 3
                  ) {
                    return (
                      <SwiperSlide>
                        <button
                          className="p-1"
                          onClick={() => parseFilter(filter.id, item.id)}
                        >
                          <div
                            className={`text-d14 px-3 flex-nowrap flex justify-between items-center rounded-2xl bg-dgreyRate catalog-top-filter-not-selected`}
                            // style={{
                            //   paddingTop: "6px",
                            //   paddingBottom: "6px"
                            // }}
                          >
                            <span className="w-max">
                              <span className="font-bold mr-1">
                                Shoes Size:
                              </span>
                              {item.name}
                            </span>
                          </div>
                        </button>
                      </SwiperSlide>
                    );
                  } else {
                    return (
                      <SwiperSlide>
                        <button
                          className="p-1"
                          onClick={() => parseFilter(filter.id, item.id)}
                        >
                          <div
                            className={`text-d14 bg-dgreyRate px-3 py-1 flex-nowrap flex justify-between items-center rounded-2xl catalog-top-filter-not-selected`}
                          >
                            <span className="w-max">
                              <span className="font-bold mr-1">
                                Shoes Size:
                              </span>
                              {item.name}
                            </span>
                          </div>
                        </button>
                      </SwiperSlide>
                    );
                  }
                }
              }
            })
          );
        })}
      </Swiper>
    </div>
  );
}

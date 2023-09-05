import Image from "next/image";
import React, { useRef, useState } from "react";
import { CgClose } from "react-icons/cg";
import Slider from "react-slick";
import StarRatings from "react-star-ratings";
import useDeviceSize from "../useDeviceSize";

function ReviewImagesModal(props) {
  const { selectedReviewImg, selectedIndex, review, closeModal } = props;
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const [activeImg, setActiveImg] = useState(selectedReviewImg);
  const [width] = useDeviceSize();
  const slider1 = useRef(null);

  const settings = {
    dots: false,
    infinite: false,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    ref: slider1,
    fade: width > 768 ? true : false,
    cssEase: width > 768 ? "linear" : "",
    currentSlide: activeIndex,
    prevArrow: <></>, // or null
    nextArrow: <></>, // or null
  };

  function changeImage(imgSrc, index) {
    setActiveIndex(index)
    setActiveImg(imgSrc);

    slider1.current.slickGoTo(index);
  }


  console.log(review);
  return (
    <div className="fixed bg-dblackk lg:bg-dblackOverlay top-0 left-0 right-0 bottom-0 w-full h-full z-30 overflow-hidden">
      <div className="relative w-full h-full">
        <div className="absolute bg-dblackk lg:bg-white top-0 left-0 right-0 bottom-0 m-auto  z-40 h-full lg:h-90vh lg:w-1057px ">
          <CgClose
            className="absolute top-1.5 right-1.5 p-0.5  w-9 h-9 z-10 lg:w-8 lg:h-8 cursor-pointer text-darrowZoom  lg:text-dblack"
            onClick={() => closeModal()}
          />

          {/* images count on mobile */}

          <div className="text-white text-center py-4 pr-bold lg:hidden">
            {activeIndex + 1} / { review?.images.length }
          </div>

          <div className="flex flex-col lg:flex-row w-full h-full pb-28 lg:pb-0 justify-center">
            <div className="review-big-img w-full lg:w-2/3 flex items-center justify-center">
              <Slider {...settings} className="w-86% lg:w-3/5" afterChange={(index) => setActiveIndex(index)}>
                {review.images.map((img) => (
                  <div className="flex justify-center">
                    <img
                      src={img}
                      alt="review image"
                      width={width > 1024 ? 402 : 370}
                      height={width > 1024 ? 605 : 500}
                    />
                  </div>
                ))}
              </Slider>
            </div>
            <div className="review-info w-full  lg:w-1/3 mt-2 md:mt-5 lg:mt-12  text-white lg:text-dblack pr-bold lg:pr-normal">
              <div className="flex items-center justify-between ">
                <div className="flex items-center gap-2 ml-2 lg:ml-0">
                  <div className="text-sm mt-1">{review.name}</div>
                  <div>
                    <StarRatings
                      starDimension="14px"
                      starEmptyColor="#e3e3e3"
                      starRatedColor="#f5a523"
                      starSpacing="1px"
                      rating={parseInt(review.rating)}
                    />
                  </div>
                </div>
                <div className="text-sm leading-none font-d11 pt-1 text-dgrey1 mr-2.5">
                  {review?.date_added.replace("-", " ").replace("-", " ")}
                </div>
              </div>
              <div className="text-sm leading-none pt-3 ml-2 lg:ml-0">{review?.text}</div>
              <div className="mt-5 text-d17 mb-4 font-semibold hidden lg:block">
                Images in this review
              </div>
              <div className="hidden lg:grid grid-cols-3">
                {review.images.map((img, i) => (
                  <img
                    src={img}
                    alt={img}
                    width={63}
                    height={86}
                    className={`${
                      activeIndex === i ? "border-2 border-dblue" : ""
                    } rounded-lg cursor-pointer`}
                    onClick={() => {
                      changeImage(img, i)
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewImagesModal;

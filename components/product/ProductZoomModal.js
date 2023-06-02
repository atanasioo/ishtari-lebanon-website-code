import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import { GrClose } from "react-icons/gr";
import PrismaZoom from "react-prismazoom";
import Image from "next/image";

function ProductZoomModal(props) {
  const { closeModal, images, currentSlideIndex } = props;
  const [cursor, setCursor] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(currentSlideIndex);

  const slider1 = useRef(null);
  const slider2 = useRef(null);

  const singleSetting = {
    dots: false,
    infinite: false,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    swipe: false,
    prevArrow: <></>, // or null
    nextArrow: <></>, // or null
  };

  const mobileSingleSetting = {
    dots: false,
    infinite: false,
    speed: 100,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    autoplay: false,
    currentSlide: currentSlide,
    ref: slider1,
  };

  const handleFirstSliderChange = (index) => {
    setCurrentSlide(index);
    slider2.current.slickGoTo(index);
    setActiveImage(images[index]);
    const popup = document.getElementById("popup_modal");
    const backgroundImageUrl = activeImage["popup"];
    // Create a new style element
    const style = document.createElement("style");
    style.type = "text/css";
    // Add a CSS rule for the #popup_modal::before pseudo-element
    const css = `#popup_modal::before { background-image: url(${backgroundImageUrl}); }`;
    style.appendChild(document.createTextNode(css));
    // Add the style element to the head of the document
    document.head.appendChild(style);
  };

  return (
    <div className="fixed bg-white md:bg-dblackOverlay top-0 lef-0 right-0 bottom-0 w-full h-full z-40 overflow-hidden">
      <div className="relative z-50 h-screen mx-auto text-center box-border">
        <div className="absolute w-full lg:w-11/12 m-auto h-screen lg:h-5/6 z-50 bg-white top-0 left-0 right-0 bottom-0 md:rounded-lg">
          <GrClose
            className="absolute right-1 m-3 w-7 h-7 md:w-5 md:h-5 cursor-pointer text-white md:text-black"
            onClick={() => closeModal()}
          />
        
        </div>
      </div>
    </div>
  );
}

export default ProductZoomModal;

import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import { CgClose } from "react-icons/cg";
import PrismaZoom from "react-prismazoom";
import Image from "next/image";
import useDeviceSize from "../useDeviceSize";
import { sanitizeHTML } from "../Utils";

function ProductZoomModal(props) {
  const { closeModal, images, currentSlideIndex, productData, selectedImage } = props;
  const [cursor, setCursor] = useState(false);
  const [activeImage, setActiveImage] = useState("");
  const [currentSlide, setCurrentSlide] = useState(currentSlideIndex);
  const [width, height] = useDeviceSize();

  const slider1 = useRef(null);
  const slider2 = useRef(null);
  const slider3 = useRef(null);

  const singleSetting = {
    dots: false,
    infinite: false,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    swipe: false,
    ref: slider1,
    currentSlide: currentSlide,
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
    ref: slider3,
  };

  const mobileSetting = {
    dots: false,
    infinite: false,
    speed: 100,
    slidesToShow: 7,
    slidesToScroll: 2,
    swipeToSlide: true,
    autoplay: false,
    currentSlide: currentSlide,
    ref: slider2,
    prevArrow: <></>, // or null
    nextArrow: <></>, // or null
  };

  useEffect(()=>{
    setActiveImage(selectedImage);
  },[selectedImage])

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

  function changeImage(imgSrc) {
    var selectedImgIndex = 0;
    var image = document.getElementById("myimage");

    selectedImgIndex = images.findIndex(
      (item) => item.popup === imgSrc.popup && item.thumb === imgSrc.thumb
    );

    setActiveImage(imgSrc);
    if (width >= 1024) {
      slider1.current.slickGoTo(selectedImgIndex);
    } else {
      slider3.current.slickGoTo(selectedImgIndex);
    }
  }

  return (
    <div className="fixed bg-white md:bg-dblackOverlay top-0 lef-0 right-0 bottom-0 w-full h-full z-40 overflow-hidden">
      <div className="relative z-50 h-screen mx-auto text-center box-border">
        <div className="absolute w-full lg:w-full m-auto h-screen lg:h-screen  z-50 bg-white top-0 left-0 right-0 bottom-0 ">
          <div className="h-full" id="popup_modal">
            <CgClose
              className="absolute right-1 m-3 w-7 z-10  h-7 md:w-9 md:h-9 cursor-pointer  text-dblack"
              onClick={() => closeModal()}
            />
            <div className="flex flex-col justify-center h-900 h-full">
              <div className=" flex flex-col h-full  justify-between lg:flex-row lg:mx-8 py-2 md:py-0">
                <div className="product-big-img lg:ml-4 lg:mr-3 w-full lg:w-5/12 flex flex-col h-5/6 justify-center items-center ">
                  <Slider
                    {...singleSetting}
                    className="w-full   hidden lg:block"
                  >
                    {images?.map((i) => (
                      <PrismaZoom
                        minZoom={1}
                        maxZoom={3}
                        onZoomChange={() => setCursor(!cursor)}
                        key={i["thumb"]}
                      >
                        <Image
                          id="myimage"
                          src={i["popup"]}
                          width={800}
                          height={800}
                          alt=""
                          className={`rounded-lg w-full  myimage-product-zoom  ${
                            cursor ? "cursor-zoom-out" : "cursor-zoom-in"
                          }`}
                        />
                      </PrismaZoom>
                    ))}
                  </Slider>
                  <Slider
                    {...mobileSingleSetting}
                    afterChange={handleFirstSliderChange}
                    className="w-full lg:hidden"
                  >
                    {images?.map((i) => (
                      <PrismaZoom
                        minZoom={1}
                        maxZoom={3}
                        onZoomChange={() => setCursor(!cursor)}
                        key={i["thumb"]}
                      >
                        <img
                          id="myimage"
                          src={i["popup"]}
                          alt="product-image"
                          className={`rounded-lg w-full  myimage-product-zoom  ${
                            cursor ? "cursor-zoom-out" : "cursor-zoom-in"
                          }`}
                        />
                      </PrismaZoom>
                    ))}
                  </Slider>
                </div>
                <div
                  className="product-info md:ml-10 lg:w-7/12 mb-8
                 md:pt-20"
                >
                  <div className="flex flex-col  text-left place-content-center">
                    <div
                      className="product-title hidden lg:block font-mono md:font-mono font-semibold  text-d17 md:text-d20 w-full"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHTML(productData.name),
                      }}
                    ></div>
                    <div className="model-nb hidden lg:block text-sm text-light mt-10">
                      Model Number: {productData.model}
                    </div>
                    {/* selector-div */}

                    <div className={`hidden lg:grid grid-cols-6 mt-7  `}>
                      {images?.map((i) => (
                        <div
                          key={i["thumb"]}
                          className={`mt-3 w-20 cursor-pointer border-2 rounded-md ${
                            activeImage["popup"] === i["popup"]
                              ? "border-dblue"
                              : "border-dgreyZoom"
                          } outline-none`}
                        >
                          <img
                            src={i["thumb"]}
                            alt="product-image"
                            onClick={() => changeImage(i)}
                            className={`cursor-pointer rounded-md `}
                          />
                        </div>
                      ))}
                    </div>

                    <Slider
                      {...mobileSetting}
                      className={` lg:hidden thumbss-slider  ${
                        images.length < 7 ? "thumbss-center-slider" : ""
                      }`}
                    >
                      {images?.map((i) => (
                        <div
                          key={i["thumb"]}
                          className={` flex justify-center  mt-2 mr-4 w-10 md:w-20  cursor-pointer ${
                            activeImage["popup"] === i["popup"]
                              ? "border-2 border-dblue"
                              : ""
                          } outline-none`}
                        >
                          <img
                            src={i["thumb"]}
                            alt="product-image"
                            onClick={() => changeImage(i)}
                            className={`cursor-pointer`}
                          />
                        </div>
                      ))}
                    </Slider>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductZoomModal;

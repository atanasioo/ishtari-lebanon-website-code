import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import { CgClose } from "react-icons/cg";
import PrismaZoom from "react-prismazoom";
import Image from "next/image";
import useDeviceSize from "../useDeviceSize";
import { sanitizeHTML } from "../Utils";
import { FullOverlay } from "../Overlay";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

function ProductZoomModal(props) {
  const { closeModal, images, currentSlideIndex, productData, selectedImage } = props;
  const [cursor, setCursor] = useState(false);
  const [activeImage, setActiveImage] = useState("");
  const [currentSlide, setCurrentSlide] = useState(currentSlideIndex);
  const [width, height] = useDeviceSize();
  const [overlay, setOverlay]= useState(false);

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
    prevArrow: <></>, // or null
    nextArrow: <></>, // or null
  };

  const mobileSetting = {
    dots: false,
    infinite: false,
    speed: 100,
    slidesToShow: 6,
    slidesToScroll: 2,
    swipeToSlide: true,
    autoplay: false,
    currentSlide: currentSlide,
    ref: slider2,
    prevArrow: <div><BsChevronLeft className="w-8 h-8 text-darrowZoom"/></div>, // or null
    nextArrow: <div><BsChevronRight className="w-8 h-8 text-darrowZoom"/></div>, // or null
  };

  useEffect(()=>{
    setActiveImage(selectedImage);
    if (width < 840) {
      const popup = document.getElementById("popup_modal");
      const backgroundImageUrl = selectedImage["popup"];
      const overlayColor = "rgba(0, 0, 0, 0.6)";
      // Create a new style element
      const style = document.createElement("style");
      style.type = "text/css";
      // Add a CSS rule for the #popup_modal::before pseudo-element
      const css = `#popup_modal::before { background-image: linear-gradient(${overlayColor}, ${overlayColor}), url(${backgroundImageUrl}); }`;
      style.appendChild(document.createTextNode(css));
      // Add the style element to the head of the document
      document.head.appendChild(style);
    }
  },[selectedImage])

  const handleFirstSliderChange = (index) => {
    setCurrentSlide(index);
    slider2.current.slickGoTo(index);
    setActiveImage(images[index]);
    const popup = document.getElementById("popup_modal");
    const backgroundImageUrl = activeImage["popup"];

    const overlayColor = "rgba(0, 0, 0, 0.6)";

    // Create a new style element
    const style = document.createElement("style");
    style.type = "text/css";
    // Add a CSS rule for the #popup_modal::before pseudo-element
    const css = `#popup_modal::before { background-image: linear-gradient(${overlayColor}, ${overlayColor}), url(${backgroundImageUrl}); }`;
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
    <div className="fixed bg-white md:bg-dblackOverlay top-0 lef-0 right-0 bottom-0 w-full h-full z-30 overflow-hidden">
      <div className="relative z-40 h-screen mx-auto text-center box-border">
        <div className="absolute w-full lg:w-full m-auto h-screen lg:h-fit z-50 bg-white top-0 left-0 right-0 bottom-0 " style={{maxHeight: "90%"}}>
          <div className="h-full" id="popup_modal">
            <CgClose
              className="absolute right-1 m-3 w-7 z-10  h-7 md:w-9 md:h-9 cursor-pointer  text-dblack"
              onClick={() => closeModal()}
            />
            <div className="flex flex-col justify-center h-full md:h-unset ">
              <div className=" flex flex-col h-full md:my-8  justify-between lg:flex-row lg:mx-8 py-2 md:py-0">
                <div className="product-big-img lg:ml-4 lg:mr-3 w-full md:w-4/5 md:mx-auto lg:mx-0 lg:w-5/12 flex flex-col h-5/6 justify-center items-center ">
                  <Slider
                    {...singleSetting}
                    className="w-11/12   hidden lg:block"
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
                          className={`rounded-lg w-full
                            myimage-product-zoom  ${
                            cursor ? "cursor-zoom-out" : "cursor-zoom-in"
                          }`}
                          style={{height: "80vh"}}
                          placeholder={"blur"}
                          blurDataURL="/images/product_placeholder_square.png"
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
                        <Image
                          id="myimage"
                          width={390}
                          height={530}
                          src={i["popup"]}
                          alt="product-image"
                          className={`rounded-lg w-full  myimage-product-zoom  ${
                            cursor ? "cursor-zoom-out" : "cursor-zoom-in"
                          }`}
                          placeholder={"blur"}
                          blurDataURL="/images/product_placeholder_square.png"
                        />
                      </PrismaZoom>
                    ))}
                  </Slider>
                </div>
                <div
                  className="product-info md:ml-10 lg:w-7/12 "
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
                          <Image
                            src={i["thumb"]}
                            width={76}
                            height={103}
                            alt="product-image"
                            onClick={() => changeImage(i)}
                            className={`cursor-pointer rounded-md `}
                            placeholder={"blur"}
                            blurDataURL="/images/product_placeholder_square.png"
                          />
                        </div>
                      ))}
                    </div>

                    <Slider
                      {...mobileSetting}
                      className={` lg:hidden thumbss-slider mx-5 mb-7 ${
                        images.length < 7 ? "thumbss-center-slider" : ""
                      }`}
                    >
                      {images?.map((i) => (
                        <div
                          key={i["thumb"]}
                          className={` flex justify-center border-b-4  pb-1 mt-2 mr-4 w-11 md:w-20  cursor-pointer ${
                            activeImage["popup"] === i["popup"]
                              ? "border-darrowZoom"
                              : "border-transparent"
                          } outline-none`}
                        >
                          <img
                            src={i["thumb"]}
                            alt="product-image"
                            onClick={() => changeImage(i)}
                            className={`cursor-pointer`}
                            placeholder="/images/product_placeholder_square.png"
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
      {/* <div className="fixed z-50 w-full h-screen left-0 bottom-0 top-0 bg-dblackOverlay"></div> */}
    </div>
  );
}

export default ProductZoomModal;

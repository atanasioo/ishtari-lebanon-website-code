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
  const [width] = useDeviceSize();
  const [overlay, setOverlay]= useState(false);

  const slider1 = useRef(null);
  const slider2 = useRef(null);
  const slider3 = useRef(null);
  const zoomRef = useRef(null);

  console.log("current slide index " +currentSlideIndex);
  console.log("current slide" +currentSlide);

  const singleSetting = {
    dots: false,
    infinite: false,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide:true,
    autoplay: false,
    swipe: false,
    ref: slider1,
    fade: true, 
    cssEase: 'linear', 
    currentSlide: currentSlide,
    prevArrow: <></>, // or null
    nextArrow: <></>, // or null
  };

  const mobileSingleSetting = {
    dots: false,
    infinite: false,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: false,
    autoplay: false,
    currentSlide: currentSlide,
    ref: slider3,
    fade: true, 
    cssEase: 'linear', 
    touchThreshold:100,
    prevArrow: <></>, // or null
    nextArrow: <></>, // or null
  };

  const mobileSetting = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: 6,
    slidesToScroll: 2,
    swipeToSlide: true,
    autoplay: false,
    currentSlide: currentSlide,
    ref: slider2,
    prevArrow: <div><BsChevronLeft className="w-8 h-8 -ml-2.5 text-darrowZoom"/></div>, // or null
    nextArrow: <div><BsChevronRight className="w-8 h-8 ml-4 text-darrowZoom"/></div>, // or null
  };

  useEffect(()=>{
    setActiveImage(selectedImage);
    // if (width < 840) {
    //   const popup = document.getElementById("popup_modal");
    //   const backgroundImageUrl = selectedImage["popup"];
    //   const overlayColor = "rgba(0, 0, 0, 0.6)";
    //   // Create a new style element
    //   const style = document.createElement("style");
    //   style.type = "text/css";
    //   // Add a CSS rule for the #popup_modal::before pseudo-element
    //   const css = `#popup_modal::before { background-image: linear-gradient(${overlayColor}, ${overlayColor}), url(${backgroundImageUrl}); }`;
    //   style.appendChild(document.createTextNode(css));
    //   // Add the style element to the head of the document
    //   document.head.appendChild(style);
    // }
  },[selectedImage])

  const handleFirstSliderChange = (index) => {
    console.log("index afetr swipe" + index);
    setCurrentSlide(index);
    slider2.current.slickGoTo(index);
    setActiveImage(images[index]);

    zoomRef.current.reset();

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
      <div className="modal_zoom_div relative z-40 h-full mx-auto text-center box-border">
        <div   className="modal_zoom_div absolute w-full lg:w-11/12 m-auto h-full  z-50 bg-white top-0 left-0 right-0 bottom-0 lg:max-h-90%">
          <div className=" m-0 p-0 md:min-h-full modal_zoom_div md:h-full bg-dblackOverlay3 lg:bg-white" id="popup_modal">
            <CgClose
              className="absolute top-1.5 right-1.5 p-0.5  w-9 h-9 z-10 md:w-9 md:h-9 cursor-pointer text-darrowZoom  lg:text-dblack"
              onClick={() => closeModal()}
              onTouchStart={() => closeModal()}
            />
            <div className={`flex flex-col justify-center ${width < 768 ? "items-center" : ""} md:justify-center modal_zoom_div  lg:h-unset mb-5`}>
              <div  className="flex flex-col browser-height  md:w-unset  lg:h-full md:my-8  justify-start gap-3  lg:justify-between lg:flex-row lg:mx-8 py-2 md:py-0">
                <div className="product-big-img lg:ml-4 lg:mr-3 w-full md:w-4/5 md:mx-auto lg:mx-0 lg:w-8/12 flex flex-col  lg:h-5/6 justify-center items-center ">
                  <Slider
                    {...singleSetting}
                    className="w-3/5 hidden lg:block modal-single-product-img-slider"
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
                          // width={800}
                          height={800}
                          alt=""
                          className={`rounded-lg 
                            myimage-product-zoom  ${
                            cursor ? "cursor-zoom-out" : "cursor-zoom-in"
                          }`}
                          style={{height: "80vh"}}
                          
                        />
                      </PrismaZoom>
                    ))}
                  </Slider>
                  <Slider
                    {...mobileSingleSetting}
                    afterChange={handleFirstSliderChange}
                    className="w-11/12 lg:hidden mobile-modal-single-product-img-slider"
                  >
                    {images?.map((i) => (
                      <PrismaZoom
                        minZoom={1}
                        maxZoom={3}
                        ref={zoomRef}
                        onZoomChange={() => setCursor(!cursor)}
                        key={i["thumb"]}
                      >
                        <img
                          id="myimage"
                          width={390}
                          height={450}
                          src={i["popup"]}
                          alt="product-image"
                          className={`   modal_zoom_div lg:max-h-full  myimage-product-zoom  ${
                            cursor ? "cursor-zoom-out" : "cursor-zoom-in"
                          }`}
                          
                        />
                      </PrismaZoom>
                    ))}
                  </Slider>
                </div>
                <div
                  className="product-info md:ml-10 lg:w-4/12 "
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

                    <div className={`hidden lg:grid lg:grid-cols-3  xl:grid-cols-4 2xl:grid-cols-5 mt-7 overflow-y-scroll lg:max-h-245px 2xl:max-h-410px`}>
                      {images?.map((i) => (
                        <div
                          key={i["thumb"]}
                          className={`mt-3 w-max cursor-pointer border-2 rounded-md ${
                            activeImage["popup"] === i["popup"]
                              ? "border-dblue"
                              : "border-dgreyZoom"
                          } outline-none`}
                        >
                          <img
                            src={i["thumb"]}
                            width={ images.length >12 ? 63 : 63}
                            height={images.length >12 ? 90 : 90}
                            alt="product-image"
                            onClick={() => changeImage(i)}
                            className={`cursor-pointer rounded-md `}
                           
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

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
  const zoomRef = useRef(null);

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
    speed: 200,
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
    speed: 200,
    slidesToShow: 6,
    slidesToScroll: 2,
    swipeToSlide: true,
    autoplay: false,
    currentSlide: currentSlide,
    ref: slider2,
    prevArrow: <div><BsChevronLeft className="w-8 h-8 text-darrowZoom"/></div>, // or null
    nextArrow: <div><BsChevronRight className="w-8 h-8 text-darrowZoom"/></div>, // or null
  };

  // useEffect(()=>{
  //   setActiveImage(selectedImage);
  //   if (width < 840) {
  //     const popup = document.getElementById("popup_modal");
  //     const backgroundImageUrl = selectedImage["popup"];
  //     const overlayColor = "rgba(0, 0, 0, 0.6)";
  //     // Create a new style element
  //     const style = document.createElement("style");
  //     style.type = "text/css";
  //     // Add a CSS rule for the #popup_modal::before pseudo-element
  //     const css = `#popup_modal::before { background-image: linear-gradient(${overlayColor}, ${overlayColor}), url(${backgroundImageUrl}); }`;
  //     style.appendChild(document.createTextNode(css));
  //     // Add the style element to the head of the document
  //     document.head.appendChild(style);
  //   }
  // },[selectedImage])

  const handleFirstSliderChange = (index) => {
    setCurrentSlide(index);
    slider2.current.slickGoTo(index);
    setActiveImage(images[index]);

    // Get the currently active slide index
    // const activeSlideIndex = slider3.current?.innerSlider?.state.currentSlide;

    // // Reset the zoom of the currently zoomed image by setting the zoom level to 1
    // if (slider3.current && activeSlideIndex !== null) {
    //   slider3.current.innerSlider.state.currentSlide = activeSlideIndex;
    //   console.log(slider3.current.innerSlider.props.children[activeSlideIndex].props.children[0].props.children[0]);
    // }
    zoomRef.current.reset();

    // const popup = document.getElementById("popup_modal");
    // const backgroundImageUrl = activeImage["popup"];

    // const overlayColor = "rgba(0, 0, 0, 0.6)";

    // // Create a new style element
    // const style = document.createElement("style");
    // style.type = "text/css";
    // // Add a CSS rule for the #popup_modal::before pseudo-element
    // const css = `#popup_modal::before { background-image: linear-gradient(${overlayColor}, ${overlayColor}), url(${backgroundImageUrl}); }`;
    // style.appendChild(document.createTextNode(css));
    // // Add the style element to the head of the document
    // document.head.appendChild(style);
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
        <div  className="absolute w-full lg:w-full m-auto h-screen lg:h-fit z-50 bg-white top-0 left-0 right-0 bottom-0 lg:max-h-90%">
          <div className="h-full bg-dblackOverlay3 lg:bg-white" id="popup_modal">
            <CgClose
              className="absolute right-0 p-0.5 md:m-3 w-8 z-10 bg-dblackOverlay md:bg-transparent rounded-sm h-8 md:w-9 md:h-9 cursor-pointer text-white  md:text-dblack"
              onClick={() => closeModal()}
            />
            <div className="flex flex-col justify-center h-100svh lg:h-unset">
              <div  className="flex flex-col h-100svh lg:h-full md:my-8  justify-center gap-3  lg:justify-between lg:flex-row lg:mx-8 py-2 md:py-0">
                <div className="product-big-img lg:ml-4 lg:mr-3 w-full md:w-4/5 md:mx-auto lg:mx-0 lg:w-5/12 flex flex-col  lg:h-5/6 justify-center items-center ">
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
                          // blurDataURL="/images/product_placeholder_square.png"
                          blurDataURL="data:image/png;base64,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"
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
                        ref={zoomRef}
                        onZoomChange={() => setCursor(!cursor)}
                        key={i["thumb"]}
                      >
                        <Image
                          id="myimage"
                          width={390}
                          height={450}
                          src={i["popup"]}
                          alt="product-image"
                          className={`rounded-lg w-full h-100svh  max-h-450px md:max-h-700px lg:max-h-full  myimage-product-zoom  ${
                            cursor ? "cursor-zoom-out" : "cursor-zoom-in"
                          }`}
                          placeholder={"blur"}
                          // blurDataURL="/images/product_placeholder_square.png"
                          blurDataURL="data:image/png;base64,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"
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

                    <div className={`hidden lg:grid grid-cols-6 mt-7`}>
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
                            width={ images.length >12 ? 63 : 76}
                            height={images.length >12 ? 90 : 103}
                            alt="product-image"
                            onClick={() => changeImage(i)}
                            className={`cursor-pointer rounded-md `}
                            placeholder={"blur"}
                            // blurDataURL="/images/product_placeholder_square.png"
                            blurDataURL="data:image/png;base64,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"
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

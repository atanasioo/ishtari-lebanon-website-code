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
                    className="w-8/12 hidden lg:block modal-single-product-img-slider"
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
                        <Image
                          id="myimage"
                          width={390}
                          height={450}
                          src={i["popup"]}
                          alt="product-image"
                          className={`   modal_zoom_div lg:max-h-full  myimage-product-zoom  ${
                            cursor ? "cursor-zoom-out" : "cursor-zoom-in"
                          }`}
                          placeholder={"blur"}
                          // blurDataURL="/images/product_placeholder_square.png"
                          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYkAAAIdCAIAAABHoBYiAAAACXBIWXMAAAsTAAALEwEAmpwYAAANBmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOS0wOC0wMVQxNjoyNTozOCswMzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wOC0yNlQwMjo1NzoyNiswMzowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDgtMjZUMDI6NTc6MjYrMDM6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjhhZTI3MzUtOTRmMS1lZTQwLWFjYjktNDcxNjM1NWY3MDE0IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6OTc4OTdjNWQtYTM3Ni1kZTQ1LWJlYjAtOWMxMWE2YjFlMjQzIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTYwYjM0MjMtY2QzMi02MzQ4LTg0YjQtYmIzYWFmNmE5MWNiIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB0aWZmOk9yaWVudGF0aW9uPSIxIiB0aWZmOlhSZXNvbHV0aW9uPSI3MjAwMDAvMTAwMDAiIHRpZmY6WVJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIgZXhpZjpDb2xvclNwYWNlPSIxIiBleGlmOlBpeGVsWERpbWVuc2lvbj0iNDYzIiBleGlmOlBpeGVsWURpbWVuc2lvbj0iNTQxIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1NjBiMzQyMy1jZDMyLTYzNDgtODRiNC1iYjNhYWY2YTkxY2IiIHN0RXZ0OndoZW49IjIwMTktMDgtMDFUMTY6MjU6MzgrMDM6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YWU5YzM4YzgtYjNmYi05NzQxLWE1MzQtYmY0NzI3ZWQxZWRlIiBzdEV2dDp3aGVuPSIyMDE5LTA4LTAxVDE2OjI1OjM4KzAzOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjIzMTgzMTMxLWVjMGMtOWM0OS1iYzJiLTI0YzI0MTZmYThlNSIgc3RFdnQ6d2hlbj0iMjAyMC0wOC0xMVQxMzowNzo0NCswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGltYWdlL3BuZyB0byBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBpbWFnZS9wbmcgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NTFiMDg2OTktOTBmZi01YTRjLWI0NjQtYWEwYjVhN2UyYjlmIiBzdEV2dDp3aGVuPSIyMDIwLTA4LTExVDEzOjA3OjQ0KzAzOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo5ZWRkM2UyMy0xM2JlLTAyNGQtYmIzMS1lMjliMzA5N2JhNmMiIHN0RXZ0OndoZW49IjIwMjAtMDgtMjZUMDI6NTc6MjYrMDM6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjY4YWUyNzM1LTk0ZjEtZWU0MC1hY2I5LTQ3MTYzNTVmNzAxNCIgc3RFdnQ6d2hlbj0iMjAyMC0wOC0yNlQwMjo1NzoyNiswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OWVkZDNlMjMtMTNiZS0wMjRkLWJiMzEtZTI5YjMwOTdiYTZjIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6Yjg4NzVhZDQtYWYwYy0wMTQ3LWJjMGMtODkzZWU3ZDQ1YWRkIiBzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTYwYjM0MjMtY2QzMi02MzQ4LTg0YjQtYmIzYWFmNmE5MWNiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+AAuhhwAAE29JREFUeNrt3YlaW0eCgNF5/6cboX3f933fEJ6S5HiIIzm6xAJkzvlo7O44BgT6u+qqbtX/fAP4fP7HQwBoE4A2AdoEoE2ANgFoE4A2AdoEoE2ANgFoE6BNANoEoE2ANgFoE6BNANoEaBOANgFoE6BNANoEaBOANgHaBKBNANoEaBOANgHaBKBNgDYBaBOANgHaBKBNgDYBaBOgTQDaBKBNgDYBaBOgTQDaBGgTgDYBaBOgTQDaBGgTgDYB2gSgTQDaBGgT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"
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

                    <div className={`hidden lg:grid lg:grid-cols-3  xl:grid-cols-4 2xl:grid-cols-5 mt-7 overflow-y-scroll lg:max-h-245px xl:max-h-410px`}>
                      {images?.map((i) => (
                        <div
                          key={i["thumb"]}
                          className={`mt-3 w-max cursor-pointer border-2 rounded-md ${
                            activeImage["popup"] === i["popup"]
                              ? "border-dblue"
                              : "border-dgreyZoom"
                          } outline-none`}
                        >
                          <Image
                            src={i["thumb"]}
                            width={ images.length >12 ? 63 : 63}
                            height={images.length >12 ? 90 : 90}
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

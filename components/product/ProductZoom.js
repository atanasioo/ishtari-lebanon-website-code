import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import useDeviceSize from "../useDeviceSize";
import ProductZoomModal from "./ProductZoomModal";
import SmallArrows from "./SmallArrows";
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import ShareSocial from "./ShareSocial";

function ProductZoom(props) {
  const { productData, activeOption } = props;
  const [activeImage, setActiveImage] = useState("");
  const [images, setImages] = useState(props.images);
  const [hoverZoom, setHoverZoom] = useState(false);
  const [lensClass, setLensClass] = useState("hidden");
  const [showModal, setShowModal] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [hovered, setHovered] = useState(props.hovered)
  const selectorSlider = useRef(null);
  const imageSlider = useRef(null);
  const [width, height] = useDeviceSize();

  console.log(hovered);

  const setting = {
    dots: false,
    infinite: false,
    speed: 100,
    slidesToShow: 3.15,
    slidesToScroll: 3,
    swipeToSlide: false,
    autoplay: false,
    vertical: true,
    prevArrow: <SmallArrows direction={"u"} />,
    nextArrow: <SmallArrows direction={"d"} />,
  };

  const mobileSetting = {
    dots: false,
    infinite: false,
    speed: 100,
    slidesToShow: 3.5,
    slidesToScroll: 1,
    swipeToSlide: true,
    autoplay: false,
  };

  const singleSetting = {
    dots: false,
    infinite: false,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    ref: imageSlider,
    swipe: false,
    prevArrow: <></>, // or null
    nextArrow: <></>, // or null
  };

  function closeModal() {
    setShowModal(false);
    // props.hideFixedCartMenu(false);
    const htmlElement = document.querySelector("html");
    htmlElement.classList.remove("popup-open");
    const bodyElement = document.querySelector("body");
    bodyElement.classList.remove("popup-open");
  }

  useEffect(() => {
    setImages(props.images);

    setActiveImage(images[0]);

    props?.images?.map((i, index) => {
      if (i.product_option_value_id === activeOption) {
        setActiveImage(i);
        imageSlider?.current?.slickGoTo(index);
        setActiveSlide(index);
      }
    });

    return () => {
      setActiveImage({});
      setImages([]);
    };
  }, [props.activeOption, props.images]);

  useEffect(() => {
    if (hoverZoom) {
      imageZoom("myimage" + activeSlide, "myresult");
    }
  }, [hoverZoom]);

  function changeImage(imgSrc) {
    var selectedImgIndex = 0;
    var image = document.getElementById("myimage");

    selectedImgIndex = images.findIndex(
      (item) => item.popup === imgSrc.popup && item.thumb === imgSrc.thumb
    );

    setActiveImage(imgSrc);

    imageSlider.current.slickGoTo(selectedImgIndex);
    setActiveSlide(selectedImgIndex);
  }

  function imageZoom(imgID, resultID) {
    var img, lens, result, cx, cy;
    img = document.getElementById(imgID);
    result = document.getElementById(resultID);
    /*check if lens alreay exists and remove it */
    const lensExist = document.getElementsByClassName("img-zoom-lens");
    const elementsArray = Array.from(lensExist);

    // Loop through the array and remove each element
    elementsArray.forEach((element) => {
      element.remove();
    });
    // lensExist.remove();

    /*create lens:*/
    lens = document.createElement("DIV");
    lens.setAttribute("class", "img-zoom-lens " + lensClass);
    /*insert lens:*/
    img.parentElement.insertBefore(lens, img);
    /*calculate the ratio between result DIV and lens:*/
    cx = result.offsetWidth / (lens.offsetWidth * 1.5);
    cy = result.offsetHeight / (lens.offsetHeight * 1.5);
    /*set background properties for the result DIV:*/
    result.style.backgroundImage = "url('" + img.src + "')";
    result.style.backgroundSize =
      img.width * cx + "px " + img.height * cy + "px";
    /*execute a function when someone moves the cursor over the image, or the lens:*/
    lens.addEventListener("mousemove", moveLens);
    img.addEventListener("mousemove", moveLens);
    /*and also for touch screens:*/
    lens.addEventListener("touchmove", moveLens);
    img.addEventListener("touchmove", moveLens);
    function moveLens(e) {
      var pos, x, y;
      /*prevent any other actions that may occur when moving over the imagee:*/
      e.preventDefault();
      /*get the cursor's x and y positions:*/
      pos = getCursorPos(e);
      /*calculate the position of the lenss:*/
      x = pos.x - lens.offsetWidth / (10 * 1.5);
      y = pos.y - lens.offsetHeight / (10 * 1.5);
      /*prevent the lens from being positioned outside the image:*/
      if (x < 0) {
        x = 0;
      }
      if (y < 0) {
        y = 0;
      }
      if (x > img.width - lens.offsetWidth) {
        x = img.width - lens.offsetWidth;
      }

      if (y > img.height - lens.offsetHeight) {
        y = img.height - lens.offsetHeight;
      }

      // prevent the lens from being positioned outside the image:
      x = Math.max(Math.min(x / 1.5, img.width - lens.offsetWidth), 0);
      y = Math.max(Math.min(y / 1.5, img.height - lens.offsetHeight), 0);

      /*set the position of the lens:*/
      lens.style.left = x + "px";
      lens.style.top = y + "px";
      /*display what the lens "sees":*/
      result.style.backgroundPosition = "-" + x * cx + "px -" + y * cy + "px";
    }
    function getCursorPos(e) {
      var a,
        x = 0,
        y = 0;
      e = e || window.event;
      /*get the x and y positions of the imagee:*/
      a = img.getBoundingClientRect();
      /*calculate the cursor's x and y coordinates, relative to the image:*/
      x = e.pageX - a.left;
      y = e.pageY - a.top;
      /*consider any page scrolling:*/
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      return { x: x, y: y };
    }
  }

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */

      if (showShare) {
        function handleClickOutside(event) {
          if (ref.current && !ref.current.contains(event.target)) {
            setTimeout(() => setShowShare(false), 200);
          }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }
    }, [ref, showShare]);
  }

  return (
    <div>
      {showModal && (
        <ProductZoomModal
          selectedImage={activeImage}
          images={images}
          productData={productData}
          currentSlideIndex={activeSlide}
          closeModal={closeModal}
          hideFixedCartMenu={props.hideFixedCartMenu}
        />
      )}
      {images.length > 0 && (
        <div className="flex flex-col-reverse md:flex-row ">
          <div
            id="selector_div"
            className="selector_div w-full my-2 md:w-2/12 md:pr-2"
          >
            <div className="selectors overflow-hidden overflow-y-hidden h-full  whitespace-pre md:whitespace-normal ">
              <Slider {...setting} className="hidden mobile:block">
                {images?.map((i) => (
                  <div
                    key={i["thumb"]}
                    className={` flex justify-center mt-2 mr-4 cursor-pointer transition-all ease-in-out outline-none`}
                  >
                    <Image
                      src={i["thumb"]}
                      alt="product image"
                      width={80}
                      height={120}
                      onClick={() => changeImage(i)}
                      className={`cursor-pointer border-2 ${
                        activeImage["popup"] === i["popup"]
                          ? "border-dblue"
                          : "border-dgreyZoom"
                      }`}
                    />
                  </div>
                ))}
              </Slider>
              <Slider {...mobileSetting} className=" mobile:hidden">
                {images?.map((i) => (
                  <div
                    key={i["thumb"]}
                    className={` flex justify-center mt-2 mr-4 cursor-pointer transition-all ease-in-out outline-none`}
                  >
                    <Image
                      src={i["thumb"]}
                      alt="product image"
                      width={80}
                      height={120}
                      onClick={() => changeImage(i)}
                      className={`cursor-pointer border-2 ${
                        activeImage["popup"] === i["popup"]
                          ? "border-dblue"
                          : "border-dgreyZoom"
                      }`}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
          <div className="w-full md:w-10/12 relative flex items-center ">
            <div className="w-full md:w-11/12 hover:cursor-zoom-in relative">
              <div
                onClick={() => {
                  //htmlOverflow();
                  setShowModal(true);
                  //props.hideFixedCartMenu(true);
                }}
                onMouseEnter={() => {
                  setHoverZoom(true);
                  setLensClass("");
                }}
                onMouseLeave={() => {
                  setHoverZoom(false);
                  setHovered(true);
                  setLensClass("hidden");
                }}
              >
                <Slider {...singleSetting}>
                  {images?.map((i, index) => (
                    <Image
                      key={i["thumb"]}
                      id={`myimage${index}`}
                      src={i["popup"]}
                      alt="product image"
                      width={500}
                      height={500}
                      className="rounded-lg myimage-product-zoom"
                    />
                  ))}
                </Slider>
              </div>
              <div
                className={`${showModal ? "hidden" : ""}`}
                onClick={() => setShowShare(true)}
              >
                <ShareSocial
                  image={productData.popup}
                  share={showShare}
                  wrapperRef={wrapperRef}
                  name={productData.name}
                />
              </div>
            </div>

            <div>
              <div
                id="myresult"
                style={{ transition: "opacity 0.3s ease" }}
                className={`img-zoom-result absolute rounded-lg  top-0 ml-4  z-10  ${
                  hoverZoom && hovered && width > 650 ? "" : " hidden"
                }`}
              ></div>
            </div>
          </div>
        </div>
      )}
      <div></div>
    </div>
  );
}

export default ProductZoom;

import Image from "next/legacy/image";
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import useDeviceSize from "../useDeviceSize";
import ProductZoomModal from "./ProductZoomModal";
import SmallArrows from "./SmallArrows";
import ShareSocial from "./ShareSocial";
import { useRouter } from "next/router";
import { BiRightArrowCircle } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { slugify } from "../Utils";

function ProductZoom(props) {
  const { productData, activeOption, additionalData, sellerData } = props;
  const [activeImage, setActiveImage] = useState([]);
  const [images, setImages] = useState([]);
  const [hoverZoom, setHoverZoom] = useState(false);
  const [lensClass, setLensClass] = useState("hidden");
  const [showModal, setShowModal] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [hovered, setHovered] = useState(props.hovered);
  const [additionalArr, setAdditionalArr] = useState([]);
  const [sellerSlide, setSellerSlide] = useState(false);
  // const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const imageSlider = useRef(null);
  const SmallImageSlider = useRef(null);
  const activeImageRef = useRef(null); // Ref to the currently active image element
  const smallMobileSliderRef = useRef(null);
  const router = useRouter();
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [routeChanged, setRouteChanged] = useState(false);
  const [width] = useDeviceSize();

  const setting = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3.8,
    slidesToScroll: 3,
    swipeToSlide: false,
    autoplay: false,
    vertical: true,
    ref: SmallImageSlider,
    currentSlide: activeSlide,
    prevArrow: <SmallArrows direction={"u"} />,
    nextArrow: <SmallArrows direction={"d"} />
  };

  const mobileSetting = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: width > 375 ? 4 : width > 300 ? 3 : 2,
    slidesToScroll: 2,
    // slidesToShow: 3.75,
    // slidesToScroll: 2,
    // swipeToSlide: true,
    autoplay: false,
    ref: smallMobileSliderRef,
    variableWidth: true,
    className: "slider variable-width"
  };

  const singleSetting = {
    dots: false,
    infinite: false,
    speed: 350,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    ref: imageSlider,
    swipe: width > 768 ? false : true,
    fade: true,
    cssEase: "linear",
    touchThreshold: 100,
    afterChange: (currentSlide) => handleSingleMobileChange(currentSlide),
    prevArrow: <></>, // or null
    nextArrow: <></> // or null
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

    props?.images?.map((i, index) => {
      if (i.product_option_value_id === activeOption) {
        setActiveImage(i);
        imageSlider?.current?.slickGoTo(index);
        // SmallImageSlider?.current?.slickGoTo(index);
        setActiveSlide(index);
      }
    });

    return () => {
      setActiveImage({});

      setImages([]);
    };
  }, [props.activeOption, props.images]);

  useEffect(() => {
    // Use activeImage here, it will have the updated value.
  }, [activeImage]);

  useEffect(() => {
    setActiveImage(images[0]);
    setActiveSlide(0);
    imageSlider?.current?.slickGoTo(0);
    SmallImageSlider?.current?.slickGoTo(0);
    smallMobileSliderRef?.current?.slickGoTo(0);
    // setAllImagesLoaded(false);
    setHovered(false);
  }, [images]);

  useEffect(() => {
    setActiveSlide(0);
    imageSlider?.current?.slickGoTo(0);
    SmallImageSlider?.current?.slickGoTo(0);
    smallMobileSliderRef?.current?.slickGoTo(0);
    setSellerSlide(false);
  }, [router]);

  const maxComments = 2;
  const commentDuration = 3500;
  const [currentCommentIndex, setCurrentCommentIndex] = useState(0);
  const commentRef = useRef(null);
  let timer;

  useEffect(() => {
    if (Object.keys(additionalData).length > 0) {
      if (typeof additionalData?.analytics !== "undefined") {
        const newComment = additionalData.analytics[currentCommentIndex].trim();
        const nonEmptyCount = additionalData.analytics.filter(
          (comment) => comment.trim() !== ""
        ).length;

        timer = setInterval(
          () => {
            setAdditionalArr((prevComments) => {
              const newComments = [...prevComments];
              if (newComment !== "") {
                // Skip empty strings
                newComments.push(additionalData.analytics[currentCommentIndex]);
                if (newComments.length > maxComments) {
                  setTimeout(() => {
                    newComments.shift(); // Remove the oldest comment
                    newComments.shift();
                  }, 10);
                }
              }
              return newComments;
            });
            setCurrentCommentIndex((prevIndex) => {
              if (prevIndex === 0) {
                setTimeout(
                  () => {
                    setIsFadingOut(true);

                    setTimeout(() => {
                      setAdditionalArr([]); // Empty the array when index resets
                      setIsFadingOut(false);
                    }, 1000);
                  },
                  nonEmptyCount !== 1 ? 1000 : 3000
                );
              }
              return (prevIndex + 1) % additionalData.analytics.length;
            });
          },
          newComment !== "" ? commentDuration : 1000
        );

        // Clear interval on component unmount.
        return () => clearInterval(timer);
      }
    }
  }, [additionalData, currentCommentIndex]);

  //cleanup useeffect
  useEffect(() => {
    const handleRouteChange = () => {
      // Clear interval and reset comment-related states
      clearInterval(timer);
      setAdditionalArr([]);
      setCurrentCommentIndex(0);
      setIsFadingOut(false);
      // setImages([]);
      setRouteChanged(true);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      clearInterval(timer);
      setRouteChanged(false);
    };
  }, []);

  useEffect(() => {
    if (hoverZoom && width > 768) {
      imageZoom("myimage" + activeSlide, "myresult");
    }
  }, [hoverZoom, hovered]);

  function changeImage(imgSrc) {
   // console.log(imgSrc);
    var selectedImgIndex = 0;
    var image = document.getElementById("myimage");

    selectedImgIndex = images.findIndex(
      (item) => item.popup === imgSrc.popup && item.thumb === imgSrc.thumb
    );
   // console.log(selectedImgIndex);
    if (selectedImgIndex < 0) {
      selectedImgIndex = images.length;
     // console.log(selectedImgIndex);
    }

    setActiveImage(imgSrc);

    imageSlider.current.slickGoTo(selectedImgIndex);
    setActiveSlide(selectedImgIndex);
  }

  function handleSingleMobileChange(currentSlide) {
    if (width < 768) {
      if (!routeChanged) {
        setActiveImage(images[currentSlide]);
      }
      setActiveSlide(currentSlide);
      smallMobileSliderRef.current.slickGoTo(currentSlide);
      if (
        currentSlide === images.length &&
        Object.keys(sellerData).length > 0
      ) {
        setSellerSlide(true);
      } else {
        setSellerSlide(false);
      }
    }
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
    /*create lens:*/
    lens = document.createElement("DIV");
    lens.setAttribute("class", "img-zoom-lens " + lensClass);
    /*insert lens:*/
    img?.parentElement.insertBefore(lens, img);
    /*calculate the ratio between result DIV and lens:*/
    cx = result.offsetWidth / (lens.offsetWidth * 1.05);
    cy = result.offsetHeight / (lens.offsetHeight * 1.05);
    /*set background properties for the result DIV:*/
    result.style.backgroundImage = "url('" + img?.src + "')";
    result.style.backgroundSize =
      img?.width * cx + "px " + img?.height * cy + "px";

    if (width > 768) {
      /*execute a function when someone moves the cursor over the image, or the lens:*/
      lens.addEventListener("mousemove", moveLens);
      img?.addEventListener("mousemove", moveLens);
    } else {
      /*and also for touch screens:*/
      lens.addEventListener("touchmove", moveLens);
      img?.addEventListener("touchmove", moveLens);
    }

    function moveLens(e) {
      var pos, x, y;
      /*prevent any other actions that may occur when moving over the imagee:*/
      e.preventDefault();
      /*get the cursor's x and y positions:*/
      pos = getCursorPos(e);
      /*calculate the position of the lenss:*/
      // x = pos.x - lens.offsetWidth / (10 * 1.05);
      // y = pos.y - lens.offsetHeight / (10 * 1.05);
      x = pos.x - lens.offsetWidth / 2;
      y = pos.y - lens.offsetHeight / 2;
      /*prevent the lens from being positioned outside the image:*/
      if (x < 0) {
        x = 0;
      }
      if (y < 0) {
        y = 0;
      }
      if (x > img?.width - lens.offsetWidth) {
        x = img?.width - lens.offsetWidth;
      }

      if (y > img?.height - lens.offsetHeight) {
        y = img?.height - lens.offsetHeight;
      }

      // prevent the lens from being positioned outside the image:
      x = Math.max(Math.min(x / 1.05, img?.width - lens.offsetWidth), 0);
      y = Math.max(Math.min(y / 1.05, img?.height - lens.offsetHeight), 0);

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
      a = img?.getBoundingClientRect();
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

  function htmlOverflow() {
    const htmlElement = document.querySelector("html");
    const bodyElement = document.querySelector("body");

    // Add a CSS class to remove the overflow-y
    htmlElement.classList.add("popup-open");
    bodyElement.classList.add("popup-open");
  }

  // Function to remove popup-open class when the user starts navigating to a new route
  const handleRouteChangeStart = () => {
    const htmlElement = document.querySelector("html");
    htmlElement.classList.remove("popup-open");
    const bodyElement = document.querySelector("body");
    bodyElement.classList.remove("popup-open");
  };

  useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChangeStart);

    // Clean up the event listener when the component unmounts
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router.events]);

  return (
    <div className="h-full">
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
        <div className="flex flex-col-reverse md:flex-row sticky top-0 z-10">
          <div
            id="selector_div"
            className="selector_div w-full my-2 md:w-[35%] lg:w-2/12 md:pr-2"
          >
            <div className="selectors overflow-hidden overflow-y-hidden h-full  whitespace-pre md:whitespace-normal">
              <Slider {...setting} className="hidden md:block">
                {images?.map((i) => (
                  <div
                    key={i["thumb"]}
                    className={` flex justify-center mt-2 mr-4 rounded-md cursor-pointer transition-all ease-in-out outline-none `}
                  >
                    <img
                      src={i["thumb"]}
                      alt="product image"
                      width={80}
                      height={120}
                      onClick={() => changeImage(i)}
                      className={`cursor-pointer border-2 
                      ${
                        activeImage && activeImage["popup"] === i["popup"]
                          ? "border-dblue"
                          : "border-dgreyZoom"
                      }`}
                    />
                  </div>
                ))}
              {productData?.videos &&  productData?.videos[0]  && <div
                  key={productData?.videos && productData?.videos[0]}
                  onClick={() => changeImage(productData?.videos[0])}
                  className={`bg-dblack  flex justify-center mt-2 mr-4 h- rounded-md cursor-pointer transition-all ease-in-out outline-none `}
                >
                  <video
                    className={`cursor-pointer border-2 
                      ${
                        activeImage &&
                        productData?.videos &&
                        (productData?.videos[0] === activeImage ||
                          productData?.videos[0] === activeImage[0])
                          ? "border-dblue"
                          : "border-dgreyZoom"
                      }`}
                    style={{ height: "100px" }}
                    src={productData?.videos && productData?.videos[0]}
                    type="video/mp4"
                  />
                </div>
}
              </Slider>
              <Slider {...mobileSetting} className={`md:hidden`}>
                {images?.map((i, index) => (
                  <div
                    key={i["thumb"]}
                    ref={(el) => {
                      if (activeImage && activeImage["popup"] === i["popup"]) {
                        activeImageRef.current = el;
                      }
                    }}
                    className={` flex justify-center mt-2 mr-4 cursor-pointer transition-all ease-in-out outline-none`}
                  >
                    <img
                      src={i["thumb"]}
                      alt="product image"
                      width={80}
                      height={120}
                      onClick={() => changeImage(i)}
                      className={`cursor-pointer border-2 ${
                        activeImage?.popup === i["popup"]
                          ? //  activeSlide === index
                            "border-dblue"
                          : "border-dgreyZoom"
                      }`}
                    />

                    {/* {
                        activeImage && activeImage["popup"] === i["popup"]
                          ? //  activeSlide === index
                            "border-dblue"
                          : "border-dgreyZoom"
                      } */}
                  </div>
                ))}

                {Object.keys(sellerData).length > 0 && width < 768 && (
                  <div
                    className={`flex justify-center h-[107px] items-center mt-2 mr-4 text-d28 pr-bold transition-all ease-in-out outline-none cursor-pointer border-2 ${
                      sellerSlide ? "border-dblue" : "border-dgreyZoom"
                    } text-dblue rounded`}
                    onClick={() => {
                      setSellerSlide(true);
                      setActiveSlide(images.length);
                      imageSlider.current.slickGoTo(images.length);
                    }}
                  >
                    ...
                  </div>
                )}

                {productData?.videos && productData?.videos.length > 0 && (
                  <div
                    key={productData?.videos && productData?.videos[0]}
                    onClick={() => changeImage(productData?.videos[0])}
                    className={`flex justify-center mt-2 mr-4 h-24  rounded-md cursor-pointer transition-all ease-in-out outline-none `}
                  >
                    <video
                      className={`cursor-pointer border-2
                      ${
                        productData?.videos &&
                        productData?.videos[0] === activeImage
                          ? "border-dblue"
                          : "border-dgreyZoom"
                      }`}
                    >
                      <source
                        src={productData?.videos && productData?.videos[0]}
                        type="video/mp4"
                      />
                    </video>
                  </div>
                )}
              </Slider>
            </div>
          </div>
          <div className="w-full md:w-2/3 lg:w-10/12 relative flex items-center ">
            <div
              className="w-full md:w-11/12 md:hover:cursor-zoom-in relative"
              // onTouchStart={handleTouchStart}
              // onTouchMove={handleTouchMove}
              // onTouchEnd={handleTouchEnd}
            >
              <div
                onClick={() => {
                  !sellerSlide && htmlOverflow();
                  !sellerSlide && setShowModal(true);
                  //props.hideFixedCartMenu(true);
                }}
                onMouseEnter={() => {
                  setHoverZoom(true);
                  setLensClass("");
                }}
                onMouseLeave={() => {
                  setHoverZoom(false);
                  // setHovered(true);
                  setLensClass("hidden");
                }}
                onMouseMoveCapture={() => {
                  if (!hovered) {
                    setHovered(true);
                    setHoverZoom(true);
                  }
                }}
              >
                <Slider
                  {...singleSetting}
                  className="single-product-img-slider"
                >
                  {images?.map((i, index) => (
                    <Image
                      key={i["thumb"]}
                      id={`myimage${index}`}
                      src={i["popup"]}
                      alt="product image"
                      width={500}
                      height={680}
                      priority={true}
                      className="rounded-lg myimage-product-zoom"
                    />
                  ))}

                  {productData?.videos && productData?.videos.length > 0 && (
                    <div className="h-full bg-dblack">
                      <video
                        id={`myimage${images.length}`}
                        src={productData?.videos && productData?.videos[0]}
                        type="video/mp4"
                        style={{ height: "480px" }}
                        controls
                        controlsList="nodownload"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                  {Object.keys(sellerData).length > 0 && width < 768 && (
                    <div className="black-gradient h-full flex flex-col justify-center items-start p-2">
                      <div className="pr-semibold text-white pb-2">
                        Seller Recommendations
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {sellerData.products.map((product) => (
                          <Link
                            href={`/${slugify(product.name)}/p=${
                              product.product_id
                            }`}
                            className="rounded-xl bg-white p-2"
                          >
                            <div className="rounded-b-xl border-b border-dgreyRate">
                              <Image
                                src={product.thumb}
                                alt={product.name}
                                width={120}
                                height={100}

                                // placeholderSrc="/images/product_placeholder.png"
                              />
                            </div>
                            <div className="text-center pt-3 pb-1 pr-semibold">
                              {product.special !== ""
                                ? product.special
                                : product.price}
                            </div>
                          </Link>
                        ))}
                        <Link
                          href={`/${slugify(productData.seller)}/s=${
                            productData.seller_id
                          }`}
                          className="rounded-xl bg-white p-2 flex justify-center items-center"
                        >
                          <div className="flex flex-col text-dblue items-center gap-2">
                            <BiRightArrowCircle className="w-11 h-11" />
                            <div className="text-sm">Discover More</div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  )}
                </Slider>
              </div>

              {/* {!allImagesLoaded && (
                <div className="loader-images absolute z-20 w-full h-full top-0 left-0 right-0 bottom-0 m-auto flex items-center justify-center opacity-60">
                  <div className="bg-white rounded-full p-4">
                    <BiLoaderCircle className=" w-9 h-9" />
                  </div>
                </div>
              )} */}

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

              {/* additional data */}

              {/* <div className="absolute z-10 bottom-0 left-0 text-xs additional-data-div">
                {additionalArr?.map((list, index) => (
                  <div
                    key={index}
                    className={`w-fit flex items-center px-3 gap-1 rounded-full py-1 mb-2.5 additional-data-div-div`}
                    style={{
                      background: "hsla(0,0%,100%,.8)",
                      boxShadow: "0 0 0.1rem 0 rgba(0,0,0,.07)",
                    }}
                  >
                    <div>
                      <FaUserCircle className="text-dgreyProduct w-6 h-6" />
                    </div>
                    <div className="">{list}</div>
                  </div>
                ))}
              </div> */}
              <div className="additional-data-div absolute z-10 bottom-0 left-0 text-xs">
                <div className="live-comments-container">
                  {additionalArr.map((comment, index) => (
                    <div
                      key={index}
                      className={`live-comment w-fit flex items-center px-3 gap-1 rounded-full py-1 mb-2.5 additional-data-div-div ${
                        isFadingOut ? "live-comment-fadeout" : ""
                      }`}
                      style={{
                        background: "hsla(0,0%,100%,.8)",
                        boxShadow: "0 0 0.1rem 0 rgba(0,0,0,.07)",
                        animationDelay: `${index * 0.2}s` // Delay each comment's animation
                      }}
                      ref={commentRef}
                    >
                      <div>
                        <FaUserCircle className="text-dgreyProduct w-6 h-6" />
                      </div>
                      <div className="">{comment}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div
                id="myresult"
                style={{ transition: "opacity 0.3s ease" }}
                className={`img-zoom-result absolute  rounded-lg top-3 ml-4  z-10  ${
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

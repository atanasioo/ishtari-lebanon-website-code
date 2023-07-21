import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import ShareSocial from "./ShareSocial";
import SmallArrows from "./SmallArrows";

function MagicZoom(props) {
  const { productData, activeOption } = props;
  const [images, setImages] = useState([]);
  const [showShare, setShowShare] = useState(false);
  const [activeImage, setActiveImage] = useState({});
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const router = useRouter();

  // useEffect(() => {
  //   console.log("hello can you hear me");
  //   setImages(props.images);
  //   try {
  //     document.getElementById("mag-z-id").outerHTML = "";
  //   } catch (e) {}

  //   const script = document.createElement("script");
  //   script.src = "https://www.ishtari.com/magiczoomplus/magiczoomplus.js";
  //   script.async = false;
  //   script.id = "mag-z-id";
  //   document.body.appendChild(script);
  //   setActiveImage(images[0]);
  //   props?.images?.map((i, index) => {
  //     if (i.product_option_value_id === props.activeOption) {
  //       setActiveImage(i);
  //       setActiveImageIndex(index);
  //     }
  //   });

  //   return () => {
  //     setActiveImage({});
  //     setImages([]);
  //     setActiveImageIndex(0);
  //   };
  // }, [activeOption, router]);

  // useEffect(() => {
  //   console.log("hello can you hear me");
  //   setImages(props.images);
  //   try {
  //     document.getElementById("mag-z-id").outerHTML = "";
  //   } catch (e) {}

  //   // Load magiczoom.js script asynchronously
  //   const script = document.createElement("script");
  //   script.src = "https://www.ishtari.com/magiczoomplus/magiczoomplus.js";
  //   script.async = true;
  //   script.id = "mag-z-id";
  //   script.onload = () => {
  //     // Callback when the script is successfully loaded
  //     // Now you can initialize Magic Zoom here, after the script is loaded
  //     setActiveImage(images[0]);
  //     props?.images?.map((i, index) => {
  //       if (i.product_option_value_id === props.activeOption) {
  //         setActiveImage(i);
  //         setActiveImageIndex(index);
  //       }
  //     });
  //   };
  //   script.onerror = () => {
  //     // Callback when there's an error loading the script
  //     console.error("Error loading magiczoom.js");
  //   };
  //   document.body.appendChild(script);

  //   return () => {
  //     setActiveImage({});
  //     setImages([]);
  //     setActiveImageIndex(0);
  //   };
  // }, [activeOption, router]);

  useEffect(() => {
    console.log("hello can you hear me");
    setImages(props.images);
    try {
      document.getElementById("mag-z-id").outerHTML = "";
    } catch (e) {}

    // Load magiczoom.js script asynchronously
    const loadScript = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://www.ishtari.com/magiczoomplus/magiczoomplus.js";
        script.async = true;
        script.id = "mag-z-id";
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    loadScript()
      .then(() => {
        // Magic Zoom script loaded successfully
        setActiveImage(images[0]);
        props?.images?.map((i, index) => {
          if (i.product_option_value_id === props.activeOption) {
            setActiveImage(i);
            setActiveImageIndex(index);
            console.log("hello there");
          }
        });
      })
      .catch((error) => {
        console.error("Error loading magiczoom.js", error);
      });

    return () => {
      setActiveImage({});
      setImages([]);
      setActiveImageIndex(0);
    };
  }, [activeOption, router]);

  useEffect(() => {
    setActiveImage(images[0]);
  }, [images]);

  const setting = {
    dots: false,
    infinite: false,
    speed: 500,
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
      {images?.length > 0 && (
        <div
          className="flex flex-col-reverse md:flex-row "
          key={activeImage?.popup}
        >
          <div
            id="selector_div"
            className="selector_div w-full my-2 md:w-1/4 lg:w-2/12 md:pr-2"
          >
            <div className="selectors overflow-hidden overflow-y-hidden h-full  lg:max-h-full whitespace-pre md:whitespace-normal">
              <Slider {...setting} className="hidden mobile:block">
                {images?.map((i, index) => (
                  <a
                    data-zoom-id="Zoom-1"
                    href={i["popup"]}
                    key={i["popup"]}
                    data-image={i["popup"]}
                    data-zoom-image-2x={i["popup"]}
                    data-image-2x={i["popup"]}
                    className="mz-thumb flex justify-center mb-2.5"
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img
                      srcSet={i["thumb"]}
                      src={i["thumb"]}
                      alt="product image"
                      className={`w-20 ${
                        activeImageIndex === index
                          ? "border-2 border-dblue"
                          : ""
                      }`}
                      width={76}
                      height={108}
                      style={{ height: "108px" }}
                    />
                  </a>
                ))}
              </Slider>
              {/* <Slider {...mobileSetting} className=" mobile:hidden"> */}
              <div className=" mobile:hidden flex overflow-x-auto">
                {images?.map((i, index) => (
                  <a
                    data-zoom-id="Zoom-1"
                    href={i["popup"]}
                    key={i["popup"]}
                    data-image={i["popup"]}
                    data-zoom-image-2x={i["popup"]}
                    data-image-2x={i["popup"]}
                    className="mz-thumb flex justify-center"
                    // onTouchStart={() => setActiveImageIndex(index)}
                    onTouchStart={(event) => {
                      event.preventDefault(); // Prevent the default click behavior
                      setActiveImageIndex(index);
                    }}
                  >
                    <img
                      srcSet={i["thumb"]}
                      src={i["thumb"]}
                      alt="product image"
                      className={`${
                        activeImageIndex === index
                          ? "border-2 border-dblue"
                          : ""
                      }`}
                      width={76}
                      height={108}
                    />
                  </a>
                ))}
              </div>

              {/* </Slider> */}
            </div>
          </div>
          <div className="w-full md:w-10/12 relative flex items-center ">
            <div className="w-full md:w-11/12 h-full ">
              <div className="w-full md:w-11/12 relative">
                <a
                  id="Zoom-1"
                  className="MagicZoom"
                  href={activeImage && activeImage["popup"]}
                >
                  <img
                    src={activeImage && activeImage["popup"]}
                    alt=""
                    className="rounded-lg "
                  />
                </a>
                <div onClick={() => setShowShare(true)}>
                  <ShareSocial
                    image={productData.popup}
                    share={showShare}
                    wrapperRef={wrapperRef}
                    name={productData.name}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MagicZoom;

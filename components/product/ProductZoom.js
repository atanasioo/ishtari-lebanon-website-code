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
import { useRouter } from "next/router";

function ProductZoom(props) {
  const { productData, activeOption } = props;
  const [activeImage, setActiveImage] = useState([]);
  const [images, setImages] = useState([]);
  const [hoverZoom, setHoverZoom] = useState(false);
  const [lensClass, setLensClass] = useState("hidden");
  const [showModal, setShowModal] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [hovered, setHovered] = useState(props.hovered);
  const imageSlider = useRef(null);
  const SmallImageSlider = useRef(null);
  const router= useRouter();

  const [width, height] = useDeviceSize();

  const setting = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3.15,
    slidesToScroll: 3,
    swipeToSlide: false,
    autoplay: false,
    vertical: true,
    ref: SmallImageSlider,
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
    speed: 350,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    ref: imageSlider,
    // swipe: false,
    // touchMove: true, // Enable touchMove when isSlidingEnabled is true
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

  // function hideLens() {
  //   const lensElement = document.querySelector(".img-zoom-lens");
  //   if (lensElement) {
  //     lensElement.remove();
  //   }
  // }


  useEffect(() => {
    setActiveImage(images[0]);
    setActiveSlide(0);
    imageSlider?.current?.slickGoTo(0);
    SmallImageSlider?.current?.slickGoTo(0);
  }, [images]);

  useEffect(() => {
    if (hoverZoom && width > 768) {
      imageZoom("myimage" + activeSlide, "myresult");
    } 
    // else {
    //   // Hide the lens when not hovering over the image
    //   hideLens();
    // }
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
    ///

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
    /*execute a function when someone moves the cursor over the image, or the lens:*/
    lens.addEventListener("mousemove", moveLens);
    img?.addEventListener("mousemove", moveLens);
    /*and also for touch screens:*/
    lens.addEventListener("touchmove", moveLens);
    img?.addEventListener("touchmove", moveLens);
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
              <Slider {...setting} className="hidden md:block">
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
                        activeImage && activeImage["popup"] === i["popup"]
                          ? "border-dblue"
                          : "border-dgreyZoom"
                      }`}
                      placeholder={"blur"}
                      // blurDataURL="/images/product_placeholder_square.png"
                      blurDataURL="data:image/png;base64,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"
                    />
                  </div>
                ))}
              </Slider>
              {/* <Slider {...mobileSetting} className=" md:hidden"> */}
              <div className="md:hidden flex overflow-x-auto pb-2.5">
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
                        activeImage && activeImage["popup"] === i["popup"]
                          ? "border-dblue"
                          : "border-dgreyZoom"
                      }`}
                      placeholder={"blur"}
                      // blurDataURL="/images/product_placeholder_square.png"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYkAAAGJCAIAAADwv1jqAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAFGlJREFUeJzt3Ql7olgWgOH5/79uFFFxAdw3XFBwNz0HSWXSVZoCE+Wg3/s46equ6rik/eaCl3v/8w8A6POfrB8AAFxAmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEmwBoRJsAaESbAGhEm57N4XBY/1v4mfx9EK59f71YhL4f+stguVwtl0t/MZ/Pp9PpZDIZjUbD4XAwGPT/0JP/Oe6g0Rw4Tt91e26r47otx7GbTbvRqNfrNcuqVquVSkW+dpq2NxptN5usXxLkEm16Im9vs9nMqlqlvzPjvxhyOysmVyoVTLMgXw2j8PW/eP5d0zQHvd7xeMz61UHO0KbnsV0FUppiqtA8Rslwm8230ynrVwh5QpuehxyUZR2h6wqFmedl/QohT2jT89itN2Y0bso6Q5fI0Z/daLy9vWX9IiE3aNNTWc5mjUajLEzz/SxSSUurSqXShvPiSIw2PZvT6bQTm81qtfKmntfvD3s923FqllWrVEzTjDpRKDy+TdLKMAyzfnmQG7Tphbyd3mTk4ovzdIFOt9tyXbfZtCyrfGaWTONXSP5/Tv2HTq7LuIk2ITnahGhK1FZsNtswlHBNxHDY73YbzWZdRlvVaikebX2vUYybkAptwlVvb29yhHg8HNfr9VLM5t543G63HdsupR9MWbWaRDDr54TcoE24xWq1qlSt5GEqFIuDTjfrR408oU240aTfT34qSo4K10GQ9UNGntAm3GgxniQfN9UbjRPzwpEGbcKN3JabvE3eaJT140XO0CbcYr1cGaVSwjBVKpXDbpf1Q0bO0Cak9vb21m21kg+a+r1e1g8Z+UObkNp+tyuXywnDZBhGwFlwpEebkFqqT+hs2+YSX9yANiGd4/FoJR40iclkkvVDRi7RJqQznc2Sh6lsmrvtNuuHjFyiTUjhdDrVarXkbep2mQuOG9EmpOD7fvIwGcVisFpl/ZCRV7QJKbTb7eRtajIXHN9Am5DUdrN5X5oumel4nPVDRo7RJiQ17PWSh6lUKnEWHN9Bm17a29vb8XBYh2Hg+18v/LbbbE0z6UUqotPpPOxZ4CnRptdyOh5lOBNt4TuZSD7seiNa1vK8g6Z8nY2vzkUadrvJ51vKd1sul498Xng+tOlpyZgo2tMgXM9ns2G/P+h0HMepnBcFv9YUu16/+K1Op1M9zdSBer3OWXB8E216Esfj8bDfB0Ew96aj4bDlujImOm9P8OtA7K+jHsPoue7Fb+7P0u3KedtccN/32+22q0C3253NZjvWTsgUbcql4+Gw3WyC5dKbTge9XqfVjnZ4KpeNzwFKuaR3tDTlev3nfcn4q2nbyb+PBHGf/l09HA5TPdp7K5yXdhkPBhL9n/iJITXapF10uvp43G63MqyYTSbRxk22XbMs44e2ZvrQajYvPoDVapX8vuQt3badtM8xDAK5iwz2zPtS/HgajcZ+v//mDxE3oE3qnE6nzXYTrFbj8XjQ6zuOU6tWy6b5acO4u7wV59PpxceTar6lWPp+2qe88Ly7PKWfUCgUXMdh9PR4tEmX/Xbr1Oqlsvnjw6KvNRuNiyuZbDabUuL1LYu3ngWPx033e3bfJHkaDAY/8eNFCrRJlyAMfmof3VTm8/nFxzMajZJ/k4JRnAyHNzzraCHNbvd+z+6bCvFJNI7sHos26SLvUn+xmIzHk4fwPE/qs5jPLw6ajoeDVa0mfw+b5fLNc8FltDWbzdxoC/SmhCDVYO0x5OF972eLdGgTrhqnGTQVf2hFFKnkdrtdh6EM5UbDoXzPWq1mWdE+nR8nyx9/1lzucdRl1fOHok24LFrfMs2gSdxpLni07/nxGKyC5Xw+HA6dZtNxnGq1+tspqrsG67+Fwvimw1XcjDbhsvlslvzMV+F8FvyRH2btD4cwDFfLpdSq3+s1Gg0ZW31eJuFnU1UoFkZ9Toc/FG16RcdD5Os/067Xi6VS8rf4KNNhRTS2klqtowt0vMnEdV3Htj9vBvP9VI3Y/vOxaNOTO54v7g2CYOp5o8Gw1W43ZYghR0SWJf/k2r+1Tjl1QAYsm83mkc/rr+LzVjK2kucuWZGxlW3b1fNMsRs6Ja/GxUnzuB/a9FTi63uD1WrhTbvdbtt1rVpN3o0XZw/J+2175WO1TqeT6q3barUe/ExvIC+OjBbl9RmPx+XrFzz/qVAoNJtNdrJ6MNqUV/JW2e/3281mvlhMJ5NJf+C4ri0lSrxBkwyd9peO7CRYqda3jHbHTD8XPFvzNLvFiCEnwh+ONuXG6XQKzmd/5Qil2247zaYcoVTMXyWKR0bJ520axeGVj/wHada3LJ7Pgr/lbUUUyXqqrYm/XngP90CbNJIMydHHfreLru8dT3rdbuN8ksj4uUvqZGS0u3QC5YapA3kcUwRprpKp1WosR/V4tCl78VnbYLWSA41oDbhWW94M1UqlEh9Y3eMSFsPoXzlDNJ9OU92jwrPgSQwGg+TPkYvpMkGbMjb1PBkTRccXD7yMrmSWNheXajq9NS0r1SNpuW7uThJHy3jW68mf44pd9rJAm7IkB27vVTLutfLJRe0rgybfm6b9VovF4sEv2velWpGqWq3+dS4Y7oE2ZUlGHJ7nuY1my7ajm+P8yM2Nbu6Fm3xxnLbrXps6IL+bvErRXHDLyt1Z8H/OB3SFQtJJTmybnhXahHfrMEx79f84h7tjHo/HVAd0ft6mRzwN2oR3/X4/VZhyOlU61QFdhQO67NAmRPb7faVSSdUmJ59Tpaeel/CATv5Qv93O+vG+Ltr0/E5nX/+ZVOtbRoziPJ9rraU4p2YYqwUHdJmhTU8o3pdFDl6kOIN+v9Fo1BuNxWz+z5VhzmG/Tzvf0rKsPC7vv9tuk59TK5crrMObIdqUb/EMcsnQYrGYT6edTsd1HAlHvI345yFAxTT3Vz6emw1HaWcwZLsiys2SH9AJ98pOongM2pQn8TID281mNpvJmKjTfp9BnuTkbqVSubZRrd1opgqTaZrXZiFoJq+ebdvJ2+RdX0MGD0CblIoXopUxURAE/nnl7Ha77ZxnkKdaJOCdYbRs++Kp69D3jZRTB2zHyeNZ8GinqcTPVAaeebwW55nQJi2kRPvdLjgvMzDs9eNFZq0/VsW+jbwng/mlCdxvb62qVUzVJsNYjCcPf3l+gNQ5+apyTj77+0xoUwbkP3oZFu3Op6sX02mv1+u0WrXqz28j/sG+sp/4er1OO9+yUq0ec3iGeDwep3qak0ku+/tMaNNDyQHasNeT/0+u12qVcvkH1zz5imHMr0zgTjvfspjPi/JlKJqq+1+sCIqHoU0PVa1WH71tr2HUKpXTpc/7D/t9NeV8y3Le3rQyMGy3WmlfMz6h04A2PdSo25VjooepVCpWrba4MklyOk256oBRtMrlY6bXcMRrfu/3+90lm80mOJvNZnIQJ4mREVDanQsKhQJbqmhAmx7tcIx3YHqQazMkozWMarWUb9tiySgFty5m9PaJ3Lv0RVIS74MiwvMt+lDS9yWa0a5z/X73rN/pxL9qtVrNZtOyLGlu/HmleP/LWTyr65un7aLlz4PgGz9h/Aza9KIWXrr1LT9IGhaLxcdQJdoffL2O1g6ezTzPm3jedDyeyi8mk2jnpX5fguI4TvPMPt9EvV6XYd3nmnz48x4Lj91knBV4laBNr0jGLc1KVUZBN7+Bo3HLWdyXz7/1RUceXJnbSE+z/vkgQpteUeAv7zdfIe9YgVcJ2vSKep3Ooz8uzAk5oMvjNcxPiTa9nO1maxrp5lu+jjzO3npWtOnlpNr+6NUsl8usfz54R5tey+FwSLtU04soFAqVCgs2KUKbXstiscg6AnrxCZ0qtOm1TCeTrAugVK1WY9sCVWjTa5nQpkssy2K1Jm1o02th3PTb5M9SqdTtdq+tCIoM0abX4r/A+aZrU88Nw6hWq3LsVotW7bMcxxmPxwyX1KJNryV3n9MVvvzb4nng83G5b1Qc1+20Iu12ezAYzGazpX+2XIZhGF/8HMv6R4G/oE0vJ+0KkPf2R33e/8H7MMeyolut1mw25eBrKAYD+TKZTKLuLJfr9Xq7iWy3W05mPxPa9HJOp5Nt249v0EdxYu/DHMdpt97Fwxw56oxuvi/DnP1+/zHMYfXuV0ObXtFut2s0GjfX5Vp0yuVyvKadRKder0sB5cCq3+8PevKlPxqNFouFDHN2MsbZbOQxcGCFL9CmFyVdGPR6Zqn0e2v+/XelUsn8fDbHtlu27bquDHMkN9PpdD6dymBHohMEgQxzPta0k9GZkpHObDplHcs8ok0vbROux4Nhy3Gq55FOdP642xv2+8PhcDwey4HVOlxv1uv3szn5PLBqNpuFYnFyZTcHqEWbENEzzPlZh/1ejjSlTTJCDLiON1doE57ZfDr7+BywUqkyxzJHaBOe1n63q3za5Kpw3tzp4nZYUIg24TkdD4eW4/w+V7NQ6HbaWT80JEKb8DziDaaOx6Pv+/V6/dpch/l0mvUjxd/RJqj2ebPM/a8NMuM97DzPm04m8nU0GnU6HTles88sy/rbDC0jZAc69WgTMhCPbuK97cIwjLbQDEMpzmQyed8ys9PpdbvtdjveLLNcLlfON/HbllO/H7R9naVfOm2O7LSjTbjd6XSKBzX7X7uAB0GwWCxm0Uaa0bTMeFDT6/WkMjKucYRtu79GN6ZpJivJz5N7Z1a6crQJX5H0hKtVsFrN5/N4n14JTU8GNZ1uu9VuNBrRDuDVakWYpgxqkmx7p2H7THmoLA2uHG3CVTKykPo85T52zUaDjcWVo024SgZNn+cHXZDPDTgLhYIcbGb96uIvaBO+stlsFvP5bDaLD+g6nU67/WtRE8dpNZvy1bWdZrNZq9Wq54O7csyMzlp/rPomSqXSxSO+QnyUd/1Ir/Cjh4HyrRzb4WSTfrQJPyD+3C0+Ib6NbbabMFr1LV74TazX6yAIfN+PTpR73iQ2Hk+HQ28sfx0Ph8NeryfRk9I1zuqNRrNel1v063o9/sDut8/p/lquwqc/I1/bjsMSdLlAm6DO22enk9xikr94flMYhqvVankmtQvPv1gsFtPzciifx3fRci6uG4/05Kv8mae8pPkp0SYAGtEmABrRJgAa0SZ8ZbfbnfdPWh4feP74sN/H+zZx0vqV0SZc9nY6DQf96q/N7GrVqjeZPOBEsud51q9JVXLvw+GQSZKviTbhAmlQz7aLpd+nI42Gw7ver5Toz0kAnU6HD9deEG3CBcvZrHjpcv+yaW7vtqztZr2+fDmeYSx9/053CrVoEy7oue7l61FKxmxwr6GTHM1dnjxpGL1W6053CrVoEy5wWq3LmTDNaeteKx/1B4PLd1os9tqdO90p1KJNuGDUbl8eNxnGfHKvq2TnciB5Zdw06NCml0ObcME2DEuXFn6rVe+4JNt+v7+47IFpmpvN5k53CrVoEy6beVOj+K9VUKRW/mJx1zv1ff9fi2EakSlbD7wk2oSrlr7fbbWr1aplWf1ebx2GD7jTMAx73a51vtOe21qyGe+rok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADSiTQA0ok0ANKJNADT6H6xYY8Vnx8fZAAAAAElFTkSuQmCC"
                    />
                  </div>
                ))}
              </div>

              {/* </Slider> */}
            </div>
          </div>
          <div className="w-full md:w-10/12 relative flex items-center ">
            <div
              className="w-full md:w-11/12 md:hover:cursor-zoom-in relative"
              // onTouchStart={handleTouchStart}
              // onTouchMove={handleTouchMove}
              // onTouchEnd={handleTouchEnd}
            >
              <div
                onClick={() => {
                  htmlOverflow();
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
                      className="rounded-lg myimage-product-zoom"
                      placeholder={"blur"}
                      // blurDataURL="/images/product_placeholder_square.png"
                      // blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAOAgMAAABrzWU4AAAADFBMVEX////q6ur29vb7+/shUFCZAAAAGklEQVQI12NgwAY2MDAwpTAwMIcA2QZYVQAAMIcBnpRVEyYAAAAASUVORK5CYII="
                      blurDataURL="data:image/png;base64,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"
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
                className={`img-zoom-result absolute   top-3 ml-4  z-10  ${
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

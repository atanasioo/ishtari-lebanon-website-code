// Slider.js
import Image from "next/legacy/image";
import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";

function ImageSlider(props) {
  const { images, autoplay, primary } = props;

  // console.log(images)
  const sliderRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 1000,
    centerMode: true,
    centerPadding: "-1"
    // autoplay: false, // We'll control this from the parent component
    // pauseOnHover: false,
  };

  useEffect(() => {
    const sliderElement = sliderRef.current;
    if (sliderElement) {
      if (isHovered) {
        // console.log(sliderElement.props.autoplay);

        sliderRef.current.slickPlay();
        // console.log(sliderElement)
      } else {
        sliderRef.current?.slickPause();
      }
    }
  }, [isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  // const onInit = (Swiper) => {
  //   sliderElement.current = Swiper;
  // };
  return (
    <div
      className={`slider-container ${isHovered ? "hovered" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      //  onInit={onInit}
    >
      <Slider {...settings} ref={sliderRef}>
        <div key={"2"}>
          <Image
            src={primary}
            alt={`Image`}
            width={"192"}
              height={"264"}
   
            style={{
              backgroundImage: `url(${"/images/product_placeholder.png"})`,
              height: "auto", // Set the desired height
              width: "100%", // Set the desired width
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center"
            }}
          />
        </div>
        {images.map((image, index) => (
          <div key={index}>
            <Image
              src={image.mobile_image}
              alt={`Image ${index + 1}`}
              width={"192"}
              height={"264"}
              className="bg-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default ImageSlider;

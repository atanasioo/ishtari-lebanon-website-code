// Slider.js
import React, { useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';

function ImageSlider(props){
  const {images,  autoplay , primary} = props

  // console.log(images)
  const sliderRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);


  const settings = {
    dots : true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 200,
    // autoplay: false, // We'll control this from the parent component
    // pauseOnHover: false,
  };
   
  useEffect(() => {
    const sliderElement = sliderRef.current;
    if (sliderElement) {
      if (isHovered) {
        console.log(sliderElement.props.autoplay )

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
    className={`slider-container ${isHovered ? 'hovered' : ''}`}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    //  onInit={onInit}
  >
    <Slider {...settings} ref={sliderRef}>
        <div key={"2"}>
          <img src={primary} alt={`Image`}   width={200}  height={300} />
        </div>
      {images.map((image, index) => (
        <div key={index}>
          <img src={image.thumb} alt={`Image ${index + 1}`}   width={200}  height={300} />
        </div>
      ))}
    </Slider>
    </div>

  );
};

export default ImageSlider;

import React, { useState, useEffect } from "react";

function AutoScroll() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const itemWidth = 200; // Adjust the width of each item in your slider
  const containerWidth = 1200; // Adjust the width of the slider container
  const scrollSpeed = 1; // Adjust the scroll speed (lower values make it slower)
  const scrollDelay = 50; // Adjust the delay between scrolls (in milliseconds)

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      setScrollPosition((prevPosition) => prevPosition - scrollSpeed);
    }, scrollDelay);

    return () => clearInterval(scrollInterval);
  }, []);

  useEffect(() => {
    if (scrollPosition <= -itemWidth) {
      setScrollPosition(1);
    }
  }, [scrollPosition]);

  return (
    <div
      className="slider-container"
      style={{
        width: `${containerWidth}px`,
        overflow: "hidden",
      }}
    >
      <div
        className="slider-content flex"
        style={{
          transform: `translateX(${scrollPosition}px)`,
          width: `${containerWidth}px`,
        }}
      >
        <div className="slider-item">Item 1</div>
        <div className="slider-item">Item 2</div>
        <div className="slider-item">Item 3</div>
        <div className="slider-item">Item 1</div>
        <div className="slider-item">Item 2</div>
        <div className="slider-item">Item 35</div>
        <div className="slider-item">Item 1</div>
        <div className="slider-item">Item 2</div>
        <div className="slider-item">Item 3w</div>
        <div className="slider-item">Item 1w</div>
        <div className="slider-item">Item 2w</div>
        <div className="slider-item">Item 3</div>
        <div className="slider-item">Item 1</div>
        <div className="slider-item">Item 2</div>
        <div className="slider-item">Item 33dddd3</div>
        <div className="slider-item">Item 1</div>
        <div className="slider-item">Item 2</div>
        <div className="slider-item">Item 3</div>
        {/* Add more items as needed */}

        <div className="slider-item">Item 1</div>
        <div className="slider-item">Item 2</div>
        <div className="slider-item">Item 3</div>
        <div className="slider-item">Item 1</div>
        <div className="slider-item">Item 2</div>
        <div className="slider-item">Item 35</div>
        <div className="slider-item">Item 1</div>
        <div className="slider-item">Item 2</div>
        <div className="slider-item">Item 3w</div>
        <div className="slider-item">Item 1w</div>
        <div className="slider-item">Item 2w</div>
        <div className="slider-item">Item 3</div>
        <div className="slider-item">Item 1</div>
        <div className="slider-item">Item 2</div>
        <div className="slider-item">Item 333</div>
        <div className="slider-item">Item 1</div>
        <div className="slider-item">Item 2</div>
        <div className="slider-item">Item 3dddddd</div>
      </div>
    </div>
  );
};

export default AutoScroll;

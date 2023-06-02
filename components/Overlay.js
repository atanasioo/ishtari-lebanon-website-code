import React from "react";

function HeaderOverlay(props) {
  const {local} = props;
  return (
    <div className="absolute z-20 w-full h-screen left-0 bg-dblackOverlay" style={{top: !local ? "137px" : "200px"}}></div>
  );
}

function FullOverlay() {
  return (
    <div className="fixed z-10 w-full h-screen left-0 bg-dblackOverlay "></div>
  );
}

export { HeaderOverlay, FullOverlay };

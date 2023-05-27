import React from "react";

function HeaderOverlay() {
  return (
    <div className="absolute z-10 w-full h-screen left-0 bg-dblackOverlay" style={{top: "137px"}}></div>
  );
}

function FullOverlay() {
  return (
    <div className="fixed z-10 w-full h-screen left-0 bg-dblackOverlay "></div>
  );
}

export { HeaderOverlay, FullOverlay };

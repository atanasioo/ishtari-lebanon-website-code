import React from "react";

function HeaderOverlay(props) {
  const {local} = props;
  return (
    <div className="absolute z-20 w-full h-screen left-0 bg-dblackOverlay" style={{top: !local ? "137px" : "200px"}}></div>
  );
}

function FullOverlay(props) {
  const [z, setZ] = props.z ? props.z : 10;
  return (
    <div className={`fixed z-${z} w-full h-screen left-0 bottom-0 top-0 bg-dblackOverlay `}></div>
  );
}

export { HeaderOverlay, FullOverlay };

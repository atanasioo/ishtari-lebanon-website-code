import Image from "next/image";
import React from "react";
import "../config"


export default function ImageClient(props) {
  return (
    // typeof window !== "undefined" && (
    //   <div></div>
    // )
      <Image
        alt={props.alt}
        src={
          `${
            window.config["site-url"] !== undefined && window.config["site-url"]
          }/image/` + props.src
        }
        width={props.width}
        height={props?.height}
      />
    
  );
}

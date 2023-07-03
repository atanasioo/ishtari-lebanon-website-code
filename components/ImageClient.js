import Image from "next/image";
import "../config";

export default function ImageClient(props) {
  return (
    typeof window !== "undefined" && (
      <Image
        alt={props.alt}
        src={
          `${
            window.config["site-url"] !== undefined && window.config["site-url"]
          }/image/` + props.src
        }
        width={props.width}
        height={props?.height}
        placeholder={"blur"}
        blurDataURL="/images/placeholder_slideshow.png"
      />
    )
  );
}

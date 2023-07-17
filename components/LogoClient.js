import Image from "next/image";
import React from "react";
import ImageFilter from "react-image-filter/lib/ImageFilter";

function LogoClient(props) {
  return (
    <div>
      {props.host === "https://www.flo-lebanon.com" ? (
        <Image
          src={LogofloOrange}
          width={width > 768 ? 130 : 100}
          height={width > 768 ? 130 : 100}
          alt="ishtari-logo"
          priority={true}
          style={{ width: "80%", height: "auto" }}
        />
      ) : props.host === "https://www.ishtari.com" ||
        props.host === "https://www.ishtari.com.gh" ||
        props.host === "ishtari" ||
        props.host === "ishtari-ghana" ||
        props.host === "next.ishtari.com"
         ? (
        <>
          <Image
            className="hidden mobile:block"
            src="/images/logo/logo-red.png"
            width={130}
            height={130}
            alt="ishtari-logo"
            priority={true}
            style={{ width: "80%", height: "auto" }}
          />

          <ImageFilter
            className="h-5 w-24 mr-5 mobile:hidden"
            image={"/images/logo/logo-white.png"}
            filter={"duotone"} // see docs beneath
            colorOne={[96, 96, 96]}
            colorTwo={[65, 69, 81]}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default LogoClient;

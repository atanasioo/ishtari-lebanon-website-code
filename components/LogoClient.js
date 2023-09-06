import Image from "next/image";
import React from "react";
import ImageFilter from "react-image-filter/lib/ImageFilter";
function LogoClient(props) {

  return (
    <div>
      {props.host === "https://www.flo-lebanon.com" ? (
        <img
          src={"/images/logo-flo-orange.png"}
          width={150}
          height={32}
          alt="ishtari-logo"
          // priority={true}
          // style={{ width: "70%", height: "auto" }}
        />
      ) : props.host === "https://www.ishtari.com" ||
        props.host === "https://www.ishtari.com.gh" ||
        props.host === "ishtari" ||
        props.host === "ishtari-ghana" ||
        props.host === "next.ishtari.com" ||
        props.host === "ishtari-mobile.com"
         ? (
        <>
          <img
            className="hidden mobile:block"
            src="/images/logo/logo-redd.png"
            width={150}
            height={32}
            alt="ishtari-logo"
            // priority={true}
            // style={{ width: "80%", height: "auto" }}
          />

          {/* <ImageFilter
            className="h-5 w-24 mr-5 mobile:hidden"
            image={"/images/logo/logo-white.png"}
            filter={"duotone"} // see docs beneath
            colorOne={[96, 96, 96]}
            colorTwo={[65, 69, 81]}
          /> */}
          <img
            className="mobile:hidden"
            src="/images/logo/logo-dblack2.png"
            width={150}
            height={32}
            alt="ishtari-logo"
            // priority={true}
            // style={{ width: "78%", height: "auto" }}
          />
        </>
      ) : (
        <>
          <img
            className="hidden mobile:block"
            src="/images/logo/logo-redd.png"
            width={150}
            height={32}
            alt="ishtari-logo"
            // priority={true}
            // style={{ width: "80%", height: "auto" }}
          />
          <img
            className="mobile:hidden"
            src="/images/logo/logo-dblack2.png"
            width={150}
            height={32}
            alt="ishtari-logo"
            // priority={true}
            // style={{ width: "78%", height: "auto" }}
          />
        </>
      )}
    </div>
  );
}

export default LogoClient;

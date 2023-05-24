import React, { useEffect, useState } from "react";
import useDeviceSize from "@/components/useDeviceSize";
import Cookies from "js-cookie";


function SiteHeaders(props) {
  const [width, height] = useDeviceSize();
  const { local } = props;

  return (
    <div className="relative">
      <div className={` w-full ${width < 650 && local ? "h-32 p-5" : "h-16"}`}>
        <button
          className="bg-dblue text-white font-bold text-xs md:text-d16 p-2 m-2"
          onClick={() => Cookies.set("site-local-name", "ishtari")}
        >
          ishtari
        </button>

        <button
          className="bg-dblue text-white font-bold text-xs md:text-d16 p-2 m-2"
          onClick={() => Cookies.set("site-local-name", "ishtari-usd")}
        >
          ishtari-usd
        </button>
        <button
          className="bg-dblue text-white font-bold text-xs md:text-d16 p-2 m-2"
          onClick={() =>
            Cookies.set("site-local-name", "ishtari-ghana")
          }
        >
          ishtari ghana
        </button>
        <button
          className="bg-dblue text-white font-bold text-xs md:text-d16 p-2 m-2"
          onClick={() => Cookies.set("site-local-name", "flo")}
        >
          flo-lebanon
        </button>
        <button
          className="bg-dblue text-white font-bold text-xs md:text-d16 p-2 m-2"
          onClick={() => Cookies.set("site-local-name", "flo-bey")}
        >
          flo-beirut
        </button>

        <button
          className="bg-dblue text-white font-bold text-xs md:text-d16 p-2 m-2"
          onClick={() => Cookies.set("site-local-name", "aalbeit")}
        >
          aalbeit
        </button>

        <button
          className="bg-dblue text-white font-bold text-xs md:text-d16 p-2 m-2"
          onClick={() => Cookies.set("site-local-name", "energy-plus")}
        >
          Energy+
        </button>
      </div>
    </div>
  );
}

export default SiteHeaders;

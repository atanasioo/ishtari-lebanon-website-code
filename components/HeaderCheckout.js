import React from "react";
import { useState } from "react";

import { axiosServer } from "@/axiosServer";
import buildLink from "../urls";


export default function HeaderNew(props) {
  const [show, setShow] = useState(false);
  const [currency, setCurrency] = useState(false);

  function changeCurrency(currency) {
   // console.log(currency);
    // localStorage.setItem("currency", "USD")
    var obj = {
      currency: currency,
    };
    axiosServer
      .post(buildLink("currency", undefined, undefined), obj)
      .then((response) => {
        const data = response.data;
        // alert(data.success)
        if (data.success === true) {
          // window.location.reload();
        }
      });
    // localStorage.setItem("currency", currency);
    setCurrency(currency);
    setShow(false);
  }
  return (
    <div className="container align-middle w-full h-10  pt-2 cart-header">
      {/* <!-- This example requires Tailwind CSS v2.0+ --> */}
      <div className="relative inline-block text-left">
        <div className="flex">
          <button
            type="button"
            className="flex ml-2 text-dblack font-light  hover:text-dgrey1"
            onClick={() => setShow(show ? false : true)}
          >
            <span>
              {props.currency === "USD" ? "$" : "LBP"}
            </span>{" "}
            <span className="pl-2"> Currency</span>
            <svg
              className="mr-1 ml-2 h-5 w-5 mt-1 "
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div
          className={`${
            show
              ? "origin-top-left left-0 mt-3 w-38 shadow-lg bg-white rounded focus:outline-none z-50 "
              : "hidden"
          }`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabindex="-5"
          style={{ boxShadow: "0px 30px 50px 30px rgb(82 63 105 / 15%)" }}
        >
          <div className="font-light" role="none">
            <a
              href
              className={`cursor-pointer ${
                props.subtotal > 50 || props.subtotal < 15
                  ? "flex px-4 py-1  text-sm  z-50 hover:bg-dgrey hover:font-light cursor-not-allowed pointer-events-auto focus:cursor-not-allowed"
                  : `flex px-4 py-1 text-sm z-50  hover:font-light`
              } `}
              role="menuitem"
              tabindex="-1"
              id="menu-item-0"
              onClick={() => changeCurrency("USD")}
              style={{
                background:
                  props.currency === "USD" ? "rgba(126, 133, 155,0.1)" : "",
              }}
            >
              {" "}
              <div className="w-8 text-d18 text-center ">$</div>{" "}
              <span className="text-d18 ml-2"> USD Dollar</span>
            </a>
            <a
              href
              className={` cursor-pointer ${
                props.subtotal > 50 || props.subtotal < 15
                  ? "flex px-4 py-1 text-sm  z-50 hover:bg-dgrey hover:font-light cursor-not-allowed pointer-events-auto focus:cursor-not-allowed"
                  : `flex px-4 py-1 text-sm z-50  hover:font-light`
              } `}
              role="menuitem"
              tabindex="-1"
              id="menu-item-1"
              onClick={() => changeCurrency("LBP")}
              style={{
                background:
                  props.currency === "LBP" ? "rgba(126, 133, 155,0.1)" : "",
              }}
            >
              {" "}
              <span className="w-8 text-d18 text-center">L.L.</span>{" "}
              <span className="text-d18 ml-2"> Lebanese Lira</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

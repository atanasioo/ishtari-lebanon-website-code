import React from "react";
import { AiOutlineTwitter } from "react-icons/ai";
import { FaLinkedinIn, FaFacebookF, FaInstagram } from "react-icons/fa";
import mastercard from "/public/images/mastercard.svg";
import visa from "/public/images/visa.svg";
import cash from "/public/images/cash.svg";
import amex from "/public/images/amex.svg";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
export default function FooterPart2(props) {
  // const info = props
  return (
    <div className="text-dblack  ">
      <div className="mt-4 ">
        <div className="flex flex-col md:flex-row items-center py-10 mx-20 justify-around">
          <div className=" text-center">
            <div className="text-d14 pr-semibold mb-2">SHOP ON THE GO</div>
            <div className="flex space-x-3 ">
              <a href={window.config["appleStore"]}>
                <p className="appleStore rounded px-10"></p>
              </a>
              <a href={window.config["googlePlay"]}>
                <p className="googlePlay rounded"></p>
              </a>
            </div>
          </div>
          <div className="flex-row mt-2 mobile:mt-0 ">
            <div className="text-d14 pr-semibold mb-2 text-center ">
              CONNECT WITH US
            </div>
            <div className="text-center flex justify-between">
              <div className="facebook-border">
                <a href={window.config["facebook"]}>
                  <FaFacebookF
                    className={`flex facebook-desktop rounded-full p-2 text-white w-7 h-7 mobile:w-10 mobile:h-10 ${
                      Cookies.get("site-local-name") === "flo" ||
                      window.location.host === "www.flo-lebanon.com"
                        ? "bg-Orangeflo"
                        : Cookies.get("site-local-name") === "aalbeit" ||
                          window.location.host === "www.aalbeit.com"
                        ? "bg-greenaalbeit"
                        : "bg-dbase"
                    }`}
                  />
                </a>
              </div>

              <div className="facebook-border border-dinputBorder">
                <a href={window.config["twitter"]} >
                  <AiOutlineTwitter
                    className={`flex facebook-desktop rounded-full p-2 text-white w-7 h-7 mobile:w-10 mobile:h-10 ${
                      Cookies.get("site-local-name") === "flo" ||
                      window.location.host === "www.flo-lebanon.com"
                        ? "bg-Orangeflo"
                        : Cookies.get("site-local-name") === "aalbeit" ||
                          window.location.host === "www.aalbeit.com"
                        ? "bg-greenaalbeit"
                        : "bg-dbase"
                    }`}
                  />
                </a>
              </div>

              <div className="facebook-border">
                <a href={window.config["instagram"]}>
                  <FaInstagram
                    className={`flex facebook-desktop rounded-full p-2 text-white w-7 h-7 mobile:w-10 mobile:h-10 ${
                      Cookies.get("site-local-name") === "flo" ||
                      window.location.host === "www.flo-lebanon.com"
                        ? "bg-Orangeflo"
                        : Cookies.get("site-local-name") === "aalbeit" ||
                          window.location.host === "www.aalbeit.com"
                        ? "bg-greenaalbeit"
                        : "bg-dbase"
                    }`}
                  />
                </a>
              </div>

              <div className="facebook-border">
                <a href={window.config["linkedin"]}>
                  <FaLinkedinIn
                    className={`flex facebook-desktop rounded-full p-2 text-white w-7 h-7 mobile:w-10 mobile:h-10 ${
                      Cookies.get("site-local-name") === "flo" ||
                      window.location.host === "www.flo-lebanon.com"
                        ? "bg-Orangeflo"
                        : Cookies.get("site-local-name") === "aalbeit" ||
                          window.location.host === "www.aalbeit.com"
                        ? "bg-greenaalbeit"
                        : "bg-dbase"
                    }`}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`flex flex-col md:flex-row items-center justify-between py-7  bg-dsearchGrey  w-full px-7 md:pb-16`}
        >
          <div
            className="text-center font-extralight text-sm "
            style={{ color: "rgb(126, 133, 155)" }}
          >
            <span dangerouslySetInnerHTML={{ __html: "&copy" }}></span>{" "}
            {new Date().getFullYear()} {window.config["short-name"]}. All Rights
            Reserved
          </div>
          <div className="flex my-4 mobile:my-0 ">
            {window.config["showVisaCard"] && (
              <div className={` flex  `}>
                <ul className="flex px-6 flex-wrap justify-center items-center">
                  {" "}
                  <li className="flex rounded-sm items-center justify-center text-center mx-1.5 ">
                    <Image className={`h-5 w-11`} src={mastercard} alt="mastercard_payment" />
                  </li>
                  <li className="flex rounded-sm items-center justify-center text-center mx-1.5 ">
                    {" "}
                    <Image className={`h-5 w-11`} src={visa} alt="visa_payment"/>
                  </li>
                  <li className="flex rounded-sm items-center justify-center text-center mx-1.5 ">
                    {" "}
                    <Image className={`h-4 w-11`} src={cash} alt="cash_payment"/>
                  </li>
                  <li className="flex rounded-sm items-center justify-center text-center mx-1.5 ">
                    {" "}
                    <Image className={`h-5 w-11`} src={amex} alt="american_express_payment"/>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="flex flex-wrap text-center justify-center mobile:justify-start text space-x-4 text-d12 font-thin opacity-70">
            {props?.info?.map((i) => {
              return (
                i.status === "1" && (
                  <Link
                    key={i.id}
                    className="text-d14"
                    href={`/information/${i.id}`}
                    style={{ color: "#404553" }}
                  >
                    {i.title}
                  </Link>
                )
              );
            })}
            <Link
              className="text-d14 "
              href={`/contact`}
              style={{ color: "#404553" }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

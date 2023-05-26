import React from "react";
import { AiOutlineTwitter } from "react-icons/ai";
import { FaLinkedinIn, FaFacebookF, FaInstagram } from "react-icons/fa";
import mastercard from "/public/images/mastercard.svg";
import visa from "/public/images/visa.svg";
import cash from "/public/images/cash.svg";
import amex from "/public/images/amex.svg";
import Image from "next/image";
import Link from "next/link";
export default function FooterPart2(props) {
  // const info = props
  console.log(props);
  return (
    <div className="text-dblack  ">
      <div className="mt-4 ">
        <div className="flex items-center py-10 mx-20 justify-around">
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
          <div className="flex-row ">
            <div className="text-d14 pr-semibold mb-2 text-center ">
              CONNECT WITH US
            </div>
            <div className="text-center flex space-x-2">
              <a href={window.config["facebook"]}>
                <i
                  className={`flex facebook-desktop rounded-full p-2 ${
                    localStorage.getItem("site-local-name") === "flo" ||
                    window.location.host === "www.flo-lebanon.com"
                      ? "bg-Orangeflo"
                      : localStorage.getItem("site-local-name") === "aalbeit" ||
                        window.location.host === "www.aalbeit.com"
                      ? "bg-greenaalbeit"
                      : "bg-dbase"
                  }`}
                >
                  <FaFacebookF className="text-white w-6 h-6" />
                </i>
              </a>
              <a href={window.config["twitter"]}>
                {" "}
                <i
                  className={`flex facebook-desktop rounded-full p-2 ${
                    localStorage.getItem("site-local-name") === "flo" ||
                    window.location.host === "www.flo-lebanon.com"
                      ? "bg-Orangeflo"
                      : localStorage.getItem("site-local-name") === "aalbeit" ||
                        window.location.host === "www.aalbeit.com"
                      ? "bg-greenaalbeit"
                      : "bg-dbase"
                  }`}
                >
                  <AiOutlineTwitter className="text-white w-6 h-6" />
                </i>
              </a>
              <a href={window.config["instagram"]}>
                <i
                  className={`flex facebook-desktop rounded-full p-2  ${
                    localStorage.getItem("site-local-name") === "flo" ||
                    window.location.host === "www.flo-lebanon.com"
                      ? "bg-Orangeflo"
                      : localStorage.getItem("site-local-name") === "aalbeit" ||
                        window.location.host === "www.aalbeit.com"
                      ? "bg-greenaalbeit"
                      : "bg-dbase"
                  }`}
                >
                  <FaInstagram className="text-white w-6 h-6" />
                </i>
              </a>
              <a href={window.config["linkedin"]}>
                {" "}
                <i
                  className={`flex facebook-desktop rounded-full p-2  ${
                    localStorage.getItem("site-local-name") === "flo" ||
                    window.location.host === "www.flo-lebanon.com"
                      ? "bg-Orangeflo"
                      : localStorage.getItem("site-local-name") === "aalbeit" ||
                        window.location.host === "www.aalbeit.com"
                      ? "bg-greenaalbeit"
                      : "bg-dbase"
                  }`}
                >
                  <FaLinkedinIn className="text-white w-6 h-6 " />
                </i>
              </a>
            </div>
          </div>
        </div>

        <div
          className={`flex items-center justify-between py-7  bg-dsearchGrey  w-full px-7 pb-16`}
        >
          <div
            className="text-center font-extralight text-sm "
            style={{ color: "rgb(126, 133, 155)" }}
          >
            <span dangerouslySetInnerHTML={{ __html: "&copy" }}></span>{" "}
            {new Date().getFullYear()} {window.config["short-name"]}. All Rights
            Reserved
          </div>
          <div className="flex ">
            {window.config["showVisaCard"] && (
              <div className={` flex  `}>
                <ul className="flex px-6 flex-wrap justify-center items-center">
                  {" "}
                  <li className="flex rounded-sm items-center justify-center text-center mx-1.5 ">
                    <Image className={`h-5 w-11`} src={mastercard} />
                  </li>
                  <li className="flex rounded-sm items-center justify-center text-center mx-1.5 ">
                    {" "}
                    <Image className={`h-5 w-11`} src={visa} />
                  </li>
                  <li className="flex rounded-sm items-center justify-center text-center mx-1.5 ">
                    {" "}
                    <Image className={`h-4 w-11`} src={cash} />
                  </li>
                  <li className="flex rounded-sm items-center justify-center text-center mx-1.5 ">
                    {" "}
                    <Image className={`h-5 w-11`} src={amex} />
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="flex text-center text space-x-4 text-d12 font-thin opacity-70">
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

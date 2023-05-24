import React from "react";
import { BsHeadphones, BsWhatsapp } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { FaWhatsapp } from "react-icons/fa";
export default function FooterPart1() {
  return (
    <div>
   

      <div
        className=" flex bg-white  bg-opacity-5  px-5"
        style={{ border: "0px solid #ccc" }}
      >
        <div className="w-4/12 mb- ">
          <h1 className="font-semibold text-sm  md:text-xl">
            We’re Always Here To Help
          </h1>
          <p className=" font-light text-xs ">
            Reach out to us through any of these support channels
          </p>
        </div>
        <div className="w-8/12  grid grid-cols-3 ">
          <div className="flex  mx-24 md:mx-0 mb-3  border-b md:border-0 border-dinputBorder border-opacity-20  items-center">
            <BsHeadphones className="  w-8 h-8 rounded-full text-center border border-dinputBorder bg-white mr-4 leading-9 p-1" />
            <div className="flex flex-col items-center justify-center">
              <span className="text-sm">Phone Support</span>
              <span className="text-xl">
                {window != undefined && window.config["supportNumber"]}
              </span>
            </div>
          </div>

          <div className="flex mx-24 md:mx-0 mb-3 border-b md:border-0 border-dinputBorder border-opacity-20 items-center">
            <a
              href={`mailto:${window.config["send_email"]}`}
              className="flex items-center justify-center"
            >
              <AiOutlineMail className="  w-8 h-8 rounded-full text-center border border-dinputBorder bg-white mr-4 leading-9 p-1" />

              <div className="flex flex-col items-center justify-center">
                <span className="text-sm">Email Support</span>
                <span className="text-xl">Send Mail</span>
              </div>
            </a>
          </div>

          <div className="flex   items-center">
            <a
              href={`https://api.whatsapp.com/send?phone=${window.config["countryCode"]}${window.config["supportNumber"]}&text=Hi%20there%20i%27m%20interested%20in%20${window.config["site-url"]}`}
            >
              <div className="flex items-center justify-center">
                <FaWhatsapp className=" w-8 h-8 rounded-full text-center border border-dinputBorder bg-white mr-4 leading-9 p-1" />

                <span className="text-xl">Whatsapp Us</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

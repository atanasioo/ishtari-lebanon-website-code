import React from "react";
import { BsHeadphones, BsWhatsapp } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { FaWhatsapp } from "react-icons/fa";
export default function FooterPart1() {
  return (
    <div className="container">
   

      <div
        className=" flex flex-col md:flex-row  py-4 pt-4 px-5"
        style={{ border: "0px solid #ccc" }}
      >
        <div className="w-full md:w-4/12 flex flex-col justify-center items-center mb-4 mobile:mb-0 ">
          <p className="font-semibold text-sm  md:text-xl">
            We’re Always Here To Help
          </p>
          <p className=" font-light text-xs ">
            Reach out to us through any of these support channels
          </p>
        </div>
        <div className="w-full md:w-8/12  grid  grid-col-1 md:grid-cols-3 items-center justify-center ">
          <div className="flex  justify-start md:justify-center md:mx-0 mb-3  border-b md:border-0 border-dinputBorder border-opacity-20  items-center">
            <BsHeadphones className="  w-8 h-8 rounded-full text-center border border-dinputBorder bg-white mr-4 leading-9 p-1" />
            <div className="flex flex-col items-center justify-center">
              <span className="text-sm">Phone Support</span>
              <span className="text-xl">
                {window != undefined && window.config["supportNumber"]}
              </span>
            </div>
          </div>

          <div className="flex justify-start md:justify-center md:mx-0 mb-3 border-b md:border-0 border-dinputBorder border-opacity-20 items-center">
            <a
              href={`mailto:${window.config["send_email"]}`}
              className="flex items-center justify-center"
            >
              <AiOutlineMail className="w-8 h-8 rounded-full text-center border border-dinputBorder bg-white mr-4 leading-9 p-1" />

              <div className="flex flex-col items-center justify-center">
                <span className="text-sm">Email Support</span>
                <span className="text-xl">Send Mail</span>
              </div>
            </a>
          </div>

          <div className="flex justify-start md:justify-center items-center">
            <a
              href={`https://api.whatsapp.com/send?phone=${window.config["countryCode"]}${window.config["supportNumber"]}&text=Hi%20there%20i%27m%20interested%20in%20${window.config["site-url"]}`}
            >
              <div className="flex items-center justify-center">
                <FaWhatsapp className="w-6 h-6 md:w-8 md:h-8 rounded-full text-center border border-dinputBorder bg-white mr-4 leading-9 " />

                <span className="text-xl">Whatsapp Us</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

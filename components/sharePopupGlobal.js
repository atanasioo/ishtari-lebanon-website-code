import React, { useEffect, useState } from "react";
import { AiFillTwitterCircle } from "react-icons/ai";
import { MdIosShare, MdOutlineClose } from "react-icons/md";
import {
  BsFacebook,
  BsFillShareFill,
  BsInstagram,
  BsPinterest,
} from "react-icons/bs";
import { BiLink } from "react-icons/bi";
import { HiOutlineMail } from "react-icons/hi";
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  PinterestShareButton,
} from "react-share";
import { IoLogoWhatsapp } from "react-icons/io";
import { FullOverlay } from "./Overlay";
import useDeviceSize from "./useDeviceSize";
import { FaXing } from "react-icons/fa";

function SharePopupGlobal(props) {
  const {  share, name, wrapperRef , close,textToShare } = props;
  const [copied, setCopied] = useState(false);
  const [width] = useDeviceSize();

  function copyLink() {
    const el = document.createElement("input");
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }



  useEffect(()=>{
    console.log("________________________")
    console.log(textToShare)
  })


  return (
    <div>
      <div className=" text-dgreyBlack hidden mobile:block">
        {" "}
      
        {share && width>650 &&(
          <div
            className="shareList z-10 w-40 visible  bottom-7 right-20 inline-block absolute p-2 "
            ref={wrapperRef}
          >
            <div
              className="overflow-hidden border border-dinputBorder h-full w-full rounded bg-white "
              style={{ boxShadow: "0 2px 4px rgb(0 0 0 / 13%)" }}
            >
              <div className="h-auto overflow-y-hidden bg-dplaceHolder text-left overflow-x-hidden">
                {/* header */}
                <div className="text-left bg-white">
                  <div className="border-b border-dplaceHolder cursor-pointer hover:text-dblue">
                    <a
               href={`https://api.whatsapp.com/send?text=${textToShare}`}
                      className="pl-1 flex items-center"
                    >
                      <IoLogoWhatsapp className="w-5 h-5 mr-4 text-dwhatsapp" />
                      <span className="leading-9">Whatsapp</span>
                    </a>
                    {/* </WhatsappShareButton> */}
                  </div>
                  <div className="border-b border-dplaceHolder cursor-pointer hover:text-dblue">
                    <EmailShareButton
                      subject={name}
                      body={name}
                      url={textToShare}
                    >
                      <div className="pl-1 flex items-center">
                        <HiOutlineMail className="w-5 h-5 mr-4 " />
                        <span className="leading-9">Email</span>
                      </div>
                    </EmailShareButton>
                  </div>
                  <div className="border-b border-dplaceHolder cursor-pointer hover:text-dblue">
                    <FacebookShareButton
                      url={textToShare}
                      quote={name}
                    >
                      <div className="pl-1 flex items-center">
                        <BsFacebook className="w-5 h-5 mr-4 text-dfacebook" />
                        <span className="leading-9"> Facebook</span>
                      </div>
                    </FacebookShareButton>
                  </div>
                  <div className="border-b border-dplaceHolder cursor-pointer hover:text-dblue">
                    <TwitterShareButton url={textToShare} title={name}>
                      <div className="pl-1 flex items-center">
                        <AiFillTwitterCircle className="w-5 h-5 mr-4 text-dtwitter" />
                        <span className="leading-9">Twitter</span>
                      </div>
                    </TwitterShareButton>
                  </div>
                  <div
                    className="cursor-pointer hover:text-dblue"
                    onClick={() => copyLink()}
                  >
                    <div className="pl-1 flex items-center">
                      <BiLink className="w-5 h-5 mr-4" />
                      <span className="leading-9">
                        {!copied ? "Copy link" : "Copied!"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {share && width<650&& <div className=" mobile:hidden">
     
          <div className={`fixed bottom-0  transition-all top-auto  right-0  left-0 z-50 `}>
            <div
              className=" cursor-pointer h-80 absolute right-0 bottom-0 left-0  "
              style={{ maxHeight: "507px" }}
            >
              
              <div className="h-full overflow-y-auto bg-white overflow-x-hidden rounded-xl">
                <div className="block h-full overflow-y-scroll rounded-xl bg-white">
                  <div className="rounded-xl flex flex-col justify-start text-left relative">
                    <div className=" pb-3 flex flex-row justify-between border-b border-dlabelColor  text-dDarkgrey w-full text-md leading-5 font-semibold mt-3">
                      <span className=" w-fit mx-auto">Share your cart with friends</span>
                   {/* <button onClick={close}> clos</button> */}
                    </div>
                    <span className="cursor-pointer ">
                      <div>
                        <div className="h-12  ">
                          {/* <WhatsappShareButton url={textToShare}> */}
                          <a
                            href={`https://api.whatsapp.com/send?text=${textToShare}`}
                            className="pl-6   text-dblack text-lg leading-10 h-12 flex items-center"
                          >
                            <IoLogoWhatsapp className="w-5 h-5 mr-4 text-dwhatsapp" />
                            <span className="leading-9">Whatsapp</span>
                          </a>
                          {/* </WhatsappShareButton> */}
                        </div>
                      </div>
                    </span>
                    <span className="cursor-pointer">
                      <div>
                        <div className="h-12  ">
                          <EmailShareButton
                            url={textToShare}
                            subject={name}
                            body={name}
                          >
                            <div className="pl-6 text-dblack text-lg leading-10 h-12 flex items-center">
                              <HiOutlineMail className="w-5 h-5 mr-4 " />
                              <span className="leading-9">Email</span>
                            </div>
                          </EmailShareButton>
                        </div>
                      </div>
                    </span>
                    <span className="cursor-pointer">
                      <div>
                        <div className="h-12 w-full ">
                          <FacebookShareButton
                            url={textToShare}
                            quote={name}
                          >
                            <div className="pl-6 text-dblack text-lg leading-10 h-12 flex items-center">
                              <BsFacebook className="w-5 h-5 mr-4 text-dfacebook" />
                              <span className="leading-9">Facebook</span>
                            </div>
                          </FacebookShareButton>
                        </div>
                      </div>
                    </span>
                    <span className="cursor-pointer">
                      <div>
                        <div className="h-12 w-full ">
                          <TwitterShareButton
                            url={textToShare}
                            title={name}
                          >
                            <div className="pl-6 text-dblack text-lg leading-10 h-12 flex items-center">
                              <AiFillTwitterCircle className="w-5 h-5 mr-4 text-dtwitter" />
                              <span className="leading-9">Twitter</span>
                            </div>
                          </TwitterShareButton>
                        </div>
                      </div>
                    </span>
                    <span
                      className="cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(textToShare);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 3000);
                      }}
                    >
                      <div>
                        <div className="h-12  ">
                          <div className="pl-6 text-dblack text-lg leading-10 h-12 flex items-center">
                            <BiLink className="w-5 h-5 mr-4" />
                            <span className="leading-9">
                              {!copied ? "Copy link" : "Copied!"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
      }
        
        {share && width<650 && (
          <div
            onClick={() => {
              close()
            }}
          >
            <FullOverlay />
          </div>
        )}
      </div>
  );
}

export default SharePopupGlobal;

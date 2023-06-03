import React, { useState } from "react";
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
import { FullOverlay } from "../Overlay";

function ShareSocial(props) {
  const { image, share, name, wrapperRef } = props;
  const [copied, setCopied] = useState(false);
  const [mobileShare, setMobileShare] = useState(false);
  const [overlay, setOverlay] = useState(false);

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

  function toggleMobileShare() {
    setMobileShare(!mobileShare);
    setOverlay(!overlay);
  }

  return (
    <div>
      <div className="share-desktop hidden mobile:block">
        {" "}
        <div
          className={`absolute w-9 h-9 z-30 cursor-pointer rounded-full flex justify-center items-center top-0 right-0 border border-dgreyZoom`}
        >
          <MdIosShare className="w-6 h-6 block mb-1 " />
        </div>{" "}
        {share && (
          <div
            className="shareList z-10 w-40 visible top-8 right-0 inline-block absolute p-2 "
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
                      href={`https://api.whatsapp.com/send?text=${window.location.href}`}
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
                      url={window.location.href}
                    >
                      <div className="pl-1 flex items-center">
                        <HiOutlineMail className="w-5 h-5 mr-4 " />
                        <span className="leading-9">Email</span>
                      </div>
                    </EmailShareButton>
                  </div>
                  <div className="border-b border-dplaceHolder cursor-pointer hover:text-dblue">
                    <FacebookShareButton
                      url={window.location.href}
                      quote={name}
                    >
                      <div className="pl-1 flex items-center">
                        <BsFacebook className="w-5 h-5 mr-4 text-dfacebook" />
                        <span className="leading-9"> Facebook</span>
                      </div>
                    </FacebookShareButton>
                  </div>
                  <div className="border-b border-dplaceHolder cursor-pointer hover:text-dblue">
                    <TwitterShareButton url={window.location.href} title={name}>
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
      <div className="share-mobile mobile:hidden">
        <div
          className={`absolute w-9 h-9 z-30 cursor-pointer ${
            mobileShare ? "bg-transparent" : "bg-dTransparentWhite"
          }  rounded-full flex justify-center items-center top-2 right-2`}
          onClick={() => {
            toggleMobileShare();
          }}
        >
          <MdIosShare className="w-6 h-6 block mb-1 " />
        </div>
        {mobileShare && (
          <div className="fixed top-auto bottom-0 right-0  left-0 z-30 ">
            <div
              className=" cursor-pointer h-80 absolute right-0 bottom-0 left-0  "
              style={{ maxHeight: "507px" }}
            >
              <div
                className="absolute w-12 h-12 z-20 top-6 mt-1 -right-2"
                onClick={() => toggleMobileShare()}
              >
                <MdOutlineClose className="w-6 h-6 block " />
              </div>
              <div className="h-full overflow-y-auto bg-white overflow-x-hidden rounded-xl">
                <div className="block h-full overflow-y-scroll rounded-xl bg-white">
                  <div className="rounded-xl relative">
                    <div className="h-12 pt-5 pb-1 pl-5 text-dDarkgrey w-full text-md leading-5 font-semibold mt-3">
                      <span>Share this product with friends</span>
                    </div>
                    <span className="cursor-pointer ">
                      <div>
                        <div className="h-12 w-full ">
                          {/* <WhatsappShareButton url={window.location.href}> */}
                          <a
                            href={`https://api.whatsapp.com/send?text=${window.location.href}`}
                            className="pl-6 text-dblack text-lg leading-10 h-12 flex items-center"
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
                        <div className="h-12 w-full ">
                          <EmailShareButton
                            url={window.location.href}
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
                            url={window.location.href}
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
                            url={window.location.href}
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
                        navigator.clipboard.writeText(window.location.href);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 3000);
                      }}
                    >
                      <div>
                        <div className="h-12 w-full ">
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
        )}
        {overlay && (
          <div
            onClick={() => {
              toggleMobileShare();
            }}
          >
            <FullOverlay />
          </div>
        )}
      </div>
    </div>
  );
}

export default ShareSocial;

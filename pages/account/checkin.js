import { axiosServer } from "@/axiosServer";
import UserSidebar from "@/components/account/UserSidebar";
import UserSidebarMobile from "@/components/account/UserSidebarMobile";
import useDeviceSize from "@/components/useDeviceSize";
import { AccountContext } from "@/contexts/AccountContext";
import buildLink from "@/urls";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BsInfoCircleFill } from "react-icons/bs";

import PointsLoader from "@/components/PointsLoader";
import Image from "next/image";
import SingleCoupon from "../../components/couponComponents/singleCoupon";
import { FaQuestionCircle, FaTicketAlt } from "react-icons/fa";
import { sanitizeHTML } from "@/components/Utils";
import { RiCoupon2Line } from "react-icons/ri";
function CheckIn() {
  const router = useRouter();
  const [data, setData] = useState();
  const [buttonActive, setButtonActive] = useState("1")
  const trigger = useRef(null);
  const [state, dispatch] = useContext(AccountContext);
  const [loading, setLoading] = useState(false);
  const [width, height] = useDeviceSize();
  const [modalOpen, setModalOpen] = useState(false);

  const modal = useRef(null);

 


  return (
    <div className="container text-dblack">
      <Head>
        <title>My Account | ishtari</title>
      </Head>
      <div className="pb-2">
        <div className="flex-row md:flex"> 
          <div className="w-full mb-3 md:w-1/5">
            {width > 650 ? (
              <UserSidebar active={"checkin"} />
            ) : (
              <UserSidebarMobile active={"checkin"} />
            )}
          </div>
          {loading ? (
            <div className="flex justify-center w-full">
              <PointsLoader />
            </div>
          ) : (
            <div className="flex relative justify-center overflow-hidden my-5  w-full">
          <div className="w-full md:w-4/5  md:px-0  mb-5 relative">
          <div>
       <div className="relative  justify-center  flex flex-col ">
           <div className=" flex my-8 justify-center text-center  flex-col w-fit mx-auto">
            <h1 className=" text-dblackk  text-3xl font-[900] ">MY POINTS</h1>
            <p className="  underline text-sm text-dlabelColor flex flex-row gap-2 justify-center"> Learn more about ishtari points <span className=" h-fit my-auto">{" "}<FaQuestionCircle className=" text-dbase text-sm"/></span> </p>

            </div>

            <div className=" w-full h-32 bg-dplaceHolder">


              <div className=" flex  flex-row justify-between px-24  py-7 ">
                <h2 className=" text-dlabelColor"> <span className=" text-dbase text-5xxl">0</span> Points</h2>
                     <div className=" flex flex-col "><span>|</span><span>|</span><span>|</span></div>
                <h2  className=" text-dlabelColor"> <span className="text-dbase text-5xxl">0</span> US Dollars</h2>


              </div>



            </div>
            
            <p className=" my-5 text-sm text-dlabelColor flex flex-row gap-2 justify-center"> Check in for 3 consecutive days o get a big surprise </p>

            <div className=" gap-10 justify-center w-full h-full flex flex-wrap py-5">
              <div className=" flex-col justify-center gap-5 ">

                <button className=" w-12 h-12 rounded-full bg-dplaceHolder relative  text-dblack "><p className=" my-auto  mx-auto">+1</p></button>
                <div className=" text-sm w-fit mx-auto text-dlabelColor">01/14</div>
              </div>

              <div className=" flex-col justify-center gap-5 ">

<button className=" w-12 h-12 rounded-full bg-dplaceHolder relative  text-dblack "><p className=" my-auto  mx-auto">+1</p></button>
<div className=" text-sm w-fit mx-auto text-dlabelColor">01/14</div>
</div>

<div className=" flex-col justify-center gap-5 ">

<button className=" w-12 h-12 rounded-full bg-dplaceHolder relative  text-dblack "><p className=" my-auto  mx-auto">+1</p></button>
<div className=" text-sm w-fit mx-auto text-dlabelColor">01/14</div>
</div>

<div className=" flex-col justify-center gap-5 ">

<button className=" w-12 h-12 rounded-full bg-dplaceHolder relative  text-dblack "><p className=" my-auto  mx-auto">+1</p></button>
<div className=" text-sm w-fit mx-auto text-dlabelColor">01/14</div>
</div>

<div className=" flex-col justify-center gap-5 ">

<button className=" w-12 h-12 rounded-full bg-dplaceHolder relative  text-dblack "><p className=" my-auto  mx-auto">+1</p></button>
<div className=" text-sm w-fit mx-auto text-dlabelColor">01/14</div>
</div>
            </div>
              
            </div>
            </div>

      
      </div>  
     </div>
        )}
   </div>
 </div>

















</div>
  );
}
export default CheckIn;

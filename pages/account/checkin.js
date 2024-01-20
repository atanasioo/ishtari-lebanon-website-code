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
  const [loading, setLoading] = useState(true);
  const [width, height] = useDeviceSize();
  const [checkins,setCheckins]= useState([]);
  const [points,setPoints]= useState(0);

  const modal = useRef(null);

  const getCheckinInf =()=>{
    setLoading(true)
    axiosServer
    .get(buildLink("checkin", undefined, window.innerWidth))
    .then((response) => {
      setLoading(false)
   console.log(response);
   setCheckins(response.data.data.checkins);
   setPoints(response.data.data.points);
    });
  }



  useEffect(()=>{
    getCheckinInf();
  },[])


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
            <div className="flex relative justify-center overflow-hidden my-5 bg-white h-screen  w-full">
          <div className="w-full md:w-4/5  md:px-0  mb-5 relative">
          <div>
       <div className="relative    justify-center  flex flex-col ">
           <div className=" max-md:text-left  max-md:justify-start max-md:mx-0 max-md:ml-3 flex my-8 justify-center text-center  flex-col w-fit mx-auto">
            <h1 className=" text-dblackk  text-3xl font-[900] ">MY POINTS</h1>
            <p className="  underline text-sm text-dlabelColor flex flex-row gap-2 justify-center"> Learn more about ishtari points <span className=" h-fit my-auto">{" "}<FaQuestionCircle className=" text-dbase text-sm"/></span> </p>

            </div>

            <div className=" w-full h-32 bg-dgrey rounded-md">


              <div className=" flex  flex-row justify-between max-md:px-8 px-24  py-7 ">
                <h2 className=" text-dlabelColor"> <span className=" text-dbase text-5xl">{points}</span> Points</h2>
                     <div className=" flex flex-col "><span>|</span><span>|</span><span>|</span></div>
                <h2  className=" text-dlabelColor"> <span className="text-dbase text-5xl">0</span> US Dollars</h2>


              </div>



            </div>
            
            <p className=" my-5 text-sm text-dlabelColor flex flex-row gap-2 justify-center"> Check in for 3 consecutive days o get a big surprise </p>

            <div className="  max-md:gap-5 gap-10 justify-center w-full h-full flex flex-wrap py-5">



{checkins&& checkins.map((checkin)=>{
return <div className=" flex-col justify-center gap-5 ">

  <button className={` w-12 h-12 rounded-full ${checkin.checked_in?" bg-dbase text-white":" bg-dplaceHolder"} relative  text-dblack `}><p className=" my-auto  mx-auto">{checkin.point}</p></button>
  <div className=" text-sm w-fit mx-auto text-dlabelColor">{checkin.date}</div>
</div>


})}




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

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
  const [showPopup,setShowpopup]= useState(false);
  const [earnedPoint,setEarnedPoint]= useState(0);
  const [state, dispatch] = useContext(AccountContext);
  const router = useRouter();
  const modal = useRef(null);

  const getCheckinInf =()=>{
    setLoading(true)
    axiosServer
    .get(buildLink("checkin", undefined, window.innerWidth))
    .then((response) => {
      setLoading(false)
      if(response.data.data.pop_up.checked_in){
        setEarnedPoint(response.data.data.pop_up.checked_points)
        setShowpopup(true)
      
      }
   setCheckins(response.data.data.checkins);
   setPoints(response.data.data.points);
    });
  }



  useEffect(()=>{
    if (!state.loading && !state.loged) {
        router.push("/");
      
     
    } else if (state.loged) {
    getCheckinInf();
    }
  },[state.loading])


  return (
    <div className="container  text-dblack">
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
            
            <p className=" my-5 text-sm text-dlabelColor flex flex-row gap-2 justify-center"> Check in for 3 consecutive days to get a big surprise </p>

            <div className="  max-md:gap-5 gap-10 justify-center w-full h-full flex flex-wrap py-5">



{checkins&& checkins.map((checkin)=>{
return <div className=" flex-col justify-center gap-5 ">

  <button onClick={()=>setShowpopup(true)} className={` w-12 h-12 rounded-full ${checkin.checked_in?" bg-dbase text-white":" bg-dplaceHolder"} relative  text-dblack `}><p className=" my-auto  mx-auto">{checkin.point}</p></button>
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





{showPopup&&<div onClick={()=>setShowpopup(false)} className=" fixed left-0 top-0 right-0 bottom-0  bg-dblack bg-opacity-40 z-50 "></div>}
<div className={`${showPopup?" top-0  scale-100 opacity-100":" -top-32 scale-0 opacity-0"} z-50 fixed px-5   rounded-md max-md:w-[350px] max-md:h-[300px] left-0 top-0 bottom-0 py-5 right-0  transition-opacity duration-300 bg-white my-auto mx-auto w-[450px] h-[350px]`}>
  <div className=" w-full h-full relative justify-center text-center flex flex-col gap-4">
    <div className=" w-16 h-16  mx-auto   bg-dbase text-white rounded-full flex items-center justify-center"><span className=" text-2xl">+1</span></div> 
  <h2 className=" text-2xl font-bold">You've earned <span className=" text-dbase  font-extrabold">{earnedPoint}</span> points!</h2>
  <span className=" text-md  text-dlabelColor">Check in for 2 more days to get a surprise reward.</span>
  <button onClick={()=>setShowpopup(false)} className="  bg-dbase mt-4 text-white px-4 py-1 rounded-md text-xl">Confirm</button>
  </div>
</div>











</div>
  );
}
export default CheckIn;

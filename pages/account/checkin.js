import { axiosServer } from "@/axiosServer";
import UserSidebar from "@/components/account/UserSidebar";
import UserSidebarMobile from "@/components/account/UserSidebarMobile";
import useDeviceSize from "@/components/useDeviceSize";
import { AccountContext } from "@/contexts/AccountContext";
import buildLink from "@/urls";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BsFillAwardFill, BsInfoCircleFill } from "react-icons/bs";

import PointsLoader from "@/components/PointsLoader";
import Image from "next/image";
import SingleCoupon from "../../components/couponComponents/singleCoupon";
import { FaQuestionCircle, FaTicketAlt } from "react-icons/fa";
import { sanitizeHTML } from "@/components/Utils";
import { RiCoupon2Line } from "react-icons/ri";
import Link from "next/link";
import { HiStar } from "react-icons/hi";
function CheckIn() {
  const [loading, setLoading] = useState(true);
  const [width, height] = useDeviceSize();
  const [checkins,setCheckins]= useState([]);
  const [points,setPoints]= useState(0);
  const [showPopup,setShowpopup]= useState(false);
  const [earnedPoint,setEarnedPoint]= useState(0);
  const [state, dispatch] = useContext(AccountContext);
  const [recommended ,setRecommended] = useState([])
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
   setRecommended(response.data.data.recomended.products);
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
            <div className="flex relative justify-center overflow-hidden my-5 bg-white h-full  w-full">
          <div className="w-full md:w-4/5  md:px-0   mb-5 relative">
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
           {recommended && <div className=" flex flex-col  container">
            <div className="pr-semibold text-d20 text-dblack my-6">
            Recomended

</div>
<div className=" grid grid-cols-1 md:grid-cols-2  gap-3 ">

{recommended.map((item , index)=>{
  return <Link
  className="rounded-lg p-4 bg-white relative"
  style={{
    height: "170px",
    border: "solid 1px #e6e6e6",
    boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.05)",
  }}
  href={`/${item.name
    .replaceAll(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
    .replaceAll("%", "")
    .replaceAll(/\s+/g, "-")
    .replaceAll("..", "")
    .replaceAll("/", "-")
    .replaceAll("---", "-")
    .replaceAll("--", "-")
    .replaceAll("100%", "")
    .replaceAll("#", "")
    .replaceAll("/", "")}/p=${item.product_id}`}

>
  <div className="flex items-center gap-2 h-">
    <div
      className="image-container mr-3.5 relative flex justify-center items-center"
      style={{ height: "138px", width: "92px" }}
    >
      <div className="w-full flex justify-center">
        <Image
          src={item.popup}
          className="w-full"
          width={92}
          height={138}
          alt={item.name}
          style={{
            backgroundImage: `url(${"/images/product_placeholder.png"})`,
            height: "auto", // Set the desired height
            width: "100%", // Set the desired width
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center"
          }}
        />
      </div>

     
    </div>
    <div className="product-info-container w-3/4">
      <div className="text-d14">
        {" "}
        <div
          className={`text-dblack pr-semibold mb-1 h-5 pr-semibold `}
          dangerouslySetInnerHTML={{
            __html: sanitizeHTML(item.manufacturer_name),
          }}
        />{" "}
        <span
          className={`text-dblack mb-1 line-clamp-1`}
          dangerouslySetInnerHTML={{
            __html: item.full_name,
          }}
        />
      </div>
      <div className="">
        <div>
          <strong className="pr-bold text-d16">
            {item.special !== "0" &&
            item.special !== "" &&
            item.special !== false
              ? item.special
              : item.price}
          </strong>
        </div>
        <div
          className={`mt-0.5 text-d12 flex items-center ${
            (item.special === "0" ||
              item.special === "" ||
              item.special === false) &&
            "invisible"
          }`}
        >
          <div
            className={`oldPrice text-d13 line-through text-dgreyProduct mr-1.5 font-normal`}
          >
            {item.price}
          </div>
          <div className="discount text-dgreen pr-bold whitespace-nowrap">
            {item.saving + "% OFF"}
          </div>
        </div>
        <div className="product-card-footer flex flex-col gap-4 mt-4"></div>
        <div
          className="splitter w-full"
          style={{ height: "1px", backgroundColor: "#E6E6E6" }}
        ></div>
        <div className={`flex`}>
          <div
            className="mt-3 flex flex-row gap-7 items-center justify-start w-full"
            style={{ minHeight: "16px" }}
          >
            <div className="express  -mt-1">
              {item.market === "0" ? (
                <Image
                  width={64}
                  height={24}
                  src={"/images/express.png"}
                  className="h-6 w-16 py-1 mobile:py-0 lg:py-1"
                  alt="Express delivery"
                />
              ) : (
                <Image
                  width={64}
                  height={24}
                  src={"/images/market.svg"}
                  className="h-6 w-16 py-1 mobile:py-0 lg:py-1 "
                  alt={"market image"}
                />
              )}
            </div>
            {item?.nb_of_reviews > 0 && (
              <div className=" flex ">
                <div
                  className="flex rounded-full  place-content-end h-4  align-bottom pl-1"
                  style={{
                    backgroundColor:
                      item?.rating >= 4.5
                        ? "rgb(0,158,0)"
                        : item?.rating < 4.5 && item?.rating >= 4
                        ? "rgb(110, 159, 0)"
                        : item?.rating < 4 && item?.rating >= 3.5
                        ? "rgb(243, 153, 22)"
                        : "rgb(246,90,31)",
                  }}
                >
                  <div
                    className="text-d11 font-bold text-white"
                    style={{ paddingTop: "0.5px" }}
                  >
                    {item?.rating || "0.0"}
                  </div>
                  <HiStar className="pt-1 text-white text-bold text-d12" />{" "}
                </div>

                <div className="font-light text-d11 pl-0.5">
                  ({" "}
                  {item?.reviews?.length < 1 &&
                  item?.reviews?.length === ""
                    ? "0"
                    : item?.nb_of_reviews}{" "}
                  )
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
</Link>
})}
  </div>
</div>
}
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

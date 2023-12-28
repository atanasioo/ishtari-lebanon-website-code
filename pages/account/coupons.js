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
import { FaTicketAlt } from "react-icons/fa";
import { sanitizeHTML } from "@/components/Utils";
import { RiCoupon2Line } from "react-icons/ri";
function Coupon() {
  const router = useRouter();
  const [data, setData] = useState();
  const [buttonActive, setButtonActive] = useState("1")
  const trigger = useRef(null);
  const [state, dispatch] = useContext(AccountContext);
  const [loading, setLoading] = useState(true);
  const [width, height] = useDeviceSize();
  const [modalOpen, setModalOpen] = useState(false);

  const modal = useRef(null);

  
  // close on click outside
  // useEffect(() => {
  //   const clickHandler = ({ target }) => {
  //     if (!modal.current) return;
  //     if (
  //       !modalOpen ||
  //       modal.current.contains(target) ||
  //       trigger.current.contains(target)
  //     )
  //       return;
  //     setModalOpen(false);
  //   };
  //   document.addEventListener("click", clickHandler);
  //   return () => document.removeEventListener("click", clickHandler);
  // });
  // close if the esc key is pressed
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!modal.current) return;
      if (
        !modalOpen ||
        modal.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setModalOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });


  const handleClick = (event) => {
    event.preventDefault();
    setButtonActive(event.target.id);
  }



  useEffect(() => {
    const { customer_id, code, date } = router.query;
  
    if (!state.loading && !state.loged) {
if(code == null || code == undefined){
  router.push("/");

}else{
  dispatch({type:"setShowOver",payload:true});
  dispatch({type:"setShowLogin",payload:true});
}
    } else if (state.loged) {
    axiosServer
    .post(buildLink("redeemCoupon", undefined, undefined, undefined) 
  +"&customer_id="+customer_id+"&code="+code+"&date="+date)
    .then((response) => {
     router.push("/account/coupons");
    });
       getCoupons();
    }
  }, [state.loading]);
const getCoupons =()=>{
  axiosServer
  .get(buildLink("coupons", undefined, window.innerWidth))
  .then((response) => {
    if (response?.data?.success) {
    
      console.log(response.data.data)
      setData(response.data.data);
      setLoading(false);
      if (!state.loged) {
      }
    } else {
      setLoading(false);
    }
  });
}



  return (
    <div className="container text-dblack">
      <Head>
        <title>My Account | ishtari</title>
      </Head>
      <div className="pb-2">
        <div className="flex-row md:flex"> 
          <div className="w-full mb-3 md:w-1/5">
            {width > 650 ? (
              <UserSidebar active={"coupon"} />
            ) : (
              <UserSidebarMobile active={"coupon"} />
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
       <div className="relative  justify-center  mobile:flex">
              <Image
                src={"/images/coupon.png"}
                width={1220}
                height={320}
              />
              <button  ref={trigger} onClick={()=>setModalOpen(true)} className="absolute right-5 top-3 max-md:right-3 ">
                <BsInfoCircleFill className=" text-white drop-shadow-md "/>
              </button>
              <div className="absolute gap-5 z-5 flex items-center   overflow-x-auto   max-md:w-full max-md:-bottom-6  -bottom-4 cursor-pointer">
              <button
                 id="1"
                 onClick={handleClick}
                className={` ${buttonActive === "1"? " bg-dbase text-white " : "bg-white text-dblack "}  border border-dgreyZoom   transition-all duration-300  text-sm shadow-md px-4 py-1.5 rounded-md`}
              >
                Available
              </button>
              <button
                onClick={handleClick}
                 id="2"
                 className={` ${buttonActive === "2"? " bg-dbase text-white " : "bg-white text-dblack "}  border border-dgreyZoom   transition-all duration-300  text-sm shadow-md px-4 py-1.5 rounded-md`}
              >
                Redeemed
              </button>
              <button
                onClick={handleClick}
                 id="3"
                 className={` ${buttonActive === "3"? " bg-dbase text-white " : "bg-white text-dblack "}  min-w-fit border border-dgreyZoom   transition-all duration-300  text-sm shadow-md px-4 py-1.5 rounded-md`}
              >
                Expires Soon
              </button>
                <button
                  onClick={handleClick}
                 id="4"
                 className={` ${buttonActive === "4"? " bg-dbase text-white " : "bg-white text-dblack "}  border border-dgreyZoom   transition-all duration-300  text-sm shadow-md px-4 py-1.5 rounded-md`}
              >
                Expired
              </button>
              </div>
            </div>
            </div>

      <div className="container  my-10 pb-5 w-full  h-fit grid grid-cols-3 max-lg:grid-cols-2 align-middle place-items-center  max-mobile:grid-cols-1 gap-5 relative max-md:text-center max-md:justify-center  overflow-y-auto">

      {buttonActive==="1"?( data.Available!=[]?( data&& data.Available.map((coupon=>{
                   return <SingleCoupon  coupon={coupon} type="available" getCoupons={getCoupons}/>

        }))):(<div className=" flex justify-center align-middle text-center w-full my-auto h-full pt-10"><h2 >No Available Coupons here</h2></div>)
      ):buttonActive==="2"?( data&& data.Redeemed.map((coupon=>{
        return <SingleCoupon  coupon={coupon} type="redeemed"  getCoupons={getCoupons}/>

      }))
        ):buttonActive==="3"?( data&& data['Expires Soon'].map((coupon=>{
          return <SingleCoupon  coupon={coupon} type="expiresSoon"  getCoupons={getCoupons}/>

      }))):( data&& data.Expired.map((coupon=>{
          return <SingleCoupon  coupon={coupon} type="expired"  getCoupons={getCoupons}/>

      })))
       }
        </div>
      </div>  
     </div>
        )}
   </div>
 </div>
















 <div
          className={`fixed  z-40 left-0 top-0 flex h-full min-h-screen w-full items-center justify-center transition-all   bg-[#6f6f6f4c] px-4 py-2 ${
            modalOpen ? "block" : "hidden"
          }`}
        >
          <div
            ref={modal}
            onFocus={() => setModalOpen(true)}
            onBlur={() => setModalOpen(false)}
            className="w-full max-w-[570px] flex flex-col justify-center rounded-[20px] bg-white px-8 py-9 text-center   md:py-12 md:px-10"
          >
           <div className=" p-3 mx-auto bg-[#e94a4f66] text-[#bf1b26] text-3xl flex text-center justify-center rounded-full mb-2"> <RiCoupon2Line  className="mx-auto my-auto " /></div>
           
            
           <div className=' text-2xl font-[900]  block   w-full mx-auto '> Coupons Description</div>
            <span
              className={`mx-auto mb-6 inline-block  my-6 border-t border-dashed border-dgreySeller h-1 w-full   `}
            ></span>
            <div className=' max-h-44 overflow-y-auto'>
            <div className="mb-10 text-base leading-relaxed text-body-color  dark:text-dlabelColor"
                

            
            >
       
             
              { data && 
           (
                <div
                id="desc"
                  className=' text-left  '
                dangerouslySetInnerHTML={{
                  __html: sanitizeHTML(data.description)
                }}
              />
              )
            }
    
            </div>
            </div>
            <div className="-mx-3 flex flex-wrap shadow-[white_0px_-25px_20px_0px] ">
              <div className={` px-3  w-full`}>
                <button
                  onClick={() => setModalOpen(false)}
                  className="block w-full rounded-md border border-stroke p-3 text-center text-base font-medium text-dark transition hover:border-red-600 hover:bg-dbase1 hover:text-white dark:text-white"
                >
                  Close
                </button>
              </div>
              
            </div>
          </div>
          </div>
</div>
  );
}
export default Coupon;



import { axiosServer } from '@/axiosServer';
import { htmlDecode, sanitizeHTML ,slugify ,slugifyText } from '@/components/Utils';
import buildLink from '@/urls';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AccountContext } from "@/contexts/AccountContext";
import { FaAccessibleIcon, FaTicketAlt } from "react-icons/fa";
import PointsLoader from '@/components/PointsLoader';
import Loader from '@/components/Loader';
import flashSale from '../../pages/flashSale';

const SingleCoupon = ({coupon ,type,description,getCoupons}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const trigger = useRef(null);
    const modal = useRef(null);
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);

  const [state, dispatch] = useContext(AccountContext);
    // close on click outside
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
    // close if the esc key is pressed
    useEffect(() => {
      const keyHandler = ({ keyCode }) => {
        if (!modalOpen || keyCode !== 27) return;

        setModalOpen(false);
      };
      document.addEventListener("keydown", keyHandler);
      return () => document.removeEventListener("keydown", keyHandler);
    });

    const  openCouponInfo =(id)=>{
     
      if(type == "available"){
        setModalOpen(true)
        return;
      }
      setModalOpen(true)
    }

  // const  getCouponInf=(id)=>{
  //     axiosServer
  //     .get(buildLink("getSingleCoupon", undefined, undefined, undefined) +
  //   +id)
  //     .then((response) => {
  //       if (response?.data?.success) {
          
  //         console.log(response.data.data)
  //         setData(response.data.data);
  //         setLoading(false);
  //         if (!state.loged) {
  //         }
  //       } else {
  //         setLoading(false);
  //       }
  //     });
  //   }
    
const  redeemCoupon = (id)=>{
  setLoading(true);
  if(type !== "available"){
    
    return;
  }
  axiosServer
  .post(buildLink("redeemCoupon", undefined, undefined, undefined) +
+id)
  .then((response) => {
   
     getCoupons();
    setLoading(false);
     setModalOpen(false);
  });


}


  return (
    <>
    <button 
                   ref={trigger}
                   onClick={() => openCouponInfo(coupon?.coupon_id)}
                   className="ticket relative group  w-full cursor-pointer h-[150px]">
                    <div className="absolute w-full h-full bg-white opacity-0 group-hover:opacity-25 top-0 z-20"></div>
                   <div className="stub text-dbase">
                   <div className=" flex w-full flex-col h-full justify-between text-center">
                     
                     <div className="top text-lg font-bold">
                     {coupon?.amount} Off
                     </div>
                     <div className=" bg-dgrey1 h-[1px] w-full"></div>
                    <div  className="text-sm font-light">
                    {coupon?.name}
                    </div>
                   </div>
                   </div>
                   <div className='divider-coupon'></div>
                   <div className="check py-4 px-2 flex flex-col justify-between h-full text-start w-full">
                   
                     <div className=" flex flex-col ">
                         <h4>coupon code</h4>
                         <h2 className=" text-[#BE282F] text-2xl " >{coupon?.code}</h2>
                     </div>
                     <div className=" text-sm">
                       <span > {type=="expired"?(<>Expired from</>):(<>Valid Till</>)}  - {coupon?.date_end}</span>
                       </div>
                   </div>
                 </button>
                 
                 
                 
                 <div
          className={`fixed  z-40 left-0 top-0 flex h-full min-h-screen w-full items-center justify-center  bg-[#6f6f6f4c] px-4 py-5 ${
            modalOpen ? "block" : "hidden"
          }`}
        >
          <div
            ref={modal}
            onFocus={() => setModalOpen(true)}
            onBlur={() => setModalOpen(false)}
            className="w-full max-w-[570px] flex flex-col justify-center rounded-[20px] bg-white px-8 py-12 text-center   md:px-[70px] md:py-[60px]"
          >
           <div className=" w-10 h-10 mx-auto bg-[#e94a4f66] text-[#bf1b26] flex text-center justify-center rounded-full mb-5"> <FaTicketAlt className="mx-auto my-auto " /></div>
            <h5 className=" text-xl font-semibold text-dark dark:text-white sm:text-2xl">
              {coupon?.code}
            </h5>
            <h5 className=" text-dgreySeller px-5 tracking-wider"> Get instant discount 500 an applying this coupon</h5>
            <p className=" text-dbase1 "> {type=="expired"?(<>Expired from </>):(<>Expire In </>)}{coupon?.date_end}</p>

            <span
              className={`mx-auto mb-6 inline-block my-6 border-2 border-dashed border-dbase h-1 w-[90px] rounded  `}
            ></span>
            <div className=' max-h-40 overflow-y-auto'>
            <div className="mb-10 text-base leading-relaxed text-body-color  dark:text-dlabelColor"
                

            
            >
              { 
           
              type=="available"?(<h4>Click Redeem button to redeem this coupon</h4>):(
              <div >{ htmlDecode(coupon?.rules)}</div>
              )
            }
       
            </div>
            </div>
            <div className="-mx-3 flex flex-wrap shadow-[white_0px_-25px_20px_0px] ">
              <div className={` px-3 ${type!=="available"?"w-full":"w-1/2"}`}>
                <button
                  onClick={() => setModalOpen(false)}
                  className="block w-full rounded-md border border-stroke p-3 text-center text-base font-medium text-dark transition hover:border-red-600 hover:bg-dbase1 hover:text-white dark:text-white"
                >
                  Cancel
                </button>
              </div>
              <div className={`w-1/2 px-3 ${type!=="available"?"hidden":"block"}`}>
                <button  onClick={() => redeemCoupon(coupon?.coupon_id)} className="block w-full bg-dgreen rounded-md border border-primary bg-primary p-3 text-center text-base font-medium text-white transition hover:bg-blue-dark">
              {loading && loading ?<div className='w-full flex justify-center align-middle text-center'> <div className='w-[30px]'><Loader/></div></div>:  <>Redeem</> }
                
                </button>
              </div>
            </div>
          </div>
        </div>
                 
                 
                 </>
  )
}

export default SingleCoupon
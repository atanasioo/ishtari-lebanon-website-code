import React, { useContext, useEffect, useRef } from 'react'
import Loader from '../Loader'
import { BiCart, BiCategory, BiHeart } from 'react-icons/bi'
import Link from "next/link";
import { useRouter } from "next/router";
import { CartContext } from '@/contexts/CartContext';
import { HiOutlineHome, HiOutlineUserCircle, HiOutlineX } from 'react-icons/hi';
import { FaAngleDown, FaArrowAltCircleRight, FaCaretDown, FaHeart, FaRegHeart } from 'react-icons/fa';
import { WishlistContext } from '@/contexts/WishlistContext';
import useDeviceSize from '../useDeviceSize';
import { AccountContext } from '@/contexts/AccountContext';
import { HandleAuthForm } from '../handleAuthForm';

const BottomBar = () => {
    const {openAuthForm}= HandleAuthForm();
    const {width} = useDeviceSize()
    const router = useRouter();
    const [ stateCart,dispatchCart] = useContext(CartContext)
    const [ stateWishlist, dispatchWish] = useContext(WishlistContext)
    const[ stateAcc,dispatchAcc]= useContext(AccountContext)




    const wrapperRef = useRef(null);
    useEffect(() => {
   
   if(stateAcc.openRemindBirthday){

          function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                dispatchAcc({ type: "setopenRemindBirthday", payload: false });
                
            }
          }
          // Bind the event listener
          document.addEventListener("mousedown", handleClickOutside);
          document.addEventListener("scroll", handleClickOutside);
          return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("scroll", handleClickOutside);
          };
        
        }
    
  }, [wrapperRef.current, stateAcc.openRemindBirthday]);



  return (
  <div id="bottombar" className=" max-md:block hidden  bottombar   bg-white    py-2  w-full ">


    <div className="relative w-full flex text-xl flex-row justify-between px-4 text-center">
    <Link href="/" className={`flex flex-col justify-center text-center ${router.pathname === '/' ? 'text-dbase' : 'text-dgrey1'}`}>
      <HiOutlineHome className="mx-auto" />
      <span className="text-sm font-medium">Home</span>
    </Link>

    <Link href="/allcategories" className={`flex flex-col justify-center text-center ${router.pathname === '/allcategories' ? 'text-dbase' : 'text-dgrey1'}`}>
      <BiCategory className="mx-auto" />
      <span className="text-sm font-medium">Categories</span>
    </Link>
  { stateAcc.loged&&  <Link href="/account/wishlist" className={`text-dbase relative flex flex-col justify-center text-center ${router.pathname === '/account/wishlist' ? 'text-dbase' : 'text-dgrey1'}`}>
      <BiHeart className="mx-auto" />
      <span className="text-sm font-medium">Wish</span>
      <span className={`w-5 h-5  bg-dbase flex text-white items-center justify-center rounded-full text-xs absolute right-0 sm:right-2 -top-1.5 border-2 border-white -mr-2 mobile:mr-1`}>
               
               <span>
                   {
                       stateCart.loading ?
                           <Loader styles={'h-4 w-4 text-white'} />
                           :
                           <span>{stateWishlist.productsCount}</span>
                   }
               </span>
           </span>
    </Link>
}
    <Link href="/cart" className={`text-dbase relative flex flex-col justify-center text-center ${router.pathname === '/cart' ? 'text-dbase' : 'text-dgrey1'}`}>
      <BiCart className="mx-auto" />
      <span className="text-sm font-medium">Cart</span>
      <span className={`w-5 h-5  bg-dbase flex text-white items-center justify-center rounded-full text-xs absolute right-0 sm:right-2 -top-1.5 border-2 border-white -mr-2 mobile:mr-1`}>
               
               <span>
                   {
                       stateCart.loading ?
                           <Loader styles={'h-4 w-4 text-white'} />
                           :
                           <span>{stateCart.productsCount}</span>
                   }
               </span>
           </span>
    </Link>



    <div onClick={()=>{
        if(stateAcc.loged){
            router.push("/account/profile")
        }else{
            openAuthForm()
        }  
    }} className={`flex relative flex-col   justify-center text-center ${router.pathname !== '/account/wishlist' && router.pathname.startsWith('/account')  ? 'text-dbase' : 'text-dgrey1'}`}>
      <HiOutlineUserCircle className="mx-auto" />
      <span className="text-sm font-medium">Account</span>


      <div  className={`  transition-all ${!stateAcc.openRemindBirthday && !stateAcc.hasdateBirth ?" h-3 w-3":"h-0 w-0 "} absolute  z-50 bg-dbase  rounded-full border-2  right-3 -top-1  border-white`}></div>


      <div ref={wrapperRef}
            className={`  ${
              // stateAcc.loged&& !stateAcc.hasdateBirth &&
              stateAcc.openRemindBirthday
                ? " scale-y-100   opacity-100 z-50"
                : "   scale-y-0 opacity-0 -z-50"
            }  transition-all
         right-2  bottom-16  fixed  mx-4 duration-300  max-w-[300px]   z-30  `}
          >
            <div className="flex  relative  gap-3 justify-center py-2 w-full bg-dblack bg-opacity-70  shadow-lg container  rounded-lg">
              <h2 className="text-white text-sm text-start leading-5  my-auto ">
                Enter Your Birthday To Benefit From Gifts and Discounts. <button className=" bg-dbase px-2   py-1 rounded-full">Account</button>
              </h2>
              <div className=' absolute -bottom-3 right-2 text-dblack opacity-60'><FaCaretDown/></div>
            </div>
          </div>



    </div>
  </div>

    </div>
  )
}

export default BottomBar
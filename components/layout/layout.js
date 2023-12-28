import React, { useContext, useEffect, useState, useTransition } from "react";
import Footer from "./footer/footer";
import Header from "./header/header";
import { useRouter } from "next/router";
import buildLink, { path } from "../../urls";
import AsideMenu from "./AsideMenu";
import { AccountContext } from "@/contexts/AccountContext";
import Link from "next/link";
import { FaArrowAltCircleRight, FaSadCry } from "react-icons/fa";
import { HiOutlineX } from "react-icons/hi";
import Cookies from "js-cookie";
import { useHeaderColor } from "@/contexts/HeaderContext";
function Layout({
  children,
  token,
  host
}) {
  const router = useRouter();
  const [stateAcc, dispatch] = useContext(AccountContext); 
  const { headerColor, setHeaderColor   } = useHeaderColor();

  useEffect(() => {
    const handleScroll = () => {

      const scrollTop = window.pageYOffset;
      if(router.asPath !=="/"){


      }else{
        if (scrollTop >= 300) {

          setHeaderColor("white")
         } else {
           
   setHeaderColor(localStorage.getItem("headerCol"))
         }
      }
   
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      // Clean up the event listener when the component is unmounted
      window.removeEventListener('scroll', handleScroll);
    };
  }, [router.asPath]);
  // console.log(information_data.informations)
  // console.log("token inlayout " +token);
  // useEffect(() => {
  //   const tokenn = Cookies.get("api-token");
  //   console.log(tokenn);
  //   console.log(document.cookie);
  //   // console.log(tokenn);
  //   if((tokenn === "undefined" || typeof tokenn ==="undefined" || tokenn === undefined) && typeof token !== "undefined"){
  //     // console.log("hello");
  //     // Cookies.set("api-token", token, { expires: 15 });
  //     // console.log(token);
  //   }
  //  },[token])
  function closeRemindBirthday(){
    
    dispatch({type:"setopenRemindBirthday",payload:false});
  
    Cookies.set("remindBirthdayopend", true);
    
    
  }
  return (
    <div>
      {router.pathname.indexOf("print") > -1  &&  router.pathname.indexOf("pos") > 0? (
        <></>
      ) : !router.pathname.startsWith("/seller_report")   ? (
        //other user case
        <>
        {
        // <Link href={`${path}/account/profile`} ><div className=" w-full relative overflow-hidden  h-8 bg-dbase  ">
        // <div className="text-center   align-middle flex justify-center my-auto h-full animation-text-banner  ">
        //   <h2 className="text-white  my-auto ">Enter Your Birthday To Benefit From Gifts and Discounts.</h2>
        //   </div>
        // </div>
        // </Link>
}
        <div style={{fontFamily:"serif"}} className={` flex  transition-all
         ${ 
          // stateAcc.loged&& !stateAcc.hasdateBirth &&
         stateAcc.openRemindBirthday?"right-5 max-md:right-3 ":"-right-[200%] "}   fixed bottom-2  shadow-dbase gap-3 justify-center  text-center  z-30  py-4  w-[400px] bg-dbase shadow-lg container  rounded-lg `}>
           <h2 className="text-white text-xl   my-auto ">Enter Your Birthday To Benefit From Gifts and Discounts.</h2>
           <button onClick={()=>{
            dispatch({type:"setopenRemindBirthday",payload:false});
            router.push("/account/profile");

           }} className=" bg-white my-auto  h-10  rounded-full px-2 text-dbase  flex justify-center gap-1 hover:gap-2 text-center"><span className="my-auto flex justify-center gap-2 text-center" >Profile <FaArrowAltCircleRight className="my-auto"  /> </span> </button> 
       <button onClick={()=>closeRemindBirthday()} className=" p-1 bg-dlabelColor opacity-80 text-white absolute rounded-full -top-3 -right-3 "><HiOutlineX/></button>
        </div>
        <Header host={host} />
        </>
      ) : (
        //seller case
        <AsideMenu />
      )}
      {children}
      {  (router.pathname.indexOf("print") > -1 ||  router.pathname.startsWith("/orders") ) ? (
        <></>
      ):
      !router.pathname.startsWith("/seller_report") &&  router.pathname.indexOf("pos") < 0  &&(
        //other user case
        <Footer
        />
      )}
    </div>
  );
}
export default Layout;










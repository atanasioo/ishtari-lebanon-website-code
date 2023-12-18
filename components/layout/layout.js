import React, { useContext, useEffect, useState } from "react";
import Footer from "./footer/footer";
import Header from "./header/header";
import { useRouter } from "next/router";
import buildLink, { path } from "../../urls";
import AsideMenu from "./AsideMenu";
import { AccountContext } from "@/contexts/AccountContext";
import Link from "next/link";
import { FaArrowAltCircleRight } from "react-icons/fa";

function Layout({
  children,
  token,
  host
}) {
  const router = useRouter();
  const [stateAcc, dispatch] = useContext(AccountContext);
  
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
        <div className=" flex  fixed bottom-2  gap-3 justify-center text-center right-5 z-30  py-9 w-fit bg-white shadow-lg border-2 border-dashed border-dbase container  rounded-lg ">
           <h2 className="text-dblack text-xl  my-auto ">Enter Your Birthday To Benefit From Gifts and Discounts.</h2>   
           <button className=" bg-dbase  rounded-full p-3 text-white  flex justify-center gap-1 hover:gap-2 text-center">Profile <FaArrowAltCircleRight className="my-auto"  /> </button>
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

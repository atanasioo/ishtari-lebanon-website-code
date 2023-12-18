import React, { useContext, useEffect, useState } from "react";
import Footer from "./footer/footer";
import Header from "./header/header";
import { useRouter } from "next/router";
import buildLink, { path } from "../../urls";
import AsideMenu from "./AsideMenu";
import { AccountContext } from "@/contexts/AccountContext";
import Link from "next/link";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";


function Layout({
  children,
  token,
  host
}) {
  const router = useRouter();
  const [stateAcc, dispatch] = useContext(AccountContext);
  const [showPopup, setShowPopup] = useState(true);
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);
  useEffect(() => {
    const lastClosedTime = localStorage.getItem('lastClosedTime');
    const currentTime = new Date().getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000; 

    if (lastClosedTime && currentTime - lastClosedTime < twentyFourHours) {
      setShowPopup(false);
       const timeoutId = setTimeout(() => {
        setShowPopup(true);
      }, twentyFourHours - (currentTime - lastClosedTime));

      return () => clearTimeout(timeoutId);
    }
  }, []);
  const closePopup = () => {
    const currentTime = new Date().getTime();

    localStorage.setItem('lastClosedTime', currentTime);
    if (doNotShowAgain) {
      localStorage.setItem('doNotShowAgain', 'true');
    }
    setShowPopup(false);

    setTimeout(() => {
      setShowPopup(true);
    }, 2000);
  };

  const handleAnimationEnd = () => {
    setShowPopup(false);
  };
 
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
      {stateAcc.loged && !stateAcc.hasdateBirth && showPopup && 
        <div id="bday" onAnimationEnd={handleAnimationEnd} className=" flex fixed gap-3 justify-center text-center  z-30  py-5 w-fit bg-white shadow-2xl border-2  border-dbase container  rounded-lg h-32  ">
          <div className="  text-xl justify-end text-end mb-20">
          <button onClick={closePopup} className=" text-dbase hover:text-dbase1 ">
          <IoCloseCircle/>
          </button>
          </div>
           <h2 className="text-dblack text-xl  my-auto  x">Enter Your Birthday To Benefit From Gifts and Discounts.</h2>   
           <Link href={`${path}/account/profile`}>
           <button className=" bg-dbase  rounded-full p-3 mt-4 text-white  flex justify-center gap-1 hover:gap-2 text-center hover:bg-dbase1 ">Profile <FaArrowAltCircleRight className="my-auto"  /> </button>
           </Link>
           
        </div>
}
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

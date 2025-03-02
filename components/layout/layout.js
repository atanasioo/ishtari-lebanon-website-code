import React, { useContext, useEffect} from "react";
import Footer from "./footer/footer";
import Header from "./header/header";
import { useRouter } from "next/router";
import AsideMenu from "./AsideMenu";
import { AccountContext } from "@/contexts/AccountContext";
import { FaArrowAltCircleRight } from "react-icons/fa";
import {  HiOutlineX } from "react-icons/hi";
import Cookies from "js-cookie";
import { useHeaderColor } from "@/contexts/HeaderContext";
import { useMessage } from "@/contexts/MessageContext";
import { CartContext } from "@/contexts/CartContext";
import BottomBar from "./bottomBar";
import useDeviceSize from "../useDeviceSize";
function Layout({ children, token, host }) {
  const router = useRouter();
  const [stateAcc, dispatch] = useContext(AccountContext);
  const [ stateCart,dispatchCart] = useContext(CartContext)
  const { headerColor, setHeaderColor } = useHeaderColor();
  const { successMessage, errorMessage,message } = useMessage();
const {width} = useDeviceSize();

  var prevScroll = 200;
  // useEffect(() => {
  
  //   const header = document.getElementById("headersticky")
  //   if(header){

    
  //   header.classList.remove("hide")
  //   header.classList.remove("hideradmin")
  //   }
  //   const handleScroll = () => {
  //     const scrollTop = window.pageYOffset;
  //     if (router.asPath !== "/") {
  //     } else {
  //       if (scrollTop >= 300) {
  //         setHeaderColor("white");
  //       } else {
  //         const headerCollocal = localStorage.getItem("headerCol");
  //         //  console.log("____________________");
  //         //  console.log(headerCollocal)
  //         if (
  //           headerCollocal == null ||
  //           headerCollocal == "" ||
  //           headerCollocal == undefined
  //         ) {
  //           setHeaderColor("white");
  //         } else {
  //           setHeaderColor(headerCollocal);
  //         }
  //       }
  //     }
    
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     // Clean up the event listener when the component is unmounted
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  
  // }, [router.asPath]);



  let header ;
  let bottombar ;


  useEffect(()=>{
     header = document.getElementById("headersticky")
     bottombar = document.getElementById("bottombar")
  },[])

  useEffect(() => {

    if(header && bottombar){

    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
     
      if(scrollTop<200){
         header.classList.remove("hide")
         bottombar.classList.remove("hide")
      }else{
        if(scrollTop> prevScroll){
          //  console.log(`prev${prevScroll}`);
       
            header.classList.add("hide")
            bottombar.classList.add("hide")
         
          
          }else if(scrollTop< prevScroll) {
            header.classList.remove("hide")
            bottombar.classList.remove("hide")
          }
        prevScroll = scrollTop
      }

    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }
  }, [bottombar, header]);





  function closeRemindBirthday() {
    dispatch({ type: "setopenRemindBirthday", payload: false });
    Cookies.set("remindBirthdayopend", true);
  }
  return (
    <div>
      {router.pathname.indexOf("print") > -1 &&
      router.pathname.indexOf("pos") > 0 ? (
        <></>
      ) : !router.pathname.startsWith("/seller_report") ? (
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
          {/* <div
            className={`   transition-all
         ${
           // stateAcc.loged&& !stateAcc.hasdateBirth &&
           !stateAcc.openRemindBirthday
             ? "right-5  max-md:right-3 "
             : "-right-[200%] "
         } fixed bottom-2  mx-4  max-w-[400px]   z-30  `}
          >
            <div className="flex  shadow-dbase gap-3 justify-center    py-4    w-full bg-dbase shadow-lg container  rounded-lg">
              <h2 className="text-white text-sm   my-auto ">
                Enter Your Birthday To Benefit From Gifts and Discounts.
              </h2>
              <button
                onClick={() => {
                  dispatch({ type: "setopenRemindBirthday", payload: false });
                  router.push("/account/profile");
                }}
                className=" bg-white my-auto py-1 text-sm rounded-full px-2 text-dbase  flex justify-center gap-1 hover:gap-2 text-center"
              >
                <span className="my-auto flex justify-center gap-2 text-center">
                  Profile <FaArrowAltCircleRight className="my-auto" />{" "}
                </span>{" "}
              </button>
              <button
                onClick={() => closeRemindBirthday()}
                className=" p-1 bg-dlabelColor opacity-80 text-white absolute rounded-full -top-3 -right-3 "
              >
                <HiOutlineX />
              </button>
            </div>
          </div> */}

      <div className={` ${successMessage?" z-[999] translate-x-0 opacity-100":" -z-50  translate-x-20 opacity-0"} duration-200 transition-all fixed top-14 right-0 bg-dgreenop px-6 py-4 mx-2 my-4 rounded-md text-lg flex items-center  w-3/4 xl:w-2/4`}>
        <svg
          viewBox="0 0 24 24"
          className="text-dgreen w-5 h-5 sm:w-5 sm:h-5 mr-3"
        >
          <path
            fill="currentColor"
            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
          ></path>
        </svg>
        <span className="text-dgreen">
          {" "}
          {message}{" "}
        </span>
      </div>
   

        <div className={`fixed ${errorMessage?" z-[999] translate-x-0 opacity-100":" -z-50  translate-x-20 opacity-0"}  duration-100  transition-all  top-14 right-0 bg-dbase1 px-6 py-4 mx-2 my-4 rounded-md text-lg flex items-center  w-3/4 xl:w-2/4`}>
          <svg
            viewBox="0 0 24 24"
            className="text-white w-5 h-5 sm:w-5 sm:h-5 mr-3"
          >
            <path
              fill="currentColor"
              d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
            ></path>
          </svg>
          <span className=" text-white"> {message} </span>
        </div>
    














          <Header host={host} />
        </>
      ) : (
        //seller case
        <AsideMenu />
      )}
      {children}
      { router.pathname.indexOf("print") > -1 ||
      router.pathname.startsWith("/orders") ? (
        <></>
      ) : (
        !router.pathname.startsWith("/seller_report") &&
        router.pathname.indexOf("pos") < 0 && (
          //other user case
          <Footer />
        )
      )}

    <BottomBar/>
    
    </div>
  );
}
export default Layout;


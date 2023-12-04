import { axiosServer } from "@/axiosServer";
import UserSidebar from "@/components/account/UserSidebar";
import UserSidebarMobile from "@/components/account/UserSidebarMobile";
import SingleProduct from "@/components/product/SingleProduct";
import useDeviceSize from "@/components/useDeviceSize";
import { AccountContext } from "@/contexts/AccountContext";
import buildLink from "@/urls";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
<<<<<<< HEAD
import PointsLoader from "@/components/PointsLoader";
import Slider from "react-slick";
import { FaAccessibleIcon } from "react-icons/fa";
=======


import PointsLoader from "@/components/PointsLoader";
import CouponSlider from "../couponComponents/couponSlider";
import Slider from "react-slick"; 
>>>>>>> refs/remotes/origin/master
import Image from "next/image";
import { BsChatLeft, BsChevronLeft, BsChevronRight, BsPlus } from "react-icons/bs";
import Link from "next/link";
import { path } from "../../urls";
<<<<<<< HEAD
import Modal from 'react-modal';
function Coupon() {
  const router = useRouter();
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [buttonActive, setButtonActive] = useState("1")
  const [showLimit, setShowLimit] = useState(false);
  const [limit, setLimit] = useState(48);
  const [mobileSort, showMobileSort] = useState(false);
  const [total, setTotal] = useState(0);
  const [state, dispatch] = useContext(AccountContext);
  const [loading, setLoading] = useState(true);
  const [width, height] = useDeviceSize();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '60%',
      maxWidth: '400px', // Set a maximum width if needed
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
    },
  };
  function pageSetter(page) {
    setPage(page["selected"] + 1);
    router.push(
      `/account/buyagain&page=${page["selected"] + 1}&limit=${limit}`
    );
  }
  function limitSetter(lim) {
    setLimit(lim);
    history.push({
      pathname: "/account/buyagain",
      search: `&page=${page}&limit=${lim}`,
    });
  }
=======
import SingleCoupon from "../couponComponents/singleCoupon";
function Coupon() {
  const router = useRouter();
  const [data, setData] = useState();
  const [buttonActive, setButtonActive] = useState("1")

  const [state, dispatch] = useContext(AccountContext);
  const [loading, setLoading] = useState(true);
  const [width, height] = useDeviceSize();
  const [modalOpen, setModalOpen] = useState(false);
  const trigger = useRef(null);
  const modal = useRef(null);
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




>>>>>>> refs/remotes/origin/master
  const handleClick = (event) => {
    event.preventDefault();
    setButtonActive(event.target.id);
  }
<<<<<<< HEAD
  const settingSliderD = {
    speed: 1000,
    slidesToShow: width<670?2:width<920?2: 3,
    swipeToSlide: true,
    infinite: false,
    autoplay: true,
    autoplaySpeed: 4000,
    prevArrow: width<450?null: <CustomPrevArrows />,
    nextArrow: width<450?null: <CustomNextArrows  />,
    lazyLoad: true,
  };
  function CustomNextArrows({ direction, onClick, style, className }) {
    return (
      <div
      onClick={onClick}
        className="swiper-button-prev    rounded-full "
      >
        <div className="flex justify-center items-center w-8 h-8 transition-all bg-white opacity-30 hover:opacity-100 rounded-full mr-1  border border-dlabelColor  cursor-pointer">
          <BsChevronRight className="text-dblack" />
        </div>
      </div>
    );
  }
  function CustomPrevArrows({ direction, onClick, style, className }) {
    return (
      <div
      onClick={onClick}
        className="swiper-button-next rounded-full "
      >
        <div className="flex justify-center items-center w-8 h-8 bg-white opacity-30 hover:opacity-100 rounded-full ml-1  border border-dlabelColor  cursor-pointer">
          <BsChevronLeft className="text-dblack" />
        </div>
      </div>
    );
  }
=======



  



 

>>>>>>> refs/remotes/origin/master
  useEffect(() => {
    if (!state.loading && !state.loged) {
      router.push("/");
      setLoading(false);
    } else if (state.loged) {
<<<<<<< HEAD
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
  }, [page, limit, state.loading]);
=======
       getCoupons();
    }
  }, [ state.loading]);

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


>>>>>>> refs/remotes/origin/master
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
                src={"/images/cutomer-suggestion.png"}
                width={1220}
                height={320}
              />
<<<<<<< HEAD
              <div className="absolute gap-5 z-5 flex items-center  overflow-x-auto  max-md:w-full max-md:-bottom-6  -bottom-4 cursor-pointer">
=======
              <div className="absolute gap-5 z-5 flex items-center  scrollbar-hide overflow-x-auto   max-md:w-full max-md:-bottom-6  -bottom-4 cursor-pointer">
>>>>>>> refs/remotes/origin/master
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
      <div className="container my-10 w-full  h-fit flex flex-wrap gap-3 relative max-md:text-center max-md:justify-center  overflow-y-auto">
<<<<<<< HEAD
      {buttonActive==="1"?( data&& data.Available.map((coupon=>{
                   return <div className="ticket w-[350px] h-[150px]">
                    
                   <div className="stub">
                   <div className=" flex w-full flex-col h-full justify-between text-center">
                     <div className="top text-lg font-bold">
                     23% Off
                     </div>
                     <div className=" bg-dgrey1 h-[1px] w-full"></div>
                    <div  className="text-sm font-light">
                    Winter is here
                    </div>
                   </div>
                   </div>
                   <div className="check py-4 px-2 flex flex-col justify-between h-full text-start w-full">
                     <div className=" flex flex-col ">
                         <h4>coupon code</h4>
                         <h2 className=" text-[#BE282F] text-2xl " >Free Sales</h2>
                     </div>
                     <div className="">
                       <span>Valid Till - 30 Jan 2022</span>
                       <a href="#" onClick={openModal}>
        Open Popup
      </a>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        <h2>Popup Content</h2>
        <p>This is the content of your popup window.</p>
        <a href="#" onClick={closeModal} style={{ marginTop: '20px', display: 'block' }}>
          Close
        </a>
      </Modal>
                       </div>
                   </div>
                 </div>
      }))
      ):(
      <div></div>
      )
    }
</div>
            </div>
=======

      {buttonActive==="1"?( data.Available!=[]?( data&& data.Available.map((coupon=>{
                   return <SingleCoupon description={data.description} coupon={coupon} type="available" getCoupons={getCoupons}/>

        }))):(<div className=" flex justify-center align-middle text-center w-full my-auto h-full pt-10"><h2 >No Available Coupons here</h2></div>)
      ):buttonActive==="2"?( data&& data.Redeemed.map((coupon=>{
        return <SingleCoupon description={data.description} coupon={coupon} type="redeemed"  getCoupons={getCoupons}/>

}))
):buttonActive==="3"?( data&& data['Expires Soon'].map((coupon=>{
  return <SingleCoupon description={data.description} coupon={coupon} type="expiresSoon"  getCoupons={getCoupons}/>

}))):( data&& data.Expired.map((coupon=>{
  return <SingleCoupon description={data.description} coupon={coupon} type="expired"  getCoupons={getCoupons}/>

})))
    }








</div>
            </div>
      
>>>>>>> refs/remotes/origin/master
      </div>
          )}
        </div>
      </div>
<<<<<<< HEAD
    </div>
  );
}
export default Coupon;




















=======
    
    </div>
  );
}

export default Coupon;
>>>>>>> refs/remotes/origin/master

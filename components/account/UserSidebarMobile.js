import { path } from "../../urls";
import {BsFillCartCheckFill, BsFillHeartFill, BsStar, BsStarFill} from 'react-icons/bs'
import {MdAvTimer, MdFeedback} from 'react-icons/md'
import Link from "next/link";
import { FaMoneyBillWave, FaUserAlt, FaWallet ,FaTicketAlt, FaCheckCircle} from "react-icons/fa";
import { ImLocation } from "react-icons/im";
import { MdCardMembership } from "react-icons/md";
import { HiLightBulb } from "react-icons/hi";
import {RiUserFollowLine} from "react-icons/ri";

function UserSidebarMobile(props) {
  return (
    <div className="flex md:block justify-between overflow-x-auto">
      <Link
        href={`${path}/account/profile`}
        className={`py-2 flex-row md:flex items-center hover:bg-dgrey1 hover:bg-opacity-10 px-0 cursor-pointer ${
          props.active === "profile" && "bg-white text-dbase"
        }`}
      >
        <div className="flex flex-col justify-between h-full items-center w-14">
          <div className="text-center">
            <FaUserAlt className="icon icon-user-solid text-d20  w-8 block text-center mt-1" />
          </div>
          <span className="text-center text-d11">Profile</span>
        </div>
      </Link>
      <Link
        href={`${path}/account/orders`}
        className={`py-2 flex-row md:flex  items-center hover:bg-dgrey1 hover:bg-opacity-10 px-1 cursor-pointer ${
          props.active === "orders" && "bg-white text-dbase"
        }`}
      >
        <div className="flex flex-col justify-between items-center h-full w-14">
          <div className="text-center">
            <FaMoneyBillWave className="text-d20 my-1 " />
          </div>
          <span className="text-center text-d11">Orders</span>
        </div>
      </Link>
      {/* <Link
        href={`${path}/account/memberShip`}
        className={`py-2 flex-row md:flex  items-center hover:bg-dgrey1 hover:bg-opacity-10 px-1 cursor-pointer ${
          props.active === "memberShip" && "bg-white text-dbase"
        }`}
      >
        <div className="flex flex-col justify-between items-center h-full w-14">
          <div className="text-center">
            <MdCardMembership className="text-d20 my-1" />
          </div>
          <span className="text-center text-d11">MemberShip</span>
        </div>
      </Link> */}
      <Link
        href={`${path}/account/wallet`}
        className={`py-2 flex-row md:flex  items-center hover:bg-dgrey1 hover:bg-opacity-10 px-1 cursor-pointer ${
          props.active === "wallet" && "bg-white text-dbase"
        }`}
      >
        <div className="flex flex-col justify-between items-center h-full w-14">
          <div className="text-center">
            <FaWallet className="text-d20 my-1 " />
          </div>
          <span className="text-center text-d11">Wallet</span>
        </div>
      </Link>
      <Link
        href={`${path}/account/coupons`}
        className={`py-2 flex-row md:flex  items-center hover:bg-dgrey1 hover:bg-opacity-10 px-1 cursor-pointer ${
          props.active === "coupon" && "bg-white text-dbase"
        }`}
      >
        <div className="flex flex-col justify-between items-center h-full w-14">
          <div className="text-center">
            <FaTicketAlt className="text-d20 my-1 " />
          </div>
          <span className="text-center text-d11">Coupon</span>
        </div>
      </Link>
      <Link
        href={`${path}/account/checkin`}
        className={`py-2 flex-row md:flex  items-center hover:bg-dgrey1 hover:bg-opacity-10 px-1 cursor-pointer ${
          props.active === "checkin" && "bg-white text-dbase"
        }`}
      >
        <div className="flex flex-col justify-between items-center h-full w-14">
          <div className="text-center">
            <FaCheckCircle className="text-d20 my-1 " />
          </div>
          <span className="text-center text-d11">Check In</span>
        </div>
      </Link>
      <Link
        href={`${path}/account/buyagain`}
        className={`py-2  flex-row md:flex  items-center hover:bg-dgrey1 hover:bg-opacity-10 px-1 cursor-pointer ${
          props.active === "buyagain" && "bg-white text-dbase"
        }`}
      >
        <div className="flex flex-col justify-between h-full items-center w-14">
          <div className="text-center">
          <BsFillCartCheckFill className=" my-1 text-d20" />
          </div>
          <span className="text-center text-d11 mt-1">Buy Again</span>
        </div>
      </Link>

      <Link
        href={`${path}/account/recentlyViewed`}
        className={`py-2  flex-row md:flex  items-center hover:bg-dgrey1 hover:bg-opacity-10  cursor-pointer ${
          props.active === "recentlyViewed" && "bg-white text-dbase"
        }`}
      >
        <div className="flex flex-col justify-between h-full items-center w-24">
          <div className="text-center">
          <MdAvTimer className=" my-1 text-2xl"/>
          </div>
          <span className="text-center text-d11 mt-1">Recently Viewed</span>
        </div>
      </Link>
      <Link
        href={`${path}/account/address`}
        className={`py-2 flex-row md:flex  items-center hover:bg-dgrey1 hover:bg-opacity-10 px-1 cursor-pointer ${
          props.active === "addresses" && "bg-white text-dbase"
        }`}
      >
        <div className="flex flex-col justify-between items-center w-14 h-full">
          <div className="text-center">
            <ImLocation className="text-d20 mt-1  w-8" />
          </div>
          <span className="text-center text-d11">Addresses</span>
        </div>
      </Link>
      <Link
        href={`${path}/account/wishlist`}
        className={`py-2 flex-row md:flex items-center hover:bg-dgrey1 hover:bg-opacity-10 px-1 cursor-pointer ${
          props.active === "wishlist" && "bg-white text-dbase"
        }`}
      >
        <div className="flex flex-col justify-between h-full items-center w-14">
          <div className="text-center">
            <BsFillHeartFill className="text-d20 text-center w-8 mt-1" />
          </div>
          <span className="text-center text-d11">WishList</span>
        </div>
      </Link>
      <Link
        href={`${path}/account/follow`}
        className={`py-2 flex-row md:flex items-center hover:bg-dgrey1 hover:bg-opacity-10 px-1 cursor-pointer ${
          props.active === "follow" && "bg-white text-dbase"
        }`}
      >
        <div className="flex flex-col justify-between h-full items-center w-20">
          <div className="text-center">
            <RiUserFollowLine className="my-1 text-2xl" />
          </div>
          <span className="text-center text-d11 mt-1">follow</span>
        </div>
      </Link>
      <Link
        href={`${path}/account/reviewCenter`}
        className={`py-2 flex-row md:flex items-center hover:bg-dgrey1 hover:bg-opacity-10 px-1 cursor-pointer ${
          props.active === "reviewCenter" && "bg-white text-dbase"
        }`}
      >
        <div className="flex flex-col justify-between h-full items-center w-20">
          <div className="text-center">
            <BsStarFill className="my-1 text-2xl" />
          </div>
          <span className="text-center text-d11 mt-1">Review Center</span>
        </div>
      </Link>
      <Link
        href={`${path}/account/feedback`}
        className={`py-2 flex-row md:flex items-center hover:bg-dgrey1 hover:bg-opacity-10 px-1 cursor-pointer ${
          props.active === "feedback" && "bg-white text-dbase"
        }`}
      >
        <div className="flex flex-col justify-between h-full items-center w-14">
          <div className="text-center">
            <MdFeedback className="my-1 text-2xl" />
          </div>
          <span className="text-center text-d11 mt-1">Feedback</span>
        </div>
      </Link>
      <Link
        href={`${path}/account/suggestion`}
        className={`py-2 flex-row md:flex items-center hover:bg-dgrey1 hover:bg-opacity-10 px-1 cursor-pointer ${
          props.active === "suggestion" && "bg-white text-dbase"
        }`}
      >
        <div className="flex flex-col justify-between h-full items-center w-14">
          <div className="text-center">
            <HiLightBulb className="my-1 text-2xl" />
          </div>
          <span className="text-center text-d11 mt-1">Suggestion</span>
        </div>
      </Link>
      
    </div>
  );
}

export default UserSidebarMobile;

import { path } from "../../urls";
import {BsFillCartCheckFill, BsFillHeartFill} from 'react-icons/bs'
import {MdAvTimer} from 'react-icons/md'
import Link from "next/link";
import { FaMoneyBillWave, FaUserAlt } from "react-icons/fa";
import { ImLocation } from "react-icons/im";
function UserSidebarMobile(props) {
  return (
    <div className="flex md:block justify-between overflow-x-auto">
      <Link
        href={`${path}/account/orders`}
        className={`py-2 flex-row md:flex  items-center hover:bg-dgrey1 hover:bg-opacity-10 px-3 cursor-pointer ${
          props.active === "orders" && "bg-white text-dbase"
        }`}
      >
        <div className="flex flex-col justify-center items-center">
          <div className="text-center">
            <FaMoneyBillWave className="text-d16 my-1 " />
          </div>
          <span className="text-center text-d11">Orders</span>
        </div>
      </Link>
      <Link
        href={`${path}/account/buyagain`}
        className={`py-2  flex-row md:flex  items-center hover:bg-dgrey1 hover:bg-opacity-10 px-3 cursor-pointer ${
          props.active === "buyagain" && "bg-white text-dbase"
        }`}
      >
        <div className="flex flex-col justify-center items-center">
          <div className="text-center">
          <BsFillCartCheckFill className=" my-1 text-d16" />
          </div>
          <span className="text-center text-d11 mt-1">Buy Again</span>
        </div>
      </Link>

      <Link
        href={`${path}/account/recentlyViewed`}
        className={`py-2  flex-row md:flex  items-center hover:bg-dgrey1 hover:bg-opacity-10 px-3 cursor-pointer ${
          props.active === "recentlyViewed" && "bg-white text-dbase"
        }`}
      >
        <div className="flex flex-col justify-center items-center">
          <div className="text-center">
          <MdAvTimer className=" my-1 text-d16" />
          </div>
          <span className="text-center text-d11 mt-1">Recently Viewed</span>
        </div>
      </Link>
      <Link
        href={`${path}/account/addresses`}
        className={`py-2 flex-row md:flex  items-center hover:bg-dgrey1 hover:bg-opacity-10 px-3 cursor-pointer ${
          props.active === "addresses" && "bg-white text-dbase"
        }`}
      >
        <div className="flex flex-col justify-center items-center">
          <div className="text-center">
            <ImLocation className="icon icon-location text-center text-lg md:text-2xl block w-8" />
          </div>
          <span className="text-center text-d11">Addresses</span>
        </div>
      </Link>
      <Link
        href={`${path}/account/wishlist`}
        className={`py-3 flex-row md:flex items-center hover:bg-dgrey1 hover:bg-opacity-10 px-3 cursor-pointer ${
          props.active === "wishlist" && "bg-white text-dbase"
        }`}
      >
        <div className="flex flex-col justify-center items-center">
          <div className="text-center">
            <BsFillHeartFill className="icon icon-heart text-md md:text-xl text-center w-8" />
          </div>
          <span className="text-center text-d11">WishList</span>
        </div>
      </Link>
      <Link
        href={`${path}/account/profile`}
        className={`py-3 flex-row md:flex items-center hover:bg-dgrey1 hover:bg-opacity-10 px-3 cursor-pointer ${
          props.active === "profile" && "bg-white text-dbase"
        }`}
      >
        <div className="flex flex-col justify-center items-center">
          <div className="text-center">
            <FaUserAlt className="icon icon-user-solid text-md md:text-xl w-8 block text-center " />
          </div>
          <span className="text-center text-d11">Profile</span>
        </div>
      </Link>
    </div>
  );
}

export default UserSidebarMobile;

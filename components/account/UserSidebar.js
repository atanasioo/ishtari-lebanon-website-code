import { useContext, useEffect, useState } from "react";
import { AccountContext } from "../../contexts/AccountContext";
import buildLink, { path } from "../../urls";
import { BsFillCartCheckFill, BsFillHeartFill, BsStarFill } from "react-icons/bs";
import { MdAvTimer } from "react-icons/md";
import Link from "next/link";
import { FaMoneyBillWave, FaUserAlt } from "react-icons/fa";
import { ImLocation } from "react-icons/im";

function UserSidebar(props) {
  const [data, setData] = useState(props.data);
  const [state] = useContext(AccountContext);
  const [showOrderArrow, setShowOrderArrow] = useState(false);
  const [showAddArrow, setShowAddArrow] = useState(false);
  const [showWishArrow, setShowWishArrow] = useState(false);
  const [showBuyArrow, setShowBuyArrow] = useState(false);
  const [showRecentlyViewedArrow, setShowRecentlyViewedArrow] = useState(false);
  const [showReviewCenterArrow, setShowReviewCenterArrow] = useState(false);

  const [showProfileArrow, setShowProfileArrow] = useState(false);

  return true ? (
    <aside
      className="box-content overflow-x-hidden overflow-y-auto block w-full h-full border-r border-dgreyZoom"
      style={{
        flex: "0 0 auto",
      }}
    >
      <ul className="lg:py-3 py-1">
        <li
          onMouseEnter={() => {
            setShowProfileArrow(true);
          }}
          onMouseLeave={() => {
            setShowProfileArrow(false);
          }}
        >
          <Link
            href={`${path}/account/profile`}
            className="xl:px-10 lg:px-8 md:px-6 px-16 flex gap-4 items-center h-12 w-full hover:text-dblackk"
            style={{ color: "rgb(126,133,155)" }}
          >
            <FaUserAlt className="text-d16 text-dbase" />
            <span
              className={`flex-1 ml-3 ${
                props.active === "profile" && "font-semibold underline"
              }`}
              style={{
                color: props.active === "profile" ? "rgb(64,69,83)" : "",
              }}
            >
              Profile
            </span>
            {showProfileArrow && (
              <img className="-mr-1" src={"/images/arrow-right.svg"} alt="arrow" />
            )}{" "}
          </Link>
        </li>
        <li
          onMouseEnter={() => {
            setShowOrderArrow(true);
          }}
          onMouseLeave={() => {
            setShowOrderArrow(false);
          }}
        >
          <Link
            href={`${path}/account/orders`}
            className="xl:px-10 lg:px-8 md:px-6 px-16 flex gap-4 items-center h-12 w-full hover:text-dblackk"
            style={{ color: "rgb(126,133,155)" }}
          >
            <FaMoneyBillWave className="text-d16 text-dbase" />
            <span
              className={`flex-1 ml-3 ${
                props.active === "orders" && "font-semibold underline"
              }`}
              style={{
                color: props.active === "orders" ? "rgb(64,69,83)" : "",
              }}
            >
              Orders
            </span>
            {showOrderArrow && (
              <img className="-mr-1" src={"/images/arrow-right.svg"} alt="arrow" />
            )}{" "}
          </Link>
        </li>

        <li
          onMouseEnter={() => {
            setShowBuyArrow(true);
          }}
          onMouseLeave={() => {
            setShowBuyArrow(false);
          }}
        >
          <Link
            href={`${path}/account/buyagain`}
            className="xl:px-10 lg:px-8 md:px-6 px-16 flex gap-4 items-center h-12 w-full hover:text-dblackk"
            style={{ color: "rgb(126,133,155)" }}
          >
            <BsFillCartCheckFill className="text-dbase text-d16" />
            <span
              className={`flex-1 ml-3 ${
                props.active === "buyagain" && "font-semibold underline"
              }`}
              style={{
                color: props.active === "buyagain" ? "rgb(64,69,83)" : "",
              }}
            >
              Buy Again
            </span>
            {showBuyArrow && (
              <img className="-mr-1" src={"/images/arrow-right.svg"} alt="arrow" />
            )}{" "}
          </Link>
        </li>

        <li
          onMouseEnter={() => {
            setShowRecentlyViewedArrow(true);
          }}
          onMouseLeave={() => {
            setShowRecentlyViewedArrow(false);
          }}
        >
          <Link
            href={`${path}/account/recentlyViewed`}
            className="xl:px-10 lg:px-8 md:px-6 px-16 flex gap-4 items-center h-12 w-full hover:text-dblackk"
            style={{ color: "rgb(126,133,155)" }}
          >
            <MdAvTimer className="text-dbase text-d20" />
            <span
              className={`flex-1 ml-2 ${
                props.active === "recentlyViewed" && "font-semibold underline"
              }`}
              style={{
                color: props.active === "recentlyViewed" ? "rgb(64,69,83)" : "",
              }}
            >
              Recently Viewed
            </span>
            {showRecentlyViewedArrow && (
              <img className="-mr-1" src={"/images/arrow-right.svg"} alt="arrow" />
            )}{" "}
          </Link>
        </li>
        <li
          onMouseEnter={() => {
            setShowAddArrow(true);
          }}
          onMouseLeave={() => {
            setShowAddArrow(false);
          }}
        >
          <Link
            href={`${path}/account/address`}
            className="px-16 md:px-0 md:pl-6 lg:px-8 xl:px-10 flex gap-4 items-center h-12 w-full hover:text-dblackk"
            style={{ color: "rgb(126,133,155)" }}
          >
            <ImLocation className="text-d16 text-dbase" />
            <span
              className={`flex-1 ml-3 ${
                props.active === "addresses" && "font-semibold underline"
              }`}
              style={{
                color: props.active === "addresses" ? "rgb(64,69,83)" : "",
              }}
            >
              Addresses
            </span>
            {showAddArrow && (
              <img className="-mr-1" src={"/images/arrow-right.svg"} alt="arrow" />
            )}{" "}
          </Link>
        </li>
        <li
          onMouseEnter={() => {
            setShowWishArrow(true);
          }}
          onMouseLeave={() => {
            setShowWishArrow(false);
          }}
        >
          <Link
            href={`${path}/account/wishlist`}
            className="xl:px-10 lg:px-8 md:px-6 px-16 flex gap-4 items-center h-12 w-full hover:text-dblackk"
            style={{ color: "rgb(126,133,155)" }}
          >
            <BsFillHeartFill className="text-d16 text-dbase" />
            <span
              className={`flex-1 ml-3 ${
                props.active === "wishlist" && "font-semibold underline"
              }`}
              style={{
                color: props.active === "wishlist" ? "rgb(64,69,83)" : "",
              }}
            >
              WishList
            </span>
            {showWishArrow && (
              <img className="-mr-1" src={"/images/arrow-right.svg"} alt="" />
            )}{" "}
          </Link>
        </li>
        <li
          onMouseEnter={() => {
            setShowReviewCenterArrow(true);
          }}
          onMouseLeave={() => {
            setShowReviewCenterArrow(false);
          }}
        >
          <Link
            href={`${path}/account/reviewCenter`}
            className="xl:px-10 lg:px-8 md:px-6 px-16 flex gap-4 items-center h-12 w-full hover:text-dblackk"
            style={{ color: "rgb(126,133,155)" }}
          >
            <BsStarFill className="text-d16 text-dbase" />
            <span
              className={`flex-1 ml-3 ${
                props.active === "reviewCenter" && "font-semibold underline"
              }`}
              style={{
                color: props.active === "reviewCenter" ? "rgb(64,69,83)" : "",
              }}
            >
              Review Center
            </span>
            {showReviewCenterArrow && (
              <img className="-mr-1" src={"/images/arrow-right.svg"} alt="arrow" />
            )}{" "}
          </Link>
        </li>
      </ul>
    </aside>
  ) : (
    <div></div>
  );
}

export default UserSidebar;

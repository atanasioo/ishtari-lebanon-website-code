import { useContext, useEffect, useState } from "react";
import { AccountContext } from "../../contexts/AccountContext";
import buildLink, { path } from "../../urls";
import {
  BsFillCartCheckFill,
  BsFillHeartFill,
  BsStarFill
} from "react-icons/bs";
import { MdAvTimer, MdCardMembership, MdFeedback } from "react-icons/md";
import Link from "next/link";
import { FaMoneyBillWave, FaUserAlt, FaWallet } from "react-icons/fa";
import { ImLocation } from "react-icons/im";
import { BiStar } from "react-icons/bi";
import { HiLightBulb } from "react-icons/hi";
import { RiUserFollowLine } from "react-icons/ri";
function UserSidebar(props) {
  const [data, setData] = useState(props.data);
  const [state] = useContext(AccountContext);
  const [showOrderArrow, setShowOrderArrow] = useState(false);
  const [showAddArrow, setShowAddArrow] = useState(false);
  const [showWishArrow, setShowWishArrow] = useState(false);
  const [showBuyArrow, setShowBuyArrow] = useState(false);
  const [showRecentlyViewedArrow, setShowRecentlyViewedArrow] = useState(false);
  const [showMemberShipArrow, setShowMembershipArrow] = useState(false);

  const [showReviewCenterArrow, setShowReviewCenterArrow] = useState(false);
  const [showFeedbackArrow, setShowFeedbackArrow] = useState(false);
  const [showSuggestionArrow, setShowSuggestionArrow] = useState(false);
  const [showWalletArrow, setShowWalletArrow] = useState(false);
  const [showProfileArrow, setShowProfileArrow] = useState(false);

  return (
    <aside
      className="box-content overflow-x-hidden overflow-y-auto block w-full h-full border-r border-dgreyZoom"
      style={{
        flex: "0 0 auto"
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
            className="pl-9 flex items-center h-12 w-full text-dgreyAccount hover:text-dblackk"
          >
            <div className="w-2/12">
              <FaUserAlt className="text-d16 text-dbase" />
            </div>
            <span
              className={`flex-1 w-4/12 ${
                props.active === "profile" && "font-semibold underline"
              } ${props.active === "profile" ? "text-dgreyAccountActive" : ""}`}
            >
              Profile
            </span>
            {showProfileArrow && (
              <div className="w-2/12">
                <img className="" src={"/images/arrow-right.svg"} alt="arrow" />
              </div>
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
            className="pl-9 flex items-center h-12 w-full text-dgreyAccount hover:text-dblackk"
          >
            <div className="w-2/12">
              <FaMoneyBillWave className="text-d16 text-dbase " />
            </div>
            <span
              className={`flex-1 w-4/12 ${
                props.active === "orders" && "font-semibold underline"
              } ${props.active === "orders" ? "text-dgreyAccountActive" : ""} `}
            >
              Orders
            </span>
            {showOrderArrow && (
              <div className="w-2/12">
                <img
                  className="-mr-1"
                  src={"/images/arrow-right.svg"}
                  alt="arrow"
                />
              </div>
            )}{" "}
          </Link>
        </li>
        <li
          onMouseEnter={() => {
            setShowWalletArrow(true);
          }}
          onMouseLeave={() => {
            setShowWalletArrow(false);
          }}
        >
          <Link
            href={`${path}/account/wallet`}
            className="pl-9 flex  items-center h-12 w-full text-dgreyAccount hover:text-dblackk"
          >
            <div className="w-2/12">
              <FaWallet className="text-d16 text-dbase" />
            </div>
            <div
              className={`flex-1 w-4/12 ${
                props.active === "wallet" && "font-semibold underline"
              } ${props.active === "wallet" ? "text-dgreyAccountActive" : ""} `}
            >
              Wallet
            </div>
            {showWalletArrow && (
              <div className="w-2/12">
                <img
                  className="-mr-1"
                  src={"/images/arrow-right.svg"}
                  alt="arrow"
                />
              </div>
            )}{" "}
          </Link>
        </li>

        {/* <li
          onMouseEnter={() => {
            setShowMembershipArrow(true);
          }}
          onMouseLeave={() => {
            setShowMembershipArrow(false);
          }}
        >
          <Link
            href={`${path}/account/memberShip`}
            className="ml-9 flex  items-center h-12 text-dgreyAccount hover:text-dblackk"
          >
            <div className="w-2/12">
              <MdCardMembership className="text-dbase text-d20" />
            </div>
            <div
              className={`flex-1  w-4/12 ${
                props.active === "memberShip" && "font-semibold underline"
              } ${ props.active === "memberShip" ? "text-dgreyAccountActive" : ""}`}
            >
              MemberShip
            </div>
            {showMemberShipArrow && (
              <div className=" w-2/12">
                <img src={"/images/arrow-right.svg"} alt="arrow" />
              </div>
            )}{" "}
          </Link>
        </li> */}

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
            className="pl-9 flex  items-center h-12 w-full text-dgreyAccount hover:text-dblackk"
          >
            <div className="w-2/12">
              <BsFillCartCheckFill className="text-dbase text-d16" />
            </div>
            <span
              className={`flex-1 w-4/12 ${
                props.active === "buyagain" && "font-semibold underline"
              } ${
                props.active === "buyagain" ? "text-dgreyAccountActive" : ""
              }`}
            >
              Buy Again
            </span>
            {showBuyArrow && (
              <div className="w-2/12">
                <img className="" src={"/images/arrow-right.svg"} alt="arrow" />
              </div>
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
            className="ml-9 flex  items-center h-12 text-dgreyAccount hover:text-dblackk"
          >
            <div className="w-2/12">
              <MdAvTimer className="text-dbase text-d20" />
            </div>
            <div
              className={`flex-1  w-4/12 ${
                props.active === "recentlyViewed" && "font-semibold underline"
              }${
                props.active === "recentlyViewed"
                  ? "text-dgreyAccountActive"
                  : ""
              }`}
            >
              Recently Viewed
            </div>
            {showRecentlyViewedArrow && (
              <div className=" w-2/12">
                <img src={"/images/arrow-right.svg"} alt="arrow" />
              </div>
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
            className="pl-9 flex items-center h-12 w-full text-dgreyAccount hover:text-dblackk"
          >
            <div className="w-2/12">
              <ImLocation className="text-d16 text-dbase" />
            </div>
            <span
              className={`flex-1 w-4/12${
                props.active === "addresses" && "font-semibold underline"
              }${
                props.active === "addresses" ? "text-dgreyAccountActive" : ""
              }`}
            >
              Addresses
            </span>
            {showAddArrow && (
              <div className="w-2/12">
                <img src={"/images/arrow-right.svg"} alt="arrow" />
              </div>
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
            className="pl-9 flex items-center h-12 w-full text-dgreyAccount hover:text-dblackk"
          >
            <div className="w-2/12">
              <BsFillHeartFill className="text-d16 text-dbase" />
            </div>
            <span
              className={`flex-1 w-4/12 ${
                props.active === "wishlist" && "font-semibold underline"
              }${props.active === "wishlist" ? "text-dgreyAccountActive" : ""}`}
            >
              WishList
            </span>
            {showWishArrow && (
              <div className=" w-2/12">
                <img src={"/images/arrow-right.svg"} alt="arrow" />
              </div>
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
            className="pl-9 flex items-center h-12 w-full text-dgreyAccount hover:text-dblackk"
          >
            <div className="w-2/12">
              <BsStarFill className="text-d16 text-dbase" />
            </div>
            <span
              className={`flex-1 w-4/12 ${
                props.active === "reviewCenter" && "font-semibold underline"
              } ${
                props.active === "reviewCenter" ? "text-dgreyAccountActive" : ""
              }`}
            >
              Review Center
            </span>
            {showReviewCenterArrow && (
              <div className=" w-2/12">
                <img src={"/images/arrow-right.svg"} alt="arrow" />
              </div>
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
            href={`${path}/account/follow`}
            className="pl-9 flex items-center h-12 w-full text-dgreyAccount hover:text-dblackk"
          >
            <div className="w-2/12">
              <RiUserFollowLine className="text-d16 text-dbase" />
            </div>
            <span
              className={`flex-1 w-4/12 ${
                props.active?.indexOf("follow") > -1 && "underline font-semibold text-dgreyAccountActive"}`}
            >
              Follow 
            </span>
            {showWishArrow && (
              <div className=" w-2/12">
                <img src={"/images/arrow-right.svg"} alt="arrow" />
              </div>
            )}{" "}
          </Link>
        </li>
        <li
          onMouseEnter={() => {
            setShowFeedbackArrow(true);
          }}
          onMouseLeave={() => {
            setShowFeedbackArrow(false);
          }}
        >
          <Link
            href={`${path}/account/feedback`}
            className="pl-9 flex  items-center h-12 w-full text-dgreyAccount hover:text-dblackk"
          >
            <div className="w-2/12">
              <MdFeedback className="text-d16 text-dbase" />
            </div>
            <div
              className={`flex-1 w-4/12 ${
                props.active === "feedback" && "font-semibold underline"
              } ${props.active === "feedback" && "text-dgreyAccountActive"}`}
            >
              Feedback
            </div>
            {showFeedbackArrow && (
              <div className="w-2/12">
                <img src={"/images/arrow-right.svg"} alt="arrow" />
              </div>
            )}{" "}
          </Link>
        </li>
        <li
          onMouseEnter={() => {
            setShowSuggestionArrow(true);
          }}
          onMouseLeave={() => {
            setShowSuggestionArrow(false);
          }}
        >
          <Link
            href={`${path}/account/suggestion`}
            className="pl-9 flex  items-center h-12 w-full text-dgreyAccount hover:text-dblackk"
          >
            <div className="w-2/12">
              <HiLightBulb className="text-d20 text-dbase" />
            </div>
            <div
              className={`flex-1 w-4/12 ${
                props.active === "suggestion" && "font-semibold underline"
              } ${props.active === "suggestion" && "text-dgreyAccountActive"}`}
            >
              Suggestion
            </div>
            {showSuggestionArrow && (
              <div className="w-2/12">
                <img src={"/images/arrow-right.svg"} alt="arrow" />
              </div>
            )}{" "}
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default UserSidebar;

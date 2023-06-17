import Cookies from "js-cookie";
import Link from "next/link";
import { sanitizeHTML } from "@/components/Utils";
import { IoMdClose } from "react-icons/io";
import { ImExit } from "react-icons/im";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";
import { FaHome, FaUser, FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/router";
import LogofloOrange from "/public/images/logo-flo-orange.png";
import logoflo from "/public/images/logo-flo.png";
function MobileMenu(props) {
  const { viewMenu, viewLevel2, activeCategory, categories, closeMobileMenu, handleActiveCategory, closeLevel2 } = props;
  const router = useRouter();

  function handleScroll() {
    var myDiv = document.getElementById("scrollDiv");
    myDiv.scrollTop = 0;
  }

  return (
    <div
      className={`transition-all min-h-screen w-screen bg-white fixed top-0  bottom-0 right-0 ov/erflow-x-hidden overflow-y-scroll z-50  ${
        viewMenu ? "right-0" : " right-full"
      }`}
      id="scrollDiv"
    >
      <div className=" text-dblack overflow-x-hidden">
        {/* Logo */}
        <div className="flex flex-col py-3 border-b border-dgrey px-4 ">
          <div className="flex items-center justify-between">
            {Cookies.get("site-local-name") === "flo" ||
            window.location.host === "flo-lebanon.com" ? (
              <img
                src={LogofloOrange}
                alt={window.config["short-name"]}
                className="h-8"
              />
            ) : (
              <img
                src={"/images/logo/logo-red.png"}
                alt={"logo"}
                className="h-8"
              />
            )}
            <button onClick={() => closeMobileMenu()}>
              <IoMdClose className=" text-2xl"></IoMdClose>
            </button>
          </div>
          <h2 className=" font-semibold pt-2.5">
            Hi, We Are {window.config["short-name"]}
          </h2>
        </div>
        <div className="relative">
          {/* Second row */}
          <div className=" relative flex items-center justify-between py-4 px-8 border-b border-dgrey">
            {/* Home */}
            <Link href="/" className="menu-button">
              <div className="menu-icon bg-dbase flex justify-center py-2.5 px-3 rounded-sm">
                <FaHome className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs">Home</span>
            </Link>
            {/* My account */}
            {/* {state.loged && ( */}
            <Link href={`/account/profile`} className="menu-button">
              <div className="menu-icon bg-dbase flex justify-center p-2.5 rounded-sm">
                <FaUser className="w-4 h-4 text-white"></FaUser>
              </div>
              <span className="text-xs">Account</span>
            </Link>
            {/* )} */}
            {/* Logout */}
            {/* {state.loged && ( */}
            <button onClick={() => logout()} className="menu-button">
              <div className="menu-icon bg-dbase flex justify-center p-2.5 rounded-sm">
                <ImExit className="w-4 h-4 text-white"></ImExit>
              </div>
              <span className="text-xs">Log Out</span>
            </button>
            {/* )} */}
            {/* Sign in */}
            {/* {!state.loged && (
            <button
              className="menu-button"
              onClick={() => {
                dispatch({ type: "setShowOver", payload: true });
                dispatch({ type: "setShowLogin", payload: true });
                dispatch({ type: "setShowSignup", payload: false });
              }}
            >
              <span className="menu-icon">
                <i className="icon icon-user-solid"></i>
              </span>
              <span className="text-xs">Sign In</span>
            </button>
          )} */}
            {/* Sign up */}
            {/* {!state.loged && (
            <button
              className="menu-button"
              onClick={() => {
                dispatch({ type: "setShowOver", payload: true });
                dispatch({ type: "setShowLogin", payload: false });
                dispatch({ type: "setShowSignup", payload: true });
              }}
            >
              <span className="menu-icon">
                <i className="icon icon-user-plus"></i>
              </span>
              <span className="text-xs">Sign Up</span>
            </button>
          )} */}
            {/* Cart */}
            <Link href={`/cart`} className="menu-button">
              <div className="menu-icon bg-dbase flex justify-center p-2.5 rounded-sm">
                <FaShoppingCart className="w-4 h-4 text-white"></FaShoppingCart>
              </div>
              <span className="text-xs">My Cart</span>
            </Link>
          </div>
          {/* Categories */}
          <div className="p-4 overflow-x-hidden">
            {/* Level 2 categories */}
            <div
              className={`absolute w-full h-full min-h-screen right-0 top-0 transition-all bg-white ${
                viewLevel2 ? "left-0" : "left-full"
              }`}
            >
              <div className="p-4">
                <div
                  className="flex items-center py-1  "
                  onClick={() => closeLevel2()}
                >
                  <BsChevronLeft className="w-4 h-4  mr-2"></BsChevronLeft>
                  <h2
                    className="font-semibold"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML(activeCategory.name),
                    }}
                  ></h2>
                </div>
                {activeCategory.categories?.length > 0 &&
                  activeCategory?.categories?.map((category) => (
                    <div
                      onClick={()=> router.push(`${
                        // state.admin
                        //   ? path + "/category/" + category.category_id
                        //   :
                        category.name.length > 0
                          ? "/" +
                            category.name
                              .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                              .replace(/\s+/g, "-") +
                            "/c=" +
                            category.category_id
                          : "cat/c=" + category.category_id
                      }`)}
                   
                      className=" flex justify-between  items-center border-b border-dgrey py-1"
                      key={category.name}
                    >
                      <span
                        className="font-light py-1"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHTML(category.name),
                        }}
                      ></span>
                    </div>
                  ))}
              </div>
            </div>
            <div
            // className={`${window.config["showMenu"] ? "block" : "hidden"}`}
            >
              <h2 className=" text-dgrey1 text-xs mb-2">ALL CATEGORIES</h2>

              {categories?.length > 0 &&
                categories?.map((category) => (
                  <div
                    className=" flex justify-between items-center border-b border-dgrey py-1.5"
                    key={category.name}
                  >
                    <div
                    onClick={() => router.push(`${
                        // state.admin
                        //   ? path + "/category/" + category.category_id
                        //   :
                        category.name.length > 0
                          ? "/" +
                            category.name
                              .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                              .replace(/\s+/g, "-") +
                            "/c=" +
                            category.category_id
                          : "cat/c=" + category.category_id
                      }`)}
                     
                      // to={`${path}/category/${category.category_id}`}
                      className="font-light"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHTML(category.name),
                      }}
                    ></div>
                    <span
                      className="w-10 flex items-center justify-center"
                      onClick={() => {
                        handleActiveCategory(category);
                        
                        handleScroll();
                      }}
                    >
                      <BsChevronRight className=" w-4 h-4 text-dgrey1"></BsChevronRight>
                    </span>
                  </div>
                ))}
              <Link
                href={`/latest`}
                className=" flex justify-between items-center"
              >
                <span className="font-semibold py-2 pb-36">NEW ARRIVALS</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;

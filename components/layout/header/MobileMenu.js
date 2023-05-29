import Cookies from "js-cookie";
import Link from "next/link";
import { sanitizeHTML } from "@/components/Utils";

function MobileMenu(props) {
    const {viewMenu, viewLevel2, activeCategory, categories}= props;

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
            {Cookies.get("site-local-name") === "flo" ? (
              // || window.location.host === "flo-lebanon.com"
              <img
                src={LogofloOrange}
                alt={window.config["short-name"]}
                className="h-8"
              />
            ) : (
              <img
                src={"/images/logo/logo-red.png"}
                // alt={window.config["short-name"]}
                className="h-8"
              />
            )}
            <button onClick={() => setViewMenu(false)}>
              <i className="icon icon-cancel text-2xl"></i>
            </button>
          </div>
          <h2 className=" font-semibold pt-2">
            {/* Hi, We Are {window.config["short-name"]} */}
          </h2>
        </div>
        <div className="relative">
          {/* Second row */}
          <div className=" relative flex items-center justify-between py-4 px-8 border-b border-dgrey">
            {/* Home */}
            <Link href="/" className="menu-button">
              <span className="menu-icon">
                <i className="icon icon-home"></i>
              </span>
              <span>Home</span>
            </Link>
            {/* My account */}
            {/* {state.loged && (
            <Link to={`${path}/account/profile`} className="menu-button">
              <span className="menu-icon">
                <i className="icon icon-user-solid"></i>
              </span>
              <span>Account</span>
            </Link>
          )} */}
            {/* Logout */}
            {/* {state.loged && (
            <button onClick={() => logout()} className="menu-button">
              <span className="menu-icon">
                <i className="icon icon-logout"></i>
              </span>
              <span>Log Out</span>
            </button>
          )} */}
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
              <span>Sign In</span>
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
              <span>Sign Up</span>
            </button>
          )} */}
            {/* Cart */}
            <Link href={`/cart`} className="menu-button">
              <span className="menu-icon">
                <i className="icon icon-basket"></i>
              </span>
              <span>My Cart</span>
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
                  onClick={() => setViewLevel2(false)}
                >
                  <i className="icon icon-angle-left text-2xl mr-2"></i>
                  <h2
                    className="font-semibold"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML(activeCategory.name),
                    }}
                  ></h2>
                </div>
                {activeCategory.categories?.length > 0 &&
                  activeCategory?.categories?.map((category) => (
                    <Link
                      // href={`${
                      //   // state.admin
                      //   //   ? path + "/category/" + category.category_id
                      //   //   :
                      //   category.name.length > 0
                      //     ? "/" +
                      //       category.name
                      //         .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                      //         .replace(/\s+/g, "-") +
                      //       "/c=" +
                      //       category.category_id
                      //     : "cat/c=" + category.category_id
                      // }`}
                      href="/"
                      className=" flex justify-between  items-center border-b border-dgrey py-1"
                      key={category.name}
                    >
                      <span
                        className="font-light py-1"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHTML(category.name),
                        }}
                      ></span>
                    </Link>
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
                    className=" flex justify-between items-center border-b border-dgrey py-1"
                    key={category.name}
                  >
                    <Link
                      href="/"
                      // href={`${
                      //   // state.admin
                      //   //   ? path + "/category/" + category.category_id
                      //   //   :
                      //   category.name.length > 0
                      //     ? "/" +
                      //       category.name
                      //         .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                      //         .replace(/\s+/g, "-") +
                      //       "/c=" +
                      //       category.category_id
                      //     : "cat/c=" + category.category_id
                      // }`}
                      // to={`${path}/category/${category.category_id}`}
                      className="font-light"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHTML(category.name),
                      }}
                    ></Link>
                    <span
                      className="w-10 flex items-center justify-center"
                      onClick={() => {
                        setActiveCategory(category);
                        setViewLevel2(true);
                        handleScroll();
                      }}
                    >
                      <i className="icon icon-angle-right text-2xl text-dgrey1"></i>
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

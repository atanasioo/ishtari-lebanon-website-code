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
import { axiosServer } from "@/axiosServer";
import { useContext, useState } from "react";
import { AccountContext } from "@/contexts/AccountContext";
import buildLink from "@/urls";
import { signOut } from "next-auth/react";
import SingleProduct from "@/components/product/SingleProduct";
import Slider from "react-slick";
function MobileMenu(props) {
  const { viewMenu, categories, closeMobileMenu } = props;
  const router = useRouter();
  const [viewLevel2, setViewLevel2] = useState(false);
  const [state, dispatch] = useContext(AccountContext);
  const [activeCategory, setActiveCategory] = useState({});

  function handleScroll() {
    var myDiv = document.getElementById("scrollDiv");
    myDiv.scrollTop = 0;
  }
  // Logout
  async function logout() {
    dispatch({ type: "setLoading", payload: true });
    closeMobileMenu();
    const hostname = window.config["site-url"];
    //remove next-auth session from cookie, and clear the jwt(session) obj.
    await signOut({ redirect: false });
    //Logout from Api
    const response = await axiosServer.post(
      buildLink("logout", undefined, undefined, hostname)
    );
    checkLogin();
    Cookies.remove("api-token");
    window.location.reload();
    router.push("/");
  }

  function checkLogin() {
    dispatch({ type: "setLoading", payload: true });
    axiosServer
      .get(buildLink("login", undefined, window.innerWidth))
      .then((response) => {
        const data = response.data;

        dispatch({ type: "setShowOver", payload: false });
        if (data.customer_id > 0) {
          dispatch({ type: "setLoged", payload: true });
          dispatch({ type: "setUsername", payload: data.username });
          dispatch({ type: "setEmail", payload: data.email });
        } else {
          dispatch({ type: "setLoged", payload: false });
        }
        if (data.seller_logged !== "0") {
          setSellerId(Number(data.seller_logged));
        }
        dispatch({ type: "setLoading", payload: false });
      });
  }

  const settings = {
    slidesPerRow: 3,
    rows: 2,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesPerRow: 2,
          rows: 2,
        },
      },
    ],
    arrows: true,
    prevArrow: <CustomPrevArrows direction={"l"} />,
    nextArrow: <CustomNextArrows direction={"r"} />,
  };

  function CustomPrevArrows({ direction, onClick, style, className }) {
    return (
      <div
        style={{ ...style, padding: "2px 5px", marginLeft: "15px" }}
        onClick={onClick}
        className="mySwiper "
      >
        <div className="swiper-button-prev flex justify-center items-center cursor-pointer">
          <BsChevronLeft className="text-dblack" />
        </div>
      </div>
    );
  }

  function CustomNextArrows({ direction, onClick, style, className }) {
    return (
      <div
        style={{ ...style, padding: "2px 15px", marginRight: " 15px" }}
        onClick={onClick}
        className="mySwiper "
      >
        <div className="swiper-button-next flex justify-center items-center cursor-pointer">
          <BsChevronRight className="text-dblack" />
        </div>
      </div>
    );
  }

  return (
    <div className=" text-dblack overflow-x-hidden">
      {/* Logo */}
      <div className="flex flex-col py-3 border-b border-dgrey px-4 ">
        <div className="flex items-center justify-between">
          {Cookies.get("site-local-name") === "flo" ||
          (window !== undefined &&
            window.location.host === "flo-lebanon.com") ? (
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
        <p className=" font-semibold pt-2.5">
          Hi, We Are {window !== undefined && window.config["short-name"]}
        </p>
      </div>
      <div className="relative">
        {/* Second row */}
        <div className=" relative flex items-center justify-between py-4 px-8 border-b border-dgrey">
          {/* Home */}
          <Link
            href="/"
            className="menu-button"
            onClick={() => closeMobileMenu()}
          >
            <div className="menu-icon bg-dbase flex justify-center py-2.5 px-3 rounded-sm">
              <FaHome className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs">Home</span>
          </Link>
          {/* My account */}
          {state.loged && (
            <Link
              href={`/account/profile`}
              className="menu-button"
              onClick={() => closeMobileMenu()}
            >
              <div className="menu-icon bg-dbase flex justify-center p-2.5 rounded-sm">
                <FaUser className="w-4 h-4 text-white"></FaUser>
              </div>
              <span className="text-xs">Account</span>
            </Link>
          )}
          {/* Logout */}
          {state.loged && (
            <button onClick={() => logout()} className="menu-button">
              <div className="menu-icon bg-dbase flex justify-center p-2.5 rounded-sm">
                <ImExit className="w-4 h-4 text-white"></ImExit>
              </div>
              <span className="text-xs">Log Out</span>
            </button>
          )}
          {/* Sign in */}
          {!state.loged && (
            <button
              className="menu-button"
              onClick={() => {
                dispatch({ type: "setShowOver", payload: true });
                dispatch({ type: "setShowLogin", payload: true });
                dispatch({ type: "setShowSignup", payload: false });
              }}
            >
              <span className="menu-icon bg-dbase flex justify-center p-1.5 rounded-sm">
                <i className="icon icon-user-solid text-white"></i>
              </span>
              <span className="text-xs">Sign In</span>
            </button>
          )}
          {/* Sign up */}
          {!state.loged && (
            <button
              className="menu-button"
              onClick={() => {
                dispatch({ type: "setShowOver", payload: true });
                dispatch({ type: "setShowLogin", payload: false });
                dispatch({ type: "setShowSignup", payload: true });
              }}
            >
              <span className="menu-icon bg-dbase flex justify-center p-1.5 rounded-sm">
                <i className="icon icon-user-plus text-white"></i>
              </span>
              <span className="text-xs">Sign Up</span>
            </button>
          )}
          {/* Cart */}
          <Link
            href={`/cart`}
            className="menu-button"
            onClick={() => closeMobileMenu()}
          >
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
                className="flex items-center py-1"
                onClick={() => setViewLevel2(false)}
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
                    onClick={() => {
                      router.push(
                        `${
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
                        }`
                      );
                      closeMobileMenu();
                    }}
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

              {activeCategory?.Top_Selling_Products?.products?.length > 0 && (
                <div>
                  <div className="flex items-center mt-4 text-dblack">
                    <div className="pr-semibold cursor-pointer hover:text-dblue">
                      Explore Top Selling Products
                    </div>
                    <i className="icon icon-angle-right"></i>
                  </div>
                  <div className="w-full">
                    <Slider {...settings}>
                      {activeCategory?.Top_Selling_Products?.products
                        ?.slice(0, 10)
                        .map((item) => (
                          <div onClick={() => closeMobileMenu()}>
                            <SingleProduct
                              key={item.product_id}
                              item={item}
                              topSelling={true}
                            />
                          </div>
                        ))}
                      {activeCategory?.Top_Selling_Products?.products
                        ?.slice(10)
                        .map((item) => (
                          <div onClick={() => closeMobileMenu()}>
                            <SingleProduct
                              key={item.product_id}
                              item={item}
                              topSelling={true}
                            />
                          </div>
                        ))}
                    </Slider>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <h2 className=" text-dgrey1 text-xs mb-2">ALL CATEGORIES</h2>

            {categories?.length > 0 &&
              categories?.map((category) => (
                <div
                  className=" flex justify-between items-center border-b border-dgrey py-1.5"
                  key={category.name}
                >
                  <div
                    onClick={() => {
                      router.push(
                        `${
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
                        }`
                      );
                      closeMobileMenu();
                    }}
                    // to={`${path}/category/${category.category_id}`}
                    className="font-light"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML(category.name),
                    }}
                  ></div>
                  <span
                    className="w-12 h-7 flex items-center justify-center"
                    onClick={() => {
                      setViewLevel2(true);

                      // handleActiveCategory(category);
                      setActiveCategory(category);

                      handleScroll();
                    }}
                  >
                    <BsChevronRight className=" w-4 h-4 text-dgrey1"></BsChevronRight>
                  </span>
                </div>
              ))}
            <Link
              href={`/latest`}
              onClick={() => closeMobileMenu()}
              className=" flex justify-between items-center"
            >
              <span className="font-semibold py-2 pb-36">NEW ARRIVALS</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;

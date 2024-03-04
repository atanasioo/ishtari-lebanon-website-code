import { useState, useEffect, useContext } from "react";
import buildLink from "@/urls";
import SiteHeaders from "./site-headers";
import Link from "next/link";
import { HiMenu } from "react-icons/hi";
import TopSearch from "./top-search";
import useDeviceSize from "@/components/useDeviceSize";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { axiosServer } from "@/axiosServer";
import DesktopMenuCategories from "./desktopMenuCategories";
import Account from "@/components/account/Account";
import { useSession } from "next-auth/react";
import TopWishlist from "./TopWishlist";
import TopCart from "./TopCart";
import { AccountContext } from "@/contexts/AccountContext";
import { useRouter } from "next/router";
import CountryDropdown from "./CountryDropdown";
import { HostContext } from "@/contexts/HostContext";
import MobileMenu from "./MobileMenu";
import { useHeaderColor } from "@/contexts/HeaderContext";


function Header(props) {
  const [local, setLocal] = useState(false);
  const [width, height] = useDeviceSize();
  // const [viewLevel2, setViewLevel2] = useState(false);
  // const [activeCategory, setActiveCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const { data: session, status } = useSession();
  const [stateAcc, dispatch] = useContext(AccountContext);
  const [headerSettings, setHeaderSettings] = useState([]);
  const [sellerId, setSellerId] = useState("0");
  const router = useRouter();
  const host = useContext(HostContext);
  const { headerColor, setHeaderColor} = useHeaderColor();


  // const serverSideDomain = props.host;

  //  console.log(session);
  const [state, setState] = useState([]);
  useEffect(() => {
    // console.log(isShowHeader)
    axiosServer
      .get(
        buildLink("headerv2", undefined, undefined, window.location.host)
      )
      .then((response) => {
        setState(response.data.data);
        setHeaderSettings(response.data.header_settings);
      });
  }, []);







  useEffect(() => {
    if (router.asPath !== '/') {
      setHeaderColor('white');
    } else {
      setHeaderColor('white'); 
    }
  }, [router.asPath]);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      axiosServer
        .get(
          buildLink(
            "all_categories",
            undefined,
            undefined,
            window.location.host
          )
        )
        .then((response) => {
          setCategories(response.data.data);
        });
    }
  }, []);

  useEffect(() => {
    if (window !== undefined) {
      if (window.location.host.startsWith ("localhost:") === true) {
        setLocal(true);
      }
    }

    function checkCookies() {
      const adminToken = Cookies.get("ATDetails");
      if (typeof adminToken != "undefined") {
        // setToken(adminToken);
      }
    }
    checkCookies();
    if (window !== undefined) {
      const numbers = window.config["numbers"];
      if (numbers?.length > 0) {
        const number = numbers[Math.floor(Math.random() * numbers?.length)];
        if (Cookies.get("wtspNumber") === undefined) {
          Cookies.set("wtspNumber", number, { expires: 1 });
          dispatch({ type: "setNumber", payload: number });
        } else {
          const oldNumber = Cookies.get("wtspNumber");
          dispatch({ type: "setNumber", payload: oldNumber });
        }
        if (Cookies.get("seller_id") !== "0") {
          setSellerId(Cookies.get("seller_id"));
        }
      }
    }
  }, []);

  // const MobileMenu = dynamic(() => import("./MobileMenu"), {
  //   ssr: false, // Disable server-side rendering
  // });
  const AdminTopHeader = dynamic(() => import("./AdminTopHeader"), {
    ssr: false, // Disable server-side rendering
  });

  function closeMobileMenu() {

    dispatch({ type: "setViewMobileMenu", payload: false });

  }


  return (
    <div id="headersticky" className={` headersticky  `} >
      {/* <div className="w-full h-auto flex container ">
        <img className=" m-auto  w-full object-cover  h-14 " src="/images/newUser.png"/>
      </div> */}
      {/* {local && <SiteHeaders local={local} />} */}

      {/* Mobile Menu */}
      <div
        className={`transition-all  min-h-screen w-screen  bg-white fixed top-0  bottom-0 right-0 overflow-x-hidden z-50  ${
          stateAcc.viewMobileMenu ? "right-0" : " right-full"
        }`}
        id="scrollDiv"
      >
        <MobileMenu
          viewMenu={stateAcc.viewMobileMenu}
          categories={categories}
          closeMobileMenu={closeMobileMenu}
        />
      </div>

      <AdminTopHeader />

      <div id="headerh"  className=" max-md:bg-white md:bg-[#BE1C26]"
      style={{
        transition:"all 0.5s ease",
            backgroundColor: headerColor || "white" ,
          }}
          >
        <div 
          className="flex  items-center justify-between py-2 max-md:py-3  max-md:container   md:px-9"
        
        >
          <div className="flex items-center">
            {/* <button className="lg:hidden" onClick={() =>     dispatch({ type: "setViewMobileMenu", payload: true })}>
              <HiMenu
                className={`w-5 h-5 max-md:text-dgreyBlack md:text-white mr-1 `}
                // style={{color: "e3535e"}}
              ></HiMenu>
            </button> */}
        
            <Link
              href="/"
              className="header-logo flex justify-start md:justify-center lg:justify-start"
              onClick={(e) => {
                // to prevent the unsmooth behavior when clicking on the logo when you're already in the homepage
                if (router.pathname === "/") {
                  e.preventDefault();
                }
              }}
            >
              {/* {window?.location?.host?.indexOf("flo") > -1 ? (
                <img
                  src={"/images/logo-flo-orange.png"}
                  width={110}
                  height={32}
                  alt="flo-logo"
                  // style={{ width: "80%", height: "auto" }}
                />
              ) : window?.location.host.indexOf("ishtari") > -1 ||
              window?.location.host.indexOf("next") > -1 ? ( */}
                <>
                  <img
                    className="hidden mobile:block"
                    src="/images/logo/logo-white.png"
                    width={130}
                    height={32}
                    alt="ishtari-logo"
                    // style={{ width: "80%", height: "auto" }}
                  />
                  <img
                    className="mobile:hidden"
                    src="/images/logo/logo-dblack.png"
                    width={100}
                    height={25}
                    alt="ishtari-logo"
                    // style={{ width: "78%", height: "auto" }}
                  />
                </>
              {/* ) : window.location.host.indexOf("energy") > -1 ? (
                <>
                  <img
                    className="hidden mobile:block"
                    src="/images/logo/logo-redd.png"
                    width={150}
                    height={32}
                    alt="ishtari-logo"
                    // style={{ width: "80%", height: "auto" }}
                  />
                  <img
                    className="mobile:hidden"
                    src="/images/logo/logo-dblack2
                  .png"
                    width={96}
                    height={40}
                    alt="ishtari-logo"
                    // style={{ width: "78%", height: "auto" }}
                  />
                </>
              ) : Cookies.get("site-local-name") === "ishtari" ||
                Cookies.get("site-local-name") === "ishtari-ghana" ? (
                <>
                  <img
                    className="hidden mobile:block"
                    src="/images/logo/logo-redd.png"
                    width={150}
                    height={32}
                    alt="ishtari-logo"
                    // style={{ width: "80%", height: "auto" }}
                  />
                  <img
                    className="mobile:hidden"
                    src="/images/logo/logo-dblack2.png"
                    width={96}
                    height={40}
                    alt="ishtari-logo"
                    // style={{ width: "78%", height: "auto" }}
                  />
                </>
              ) : (
                <LogoClient host={host.host} />
              )} */}
            </Link>
            <div className="">
            <CountryDropdown  host={host.host} />
            </div>
          </div>

          <div className="flex justify-end items-center flex-1">
            <TopSearch />

            <div className="flex   items-center">
        

              {stateAcc.isSeller && (
                <div>
                  <Link
                    className="hidden md:block mx-2 lg:border-r md:mr-5 lg:border-dplaceHolder text-white pr-3 md:pr-5 capitalize"
                    // href={`https://www.ishtari.com/index.php?route=seller_report/kt_dashboard&sid=${sellerId}`}
                    // href={`https://www.ishtari.com/seller_report/home`}
                    href="/seller_report"
                  >
                    seller dashboard
                  </Link>
                </div>
              )}

              <Account />
              {stateAcc.loged && <div className=" max-md:hidden"> <TopWishlist /></div>}
             <div ><TopCart /></div> 
            </div>
          </div>
        </div>
      </div>

      <DesktopMenuCategories header_categories={state} local={local} headerSettings={headerSettings} />
    </div>
  );
}

export default Header;

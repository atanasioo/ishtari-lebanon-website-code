import { useState, useEffect, useContext } from "react";
import _axios from "@/axios";
import buildLink from "@/urls";
import SiteHeaders from "./site-headers";
import Image from "next/image";
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
import LogofloOrange from "/public/images/logo-flo-orange.png";
import { AccountContext } from "@/contexts/AccountContext";
import { useRouter } from "next/router";
import CountryDropdown from "./CountryDropdown";
import { HostContext } from "@/contexts/HostContext";
import LogoClient from "@/components/LogoClient";
import MobileMenu from "./MobileMenu";
import { useHeaderColor } from "@/contexts/HeaderContext";

function Header(props) {
  const [local, setLocal] = useState(false);
  const [width, height] = useDeviceSize();
  const [viewMenu, setViewMenu] = useState(false);
  // const [viewLevel2, setViewLevel2] = useState(false);
  // const [activeCategory, setActiveCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const { data: session, status } = useSession();
  const [stateAcc, dispatch] = useContext(AccountContext);
  const [sellerId, setSellerId] = useState("0");
  const router = useRouter();
  const host = useContext(HostContext);
  const { headerColor, setHeaderColor } = useHeaderColor();


  const serverSideDomain = props.host;

  //  console.log(session);
  const [state, setState] = useState([]);
  useEffect(() => {
    axiosServer
      .get(
        buildLink("headerv2", undefined, undefined, window.config["site-url"])
      )
      .then((response) => {
        setState(response.data.data);
      });
  }, []);

  useEffect(() => {
    if (router.asPath !== '/') {
      setHeaderColor('white');
    } else {
      setHeaderColor('headerColor'); 
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
            window.config["site-url"]
          )
        )
        .then((response) => {
          setCategories(response.data.data);
        });
    }
  }, []);

  useEffect(() => {
    if (window !== undefined) {
      if (window.location.host === "localhost:3000") {
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
    setViewMenu(false);
  }


  return (
    <div>
      {local && <SiteHeaders local={local} />}

      {/* Mobile Menu */}
      <div
        className={`transition-all  min-h-screen w-screen bg-white fixed top-0  bottom-0 right-0 overflow-x-hidden z-50  ${
          viewMenu ? "right-0" : " right-full"
        }`}
        id="scrollDiv"
      >
        <MobileMenu
          viewMenu={viewMenu}
          categories={categories}
          closeMobileMenu={closeMobileMenu}
        />
      </div>

      <AdminTopHeader />

      <div>
        <div
          className="flex items-center justify-between py-4 h-22 container"
          style={{
            backgroundColor: headerColor || "white" ,
          }}
        >
          <div className="flex items-center">
            <button className="lg:hidden" onClick={() => setViewMenu(true)}>
              <HiMenu
                className={` w-6 h-6 text-dblack mr-1 `}
                // style={{color: "e3535e"}}
              ></HiMenu>
            </button>
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
              {serverSideDomain.indexOf("flo") > -1 ? (
                <img
                  src={"/images/logo-flo-orange.png"}
                  width={110}
                  height={32}
                  alt="flo-logo"
                  priority={true}
                  // style={{ width: "80%", height: "auto" }}
                />
              ) : serverSideDomain.indexOf("ishtari") > -1 ||
                serverSideDomain.indexOf("next") > -1 ? (
                <>
                  <img
                    className="hidden mobile:block"
                    src="/images/logo/logo-redd.png"
                    width={150}
                    height={32}
                    alt="ishtari-logo"
                    priority={true}
                    // style={{ width: "80%", height: "auto" }}
                  />
                  <img
                    className="mobile:hidden"
                    src="/images/logo/logo-dblack2.png"
                    width={96}
                    height={20}
                    alt="ishtari-logo"
                    priority={true}
                    // style={{ width: "78%", height: "auto" }}
                  />
                </>
              ) : serverSideDomain.indexOf("energy") > -1 ? (
                <>
                  <img
                    className="hidden mobile:block"
                    src="/images/logo/logo-redd.png"
                    width={150}
                    height={32}
                    alt="ishtari-logo"
                    priority={true}
                    // style={{ width: "80%", height: "auto" }}
                  />
                  <img
                    className="mobile:hidden"
                    src="/images/logo/logo-dblack2
                  .png"
                    width={96}
                    height={40}
                    alt="ishtari-logo"
                    priority={true}
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
                    priority={true}
                    // style={{ width: "80%", height: "auto" }}
                  />
                  <img
                    className="mobile:hidden"
                    src="/images/logo/logo-dblack2.png"
                    width={96}
                    height={40}
                    alt="ishtari-logo"
                    priority={true}
                    // style={{ width: "78%", height: "auto" }}
                  />
                </>
              ) : (
                <LogoClient host={host.host} />
              )}
            </Link>
          </div>

          <div className="flex justify-end items-center flex-1">
            <TopSearch />

            <div className="flex  items-center">
              <CountryDropdown host={host.host} />

              {stateAcc.isSeller && (
                <div>
                  <Link
                    className="hidden md:block mx-2 lg:border-r md:mr-5 lg:border-dplaceHolder pr-3 md:pr-5 capitalize"
                    // href={`https://www.ishtari.com/index.php?route=seller_report/kt_dashboard&sid=${sellerId}`}
                    // href={`https://www.ishtari.com/seller_report/home`}
                    href="/seller_report"
                  >
                    seller dashboard
                  </Link>
                </div>
              )}

              <Account />
              {stateAcc.loged && <TopWishlist />}
              <TopCart />
            </div>
          </div>
        </div>
      </div>

      <DesktopMenuCategories header_categories={state} local={local} />
    </div>
  );
}

export default Header;

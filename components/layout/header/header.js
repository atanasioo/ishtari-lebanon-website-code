import { useState, useEffect, useContext } from "react";
import _axios from "@/axios";
import buildLink from "@/urls";
import SiteHeaders from "./site-headers";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineShopping, AiOutlineUser } from "react-icons/ai";
import { FiChevronDown, FiMenu } from "react-icons/fi";
import { HiMenu } from "react-icons/hi";
import TopSearch from "./top-search";
import useDeviceSize from "@/components/useDeviceSize";
import dynamic from "next/dynamic";
import ImageFilter from "react-image-filter/lib/ImageFilter";
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

function Header(props) {
  const [local, setLocal] = useState(false);
  const [width, height] = useDeviceSize();
  const [viewMenu, setViewMenu] = useState(false);
  const [viewLevel2, setViewLevel2] = useState(false);
  const [activeCategory, setActiveCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const { data: session, status } = useSession();
  const [stateAcc, dispatch] = useContext(AccountContext);
  const [sellerId, setSellerId] = useState("0");
  const router = useRouter();

  console.log(router);

  const serverSideDomain = props.host;

  console.log(serverSideDomain);

  //  console.log(session);
  const [state, setState] = useState([]);
  useEffect(() => {
    axiosServer
      .get(buildLink("headerv2", undefined, undefined))
      .then((response) => {
        setState(response.data.data);
      });
  }, []);

  useEffect(() => {
    if (width < 650) {
      axiosServer
        .get(buildLink("all_categories", undefined, undefined))
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
        s;
        setToken(adminToken);
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

  // const DesktopMenuCategories = dynamic(
  //   () => import("./DesktopMenuCategories"),
  //   {
  //     ssr: false, // Disable server-side rendering
  //   }
  // );
  const MobileMenu = dynamic(() => import("./MobileMenu"), {
    ssr: false, // Disable server-side rendering
  });
  const AdminTopHeader = dynamic(() => import("./AdminTopHeader"), {
    ssr: false, // Disable server-side rendering
  });
  const LogoClient = dynamic(() => import("@/components/LogoClient"), {
    ssr: false, // Disable server-side rendering
  });
  const CountryDropdown = dynamic(() => import("./CountryDropdown"), {
    ssr: false, // Disable server-side rendering
  });

  function closeMobileMenu() {
    setViewMenu(false);
  }
  function closeLevel2() {
    setViewLevel2(false);
  }

  function handleActiveCategory(category) {
    setActiveCategory(category);
    setViewLevel2(true);
  }

  return (
    <div>
      {local && <SiteHeaders local={local} />}

      <MobileMenu
        viewMenu={viewMenu}
        viewLevel2={viewLevel2}
        activeCategory={activeCategory}
        categories={categories}
        closeMobileMenu={closeMobileMenu}
        handleActiveCategory={handleActiveCategory}
        closeLevel2={closeLevel2}
      />

      <AdminTopHeader />

      <div className="flex items-center justify-between my-4 h-14 container">
        <div className="flex items-center">
          <button className="lg:hidden" onClick={() => setViewMenu(true)}>
            <HiMenu
              className={` w-6 h-6 text-dblack mr-1 `}
              // style={{color: "e3535e"}}
            ></HiMenu>
          </button>
          <Link
            href="/"
            className="header-logo flex justify-center lg:justify-start"
          >
            {serverSideDomain.indexOf("flo")  > -1 ? (
              <Image
                src={LogofloOrange}
                width={width > 768 ? 130 : 100}
                height={width > 768 ? 130 : 100}
                alt="ishtari-logo"
                priority={true}
                style={{ width: "80%", height: "auto" }}
              />
            ) : serverSideDomain.indexOf("ishtari")  > -1 ? (
              <>
                <Image
                  className="hidden mobile:block"
                  src="/images/logo/logo-red.png"
                  width={130}
                  height={130}
                  alt="ishtari-logo"
                  priority={true}
                  style={{ width: "80%", height: "auto" }}
                />

                <ImageFilter
                  className="h-5 w-24 mr-5 mobile:hidden"
                  image={"/images/logo/logo-white.png"}
                  filter={"duotone"} // see docs beneath
                  colorOne={[96, 96, 96]}
                  colorTwo={[65, 69, 81]}
                />
              </>
            ) :   serverSideDomain.indexOf("energy")  > -1  ? (
              <>
                <Image
                  className="hidden mobile:block"
                  src="/images/logo/logo-red.png"
                  width={130}
                  height={130}
                  alt="ishtari-logo"
                  priority={true}
                  style={{ width: "80%", height: "auto" }}
                />

                <ImageFilter
                  className="h-5 w-24 mr-5 mobile:hidden"
                  image={"/images/logo/logo-white.png"}
                  filter={"duotone"} // see docs beneath
                  colorOne={[96, 96, 96]}
                  colorTwo={[65, 69, 81]}
                />
              </>
            ) : Cookies.get("site-local-name") === "ishtari" ||
              Cookies.get("site-local-name") === "ishtari-ghana" ? (
              <>
                <Image
                  className="hidden mobile:block"
                  src="/images/logo/logo-red.png"
                  width={130}
                  height={130}
                  alt="ishtari-logo"
                  priority={true}
                  style={{ width: "80%", height: "auto" }}
                />

                <ImageFilter
                  className="h-5 w-24 mr-5 mobile:hidden"
                  image={"/images/logo/logo-white.png"}
                  filter={"duotone"} // see docs beneath
                  colorOne={[96, 96, 96]}
                  colorTwo={[65, 69, 81]}
                />
              </>
            ) : (
              <LogoClient />
            )}
          </Link>
        </div>

        <TopSearch />

        <div className="flex  items-center">
          <CountryDropdown />
          

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
          {session?.user?.isLoggedIn && <TopWishlist />}
          <TopCart />
        </div>
      </div>

      <DesktopMenuCategories header_categories={state} local={local} />
    </div>
  );
}

export default Header;

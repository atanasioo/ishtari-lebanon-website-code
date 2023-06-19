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



  //  console.log(session);
  const [state, setState] = useState([]);
  useEffect(() => {
    axiosServer
      .get(buildLink("headerv2", undefined, undefined))
      .then((response) => {
        console.log(response.data);
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
    if (window.location.host === "localhost:3000") {
      setLocal(true);
    }
    if (localStorage.getItem("site-local-name") === "flo") {
    }
    function checkCookies() {
      const adminToken = Cookies.get("ATDetails");
      if (typeof adminToken != "undefined") {s
        setToken(adminToken);
      }

    }
    checkCookies();
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
            {Cookies.get("site-local-name") === "flo" ||
            Cookies.get("site-local-name") === "flo-bey" ? (
              <Image
                src={LogofloOrange}
                width={width > 768 ? 130 : 100}
                height={width > 768 ? 130 : 100}
                alt="ishtari-logo"
                priority={true}
                style={{ width: "80%", height: "auto" }}
              />
            ) : (
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
            )}
          </Link>
        </div>

        <TopSearch />
        <div className="flex  items-center">
          <div className="country-flag flex justify-center items-center lg:border-r md:mr-5 lg:border-dplaceHolder pr-3 md:pr-5 cursor-pointer">
            <img
              className="h-4 lg:w-7 lg:h-5 "
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAhCAYAAACbffiEAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAMrSURBVFhH7VhbSFRRFD1iVBj1I/QVhJMoaQ1mKSaBmJmWaWpgD7KHZlmJWoL0UMtCRSU0ykcPx2cPMsvSKZ/5IiM1K0clMUMkKzXTNAMtXe17vR8JfkhzLgwxCxb3nn3Onrlr1tlnZg8bXGaK/4F6IbpGvRBdo17IXPl1lpgcZP1sPuRiH/GHwRLxOts8T7JfmjbIRXT0QF2uAj4MzDrPkwwy4uXwe7DUVfCqj5ci8kFWIYY528ByiZmbwJLNoSwMwMjET2mWL2QRMjk1BdunYWCqjVA88INrRQQsio6BXVXiaGOatIovZBHS9KUFxnkeONGswkUiS7eDZdFxuFVE4krbfTR/65JW8gN3IUH1SWCXlmN3XSLYtfWwLzuNwIZ0mJAzZgUHYPkoUFrJF1yFJL5SIfxNLlqGuuFUEg6W7QqWRfWR4QCb4mB4VZ4TxbF0W5R8ei1l8QF3R+r7NGBJK8BytkBRsB+OZafofitYnjuJcsbJpgw4lJ9BDG2xofFRKUt7cBXC0qxhku+LSKEuVE5Q0CnFVI642Vk6fXrd8hTdURYHIaQ6BqGN6VKm9uAmRHHXBwMTY/CoisbBugR6YEdywWPaiUxnErEd80jIXmEuZQ2sCg9LmXzA1REHdSi5slZ0I6TxOhbd9sTOqgswEJwgR9wrorBBHYy+8RGsfkzHcYoSLcM9UrZ24CKkc/QzWLQRdtXGI7e7hsTYwO5JKFY+9INFoT8VvVAj5E6qNdXJZqohM4SRUAFdlMsDWgsRCtafjtwpuk/W3AO7bE41kgWXykh6aBdxSwkilubvEdf718TB+9l5eFdGid/2pR8bxLi24OJI2/de+FABx7bmS5FpsBQrsDs7aFu5waPirBSdCWXBPtT1t0ujfwfXGvkbe2rjxE+cpa0THTGkopcTsgjxfR4Ls6IAaURvcsMOZuojsK+OkCL8wa0fmdS0o6/pBRLUSdSH0G+pzl78phhaO6gf6cWQ5i1Vdg8OZQcD77oxMctraENuHaLQBQ4xI4yxxRhgC2bMCeNBtlC8Thoay9Ixcu3Z59Kfy9XD6/9F0TXqhega9UJ0i6b4A/QB3t+zIyKhAAAAAElFTkSuQmCC"
              alt="Lebanon"
            />{" "}
            {width > 650 && <div className="flex ml-2"> Lebanon</div>}
            <FiChevronDown className="hidden md:block w-5 " />
          </div>
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

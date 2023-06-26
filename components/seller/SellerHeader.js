import React, { useEffect, useState, useContext } from "react";
import {
  AiOutlineDashboard,
  AiOutlineInbox,
  AiOutlineShopping,
} from "react-icons/ai";
import { GiChart } from "react-icons/gi";
import { HiOutlinePresentationChartLine } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlineSetting, AiOutlineUser } from "react-icons/ai";
import { axiosServer } from "@/axiosServer";
import { AccountContext } from "@/contexts/AccountContext";
import Cookies from "js-cookie";
import buildLink, { path } from "@/urls";
import { MdOutlineAssignmentReturn } from "react-icons/md";
import useDeviceSize from "../useDeviceSize";
import { signOut } from "next-auth/react";

const SellerHeader = ({ toggleMenuu, showMenu, image, sellerName }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [name, setName] = useState(sellerName);
  const [sellerImage, setSellerImage] = useState(image);
  const [state, dispatch] = useContext(AccountContext);
  const [sellerId, setSellerId] = useState("0");
  const [width] = useDeviceSize();
  const router = useRouter();

  useEffect(() => {
    console.log(name);
    if (width > 768 && name === undefined && showDropdown) {
      axiosServer
        .get(
          `https://www.ishtari.com/motor/v2/index.php?route=seller_report/profile`
        )
        .then((response) => {
          setName(response.data.data.seller_firstname);
          setSellerImage(response.data.data.image);
        });
    }
  }, [showDropdown]);

  // Logout
  async function logout() {
    dispatch({ type: "setLoading", payload: true });
    const hostname = window.config['site-url'];
    setShowDropdown(false);
    //remove next-auth session from cookie, and clear the jwt(session) obj.
    await signOut({ redirect: false });
    //Logout from Api
    const response = await axiosServer.post(
      buildLink("logout", undefined, undefined, hostname)
    );
    checkLogin();
    dispatch({ type: "setSeller", payload: false });
    Cookies.remove("seller_id");
    Cookies.remove("api-token");
    router.push("/");
    // window.location.reload();
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

  return (
    <div className="w-full">
      {width > 1025 ? (
        <div className="bg-white  aside-animation  w-full h-1/3 flex justify-between items-center py-2 overflow-x-hidden">
          <div
            className="flex items-center ml-6 cursor-pointer hover:bg-dinputBorder rounded hover:text-dblue py-2 px-4"
            onClick={() => toggleMenuu()}
          >
            <p className="mr-2">Menu</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
            >
              <polygon points="12 17.414 3.293 8.707 4.707 7.293 12 14.586 19.293 7.293 20.707 8.707 12 17.414" />
            </svg>
          </div>
          <div
            className={`hover:bg-dinputBorder h-12 py-1 pl-6 pr-2 flex justify-end select-none rounded-3xl`}
            style={{
              background: showDropdown ? "rgb(247, 247, 250)" : "white",
            }}
          >
            <button
              className="rounded-full"
              onClick={() => {
                setShowDropdown(!showDropdown);
              }}
            >
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAMAAABmmnOVAAAAMFBMVEXk5ueutLe9wsTn6eqrsbTe4eLHy83b3t+yuLrX2tzq7O2mrbDN0dO2u77T1tjAxcfTye1YAAAC7UlEQVR4nO2a227DIAxAA4YkJED+/28HaZtlywo2xbSTONK0t+bI2FwMw9DpdDqdTqfT6XQ6nX8AwALamEmH//Aeg8GMTq3ruv9JO7X3gGkTQokDpcRsdVMN0FKdDB4iYmwXDYBxvRjcNfzSyMGIaxQODdnGwT5XiBZzg8xY0g6RidsCxqyDUMwWmbF4WGhWhwnjIMTMKaFRCrFG+AYEJC4QwcJyWYDHOgQLLokF7yDUxmOBq4zDgqlCZoKDUCNHKMBQAhFgcAilQXNQlkECO0ccEo5hPAj1ebeo7wAbWcJUD8VCqo1dgqE+qIHg2GQh188z1TOTsm4cVJcgzdk31soOXaJLXCUKqqP+vP0J88RnzJgLORAMa8dHrKIfsZ8YJqIDR14W7DE5JKjjwXPwoAWC5wiG6Y+cJJhOYECRYDqLkhax6ovXt4VDDwbLSfSGRoaC5fT1AF2mvJ0z1ArCsWr8sEC0rZRn76ZmY8HvkJ+zuMfibpHKzib99d1ikM/uOzjnh4uGmf+IhlKy6QUUgHc/L6CUUhv7HcOFRVsp1Bo+rtZVudG/51YyfFRP3npvphibdxiEr8KJ1hr7vbAfN+nmPRfinaiT22iNhiYmEL4/utun1a/aiITc0KwxCb893QRSE2YIy2b2hOFQWMw2J79/FpF+qa8BesQJHCKrNFWHBQYjE7fCT+Mx23qjAsbRovDtMds60ViMe7JcoTSEff0KPz5SKFe4RePVDQZYei5cNbZXUgMG97pCtHjhDr+on/1Eo3SzQzsA5yxcmQO5SZW2KNp81kmHM/TEqO9At+BwCEdUigX+jQLVguBQNydP4J+YVJwffkN4YsLmQDgto5tCRaDSouSOhwByQDgVooVBBKLmivEnc36XQ+qYFpHvojBnxE4+K3hLYyfb9i649KNLZHY4/GkZyfV7G4yGyE1Y1CdEZSiflKA+6CqUSCdFgwKNJIu0TV6Gc0hq0gQr25AcDmhEyqHT6XQ6H84XcCwiZqxo0WkAAAAASUVORK5CYII="
                alt=""
                className="rounded-full h-10 select-none pointer-events-none"
                width={"40px"}
                height={"40px"}
              />
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-12"></div>
      )}
      {showMenu && (
        <div className="bg-white z-50 aside-animation rounded flex shadow-xl absolute ml-3 w-3/4 top-16">
          <div className="py-4  border-r border-dinputBorder leading-loose w-full text-center">
            <p>Dashboard</p>
            <Link
              href={`/seller_report`}
              className="flex items-center justify-center cursor-pointer w-full hover:bg-dgrey rounded  hover:text-dblue py-2"
            >
              <AiOutlineDashboard />
              <p className="font-light text-sm ml-2">Dashboard</p>
            </Link>
          </div>
          <div className="py-4  border-r border-dinputBorder leading-loose w-full text-center">
            <p>Products</p>
            <Link
              href={`/seller_report/products`}
              className="flex items-center justify-center cursor-pointer w-full hover:bg-dgrey rounded  hover:text-dblue py-2"
            >
              <AiOutlineInbox />
              <p className="font-light text-sm ml-2">Products</p>
            </Link>
          </div>

          <div className="py-4  border-r border-dinputBorder leading-loose w-full text-center">
            <p>Orders</p>
            <Link
              href={`/seller_report/orders`}
              className="flex items-center justify-center cursor-pointer w-full hover:bg-dgrey rounded  hover:text-dblue py-2"
            >
              <AiOutlineShopping />

              <p className="font-light text-sm ml-2"> Orders</p>
            </Link>
          </div>
          <div className="py-4  border-r border-dinputBorder leading-loose w-full text-center">
            <p>Return </p>
            <Link
              href={`/seller_report/returnOrders`}
              className="flex items-center justify-center cursor-pointer w-full hover:bg-dgrey rounded  hover:text-dblue py-2"
            >
              <MdOutlineAssignmentReturn />
              `` <p className="font-light text-sm ml-2">Return Orders</p>
            </Link>
          </div>
          <div className="py-4  border-r border-dinputBorder leading-loose w-full text-center">
            <p>Accounting</p>
            <Link
              href={`/seller_report/accounting`}
              className="flex items-center justify-center cursor-pointer w-full hover:bg-dgrey rounded  hover:text-dblue py-2"
            >
              <GiChart />
              <p className="font-light text-sm ml-2">Accounting</p>
            </Link>
          </div>
          <div className="py-4  leading-loose w-full text-center">
            <p>Reports</p>
            <Link
              href={`/seller_report/reports`}
              className="flex items-center justify-center cursor-pointer w-full hover:bg-dgrey rounded  hover:text-dblue py-2"
            >
              <HiOutlinePresentationChartLine />
              <p className="font-light text-sm ml-2">Reports</p>
            </Link>
          </div>
        </div>
      )}

      {showDropdown && name && (
        <div
          className="w-60 z-20 bg-white h-64 rounded aside-animation flex shadow-xl absolute ml-3 top-16 right-1"
          style={{
            boxShadow: "0px 0px 50px 0px rgb(82 63 105 / 15%)",
          }}
        >
          <div className="w-full h-full relative">
            <div className="w-full">
              <img
                className="w-full h-16"
                alt="seller_header"
                src={"/images/head_seller.jpg"}
              />
            </div>
            <div className="flex items-end gap-4 absolute top-9 left-6">
              {" "}
              <img className="rounded-full h-14 w-14" src={sellerImage} />
              <p className="text-xs mb-1" style={{ color: "#74788d" }}>
                {name}
              </p>{" "}
            </div>{" "}
            <div className="w-full flex justify-start pl-5 pb-5 border-b border-dplaceHolder">
              <div className="flex justify-center flex-col gap-3 mt-12 font-light text-d15">
                <Link
                  href={`/seller_report`}
                  className="flex justify-start items-center gap-3"
                >
                  <AiOutlineUser style={{ color: "#a2a5b9" }} />
                  <span> Dashboard</span>
                </Link>
                <Link
                  href={`/seller_report/editSeller`}
                  className="flex justify-start items-center gap-3"
                >
                  <AiOutlineSetting style={{ color: "#a2a5b9" }} />
                  <span>Profile Setting</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center mt-4 pl-5">
              <button
                className="uppercase text-xs pr-semibold px-4 py-2 rounded "
                style={{
                  color: "#5867dd",
                  background: "rgba(93, 120, 255, 0.1)",
                }}
                onClick={() => logout()}
              >
                sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerHeader;

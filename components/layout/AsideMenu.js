import React, { useEffect, useState } from "react";
import buildLink, { path } from "@/urls";
import {
  AiOutlineDashboard,
  AiOutlineInbox,
  AiOutlineShopping,
} from "react-icons/ai";
import { MdOutlineAssignmentReturn } from "react-icons/md";
import { GiChart } from "react-icons/gi";
import { HiOutlinePresentationChartLine } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSellerContext } from "@/contexts/SellerContext";
import useDeviceSize from "../useDeviceSize";
const AsideMenu = () => {
  const [width] = useDeviceSize();
  const [route, setRoute] = useState("");
  const { isUserSeller, setIsUserSeller, toggle, toggleMenu, smallMenuToggle } =
    useSellerContext();
  const router = useRouter();
  const path = "";

  useEffect(() => {
    setRoute(router.pathname.split("/")[2]);
  }, [router]);

  return width > 1025 ? (
    <div
      className={`flex flex-col aside-animation ${
        toggle ? "w-64" : "w-20"
      } fixed top-0 bottom-0 left-0 z-50 max-w-full bg-daside ${
        router.pathname === "/seller_report/printOrderInvoice" ? "hidden" : ""
      } `}
    >
      <div className="flex max-w-full bg-daside aside-animation justify-between items-center flex-row aside-brand">
        {toggle && (
          <div>
            <Link href={`/`} onClick={() => setIsUserSeller(false)}>
              <img
                alt="Logo"
                className="h-8"
                src="https://www.ishtari.com/catalog/view/javascript/keen_seller_report/assets/media/logos/ishtari-logo.png"
              />
            </Link>
          </div>
        )}
        <div className=" flex justify-end box-border">
          <button
            className="inline-block hover-animation relative overflow-hidden m-0 p-0 cursor-pointer bg-none border-0 w-6 h-6 aside-animation"
            onClick={toggleMenu}
          >
            <span
              className={`bg-white ${
                toggle ? "menu-active" : "menuSellerButton"
              } `}
            ></span>
          </button>
        </div>
      </div>
      <div className="aside-menu h-full">
        <ul className="aside-menu-list">
          <li>
            {" "}
            <Link
              className={route === "home" && `active-link`}
              href={`${path}/seller_report`}
            >
              <AiOutlineDashboard />
              {toggle && <span> Dashboard </span>}
            </Link>
          </li>
          <li>
            {" "}
            <Link
              className={
                (route === "products" || route === "EditProduct") &&
                `active-link`
              }
              href={`${path}/seller_report/products`}
            >
              {" "}
              <AiOutlineInbox />
              {toggle && <span> Products </span>}
              
            </Link>
          </li>
          <li>
            <Link
              className={
                (route === "orders" || route === "OrderDetails") &&
                `active-link`
              }
              href={`${path}/seller_report/orders`}
            >
              {" "}
              <AiOutlineShopping />
              {toggle && <span> Orders </span>}
            </Link>
          </li>
          <li>
            <Link
              className={
                (route === "returnOrders" || route === "ReturnOrderDetails") &&
                `active-link`
              }
              href={`${path}/seller_report/returnOrders`}
            >
              {" "}
              <MdOutlineAssignmentReturn />
              {toggle && <span> Return Orders </span>}
            </Link>
          </li>
          <li>
            <Link
              className={route === "accounting" && `active-link`}
              href={`${path}/seller_report/accounting`}
            >
              {" "}
              <GiChart />
              {toggle && <span> Accounting </span>}
            </Link>
          </li>
          <li>
            <Link
              className={
                (route === "reports" || route === "SoldProductDetails") &&
                `active-link`
              }
              href={`${path}/seller_report/reports`}
            >
              {" "}
              <HiOutlinePresentationChartLine />
              {toggle && <span> Reports </span>}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  ) : (
    <div className=" bg-daside fixed top-0 right-0 left-0 z-50 h-14 pr-4 pl-4 box-border flex justify-between">
      <div
        className={`aside-small-menu fixed ${
          smallMenuToggle ? "-left-72" : "left-0"
        } max-w-full bg-daside z-50 overscroll-y-auto w-60 top-0 bottom-0 h-full aside-animation mb-4`}
      >
        <Link
          href={`/seller_report/edit`}
          className="flex justify-center items-center p-4 rounded-full"
          onClick={toggleMenu}
        >
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAMAAABmmnOVAAAAMFBMVEXk5ueutLe9wsTn6eqrsbTe4eLHy83b3t+yuLrX2tzq7O2mrbDN0dO2u77T1tjAxcfTye1YAAAC7UlEQVR4nO2a227DIAxAA4YkJED+/28HaZtlywo2xbSTONK0t+bI2FwMw9DpdDqdTqfT6XQ6nX8AwALamEmH//Aeg8GMTq3ruv9JO7X3gGkTQokDpcRsdVMN0FKdDB4iYmwXDYBxvRjcNfzSyMGIaxQODdnGwT5XiBZzg8xY0g6RidsCxqyDUMwWmbF4WGhWhwnjIMTMKaFRCrFG+AYEJC4QwcJyWYDHOgQLLokF7yDUxmOBq4zDgqlCZoKDUCNHKMBQAhFgcAilQXNQlkECO0ccEo5hPAj1ebeo7wAbWcJUD8VCqo1dgqE+qIHg2GQh188z1TOTsm4cVJcgzdk31soOXaJLXCUKqqP+vP0J88RnzJgLORAMa8dHrKIfsZ8YJqIDR14W7DE5JKjjwXPwoAWC5wiG6Y+cJJhOYECRYDqLkhax6ovXt4VDDwbLSfSGRoaC5fT1AF2mvJ0z1ArCsWr8sEC0rZRn76ZmY8HvkJ+zuMfibpHKzib99d1ikM/uOzjnh4uGmf+IhlKy6QUUgHc/L6CUUhv7HcOFRVsp1Bo+rtZVudG/51YyfFRP3npvphibdxiEr8KJ1hr7vbAfN+nmPRfinaiT22iNhiYmEL4/utun1a/aiITc0KwxCb893QRSE2YIy2b2hOFQWMw2J79/FpF+qa8BesQJHCKrNFWHBQYjE7fCT+Mx23qjAsbRovDtMds60ViMe7JcoTSEff0KPz5SKFe4RePVDQZYei5cNbZXUgMG97pCtHjhDr+on/1Eo3SzQzsA5yxcmQO5SZW2KNp81kmHM/TEqO9At+BwCEdUigX+jQLVguBQNydP4J+YVJwffkN4YsLmQDgto5tCRaDSouSOhwByQDgVooVBBKLmivEnc36XQ+qYFpHvojBnxE4+K3hLYyfb9i649KNLZHY4/GkZyfV7G4yGyE1Y1CdEZSiflKA+6CqUSCdFgwKNJIu0TV6Gc0hq0gQr25AcDmhEyqHT6XQ6H84XcCwiZqxo0WkAAAAASUVORK5CYII="
            alt=""
            className="rounded-full h-10"
            width={"40px"}
            height={"40px"}
          />
        </Link>
        <ul className="m-0 py-4 w-full text-dplaceHolder">
          <li className=" flex flex-grow flex-row w-full">
            {" "}
            <Link
              className={`${
                route === "home" && `active-link`
              } w-full flex items-stretch flex-grow relative pt-2 pb-2 pr-8 pl-8`}
              href={`/seller_report/home`}
              onClick={toggleMenu}
            >
              <AiOutlineDashboard />
              <span> Dashboard </span>
            </Link>
          </li>
          <li>
            {" "}
            <Link
              className={`${
                (route === "products" || route === "EditProducts") &&
                `active-link`
              } w-full flex items-stretch flex-grow relative pt-2 pb-2 pr-8 pl-8`}
              href={`/seller_report/products`}
              onClick={toggleMenu}
            >
              {" "}
              <AiOutlineInbox />
              <span> Products </span>
            </Link>
          </li>
          <li>
            <Link
              className={`${
                (route === "orders" || route === "OrderDetails") &&
                `active-link`
              } w-full flex items-stretch flex-grow relative pt-2 pb-2 pr-8 pl-8`}
              href={`/seller_report/orders`}
              onClick={toggleMenu}
            >
              {" "}
              <AiOutlineShopping />
              <span> Orders </span>
            </Link>
          </li>
          <li>
            <Link
              className={`${
                (route === "returnOrders" || route === "ReturnOrderDetails") &&
                `active-link`
              } w-full flex items-stretch flex-grow relative pt-2 pb-2 pr-8 pl-8`}
              href={`/seller_report/returnOrders`}
              onClick={toggleMenu}
            >
              {" "}
              <AiOutlineShopping />
              <span> Return Orders </span>
            </Link>
          </li>
          <li>
            <Link
              className={`${
                route === "accounting" && `active-link`
              } w-full flex items-stretch flex-grow relative pt-2 pb-2 pr-8 pl-8`}
              href={`/seller_report/accounting`}
              onClick={toggleMenu}
            >
              {" "}
              <GiChart />
              <span> Accounting </span>
            </Link>
          </li>
          <li>
            <Link
              className={`${
                (route === "reports" || route === "SoldProductDetails") &&
                `active-link`
              } w-full flex items-stretch flex-grow relative pt-2 pb-2 pr-8 pl-8`}
              href={`/seller_report/reports`}
              onClick={toggleMenu}
            >
              {" "}
              <HiOutlinePresentationChartLine />
              <span> Reports </span>
            </Link>
          </li>
        </ul>
      </div>
      {!smallMenuToggle && (
        <div
          onClick={toggleMenu}
          className="aside-overlay fixed top-0 left-0 right-0 bottom-0 z-40 overflow-hidden w-full h-full"
        >
          {" "}
        </div>
      )}{" "}
      <div className="flex justify-start items-center">
        {" "}
        <Link href={`/`} onClick={() => setIsUserSeller(false)}>
          <img
            className="h-8"
            alt="Logo"
            src="https://www.ishtari.com/catalog/view/javascript/keen_seller_report/assets/media/logos/ishtari-logo.png"
          />
        </Link>
      </div>
      <div className=" flex justify-start items-center box-border">
        <button
          className="inline-block hover-animation relative overflow-hidden m-0 p-0 cursor-pointer bg-none border-0 w-6 h-6 aside-animation"
          onClick={toggleMenu}
        >
          <span
            className={`bg-white ${
              smallMenuToggle ? "menu-active" : "menuSellerButton"
            } `}
          ></span>
        </button>
      </div>
    </div>
  );
};

export default AsideMenu;

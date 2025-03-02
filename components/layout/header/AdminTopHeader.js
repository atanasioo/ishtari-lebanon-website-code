import { AccountContext } from "@/contexts/AccountContext";
import { useMarketingData } from "@/contexts/MarketingContext";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";


function AdminTopHeader() {
  const [state, dispatch] = useContext(AccountContext);
  const [showMessage, setShowMessage] = useState(false);
  const [token, setToken] = useState();
  const { showStats, setShowStats } = useMarketingData();

  useEffect(()=>{
   const tokenstore =  Cookies.get("ATDetails");
   setToken(tokenstore)
  },[])
  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setShowMessage(true);
  };

  const remove = () => {
    return setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };

  return (
    <div
      className={
        !state.admin
          ? "hidden"
          : `h-12 px-10 text-white flex items-center bg-dgrey1 ${
              (Cookies.get("site-local-name") === "energy-plus" ||
                (window !== undefined &&
                  window.location.host === "www.energyplus-lb.com")) &&
              "bg-Energyplus text-dblackk"
            }`
      }
    >
      <div className="container flex justify-between  items-center">
        {window !== undefined &&
        window.location.pathname !== "/pos" &&
        window.location.pathname !== "/orders" ? (
          <div className="space-x-10 flex">
            <a
              target="_blank"
              rel="noreferrer"
              href={window.config["admin-products-url"] + token}
            >
              Products
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href={window.config["admin-orders-url"] + token}
            >
              Orders
            </a>
            {(Cookies.get("site-local-name") === "flo" ||
              Cookies.get("site-local-name") === "flo-bey" ||
              window.location.host === "www.flo-lebanon.com") && (
              <>
                {" "}
                <a target="_blank" rel="noreferrer" href={"/posSystem/pos"}>
                  Pos
                </a>
                <a target="_blank" rel="noreferrer" href={"/posSystem/orders"}>
                  orders list
                </a>
              </>
            )}

            <div
              className="cursor-pointer"
              onClick={() => setShowStats(!showStats)}
            >
              {!showStats ? "Show Stats" : "Hide Stats"}{" "}
            </div>
          </div>
        ) : (
          <div className="w-full">
            <a
              rel="noreferrer"
              classname="font-extrabold"
              href={"/posSystem/pos"}
            >
              Pos
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              className="float-right"
              href={"/posSystem/orders"}
            >
              orders list
            </a>
          </div>
        )}
        <div> {showMessage && remove() && "Link COPIED"}</div>
        {window !== undefined &&
          window.location.pathname !== "/pos" &&
          window.location.pathname !== "/orders" && (
            <div className=" cursor-pointer">
              <p onClick={copy}>Copy Link</p>
            </div>
          )}
      </div>
    </div>
  );
}

export default AdminTopHeader;

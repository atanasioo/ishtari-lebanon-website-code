import { useEffect, useContext } from "react";
// import SeoHandler from "../components/SeoHandler";
import { pixelID } from "../urls";
import { AccountContext } from "../contexts/AccountContext";
import { useRouter } from "next/router";
import { useMarketingData } from "@/contexts/MarketingContext";

function Success(props) {

  const {marketingData, setMarketingData} = useMarketingData();
  const [accountState] = useContext(AccountContext);
  const  router = useRouter()

  //purchase event
  useEffect(() => {
    if (!accountState.admin) {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }

      if (window.location.host === "www.ishtari.com" || window.location.host === "next.ishtari.com" || window.location.host === "ishtari-mobile.com") {
        gtag("event", "conversion", {
          send_to: "AW-991347483/CZZzCOys3YwYEJuG29gD",
          value: marketingData?.total,
          currency: "USD",
          transaction_id: marketingData?.orderDetails?.order_id,
        });
      } else if (window.location.host === "www.ishtari.com.gh" || window.location.host === "next.ishtari.com.gh") {
        gtag("event", "conversion", {
          send_to: "AW-10993907106/ZuLdCKWOl5EYEKLrpvoo",
          value: marketingData?.total,
          currency: "USD",
          transaction_id: marketingData?.orderDetails?.order_id,
        });
      }
    }
    return () => {
      setMarketingData({});
    };
  }, [accountState.admin]);


  return (
    <div className="bg-dgreen z-50 fixed top-0 left-0 w-screen h-screen flex justify-center items-center text-white flex-col">
      <span className="  w-20 h-20 bg-white flex items-center justify-center mb-4 rounded-full">
        <i className="icon icon-ok text-5xl text-dgreen"></i>
        {/* <SeoHandler data={{ title: "Success " }} /> */}
      </span>
      <div className="flex items-center justify-center w-full">
        <div className=""></div>
        <h1 className="font-bold text-3xl text-center">
          Your Order Has Been Processed
        </h1>
      </div>
      <button
        onClick={() => (router.asPath.includes('bey') ?  router.push("/bey")  :  router.push("/"))}
        className="bg-white text-dgreen px-10 py-3 rounded mt-4 font-bold"
      >
        CONTINUE SHOPPING
      </button>
    </div>
  );
}

export default Success;

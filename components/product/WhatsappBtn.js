import { AccountContext } from "@/contexts/AccountContext";
import React, { useContext } from "react";
import { BsWhatsapp } from "react-icons/bs";

function WhatsappBtn(props) {
    const [accountState] = useContext(AccountContext);

  return (
    <a
      className="flex justify-start"
      // href={`https://api.whatsapp.com/send?phone=${
      //   window.config["countryCode"] + accountState.wtspNumber
      // }&text=Hi%20there%20i%27m%20interested%20in%20${
      //   window.config["site-url"]
      // }/product/${props.product_id}`}
      href={`https://api.whatsapp.com/send?phone=${
        "+961" + accountState.wtspNumber
      }&text=Hi%20there%20i%27m%20interested%20in%20${
        "https://www.ishtari.com"
      }/product/${props.product_id}`}
    >
      <div className=" flex justify-start items-center rounded-md bg-dgreen py-2 px-4 text-white">
        <BsWhatsapp className="w-5 h-5" />
        <p className="text-md ml-4">Whatsapp Support</p>
      </div>
    </a>
  );
}

export default WhatsappBtn;

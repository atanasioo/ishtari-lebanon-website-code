import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { axiosServer } from "@/axiosServer";
import buildLink from "../urls";

function CellulantCheckoutPopup(props) {
  const [checkoutData, setCheckoutData] = useState([]);
  const [chargeData, setChargeData] = useState([]);
  const [paymentOpMode, setPaymentOpMode] = useState("");
  const [paymentOpCode, setPaymentOpCode] = useState("");
  const [paymentErr, setPaymentErr] = useState(false);
  const [err, setErr] = useState("");
  const [togglePayment, setTogglePayment] = useState(false);
  const [paymentText, setPaymentText] = useState("Select Payment Option");
  const [loading, setLoading] = useState(false);
  const [afterCharge, SetAfterCharge] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (window.location.host === "localhost:3000") {
      if (Object.keys(props.data).length > 0) {
        _axios
          .post(
            "https://www.ishtari.com.gh/v2/index.php/?route=payment/cellulant_custom_momo/checkoutRequest",
            props.checkoutObj
          )
          .then((res) => {
            if (!res.data.errorCode) {
              setCheckoutData(res.data.results);
            } else {
              setErr(res?.data?.errorMessage);
            }
          });
      }
    }
  }, [props.data]);

  function handlePaymentOpChange(payment_data) {
    setPaymentOpCode(payment_data.payment_option_code);
    setPaymentOpMode(payment_data.payment_option_mode);
    setPaymentText(payment_data.payment_option_name);
  }

  function initiateChargeReq() {
    if (paymentText !== "Select Payment Option") {
      setLoading(true);
      setPaymentErr(false);
      const obj = {
        charge_msisdn: props.checkoutObj.msisdn,
        charge_amount: props.checkoutObj.request_amount,
        country_code: props.checkoutObj.country_code,
        currency_code: props.checkoutObj.currency_code,
        merchant_transaction_id: props.checkoutObj.merchant_transaction_id +"",
        service_code: props.checkoutObj.service_code,
        payment_mode_code: paymentOpMode,
        payment_option_code: paymentOpCode,
      };
      //charge request
      _axios
        .post(
          "https://www.ishtari.com.gh/v2/index.php/?route=payment/cellulant_custom_momo/chargeRequest",
          obj
        )
        .then((res) => {
          if (res.data.status.status_code === 200) {
            console.log(res);
            setChargeData(res.data.results);
            SetAfterCharge(true);
          }
          setLoading(false);
        });
    } else {
      setPaymentErr(true);
    }
  }

  function closeCellulantPopup() {
    props.closeCellulantPopup();
  }

  // function acknowledge(){
  //   const obj={
  //     acknowledgement_amount: props.checkoutObj.request_amount,
  //     acknowledgement_type: "Full",
  //     acknowledgement_narration: "Acknowledgment for order with ID: " +props.checkoutObj.merchant_transaction_id,
  //     acknowledgment_reference: "ACK" +props.checkoutObj.merchant_transaction_id,
  //     merchant_transaction_id: props.checkoutObj.merchant_transaction_id,
  //     service_code: props.checkoutObj.service_code,

  //   }
  // }

  function validatePayment() {
    const obj = {
      order_id: props.checkoutObj.merchant_transaction_id,
    };
    _axios
      .post(
        "https://www.ishtari.com.gh/v2/index.php/?route=payment/cellulant_custom_momo/paymentSuccessValidation",
        obj
      )
      .then((res) => {
        if (res.data.success) {
          _axios
            .post(buildLink("payment_form"), {
              payment_method: "cellulant_custom_momo",
            })
            .then((response) => {
              const data = response.data;
              confirmOrder(data.confirm_url, data.success_url, true);
            });
        } else {
          _axios
            .get(
              "https://www.ishtari.com.gh/v2/index.php/?route=payment/cellulant_custom_momo/queryStatus&service_code=" +
                props.checkoutObj.service_code +
                "&merchant_transaction_id=" +
                props.checkoutObj.merchant_transaction_id
            )
            .then((result) => {
              _axios
                .post(buildLink("payment_form"), {
                  payment_method: "cellulant_custom_momo",
                })
                .then((response) => {
                  const data = response.data;
                  confirmOrder(data.confirm_url, data.success_url);
                });

              setLoading(false);
            });
        }
      });
  }

  function confirmOrder(c_url, s_url) {
    _axios.post(c_url).then((response) => {
      const data = response.data;
      if (data.success) {
        successOrder(s_url);
      } else {
        router.push({
          pathname: "/failed/",
        });
      }
    });
  }
  // +96103005854
  function successOrder(url) {
    _axios.get(url).then((response) => {
      const data = response.data;
      if (data.success) {
        setLoading(false);
        router.push({
          pathname: "/success/",
          state: { data: response.data },
        });
      }
    });
  }

  return (
    <div></div>
  //   <div
  //     className="fixed bg-dblackOverlay top-0 lef-0 w-full h-full z-30 overflow-hidden"
  //     //onClick={() => closeCellulantPopup()}
  //   >
  //     <div className="relative z-40 h-screen mx-auto text-center box-border">
  //       <div className="absolute w-full lg:w-1/2 m-auto h-3/4 lg:h-3/5 z-50 bg-white top-0 left-0 right-0 bottom-0 rounded-lg" style={{minHeight: "400px"}}>
  //         {!afterCharge ? (
  //           <div className="flex flex-col justify-between relative p-8 text-center h-full">
  //             <div className="icon-wrapper text-center  flex justify-center font-semibold text-d22">
  //               Ishtari Checkout
  //             </div>
  //             <div
  //               className="absolute right-8 cursor-pointer"
  //               onClick={() => closeCellulantPopup()}
  //             >
  //               <GrClose className="w-5 h-5" />
  //             </div>
  //             <div className="flex flex-col-reverse md:flex-row items-center">
  //               <div className="w-full md:w-1/2">
  //                 <div className="text-left flex flex-col py-2">
  //                   <p className="font-semibold text-d18">Name:</p>
  //                   <p>
  //                     {props.checkoutObj.customer_first_name}{" "}
  //                     {props.checkoutObj.customer_last_name}
  //                   </p>
  //                 </div>
  //                 <div className="text-left flex flex-col py-2">
  //                   <p className="font-semibold text-d18">Telephone:</p>
  //                   <p>{props.checkoutObj.msisdn}</p>
  //                 </div>
  //                 <div className="payment-options text-left flex flex-col py-2 w-full">
  //                   <p className="text-d18 font-semibold">Payment Option:</p>
  //                   {paymentErr && (
  //                     <div className="text-dbase text-sm">
  //                       Please choose a payment option
  //                     </div>
  //                   )}
  //                   {err && <div className="text-dbase text-sm">{err}</div>}
  //                   <div
  //                     className="dropdown flex flex-col relative mt-1"
  //                     onClick={() => setTogglePayment(!togglePayment)}
  //                   >
  //                     <div className="border border-dplaceHolder flex items-center justify-between p-1 cursor-pointer">
  //                       <p>{paymentText}</p>
  //                       <BsChevronDown />
  //                     </div>
  //                     {togglePayment && (
  //                       <div className="absolute w-full  overflow-y-scroll top-8 border border-dplaceHolder bg-white z-10" style={{maxHeight: "8rem"}}>
  //                         {checkoutData?.payment_options?.map((p_o) => (
  //                           <div
  //                             onClick={() => handlePaymentOpChange(p_o)}
  //                             key={p_o.payment_option_code}
  //                             className="border-b border-t p-1 border-dinputBorder hover:bg-dblue hover:text-white cursor-pointer flex items-center"
  //                           >
  //                             <div>{p_o.payment_option_name}</div>
  //                             {/* <img src={p_o.payment_option_logo} alt={p_o.payment_option_name} /> */}
  //                           </div>
  //                         ))}
  //                       </div>
  //                     )}
  //                   </div>
  //                 </div>
  //               </div>
  //               <div className="text-center flex flex-col mb-4 md:mb-0 py-2 text-d22 w-full  md:w-1/2">
  //                 <p className="text-dbluedark font-semibold">
  //                   Amount To be Paid:
  //                 </p>
  //                 <p> {props.checkoutObj.request_amount} GHS</p>
  //               </div>
  //             </div>
  //             <div className="">
  //               <button
  //                 className={`bg-dbluedark rounded-md text-white py-2 mt-4 md:mt-0 mb-3.5 w-full md:w-3/4 ${
  //                   loading ? "pointer-events-none opacity-60" : ""
  //                 }`}
  //                 onClick={() => initiateChargeReq()}
  //               >
  //                 {loading ? "Loading..." : "PROCEED"}
  //               </button>
  //             </div>
  //           </div>
  //         ) : (
  //           <div className="flex flex-col justify-between relative p-8 text-center h-full">
  //             <div className="icon-wrapper text-center  flex justify-center font-semibold text-d22">
  //               Ishtari Checkout
  //             </div>
  //             <div
  //               className="absolute right-8 cursor-pointer"
  //               onClick={() => closeCellulantPopup()}
  //             >
  //               <GrClose className="w-5 h-5" />
  //             </div>
  //             <div className="text-center ">
  //               <span className="font-semibold">Request Date: </span>{" "}
  //               {chargeData.charge_request_date}
  //             </div>
  //             <div
  //               className="text-center mb-3"
  //               dangerouslySetInnerHTML={{
  //                 __html: DOMPurify.sanitize(chargeData.payment_instructions),
  //               }}
  //             ></div>
  //             <div className="flex items-center justify-center mb-3">
  //               <button
  //                 className={` py-2 bg-dbluedark text-white px-5 rounded-md text-sm w-full md:w-1/2 font-semibold ${
  //                   loading ? "pointer-events-none opacity-60" : ""
  //                 }`}
  //                 onClick={() => {
  //                   validatePayment();
  //                   setLoading(true);
  //                 }}
  //               >
  //                 {loading ? "Loading..." : "VALIDATE PAYMENT"}
  //               </button>
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   </div>
   );
}

export default CellulantCheckoutPopup;

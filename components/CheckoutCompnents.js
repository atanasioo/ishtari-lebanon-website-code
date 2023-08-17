import Cookies from "js-cookie";
import ReactPixel from "react-facebook-pixel";
import { useRef, useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { axiosServer } from "@/axiosServer";
import Loader from "./Loader";
import { AccountContext } from "../contexts/AccountContext";
import buildLink, { path, pixelID } from "../urls";
import { CartContext } from "../contexts/CartContext";
import useDeviceSize from "@/components/useDeviceSize";
import HeaderCheckout from "@/components/HeaderCheckout";
import { CurrencyContext } from "../contexts/CurrencyContext";
import { FaComments } from "react-icons/fa";
import DOMPurify from "dompurify";
import dynamic from "next/dynamic";
import { ImLocation } from "react-icons/im";
import { FaMoneyBillWaveAlt, FaBus } from "react-icons/fa";
import HandlePhoneModel from "./PhoneHanlder";
import { useMarketingData } from "@/contexts/MarketingContext";
function CheckoutCompnents() {
  const [state, dispatchAccount] = useContext(AccountContext);
  const [cartState, dispatch] = useContext(CartContext);
  const curr = useContext(CurrencyContext);
  console.log(curr);
  const [width] = useDeviceSize();
  // Is Phone Number Valid ?
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState(false);
  const [triggerPaymentLink, setTriggerPaymentLink] = useState(false);
  const [paymentData, setPaymentData] = useState([]);
  const [cellulantPopup, setCellulantPopup] = useState(false);
  const [cellulantCheckoutObj, setCellulantCheckoutObj] = useState({});
  const [cellulantData, setCellulantData] = useState([]);
  const { setMarketingData } = useMarketingData();
  const [loginShow, setLoginShow] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  const [err, setErr] = useState("");
  const router = useRouter();
  // Customer id
  const [customerId, setCustomerId] = useState("0");

  // Zones
  const [zones, setZones] = useState([]);
  const [townes, setTownes] = useState([]);
  const [firstAttemp, setFirstAttemp] = useState(true);
  const zone = useRef({
    id: window.config["initial-zone"].id,
    name: window.config["initial-zone"].name,
  });
  const town = useRef({
    id: 0,
    name: "",
  });
  // Cart states
  const [emptyCart, setEmptyCart] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  // Account states
  const [loged, setloged] = useState();
  const [emptyAddress, setEmptyAddress] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingtown, setLoadingtown] = useState(false);

  const [confirmDisable, setConfirmDisalbe] = useState(false);
  // Manual
  const [manualResponse, setManualResponse] = useState({});
  const manualErrors = useRef({});
  const [manualCart, setManualCart] = useState([]);
  const [subTotal, setsubTotal] = useState(0);
  // User Details

  const firstname = useRef();
  const lastname = useRef("");
  const address_1 = useRef("");
  const address_2 = useRef("");
  const telephone = useRef("");
  const coupon = useRef("");
  // const balanceAmount = useRef("");
  const termCondition = useRef("");

  const email = useRef("");
  const comment = useRef("");
  const [townRequired, setTownRequired] = useState(false);

  // address details
  const [addresses, setAddresses] = useState([]);
  const [activeAddress, setActiveAddress] = useState({});
  const [showAddresses, setShowAddresses] = useState(false);
  const [isFirst, setIsFirst] = useState(true);

  // Initial checks
  useEffect(() => {
    if (firstAttemp) {
      const fname = document.getElementById("firstname");
      fname?.focus();
    }
  });

  useEffect(() => {
    // This effect runs on component mount and whenever router.pathname changes
    console.log(router.pathname);
  }, [router.pathname]);
  // dynamic

  // const HandlePhoneModel = dynamic(() => import("./PhoneHanlder"), {
  //   ssr: false // Disable server-side rendering
  // });

  const CellulantCheckoutPopup = dynamic(
    () => import("./CellulantCheckoutPopup"),
    {
      ssr: false, // Disable server-side rendering
    }
  );

  // Event snippet for begin checkout test 2023 conversion page
  useEffect(() => {
    if (!state.admin) {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      if (
        window.location.host === "www.ishtari.com" ||
        window.location.host === "next.ishtari.com"
      ) {
        gtag("event", "conversion", {
          send_to: "AW-991347483/EUVMCKj7nI8YEJuG29gD",
          value: manualResponse?.sub_total,
          currency: "USD",
          // 'coupon': coupon?.current?.value,
          items: manualResponse?.order_product,
        });
      } else if (
        window.location.host === "www.ishtari.com.gh" ||
        window.location.host === "next.ishtari.com.gh"
      ) {
        gtag("event", "conversion", {
          send_to: "AW-10993907106/lOeeCOi6kZEYEKLrpvoo",
          value: manualResponse?.sub_total,
          currency: "USD",
          // 'coupon': coupon?.current?.value,
          items: manualResponse?.order_product,
        });
      }
    }
    // ---> Facebook PIXEL <---

    if (!state.admin && manualResponse?.order_product?.length > 0) {
      // ---> Facebook PIXEL <---
      const advancedMatching = {
        em: manualResponse?.social_data?.email,
        fn: manualResponse?.social_data?.firstname,
        ln: manualResponse?.social_data?.lastname,
        external_id: manualResponse?.social_data?.external_id,
        country: manualResponse?.social_data?.country_code,
      };

      ReactPixel.init(pixelID, advancedMatching, {
        debug: true,
        autoConfig: false,
      });
      ReactPixel.pageView();
      ReactPixel.fbq("track", "PageView");
      // if (data) {
      let productArray = "";

      manualResponse?.order_product?.map((p, index) => {
        if (index === manualResponse.order_product?.length - 1) {
          productArray += p.product_id;
        } else {
          productArray = p.product_id + ",";
        }
      });
      window.fbq(
        "track",
        "InitiateCheckout",
        {
          content_type: "product",
          content_ids: productArray,
          num_items: manualResponse?.order_product?.length,
          currency: manualResponse?.social_data?.currency,
        },
        { eventID: manualResponse?.social_data?.event_id }
      );
    }
  }, [manualResponse, state.admin]);

  useEffect(() => {
    if (
      (window != undefined &&
        window.config["site-url"] === "https://www.ishtari.com") ||
      Cookies.get("site-local-name") === "ishtari"
    ) {
      Cookies.set("currency", "");
    }
  }, [window.location.href]);

  const cid = Cookies.get("cid");
  useEffect(() => {
    if (loginShow) {
      dispatchAccount({ type: "setShowOver", payload: true });
      dispatchAccount({ type: "setShowLogin", payload: true });
    }
  }, [loginShow]);

  useEffect(() => {
    axiosServer
      .get(
        buildLink(
          "get_account",
          undefined,
          undefined,
          window.config["site-url"]
        )
      )
      .then((response) => {
        const data = response.data;
        if (!data.success) {
          setloged(false);
          // alert(2)
          getCart();

          if (!state.loged) {
            if (!state.admin && !loginShow) {
              setLoginShow(true);
            }
          }
        } else {
          setloged(true);
          axiosServer
            .get(
              buildLink(
                "login",
                undefined,
                undefined,
                window.config["site-url"]
              )
            )
            .then((response) => {
              setCustomerId(response.data.customer_id);
              // localStorage.setItem("cid", response.data.customer_id);
            });
          axiosServer
            .get(
              buildLink(
                "address",
                undefined,
                undefined,
                window.config["site-url"]
              )
            )
            .then((response) => {
              if (!response.data.success) {
                router.push({
                  pathname: "/account/address/add",
                  search: "from-checkout=true",
                });
              } else {
                zone.current.name = response.data.data[0].city;
                zone.current.id = response.data.data[0].zone_id;
                town.current.id = response.data.data[0].town_id;
                town.current.name = response.data.data[0].town_name;
                setAddresses(response.data.data);
                changeAddress(response.data.data[0], false);
                getCart();
                // alert(1);
              }
            });
        }
      });
    // End account check
  }, [window.location]);

  // set active address from address list
  function changeAddress(address, _manual) {
    setShowAddresses(false);
    setActiveAddress(address);
    const obj = {
      name: address.zone,
      value: address.zone_id,
    };
    zone.current.name = address.zone;
    zone.current.id = address.zone_id;
    if (_manual) {
      setTimeout(() => {
        manual(
          manualCart,
          obj,
          activePaymentMethod,
          false,
          coupon.current.value
        );
      }, 500);
    }
  }

  // HandleCoupon
  function setCoupon() {
    const obj = {
      name: zone.current.name,
      value: zone.current.id,
    };
    if (coupon.current.value.length > 1) {
      manual(manualCart, obj, activePaymentMethod, false);
    } else {
    }
  }

  function handleCouponChange() {
    if (coupon.current.value.length < 1) {
      manualErrors.current = "";
    }
  }

  // function applyBalance() {
  //   const obj = {
  //     name: zone.current.name,
  //     value: zone.current.id,
  //   };
  //   if (balanceAmount.current.value.length > 1) {
  //     manual(manualCart, obj, activePaymentMethod, false);
  //   }
  // }

  // function handleBalanceAmountChance() {
  //   if (balanceAmount.current.value.length < 1) {
  //     manualErrors.current = "";
  //   }
  // }

  function closeCellulantPopup() {
    setCellulantPopup(false);
    setConfirmDisalbe(false);
  }

  // getCart
  function getCart() {
    // cart check
    axiosServer
      .get(buildLink("cart", undefined, undefined, window.config["site-url"]))
      .then((response) => {
        const data = response.data;
        if (!data.success) {
          setEmptyCart(true);
        } else {
          setsubTotal(response.data.sub_total);

          let temp = [];
          const dt = data.data.products;
          for (let index = 0; index < dt.length; index++) {
            let new_product = {};
            let product_option = {};
            new_product.product_id = dt[index]["product_id"];
            new_product.quantity = dt[index]["quantity"];
            if (dt[index]["option"].length !== 0) {
              product_option["type"] = "radio";
              product_option["product_option_id"] =
                dt[index]["option"][0]["product_option_id"];
              product_option["product_option_value_id"] =
                dt[index]["option"][0]["product_option_value_id"];

              new_product.order_option = [product_option];
            }
            temp.push(new_product);
          }
          setManualCart(temp);
          manual(temp, zone, activePaymentMethod, false);
          setCartProducts(data.data.products);
        }
        dispatch({
          type: "setProducts",
          payload:
            response.data?.data?.products?.length > 0
              ? response.data.data.products
              : [],
        });
        dispatch({
          type: "setTotals",
          payload:
            response.data?.data?.totals?.length > 0
              ? response.data.data.totals
              : 0,
        });
        dispatch({
          type: "setProductsCount",
          payload:
            response?.data?.data?.total_product_count > 0
              ? response.data.data.total_product_count
              : 0,
        });
      });
    // End cart check
  }

  // Get Zones
  useEffect(() => {
    const bool = state.admin ? "&admin=true" : "&admin=false";
    axiosServer
      .get(
        buildLink("zone", undefined, undefined, window.config["site-url"]) +
          window.config["zone"] +
          bool
      )
      .then((response) => {
        setZones(response.data.data.zones);
      });
    if (
      window.config["site-url"] === "https://www.ishtari.com.gh" ||
      Cookies.get("site-local-name") === "ishtari-ghana"
    ) {
      axiosServer
        .get(
          buildLink("town", undefined, undefined, window.config["site-url"]) +
            1274
        )
        .then((response) => {
          setTownes(response.data.data);
        });
    }
  }, []);

  //get wallet balance
  useEffect(() => {
    if (state.loged) {
      axiosServer
        .get(buildLink("getBalance", undefined, window.innerWidth))
        .then((response) => {
          if (response.data.success) {
            setWalletBalance(response.data.data.balance);
          }
        });
    }
  }, [state]);


  // Manual Request

  function manual(manualCartProducts, _zone, paymentcode, confirm) {
    // console.log(manualCart.sub_total)
    setLoading(true);
    window.scroll(0, 0);
    let body = {};
    // if it's first attemp
    if (firstAttemp) {
      body = {
        order_product: manualCartProducts,
        customer_id: customerId,
        firstname: "initial firstname",
        lastname: "initial lastname",
        email: "initialmail@mail.com",
        address_1: "initial address one",
        telephone: "00000000",
        address_2: "",
        city: "",
        shipping_method: "Delivery ( 1-4 days )",
        shipping_code: "ultimate_shipping.ultimate_shipping_0",
        payment_method: "Cash On Delivery",
        payment_code: "cod",
        comment: "",
        country_id: window.config["zone"],
        payment_session: "",
        zone_id: zone.current.id,
        zone: zone.current.name,
        town_id: town.current.id,
        town: town.current.name,
        is_web: true,
        //   Cookies.get("change") === "false" || Cookies.get("change") === false
        //     ? false
        //     : true,
        source_id: 1,
        coupon: "",
        code_version: width > 600 ? "web_desktop" : "web_mobile",
        // customer_credit_amount: balanceAmount.current?.value !== "" ? balanceAmount.current?.value : ""
      };
    } else {
      body = {
        order_product: manualCartProducts,
        customer_id: customerId,
        firstname: firstname.current?.value || "",
        lastname: lastname.current?.value || "",
        email: email.current?.value || "",
        address_1: address_1.current?.value || "",
        telephone: telephone.current?.value.replace("-", "") || "",
        address_2: address_2.current?.value || "",
        city: "",
        shipping_method: "Delivery ( 1-4 days )",
        shipping_code: "ultimate_shipping.ultimate_shipping_0",
        payment_method: "Cash On Delivery",
        payment_code: paymentcode,
        comment: comment.current?.value || "",
        country_id: window.config["zone"],
        zone_id: _zone?.value || zone.current.id,
        zone: _zone?.name || zone.current.name,

        town_id: town.current.id,
        town: town.current.name,
        is_web: true,
        // Cookies.get("change") === "false" || Cookies.get("change") === false
        //   ? false
        //   : true,
        payment_session: manualResponse.payment_session,
        source_id: 1,
        coupon: coupon.current?.value || "",
        code_version: width > 600 ? "web_desktop" : "web_mobile",
        // customer_credit_amount: balanceAmount.current?.value !== "" ? balanceAmount.current?.value : ""
      };
      const adminId = Cookies.get("user_id");
      if (typeof adminId != "undefined") {
        body["user_id"] = adminId;
      }
    }
    axiosServer
      .post(
        buildLink("manual", undefined, undefined, window.config["site-url"]),
        body
      )
      .then((response) => {
        setManualResponse(response.data.data);
        setError(response.data);

        if (
          response.data.sub_total >=
            curr?.data?.minimum_amount_to_change_currency_in_checkout &&
          manualResponse.default_currency === "LBP" &&
          curr?.data?.allow_change_currency_in_checkout === "true" &&
          curr?.data?.allow_change_currency_in_website === "false"
        ) {
          changeCurrency("USD");
          //  setisWeb(true)
          // console.log("entered");
        }
        if (
          response.data.sub_total <
            curr?.data?.minimum_amount_to_change_currency_in_checkout &&
          response.data.sub_total > 0 &&
          manualResponse.default_currency === "USD" &&
          curr?.data?.allow_change_currency_in_checkout === "true" &&
          curr?.data?.allow_change_currency_in_website === "false"
        ) {
          changeCurrency("LBP");
          // setisWeb(true)
          // console.log("entered2");
        }
        const data = response.data.data;

        var dataSocial = data?.social_data;
        // dataSocial["link"] = router.asPath;
        dataSocial["fbp"] = Cookies.get("_fbp");
        dataSocial["fbc"] = Cookies.get("_fbc");
        dataSocial["ttp"] = Cookies.get("_ttp");
        if (isFirst) {
          setIsFirst(false);

          axiosServer
            .post(
              buildLink(
                "pixel",
                undefined,
                undefined,
                window.config["site-url"]
              ),
              dataSocial
            )
            .then((response) => {
              const data = response.data;
              if (data.success === true) {
              }
            });
        }
        if (response?.data?.success === false) {
          manualErrors.current = response.data.errors;
          // paymentForm(confirm, paymentcode);
          setLoading(false);
          setConfirmDisalbe(false);
        } else {
          manualErrors.current = "";
          paymentForm(confirm, paymentcode);
          setLoading(false);

          if (firstAttemp) setFirstAttemp(false);
        }
      });

    if (!state.loged) {
      if (!state.admin) {
        // dispatchAccount({ type: "setShowOver", payload: true });
        // dispatchAccount({ type: "setShowLogin", payload: true });
        dispatchAccount({ type: "setShowSignup", payload: false });
      }
    } else {
      dispatchAccount({ type: "setShowOver", payload: false });
      dispatchAccount({ type: "setShowLogin", payload: false });
      dispatchAccount({ type: "setShowSignup", payload: false });
    }
    // Cookies.set("change", false)
  }

  // Update quantity
  function updateQuantity(e, key, quantity) {
    e.preventDefault();
    setLoading(true);
    const obj = { key, quantity };
    axiosServer
      .put(
        buildLink("cart", undefined, undefined, window.config["site-url"]),
        obj
      )
      .then(() => {
        getCart();
      });
  }

  // Remove ITem
  function RemoveItem(key) {
    setLoading(true);

    axiosServer
      .delete(
        buildLink("cart", undefined, undefined, window.config["site-url"]),
        { key }
      )
      .then(() => {
        getCart();
      });
  }

  //submit form
  function submitForm(e) {
    e.preventDefault();
    if (town.current.id < 1 && window.config["useTown"]) {
      setTownRequired(true);
      return;
    }
    if (town.current.id < 1 && window.config["useTown"]) {
      setTownRequired(true);
      return;
    }
    //  alert('termCondition'+town.current.id)
    setConfirmDisalbe(true);

    manual(manualCart, zone, activePaymentMethod, true);

    // }

    setConfirmDisalbe(true);

    dispatchAccount({ type: "setShowOver", payload: false });
    dispatchAccount({ type: "setShowLogin", payload: false });
    dispatchAccount({ type: "setShowSignup", payload: false });
  }
  // Zone changed

  function zoneChanged(e, z) {
    // if(subTotal> 15 &&  subTotal < 50  )
    // Cookies.set('change', true);
    const sel = e.target;
    setLoadingtown(true);
    setTownes("");
    const obj = {
      name: sel.options[sel.selectedIndex].text,
      value: sel.value,
    };
    zone.current.id = sel.value;
    zone.current.name = sel.options[sel.selectedIndex].text;
    manual(manualCart, obj, activePaymentMethod, false);
    // if (cid < 1) {
    dispatchAccount({ type: "setShowOver", payload: false });
    dispatchAccount({ type: "setShowLogin", payload: false });
    dispatchAccount({ type: "setShowSignup", payload: false });
    // }

    axiosServer
      .get(
        buildLink("town", undefined, undefined, window.config["site-url"]) +
          zone.current.id
      )
      .then((response) => {
        if (response.data.success) {
          setTownes(response.data.data);
          //  setLoadingtown(false)
        }
        setLoadingtown(false);
      });
  }

  function townChanged(e, z) {
    const sel = e.target;
    town.current.id = sel.value;
    // console.log(town.current.id);
    // console.log(zone.current.id);
    town.current.name = sel.options[sel.selectedIndex].text;
    const obj = {
      name: sel.options[sel.selectedIndex].text,
      value: sel.value,
    };
    manual(manualCart, "", activePaymentMethod, false);
    dispatchAccount({ type: "setShowOver", payload: false });
    dispatchAccount({ type: "setShowLogin", payload: false });
    dispatchAccount({ type: "setShowSignup", payload: false });
    setLoadingtown(true);
    setTimeout(() => {
      setLoadingtown(false);
    }, 1000);
  }
  const firstPath = window.location.href.split("/")[3];

  useEffect(() => {
    if (
      (window.config["site-url"] === "https://www.flo-lebanon.com" ||
        Cookies.get("site-local-name") === "flo" ||
        firstPath === "bey") &&
      !state.admin
    ) {
      // window.location.href = "/";
    }
  }, [state.admin]);

  //generate paymentlink for cellulant momo
  useEffect(() => {
    if (activePaymentMethod === "cellulant_momo" && triggerPaymentLink) {
      // var desc = "";
      // manualResponse.order_product.map(
      //   (p, i) =>
      //     (desc +=
      //       i !== manualResponse.order_product.length - 1
      //         ? p.name + ", "
      //         : p.name)
      // );

      var obj = {
        //mobile nb for the customer
        msisdn: telephone.current?.value.replace("-", ""),
        account_number: Cookies.get("cid"),
        country_code: "GHA",
        currency_code: manualResponse.default_currency,
        customer_first_name: firstname.current?.value,
        customer_last_name: lastname.current?.value,
        due_date: getDateTime(),
        merchant_transaction_id: manualResponse.order_id,
        callback_url: paymentData?.callback_url,
        request_amount: parseFloat(manualResponse?.total_GHS_not_formatted),
        request_description:
          "ishtariLTD payment for order ID: " + manualResponse.order_id,
        service_code: paymentData?.service_code,
        success_redirect_url: paymentData?.success_redirect_url,
        fail_redirect_url: paymentData?.failed_url,
        language_code: "en",
      };
      axiosServer
        .post(
          "https://www.ishtari.com.gh/v2/index.php?route=payment/cellulant_momo/generatePaymentLink",
          obj
        )
        .then((res) => {
          const paymentLink = res.data;
          window.location.href = paymentLink;
        });
    }
  }, [manualResponse, triggerPaymentLink]);

  // Payment form
  function paymentForm(confirm, p_m) {
    setLoading(true);
    axiosServer
      .post(
        buildLink(
          "payment_form",
          undefined,
          undefined,
          window.config["site-url"]
        ),
        { payment_method: p_m }
      )
      .then((response) => {
        const data = response.data;
        try {
          document.getElementById("simp-id").outerHTML = "";
        } catch (e) {}
        const script = document.createElement("script");
        script.src = "https://www.simplify.com/commerce/simplify.pay.js";
        script.async = false;
        script.id = "simp-id";
        document.body.appendChild(script);
        setSiResponse(data);
        // const script1 = document.createElement("script1");
        // script.src = "https://bobsal.gateway.mastercard.com/checkout/version/58/checkout.js";
        // document.body.appendChild(script1);
        // setSiResponse(data);
        //console.log(data);
        // Developer hint [here you must call the function to complete payment (incase backend payment changed)]
        if (data.success) {
          setSiResponse(data);
          // if (activePaymentMethod === "simplifycommerce" && confirm) {
          //   if (Object.keys(manualErrors.current).length === 0) {
          //     window.SimplifyCommerce.hostedPayments(async (response) => {
          //       setConfirmDisalbe(false);
          //       if (response["data"]["paymentStatus"] === "APPROVED") {
          //         let bodyFormData = new FormData();
          //         bodyFormData.append("success", true);
          //         bodyFormData.append(
          //           "paid_amount",
          //           response["data"]["amount"]
          //         );

          //         await axiosServer({
          //           url: data.confirm_url,
          //           method: "post",
          //           data: bodyFormData
          //         }).then((response) => {
          //           let dt = response.data;
          //           if (dt.success === true) {
          //             successOrder(data.success_url);
          //           }
          //         });
          //       }
          //     }).closeOnCompletion();
          //     document.getElementById("pay").click();
          //   }
          // }
          if (
            (p_m === "zenithbank_global_pay" ||
              p_m === "momo" ||
              p_m === "momo_v2" ||
              p_m === "zenithbank_v2") &&
            confirm
          ) {
            window.location.href = data.payment_url;
          }

          if (p_m === "mpgs" && confirm) {
            axiosServer
              .get(
                "https://www.ishtari-mobile.com/v2/index.php/?route=payment/mpgs/getSessionId"
              )
              .then((res) => {
                window.paymentStart(res.data.payment_session);
              });
          }

          if (p_m === "uba_mpgs" && confirm) {
            axiosServer
              .get(
                "https://www.ishtari.com.gh/v2/index.php/?route=payment/uba_mpgs/getSessionId"
              )
              .then((res) => {
                window.paymentStart(res.data.payment_session);
              });
          }

          if (p_m === "cellulant_momo" && confirm) {
            setPaymentData(data);
            setTriggerPaymentLink(true);
          }

          if (p_m === "cellulant_custom_momo" && confirm) {
            setCellulantPopup(true);
            setCellulantCheckoutObj({
              msisdn: telephone.current?.value.replace("-", ""),
              account_number: Cookies.get("cid"),
              callback_url: data.callback_url,
              country_code: "GHA",
              currency_code: manualResponse.default_currency,
              //customer_email: email.current?.value,
              customer_email: "fatimahasan1200@gmail.com",
              customer_first_name: firstname.current?.value,
              customer_last_name: lastname.current?.value,
              due_date: getDateTime(),
              fail_redirect_url: data.failed_url,
              invoice_number: manualResponse.order_id,
              merchant_transaction_id: manualResponse.order_id,
              raise_invoice: false,
              request_amount: parseFloat(
                manualResponse?.total_GHS_not_formatted
              ),
              request_description:
                "ishtariLTD payment for order ID: " + manualResponse.order_id,
              service_code: data.service_code,
              success_redirect_url: data.success_redirect_url,
            });

            setCellulantData(data);
          }

          if (p_m === "cod" && confirm) {
            if (Object.keys(manualErrors.current).length === 0) {
              confirmOrder(data.confirm_url, data.success_url);
            }
          }
        }
      });
  }

  function getDateTime() {
    //get tomorrow datetime in UTC for due date in cellulant momo payment method
    var now = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    var year = tomorrow.getFullYear();
    var month = tomorrow.getMonth() + 1;
    var day = tomorrow.getDate();
    var hour = tomorrow.getHours();
    var minute = tomorrow.getMinutes();
    var second = tomorrow.getSeconds();
    if (month.toString().length == 1) {
      month = "0" + month;
    }
    if (day.toString().length == 1) {
      day = "0" + day;
    }
    if (hour.toString().length == 1) {
      hour = "0" + hour;
    }
    if (minute.toString().length == 1) {
      minute = "0" + minute;
    }
    if (second.toString().length == 1) {
      second = "0" + second;
    }
    var dateTime =
      year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;

    const d = new Date(dateTime);

    var utcY =
      d.getUTCFullYear().toString().length === 1
        ? "0" + d.getUTCFullYear()
        : d.getUTCFullYear();
    var utcM =
      (d.getUTCMonth() + 1).toString().length === 1
        ? "0" + (d.getUTCMonth() + 1)
        : d.getUTCMonth() + 1;
    var utcD =
      d.getUTCDate().toString().length === 1
        ? "0" + d.getUTCDate()
        : d.getUTCDate();
    var utcH =
      d.getUTCHours().toString().length === 1
        ? "0" + d.getUTCHours()
        : d.getUTCHours();
    var utcm =
      d.getUTCMinutes().toString().length === 1
        ? "0" + d.getUTCMinutes()
        : d.getUTCMinutes();
    var utcS =
      d.getUTCSeconds().toString().length === 1
        ? "0" + d.getUTCSeconds()
        : d.getUTCSeconds();

    let utcDateTime =
      utcY + "-" + utcM + "-" + utcD + " " + utcH + ":" + utcm + ":" + utcS;

    return dateTime;
  }

  function confirmOrder(c_url, s_url) {
    axiosServer.post(c_url).then((response) => {
      const data = response.data;
      if (data.success) {
        successOrder(s_url);
      }
    });
  }

  //
  function successOrder(url) {
    axiosServer.get(url).then((response) => {
      const data = response.data;
      if (data.success) {
        if (!state.admin) {
          const advancedMatching = {
            em: data?.data?.social_data?.email,
            fn: data?.data?.social_data?.firstname,
            ln: data?.data?.social_data?.lastname,
            external_id: data?.data?.social_data?.external_id,
            country: data?.data?.social_data?.country_code,
          };
          ReactPixel.init(pixelID, advancedMatching, {
            debug: true,
            autoConfig: false,
            country: data?.data?.social_data?.country_code,
          });

          ReactPixel.pageView();
          ReactPixel.fbq("track", "PageView");
          if (data) {
            window.fbq(
              "track",
              "Purchase",
              {
                content_type: "product",
                content_ids: data?.data?.social_data?.content_ids,
                value: data?.data?.social_data?.value,
                num_items: data?.data?.social_data?.num_items,
                currency: data?.data?.social_data?.currency,
              },
              { eventID: data?.data?.social_data?.event_id }
            );
          }
        }

        var dataSocial = data?.data?.social_data;
        dataSocial["link"] = window.location.href;
        dataSocial["fbp"] = Cookies.get("_fbp");
        dataSocial["fbc"] = Cookies.get("_fbc");
        dataSocial["ttp"] = Cookies.get("_ttp");
        axiosServer
          .post(
            buildLink("pixel", undefined, undefined, window.config["site-url"]),
            dataSocial
          )
          .then((response) => {
            const data = response.data;
            if (data.success === true) {
            }
          });
        if (firstPath === "bey") {
          router.push({
            pathname: "/bey/success/",
            state: { data: response.data.data },
          });
        } else {
          router.push({
            pathname: "/success/",
            state: { data: response.data.data },
          });
        }
      }
    });
  }
  // View

  const phoneHanlder = (childData, isValid) => {
    // console.log(telephone.current.value);
    if (isValid === true) {
      telephone.current.value = childData;
      setErr("");
    } else {
      telephone.current.value = childData;
    }

    setIsValid(isValid);
  };
  const AdminPhoneHandler = (obj, isValid) => {
    if (isValid) {
      firstname.current.value = obj.firstname;
      lastname.current.value = obj.lastname;
      // email.current.value  = obj.email
      address_1.current.value = obj.address;
      telephone.current.value = obj.telephone;
      address_2.current.value = obj.address2;
      zone.current.name = obj.city;
      zone.current.id = obj.zone;
      const data = {
        name: obj.city,
        value: obj.zone,
      };
      manual(manualCart, data, activePaymentMethod, false);
    }
    const onEscape = function (action) {
      window &&
        window.addEventListener("keydown", (e) => {
          if (e.key === "Escape") {
            action();
          }
        });
    };
    onEscape(() => {
      telephone.current.blur();
    });
  };
  const [activePaymentMethod, setActivePaymentMethod] = useState("cod");
  const [siResponse, setSiResponse] = useState({
    secret_key: "l0",
    button_name: "Pay with this card",
    amount: 0,
    confirm_url: "0",
    success_url: "0",
    order_id: 0,
  });

  function setPaymentMethod(pm) {
    // if (pm === "pmzenithbank_global_pay") {
    // }
    setActivePaymentMethod(pm);
    manual(manualCart, zone, pm, false);
  }

  function changeCurrency(currency) {
    Cookies.set("change", true);

    var obj = {
      currency: currency,
    };
    axiosServer
      .post(
        buildLink("currency", undefined, undefined, window.config["site-url"]),
        obj
      )
      .then((response) => {
        const data = response.data;
        if (data.success === true) {
          Cookies.set("currency", currency);
          manual(manualCart, data, activePaymentMethod, false);
        }
      });
  }

  function handlePaymentMethodChange(payment_code) {
    if (
      window.location.host !== "www.ishtari.com.gh" &&
      window.location.host !== "localhost:3000"
    ) {
      setPaymentMethod(payment_code);
    } else {
      if (payment_code != "cellulant_momo") {
        setPaymentMethod(payment_code);
      } else {
        if (!loged) {
          dispatchAccount({
            type: "setShowOver",
            payload: true,
          });
          dispatchAccount({
            type: "setShowLogin",
            payload: true,
          });
          dispatchAccount({
            type: "setShowSignup",
            payload: false,
          });
        } else {
          setPaymentMethod(payment_code);
        }
      }
    }
  }

  return (
    <div>
      {window.config["site-url"] === "https://www.ishtari.com" ||
      Cookies.get("site-local-name") === "ishtari" ? (
        <div>
          {manualResponse?.sub_total >=
            curr?.data?.allowed_amount_to_pay_in_lbp ||
          manualResponse?.sub_total <
            curr?.data?.minimum_amount_to_change_currency_in_checkout ||
          loading ? (
            <div></div>
          ) : (
            <div className="-mx-2 border-b border-dgrey1 border-opacity-20">
              <HeaderCheckout
                currency={manualResponse?.default_currency}
                subtotal={manualResponse?.sub_total}
              />
            </div>
          )}
        </div>
      ) : (
        <div></div>
      )}

      {/* cellulant custom checkout popup */}

      {cellulantPopup &&
        cellulantData &&
        Object.keys(cellulantCheckoutObj).length > 0 && (
          <div>
            <CellulantCheckoutPopup
              checkoutObj={cellulantCheckoutObj}
              data={cellulantData}
              closeCellulantPopup={closeCellulantPopup}
            />
          </div>
        )}

      <div className=" ">
        {!emptyCart && (
          <h2 className="py-4 px-2 text-2xl font-semibold flex items-center">
            <span> Checkout </span>{" "}
          </h2>
        )}{" "}
        {/* If cart is empty */}{" "}
        {emptyCart && (
          <div className="flex items-center justify-center flex-col h-screen text-dblack">
            <i className="icon icon-basket text-5xl" />
            <h2 className=" text-2xl my-3 font-semibold">
              Your shopping cart is empty{" "}
            </h2>{" "}
            <h3 className="my-1 font-light text-xl">
              What are you waiting for !
            </h3>{" "}
            <Link
              className="bg-dblue px-20 py-3 text-white mt-4 inline-block font-semibold rounded hover:bg-dbluedark"
              href={`/`}
            >
              START SHOPPING{" "}
            </Link>{" "}
          </div>
        )}{" "}
        {/* End If cart is empty */}{" "}
        {/* If not cart empty , address empty , loading cart or account */}
        {!emptyCart && !emptyAddress && (
          <form autoComplete="off" onSubmit={(e) => submitForm(e)}>
            <div className="flex-row md:flex">
              <div className="w-full md:w-8/12 mr-4 ">
                <div>
                  {/* {Object.keys(manualErrors.current).map((errorKey) => (
                    <div>
                      {manualErrors.current[errorKey]["errorCode"] ==
                        "stock" && (
                        <div className="border  border-dinputBorder py-4 px-2 mb-4">
                          <div className="text-dbase">
                            <span className="capitalize">
                            </span>{" "}
                            <span className="ml-2">
                              {manualErrors.current[errorKey]["errorMsg"]}{" "}
                            </span>{" "}
                          </div>
                        </div>
                      )}{" "}
                    </div>
                  ))} */}
                </div>
                {/* If user is not logged in */}{" "}
                {!loged && (
                  <>
                    <div className="text-dbase mb-1">
                      {!error.success && error.message}
                    </div>
                    <div className="cart bg-white px-4 py-2">
                      <div className="flex cart-header pt-1">
                        <span className="  rounded-full p-2 bg-dgrey ">
                          <ImLocation className="bg-dgrey" />
                        </span>{" "}
                        <span className="text-d18 ml-1 mt-1"> Address </span>{" "}
                      </div>{" "}
                      <div className="cart-body relative pt-2">
                        {" "}
                        {}{" "}
                        <div className="flex flex-wrap  ">
                          <div className="w-full xl:w-1/2 lg:w-1/2 pr-0  xl:pr-4 lg:pr-4">
                            {" "}
                            {/* Firstname */}{" "}
                            <div className="input mb-6 required">
                              <label htmlFor="firstname"> First name </label>{" "}
                              <input
                                type="text"
                                id="firstname"
                                ref={firstname}
                                minLength={3}
                                required
                                autoFocus
                              />
                            </div>{" "}
                            <span className="text-dbase text-xs ml-2 relative -top-3">
                              {" "}
                              {manualErrors.current?.address?.firstname}{" "}
                            </span>{" "}
                            {/* Lastname */}{" "}
                            <div className="input mb-6 required">
                              <label htmlFor="lastname"> Last name </label>{" "}
                              <input
                                type="text"
                                id="lastname"
                                ref={lastname}
                                minLength={3}
                                required
                              />
                            </div>{" "}
                            <span className="text-dbase text-xs ml-2 relative -top-3">
                              {" "}
                              {manualErrors.current?.address?.lastname}{" "}
                            </span>{" "}
                            {/* {window.config["emailCheckout"] && ( */}
                            <div className="input mb-6XW">
                              <label htmlFor="lastname"> Email </label>{" "}
                              <input type="email" id="email" ref={email} />
                            </div>
                            {/* )} */}
                            <span className="text-dbase text-xs ml-2 relative -top-3">
                              {" "}
                              {manualErrors.current?.address?.email}{" "}
                            </span>{" "}
                            {/* Phone */}{" "}
                            <div className="flex items-center -space-x-3">
                              <div className="flex items-center space-x-1 border-b  -mb-1.5 border-dinputBorder">
                                {window.config["zone"] === "82" ? (
                                  <img
                                    className="w-6"
                                    src="data:image/png;base64,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"
                                    alt="ghana"
                                  />
                                ) : (
                                  <img
                                    className="w-6"
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAhCAYAAACbffiEAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAMrSURBVFhH7VhbSFRRFD1iVBj1I/QVhJMoaQ1mKSaBmJmWaWpgD7KHZlmJWoL0UMtCRSU0ykcPx2cPMsvSKZ/5IiM1K0clMUMkKzXTNAMtXe17vR8JfkhzLgwxCxb3nn3Onrlr1tlnZg8bXGaK/4F6IbpGvRBdo17IXPl1lpgcZP1sPuRiH/GHwRLxOts8T7JfmjbIRXT0QF2uAj4MzDrPkwwy4uXwe7DUVfCqj5ci8kFWIYY528ByiZmbwJLNoSwMwMjET2mWL2QRMjk1BdunYWCqjVA88INrRQQsio6BXVXiaGOatIovZBHS9KUFxnkeONGswkUiS7eDZdFxuFVE4krbfTR/65JW8gN3IUH1SWCXlmN3XSLYtfWwLzuNwIZ0mJAzZgUHYPkoUFrJF1yFJL5SIfxNLlqGuuFUEg6W7QqWRfWR4QCb4mB4VZ4TxbF0W5R8ei1l8QF3R+r7NGBJK8BytkBRsB+OZafofitYnjuJcsbJpgw4lJ9BDG2xofFRKUt7cBXC0qxhku+LSKEuVE5Q0CnFVI642Vk6fXrd8hTdURYHIaQ6BqGN6VKm9uAmRHHXBwMTY/CoisbBugR6YEdywWPaiUxnErEd80jIXmEuZQ2sCg9LmXzA1REHdSi5slZ0I6TxOhbd9sTOqgswEJwgR9wrorBBHYy+8RGsfkzHcYoSLcM9UrZ24CKkc/QzWLQRdtXGI7e7hsTYwO5JKFY+9INFoT8VvVAj5E6qNdXJZqohM4SRUAFdlMsDWgsRCtafjtwpuk/W3AO7bE41kgWXykh6aBdxSwkilubvEdf718TB+9l5eFdGid/2pR8bxLi24OJI2/de+FABx7bmS5FpsBQrsDs7aFu5waPirBSdCWXBPtT1t0ujfwfXGvkbe2rjxE+cpa0THTGkopcTsgjxfR4Ls6IAaURvcsMOZuojsK+OkCL8wa0fmdS0o6/pBRLUSdSH0G+pzl78phhaO6gf6cWQ5i1Vdg8OZQcD77oxMctraENuHaLQBQ4xI4yxxRhgC2bMCeNBtlC8Thoay9Ixcu3Z59Kfy9XD6/9F0TXqhega9UJ0i6b4A/QB3t+zIyKhAAAAAElFTkSuQmCC"
                                    alt="Lebanon"
                                  />
                                )}
                                <p className="w-14 select-none">
                                  {" "}
                                  {window != undefined &&
                                    window.config["countryCode"].substring(
                                      1
                                    )}{" "}
                                </p>{" "}
                              </div>
                              <div className="input mb-6 required ">
                                <label htmlFor="telephone"> Telephone </label>{" "}
                                <HandlePhoneModel
                                  fromCheckout={true}
                                  phone={telephone}
                                  phoneHanlder={phoneHanlder}
                                  setConfirmDisalbe={setConfirmDisalbe}
                                  AdminPhoneHandler={AdminPhoneHandler}
                                />{" "}
                                <p className="text-dbase text-xs ml-2">
                                  {" "}
                                  {err}{" "}
                                </p>{" "}
                              </div>{" "}
                            </div>{" "}
                            <span className="text-dbase text-xs ml-2">
                              {" "}
                              {manualErrors.current?.address?.telephone}{" "}
                            </span>{" "}
                          </div>{" "}
                          <div className="w-full xl:w-1/2 lg:w-1/2 pl-0  xl:pl-4 lg:pl-4">
                            {" "}
                            {/* Zone */}{" "}
                            <div className="input mb-6 relative required">
                              <label htmlFor="zone_id"> Zone </label>
                              <div className=" ">
                                {loading && (
                                  <div className="absolute top-0 left-0 w-full h-full bg-dblack  bg-opacity-10 flex items-center justify-center">
                                    <Loader styles="h-9 w-9 text-dblue ml-4" />
                                  </div>
                                )}
                                <select
                                  id="zone_id"
                                  disabled={loading}
                                  required
                                  onChange={(e) => zoneChanged(e)}
                                >
                                  {zones.length > 0 &&
                                    zones.map((z) =>
                                      z.zone_id === zone.current.id ? (
                                        <option
                                          key={z.zone_id}
                                          selected
                                          value={z.zone_id}
                                        >
                                          {" "}
                                          {z.name}{" "}
                                        </option>
                                      ) : (
                                        <option
                                          key={z.zone_id}
                                          value={z.zone_id}
                                        >
                                          {" "}
                                          {z.name}{" "}
                                        </option>
                                      )
                                    )}{" "}
                                </select>{" "}
                              </div>
                            </div>
                            {/* Town */}{" "}
                            {window.config["useTown"] && (
                              <div className="input mb-12 relative mt-12 required">
                                <label htmlFor="town_id"> Town </label>
                                <div className=" ">
                                  {loadingtown && (
                                    <div className="absolute top-0 left-0 w-full h-full bg-dblack  bg-opacity-10 flex items-center justify-center">
                                      <Loader styles="h-9 w-9 text-dblue ml-4" />
                                    </div>
                                  )}
                                  <select
                                    id="town_id"
                                    disabled={loading}
                                    required
                                    onChange={(e) => townChanged(e)}
                                  >
                                    <option> {/* Select a Town */}</option>
                                    {townes?.length > 0 &&
                                      townes?.map((t) => (
                                        <option
                                          key={t.town_id}
                                          value={t.town_id}
                                        >
                                          {" "}
                                          {t.name}{" "}
                                        </option>
                                      ))}{" "}
                                  </select>{" "}
                                </div>
                              </div>
                            )}
                            {/* Address */}
                            {manualResponse?.message}
                            <div
                              className={`input required ${
                                window.config["useTown"] ? "" : "mt-12"
                              }`}
                            >
                              <label htmlFor="address_1"> Address </label>{" "}
                              <input
                                type="text"
                                id="address_1"
                                ref={address_1}
                                minLength={3}
                                // onChange={(e) => setAddressState(e.target.value)}
                                required
                              />
                            </div>{" "}
                            <span className="text-dbase text-xs ml-2 relative -top-3">
                              {" "}
                              {manualErrors.current?.address?.address_1}{" "}
                            </span>{" "}
                            {/* More details */}{" "}
                            <div
                              className={`input ${
                                !window.config["useTown"] && "mt-6"
                              }`}
                            >
                              <label htmlFor="address_2">
                                More Address Details{" "}
                              </label>{" "}
                              <input
                                type="text"
                                id="address_2"
                                ref={address_2}
                                min={2}
                              />{" "}
                            </div>{" "}
                            {/* Comment */}{" "}
                            {/* <div className="input mb-6">
                            <label htmlFor="comment"> Comment </label>{" "}
                            <input type="text" id="comment" ref={comment} />{" "}
                          </div>{" "} */}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>
                  </>
                )}{" "}
                {/* End If user is not logged in */}{" "}
                {/* If user is logged in */}{" "}
                {loged && (
                  <>
                    <div className="text-dbase mb-1">
                      {!error.success && error.message}
                    </div>
                    <div className="cart ">
                      <div className="cart-header flex justify-between">
                        <div className={`flex items-center`}>
                          <span className="cart-icon">
                            <i className="icon icon-location" />
                          </span>{" "}
                          <span> Address </span>{" "}
                        </div>
                        <div
                          className={`text-dgreen cursor-pointer`}
                          onClick={() => setShowAddresses(!showAddresses)}
                        >
                          {!showAddresses ? (
                            <span> Show Addresses </span>
                          ) : (
                            <span> Hide Addresses </span>
                          )}{" "}
                        </div>{" "}
                      </div>{" "}
                      <div className="cart-body relative">
                        <div className=" hidden">
                          <input
                            type="text"
                            value={activeAddress.firstname}
                            ref={firstname}
                          />{" "}
                          <input
                            type="text"
                            value={activeAddress.lastname}
                            ref={lastname}
                          />{" "}
                          <input
                            type="text"
                            value={activeAddress.address_1}
                            ref={address_1}
                          />{" "}
                          <input
                            type="text"
                            value={activeAddress.address_2}
                            ref={address_2}
                          />{" "}
                          <input
                            type="text"
                            value={activeAddress.telephone}
                            ref={telephone}
                          />{" "}
                          <input
                            type="text"
                            value={activeAddress.zone_id}
                            ref={zone.zone_id}
                          />{" "}
                          <input
                            type="text"
                            value={activeAddress.town_id}
                            ref={town.town_id}
                          />{" "}
                          <input type="text" value={state.email} ref={email} />{" "}
                        </div>
                        <div>
                          {Object.keys(manualErrors.current).map((errorKey) => (
                            <div>
                              {" "}
                              {errorKey === "address" &&
                              manualErrors.current[errorKey]["errorCode"] !==
                                "stock" ? (
                                <div className="border  border-dinputBorder py-4 px-2 mb-4">
                                  <h2 className="text-lg font-semibold mb-2">
                                    Address Errors{}
                                  </h2>{" "}
                                  {Object.keys(
                                    manualErrors.current[errorKey]
                                  ).map((addressErrorKey) => (
                                    <div className="text-dbase">
                                      <span className="capitalize">
                                        {" "}
                                        {addressErrorKey.replace("_", " ")}:
                                      </span>{" "}
                                      <span className="ml-2">
                                        {" "}
                                        {
                                          manualErrors.current[errorKey][
                                            addressErrorKey
                                          ]
                                        }{" "}
                                      </span>{" "}
                                    </div>
                                  ))}{" "}
                                </div>
                              ) : (
                                manualErrors.current[errorKey]["errorCode"] !=
                                  "stock" && (
                                  <div className="border  border-dinputBorder py-4 px-2 mb-4">
                                    {/* {Object.keys(manualErrors.current[errorKey]).map( */}
                                    {/* (addressErrorKey) => ( */}
                                    <div className="text-dbase">
                                      <span className="capitalize">
                                        {/* {addressErrorKey.replace("_", " ")}: */}
                                      </span>{" "}
                                      <span className="ml-2">
                                        {
                                          manualErrors.current[errorKey][
                                            "errorMsg"
                                          ]
                                        }{" "}
                                      </span>{" "}
                                    </div>
                                  </div>
                                )
                              )}{" "}
                            </div>
                          ))}{" "}
                        </div>{" "}
                        {loading && (
                          <div className="absolute top-0 left-0 w-full h-full bg-dblack  bg-opacity-10 flex items-center justify-center">
                            <Loader styles="h-9 w-9 text-dblue ml-4" />
                          </div>
                        )}{" "}
                        <p>
                          <span> First name: </span>{" "}
                          <span className={`font-semibold`}>
                            {" "}
                            {activeAddress.firstname}{" "}
                          </span>{" "}
                        </p>{" "}
                        <p>
                          <span> Last name: </span>{" "}
                          <span className={`font-semibold`}>
                            {" "}
                            {activeAddress.lastname}{" "}
                          </span>{" "}
                        </p>{" "}
                        <p>
                          <span> Zone: </span>{" "}
                          <span className={`font-semibold`}>
                            {" "}
                            {activeAddress.zone}{" "}
                          </span>{" "}
                        </p>{" "}
                        {window.config["useTown"] && (
                          <p>
                            <span> Town: </span>{" "}
                            <span className={`font-semibold`}>
                              {" "}
                              {activeAddress.town_name}{" "}
                            </span>{" "}
                            {townRequired && (
                              <span className={`text-dbase`}>
                                Town is Required
                              </span>
                            )}
                          </p>
                        )}
                        <p>
                          <span> Address: </span>{" "}
                          <span className={`font-semibold`}>
                            {" "}
                            {activeAddress.address_1 +
                              " " +
                              activeAddress.address_2}{" "}
                          </span>{" "}
                        </p>{" "}
                        <p>
                          <span> Telephone: </span>{" "}
                          <span className={`font-semibold`}>
                            {" "}
                            {activeAddress.telephone}{" "}
                          </span>{" "}
                        </p>{" "}
                        <Link
                        href={
                            "/account/address/" +
                            activeAddress.address_id +
                            "/edit?&from-checkout=true"
                        }
                        className="text-white bg-dblue px-2 py-1 mt-1 inline-block"
                      >
                        <span> Edit address </span>{" "}
                        <i className="icon icon-edit ml-1"> </i>{" "}
                      </Link>{" "}
                        {/*Addresses*/} {/* +96103006964 */}
                        {showAddresses && (
                          <div
                            className={` py-2 flex-row md:flex w-full overflow-scroll`}
                          >
                            {/* <Link
                            // href={`${path}/account/address/add`}
                            className={`text-sm bg-dgreen text-white border border-dinputBorder p-2 flex items-center justify-center flex-col`}
                            style={{ minWidth: "19%" }}
                          >
                            <span className={`font-semibold`}>
                              Add New Address{" "}
                            </span>{" "}
                            <span className={`text-3xl`}> + </span>{" "}
                          </Link>{" "} */}
                            {addresses.map((address) => (
                              <div
                                key={address.address_id}
                                onClick={() => changeAddress(address, true)}
                                className={`text-sm bg-white border border-dinputBorder p-2 hover:bg-dgrey1 hover:bg-opacity-20 cursor-pointer`}
                                style={{ minWidth: "19%" }}
                              >
                                <p>
                                  <span> First name: </span>{" "}
                                  <span className={`font-semibold`}>
                                    {" "}
                                    {address.firstname}{" "}
                                  </span>{" "}
                                </p>{" "}
                                <p>
                                  <span> Last name: </span>{" "}
                                  <span className={`font-semibold`}>
                                    {" "}
                                    {address.lastname}{" "}
                                  </span>{" "}
                                </p>{" "}
                                <p>
                                  <span> Zone: </span>{" "}
                                  <span className={`font-semibold`}>
                                    {" "}
                                    {address.zone}{" "}
                                  </span>{" "}
                                </p>{" "}
                                {window.config["useTown"] && (
                                  <p>
                                    <span> Town: </span>{" "}
                                    <span className={`font-semibold`}>
                                      {" "}
                                      {address.town_name}{" "}
                                    </span>{" "}
                                  </p>
                                )}
                                <p>
                                  <span> Address: </span>{" "}
                                  <span className={`font-semibold`}>
                                    {" "}
                                    {address.address_1 +
                                      " " +
                                      address.address_2}{" "}
                                  </span>{" "}
                                </p>{" "}
                                <p>
                                  <span> Telephone: </span>{" "}
                                  <span className={`font-semibold`}>
                                    {address.telephone}
                                  </span>
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
                {/* End If user is logged in */}
                <div className="cart bg-white mt-3 px-4 py-3 ">
                  <div className="flex cart-header ">
                    <span className="  rounded-full p-2 bg-dgrey ">
                      <FaComments className="bg-dgrey" />
                    </span>{" "}
                    <span className="text-d18 ml-1 mt-1"> Comment </span>{" "}
                  </div>{" "}
                  <div className="cart-body relative p-1">
                    {" "}
                    <div>
                      <textarea
                        className="w-full p-2  border-2  border-dinputBorder"
                        rows="3"
                        ref={comment}
                      />
                    </div>
                  </div>{" "}
                </div>
                <div className="cart bg-white mt-3 p-4">
                  <div className="flex cart-header pb-2">
                    <span className="  rounded-full p-2 bg-dgrey ">
                      <FaBus className="bg-dgrey" />
                    </span>{" "}
                    <span className="text-d18 ml-1 mt-1">
                      {" "}
                      Shipping Method{" "}
                    </span>{" "}
                  </div>{" "}
                  <div className="cart-body relative">
                    {" "}
                    {loading && (
                      <div className="absolute top-0 left-0 w-full h-full bg-dblack  bg-opacity-10 flex items-center justify-center">
                        <Loader styles="h-9 w-9 text-dblue ml-4" />
                      </div>
                    )}{" "}
                    {manualResponse?.shipping_method && (
                      <div>
                        <input
                          type="radio"
                          checked
                          className="mr-2"
                          onChange={() => {}}
                        />{" "}
                        <label>
                          {" "}
                          {manualResponse?.order_total?.map(
                            (order) =>
                              order.code === "shipping" &&
                              order.title + " " + order.text
                          )}{" "}
                        </label>{" "}
                      </div>
                    )}{" "}
                  </div>{" "}
                </div>{" "}
                {/* End shipping method */}
                {/* Payment Method */}
                <div className="cart mt-3 bg-white py-3 px-4">
                  <div className="flex cart-header pb-2">
                    <span className="  rounded-full p-2 bg-dgrey ">
                      <FaMoneyBillWaveAlt className="bg-dgrey" />
                    </span>{" "}
                    <span className="text-d18 ml-1 mt-1"> Payment Method </span>{" "}
                  </div>{" "}
                  <div className="cart-body relative">
                    {" "}
                    {loading && (
                      <div className="absolute top-0 left-0 w-full h-full bg-dblack  bg-opacity-10 flex items-center justify-center">
                        <Loader styles="h-9 w-9 text-dblue ml-4" />
                      </div>
                    )}
                    {manualResponse?.payment_method &&
                      Object.keys(manualResponse["payment_method"]).map(
                        (key, index) => (
                          <div
                            key={manualResponse.payment_method[key]["code"]}
                            className="mb-1"
                          >
                            <input
                              id={manualResponse.payment_method[key]["code"]}
                              type="radio"
                              name="payment_method"
                              className="mr-2"
                              onChange={
                                () =>
                                  handlePaymentMethodChange(
                                    manualResponse.payment_method[key]["code"]
                                  )
                                // setPaymentMethod(
                                //   manualResponse.payment_method[key]["code"]
                                // )
                              }
                              checked={
                                manualResponse.payment_method[key]["code"] ===
                                activePaymentMethod
                              }
                            />
                            <label
                              for={manualResponse.payment_method[key]["code"]}
                            >
                              {" "}
                              {manualResponse.payment_method[key]["title"]}{" "}
                            </label>{" "}
                          </div>
                        )
                      )}
                  </div>
                </div>
                {/*End  Payment Method */}
                {/* My cart */}
                <div className="cart bg-white my-3 p-4">
                  <div className="cart-header justify-between">
                    <span className="flex items-center">
                      <span className="cart-icon">
                        <i className="icon icon-basket" />
                      </span>{" "}
                      <span className="text-d18"> My Cart </span>{" "}
                    </span>{" "}
                    {/* Cart error */}{" "}
                    <span className="text-dbase">
                      {" "}
                      {manualErrors.current?.product?.stock}{" "}
                    </span>{" "}
                  </div>

                  <div className="cart-body relative">
                    {" "}
                    {loading && (
                      <div className="absolute top-0 left-0 w-full h-full bg-dblack  bg-opacity-10 flex items-center justify-center">
                        <Loader styles="h-9 w-9 text-dblue ml-4" />
                      </div>
                    )}{" "}
                    {manualResponse?.order_product?.length > 0 &&
                      manualResponse?.order_product.map((product) => (
                        // Desktop Design
                        <div
                          className={`hidden xl:flex lg:flex mb-2  py-2 rounded ${
                            product.stock
                              ? "bg-white "
                              : "bg-dbase bg-opacity-10"
                          }`}
                        >
                          <Link
                            href={`${product?.name
                              ?.replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                              ?.replace(/\s+/g, "-")
                              .replace("/", "-")}/p=${product.product_id}`}
                            onClick={() => setMarketingData({})}
                            key={product.product_id}
                          >
                            <img
                              onClick={() =>
                                router.push(
                                  `${product.name
                                    .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                                    .replace(/\s+/g, "-")
                                    .replace("/", "-")}/p=${product.product_id}`
                                )
                              }
                              src={product.image}
                              className="w-24 block rounded ml-2"
                              alt={product.name}
                            />{" "}
                          </Link>{" "}
                          <div className="flex flex-col justify-between items-start px-9 text-dblack py-2 flex-grow ">
                            <p className="text-d13 text-dgrey1">
                              {" "}
                              {product.sku}{" "}
                            </p>{" "}
                            <p
                              className=" text-sm font-semibold"
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(product.name),
                              }}
                            />{" "}
                            {product.option.length > 0 && (
                              <p className="text-dgreen text-sm">
                                {" "}
                                {product.option[0].name +
                                  " (" +
                                  product.option[0].value +
                                  ")"}{" "}
                              </p>
                            )}{" "}
                            <button
                              type="button"
                              className="cursor-pointer text-dgrey1 text-xs text-center"
                              onClick={(e) => updateQuantity(e, product.key, 0)}
                            >
                              <span> Remove </span>{" "}
                              <i className="icon icon-trash ml-1" />
                            </button>{" "}
                          </div>
                          <div className="py-2 px-6 w-48 flex flex-col items-end text-dblack justify-center">
                            <span className=" font-semibold text-lg">
                              {" "}
                              {product.price_formatted}{" "}
                            </span>{" "}
                            <div className="flex mt-4">
                              <button
                                type="button"
                                onClick={(e) =>
                                  updateQuantity(
                                    e,
                                    product.key,
                                    Number(product.quantity) - 1
                                  )
                                }
                                className="text-center w-10 h-10  text-2xl border border-dinputBorder rounded-tl rounded-bl cursor-pointer hover:shadow"
                              >
                                -
                              </button>{" "}
                              <input
                                type="number"
                                className="border border-dinputBorder w-20 h-10 border-r-0 border-l-0 text-center"
                                value={product.quantity}
                                onChange={() => {}}
                              />{" "}
                              <button
                                type="button"
                                onClick={(e) =>
                                  updateQuantity(
                                    e,
                                    product.key,
                                    Number(product.quantity) + 1
                                  )
                                }
                                className="text-center w-10 h-10  text-2xl border border-dinputBorder  rounded-tr rounded-br cursor-pointer hover:shadow"
                              >
                                +
                              </button>{" "}
                            </div>{" "}
                          </div>{" "}
                          {/* Mobile design */}{" "}
                          {/* <Link
                            // href={`${product.name.replace(/\s+&amp;\s+|\s+&gt;\s+/g,"-").replace(/\s+/g,'-').replace('/','-')}/p=${product.product_id}`}
                            className={`flex xl:hidden lg:hidden mb-2 -mx-2 py-2 rounded ${
                              product.stock
                                ? "bg-white "
                                : "bg-dbase bg-opacity-10"
                            }`}
                          >
                            <div className="w-3/12">
                              <img
                                onClick={() =>
                                  router.push(
                                    `${product.name
                                      .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                                      .replace(/\s+/g, "-")
                                      .replace("/", "-")}/p=${
                                      product.product_id
                                    }`
                                  )
                                }
                                src={product.image}
                                className="w-full block rounded"
                                alt={product.name}
                              />{" "}
                              <div className="flex flex-col items-end text-dblack justify-center">
                                <div className="flex mt-2">
                                  <button
                                    onClick={(e) =>
                                      updateQuantity(
                                        e,
                                        product.key,
                                        Number(product.quantity) - 1
                                      )
                                    }
                                    className="w-1/3 h-10 text-2xl border border-dinputBorder rounded-tl rounded-bl cursor-pointer hover:shadow"
                                  >
                                    -
                                  </button>{" "}
                                  <input
                                    type="number"
                                    className="border border-dinputBorder w-1/3 h-10 border-r-0 border-l-0 text-center"
                                    value={product.quantity}
                                  />{" "}
                                  <button
                                    onClick={(e) =>
                                      updateQuantity(
                                        e,
                                        product.key,
                                        Number(product.quantity) + 1
                                      )
                                    }
                                    className="w-1/3 h-10 text-2xl border border-dinputBorder  rounded-tr rounded-br cursor-pointer hover:shadow"
                                  >
                                    +
                                  </button>{" "}
                                </div>{" "}
                              </div>{" "}
                            </div>{" "}
                            <div className="w-9/12 flex flex-col justify-between items-start pl-6 text-dblack py-2 flex-grow ">
                              <p className="text-d13 text-dgrey1">
                                {" "}
                                {product.sku}{" "}
                              </p>{" "}
                              <p
                                className=" text-sm "
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(product.name)
                                }}
                              ></p>{" "}
                              {product.option.length > 0 && (
                                <p className="text-dgreen text-sm">
                                  {" "}
                                  {product.option[0].name +
                                    " (" +
                                    product.option[0].value +
                                    ")"}{" "}
                                </p>
                              )}{" "}
                              <span className=" font-semibold text-lg">
                                {" "}
                                {product.price_formatted}{" "}
                              </span>
                              <button
                                className="cursor-pointer text-dgrey1 text-xs"
                                onClick={(e) =>
                                  updateQuantity(e, product.key, 0)
                                }
                              >
                                <span> Remove </span>{" "}
                                <i className="icon icon-trash ml-1"> </i>{" "}
                              </button>{" "}
                            </div>{" "}
                          </Link> */}
                        </div>
                      ))}
                  </div>
                </div>
                {/* End My cart */}
              </div>
              <div
                className={`relative w-full pb-3 md:pb-0 md:w-4/12 ml-0 md:ml-4 bg-dprimarybg`}
              >
                <div
                  className={`${
                    state.admin &&
                    width > 650 &&
                    "fixed w-full md:w-4/12 md:pr-6 mr-24 z-40 bg-dprimarybg "
                  } `}
                >
                  <div
                    className={` p-6 rounded  sticky top-7  border border-dgrey1 border-opacity-20 `}
                  >
                    {loading && (
                      <div className="absolute top-0 left-0 w-full h-full bg-dblack  bg-opacity-10 flex items-center justify-center">
                        <Loader styles="h-9 w-9 text-dblue ml-4" />
                      </div>
                    )}
                    <h1 className="pr-bold text-xll text-dblack mb-4 leading-26">
                      Order Summary
                    </h1>
                    <p
                      className={
                        coupon?.current?.value?.length > 1 &&
                        manualErrors?.current?.temp_coupon
                          ? "text-xs text-dbase"
                          : "hidden"
                      }
                    >
                      {coupon.current?.value?.length > 1 &&
                      manualErrors.current?.temp_coupon
                        ? manualErrors?.current?.temp_coupon
                        : ""}
                    </p>
                    <div className="flex mb-6">
                      <input
                        type="text"
                        className="border border-dinputBorder flex-grow rounded-tl rounded-bl border-r-0 h-10 px-5"
                        placeholder="Coupon Code or Gift Card"
                        ref={coupon}
                        onChange={() => handleCouponChange()}
                      />
                      <div
                        onClick={() => setCoupon()}
                        className="bg-dblue text-white px-3 h-10 rounded-tr rounded-br text-sm"
                      >
                        <p className="text-center mt-3">APPLY</p>
                      </div>{" "}
                    </div>{" "}
                    {/* <div className="flex justify-between items-center text-dgrey1 font-light mt-1">
                      <p>
                        {" "}
                        Subtotal({cartProducts.length}
                        items){" "}
                      </p>{" "}
                    </div> */}
                    {/* <h2 className="mt-4 mb-2 font-semibold text-lg">
                      Order Totals
                    </h2> */}
                    <div>
                      {manualResponse?.order_total?.map((total) => (
                        <div
                          className={`flex items-center justify-between mb-1 ${
                            total.code === "ultimate_coupons"
                              ? "text-dgreen"
                              : "text-dblack"
                          } ${
                            total.code === "total" &&
                            " border-t pt-3  border-dgrey1 border-opacity-20 pr-semibold text-xl"
                          }`}
                          key={total.title}
                        >
                          <span
                            className={`flex ${
                              total.code !== "total" && "pr-light"
                            }`}
                          >
                            {" "}
                            {total.title}{" "}
                            {total.code === "sub_total" && (
                              <div className=" ml-1">
                                <p>
                                  {" "}
                                  ({cartProducts.length}
                                  items){" "}
                                </p>{" "}
                              </div>
                            )}
                          </span>{" "}
                          <span classsName="text-xl"> {total.text} </span>{" "}
                        </div>
                      ))}{" "}
                    </div>
                    {window.config["termCondition"] && (
                      <div className="pt-3">
                        <input
                          type="checkbox"
                          ref={termCondition}
                          value="1"
                          required
                        />{" "}
                        I have read and agree to the{" "}
                        <Link href="/information/13" className="text-dblue">
                          Terms & Conditions
                        </Link>{" "}
                      </div>
                    )}
                    {window.config["loginRequired"] && !loged ? (
                      <a
                        href
                        disabled="true"
                        className="block text-center h-12 bg-dblue hover:bg-dbluedark  text-white rounded w-full mt-4 pt-3"
                        onClick={() => {
                          dispatchAccount({
                            type: "setShowOver",
                            payload: true,
                          });
                          dispatchAccount({
                            type: "setShowLogin",
                            payload: true,
                          });
                          dispatchAccount({
                            type: "setShowSignup",
                            payload: false,
                          });
                        }}
                      >
                        {" "}
                        CONFIRM ORDER{" "}
                      </a>
                    ) : (
                      <button
                        disabled={confirmDisable}
                        className={`block text-center h-12  ${
                          confirmDisable
                            ? `bg-dgrey1 cursor-not-allowed hover:bg-dgrey1`
                            : `bg-dblue hover:bg-dbluedark`
                        } text-white rounded w-full mt-4 `}
                      >
                        {
                          confirmDisable && loading ? (
                            <div className="lds-ellipsis">
                              <div />
                              <div />
                              <div />
                              <div />
                            </div>
                          ) : loading ? (
                            <span className="flex items-left justify-between ">
                              <span></span>{" "}
                              <Loader styles="h-9 w-9 text-white " />
                              <span></span>
                            </span>
                          ) : window.config["site-url"] ===
                              "https://www.ishtari.com" ||
                            Cookies.get("site-local-name") === "ishtari" ? (
                            "Place Your Order In " +
                            (manualResponse?.default_currency
                              ? manualResponse?.default_currency
                              : "USD")
                          ) : (
                            "CONFIRM ORDER"
                          )
                          // "Confirm Order"
                        }
                      </button>
                    )}
                    {/* <button
                    disabled={confirmDisable}
                    className={`block text-center h-12  ${
                      confirmDisable
                        ? `bg-dgrey1 cursor-not-allowed hover:bg-dgrey1`
                        : `bg-dblue hover:bg-dbluedark`
                    } text-white rounded w-full mt-4 `}
                  >
                    {confirmDisable && loading ? (
                      <div className="lds-ellipsis">
                        <div />
                        <div />
                        <div />
                        <div />
                      </div>
                    ) : (
                      `CONFIRM ORDER`
                    )}
                  </button> */}
                    {
                      <>
                        <button
                          data-sc-key={siResponse?.secret_key}
                          id="pay"
                          style={{ display: "none" }}
                          data-name="Ishtari Lebanon"
                          data-operation="create.payment"
                          data-description={siResponse?.order_id}
                          data-reference={siResponse?.order_id}
                          data-amount={siResponse?.amount}
                          data-color="#1733ff"
                        >
                          Confirm with payment
                        </button>
                        {/* <input type="button" value="Pay with Payment Page" onClick={() => } /> */}
                      </>
                    }{" "}
                  </div>
                  {(window.config["site-url"] === "https://www.ishtari.com" ||
                    Cookies.get("site-local-name") === "ishtari") && (
                    <div
                      className={`${
                        state.admin &&
                        width > 650 &&
                        "fixed  w-full md:w-3/12 pb-4 "
                      } `}
                    >
                      <div
                        className={` ${
                          (manualResponse?.sub_total >=
                            curr?.data?.allowed_amount_to_pay_in_lbp ||
                            manualResponse?.sub_total <
                              curr?.data
                                ?.minimum_amount_to_change_currency_in_checkout ||
                            loading) &&
                          "hidden"
                        } "border border-dinputBorder mt-2 p-2"`}
                      >
                        <div>
                          <h2 className="pl-4 pt-2 font-semibold">
                            Select payment currency
                          </h2>
                          <h2 className="flex gap-6 pt-3">
                            <span
                              className="pl-4 cursor-pointer"
                              onClick={() => changeCurrency("USD")}
                            >
                              {/* {Cookies.get("currency") === "USD" ? (
                              <input
                                name="currency"
                                type="radio"
                                ref={termCondition}
                                value="USD"
                                required
                                checked

                              />
                            ) : ( */}
                              <span>
                                {" "}
                                <input
                                  // className={`${
                                  //   manualResponse.sub_total > 50 && "disabled focus:outline-none focus:ring-2"
                                  // }`}
                                  name="currency"
                                  type="radio"
                                  ref={termCondition}
                                  value="USD"
                                  required
                                  checked={
                                    manualResponse?.default_currency ===
                                      "USD" || "checked"
                                  }
                                  disabled={`${
                                    manualResponse?.sub_total >=
                                      curr?.data
                                        ?.allowed_amount_to_pay_in_lbp &&
                                    manualResponse.sub_total <
                                      curr?.data
                                        ?.minimum_amount_to_change_currency_in_checkout
                                      ? "disabled"
                                      : ""
                                  }`}
                                />
                                {}
                                {/* )} */}
                              </span>
                              <span className="pl-2">USD</span>
                            </span>

                            <span
                              className="cursor-pointer"
                              onClick={() => changeCurrency("LBP")}
                            >
                              <span>
                                {/* {Cookies.get("currency") === "LBP" ? (
                              <input
                                name="currency"
                                type="radio"
                                ref={termCondition}
                                value="LBP"
                                required
                                checked


                              />
                            ) : ( */}
                                <input
                                  // className={`${
                                  //   manualResponse.sub_total > 50 && "disabled"
                                  // }`}
                                  name="currency"
                                  type="radio"
                                  ref={termCondition}
                                  value="LBP"
                                  checked={
                                    manualResponse?.default_currency ===
                                      "LBP" && "checked"
                                  }
                                  required
                                  disabled={`${
                                    manualResponse?.sub_total >=
                                      curr?.data
                                        ?.allowed_amount_to_pay_in_lbp ||
                                    manualResponse?.sub_total <
                                      curr?.data
                                        ?.minimum_amount_to_change_currency_in_checkout
                                      ? "disabled focus:outline-none focus:ring-2"
                                      : ""
                                  }`}
                                />
                                {/* )} */}
                              </span>{" "}
                              <span className="pl-2">LBP</span>
                            </span>
                          </h2>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* customer wallet */}
                {/* <div className="p-5 rounded top-7 border border-dgrey1 border-opacity-20 mt-6">
                  {loading && (
                    <div className="absolute top-0 left-0 w-full h-full bg-dblack  bg-opacity-10 flex items-center justify-center">
                      <Loader styles="h-9 w-9 text-dblue ml-4" />
                    </div>
                  )}
                  <div className="flex justify-between">
                    <h1 className="pr-bold text-xll text-dblack mb-4 leading-26">
                      Customer Balance
                    </h1>
                    <div className="pr-semibold">{walletBalance}</div>
                  </div>

                  <div className="text-sm">
                    You can utilize your entire balance or a specific amount to
                    deduct from the total amount of your order.
                  </div>
                  <div className="mt-4 flex ">
                    <input
                      type="text"
                      className="border border-dinputBorder flex-grow rounded-tl rounded-bl border-r-0 h-10 px-5"
                      placeholder="Enter an amount"
                      ref={balanceAmount}
                      onChange={() => handleBalanceAmountChance()}
                    />
                    <div
                      onClick={() => applyBalance()}
                      className="bg-dblue text-white px-3 h-10 rounded-tr rounded-br text-sm cursor-pointer"
                    >
                      <p className="text-center mt-3">APPLY</p>
                    </div>{" "}
                  </div>
                </div> */}
              </div>
            </div>{" "}
          </form>
        )}{" "}
        <code>
          {" "}
          {
            // JSON.stringify(manualResponse)
          }{" "}
        </code>{" "}
        {/* End If not cart empty , address empty , loading cart or account */}{" "}
      </div>
    </div>
  );
}

export default CheckoutCompnents;

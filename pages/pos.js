import { useState, useEffect, useContext, useRef } from "react";
import buildLink from "../urls";
import { CartContext } from "../contexts/CartContext";
import HandlePhoneModel from "@/components/PhoneHanlder";
import PointsLoader from "../components/PointsLoader";
import { AccountContext } from "../contexts/AccountContext";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { axiosServer } from "@/axiosServer";

export default function Pos() {
  const [stateAccount, dispatchA] = useContext(AccountContext);

  const [cart, setCart] = useState();
  const [selectCart, SetSelectCart] = useState();
  const [state, dispatch] = useContext(CartContext);
  const [isValid, setIsValid] = useState(true);
  const [confirmDisable, setConfirmDisalbe] = useState(false);
  const [showCalculte, setShowCalculate] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [modificationError, setModificationError] = useState({});
  const [showSearch, setShowSearch] = useState(false);
  const [dataSearch, setDataSearch] = useState(false);
  const [holdArray, setHoldArray] = useState([]);

  const [success, setSuccess] = useState(false);
  // const printRef = useRef();
  const qtyRef = useRef("");

  const typeRef = useRef("");
  const amountRef = useRef("");
  const remarqueRef = useRef("");

  // const [telephone, setTelephone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  // const [coupon, setCoupon] = useState("");
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState({});
  const [errorProduct, setErrorProduct] = useState("");
  const [change, setChange] = useState();
  const [id, setId] = useState();
  const [opacity, setOpacity] = useState(false);

  const [manualResponse, setManualResponse] = useState();
  const [myArray, setMyArray] = useState([]);
  const [errorArray, setErrorArray] = useState([]);

  const [users, setUsers] = useState([]);

  const firstname = useRef("");
  const lastname = useRef("");

  const telephone = useRef("");
  const router = useRouter();
  const couponRef = useRef("");

  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      typeRef.current.value = "";
      amountRef.current.value = "";
      remarqueRef.current.value = "";
      inputRef.current.focus();
    }, 100); // Delay in milliseconds

    return () => clearTimeout(timer);
  }, []);

  function setCoupon() {
    if (couponRef.current.value.length > 1) {
      manual(false, false, true);
    } else {
    }
  }
  function neworder() {
    document.getElementById("code")?.focus();
    setCart("");
    SetSelectCart("");
    setManualResponse("");
    setConfirmDisalbe(false);
    setError({});
    setFirstName("");
    setLastName("");
    setErrorProduct("");
    // setCoupon("");
    couponRef.current.value = "";
    typeRef.current.value = "";
    amountRef.current.value = "";
    remarqueRef.current.value = "";
    setSuccess(false);
    setOrderSuccess(false);
    setOpacity(false);
    dispatch({
      type: "setProducts",
      payload: []
    });
    dispatch({
      type: "setTotals",
      payload: 0
    });
    dispatch({
      type: "setProductsCount",
      payload: 0
    });
    firstname.current.value = "";
    lastname.current.value = "";
    telephone.current.value = "";
    amountRef.current.value = "";
    remarqueRef.current.value = "";
    typeRef.current.value = "";

    telephone.current.value = "";
    console.log("yess");
    var body = {
      order_product: [],
      customer_id: "",
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
      zone_id: "",
      zone: "",
      modification_type: "",
      modification: "",
      modification_remarque: "",

      is_web: true,
      //   Cookies.get("change") === "false" || Cookies.get("change") === false
      //     ? false
      //     : true,
      // user_id: Cookies.get("salsMan")
      //   ? Cookies.get("salsMan")
      //   : Cookies.get("user_id"),
      user_id: 1069,

      source_id: 1,
      coupon: "",
      code_version: window.innerWidth > 600 ? "web_desktop" : "web_mobile"
    };
    axiosServer
      .post(
        buildLink("manual", undefined, undefined, window.config["site-url"]),
        body
      )
      .then((response) => {
        // setManualResponse(response?.data?.data);
      });
    document.getElementById("code").focus();
  }

  const phoneHanlder = (childData, isValid) => {
    // console.log(telephone.current.value);
    if (isValid === true) {
      telephone.current.value = childData;
    } else {
      telephone.current.value = childData;
    }

    setIsValid(isValid);
  };
  const AdminPhoneHandler = (obj, isValid) => {
    console.log(obj);
    if (isValid) {
      firstname.current.value = obj.firstname !== "undefined" && obj.firstname;
      lastname.current.value = obj.lastname !== "undefined" && obj.lastname;
      telephone.current.value = obj.telephone;

      const data = {
        name: obj.city,
        value: obj.zone
      };
      manual(false);
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

  useEffect(() => {
    // Load the array from local storage on component mount
    const storedArray = localStorage.getItem("orders");
    if (storedArray) {
      setMyArray(JSON.parse(storedArray));
    }
  }, []);

  useEffect(() => {
    document?.getElementById("code")?.focus();
  }, []);

  useEffect(() => {
    // Load the array from local storage on component mount
    const errorArray1 = localStorage.getItem("errorArray");
    if (errorArray1) {
      setErrorArray(JSON.parse(errorArray1));
    }
  }, []);

  // useEffect(() => {
  //   // Save the array to local storage whenever it changes

  //   localStorage.setItem("orders", JSON.stringify(myArray));
  // }, [myArray]);

  useEffect(() => {
    // Save the array to local storage whenever it changes
    localStorage.setItem("errorArray", JSON.stringify(errorArray));
  }, [errorArray]);

  useEffect(() => {
    // Load the array from local storage on component mount
    const storedHold = localStorage.getItem("hold-order");
    try {
      if (storedHold) {
        setHoldArray(JSON.parse(storedHold));
      }
    } catch (error) {
      console.error("Error parsing data from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    // Save the array to local storage whenever it changes

    localStorage.setItem("hold-order", JSON.stringify(holdArray));
  }, [holdArray]);

  function modification() {
    setModificationError({});
    // alert(amountRef.current.value )
    if (remarqueRef.current.value === "" && amountRef.current.value === "") {
      setModificationError({
        remarque: "remarque is required",
        amount: "modifiction number is required"
      });
    } else if (amountRef.current.value === "") {
      setModificationError({ amount: "modifiction number is required" });
    } else if (remarqueRef.current.value === "") {
      setModificationError({
        remarque: "remarque is required"
      });
    } else {
      manual(false, false, true);
    }
  }
  function getcart() {
    axiosServer
      .get(buildLink("cart", undefined, undefined, window.config["site-url"]))
      .then((response) => {
        if (response.error) {
          setCart([]);
          // setError("Product Not found");
        } else {
          setCart(response?.data?.data);
          // manual()
        }
      });
  }

  function getUsers() {
    axiosServer
      .get(
        buildLink(
          "getSalesMan",
          undefined,
          undefined,
          window.config["site-url"]
        )
      )
      .then((response) => {
        console.log(response?.data);
        if (response) {
          setUsers(response?.data);
        }
      });
  }
  useEffect(() => {
    document.getElementById("code")?.focus();

    getcart();
    getUsers();
    // if(window?.location?.href.indexOf('new_tab')> -1){
    //   neworder()

    // }
  }, [router.aspath]);

  useEffect(() => {
    if (cart?.products?.length > 0) {
      // alert(1)
      // manual(true);
      document.getElementById("code")?.focus();
    }
  }, [cart]);

  function changeResult(value) {
    // cart?.totals?.map((total) => {
    //   if (total.title === "Total") {
    //     setChange(total.value);
    //   }
    // });

    if (value !== "") {
      cart?.totals?.map((total) => {
        if (total.title === "Total") {
          setChange(total.value - Number(value));
        }
      });
    } else {
      cart?.totals?.map((total) => {
        if (total.title === "Total") {
          setChange(total.value);
        }
      });
    }
  }

  function addToCart(e) {
    setErrorProduct("");

    if (e.target.value.trim() !== "" && e.key === "Enter") {
      setLoader(true);

      // Send request
      var obj = {
        code: e.target.value
      };
      axiosServer
        .post(
          buildLink("pos", undefined, undefined, window.config["site-url"]) +
            "&test=true",
          obj
        )
        .then((responses) => {
          if (responses.status === 200 && responses.data.success) {
            axiosServer
              .get(
                buildLink(
                  "cart",
                  undefined,
                  window.innerWidth,
                  window.config["site-url"]
                )
              )
              .then((response) => {
                setLoader(false);
                setCart([]);

                setCart(response?.data?.data);
                SetSelectCart();
                ////manual(false);
                dispatch({
                  type: "setProducts",
                  payload:
                    response.data?.data?.products?.length > 0
                      ? response.data.data.products
                      : []
                });
                dispatch({
                  type: "setTotals",
                  payload:
                    response.data?.data?.totals?.length > 0
                      ? response.data.data.totals
                      : 0
                });
                dispatch({
                  type: "setProductsCount",
                  payload:
                    response.data?.data?.total_product_count > 0
                      ? response.data.data.total_product_count
                      : 0
                });
                dispatch({
                  type: "loading",
                  payload: false
                });
              });
            document.getElementById("code").value = "";
          } else {
            setErrorProduct(responses?.data?.errors[0]?.errorMsg);
            setLoader(false);
          }
        });
      document.getElementById("code").focus();
    }
    if (e.target.value?.length < 1) {
      FocusCart(e);
    }
  }

  function search(e) {
    const value = e.target.value;

    axiosServer
      .get(
        buildLink(
          "searchProduct",
          undefined,
          undefined,
          window.config["site-url"]
        ) + value
      )
      .then((response) => {
        console.log(response?.data);
        if (response.data.success) {
          setDataSearch(response?.data?.data);
        }
      });
  }
  function FocusCart(e) {
    document.getElementById("item0")?.focus();
    SetSelectCart(0);
  }
  function handleClick(e, i, qty, cartId) {
    // up arrow
    var select;
    if (e.keyCode === 38) {
      if (i != 0) {
        select = i - 1;
        SetSelectCart(select);
        // select = select - 1;
        console.log("item" + select);
        document.getElementById("item" + select).focus();
      } else {
        select = Number(cart?.products?.length) - 1;
        SetSelectCart(select);
        select = Number(cart?.products?.length) - 1;
        document.getElementById("item" + select).focus();
      }
    }
    //down arrow
    if (e.keyCode === 40) {
      if (cart.products.length > i + 1) {
        SetSelectCart(i + 1);

        select = i + 1;
        document.getElementById("item" + select).focus();
      } else {
        SetSelectCart(0);
        document.getElementById("item0").focus();
      }
    }
    console.log(e);
    //left Arrow  qty - 1
    if (qty > 0 && e.keyCode === 37) {
      qty = Number(qty) - 1;
      updatequnatity(cartId, qty, i);
    }

    //right arrow aty + 1
    if (e.keyCode === 39) {
      qty = Number(qty) + 1;
      updatequnatity(cartId, qty, i);
    }
    if (e.keyCode === 88) {
      updatequnatity(cartId, 0);
    }
    if (e.keyCode === 13) {
      updatequnatity(cartId, qtyRef.current.value);
    }
  }

  function changeQuantity(key, quantity) {
    console.log("omar" + quantity);

    updatequnatity(key, quantity);
  }

  function updatequnatity(key, quantity, i) {
    const obj = { key, quantity };
    axiosServer
      .put(
        buildLink(
          "cart",
          undefined,
          window.innerWidth,
          window.config["site-url"]
        ),
        obj
      )
      .then(() => {
        axiosServer
          .get(
            buildLink(
              "cart",
              undefined,
              window.innerWidth,
              window.config["site-url"]
            )
          )
          .then((response) => {
            setCart([]);
            setCart(response?.data?.data);

            dispatch({
              type: "setProducts",
              payload:
                response.data?.data?.products?.length > 0
                  ? response.data.data.products
                  : []
            });
            dispatch({
              type: "setTotals",
              payload:
                response.data?.data?.totals?.length > 0
                  ? response.data.data.totals
                  : 0
            });
            dispatch({
              type: "setProductsCount",
              payload:
                response.data?.data?.total_product_count > 0
                  ? response.data.data.total_product_count
                  : 0
            });
            dispatch({
              type: "loading",
              payload: false
            });
            if (quantity === 0) {
              window.location.reload();
            }
            if (quantity > 0) document.getElementById("item" + i).focus();
          });
      });
  }
  function confirmPos(confirm, calculate) {
    setConfirmDisalbe(true);
    manual(confirm, calculate);
  }
  function manual(confirm, calculate, bool) {
    // console.log("manual");
    // window.scroll(0, 0);
    let body = {};
    // if it's first attemp
    setError({});
    let temp = [];
    const dt = cart?.products;
    for (let index = 0; index < dt?.length; index++) {
      let new_product = {};
      let product_option = {};
      new_product.product_id = dt[index]["product_id"];
      new_product.name = dt[index]["name"];
      new_product.sku = dt[index]["sku"];
      new_product.model = dt[index]["model"];
      new_product.quantity = dt[index]["quantity"];
      new_product.unit_price = dt[index]["unit_price"];
      new_product.price = dt[index]["price"];
      if (dt[index]["option"].length !== 0) {
        product_option["type"] = "radio";
        product_option["product_option_id"] =
          dt[index]["option"][0]["product_option_id"];
        product_option["name"] = dt[index]["option"][0]["name"];
        product_option["value"] = dt[index]["option"][0]["value"];
        product_option["product_option_value_id"] =
          dt[index]["option"][0]["product_option_value_id"];

        new_product.order_option = [product_option];
      }
      temp.push(new_product);
    }
    console.log("manual-2");
    console.log(cart);
    if (!typeRef.current.value && !amountRef.current.value) {
      body = {
        order_product: temp,
        // customer_id: customerId,
        firstname: firstname?.current?.value || firstName,
        lastname: lastname?.current?.value || lastName || "Local Customer",
        email: email || "",
        address_1: "store",
        telephone: telephone?.current?.value || "96100000000",
        address_2: "store store",
        city: "",
        shipping_method: "Delivery ( 1-4 days )",
        shipping_code: "ultimate_shipping.ultimate_shipping_0",
        payment_method: "Cash On Delivery",
        payment_code: "cod",
        comment: "",
        country_id: window.config["zone"],
        zone_id: 3995,
        user_id: 1069, //Cookies.get("salsMan") ? Cookies.get("salsMan") : "",
        modification_type: typeRef.current.value || "",
        modification: amountRef.current.value || "",
        modification_remarque: remarqueRef.current.value || "",
        zone: "Store",
        town_id: "",
        town: "",
        is_web: true,
        payment_session: false,
        source_id: 1,
        coupon: couponRef.current.value || "",
        code_version: window.innerWidth > 600 ? "web_desktop" : "web_mobile",
        total: cart?.totals?.find((t) => t.code === "total")?.value,
        sub_total: cart?.totals?.find((t) => t.code === "sub_total")?.value
      };
    } else {
      body = {
        order_product: temp,
        // customer_id: customerId,
        firstname: firstname?.current?.value || firstName,
        lastname: lastname?.current?.value || lastName || "Local Customer",
        email: email || "",
        address_1: "store",
        telephone: telephone?.current?.value || "96100000000",
        address_2: "store store",
        city: "",
        shipping_method: "Delivery ( 1-4 days )",
        shipping_code: "ultimate_shipping.ultimate_shipping_0",
        payment_method: "Cash On Delivery",
        payment_code: "cod",
        comment: "",
        country_id: window.config["zone"],
        zone: "Store",
        zone_id: 3995,
        modification_type: typeRef.current.value,
        modification: amountRef.current.value,
        modification_remarque: remarqueRef.current.value,
        currency_code: "USD",
        total: cart?.totals?.find((t) => t.code === "total")?.value,
        sub_total: cart?.totals?.find((t) => t.code === "sub_total")?.value,
        user_id: 1069, //Cookies.get("salsMan") ? Cookies.get("salsMan") : "",
        order_total: cart?.totals?.find((t) => t.code === "sub_total")?.value,

        town_id: "",
        town: "",
        is_web: true,
        payment_session: false,
        source_id: 1,
        coupon: couponRef.current.value || "",
        code_version: window.innerWidth > 600 ? "web_desktop" : "web_mobile"
      };
    }

    axiosServer
      .post(
        buildLink(
          "manual",
          undefined,
          window.innerWidth,
          window.config["site-url"]
        ),
        body
      )
      .then((response) => {
        localStorage.setItem("print-order", "");

        if (response?.data?.success === false) {
          setManualResponse(response?.data?.data);
          console.log(response?.data);

          setError(response?.data?.errors);
          setManualResponse(response?.data?.data);
          if (
            response?.data?.errors.length === 1 &&
            (response?.data.message === "OUT OF STOCK" ||
              response?.data?.message?.includes("STOCK") ||
              response?.data.message.includes("stock") ||
              response?.data.message.includes("Stock"))
          ) {
            setSuccess(true);
            body.hold_reason = response?.data.message;
            body.totals = response?.data?.data?.order_total;

            addToHold(body);
            setShowCalculate(false);
            setOpacity(true);

            handlePrintHolder(holdArray.length);
          }
        } else {
          if (calculate === true) {
            setShowCalculate(true);
            cart?.totals?.map((total) => {
              if (total.title === "Total") {
                setChange(total.value);
              }
            });
            document.getElementById("rendered")?.focus();
          } else {
            paymentForm(confirm, "cod");
            // setManualResponse(response?.data?.data);
            localStorage.setItem("print-order", JSON.stringify(body));
            // handlePrintHolder("print");
            handlePrintHolder("print")
          }
        }

        if (bool === true) {
          getcart();
        }
        setConfirmDisalbe(false);
      });
  }

  function paymentForm(confirm, p_m) {
    // setLoading(true);
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

        if (data.success) {
          setId(data.order_id);

          if (p_m === "cod" && confirm) {
            // if (Object.keys(manualErrors.current).length === 0) {
            confirmOrder(data.confirm_url, data.success_url);
            // }
          }
        } else {
          localStorage.setItem("payment_error-2", data);
        }
      });
  }
  function confirmOrder(c_url, s_url) {
    axiosServer.post(c_url).then((response) => {
      const data = response.data;
      if (data.success) {
        successOrder(s_url);
        setSuccess(true);
      } else {
        localStorage.setItem("successOrder_error", data);
      }
    });
  }

  function successOrder(url) {
    axiosServer.get(url).then((response) => {
      const data = response.data;

      if (data.success) {
        setOrderSuccess(true);
        // handlePrint();
        setShowCalculate(false);
        setOpacity(true);
        // setTimeout(handlePrint(data.data.orderDetails.order_id), 1500);
        addToLocalStorage(data?.data?.orderDetails?.order_id);
      } else {
        addToLocalStorageError(data);
        localStorage.setItem("successOrder_error_1", data);
      }
    });
  }
  function addToLocalStorage(order) {
    setMyArray((prevArray) => [...prevArray, order]);

    const storedArrayString = localStorage.getItem("orders");

    // Convert the string back to an array
    let storedArray = JSON.parse(storedArrayString);

    // Make changes to the array
    storedArray.push(order);
    // storedArray.push("50718");
    // Adding a new element to the array
    // Convert the modified array back to a string
    const updatedArrayString = JSON.stringify(storedArray);

    localStorage.setItem("orders", updatedArrayString);
  }

  function addToLocalStorageError(error) {
    setErrorArray((prevArray) => [...prevArray, error]);
  }

  function addToHold(order) {
    setHoldArray((prevArray) => [...prevArray, order]);
  }


  function handlePrint(id) {
    const url = "/posprint/" + id;

    const windowFeatures =
      " toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=302.36220472441, height=250";

    window.open(url, "_blank", windowFeatures);
  }

  function handlePrintHolder(id) {
    const url = "/posprint/hold/" + id;

    const windowFeatures =
      " toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=302.36220472441, height=250";

    window.open(url, "_blank", windowFeatures);
  }

  function newTab() {
    const windowFeatures =
      " toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=yes, wid";

    // const printWindow =
    window.open("/pos?new_tab", "_blank", windowFeatures);
  }
  function handleCouponChange() {
    if (couponRef.current.value.length < 1) {
      couponRef.current.value = "";
    }
  }
  return (
    <div>
      {stateAccount.admin && (
        <div className="overflow-hidden">
          {showCalculte && (
            <div class="fixed left-0 top-0 z-[1055]  h-full w-full overflow-y-auto overflow-x-hidden outline-none">
              <div class="pointer-events-none relative w-1/4 top-1/3 left-1/3  translate-y-[-50px]  transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]">
                <div class="p-5 min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-dinputBorder bg-white  text-current shadow-lg outline-none ">
                  <div class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-dinputBorder ">
                    <h5
                      class="text-xl font-medium leading-normal"
                      id="exampleModalLabel"
                    >
                      Complete Order
                    </h5>
                    <button onClick={() => setShowCalculate(false)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="h-6 w-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div class="relative flex-auto p-4">
                    <div>
                      <label className="w-1/2">rendered : </label>
                      <input
                        className="w-1/2 border ml-3 border-dinputBorder p-2 "
                        id="rendered"
                        onChange={(e) => changeResult(e.target.value)}
                      />
                    </div>
                  </div>
                  <div class="relative flex-auto p-4">
                    <div>
                      <label className="w-1/2">Change : </label>
                      <span className="w-1/2 border ml-3 border-dinputBorder bg-dgreyRate p-2">
                        {change}{" "}
                      </span>
                    </div>
                  </div>

                  <div class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-dinputBorder pt-3">
                    <button
                      className="bg-dgreyRate p-2  rounded ml-3"
                      onClick={() => setShowCalculate(false)}
                    >
                      Close
                    </button>
                    <button
                      className="bg-dblue text-white p-2 mx-6 rounded"
                      onClick={() => confirmPos(true, false)}
                    >
                      Confirm Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showSearch && (
            <div class="fixed left-0 top-0 z-50  h-full w-full overflow-y-auto overflow-x-hidden outline-none">
              <div class="pointer-events-none relative w-1/3 top-1/3 left-1/3  translate-y-[-50px]  transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]">
                <div class="p-5 min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-dinputBorder bg-white  text-current shadow-lg outline-none ">
                  <div class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-dinputBorder ">
                    <h5
                      class="text-xl font-medium leading-normal"
                      id="exampleModalLabel"
                    >
                      Search
                    </h5>
                    <button onClick={() => setShowSearch(false)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="h-6 w-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div class="relative flex-auto p-4">
                    <div vlassname="flex">
                      <label className="w-1/4">Search : </label>
                      <input
                        className="w-3/4 border ml-5 border-dgrayRate p-2 "
                        id="rendered"
                        onKeyUp={(e) => search(e)}
                      />
                    </div>
                  </div>

                  <div className="flex p-1">
                    <div className="w-1/3">sku</div>
                    <div> {dataSearch.sku}</div>
                  </div>
                  <div className="flex p-1">
                    <div className="w-1/3">Model</div>
                    <div> {dataSearch.model}</div>
                  </div>

                  <div className="flex p-1">
                    <div className="w-1/3">upc</div>
                    <div> {dataSearch.upc}</div>
                  </div>
                  {dataSearch?.all_options?.length > 0 && (
                    <div>
                      <div className="flex p-1">
                        <b className="pr-1 ">Options </b> ({" "}
                        {dataSearch?.all_options?.length > 0 &&
                          dataSearch?.all_options[0].name}{" "}
                        )
                      </div>
                      <div className="flex p-1">
                        <div className="w-1/3">Name</div>
                        <div> Barcode</div>
                      </div>
                      {dataSearch?.all_options?.length > 0 &&
                        dataSearch?.all_options[0]?.product_option_values?.map(
                          (op) => (
                            <div className="flex p-1 border">
                              <div className="w-1/3 "> {op.name}</div>
                              <div>{op.barcode}</div>
                            </div>
                          )
                        )}
                    </div>
                  )}
                  <div class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-dinputBorder pt-3">
                    <button
                      className="bg-dgreyRate p-2  rounded ml-3"
                      onClick={() => setShowSearch(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div
            className={`flex flex-col-2   bg-dinputBorder min-h-screen p-3 ${
              opacity && "opacity-20"
            }`}
          >
            {/* <button onClick={handlePrint}>Printxssssxx</button> */}
            {/* <ReactToPrint
          trigger={() => <button onClick={() =>handlePrint}>Printxxx</button>}
          content={() => printRef.current}
        /> */}
            <div className="w-1/2 ">
              <div className="  bg-white p-5">
                {/* <button
                  className="w-1/2 bg-dgreen h-12 m-4 text-white px-2"
                  onClick={(e) => handlePrint(e)}
                >
                  Print
                </button> */}
                <div className="flex">
                  <div className=" w-7/12">
                    <input
                      id="code"
                      type="text"
                      className="py-2 border-dblue border rounded-lg w-full px-2  focus:outline-black"
                      placeholder="Enter SKU CODE "
                      onKeyUp={(e) => addToCart(e)}
                      // onKeyUp={(e) => FocusCart(e)}
                      onFocus={() => SetSelectCart("")}
                      ref={inputRef}
                    />
                  </div>
                  <button
                    // href="/pos?new_tab"
                    className="bg-Orangeflo p-2 ml-6 text-white rounded-md"
                    // target="_blank"
                    onClick={(e) => neworder(e)}
                  >
                    New Order
                  </button>

                  <button
                    // href="/pos?new_tab"
                    className="bg-Orangeflo p-2 ml-6 text-white rounded-md"
                    // target="_blank"
                    onClick={() => setShowSearch(true)}
                  >
                    Search
                  </button>
                </div>
                {errorProduct && (
                  <div className="w-full text-dbase ml-5 mt-2">
                    Product Not Found
                  </div>
                )}
              </div>
              <div className=" bg-white p-3 mt-3  pb-8">
                {/* <div className="mx-3   w-3/4">
              <div className="input required">
                <label>Last name</label>
                <input
                  ref={lastname}
                  type="text"
                  minLength={1}
                  onChange={(e) => {
                    setLastName(e);
                  }}
                />
              </div>

              {error[0]?.errorCode === "lastname" && (
                <p className=" text-sm mt-1 text-dbase">
                  Please enter your last name
                </p>
              )}
            </div> */}

                <div className="w-full mx-2 bg-white p-2">
                  {loader && <PointsLoader />}
                  {/* Cart Items */}
                  {!loader && (
                    <div className="w-full h-screen  overflow-y-auto ">
                      {error?.length > 0 &&
                        error?.map(
                          (err) =>
                            (err?.errorCode === "stock" ||
                              err?.errorCode === "option") && (
                              <p className=" text-sm m-1 text-dbase">
                                {error[0]?.errorMsg}
                              </p>
                            )
                        )}
                      {cart?.products?.length > 0 &&
                        cart?.products
                          ?.sort((a, b) => b.cart_id - a.cart_id)
                          ?.map((item, i) => (
                            <div
                              className={`hidden xl:flex lg:flex mb-2 px-2 py-2 rounded ${
                                item.stock
                                  ? "bg-white "
                                  : "bg-dbase bg-opacity-10"
                              } ${selectCart === i && "border border-dblue"}`}
                            >
                              <div className=" w-16 mt-6">
                                # {cart?.products?.length - i}
                              </div>

                              {/* {select  &&  showSelect && (
                        <input
                          className="mr-2"
                          type="checkbox"
                          id={item.cart_id}
                          onClick={() => change(item.cart_id)}
                          checked={
                            selectProduct.indexOf(item.cart_id) > -1
                              ? "checked"
                              : ""
                          }
                          name="chk"
                        />
                      )} */}

                              <img
                                onClick={() =>
                                  router.push(
                                    `${item.name
                                      .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                                      .replaceAll("20%", "")
                                      .replace(/\s+/g, "-")
                                      .replaceAll("/", "-")}/p=${
                                      item.product_id
                                    }`
                                  )
                                }
                                src={item.thumb}
                                className="w-24 h-20 cursor-pointer block rounded"
                                alt={item.name}
                              />
                              <div className="flex flex-col justify-between items-start pl-3 text-dblack py-2 flex-grow w-full">
                                <p className="text-d13 text-dgrey1">
                                  {item.sku}
                                </p>
                                <p
                                  className="flex text-sm font-semibold "
                                  dangerouslySetInnerHTML={{
                                    __html: item.name.slice(0, 45) + "..."
                                  }}
                                ></p>
                                {item.option.length > 0 && (
                                  <p className="text-dgreen text-sm">
                                    {item.option[0].name +
                                      " (" +
                                      item.option[0].value +
                                      ")"}
                                  </p>
                                )}
                                <button
                                  className="cursor-pointer text-dgrey1 text-xs"
                                  onClick={() =>
                                    updatequnatity(item.cart_id, 0)
                                  }
                                >
                                  <span>Remove</span>
                                  <i className="icon icon-trash ml-1"></i>
                                </button>
                              </div>

                              <div className="py-2 px-6 w-48 flex flex-col items-end text-dblack justify-center">
                                <span className=" font-semibold text-lg">
                                  {item.total}
                                </span>
                                <div className="flex mt-4">
                                  <button
                                    className="w-10 h-10  text-2xl border border-dinputBorder rounded-tl rounded-bl cursor-pointer hover:shadow"
                                    onClick={(e) =>
                                      changeQuantity(
                                        item.cart_id,
                                        Number(item?.quantity) - 1
                                      )
                                    }
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    id={`item${i}`}
                                    ref={qtyRef}
                                    defaultValue={item?.quantity}
                                    className="border border-dinputBorder w-12 h-10 border-r-0 border-l-0 text-center focus:outline-none"
                                    onKeyDown={(e) =>
                                      handleClick(
                                        e,
                                        i,
                                        item?.quantity,
                                        item.cart_id
                                      )
                                    }
                                  />

                                  <button
                                    className="w-10 h-10  text-2xl border border-dinputBorder  rounded-tr rounded-br cursor-pointer hover:shadow"
                                    onClick={(e) =>
                                      changeQuantity(
                                        item.cart_id,
                                        Number(item?.quantity) + 1
                                      )
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                    </div>
                  )}
                  <div className="w-auto px-5 h-8 border text-xl font-semibold cursor-pointer text-white fixed bottom-0 p-7 m-7 rounded-full ">
                    <select
                      className="w-auto px-5  border text-xl font-semibold cursor-pointer text-white   p-3 rounded-full bg-Orangeflo"
                      onChange={(e) => Cookies.set("salsMan", e.target.value)}
                    >
                      <option value="">user</option>

                      {users?.map((u) =>
                        u.user_id == Cookies.get("salsMan") ? (
                          <option value={u.user_id} selected>
                            {" "}
                            {u.username}
                          </option>
                        ) : (
                          <option value={u.user_id}> {u.username}</option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                {/* <div className=" w-3/4 mt-3 mx-3">
              <div className="input items-center">
                <label>Email</label>

                <input
                  type="text"
                  minLength={1}
                  required
                  onChange={(e) => {
                    setEmail(e);
                  }}
                />
              </div>

              <p className="hidden text-sm mt-1 text-dbase">
                Please enter your first name
              </p>
            </div> */}
              </div>
              {/* {orderSuccess && ( */}
              {/* <div className=" mt-2 flex flex-cols-2 gap-3">
              <div className="w-1/3"></div>

              <div
                className="w-1/3"
                ref={printRef}
                style={{ display: "block" }} // This make ComponentToPrint show   only while printing
              >
                {" "}
                <PosPrint
                  items={manualResponse}
                  name={
                    firstname?.current?.value +
                      " " +
                      lastname?.current?.value ||
                    firstName + lastName ||
                    ""
                  }
                  telephone={telephone.current.value}
                />
              </div>
              <div className="w-1/3"></div>
            </div> */}
              {/* )} */}
            </div>
            <div className="w-1/2 mx-2 bg-white">
              <div className="flex w-full p-2">
                <div className=" w-1/3">
                  <div className="flex items-center -space-x-3  mx-3">
                    <div className="flex items-center space-x-1 border-b  mt-9 mr-2 border-dinputBorder">
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
                        {window.config["countryCode"].substring(1)}{" "}
                      </p>{" "}
                    </div>
                    <div
                      className="input  required "
                      style={{ borderColor: "rgb(230, 230, 230)" }}
                    >
                      <label htmlFor="telephone"> Telephone </label>{" "}
                      <div className="-mx-6">
                        <HandlePhoneModel
                          phone={telephone}
                          phoneHanlder={phoneHanlder}
                          // setConfirmDisalbe={setConfirmDisalbe}
                          AdminPhoneHandler={AdminPhoneHandler}
                          // AdminPhoneHandler={AdminPhoneHandler}
                        />{" "}
                      </div>
                    </div>{" "}
                  </div>{" "}
                  {/* {(error[0]?.errorCode === "telephone" ||
                error[1]?.errorCode === "telephone" ||
                error[2]?.errorCode === "telephone") &&
                confirmNow && (
                  <div className="w-full text-sm mt-1 ml-16 px-2 text-dbase">
                    Please enter your phone number
                  </div>
                )} */}
                </div>
                <div className="w-1/3 mx-1 mt-1">
                  <div className="input required">
                    <label>First name</label>
                    <input
                      ref={firstname}
                      type="text"
                      minLength={1}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                      }}
                      style={{ borderColor: "rgb(230, 230, 230)" }}
                    />
                  </div>
                  {(error[0]?.errorCode === "firstname" ||
                    error[1]?.errorCode === "firstname" ||
                    error[2]?.errorCode === "firstname") && (
                    <p className=" text-sm mt-1 text-dbase">
                      Please enter your First Name
                    </p>
                  )}
                </div>

                <div className="w-1/3 mx-1 mt-1">
                  <div className="input ">
                    <label>Last name</label>
                    <input
                      ref={lastname}
                      type="text"
                      minLength={1}
                      onChange={(e) => {
                        setLastName(e.target.value);
                      }}
                      style={{ borderColor: "rgb(230, 230, 230)" }}
                    />
                  </div>
                  {/* {(error[0]?.errorCode === "firstname" ||
                error[1]?.errorCode === "firstname" ||
                error[2]?.errorCode === "firstname") &&
                confirmNow && (
                  <p className=" text-sm mt-1 text-dbase">
                    Please enter your Full name
                  </p>
                )} */}
                </div>
              </div>
              <div className="px-3 ">
                {/* <p
                      className={
                        coupon?.current?.value?.length > 1 &&
                        error?.current?.temp_coupon
                          ? "text-xs text-dbase"
                          : "hidden"
                      }
                    >
                      {coupon.current?.value?.length > 1 &&
                      error?.current?.temp_coupon
                        ? error?.current?.temp_coupon
                        : ""}
                    </p> */}
              </div>
              <div className="flex py-5 px-6  border-t-8  border-dinputBorder ">
                <input
                  style={{ borderColor: "rgb(230, 230, 230)" }}
                  type="text"
                  className="border flex-grow rounded-tl rounded-bl border-r-0 h-10 px-5"
                  placeholder="Coupon Code or Gift Card"
                  ref={couponRef}
                  onChange={() => handleCouponChange()}
                />
                <div
                  onClick={() => setCoupon()}
                  className="bg-dblue text-white px-3 h-10 rounded-tr rounded-br text-sm"
                >
                  <p className="text-center mt-3">APPLY</p>
                </div>{" "}
              </div>{" "}
              {(error[0]?.errorCode === "temp_coupon" ||
                error[1]?.errorCode === "temp_coupon" ||
                error[2]?.errorCode === "temp_coupon") && (
                <div className="w-full text-sm mt-1 ml-16 px-2 text-dbase">
                  {error[0]?.errorMsg ||
                    error[2]?.errorCode ||
                    error[3]?.errorCode}
                </div>
              )}
              <div className="pt-2 border-t-8 border-b-8 border-dinputBorder px-6">
                <div className="w-full text-xl">Modification</div>
                <div className="flex w-full mt-4">
                  <div className="w-1/4 mt-1">Type</div>{" "}
                  <select
                    style={{ borderColor: "rgb(230, 230, 230)" }}
                    className="bg-white relative px-5 h-8 border text-sm font-semibold cursor-pointer rounded"
                    ref={typeRef}
                  >
                    <option value="amount"> Amount</option>
                    <option value="discount"> % percentage</option>
                  </select>
                </div>
                <div className="flex w-full mt-3">
                  <div className="w-1/5 mt-1">Number</div>{" "}
                  <div className="w-4/5">
                    <input
                      style={{ borderColor: "rgb(230, 230, 230)" }}
                      className="border  w-full flex-grow rounded-md  h-10 px-5"
                      ref={amountRef}
                      type="number"
                    />
                    <div className=" text-sm mt-1  px-2 text-dbase">
                      {modificationError?.amount}
                    </div>
                  </div>
                </div>

                <div className="flex w-full mt-1">
                  <div className="w-1/5 mt-1"> remarque</div>{" "}
                  <div className="w-4/5">
                    <input
                      style={{ borderColor: "rgb(230, 230, 230)" }}
                      className="border border-dinputBorder3 w-full flex-grow rounded-md h-10 px-5"
                      rows="5"
                      ref={remarqueRef}
                    />
                    <div className="w-full text-sm mt-1 px-2 text-dbase">
                      {modificationError?.remarque}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end w-full mt-2 pb-2">
                  <button
                    className="bg-dblue text-white px-5 py-2 rounded "
                    onClick={() => modification()}
                  >
                    {" "}
                    APPLY
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex inset-x-0 bottom-0 fixed  ">
            <div className="flex w-3/4"></div>
            {cart?.totals?.length && (
              <div className=" px-6 py-4 rounded bg-white w-1/4 mx-5 border-t-8  border-dinputBorder">
                <div className="flex w-full">
                  <div className="w-full mb-2 font-semibold text-lg">
                    Order Totals
                  </div>{" "}
                  <div className="w-full text-right">
                    Subtotal ({cart?.totals?.length} items)
                  </div>
                </div>
                <div>
                  {manualResponse?.order_total?.length > 0
                    ? manualResponse?.order_total?.map(
                        (total) =>
                          total.title !== "Store" && (
                            <div className="flex items-center justify-between mb-1 text-dblack">
                              <span>{total.title}</span>
                              <span>{total.text}</span>
                            </div>
                          )
                      )
                    : cart?.totals?.map(
                        (total) =>
                          total.title !== "Store" && (
                            <div className="flex items-center justify-between mb-1 text-dblack">
                              <span>{total.title}</span>
                              <span>{total.text}</span>
                            </div>
                          )
                      )}
                </div>
                {success ? (
                  <div className="flex">
                    <button
                      className="w-full bg-greenaalbeit h-12 m-4 text-white px-2"
                      onClick={(e) => neworder(e)}
                      // onClick={(e)=>newTab(e)}
                    >
                      New Order
                    </button>

                    <button
                      className="w-1/2 bg-dgreen h-12 m-4 text-white px-2"
                      onClick={(e) =>
                        handlePrintHolder(
                          localStorage.getItem("print-order")
                            ? "print"
                            : holdArray.length
                        )
                      }
                    >
                      Print
                    </button>
                  </div>
                ) : (
                  <button
                    className=" text-center bg-dblue text-white rounded w-full py-3 mt-4 hover:bg-dbluedark"
                    onClick={() => confirmPos(false, true)}
                  >
                    {confirmDisable ? (
                      <div className="lds-ellipsis h-6  -mt-5">
                        <div />
                        <div />
                        <div />
                        <div />
                      </div>
                    ) : (
                      "Process"
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

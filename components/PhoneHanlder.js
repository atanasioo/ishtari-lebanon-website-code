import { useContext, useState } from "react";
import _axios from "../axios";
import { AccountContext } from "../contexts/AccountContext";
import buildLink from "../urls";

function HandlePhoneModel(props) {
  const { phone, phoneHanlder, AdminPhoneHandler, setConfirmDisalbe, parentData, fromContact } = props;
  const [state, dispatch] = useContext(AccountContext);
  const [valid, setValid] = useState(true);
  const [data, setData] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // +961 03 123456

  const onChangeHandler = (num) => {
    // console.log(num)

    let number = num.replace(/ /g, "");
    // console.log(number)

    if (number.slice(0, 1) === "+") {
      setValid(false);
      number = number.slice(1, number.length);
    }
    // console.log(number)

    if (number.slice(0, 3) === window.config["countryCode"].substring(1)) {
      setValid(false);
      number = number.slice(3, number.length);
    }
    // console.log(number)
    if (
      (number.slice(0, 1) === "3" ||
        number.slice(0, 1) === "1" ||
        number.slice(0, 1) === "6" ||
        number.slice(0, 1) === "4") &&
      number.length === 7
    ) {
      setValid(true);
    }
    if (number.slice(0, 1) === "0") {
      number = number.slice(1, number.length);
      setValid(true);
    } else if (number.length > 7 && number.length < 8) {
      phoneHanlder(number, true);
      setValid(true);
      setConfirmDisalbe(false);
    }
    if (window.config["useTown"]) {
      let cleaned = ("" + number).replace(/\D/g, "");
      let match = cleaned.match(/^(\d{2})(\d{3})(\d{4})$/);
      if (match) {
        number = "" + match[1] + "-" + match[2] + "-" + match[3];
      }
    }
    phoneHanlder(number, false);
  };

  const onChangeHandlerAdmin = (e, num) => {
    // console.log("admin")
    // https://www.ishtari.com/motor/v2/index.php?route=account/address/autoComplete&filter_name=76
    // https://www.ishtari.com/motor/v2/index.php?route=account/address/getCustomerByPhone&phone=76113320
    let number = num.replace(/ /g, "");
    phone.current.value = number;
    if (number.length > 1) {
      setShow(true);
    } else {
      setShow(false);
    }
    window &&
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          phone.current.blur();
        }
      });
    setLoading(true);
    _axios
      .get(
        buildLink("autoCompletePhone", undefined, window.innerWidth) + number
      )
      .then((response) => setData(response.data));
    setLoading(false);
    if (number.length >= 1) {
      setShow(true);
    }
  };

  function FormHandler(number) {
    _axios
      .get(
        buildLink("getCustomerByPhone", undefined, window.innerWidth) + number
      )
      .then((response) => {
        let str = response.data.data.telephone.replace(/ /g, "");

        if (str.slice(0, 2) === "00") str = str.slice(2, str.length);

        if (str.slice(0, 4) === window.config["countryCode"])
          str = str.slice(4, str.length);

        if (str.slice(0, 3) === window.config["countryCode"].substring(1))
          str = str.slice(3, str.length);

        //  if(str.slice(0,4) === "+961") str = str.slice(4,str.length)

        // if(str.slice(0,3) === "961") str = str.slice(3,str.length)

        if (str.slice(0, 1) === "0") str = str.slice(1, str.length);

        let obj = {
          firstname: response.data.data.firstname,
          lastname: response.data.data.lastname,
          telephone: str,
          email: response.data.data.email,
          zone: response.data.data.shipping_zone_id,
          city: response.data.data.shipping_zone,
          address: response.data.data.shipping_address_1,
          address2: response.data.data.shipping_address_2 || "",
        };
        AdminPhoneHandler(obj, true);
        setShow(false);
      });
  }

  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
  const red =
    "bg-transparent border-b border-dbase absolute bottom-0 left-0 w-full  text-dblack text-base pl-3";

  return (
    <div className={`flex-end ${!fromContact ? "ml-5" : ""} `}>
      <div>
        {state.admin ? (
          <input
            autoComplete={false}
            onFocus={(e) => setShow(e.target.value.length > 1)}
            onBlur={() => setShow(false)}
            required
            ref={phone}
            defaultValue={parentData?.telephone}
            className={`text-d14 font-light ${!valid && `${red} !important`}`}
            minLength={7}
            maxLength={15}
            onChange={(e) => onChangeHandler(e.target.value)}
            onKeyDown={(e) => onChangeHandlerAdmin(e, e.target.value)}
            onKeyUp={(e) => onChangeHandler(e.target.value)}
          />
        ) : (
          <input
            id="phoneUser"
            autoComplete={false}
            ref={phone}
            defaultValue={parentData?.telephone}
            className={`${!fromContact ? "absolute bottom-px text-d14 font-light left-2" : "border border-dplaceHolder text-d16 w-full h-14 mb-2.5 px-5 outline-none rounded-sm"} 
            ${
              !valid && `${red} !important`
            }`}
            minLength={window.config["zone"] === "82" ? 11 : 7}
            required
            type="text"
            maxLength={
              window.location.host === "www.ishtari.com.gh" ||
              localStorage.getItem("site-local-name") === "ishtari-ghana"
                ? 11
                : 8
            }
            onChange={(e) => onChangeHandler(e.target.value)}
            onKeyDown={blockInvalidChar}
            placeholder={`${fromContact ? "Telephone" : ""}`}
          />
        )}
        <div className={show ? "relative" : "hidden"}>
          <div className="absolute  top-16 bg-white w-full h-80 atTheTop rounded-lg overflow-scroll border border-dblue shadow-lg">
            {data?.data?.length > 0 &&
              data?.data?.map((number, index) => {
                return index % 2 === 0 ? (
                  <p
                    className="p-2 bg-dgrey1 bg-opacity-10 text-dblack cursor-pointer "
                    onMouseDown={() => FormHandler(number.trim())}
                    key={number}
                  >
                    {number}
                  </p>
                ) : (
                  <p
                    className="p-2 cursor-pointer "
                    onMouseDown={() => FormHandler(number)}
                    key={number}
                  >
                    {number}
                  </p>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HandlePhoneModel;

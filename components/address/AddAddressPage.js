import { axiosServer } from "@/axiosServer";
import UserSidebar from "@/components/account/UserSidebar";
import UserSidebarMobile from "@/components/account/UserSidebarMobile";
import HandlePhoneModel from "@/components/address/HandlePhoneModel";
import useDeviceSize from "@/components/useDeviceSize";
import { AccountContext } from "@/contexts/AccountContext";
import buildLink from "@/urls";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { HiLocationMarker } from "react-icons/hi";
import GoogleMap from "./GoogleMap";


import GoogleMapReact from "google-map-react";
import { ImLocation } from "react-icons/im";
import { MdLocationOn } from "react-icons/md";
import Geocode from "react-geocode";
import Link from "next/link";

function AddAddressPage(props) {
  const { address_id } = props;
  const router = useRouter();
  const [address_2, setAddress_2] = useState("");
  const [address_1, setAddress_1] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [zone_id, setZone_id] = useState("");
  const [town_id, setTown_id] = useState("");
  const [isEdit, setIsEdit] = useState(props.isEdit);
  const [townes, setTownes] = useState([]);
  const [telephone, setTelephone] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [zones, setZones] = useState([]);
  const [phoneValidate, setphoneValidate] = useState("");
  const [width, height] = useDeviceSize();
  const [confirmedLocation, setConfirmedLocation] = useState("");
  const [err, setErr] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [load, setLoad] = useState(true);
  const [message, setMessage] = useState("");
  const [fromCheckout, setFromCheckout] = useState(false);
  const [googleLocation, setGoogleLocation] = useState(true);
  const [position, setPosition] = useState({
    lat: 0,
    lng: 0,
  });

  const [countryCorrect, setCountryCorrect] = useState(true);
  const [addeddOnce, setAddeddOnce] = useState(false);
  const [key, setKey] = useState(0);
  const [showConfirm, setShowConfirm] = useState({
    show: false,
    title: "Verify Address Phone",
    msg: `Do you want to verify this address phone?`,
  });

  const getGhanaFormat = (phone) => {
    const p1 = phone.substring(0, 2);
    const p2 = phone.substring(2, 5);
    const p3 = phone.substring(5, 9);
    return p1 + "-" + p2 + "-" + p3;
  };

  useEffect(()=>{
    setKey((prevKey) => prevKey + 1)
  },[position])

  const country_id = window.config["zone"];
  const city = "";
  const postcode = "";

  const [state, dispatch] = useContext(AccountContext);

  // console.log(isEdit);

  useEffect(() => {
    // if (parsedQueryString["from-checkout"]) {
    //   setFromCheckout(true);
    // }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    axiosServer
      .get(
        buildLink("zone", undefined, window.innerWidth) + window.config["zone"]
      )
      .then((response) => {
        setZones(response?.data?.data?.zones);

        if (zones) {
          setZone_id(response?.data?.data?.zones[0]?.zone_id);
          if (isEdit) {
            axiosServer
              .get(
                buildLink("address", undefined, window.innerWidth) +
                  "&address_id=" +
                  address_id
              )
              .then((response) => {
                if (response.data.success) {
                  const addressDetails = response.data.data;
                  axiosServer
                    .get(
                      buildLink("town", undefined, window.innerWidth) +
                        addressDetails.zone_id
                    )
                    .then((responses) => {
                      setTownes(responses?.data?.data);

                      setFirstName(
                        firstname === "" ? addressDetails.firstname : firstname
                      );
                      setLastName(
                        lastname === "" ? addressDetails.lastname : lastname
                      );
                      setAddress_1(
                        address_1 === "" ? addressDetails.address_1 : address_1
                      );
                      setAddress_2(
                        address_2 === "" ? addressDetails.address_2 : address_2
                      );
                      setConfirmedLocation(
                        confirmedLocation === ""
                          ? addressDetails.google_address_description
                          : confirmedLocation
                      );

                      setPosition({
                        lat: position.lat
                          ? position.lat
                          : Number(addressDetails.latitude),
                        lng: position.lng
                          ? position.lng
                          : Number(addressDetails.longitude),
                      });

                      setTelephone(
                        telephone === ""
                          ? window.location.host === "www.ishtari.com.gh" ||
                            Cookies.get("site-local-name") === "ishtari-ghana"
                            ? getGhanaFormat(
                                addressDetails.telephone.substring(
                                  3,
                                  addressDetails.telephone.length
                                )
                              )
                            : addressDetails.telephone.substring(
                                3,
                                addressDetails.telephone.length
                              )
                          : telephone
                      );

                      setZone_id(
                        zone_id === "" ? addressDetails.zone_id : zone_id
                      );

                      if (
                        window.config["useTown"] &&
                        addressDetails.town_id > 0
                      ) {
                        setTown_id(
                          town_id === "" ? addressDetails.town_id : town_id
                        );
                      }
                    });
                }
              });
          }
        }
        setLoading(false);
      });
  }, []);

  const phoneHanlder = (childData, isValid) => {
    // console.log(isValid);
    if (isValid === true) {
      setTelephone(childData);
      setErr("");
    } else {
      setTelephone(childData);
    }

    setIsValid(isValid);
  };

  const redirect = () => {
    setTimeout(() => {
      router.push("/account/address");
    }, 1500);
  };

  // Add Address
  function addAddress(e) {
    // console.log("entered");
    setLoading(true);
    e.preventDefault();
    setLoading(false);
    const obj = {
      firstname: firstname,
      lastname: lastname,
      address_1: address_1,
      address_2: address_2,
      telephone: window.config["countryCode"] + telephone,
      google_address_description: confirmedLocation,
      zone_id: zone_id,
      town_id: town_id === "" ? 0 : town_id,
      latitude: position.lat,
      longitude: position.lng,
      country_id,
      city,
      postcode,
    };
    // console.log(obj);
    setphoneValidate("");
    if (window.config["zone"] === "82" && telephone.length < 11) {
      setphoneValidate("must be 9 numbers");

      return;
    }
    if (
      (window.location.host === "www.ishtari.com" ||
        Cookies.get("site-local-name") === "ishtari") &&
      telephone.length < 8
    ) {
      setphoneValidate("must be 8 numbers");
      return;
    }
    if (isEdit) {
      axiosServer
        .put(
          buildLink("address", undefined, window.innerWidth) +
            "&address_id=" +
            address_id,
          obj
        )
        .then((response) => {
          if (response.data.success) {
            setErrors([]);
            if (fromCheckout) {
              router.push("/checkout");
            } else {
              setMessage(
                "Address Edited Successfully, you will be redirected to addresses page."
              );
              setTimeout(() => {
                router.push("/account/address");
              }, 3000);
            }
          } else {
            setErrors(response.data.errors);
          }
        });
    } else {
      setAddeddOnce(true);
      // console.log("hehehhe");
      axiosServer
        .post(buildLink("address", undefined, window.innerWidth), obj)
        .then((response) => {
            // console.log(response);
          if (response.data.success) {
            setErrors([]);
            setMessage(
              "Address Added Successfully, you will be redirected to addresses page."
            );
            axiosServer
              .post(
                buildLink("checkVerify", undefined, window.innerWidth) +
                  `&telephone=${window.config["countryCode"] + telephone}`
              )
              .then((res) => {
                redirect();
              });
            if (fromCheckout) {
              router.push("/checkout");
            } else {
              // setTimeout(() => {
              //   history.push({
              //     pathname: "/account/addresses",
              //   });
              // }, 3000);
            }
          } else {
            setErrors(response.data.errors);
          }
        });
    }
  }

  function setZone(e) {
    setTownes("");
    const sel = e.target;
    axiosServer
      .get(buildLink("town", undefined, window.innerWidth) + sel.value)
      .then((response) => {
        if (response.data.success) {
          setTownes(response.data.data);
        }
      });
  }

  function handlePosition(lat, lng) {
    setPosition({
      lat: lat,
      lng: lng,
    });
  }

  function handleProps(key, val) {
    if (key === "countryCorrect") {
      setCountryCorrect(val);
    } else if (key === "googleLocation") {
      setGoogleLocation(true);
    } else if (key === "confirmedLocation") {
      setConfirmedLocation(val);
    }
  }

  return (
    <div className="container text-dblack min-h-screen">
      <div className="flex-row md:flex" style={{height: "100%", minHeight: "830px"}}>
        <div className="w-full mb-3 md:w-1/5">
          {width > 650 ? (
            <UserSidebar active={"addresses"} />
          ) : (
            <UserSidebarMobile active={"addresses"} />
          )}
        </div>
        <div
          className={`w-full md:p-6 ${
            (googleLocation || isEdit) && "overflow-y-auto"
          }`}
        >
          <div className="header-div mb-6">
            <Link href={"/account/address"} className="inline-flex mb-3 text-dgrey1 items-center gap-2">
              <AiOutlineArrowLeft />
              Back to Addresses
            </Link>
            <p className="pr-bold text-d28">Add new Address</p>
            <p className="text-dgrey1 mt-0.5">
              Enter your address and contact details so we can deliver to you
              quickly and efficiently
            </p>
          </div>
          {(googleLocation || isEdit) && (
            <form className="mb-16 bg-white" onSubmit={(e) => addAddress(e)}>
              <div className="md:grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div className="relative py-6 px-8">
                  <div className="inline-flex items-center gap-3">
                    <p className="text-d22 pr-bold">Address Details </p>
                    {typeof window !== "undefined" && (
                      <img
                        className="w-8 h-5"
                        alt="country-flag"
                        src={
                          window.location.host === "www.ishtari.com" ||
                          window.location.host === "www.sari3.com" ||
                          Cookies.get("site-local-name") === "ishtari"
                            ? "/images/flags/lebanon.svg"
                            : "/images/flags/ghana.svg"
                        }
                      />
                    )}
                  </div>
                  <div className="mt-8">
                    <div className="mb-2">
                      <label className="pr-bold text-d16">Full address</label>
                    </div>
                    <div className="relative">
                      <input
                        className="block border border-dborderAddress rounded w-full h-12 pl-4 pr-12"
                        placeholder="e.g. Apartment 4, Building name, Street 3"
                        id="address_1"
                        minLength={3}
                        defaultValue={address_1}
                        required
                        onChange={(e) => {
                          setAddress_1(e.target.value);
                        }}
                      />
                    </div>
                  </div>

                  {/* MORE ADDRESS DETAILS */}
                  <div className="mt-4">
                    <div>
                      <div className="flex items-center">
                        <label className="flex-1 pr-bold overflow-hidden overflow-ellipsis mb-2 whitespace-nowrap">
                          More address details
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          className="rounded block pl-4 pr-2 h-12 w-full"
                          type="text"
                          id="address_2"
                          placeholder=""
                          defaultValue={address_2}
                          value={address_2}
                          onChange={(e) => {
                            setAddress_2(e.target.value);
                          }}
                          minLength={3}
                          style={{ border: "1px solid rgb(218, 220, 227)" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ZONE */}
                  <div className="input mt-8 px-2">
                    <label
                      htmlFor="zone_id"
                      className="font-bold text-dblackk mb-4"
                    >
                      Zone
                    </label>
                    <select
                      id="zone_id"
                      value={zone_id}
                      required
                      onChange={(e) => {
                        setZone(e);
                        setZone_id(e.target.value);
                      }}
                    >
                      {zones.length > 0 &&
                        zones.map((zone) => (
                          <option key={zone.zone_id} value={zone.zone_id}>
                            {zone.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* TOWN */}
                  {typeof window !== "undefined" &&
                    window.config["useTown"] && (
                      <div className="input mt-6">
                        <label
                          htmlFor="town_id"
                          className="font-bold text-dblackk mb-1"
                        >
                          Town
                        </label>
                        <select
                          id="town_id"
                          value={town_id}
                          required
                          onChange={(e) => {
                            setTown_id(e.target.value);
                          }}
                        >
                          {/* <option> Select a Town</option> */}
                          {townes?.length > 0 &&
                            townes.map((town) => (
                              <option key={town.town_id} value={town.town_id}>
                                {town.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}

                  <div className=" mt-6 ">
                    <div className="flex items-center">
                      <label className="flex-1 font-bold overflow-hidden overflow-ellipsis mb-2 whitespace-nowrap">
                        Add map location
                        <span className="text-xs text-dlabelColor font-light">
                          <i> (Optional)</i>
                        </span>
                      </label>
                    </div>
                    <div className="flex gap-4">
                      {confirmedLocation ? (
                        <button
                          className="w-20 h-16 flex relative"
                          onClick={(e) => {
                            e.preventDefault();
                            setGoogleLocation(false);
                            setIsEdit(false);
                          }}
                        >
                          <img src={"/images/staticmap.png"} />
                          <span
                            className="absolute -bottom-4 left-0 right-0 text-d12 font-semibold py-px text-white"
                            style={{ background: "rgba(0, 0, 0, 0.3)" }}
                          >
                            Change
                          </span>
                        </button>
                      ) : (
                        <div
                          className={`xs:border-2 xs:border-dslate xs:border-dashed relative h-14 w-14  sm:h-20 sm:w-20 cursor-pointer`}
                          onClick={(e) => {
                            e.preventDefault();
                            setGoogleLocation(false);
                            setIsEdit(false);
                          }}
                        >
                          <div className="add_images_upload">
                            <HiLocationMarker
                              className={`w-6 h-6 text-dbase `}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex-1 justify-end flex flex-col">
                        <textarea
                          className="w-11/12 h-20 resize-none bg-white border p-2 rounded"
                          disabled={confirmedLocation ? false : true}
                          type="text"
                          id="googlemap"
                          defaultValue={confirmedLocation}
                          value={confirmedLocation}
                          min={2}
                          onChange={(e) => {
                            setConfirmedLocation(e.target.value);
                          }}
                          style={{ border: "1px solid rgb(218, 220, 227)" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative py-6 px-8">
                  <div className="mb-4">
                    <p className="text-d22 pr-bold">Your contact details</p>
                    <div className="mt-8">
                      <div className="flex items-center mb-2">
                        <label className="flex-1 pr-bold  overflow-ellipsis overflow-hidden whitespace-nowrap">
                          First name
                        </label>
                      </div>
                      <div className="relative mt-1">
                        <input
                          className="rounded block pl-4 pr-2 h-12 w-full"
                          type="text"
                          id="firstname"
                          ue={firstname}
                          defaultValue={firstname}
                          minLength={1}
                          required
                          style={{ border: "1px solid rgb(218, 220, 227)" }}
                          onChange={(e) => {
                            setFirstName(e.target.value);
                          }}
                        />
                      </div>
                      <p className="hidden text-sm mt-1 text-dbase">
                        Please enter your first name
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center mb-2">
                        <label className="flex-1 pr-bold  overflow-ellipsis overflow-hidden whitespace-nowrap">
                          Last name
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          className="rounded block pl-4 pr-2 h-12 w-full"
                          type="text"
                          id="lastname"
                          value={lastname}
                          minLength={1}
                          required
                          style={{ border: "1px solid rgb(218, 220, 227)" }}
                          onChange={(e) => {
                            setLastName(e.target.value);
                          }}
                        />
                      </div>
                      <p className="hidden text-sm mt-1 text-dbase">
                        Please enter your first name
                      </p>
                    </div>
                    <div className="mt-6">
                      <div className="flex gap-1 items-center">
                        <label className="pr-bold overflow-ellipsis overflow-hidden whitespace-nowrap">
                          Phone number
                        </label>
                        <p className="text-dbase text-xs ">{err}</p>
                        <p className="text-dbase text-xs ">{phoneValidate}</p>
                      </div>
                      <div className="flex items-center h-12 -space-x-3">
                        <div className="flex items-center space-x-1 border-b  -mb-1.5 border-dinputBorder">
                          {typeof window !== "undefined" &&
                          window.config["zone"] === "82" ? (
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
                            {typeof window !== "undefined" &&
                              window.config["countryCode"].substring(1)}
                          </p>
                        </div>

                        <div className="input mb-6 ">
                          {/* <label htmlFor="telephone">Telephone</label> */}
                          <HandlePhoneModel
                            phone={telephone}
                            setPhone={setTelephone}
                            phoneHanlder={phoneHanlder}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="save-btn-addr">
                  <button
                    style={{ transition: "background 0.8s ease 0s" }}
                    className="rounded w-full md:w-unset px-6 text-d14 pr-bold bg-dblue text-white h-12"
                  >
                    SAVE ADDRESS
                  </button>
                </div>
              </div>
            </form>
          )}

          {!googleLocation && !isEdit && (
            <GoogleMap
              position={position}
              handlePosition={handlePosition}
              countryCorrect={countryCorrect}
              handleProps={handleProps}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AddAddressPage;

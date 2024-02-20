import { axiosServer } from "@/axiosServer";
import UserSidebar from "@/components/account/UserSidebar";
import UserSidebarMobile from "@/components/account/UserSidebarMobile";
import useDeviceSize from "@/components/useDeviceSize";
import { AccountContext } from "@/contexts/AccountContext";
import buildLink from "@/urls";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";
import AccountCard from "@/components/account/accountCard";
import { ImSwitch } from "react-icons/im";
import { HiSwitchHorizontal } from "react-icons/hi";
import { HandleAuthForm } from "@/components/handleAuthForm";
import { FaSignOutAlt } from "react-icons/fa";
function profile() {
  const { openAuthForm } = HandleAuthForm();
  const [state, dispatch] = useContext(AccountContext);
  const firstname = useRef("");
  const date_of_birth = useRef("");
  const [loading, setLoading] = useState(true);
  const lastname = useRef("");
  const [confirmPass, setConfirmPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [equal, setEqual] = useState(true);
  const [alert, setAlert] = useState(false);
  const [error, setError] = useState("");
  const [errorNew, setNewError] = useState("");
  const [emailNotif, setEmailNotif] = useState([]);
  const [disabledEmails, setDisabledEmails] = useState([]);
  const [width, height] = useDeviceSize();
  const router = useRouter();

  const [data, setData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    telephone: "",
    date_of_birth: "",
  });
  const [err, setErr] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [phoneValidate, setphoneValidate] = useState("");
  const telephone = useRef("");

  useEffect(() => {
    setLoading(true);
    if (!state.loading && !state.loged) {
      router.push("/");
      setLoading(false);
    } else if (state.loged) {
      axiosServer
        .get(buildLink("get_account", undefined, window.innerWidth))
        .then((response) => {
          if (!response.data.success) {
            dispatch({ type: "setLoading", payload: false });
          } else {
            setData(response.data.data);
            setLoading(false);
          }
        });

      //get email notifications
      axiosServer
        .get(buildLink("EmailNotifications", undefined, window.innerWidth))
        .then((res) => {
          // console.log(res);
          if (res.data.success === true) {
            setEmailNotif(res.data.promotion_email);
            res.data.promotion_email.map((em) => {
              if (em.disable === 1) {
                setDisabledEmails((current) => [...current, em.service_key]);
              }
            });
          }
        });
    }
  }, [state.loading]);

  useEffect(() => {
    console.log(state.listAccCach);
  }, []);

  // Save Details
  function saveDetails(e) {
    const first = firstname.current.value;
    const last = lastname.current.value;
    const birthDate = date_of_birth.current.value;
    const obj = {
      firstname: first,
      lastname: last,
      email: data.email,
      date_of_birth: birthDate,
      //telephone: telephone.current.value !== "" ? window.config["countryCode"] + telephone.current.value : "",
    };
    setAlert(true);
    axiosServer
      .put(buildLink("save_account", undefined, window.innerWidth), obj)
      .then((response) => {
        dispatch({ type: "setUsername", payload: first });
        setAlert(true);
        console.log(response.data);
        if (response.data.success) {
          axiosServer
            .get(buildLink("get_account", undefined, window.innerWidth))
            .then((response) => {
              setData(response.data.data);
              console.log(response.data.data);
              if (
                !response.data.data.date_of_birth == "" ||
                !response.data.data.date_of_birth == null ||
                !response.data.data.date_of_birth == undefined
              ) {
                dispatch({ type: "sethasDateBirth", payload: true });
              } else {
                dispatch({ type: "sethasDateBirth", payload: false });
              }
              dispatch({ type: "setLoading", payload: false });
            });
        }
      });
    e.preventDefault();
  }




  async function logout() {
    dispatch({ type: "setLoading", payload: true });

    const hostname = window.config["site-url"];
    //remove next-auth session from cookie, and clear the jwt(session) obj.
    await signOut({ redirect: false });
    //Logout from Api
  axiosServer.post(
      buildLink("logout", undefined, undefined, hostname)
    ).then(async(res)=> {
      if(res.data.success){
       await checkLogin()
     
      }
    })
  }




  async function checkLogin() {
    
    dispatch({ type: "setLoading", payload: true });
    const hostname = window.location.host;
   await axiosServer
      .get(buildLink("login", undefined, undefined, window.config["site-url"])+`&type=logout`)
      .then((response) => {
        // console.log(response);
           
        dispatch({ type: "setLoged", payload: false });
        
        dispatch({ type: "setLoading", payload: false });
        router.push("/");
        Cookies.remove("api-token");
      
        window.location.reload();
      
      });

    // window.location.reload();
  }











  

  function disabledAccount(e) {
    axiosServer
      .post(buildLink("disabledAccount", undefined, window.innerWidth))
      .then((response) => {
        if (response.data.success) {
          logout();
          window.location.href = "/";
        }
      });
  }



  function ChangePassword(e) {
    setNewError("");
    const obj = {
      old_password: oldPass,
      new_password: newPass,
      confirm: newPass,
    };

    if (newPass === confirmPass && newPass !== "") {
      setEqual(true);
      axiosServer
        .put(buildLink("change_password", undefined, window.innerWidth), obj)
        .then((response) => {
          if (response.data.success) {
            //  console.log(response.data);
            if (response.data.error) {
              setError(response.data.error.old_password);
            } else {
              setAlert(true);
              setNewPass("");
              setConfirmPass("");
            }
          } else {
            // alert(1)
            setNewError(response.data.errors["0"]);
            // console.log(response.data.errors["0"])
          }
        });
    } else {
      setEqual(false);
    }
  }

  function disableEmailNotification(e, index, service_key) {
    const input = document.getElementById("check" + index);
    if (!input.checked) {
      // if (!disabledEmails.includes(service_key)) {
      setDisabledEmails(disabledEmails.concat(service_key));
      //}
    } else {
      setDisabledEmails(disabledEmails.filter((dis) => dis !== service_key));
    }
  }

  function saveDisabledEmails() {
    const obj = {
      discard_email: disabledEmails,
    };
    axiosServer
      .post(
        buildLink("disableEmailNotification", undefined, window.innerWidth),
        obj
      )
      .then((res) => {
        if (res.data.success) {
          setAlert(true);
        }
      });
  }

  function success() {
    setTimeout(function () {
      setAlert(false);
    }, 3000);

    return (
      <div className="relative z-50">
        <div className="fixed top-14 right-0 bg-dgreenop px-6 py-4 mx-2 my-4 rounded-md text-lg flex items-center  w-3/4 xl:w-2/4">
          <svg
            viewBox="0 0 24 24"
            className="text-dgreen w-5 h-5 sm:w-5 sm:h-5 mr-3"
          >
            <path
              fill="currentColor"
              d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
            ></path>
          </svg>
          <span className="text-dgreen">
            {" "}
            Your Information has been changed.{" "}
          </span>
        </div>
      </div>
    );
  }

  function failed() {
    setTimeout(function () {
      setAlert(false);
    }, 3000);
    return (
      <div className="relative z-50">
        <div className="bg-red-200 px-6 py-4 mx-2 my-4 rounded-md text-lg flex items-center  w-3/4 xl:w-2/4">
          <svg
            viewBox="0 0 24 24"
            className="text-red-600 w-5 h-5 sm:w-5 sm:h-5 mr-3"
          >
            <path
              fill="currentColor"
              d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
            ></path>
          </svg>
          <span className="text-red-800"> Your email address is invalid. </span>
        </div>
      </div>
    );
  }

  return (
    <div className="container text-dblack">
      <Head>
        <title>My Account | ishtari</title>
      </Head>
      <div>
        <div className="flex-row md:flex">
          <div className="w-full mb-3 md:w-1/5">
            {width > 650 ? (
              <UserSidebar active={"profile"} />
            ) : (
              <UserSidebarMobile active={"profile"} />
            )}
          </div>
          <div
            className="w-full px-2 overflow-y-auto md:w-4/5 md:pl-8 pb-1 md:py-10"
            style={{ minHeight: "740px" }}
          >
            {/* Header */}
            <div
              className={`flex ${
                width < 650 ? "flex-col" : "flex-row items-center"
              }  justify-between mb-8`}
            >
              <div className="">
                <p className="text-lg pr-semibold">Profile</p>
                <p className=" font-light">Manage your profile details</p>
              </div>
            </div>

            <div className="my-4 px-1 md:px-8 bg-white">
              <p className="bg-white pt-6 pr-bold text-d22 px-4 flex items-center">
                General Info
              </p>
              <form className="p-4 bg-white" onSubmit={(e) => saveDetails(e)}>
                <div
                  className={`flex  ${
                    width > 650 ? "flex-row gap-10" : "flex-col gap-4"
                  }`}
                >
                  <div className={width > 650 ? "w-1/2" : "w-full"}>
                    <div className="input">
                      <label>First Name</label>
                      <input
                        type="text"
                        defaultValue={data.firstname}
                        minLength="1"
                        ref={firstname}
                      />
                    </div>
                  </div>
                  <div className={width > 650 ? "w-1/2" : "w-full"}>
                    <div className="input">
                      <label>Last Name</label>
                      <input
                        type="text"
                        defaultValue={data.lastname}
                        minLength="1"
                        ref={lastname}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className={`flex pt-4 ${
                    width > 650 ? "flex-row gap-10" : "flex-col gap-4"
                  }`}
                >
                  <div className={width > 650 ? "w-1/2" : "w-full"}>
                    <div
                      className="input"
                      onClick={() => console.log(state.hasdateBirth)}
                    >
                      {!state.hasdateBirth ? (
                        <>
                          <label>
                            Birth Date{" "}
                            <span className=" text-xs text-dbase1">
                              (You can only update your birth date once)
                            </span>
                          </label>
                          <input
                            type="date"
                            ref={date_of_birth}
                            defaultValue={data.date_of_birth}
                          ></input>
                        </>
                      ) : (
                        <>
                          <label>Birth Date</label>
                          <input
                            disabled
                            type="date"
                            ref={date_of_birth}
                            defaultValue={data.date_of_birth}
                          ></input>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                   className={`bg-dblue text-white text-d13 md:px-4 px-2 py-2 mt-8 rounded ml-auto block max-md:w-full w-64 transition-all uppercase duration-300 ease-out transform hover:bg-dbluedark hover:text-d14 hover:scale-105`}
                >
                  SAVE DETAILS
                </button>
              </form>
            </div>

            <div className="my-4 px-1 md:px-8 bg-white">
              <p className="bg-white pt-6 pr-bold text-d22 px-4 flex items-center">
                Security
              </p>
              <div className="p-4 bg-white">
                <div
                  className={`flex  ${
                    width > 650 ? "flex-row gap-10" : "flex-col gap-4"
                  }`}
                >
                  <div className={width > 650 ? "w-1/2" : "w-full"}>
                    <div className="input">
                      <label>Email</label>
                      <input
                        type="email"
                        defaultValue={data.email}
                        readOnly={true}
                        className="opacity-80"
                      />
                    </div>
                  </div>
                  <div className={width > 650 ? "w-1/2" : "w-full"}>
                    <div className="input">
                      <label>Old Password</label>
                      <input
                        type="password"
                        value={oldPass}
                        autoComplete="new-password"
                        onChange={(e) => setOldPass(e.target.value)}
                      />
                    </div>
                    {errorNew["errorCode"] === "old_password" && (
                      <span className="text-dbase font-light">
                        {" "}
                        {errorNew["errorMsg"]}{" "}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className={`flex flex-col mobile:flex-row pt-4 ${
                    width > 650 ? "gap-10" : "gap-8"
                  }`}
                >
                  <div className={width > 650 ? "w-1/2" : "w-full"}>
                    <div className={`${equal ? "input" : "errorInput"}`}>
                      <label>New Password</label>
                      <input
                        type="password"
                        // defaultValue=""
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className={width > 650 ? "w-1/2" : "w-full"}>
                    <div className={`${equal ? "input" : "errorInput"}`}>
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        // defaultValue=""
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <button
                    className={`bg-dblue text-white text-d13 md:px-4 px-2 py-2 mt-8 rounded ml-auto block max-md:w-full w-64 transition-all uppercase duration-300 ease-out transform hover:bg-dbluedark hover:text-d14 hover:scale-105`}
                  onClick={(e) => ChangePassword(e)}
                >
                  CHANGE PASSWORD
                </button>
              </div>
            </div>
            {state.listAccCach.length > 0 && (
              <div className="my-4 px-1 md:px-8 bg-white">
                <p className="bg-white pt-6 pr-bold text-d22 px-4 flex items-center ">
                  Switch Account
                </p>
                <div className="p-4  bg-white">
                  <div className="flex justify-between gap-2  ">
                    <AccountCard
                   username={state.username == null ||state.username == undefined ||state.username == "" ?state.email:state.username}
                      isloged={true}
                      email={state.email}
                      password={state.password}
                    />
                    <button
                      onClick={() => {
                        openAuthForm("switch");
                      }}
                      className="flex flex-row gap-2 text-d13 bg-dblue  px-2 rounded-md text-white justify-center hover:scale-105 hover:text-d16 hover:bg-dbluedark transform uppercase duration-300
                      ease-out transition-all"
                    >
                      {" "}
                      <HiSwitchHorizontal className=" my-auto " />{" "}
                  
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="my-4 px-1 md:px-8 bg-white">
              <p className="bg-white pt-6 pr-bold text-d22 px-4 flex items-center ">
                Email Notifications
              </p>
              <div className="p-4  bg-white">
                <div className="flex flex-col gap-8 md:gap-7 md:w-1/2 mt-4">
                  {emailNotif?.map((email, index) => (
                    <div
                      className="flex justify-between text-sm"
                      key={email.service_key}
                    >
                      <div>{email.service_title}</div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          id={"check" + index}
                          defaultChecked={!email.disable ? "checked" : ""}
                          onChange={(e) =>
                            disableEmailNotification(
                              e,
                              index,
                              email.service_key
                            )
                          }
                        />
                        <span className="slider_swicth round"></span>
                      </label>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => saveDisabledEmails()}
                  className={`bg-dblue text-white text-d13 md:px-4 px-2 py-2 mt-8 rounded ml-auto block max-md:w-full w-64 transition-all uppercase duration-300 ease-out transform hover:bg-dbluedark hover:text-d14 hover:scale-105`}
                >
                  Save Details
                </button>
              </div>
            </div>

            <div className="my-4 px-1 md:px-8 bg-white">
              <p className="bg-white pt-6 pr-bold text-d22 px-4 flex items-center ">
                Account Deletion
              </p>
              <div className="p-4 pt-2 bg-white">
                <button
                  // className={`bg-dblue text-white text-d13 md:px-4 px-2 py-2 mt-8 rounded ml-auto block max-md:w-full w-64 transition-all uppercase duration-300 ease-out hover:bg-dbluedark`}
                  className={`bg-dblue text-white text-d13 md:px-4 px-2 py-2 mt-8 rounded ml-auto block max-md:w-full w-64 transition-all uppercase duration-300 ease-out transform hover:bg-dbluedark hover:text-d14 hover:scale-105`}
                  onClick={(e) => disabledAccount(e)}
                >
                  Delete Your Account
                </button>
              </div>
            </div>



            <div className="my-4 px-1 md:px-8 bg-white">
          
              <div className="p-4 pt-2 bg-white">
                <button
                  // className={`bg-dblue text-white text-d13 md:px-4 px-2 py-2 mt-8 rounded ml-auto block max-md:w-full w-64 transition-all uppercase duration-300 ease-out hover:bg-dbluedark`}
                  className={`bg-dblue flex-row justify-center gap-5 flex  text-white text-d13 md:px-4 px-2 py-2 mt-8 rounded ml-auto  max-md:w-full w-64 transition-all uppercase duration-300 ease-out transform hover:bg-dbluedark hover:text-d14 hover:scale-105`}
                  onClick={(e) => logout()}
                >
                 
                  Sign Out
                  <FaSignOutAlt  className="  my-auto"/>
                </button>
              </div>
            </div>
          </div>
          {alert && success()}
        </div>
      </div>
    </div>
  );
}

export default profile;

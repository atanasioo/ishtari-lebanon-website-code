import React, { useContext, useEffect, useRef, useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { IoMdClose } from "react-icons/io";
import { axiosServer } from "@/axiosServer";
import { AccountContext } from "../../contexts/AccountContext";
import buildLink from "@/urls";
import { AiOutlineUser } from "react-icons/ai";
import { useSession } from "next-auth/react";
import Cookies from "js-cookie";
import { FiChevronDown } from "react-icons/fi";
import Link from "next/link";
import { BsFillCartCheckFill, BsFillHeartFill } from "react-icons/bs";
import { MdAvTimer } from "react-icons/md";
import { FaMoneyBillWave, FaUserAlt } from "react-icons/fa";
import { ImLocation } from "react-icons/im";


function Account() {
  const [message, setMessage] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [err, setErr] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);
  const [showSignupError, setShowSignupError] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [state, dispatch] = useContext(AccountContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const { data: session, status } = useSession();
  const loginEmail = useRef("");
  const loginPassword = useRef("");
  const signupEmail = useRef("");
  const signupPassword = useRef("");
  const signupFirst = useRef("");
  const signupLast = useRef("");
  const path = "";

  // console.log(state);
  // console.log(session);

  async function login(e) {
    e.preventDefault();
    dispatch({ type: "setLoading", payload: true });
    // const obj= {
    //     email: loginEmail.current.value,
    //   password: loginPassword.current.value,
    // }
    const response = await signIn("login", {
      email: loginEmail.current.value,
      password: loginPassword.current.value,
      redirect: false,
    });

    if (response.status === 200) {
      checkLogin();
      // window.location.reload();
    } else {
      setShowLoginError(true);
      setLoginError(response.error);
    }

    // console.log(response);
    // const hostname = "https://www.ishtari.com/";
    // const response = await axiosServer.post(
    //     buildLink("login", undefined, undefined, hostname),
    //     // {
    //     //   headers: {
    //     //     Authorization: "Bearer " + token,
    //     //   },
    //     // },
    //     obj
    //   );

    // console.log(response);
  }

  // Check login
  function checkLogin() {
    dispatch({ type: "setLoading", payload: true });
    axiosServer
      .get(
        buildLink(
          "login",
          undefined,
          window.innerWidth

        )
      )
      .then((response) => {
        const data = response.data;

        dispatch({ type: "setShowOver", payload: false });
        if (data.customer_id > 0) {
          dispatch({ type: "setLoged", payload: true });
          dispatch({ type: "setUsername", payload: data.username });
          dispatch({ type: "setEmail", payload: data.email });
          // if (
          //   history.location.pathname == "/checkout" &&
          //   window.location.host === "www.ishtari.com.gh"
          // ) {
          //   window.location.reload();
          // }
        } else {
          dispatch({ type: "setLoged", payload: false });
        }
        dispatch({ type: "setLoading", payload: false });
      });
  }

  // Signup
  async function signup(e) {
    e.preventDefault();
    setSignupLoading(true);
    // const email = signupEmail.current.value;
    // const password = signupPassword.current.value;
    // const confirm = signupPassword.current.value;
    // const firstname = signupFirst.current.value;
    // const lastname = signupLast.current.value;
    // const obj = JSON.stringify({
    //   email,
    //   password,
    //   firstname,
    //   lastname,
    //   confirm,
    // });

    const response = await signIn("signup", {
      email: signupEmail.current.value,
      password: signupPassword.current.value,
      confirm: signupPassword.current.value,
      firstname: signupFirst.current.value,
      lastname: signupLast.current.value,
      redirect: false,
    });

    if (response.status === 200) {
      checkLogin();
    } else {
      setShowSignupError(true);
      setSignupError(data?.errors[0]?.errorMsg);
    }
    setSignupLoading(false);
  }

  // console.log(state);

  async function logOut(e) {
    e.preventDefault();
    const hostname = "https://www.ishtari.com/";
    dispatch({ type: "setLoading", payload: true });
    setShowUserMenu(false);
    //remove next-auth session from cookie, and clear the jwt(session) obj.
    await signOut({ redirect: false });
    //Logout from Api
    const response = await axiosServer.post(
      buildLink("logout", undefined, undefined, hostname)
    );
    checkLogin();
    dispatch({ type: "setSeller", payload: false });
    Cookies.remove("seller_id");
    window.location.reload();
    console.log(response);
  }

  useEffect(() => {
    dispatch({ type: "setAdminLoading", payload: true });
    // 70 91 1870

    var adminToken = Cookies.get("ATDetails");
    // if (
    //   window.location.host === "localhost:3000" ||
    //   window.location.host === "localhost:3001"
    // ) {
    //   adminToken = "eab4e66ebc6f424bf03d9b4c712a74ce";
    // }

    if (typeof adminToken != typeof undefined) {
      dispatch({ type: "setAdminToken", payload: adminToken });
      dispatch({ type: "setAdmin", payload: true });
      dispatch({ type: "setAdminLoading", payload: false });
    } else {
      dispatch({ type: "setAdmin", payload: false });
      dispatch({ type: "setAdminLoading", payload: false });
    }
    dispatch({ type: "setLoading", payload: true });
    axiosServer
      .get(
        buildLink(
          "login",
          undefined,
          undefined
        )
      )
      .then((response) => {
        const data = response.data;

        dispatch({ type: "setShowOver", payload: false });
        if (data.customer_id > 0) {
          dispatch({ type: "setLoged", payload: true });
          dispatch({ type: "setUsername", payload: data.username });
          dispatch({ type: "setUserId", payload: data.customer_id });
          dispatch({ type: "setEmail", payload: data.email });
        } else {
          dispatch({ type: "setLoged", payload: false });
        }
        dispatch({ type: "setLoading", payload: false });
        if (
          data.seller_logged !== "0" &&
          data.seller_logged !== null &&
          data.seller_logged !== undefined
        ) {
          dispatch({ type: "setSeller", payload: true });
          Cookies.set("seller_id", data.seller_logged);
        }
      });
  }, [dispatch]);

  return (
    <div className="relative">
      {state.showOver && (
        <div className="fixed w-screen min-h-screen bg-dblack top-0 left-0 z-50 bg-opacity-50 flex flex-col items-center justify-center">
          {state.showLogin && (
            <div className="bg-white text-center text-dblack  w-96 rounded-lg p-8 pb-0 overflow-hidden relative">
              <span
                onClick={() => {
                  dispatch({ type: "setShowOver", payload: false });
                  dispatch({ type: "setShowLogin", payload: false });
                  dispatch({ type: "setShowSignup", payload: false });
                }}
                className=" z-10 absolute top-0 text-2xl right-0 w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-dgrey"
              >
                <IoMdClose />
              </span>
              {message && (
                <span
                  onClick={() => setMessage()}
                  className="cursor-pointer text-sm z-10 absolute top-0 right-0 bg-dgreen w-full text-white py-2"
                >
                  {message}
                </span>
              )}
              {err && (
                <span
                  onClick={() => setErr()}
                  className="cursor-pointer z-10 absolute top-0 right-0 bg-dbase w-full text-white py-2"
                >
                  {err}
                </span>
              )}
              {showLoginError && (
                <span
                  onClick={() => setShowLoginError(false)}
                  className="cursor-pointer z-10 absolute top-10  right-0 bg-dblack w-full text-white py-2"
                >
                  {loginError}
                </span>
              )}
              <p
                className={`text-2xl font-light  ${
                  showLoginError ? "mt-24" : "mt-6"
                }`}
              >
                Welcome back!
              </p>
              <p className="text-2xl font-semibold">Sign in to your account</p>
              <div className="flex justify-center text-sm font-extralight my-4">
                <span>Don't have an account?</span>
                <span
                  onClick={() => {
                    dispatch({ type: "setShowOver", payload: true });
                    dispatch({ type: "setShowLogin", payload: false });
                    dispatch({ type: "setShowSignup", payload: true });
                  }}
                  className="text-dblue ml-2 cursor-pointer"
                >
                  Sign Up
                </span>
              </div>
              <form onSubmit={(e) => login(e)}>
                <div className="my-4">
                  <div className="input">
                    <label>Email</label>
                    <input
                      ref={loginEmail}
                      type="email"
                      required={true}
                      autoComplete="email"
                    />
                  </div>
                  <div className="input mt-4">
                    <label>Password</label>
                    <input
                      ref={loginPassword}
                      type="password"
                      required={true}
                      autoload="true"
                      autoComplete="password"
                      minLength="6"
                    />
                  </div>
                </div>
                <p
                  onClick={() => handleForgetPassword()}
                  className="text-dblue text-sm cursor-pointer py-1"
                >
                  Forgot your password?
                </p>
               

                <button className="text-dblue py-4 border-t border-dinputBorder block text-center -mx-8 w-96 mt-6 hover:bg-dblue hover:text-white">
                  {loginLoading ? <span>LOADING</span> : <span>SIGN IN</span>}
                </button>
                <p className="pt-2 text-dgrey1">- OR -</p>
                {/* <FacebookLogin
              appId={window.config["appId"]}
              fields="name,email"
              scope="public_profile,email"
              isMobile={false}
              redirectUri={window.location.href}
              callback={responseFacebook}
              render={(renderProps) => (
                <p
                  onClick={() => renderProps.onClick()}
                  className="py-4 text-dblue cursor-pointer hover:text-dbluedark"
                >
                  <i className="icon icon-facebook mr-2"></i>
                  <span>Login With Facebook</span>
                </p>
              )}
            /> */}
              </form>
              <a onClick={() => signIn('facebook')}>Sign in with Facebook</a>
            </div>
          )}
          {state.showSignup && (
            <div className="bg-white text-center text-dblack  w-96 rounded-lg p-8 pb-0 overflow-hidden relative">
              <span
                onClick={() => {
                  dispatch({ type: "setShowOver", payload: false });
                  dispatch({ type: "setShowLogin", payload: false });
                  dispatch({ type: "setShowSignup", payload: false });
                }}
                className=" z-10 absolute top-0 right-0 w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-dgrey"
              >
                <IoMdClose className="text-2xl" />
              </span>
              {showSignupError && (
                <span
                  onClick={() => setShowSignupError(false)}
                  className="cursor-pointer z-10 absolute top-0 right-0 bg-dblack w-full text-white py-2"
                >
                  {signupError}
                </span>
              )}
              <p
                className={`text-2xl font-semibold ${
                  showLoginError ? "mt-12" : "mt-6"
                }`}
              >
                Create an account
              </p>
              <div className="flex justify-center text-sm font-extralight my-4">
                <span>Already have an account?</span>
                <span
                  className="text-dblue ml-2 cursor-pointer"
                  onClick={() => {
                    dispatch({ type: "setShowLogin", payload: true });
                    dispatch({ type: "setShowSignup", payload: false });
                  }}
                >
                  Sign In
                </span>
              </div>
              <form onSubmit={(e) => signup(e)}>
                <div className="my-4">
                  <div className="input">
                    <label>Email</label>
                    <input
                      ref={signupEmail}
                      type="email"
                      required={true}
                      autoComplete="email"
                    />
                  </div>
                  <div className="input my-4">
                    <label>Password</label>
                    <input
                      ref={signupPassword}
                      type="password"
                      required={true}
                      autoComplete="password"
                      minLength="6"
                    />
                  </div>
                  <div className="input my-4">
                    <label>First name</label>
                    <input
                      ref={signupFirst}
                      type="text"
                      required={true}
                      autoComplete="firstname"
                      minLength="2"
                    />
                  </div>
                  <div className="input my-4">
                    <label>Last name</label>
                    <input
                      ref={signupLast}
                      type="text"
                      required={true}
                      autoComplete="lastname"
                      minLength="2"
                    />
                  </div>
                </div>

                <button className="text-dblue py-4 border-t border-dinputBorder block text-center -mx-8 w-96 mt-6 hover:bg-dblue hover:text-white">
                  {signupLoading ? (
                    <span>LOADING</span>
                  ) : (
                    <span>CREATE AN ACCOUNT</span>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
      <div className="hidden xl:block lg:block ">
        {/* {state.loading && (
          <div
            className="text-white border-r border-dmenusep  flex items-center pl-3 pr-6 cursor-pointer hover:opacity-80 relative"
     
          >
            <i className=" icon icon-user ml-2 text-xl"></i>
            <span className=" w-6 h-6 bg-dblue flex  items-center justify-center rounded-full text-xs absolute right-1  -top-1 border border-white">
              <span><Loader styles={"h-5 w-5 text-white"} /></span>
            </span>
          </div>
        )} */}
        {/* If not logged */}
        {!state.loged && !state.loading && (
          <div
            onClick={() => {
              dispatch({ type: "setShowOver", payload: true });
              dispatch({ type: "setShowLogin", payload: true });
            }}
            className="lg:border-r lg:border-dplaceHolder font-semibold text-base flex items-center px-3 md:pr-5 cursor-pointer hover:opacity-80 relative"
          >
            <span>Sign In</span>
            <AiOutlineUser className="ml-1 w-5 h-5" />
          </div>
        )}
        {/* if loged */}
        {state.loged && !state.loading && (
          <div
            onClick={() => {}}
            className="
               
            lg:border-r
            lg:border-dplaceHolder
                flex 
                items-start
                flex-col
                
                px-3
                relative 
                text-sm
                "
          >
            <div
              role="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className=" cursor-pointer hover:opacity-80 flex items-center"
            >
              <span className="text-d11 font-light flex flex-col">
                <span>Welcome {state.username}</span>
                <span className="text-sm font-semibold">My Account</span>
              </span>
              <FiChevronDown
                className={`icon icon-down-dir ml-3 transition-all ${
                  showUserMenu && "transform rotate-180"
                }`}
              ></FiChevronDown>
            </div>

            {showUserMenu && (
              <div className="absolute bg-white top-12 right-0 w-52 py-4 pb-0 z-40 shadow-2xl text-dgrey1">
                <Link
                  href={`${path}/account/orders`}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="py-2 flex items-center cursor-pointer hover:bg-dgrey1 hover:bg-opacity-10 px-3"
                >
                  <FaMoneyBillWave className=" text-d16 " />
                  <span className="ml-4">Orders</span>
                </Link>
                <Link
                  href={`${path}/account/buyagain`}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="py-2 flex items-center cursor-pointer hover:bg-dgrey1 hover:bg-opacity-10 px-3"
                >
                  <BsFillCartCheckFill className="text-d16" />
                  <span className="ml-4">Buy Again</span>
                </Link>

                <Link
                  href={`${path}/account/recentlyViewed`}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="py-2 flex items-center cursor-pointer hover:bg-dgrey1 hover:bg-opacity-10 px-3"
                >
                  <MdAvTimer className="text-d18" />
                  <span className="ml-4">Recently Viewed</span>
                </Link>
                <Link
                  href={`${path}/account/address`}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="py-2 flex items-center hover:bg-dgrey1 hover:bg-opacity-10 px-3 cursor-pointer"
                >
                  <ImLocation className="text-d18" />
                  <span className="ml-4">Addresses</span>
                </Link>
                <Link
                  href={`${path}/account/wishlist`}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="py-2 flex items-center hover:bg-dgrey1 hover:bg-opacity-10 px-3 cursor-pointer"
                >
                  <BsFillHeartFill className="text-d17"></BsFillHeartFill>
                  <span className="ml-4">WishList</span>
                </Link>

                <Link
                  href={`${path}/account/profile`}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="py-2 flex items-center hover:bg-dgrey1 hover:bg-opacity-10 px-3 cursor-pointer"
                >
                  <FaUserAlt className="text-d17"></FaUserAlt>
                  <span className="ml-4">Profile</span>
                </Link>

                <p
                  onClick={(e) => logOut(e)}
                  className="text-center text-sm border-t border-dinputBorder cursor-pointer hover:bg-dgrey1 hover:bg-opacity-10 py-3"
                >
                  Sign Out
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Account;

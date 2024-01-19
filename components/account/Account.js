import React, { useContext, useEffect, useRef, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { IoMdClose } from "react-icons/io";
import { axiosServer } from "@/axiosServer";
import { AccountContext } from "../../contexts/AccountContext";
import buildLink from "@/urls";
import { AiOutlineUser } from "react-icons/ai";
import Cookies from "js-cookie";
import { FiChevronDown } from "react-icons/fi";
import FacebookLogin from "@greatsumini/react-facebook-login";
import Link from "next/link";
import {RiUserFollowLine} from "react-icons/ri";
import {
  BsFillCartCheckFill,
  BsFillHeartFill,
  BsStarFill
} from "react-icons/bs";
import { MdAvTimer, MdFeedback } from "react-icons/md";
import {
  FaCheckCircle,
  FaMoneyBillWave,
  FaTicketAlt,
  FaUserAlt,
  FaWallet,
} from "react-icons/fa";
import { useRouter } from "next/router";
import { ImLocation } from "react-icons/im";
import { HiLightBulb } from "react-icons/hi";
import Loader from "../Loader";
function Account() {
  const modal = useRef(null);
  const [message, setMessage] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [err, setErr] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);
  const [showSignupError, setShowSignupError] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [emailSent , setEmailSent] = useState(false);
  const [state, dispatch] = useContext(AccountContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const { data: session, status, update: sessionUpdate } = useSession();
  const [stateLogin, setStateLogin] = useState({});
  const [stateLoginResult, setStateLoginResult] = useState({});
  const dontshowcouponcheck = useRef(null);
  
  const loginEmail = useRef("");
  const loginPassword = useRef("");
  const signupEmail = useRef("");
  const signupPassword = useRef("");
  const signupFirst = useRef("");
  const signupLast = useRef("");
  // const birthDate = useRef("");
  const path = "";
  const router = useRouter();
   const [newdate,setDate] = useState(Date);

  // if (session) {
  //   // The user is logged in
  //   const obj = {
  //     provider: "facebook",
  //     social_access_token: session.accessToken,
  //     id: session.user.id,
  //     email: session.user.email
  //       ? session.user.email
  //       : session.user.id + "@ishtari-mobile.com"
  //   };
  //   const response = axiosServer.post(buildLink("social"), obj);
  //   if (response.customer_id) checkLogin();
  //   // window.location.reload();

  // } else {
  //   // The user is not logged in
  //   // return <p>Please log in with Facebook.</p>
  // }


  const handleLockEmailButton = () => {
    if (!state.ButtonLocked) {
      dispatch({ type: "setButtonLocked", payload: true });
      // Unlock the button after 30 seconds
      setTimeout(() => {
        dispatch({ type: "setButtonLocked", payload: false });
      }, 30000);
    }
  };
  useEffect(() => {
    // Cleanup timeout in case component unmounts before 30 seconds
    return () => clearTimeout();
  }, []);

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!modal.current) return;
      if (
        !state.ModalCoupon ||
        modal.current.contains(target) 
      )
        return;
        dispatch({ type: "setOpenModalCoupon", payload: false });
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });


  const dontShowCouponPop=(e)=>{
   
    Cookies.set("showCouponPop", e.target.checked);
  }


  useEffect(()=>{
if(state.hasSignedUp){
  checkLogin("register");
}else{
  checkLogin("login");
}
  },[state.hasSignedUp,state.hasLogedIn])



  useEffect(() => {
    // if () {
    // alert(session.user.email);

    if (!state.loged && status === "authenticated") {
      if (session) {
        log();
        
     
      }
    }

    async function log() {
      // console.log(session)
      const obj = {
        provider: "facebook",
        social_access_token: session.accessToken,
        id: session.user.id,
        email: session.user.email
          ? session.user.email
          : session.user.id + "@ishtari-mobile.com"
      };
      const response = await axiosServer.post(buildLink("social", undefined, undefined, window.location.host), obj);
      // console.log(response)
      if (response?.data?.data?.customer_id) checkLogin('login');
      // window.location.reload();
    }
  }, [session]);

  async function handleFacebookLogin(e) {
    e.preventDefault();
    const result = await signIn("facebook");
  }

  async function social() {
    // console.log("start-1");
    const result = await signIn("facebook");
    if (result) {
      return result;
      const results = await log();
    } else {
      return;
    }
    if (result?.error) {
      alert("Facebook login error:", result.error);
      return;
    }
  }





 const  handleCloseAuthForm=()=>{
  setErr();
  setMessage(false);
  setEmailSent(false)
  dispatch({ type: "setShowOver", payload: false });
                  dispatch({ type: "setShowLogin", payload: false });
                  dispatch({ type: "setShowSignup", payload: false });
                  dispatch({ type: "setShowForgetPassword", payload: false });
                  dispatch({ type: "setShowEmailSent", payload: false });
                  
  }

  const openAuthForm=()=>{
    setErr();
    setMessage(false);
    setEmailSent(false)
    dispatch({ type: "setShowOver", payload: true });
                    dispatch({ type: "setShowLogin", payload: true });
                    dispatch({ type: "setShowSignup", payload: false });
                    dispatch({ type: "setShowForgetPassword", payload: false });
                    dispatch({ type: "setShowEmailSent", payload: false });
  }



  const backToLogIn=(e)=>{
e.preventDefault();
    setErr();
    setEmailSent(false)
    setMessage();
    dispatch({ type: "setShowLogin", payload: true })
    dispatch({ type: "setShowForgetPassword", payload: false })
  }





  useEffect(() => {
    if (
      Object.keys(stateLogin).length > 0 &&
      Object.keys(stateLoginResult).length > 0
    ) {
      successFB(stateLogin, stateLoginResult);
    }
  }, [stateLogin, stateLoginResult]);
  function successFB(response1, response) {
    // console.log(response);
    if (typeof response.email == "undefined" || response.email?.length === 0) {
      // console.log(response);
      // setShowLoginError(true);
      // setLoginError(" Facebook account has no email address ");
      // return;
    }
    const obj = {
      provider: "facebook",
      social_access_token: response1.accessToken,
      email: response?.email
        ? response?.email
        : response.id + "@ishtari-mobile.com",
      id: response.id
    };

    axiosServer.post(buildLink("social", undefined, undefined, window.location.host), obj).then((resp) => {
       
      checkLogin('login');
    });
  }

  async function log() {
    if (session) {
      const obj = {
        provider: "facebook",
        social_access_token: session.accessToken,
        id: session.user.id,
        //  name: session.user.name,
        email: session.user.email
          ? session.user.email
          : session.user.id + "@ishtari-mobile.com"
      };
      const response = await axiosServer.post(buildLink("social", undefined, undefined, window.location.host), obj);
      if (response) {
        checkLogin('login');
      }
    }
  }

  async function login(e) {
    e.preventDefault();
    dispatch({ type: "setLoading", payload: true });
    const response = await signIn("login", {
      email: loginEmail.current.value,
      password: loginPassword.current.value,
      redirect: false
    });

    if (response.status === 200) {
      checkLogin('login');
    } else {
      setShowLoginError(true);
      setLoginError(response.error);
    }
  }

  // Check login
  function checkLogin(type) {
    
    dispatch({ type: "setLoading", payload: true });
    const hostname = window.location.host;
    axiosServer
      .get(buildLink("login", undefined, undefined, window.config["site-url"])+`&type=${type}`)
      .then((response) => {
        // console.log(response);
        
        const data = response.data;
       
         if(response.data.coupon == null || !response.data.coupon){
            
         }else{
            
          dispatch({ type: "setCouponForYou", payload: response.data.coupon });
         const canopenModal = Cookies.get("showCouponPop");
         if(!canopenModal || canopenModal == null|| canopenModal == undefined){
          setTimeout(()=>{
            dispatch({ type: "setOpenModalCoupon", payload: true });
          },3000)
        }
        }
        

      

        dispatch({ type: "setShowOver", payload: false });
        if (data.customer_id > 0) {
          dispatch({ type: "setViewMobileMenu", payload: false })
          dispatch({ type: "setLoged", payload: true });
          dispatch({ type: "setUsername", payload: data.username });
          dispatch({ type: "setEmail", payload: data.email });
          dispatch({ type: "setFirstname", payload: data?.firstname });
          dispatch({ type: "setLastname", payload: data?.lastname });
          dispatch({type:"sethasDateBirth",payload:data?.has_birthday});
          const remindBirthdayopend = Cookies.get("remindBirthdayopend");
   
          if(!data?.has_birthday && (remindBirthdayopend == false|| remindBirthdayopend == null || remindBirthdayopend == undefined )){
            dispatch({type:"setopenRemindBirthday",payload:true});
          }
        
        
        } else {
          dispatch({ type: "setLoged", payload: false });
        }
        dispatch({ type: "setLoading", payload: false });
      });

    // window.location.reload();
  }


 



  // Signup
  async function signup(e) {
    
    e.preventDefault();
    setSignupLoading(true);
    // const birthDateInputVal = birthDate.current.value;
    // const parts = birthDateInputVal.split('/');
 
    //   const formattedDate = parts[0];
   
    const response = await signIn("signup", {
      email: signupEmail.current.value,
      password: signupPassword.current.value,
      confirm: signupPassword.current.value,
      firstname: signupFirst.current.value,
      lastname: signupLast.current.value,
      // date_of_birth: formattedDate,
      redirect: false
    });

    if (response.status === 200) {
   
      checkLogin('register');
      
   
    } else {
      setShowSignupError(true);
      setSignupError(response.error);
    }
    setSignupLoading(false);
  }

  // Forget Password
   const handleForgetPassword= async(e)=>  {
    e.preventDefault();
    if(state.ButtonLocked){
return;
    }{
    handleLockEmailButton();
    dispatch( {type:"setshowTimer",payload:true});
    dispatch({ type: "setLoadingEmail", payload: true });
    if (loginEmail.current.value) {
      const new_password = await axiosServer.post(
        buildLink(
          "forget_password",
          undefined,
          undefined,
          window.config["site-url"]
        ),
        {
          email: loginEmail.current.value
        }
      ).then((response) => {
        dispatch({ type: "setLoadingEmail", payload: false });
     
      if (response.data.errors) {
        setErr("No Email Found");
      } else {
        
        setMessage(response?.data?.data?.message);
        setEmailSent(true);
        setErr();
      }
    });
    } else {
      dispatch({ type: "setLoadingEmail", payload: false });
      setErr("Please enter your email");
    }
  }
  }
  async function logOut(e) {
    e.preventDefault();
    const hostname = window.config["site-url"];
    dispatch({ type: "setLoading", payload: true });
    setShowUserMenu(false);
    //remove next-auth session from cookie, and clear the jwt(session) obj.
    await signOut({ redirect: false });
    //Logout from Api
    const response = await axiosServer.post(
      buildLink("logout", undefined, undefined, window.config["site-url"])
    );
    checkLogin('login');
    dispatch({ type: "setSeller", payload: false });
    Cookies.remove("seller_id");
    window.location.href = "/";
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
    //   Cookies.set("ATDetails", adminToken);
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
      .get(buildLink("login", undefined, undefined, window.config["site-url"]))
      .then((response) => {
        const data = response.data;

        dispatch({ type: "setShowOver", payload: false });
        if (data.customer_id > 0) {
          dispatch({ type: "setLoged", payload: true });
          dispatch({ type: "setUsername", payload: data.username });
          dispatch({ type: "setUserId", payload: data.customer_id });
          dispatch({ type: "setEmail", payload: data.email });
          dispatch({ type: "setFirstname", payload: data?.firstname });
          dispatch({ type: "setLastname", payload: data?.lastname });
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

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      if (showUserMenu) {
        function handleClickOutside(event) {
          if (ref.current && !ref.current.contains(event.target)) {
            setTimeout(() => setShowUserMenu(false), 200);
          }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }
    }, [ref, showUserMenu]);
  }

  return (
    <div className="relative">
      {state.showOver && (
        <div className="fixed w-screen min-h-screen bg-dblack top-0 left-0 z-50 bg-opacity-50 flex flex-col items-center justify-center">
          {state.showLogin && (
            <div className="bg-white text-center text-dblack  w-96 rounded-lg p-8 pb-4  overflow-hidden relative">
              <span
                onClick={
                 handleCloseAuthForm
                }
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
                  onClick={() => {
                    dispatch({ type: "setShowOver", payload: true });
                    dispatch({ type: "setShowForgetPassword", payload: true });
                    dispatch({ type: "setShowLogin", payload: false });
                  }}
                  className="text-dblue text-sm cursor-pointer py-1"
                >
                  Forgot your password?
                </p>

                <button className="text-dblue py-4 border-t border-dinputBorder block text-center -mx-8 w-96 mt-6 hover:bg-dblue hover:text-white">
                  {loginLoading ? <span>LOADING</span> : <span>SIGN IN</span>}
                </button>
                <p className="pb-2 text-dgrey1">- OR -</p>
                {/* <FacebookLogin
              appId={
                .config["appId"]}
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
              {/* <form onClick={(e) => handleFacebookLogin(e)}>
                <button className="flex text-dblue  text-center -mx-8 w-96 hover:text-opacity-80 pointer-events-auto justify-center align-middle al">
                  <FaFacebookF className="mr-2 mt-0.5" /> Login With Facebook
                </button>


              </form> */}

              <FacebookLogin
                appId={window.config['appId']}
                fields="name,email"
                scope="public_profile,email"
                isMobile={false}
                onSuccess={(response) => {
                  setStateLogin(response);
                }}
                onFail={(error) => {
                  // console.log("Login Failed!", error);
                }}
                onProfileSuccess={(response) => {
                  setStateLoginResult(response);
                }}
                //  redirectUri={window.location.href}
                // callback={responseFacebook}
                render={(renderProps) => (
                  <p
                    onClick={() => renderProps.onClick()}
                    className="py-4 text-dblue cursor-pointer hover:text-dbluedark"
                  >
                    <i className="icon icon-facebook mr-2"></i>
                    <span>Login With Facebook</span>
                  </p>
                )}
              />
            </div>
          )}
          {state.showSignup && (
            <div className="bg-white text-center text-dblack  w-96 rounded-lg p-8 pb-0 overflow-hidden relative">
              <span
                onClick={
                handleCloseAuthForm
                }
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
              <form onSubmit={(e)=> {
                dispatch( {type:"setHasSignedUp",payload:true});
                signup(e)
              
              }
              
              }
                
                >
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
                  {/* <div className="input my-4">
                    <label>Birth Date</label>
                    <input
                      ref={birthDate}
                      type="date"
                      required={true}
                      autoComplete="lastname"
                      
                    />
                  </div> */}
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

{state.showForgetPassword && (
  
            <div className="bg-white text-center text-dblack  w-96 rounded-lg p-8 pb-0 overflow-hidden relative">
           
              <span
                onClick={
                  handleCloseAuthForm
                }
                className=" z-10 absolute top-0 right-0 w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-dgrey"
              >
                <IoMdClose className="text-2xl" />
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
              <p
                className={`text-2xl font-semibold ${
                  showLoginError ? "mt-12" : "mt-6"
                }`}
              >
                Forgot Your Password ?
              </p>
              <div className="flex justify-start text-sm font-extralight my-4">
              If you've forgotten your password, 
We'll send you a new password.
             
              </div>
              <form>
                <div className="my-4">
                  <div className="input">
                    <label>Email</label>
                    <input
                      value={ loginEmail.current.value ? loginEmail.current.value:""}
                      type="email"
                      required={true}
                      autoComplete="email"
                      ref={loginEmail}
                    />
                  </div>
               
                
                
                </div>


                   <div className="flex flex-row gap-5 justify-center mb-4 ">
                   { emailSent ?(
                <button type="cancel"
                onClick={(e)=> backToLogIn(e) }
                className="  flex-row text-dblue py-4 border border-dinputBorder block text-center  w-96 mt-6 hover:bg-dblue hover:text-white">
              
                 <span>Back To LogIn</span>
                  
                </button>
                ):(<></>)
}            
                <button 
                onClick={(e)=>handleForgetPassword(e)}
                className={` py-4 border border-dinputBorder block text-center ${state.ButtonLocked?" bg-dgrey1":"bg-dblue"} bg-dblue hover:${state.ButtonLocked?" bg-dgrey1":"bg-dblue1"} w-96 mt-6 text-white`}>
                
                    <span>{ state.loadingEmail?(<div className=" w-full flex justify-center text-center"><div className="w-[30px]"><Loader/></div></div>):( state.ButtonLocked?<>Wait 30 second</> :<>Send Email</>)}</span>
                 
                </button>
              
                </div>
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
        {!state.loged && (
          <div
            onClick={
              openAuthForm
            }
            className="  font-semibold text-base flex items-center px-3 md:pr-5 cursor-pointer hover:opacity-80 relative"
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
              <div
                className="absolute bg-white top-12 right-0 w-52 py-4 pb-0 z-40 shadow-2xl text-dgrey1"
                ref={wrapperRef}
              >
                <Link
                  href={`${path}/account/profile`}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="py-2 flex items-center hover:bg-dgrey1 hover:bg-opacity-10 px-3 cursor-pointer"
                >
                  <FaUserAlt className="text-d17"></FaUserAlt>
                  <span className="ml-4">Profile</span>
                </Link>
                <Link
                  href={`${path}/account/orders`}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="py-2 flex items-center cursor-pointer hover:bg-dgrey1 hover:bg-opacity-10 px-3"
                >
                  <FaMoneyBillWave className=" text-d16 " />
                  <span className="ml-4">Orders</span>
                </Link>
                {/* <Link
                  href={`${path}/account/memberShip`}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="py-2 flex items-center cursor-pointer hover:bg-dgrey1 hover:bg-opacity-10 px-3"
                >
                  <MdCardMembership className=" text-d16 " />
                  <span className="ml-4">MenmberShip</span>
                </Link> */}
                <Link
                  href={`${path}/account/wallet`}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="py-2 flex items-center cursor-pointer hover:bg-dgrey1 hover:bg-opacity-10 px-3"
                >
                  <FaWallet className=" text-d16 " />
                  <span className="ml-4">Wallet</span>
                </Link>
                <Link
                  href={`${path}/account/coupons`}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="py-2 flex items-center cursor-pointer hover:bg-dgrey1 hover:bg-opacity-10 px-3"
                >
                  <FaTicketAlt className=" text-d16 " />
                  <span className="ml-4">Coupons</span>
                </Link>
                <Link
                  href={`${path}/account/checkin`}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="py-2 flex items-center cursor-pointer hover:bg-dgrey1 hover:bg-opacity-10 px-3"
                >
                  <FaCheckCircle className=" text-d16 " />
                  <span className="ml-4">Check In</span>
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
                  href={`${path}/account/follow`}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="py-2 flex items-center hover:bg-dgrey1 hover:bg-opacity-10 px-3 cursor-pointer"
                >
                  <RiUserFollowLine className="text-d17"></RiUserFollowLine>
                  <span className="ml-4">Follow</span>
                </Link>
                <Link
                  href={`${path}/account/reviewCenter`}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="py-2 flex items-center hover:bg-dgrey1 hover:bg-opacity-10 px-3 cursor-pointer"
                >
                  <BsStarFill className="text-d17 mb-1"></BsStarFill>
                  <span className="ml-4">Review Center</span>
                </Link>
                <Link
                  href={`${path}/account/feedback`}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="py-2 flex items-center hover:bg-dgrey1 hover:bg-opacity-10 px-3 cursor-pointer"
                >
                  <MdFeedback className="text-d17 mb-1"></MdFeedback>
                  <span className="ml-4">Feedback</span>
                </Link>
                <Link
                  href={`${path}/account/suggestion`}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="py-2 flex items-center hover:bg-dgrey1 hover:bg-opacity-10 px-3 cursor-pointer"
                >
                  <HiLightBulb className="text-d20 mb-1"></HiLightBulb>
                  <span className="ml-4">Suggestion</span>
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







      <div
          className={`fixed   z-40 left-0 top-0 flex h-full min-h-screen w-full items-center justify-center  bg-[#6f6f6f4c] px-4 py-5 ${
            state.ModalCoupon ? "block" : "hidden"
          }`}
        >
          <div
       style={{
        backgroundImage:"url(/images/backCoupon.png)",backgroundSize:"cover",backgroundRepeat:"no-repeat"
       }}
            ref={modal}
            onFocus={() => dispatch({ type: "setOpenModalCoupon", payload: true })}
            onBlur={() => dispatch({ type: "setOpenModalCoupon", payload: false })}
            className="w-full max-w-[500px]   flex flex-col justify-center 
             text-white
             px-8 py-12 text-center   md:px-[70px] md:py-[60px]"
          >
{/* bg-gradient-to-br  from-[#F4D0B1] to-[#F5ECCD] */}
<h2 className=" text-3xl font-impact mb-5"> You've received a special coupon: </h2>
<div className="flex flex-col border-b border-1 border-dotted border-dgrey pb-2">
  {state.couponForyou !== null?(
       <div 
       style={{color:"initial"}}
       className="ticket  relative group mb-9 w-full cursor-pointer h-[150px]">
        <div className="absolute w-full h-full bg-white opacity-0 group-hover:opacity-25 top-0 z-20"></div>
       <div className="stub">
       <div className=" flex w-full flex-col h-full justify-between text-center">
         
         <div className="top text-lg font-bold">
         {state.couponForyou?.amount} Off
         </div>
         <div className=" bg-dgrey1 h-[1px] w-full"></div>
        <div  className="text-sm font-light">
        {state.couponForyou?.name}
        </div>
       </div>
       </div>
       <div className='divider-coupon'></div>
       <div className="check py-4 px-2 flex flex-col justify-between h-full text-start w-full">
       
         <div className=" flex flex-col ">
             <h4>coupon code</h4>
             <h2 className=" text-[#BE282F] text-2xl " >{state.couponForyou?.code}</h2>
         </div>
         <div className=" text-sm">
           <span > Valid Till  - {state.couponForyou?.date_end}</span>
           </div>
       </div>
     </div>
  ):(<></>)}

Use this code during checkout to enjoy your discount.
</div>


<div className="mb-[0.125rem]  min-h-[1.5rem] pl-[1.5rem] pt-5 flex justify-start gap-5 text-center">
        <input
        onChange={(e)=>{
          dontShowCouponPop(e);
        }}
          className="relative  -ml-[1.5rem]  mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
          type="checkbox"
          value=""
          id="checkboxDefault" />
        <label
          className="inline-block  hover:cursor-pointer"
          htmlFor="checkboxDefault">
          Don't show agin 
        </label>
      </div>
             <div className="-mx-3  flex mt-8 flex-row ">
             


             <div className={`  px-3 w-full`}>
                <button
                  onClick={() => dispatch({ type: "setOpenModalCoupon", payload: false })}
                  className="block bg-white text-dbase w-full rounded-md  p-3 text-center text-base font-medium text-dark transition hover:border-red-600 hover:bg-dgreyRate "
                >
                  OK
                </button>
              </div>

              <div className={` px-3 w-full`}>
                <button
                    onClick={()=>{
                      dispatch({ type: "setOpenModalCoupon", payload: false })
                      router.push({
                        pathname: "/account/coupons",
                      });
                    }}
                  className="block w-full rounded-md border border-stroke p-3 text-center text-base font-medium text-dark transition hover:border-red-600 hover:bg-white hover:text-dbase"
                >
                  Check Coupons
                </button>
              </div>



           
            </div>
          </div>
        </div>
    </div>
  );
}

export default Account;

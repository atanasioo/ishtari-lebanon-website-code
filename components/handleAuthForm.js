import { AccountContext } from "@/contexts/AccountContext";
import { useContext } from "react";




export  const   HandleAuthForm=()=>{

    const [state, dispatch] = useContext(AccountContext);
     


    const openAuthForm=(type)=>{
      dispatch({ type: "setShowOver", payload: true });
      if(type === "switch"){
        dispatch({ type: "setShowswitchAccount", payload: true });
        dispatch({ type: "setShowLogin", payload: false });
        dispatch({ type: "setShowListAcc", payload: false });
      }else{
    
        if(state.listAccCach.length == 0){
          dispatch({ type: "setShowLogin", payload: true });
          dispatch({ type: "setShowListAcc", payload: false });
        }else{
          dispatch({ type: "setShowListAcc", payload: true });
          dispatch({ type: "setShowLogin", payload: false });
        }
                        dispatch({ type: "setShowSignup", payload: false });
                        dispatch({ type: "setShowForgetPassword", payload: false });
                        dispatch({ type: "setShowEmailSent", payload: false });
    }
  }



    return {openAuthForm}
}


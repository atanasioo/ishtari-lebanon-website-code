import { useReducer, createContext, useEffect, useState } from "react"
import buildLink from "@/urls";
import { axiosServer } from "@/axiosServer";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export const CurrencyContext = createContext()

export const CurrencyProvider = ({ children }) => {
    const [data, setData]= useState([]);


    const router = useRouter()

    async function getInfo(){
      
router.asPath.indexOf("posSystem") < 0 &&
         await axiosServer
        .get(buildLink("information", undefined, undefined), {
            headers: {
              Authorization: "Bearer " + Cookies.get("api-token")
            }
          } )
        .then((response)=>{
            const data = response.data;
            if(data.success === true){
               setData(data);
            } 
        })
    }

    useEffect(()=> {
        getInfo()
    },[])

    return (
        <CurrencyContext.Provider value={data}>
            {children}
        </CurrencyContext.Provider>
    )
}
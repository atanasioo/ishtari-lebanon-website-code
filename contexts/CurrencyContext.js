import { useReducer, createContext, useEffect, useState } from "react"
import buildLink from "@/urls";
import { axiosServer } from "@/axiosServer";
import Cookies from "js-cookie";


export const CurrencyContext = createContext()

export const CurrencyProvider = ({ children }) => {
    const [data, setData]= useState([]);
//   alert("omar")

    async function getInfo(){
      

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
import { useReducer, createContext, useEffect, useState } from "react"
import _axios from "../axios";
import buildLink from "../urls";


export const CurrencyContext = createContext()

export const CurrencyProvider = ({ children }) => {
    const [data, setData]= useState([]);


    async function getInfo(){
         await _axios
        .get(buildLink("information", undefined, window.innerWidth))
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
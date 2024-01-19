
const { createContext, useState, useContext, useEffect } = require("react");


const HeaderStateContext = createContext();
import { useRouter } from 'next/router';

export const HeaderStateProvider = ({ children }) => {
    
    const router = useRouter();
    const [isShowHeader, setisShowHeader] = useState(true);


   useEffect(()=>{
    setisShowHeader(true)
   },[router])

  
    return(
        <HeaderStateContext.Provider value={{ isShowHeader,setisShowHeader}}>
            { children }
        </HeaderStateContext.Provider>
    );
}

export const useHeaderState= () => useContext(HeaderStateContext);

const { createContext, useState, useContext } = require("react");


const HeaderStateContext = createContext();

export const HeaderStateProvider = ({ children }) => {
    

    const [isShowHeader, setisShowHeader] = useState(true);


   

  
    return(
        <HeaderStateContext.Provider value={{ isShowHeader,setisShowHeader}}>
            { children }
        </HeaderStateContext.Provider>
    );
}

export const useHeaderState= () => useContext(HeaderStateContext);
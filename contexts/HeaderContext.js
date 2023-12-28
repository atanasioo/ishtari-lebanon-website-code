const { createContext, useState, useContext, useEffect } = require("react");


const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
    

    const [headerColor, setHeaderColor] = useState("white");
  
    return(
        <HeaderContext.Provider value={{ headerColor, setHeaderColor }}>
            { children }
        </HeaderContext.Provider>
    );
}

export const useHeaderColor= () => useContext(HeaderContext);
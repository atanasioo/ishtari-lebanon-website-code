const { createContext, useState, useContext } = require("react");


const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
    const [headerData, setHeaderData] = useState({});

    return(
        <HeaderContext.Provider value={{ headerData, setHeaderData }}>
            { children }
        </HeaderContext.Provider>
    );
}

export const useHeaderData= () => useContext(HeaderContext);
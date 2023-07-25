const { createContext, useState, useContext } = require("react");


const MarketingContext = createContext();

export const MarketingProvider = ({ children }) => {
    const [marketingData, setMarketingData] = useState({});

    return(
        <MarketingContext.Provider value={{ marketingData, setMarketingData }}>
            { children }
        </MarketingContext.Provider>
    );
}

export const useMarketingData= () => useContext(MarketingContext);
const { createContext, useState, useContext } = require("react");

const MarketingContext = createContext();

export const MarketingProvider = ({ children }) => {
  const [marketingData, setMarketingData] = useState({});
  const [showStats, setShowStats] = useState(false);

  return (
    <MarketingContext.Provider
      value={{
        marketingData,
        setMarketingData,
        showStats,
        setShowStats,
      }}
    >
      {children}
    </MarketingContext.Provider>
  );
};

export const useMarketingData = () => useContext(MarketingContext);

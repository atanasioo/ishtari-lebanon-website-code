const { createContext, useState, useContext } = require("react");


const ReviewCenterContext = createContext();

export const ReviewCenterProvider = ({ children }) => {
    const [reviewCenterData, setReviewCenterData] = useState({});

    return(
        <ReviewCenterContext.Provider value={{ reviewCenterData, setReviewCenterData }}>
            { children }
        </ReviewCenterContext.Provider>
    );
}

export const useReviewCenterData= () => useContext(ReviewCenterContext);
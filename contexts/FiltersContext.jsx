import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
  const location = useLocation();
  const [userFilters, setUserFilters] = useState(getURLOrDefault());

  useEffect(() => {
    setUserFilters(getURLOrDefault());
  }, [window.location.search]);

  function getURLOrDefault() {
    const stored = window.location.search;
   // console.log(window.location.search);

    let params = new URLSearchParams(window.location.search);

    const options =
      params && params.get("filter_options")
        ? params.get("filter_options").split(",")
        : [];
    const sellers =
      params && params.get("filter_sellers")
        ? params.get("filter_sellers").split(",")
        : [];
    const manufactures =
      params && params.get("filter_manufacturers")
        ? params.get("filter_manufacturers").split(",")
        : [];
    const category =
      params && params.get("filter_categories")
        ? params.get("filter_categories").split(",")
        : [];
    const adv =
      params && params.get("adv_filters")
        ? params.get("adv_filters").split(",")
        : [];
    const price =
      params && params.get("filter_price")
        ? params.get("filter_price").split(",")
        : [];


    const temp = {
      filter_sellers: sellers,
      filter_manufacturers: manufactures,
      filter_categories: category,
      adv_filters: adv,
      filter_options: options,
      filter_price: price
    };

    if (!stored) {
      //default value if empty
      return temp;
    } else {
      // console.log(temp);
      return temp;
    }
  }

  return (
    <FiltersContext.Provider
      value={{
        userFilters,
        setUserFilters
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

export const useFiltersContext = () => useContext(FiltersContext);

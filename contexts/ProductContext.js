import React, { createContext, useContext, useEffect, useState } from "react";
const ProductContext = createContext();
import { useRouter } from "next/router";

export const ProductProvider = ({ children }) => {
  const router = useRouter();
  const [productHolder, setProductHolder] = useState(getDefault());
  const [productNotFoundd, setProductNotFoundd] = useState(false);

  function getDefault() {


   // console.log(window.localStorage.getItem("oldLink") === location.pathname);
    if (window.localStorage.getItem("oldLink") === location.pathname) {
      const temp = JSON.parse(window.localStorage.getItem("oldHolder"));
      if (temp?.product_id) {
        return JSON.parse(window.localStorage.getItem("oldHolder"));
      } else {
        return {};
      }
    } 
  }

  useEffect(() => {
    if (productHolder) {
      window.localStorage.setItem("oldHolder", JSON.stringify(productHolder));
      window.localStorage.setItem("oldLink", location.pathname);
    }
  }, [productHolder]);

  return (
    <ProductContext.Provider
      value={{
        productHolder,
        productNotFoundd,
        setProductNotFoundd,
        setProductHolder,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);

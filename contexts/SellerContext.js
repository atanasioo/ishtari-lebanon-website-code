import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useDeviceSize from "@/components/useDeviceSize";
const SellerContext = createContext();

export const SellerProvider = ({ children }) => {
  const router = useRouter();
  const [isUserSeller, setIsUserSeller] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [smallMenuToggle, setSmallmenuToggle] = useState(true);
  const { width } = useDeviceSize();

  const toggleMenu = () => {
   alert(width)
    if (width > 1025) {
      setToggle(!toggle);
    } else {
      setSmallmenuToggle(!smallMenuToggle);
    }
  };

  useEffect(() => {

    if (router.asPath.indexOf("/seller_report/")) {
      setIsUserSeller(true);
    } else {
      setIsUserSeller(false);
    }
  }, [router]);

  return (
    <SellerContext.Provider
      value={{
        isUserSeller,
        toggle,
        smallMenuToggle,
        toggleMenu,
        setIsUserSeller,
      }}
    >
      {children}
    </SellerContext.Provider>
  );
};

export const useSellerContext = () => useContext(SellerContext);

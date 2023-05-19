import React, { useEffect } from 'react'
import Header from './header/header'
import Cookies from "js-cookie";
//
function Layout({children, header_categories, token}) {

  useEffect(() => {
    const tokenn = Cookies.get("api-token");
    console.log(tokenn);
    if((tokenn === "undefined" || typeof tokenn ==="undefined" || tokenn === undefined) && typeof token !== "undefined"){
      console.log("hello");
      Cookies.set("api-token", token, { expires: 15 });
    }
   },[token])
  
  return (
    <div>
        <Header header_categories={header_categories} />
        {children}
    </div>
  )
}

export default Layout
import React, { useEffect } from 'react'
import Header from './header/header'
import Cookies from "js-cookie";
import Footer from './footer/footer';
//
function Layout({children, header_categories, footer_categories , information_data, token}) {
  console.log(information_data.informations)

  useEffect(() => {
    const tokenn = Cookies.get("api-token");
    // console.log(tokenn);
    if((tokenn === "undefined" || typeof tokenn ==="undefined" || tokenn === undefined) && typeof token !== "undefined"){
      // console.log("hello");
      Cookies.set("api-token", token, { expires: 15 });
    }
   },[token])
  
  return (
    <div>
        <Header header_categories={header_categories} />
        {children}
        <Footer footer_categories={footer_categories}  information_data={information_data} />
    </div>
  )
}

export default Layout
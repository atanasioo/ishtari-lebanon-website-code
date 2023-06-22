import React, { useEffect } from 'react'
import Cookies from "js-cookie";
import Footer from './footer/footer';
import Header from './header/header';
function Layout({children, header_categories, footer_categories , information_data, token, host}) {
  // console.log(information_data.informations)
  // console.log("token inlayout " +token);
  // useEffect(() => {
  //   const tokenn = Cookies.get("api-token");
  //   console.log(tokenn);
  //   console.log(document.cookie);
  //   // console.log(tokenn);
  //   if((tokenn === "undefined" || typeof tokenn ==="undefined" || tokenn === undefined) && typeof token !== "undefined"){
  //     // console.log("hello");
  //     // Cookies.set("api-token", token, { expires: 15 });
  //     // console.log(token);
  //   }
  //  },[token])


  
  return (
    <div>
      
        <Header header_categories={header_categories} host={host} />
        {children}
        <Footer footer_categories={footer_categories}  information_data={information_data} />
    </div>
  )
}

export default Layout
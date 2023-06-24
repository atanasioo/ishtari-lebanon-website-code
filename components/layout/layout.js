import React, { useEffect, useState } from 'react'
import Cookies from "js-cookie";
import Footer from './footer/footer';
import Header from './header/header';
import { useRouter } from 'next/router';
import AsideMenu from './AsideMenu';
function Layout({children, header_categories, footer_categories , information_data, token, host}) {
  const router = useRouter();
  const [isUserSeller, setIsUserSeller] = useState(false);

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

  useEffect(() => {
    if (router.pathname.startsWith("/seller_report")) {
      setIsUserSeller(true);
    } else {
      setIsUserSeller(false);
    }
  }, [router]);

console.log(router.pathname.startsWith("/seller_report"));
console.log(isUserSeller);
  
  return (
    <div>
      {!isUserSeller ? (
        <Header header_categories={header_categories} host={host} />
      ):(
        <AsideMenu />
      )}
        
        {children}
        {!isUserSeller && (
          <Footer footer_categories={footer_categories}  information_data={information_data} />
        )}
    </div>
  )
}

export default Layout
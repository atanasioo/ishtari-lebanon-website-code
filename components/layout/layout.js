import React, { useEffect, useState } from "react";
import Footer from "./footer/footer";
import Header from "./header/header";
import { useRouter } from "next/router";
import AsideMenu from "./AsideMenu";
function Layout({
  children,
  header_categories,
  footer_categories,
  information_data,
  token,
  host
}) {
  const router = useRouter();

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
      {router.pathname.indexOf("print") > -1  &&  router.pathname.indexOf("pos") > 0? (
        <></>
      ) : !router.pathname.startsWith("/seller_report")   ? (
        //other user case
        <Header header_categories={header_categories} host={host} />
      ) : (
        //seller case
        <AsideMenu />
      )}

      {children}
      {  (router.pathname.indexOf("print") > -1 ||  router.pathname.startsWith("/orders") ) ? (
        <></>
      ):
      
      !router.pathname.startsWith("/seller_report") &&  router.pathname.indexOf("pos") < 0  &&(
        //other user case
       
        <Footer
          footer_categories={footer_categories}
          information_data={information_data}
        />
      )}
    </div>
  );
}

export default Layout;

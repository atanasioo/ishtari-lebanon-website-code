import React, {useState, useEffect} from "react";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
 import buildLink from "@/urls";
 import { axiosServer } from "@/axiosServer";
export default function Footer(props) {
  const [result, setResult] = useState();
  const [info, setInfo] = useState();

  // const info = props?.information_data?.informations;

  
  useEffect(()=>{

   axiosServer.get(
      buildLink("footerv2", undefined, undefined),
      {
        headers: {
          Authorization: "Bearer " + Cookies.get("api-token")
        }
      }
    ).then((response) => {;
    console.log("resp")
    console.log(response.data)
    setResult(response.data)
    })

  }, [])

    
  useEffect(()=>{

    axiosServer.get(
       buildLink("information", undefined, undefined),
       {
         headers: {
           Authorization: "Bearer " + Cookies.get("api-token")
         }
       }
     ).then((response) => {;

     setInfo(response.data?.data?.informations)
     })
 
   }, [])
 



  

  const FooterPart1 = dynamic(() => import("./footerPart1"), {
    ssr: false // Disable server-side rendering
  });
  const FooterPart2 = dynamic(() => import("./footerPart2"), {
    ssr: false // Disable server-side rendering
  });

  const FooterPartCenter = dynamic(() => import("./footerPartCenter"), {
    ssr: false // Disable server-side rendering
  });

  return (
    <div>
      <FooterPart1 />
      <div className="border-t-8 mb-4 border-dprimarybg"></div>

      <FooterPartCenter data={result} />

      <FooterPart2 info={info} />
    </div>
  );
}

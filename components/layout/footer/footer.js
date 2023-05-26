import React from "react";
import dynamic from "next/dynamic";

export default function Footer(props) {
  const data = props.footer_categories;
  const info = props?.information_data?.informations;
  console.log(info)

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
    <div >
      <FooterPart1 />
      <div className="border-t-8 mb-4 border-dprimarybg"></div>

      <FooterPartCenter data={data}  />

      <FooterPart2 info={info}/>
    </div>
  );
}

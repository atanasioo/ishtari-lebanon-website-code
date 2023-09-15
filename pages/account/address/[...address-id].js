import { axiosServer } from "@/axiosServer";
import GoogleMap from "@/components/address/GoogleMap";
import { AccountContext } from "@/contexts/AccountContext";
import { getHost } from "@/functions";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import cookie from "cookie";
import buildLink from "@/urls";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const { req } = context;

  // if (!session) {
  //   //check whether the user is logged using facebook login

  //   var site_host = "";
  //   let host_url = "";

  //   const host = req.headers.host;

  //   let token = "";

  //   const cookies = req?.headers.cookie || "";
  //   if (typeof cookies !== "undefined" && cookies !== "") {
  //     const parsedCookies = cookie?.parse(cookies);
  //     site_host = parsedCookies["site-local-name"];
  //     token = parsedCookies["api-token"];

  //     if (typeof site_host === "undefined") {
  //       site_host = host;
  //     }
  //   }

  //   host_url = await getHost(site_host);
  //   try {
  //     const response = await axiosServer.get(
  //       buildLink("login", undefined, undefined, host_url),
  //       {
  //         headers: {
  //           Authorization: "Bearer " + token,
  //         },
  //       }
  //     );
  //     console.log(response.data);
  //     if (response.data.customer_id === 0) {
  //       return {
  //         redirect: {
  //           destination: "/",
  //           permanent: false,
  //         },
  //       };
  //     }
  //   } catch(error) {
  //     return {
  //       redirect: {
  //         destination: "/",
  //         permanent: false,
  //       },
  //     };
  //   }
  // }

  return {
    props: {},
  };
}

function AddAddress() {
  const router = useRouter();

  const slug = router.query;

  const [isEdit, setIsEdit] = useState(slug["address-id"][1] === "edit");

  const [state, dispatch] = useContext(AccountContext);

  const AddAddressPage = dynamic(
    () => import("@/components/address/AddAddressPage"),
    {
      ssr: false, // Disable server-side rendering
    }
  );

  return (
    <>
      <Head>
        <title>My Account | ishtari</title>
      </Head>
      {/* <div>helllooo</div> */}
      <AddAddressPage
        isEdit={isEdit}
        address_id={
          slug["address-id"][1] !== "edit" ? "" : slug["address-id"][0]
        }
      />
    </>
  );
}

export default AddAddress;

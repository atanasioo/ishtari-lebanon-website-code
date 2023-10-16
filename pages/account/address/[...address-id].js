
import { AccountContext } from "@/contexts/AccountContext";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";



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

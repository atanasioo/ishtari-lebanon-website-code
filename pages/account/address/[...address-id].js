import { AccountContext } from "@/contexts/AccountContext";
import { getServerSideProps } from "@/pages";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

function AddAddress() {
  const router = useRouter();
  const slug = router.query;
  const [isEdit, setIsEdit] = useState(false);
  const [address_id, setAddress] = useState(false);
  useEffect(() => {
    if (Object.keys(slug).length > 0) {
      setIsEdit(slug && slug["address-id"][1] === "edit" && true);
      setAddress(slug["address-id"][0]);
    }
  }, [router]);

  const AddAddressPage = dynamic(
    () => import("@/components/address/AddAddressPage"),
    {
      ssr: false // Disable server-side rendering
    }
  );

  return (
    <>
      <Head>
        <title>My Account | ishtari</title>
      </Head>
      {/* <div>helllooo</div> */}
      <AddAddressPage isEdit={isEdit} address_id={address_id} />
    </>
  );
}

export default AddAddress;

import { AccountContext } from "@/contexts/AccountContext";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";


export async function getServerSideProps(context){
  const session = await getServerSession(context.req, context.res, authOptions);

  if(!session){
    return{
      redirect: {
        destination: '/',
        permant: false
      }
    }
  }

  return {
    props: {},
  }
}


function AddAddress() {
  const router = useRouter();
  const slug = router.query;

  const [isEdit, setIsEdit] = useState(slug["address-id"][1] === "edit");

  const [state, dispatch] = useContext(AccountContext);

  const AddAddressPage = dynamic(() => import("@/components/address/AddAddressPage"), {
    ssr: false, // Disable server-side rendering
  });

  console.log(slug);

  return (
   <AddAddressPage isEdit={isEdit} address_id={slug["address-id"][1] !== "edit" ? "" : slug["address-id"][0]} />
  );
}

export default AddAddress;

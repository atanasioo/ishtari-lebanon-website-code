
import React from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head';

export default function Checkout() {


  const CheckoutCompnents = dynamic(() => import("@/components/CheckoutCompnents"), {
    ssr: false, // Disable server-side rendering
  });
  
  return (
    <div>
      <Head>
        <title>Checkout</title>
      </Head>
      <CheckoutCompnents />
    </div>
  )
}

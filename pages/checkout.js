
import React from 'react'
import dynamic from 'next/dynamic'

export default function Checkout() {


  const CheckoutCompnents = dynamic(() => import("@/components/CheckoutCompnents"), {
    ssr: false, // Disable server-side rendering
  });
  
  return (
    <div>
      <CheckoutCompnents />
    </div>
  )
}

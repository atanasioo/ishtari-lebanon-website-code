import PointsLoader from '@/components/PointsLoader';
import { CartContext } from '@/contexts/CartContext';
import Head from 'next/head'
import React, { useContext, useState } from 'react'
import { FaStar, FaUser } from 'react-icons/fa';

const CartShared = () => {


  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useContext(CartContext);


  return (
    <div className='min-h-screen'>
  <div className=" pb-8">
<Head>
          <title> Sharing Cart | ishtari</title>
          <meta
            name="description"
            content="Review and finalize your order with our convenient and secure shopping cart. Add items, adjust quantities, and proceed to checkout with confidence. Enjoy hassle-free online shopping and quick delivery of your favorite products."
          ></meta>
        </Head>
       
        {loading ? (
          <PointsLoader />
        ) :(  <>
       <div className=' flex flex-col justify-center h-full'>
          <div className=' px-3 py-1 w-full bg-dPink h-full flex flex-row align-middle  justify-start gap-4'>
            <FaUser className=' text-dDarkgrey max-sm:mt-2 md:my-auto text-xs'/>
          <div className='  felx flex-row gap-1 w-full '>
            <span className=' text-dgreyBlack font-bold text-sm tracking-normal' > Sharing with you some great items from others' shopping list. </span>
            </div>
            </div>
               <div></div>
          </div>
         </>

        )}









  </div>
    </div>
  )
}

export default CartShared
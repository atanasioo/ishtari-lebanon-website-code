import { useRouter } from 'next/router';
import React from 'react'

function ReturnProducts() {
    const router = useRouter();
    let id = router.query["order-id"];

  return (
    <div>ReturnProducts</div>
  )
}

export default ReturnProducts
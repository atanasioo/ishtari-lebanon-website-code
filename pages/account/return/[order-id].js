import { axiosServer } from '@/axiosServer';
import buildLink from '@/urls';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'

function ReturnProducts() {
    const router = useRouter();
    let id = router.query["order-id"];

    useEffect(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
  
      axiosServer
        .get(buildLink("get_account", undefined, window.innerWidth))
        .then((response) => {
          setLoading(false);
  
          if (!response.data.success) {
            router.push("/");
          }
        });
      axiosServer
        .get(buildLink("order_details", undefined, window.innerWidth) + id)
        .then((response) => {
          if (response.data.success) {
            setData(response?.data.data);
            setLoading(false);
          }
        });
    }, [id]);

  return (
    <div>ReturnProducts</div>
  )
}

export default ReturnProducts
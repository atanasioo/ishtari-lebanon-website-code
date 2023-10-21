import { axiosServer } from "@/axiosServer";
import SingleProductTopSelling from "@/components/product/SingleProductTopSelling";
import { sanitizeHTML } from "@/components/Utils";
import buildLink from "@/urls";
import cookie from "cookie";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

function categoryTopSelling() {

  const [data , setData] = useState([])
  const router = useRouter()
  const { category_id } = router.query;


  useEffect(()=>{


    axiosServer.get(buildLink("getAllTopSellingbyCategoryid", undefined, undefined, window.location.host) +
    "&category_id=" +
    category_id).then((resp)=>{
      setData(resp.data)
    })

  }, [category_id])

  return (
    <div className="py-6 container">
      <div className="w-full">
        <img src="/images/top-hits-web.png" width={1440} height={100} className="hidden mobile:block rounded-md" />
        <img src="/images/top-selling-mobile.png" width={351} height={207} className="mobile:hidden w-full" />
      </div>
      <div className="pr-semibold text-d20 text-dblack my-6">
        Top Selling for{" "}
        <span
          dangerouslySetInnerHTML={{
            __html: sanitizeHTML(data?.data?.category_name),
          }}
        ></span>
      </div>
      <div className="product-grid-container grid grid-cols-1 md:grid-cols-2  gap-3 ">
        {data?.data?.products?.map((item, index) => (
          <SingleProductTopSelling
            key={item.product_id}
            item={item}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

export default categoryTopSelling;


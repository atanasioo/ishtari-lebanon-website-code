import { axiosServer } from "@/axiosServer";
import SingleProduct from "@/components/product/SingleProduct";
import { sanitizeHTML } from "@/components/Utils";
import buildLink from "@/urls";
import cookie from "cookie";

function categoryTopSelling(props) {
  const { data } = props;
  return (
    <div className="py-7 container">
      <div className="pr-semibold text-d20 text-dblack">
        Top Sellings for {" "}
        <span dangerouslySetInnerHTML={{__html: sanitizeHTML(data?.data?.category_name)}}></span>
      </div>
      <div className="product-grid-container grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-3 mt-7">
        {data?.data?.products?.map((item) => (
          <SingleProduct key={item.product_id} item = {item} />
        ))}
      </div>
    </div>
  );
}

export default categoryTopSelling;

export async function getServerSideProps(context) {
  const category_id = context.query.category_id;
  const { req } = context;
  const host = req.headers.host;

  const cookies = req.headers.cookie;
  const parsedCookies = cookie.parse(cookies);
  const host_cookie = parsedCookies["site-local-name"];
  const token = parsedCookies["api-token"];
  let site_host = "";
  if (host_cookie === undefined || typeof host_cookie === "undefined") {
    site_host = host;
  } else {
    site_host = host_cookie;
  }

  const response = await axiosServer.get(
    buildLink("getAllTopSellingbyCategoryid", undefined, undefined, site_host) +
      "&category_id=" +
      category_id,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  const data = response.data;

  return {
    props: {
      data
    },
  };
}

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { axiosServer } from "@/axiosServer";
import Head from "next/head";
import cookie from "cookie";
import buildLink from "@/urls";
import ProductPage from "@/components/product/ProductPage";
import CatalogPage from "@/components/catalog/CatalogPage";

function SlugPage(props) {
  const router = useRouter();
  const [isCatalog, setIsCatalog] = useState(false);
  const [isProduct, setIsProduct] = useState(false);
  const slug = router.query; // Access the slug array from the URL
  // Determine whether it's a category or product page based on the slug structure
  useEffect(() => {
    if (slug.catalog === "product") {
      setIsProduct(true);
    } else if (
      slug.catalog === "category" ||
      slug.catalog === "product" ||
      slug.catalog === "manufacturer"
    ) {
      setIsCatalog(true);
    } else if (slug.slug[0].includes("p=")) {
      setIsProduct(true);
    } else if (
      slug.slug[0].includes("c=") ||
      slug.slug[0].includes("s=") ||
      slug.slug[0].includes("m=")
    ) {
      setIsCatalog(true);
    } else {
      return <div>Not found..</div>;
    }
  }, [slug]);

  return (
    <div>
      <Head>
        <title>
          {(props.type === "product"
            ? props.data?.name
            : props.data?.heading_title
          )?.replaceAll("&amp;", "&")}{" "}
          | ishtari
        </title>
        <meta
          name="description"
          content="Shop the 1.25L 800W Electric Household Drip Coffee Maker with Glass Carafe, Filter Cone & Coffee Spoon SF-3565. Enjoy delicious coffee brewed at home with this convenient coffee maker. Available in dimensions (L20 x W17 x H29)cm."
        ></meta>
      </Head>
      {props.type === "product" ? (
        <>
          <ProductPage data={props.data} host={props.host} hovered={props.hovered} />
        </>
      ) : (
        <CatalogPage
          type={props.type}
          data={props.data}
          isloading={props.isLoading}
          page={props?.page}
        />
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  // Fetch the corresponding API endpoint based on the page type
  // const { catalog,  slug  , resolvedUrl } = context.params;
  const {
    catalog,
    slug,
    has_filter,
    filter_categories,
    filter_manufacturers,
    filter_sellers,
    filter_options,
    adv_filters,
    page,
  } = context.query;

  const { req } = context;
  // const { NEXT_INIT_QUERY } = context.params.NEXT_INIT_QUERY;

  // const { NEXT_INIT_QUERY  = context.has_filter;

  let data = null;
  let type = "";
  var p = "";

  if (page !== undefined) {
    p = page;
  }
  const host = req.headers.host;

  console.log("host isss" + host);
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

  if (typeof slug !== "undefined") {
    if (catalog === "product" || slug[0].includes("p=")) {
      // get product id
      let product_id = "";
      if (slug[0].includes("p=")) {
        product_id = slug[0].split("=")[1];
      } else {
        product_id = slug[0];
      }
      // console.log(context);

      //fetch product data
      let link =
        buildLink("product", undefined, undefined, site_host) +
        product_id +
        "&source_id=1&part_one";
      const response = await axiosServer.get(link, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (!response.data.success) {
        return {
          notFound: true,
        };
      }

      data = response.data.data;
      type = "product";
    } else if (
      catalog === "category" ||
      catalog === "manufacturer" ||
      catalog === "seller" ||
      slug[0].includes("c=") ||
      slug[0].includes("m=") ||
      slug[0].includes("s=")
    ) {
      let id = "";
      if (catalog === "category" || slug[0].includes("c=")) {
        type = "category";

        if (slug[0].includes("c=")) {
          id = slug[0].split("=")[1];
          // console.log(category_id);
        } else {
          id = slug[0];
        }
      } else if (catalog === "manufacturer" || slug[0].includes("m=")) {
        type = "manufacturer";
        let manufacturer_id = "";
        if (slug[0].includes("m=")) {
          id = slug[0].split("=")[1];
          // console.log(manufacturer_id);
        } else {
          id = slug[0];
        }
      } else if (catalog === "seller" || slug[0].includes("s=")) {
        type = "seller";

        if (slug[0].includes("s=")) {
          id = slug[0].split("=")[1];
        } else {
          id = slug[0];
        }
      }

      if (!has_filter) {
        // } else {
        let link =
          buildLink(type, undefined, undefined, site_host) +
          id +
          "&source_id=1&limit=50";
        const response = await axiosServer.get(link, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (!response.data.success) {
          return {
            notFound: true,
          };
        }

        data = response.data.data;
        console.log("********%start%%*******");
        console.log(data);
        console.log("********%end%*******");
      } else {
        var filter = "";

        if (filter_categories !== undefined) {
          filter += "&filter_categories=" + filter_categories;
        }
        if (filter_manufacturers !== undefined) {
          filter += "&filter_manufacturers=" + filter_manufacturers;
        }

        if (filter_sellers !== undefined) {
          filter += "&filter_sellers=" + filter_sellers;
        }

        if (filter_options != undefined) {
          filter += "&filter_options=" + filter_options;
        }

        if (adv_filters != undefined) {
          filter += "&adv_filters=" + adv_filters;
        }
        if (page != undefined) {
          filter += "&page=" + page;
        }

        // const q_s = router.asPath?.slice(router.asPath.indexOf("?"));

        const link =
          buildLink("filter", undefined, undefined) +
          "&path=" +
          slug[0].split("=")[1] +
          filter;

        const response = await axiosServer.get(link, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        data = response.data.data;
      }
    } else {
      //redirect to 404
      return {
        notFound: true,
      };
    }

    return {
      props: {
        data,
        type,
        host,
        hovered: false,
        isLoading: "false",
        p,
      },
    };
  }else{
    return{
      notFound:true
    }
  }
}

export default SlugPage;

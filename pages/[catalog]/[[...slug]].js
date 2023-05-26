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
        <title>{props.data.name}</title>
        <meta
          name="description"
          content="Shop the 1.25L 800W Electric Household Drip Coffee Maker with Glass Carafe, Filter Cone & Coffee Spoon SF-3565. Enjoy delicious coffee brewed at home with this convenient coffee maker. Available in dimensions (L20 x W17 x H29)cm."
        ></meta>
      </Head>
      {props.isProduct ? (
        <>
          <ProductPage data={props.data} />
        </>
      ) : (
        <CatalogPage />
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  // Fetch the corresponding API endpoint based on the page type
  const { catalog, slug } = context.params;
  const { req } = context;
  let data = null;
  let isProduct = false;

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
    isProduct = true;
  } else if (catalog === "category" || slug[0].includes("c=")) {
    let category_id = "";
    if (slug[0].includes("c=")) {
      category_id = slug[0].split("=")[1];
      console.log(category_id);
    } else {
      category_id = slug[0];
    }
  } else if (catalog === "manufacturer" || slug[0].includes("m=")) {
    let manufacturer_id = "";
    if (slug[0].includes("m=")) {
      manufacturer_id = slug[0].split("=")[1];
      console.log(manufacturer_id);
    } else {
      manufacturer_id = slug[0];
    }
  } else if (catalog === "seller" || slug[0].includes("s=")) {
    let seller_id = "";
    if (slug[0].includes("s=")) {
      seller_id = slug[0].split("=")[1];
      console.log(seller_id);
    } else {
      seller_id = slug[0];
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
      isProduct,
    },
  };
}

export default SlugPage;

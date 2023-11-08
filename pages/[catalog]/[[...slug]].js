import { axiosServer } from "@/axiosServer";
import Head from "next/head";
import cookie from "cookie";
import buildLink from "@/urls";
import ProductPage from "@/components/product/ProductPage";
import { getConfig } from "@/functions";
import CatalogTest from "@/components/catalog/CatalogTest";
import DynamicProducts from "@/components/product/DynamicProducts";
function SlugPage(props) {
  return (
    <div>
      <Head>
        <title>
          {(props.data?.heading_title ||
            props.data?.name ||
            props?.meta?.title) &&
            (props?.type === "product"
              ? "Shop " +
                props.meta?.title
                  .replaceAll("&amp;", "&")
                  .replaceAll("&quot;", "&") +
                ` in ${
                  props.host === "ishtari-ghana" ||
                  props.host === "www.ishtari.com.gh"
                    ? "Ghana"
                    : "Lebanon"
                } | Ishtari`
              : (props.data?.heading_title || props?.meta?.title) &&
                props?.type === "category"
              ? (props.data?.heading_title || props?.meta?.title)
                  .replaceAll("&amp;", "&")
                  .replaceAll("&quot;", "&") +
                ` - in ${
                  props.host === "ishtari-ghana" ||
                  props.host === "www.ishtari.com.gh"
                    ? "Ghana"
                    : "Lebanon"
                }  Buy Online | ishtari`
              : (props.data?.heading_title || props.meta?.title) &&
                props?.type === "manufacturer"
              ? (props.data?.heading_title || props.meta?.title)
                  .replaceAll("&amp;", "&")
                  .replaceAll("&quot;", "&") +
                ` - ishtari ${
                  props.host === "ishtari-ghana" ||
                  props.host === "www.ishtari.com.gh"
                    ? "Ghana"
                    : "Lebanon"
                }`
              : (props.data?.heading_title || props.meta?.title)
                  .replaceAll("&amp;", "&")
                  .replaceAll("&quot;", "&")
            ).replaceAll("<!-- -->", "")}
        </title>
        {props.type === "product" ? (
          <meta
            name="description"
            content={`${
              props?.meta?.meta_description !== ""
                ? props?.meta?.meta_description
                : `Shop the ${props?.meta?.title}. Enjoy easy online shopping at ishtari.`
            } `}
          ></meta>
        ) : (
          <meta
            name="description"
            content={props?.meta?.meta_description}
          ></meta>
        )}

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>
      {props.type === "product" ? (
        <>
          <ProductPage
            data={props.data}
            host={props.host}
            hovered={props.hovered}
            config={props.config}
            additionalData={props.additionalData}
            meta={props.meta}
          />
        </>
      ) : props.type === "coming_soon" ||
        props.type === "back_to_stock" ||
        props.type === "latest" ? (
        <DynamicProducts />
      ) : (
        // <CatalogPages
        //   type={props.type}
        //   type_id={props.type_id}
        //   data={props.data}
        //   isloading={props.isLoading}
        //   page={props.p}
        //   link={props.link}
        // />
        <CatalogTest
          type={props.type}
          type_id={props.type_id}
          AdminToken={props.AdminToken}
          data={props.data}
          isloading={props.isLoading}
          page={props.p}
          link={props.link}
          slugId={props.slug}
          catalogId={props.catalog}
        />
      )}
    </div>
  );
}
export async function getServerSideProps(context) {
  // Fetch the corresponding API endpoint based on the page type
  const { req, res } = context;

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=59"
  );

  let {
    catalog,
    has_filter,
    filter_categories,
    filter_manufacturers,
    filter_sellers,
    filter_options,
    adv_filters,
    page,
    sort,
    order,
    last,
    limit,
    fromSearch,
  } = context.query;
  let slug = context.query.slug || [];
  // const { NEXT_INIT_QUERY } = context.params.NEXT_INIT_QUERY;
  // const { NEXT_INIT_QUERY  = context.has_filter;
  let data = null;
  let meta = null;
  let type = "";
  var p = 0;
  if (page !== undefined) {
    p = page;
  }
  var additionalData = {};
  const host = req.headers.host;
  var link;
  const cookies = req.headers.cookie;
  var host_cookie;
  var token;
  var AdminToken;
  if (typeof cookies !== "undefined") {
    var parsedCookies = cookie.parse(cookies);
    host_cookie = parsedCookies["site-local-name"];
    token = parsedCookies["api-token"];
    AdminToken = parsedCookies["ATDetails"];
  }

  let site_host = "";
  if (host_cookie === undefined || typeof host_cookie === "undefined") {
    site_host = host;
  } else {
    site_host = host_cookie;
  }

  const config = await getConfig(site_host);
  var path = "&path=";

  // console.log("catalog", catalog);

  const isLatestSettings =
    catalog === "coming_soon" ||
    catalog === "back_to_stock" ||
    catalog === "latest"
      ? true
      : false;

  //handle seo path

  if (
    typeof catalog !== "undefined" &&
    slug.length === 0 &&
    !isLatestSettings
  ) {
    const alias = await axiosServer.get(
      buildLink(`alias`, undefined, undefined, site_host) + catalog
    );
    if (typeof alias.data.query !== "undefined") {
      const theAlias = alias.data.query.split("=", 2);
      const aliasName = theAlias[0].split("_", 1)[0];
      const aliasId = theAlias[1];
      slug[0] = aliasId;
      catalog = aliasName;
      // console.log(slug[0]);
      // console.log(catalog);
    }
  }

  if (isLatestSettings) {
    type = catalog;
    return {
      props: {
        type,
      },
    };
  }

  if (typeof slug !== "undefined" && slug.length > 0) {
    let id = "";
    if (catalog === "product" || catalog === "productpreview"  || slug[0].includes("p=")) {
      // get product id
      let product_id = "";
      if (slug[0].includes("p=")) {
        product_id = slug[0].split("=")[1];
      } else {
        product_id = slug[0];
      }
      id = product_id;

      //fetch product data
      // link =
      //   buildLink("product", undefined, undefined, site_host) +
      //   product_id +
      //   "&source_id=1&part_one" +
      //   (AdminToken !== undefined || typeof AdminToken !== "undefined"
      //     ? "&employer=true"
      //     : "") +
      //   (fromSearch ? "&from_search=1" : "");

      // const response = await axiosServer.get(link, {
      //   headers: {
      //     Authorization: "Bearer " + token
      //   }
      // });

      // const response1 = await axiosServer.get(
      //   buildLink("getProductAdditionalData", undefined, undefined, site_host) +
      //     "&product_id=" +
      //     product_id,
      //   {
      //     headers: {
      //       Authorization: "Bearer " + token
      //     }
      //   }
      // );
      // additionalData = response1.data.data;
      // //  console.log(additionalData)

      // if (!response.data.success) {
      //   return {
      //     notFound: true
      //   };
      // }
      // data = response?.data?.data;

      type = "product";
    } else {
      if (
        catalog === "category" ||
        catalog === "manufacturer" ||
        catalog === "seller" ||
        slug[0].includes("c=") ||
        slug[0].includes("m=") ||
        slug[0].includes("s=")
      ) {
        // console.log(slug);
        if (catalog === "category" || slug[0].includes("c=")) {
          type = "category";
          if (slug[0].includes("c=")) {
            id = slug[0].split("=")[1];
          } else {
            id = slug[0];
          }
        } else if (catalog === "manufacturer" || slug[0].includes("m=")) {
          type = "manufacturer";
          if (slug[0].includes("m=")) {
            id = slug[0].split("=")[1];
          } else {
            id = slug[0];
          }
          path = "&manufacturer_id=";
        } else if (catalog === "seller" || slug[0].includes("s=")) {
          type = "seller";
          if (slug[0].includes("s=")) {
            id = slug[0].split("=")[1];
          } else {
            id = slug[0];
          }
          path = "&seller_id=";
        }
      }
    }
     const seo= true
    if (type !== ""  && seo ) {
      const response = await axiosServer.get(
        buildLink("seo-" + type, undefined, undefined, site_host) + id,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.data.success) {
        meta = response.data.data;
        // console.log(meta);
      }
    }

    return {
      props: {
        data,
        type,
        type_id: id,
        host: site_host,
        config,
        hovered: false,
        isLoading: "false",
        slug: slug,
        catalog: catalog,
        meta,
        p,
        additionalData,
        AdminToken: AdminToken || null,
        isLatestSettings: isLatestSettings,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
}
export default SlugPage;

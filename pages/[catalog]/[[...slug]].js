import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { axiosServer } from "@/axiosServer";
import Head from "next/head";
import cookie from "cookie";
import buildLink from "@/urls";
import ProductPage from "@/components/product/ProductPage";
// import CatalogPage from "@/components/catalog/CatalogPage";
import CatalogPages from "@/components/catalog/CatalogPages";
import { getConfig } from "@/functions";
import dynamic from "next/dynamic";
import CatalogPlaceholder from "@/components/catalog/CatalogPlaceholder";
// import ProductPlaceholder from "@/components/product/ProductPlaceholder";

function SlugPage(props) {

  console.log(props.host);

  return (
    <div>
      <Head>
        <title>
          {/* { props.type != undefined && (props.type === "product"
            ? props.data?.name
            : props.data?.heading_title
          )?.replaceAll("&amp;", "&").replaceAll("<!-- -->", "")}{" | "} */}
          {(props.data?.heading_title || props.data?.name) &&
            (props?.type === "product"
              ? ("Shop" + props.data?.name
                  .replaceAll("&amp;", "&")
                  .replaceAll("&quot;", "&") + "in Lebanon | Ishtari")
              : props.data?.heading_title && props?.type === "category" ?

                (props.data?.heading_title
                  .replaceAll("&amp;", "&")
                  .replaceAll("&quot;", "&") + " - in Lebanon | Buy Online | ishtari")
                  :  props.data?.heading_title && props?.type === "manufacturer" ?
                  (props.data?.heading_title
                    .replaceAll("&amp;", "&")
                    .replaceAll("&quot;", "&") + " - ishtari Lebanon")
                    : (props.data?.heading_title
                      .replaceAll("&amp;", "&")
                      .replaceAll("&quot;", "&"))
            ).replaceAll("<!-- -->", "")}
        </title>
        {props.type === "product" ? (
          <meta
            name="description"
            content={`Shop the ${props.data?.name}. Enjoy easy online shopping at ishtari.`}
          ></meta>
        ) : (
          <meta
            name="description"
            content={`Discover a wide range of quality ${props.data?.category_seo} products. Enjoy easy online shopping at ishtari.`}
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
          />
        </>
      ) : (

        <CatalogPages
          type={props.type}
          type_id={props.type_id}
          data={props.data}
          isloading={props.isLoading}
          page={props.p}
          link={props.link}
        />
      )}
    </div>
  );
}
export async function getServerSideProps(  context) {
  // Fetch the corresponding API endpoint based on the page type
  // const { catalog,  slug  , resolvedUrl } = context.params;
  const { req, res } = context;

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=59'
  )
  
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
    fromSearch
  } = context.query;
  let slug = context.query.slug || [];
  // const { NEXT_INIT_QUERY } = context.params.NEXT_INIT_QUERY;
  // const { NEXT_INIT_QUERY  = context.has_filter;
  let data = null;
  let type = "";
  var p = 0;
  if (page !== undefined) {
    p = page;
  }
 var additionalData ={}
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

  //handle seo path

  if(typeof catalog !== "undefined" && slug.length === 0){
    const alias = await axiosServer.get(buildLink(`alias`,undefined, undefined, site_host) + catalog);
    if(typeof alias.data.query !== "undefined"){
      const theAlias = alias.data.query.split("=",2);
      const aliasName = theAlias[0].split('_',1)[0];
      const aliasId = theAlias[1];
      slug[0] = aliasId;
      catalog =aliasName
    }
  } 

  if (typeof slug !== "undefined" && slug.length >0) {
    let id = "";
    if (catalog === "product" || slug[0].includes("p=")) {
      // get product id
      let product_id = "";
      if (slug[0].includes("p=")) {
        product_id = slug[0].split("=")[1];
      } else {
        product_id = slug[0];
      }

      //fetch product data
      link =
        buildLink("product", undefined, undefined, site_host) +
        product_id +
        "&source_id=1&part_one" +
        (AdminToken !== undefined || typeof AdminToken !== "undefined"
          ? "&employer=true"
          : "") + (fromSearch ? "&from_search=1" : "") ;

      const response = await axiosServer.get(link, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
console.log("testest")
      console.log(response.data)

      const response1 = await axiosServer.get(
        buildLink("getProductAdditionalData", undefined, undefined, site_host) +
          "&product_id=" +
          product_id , {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
      )
       additionalData = response1.data.data;
      //  console.log(additionalData)

  

      if (!response.data.success) {
        return {
          notFound: true,
        };
      }
      data = response?.data?.data;
      
      type = "product";
    } else if (
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
      var filter = "";
      if (!has_filter) {
        if (page != undefined) {
          filter += "&page=" + page;
        }

        if (sort !== undefined && order !== undefined) {
          filter += "&sort=" + sort;
          filter += "&order=" + order;
        }
        // } else {

        link =
          buildLink(type, undefined, undefined, site_host) +
          id +
          "&source_id=1&limit=50" +
          filter +
          (typeof AdminToken !== "undefined" ? "&adm_quantity=true" : ""); 
        // console.log("FFFFFFFFFFFFFF1111");
        // console.log(link);
        const response = await axiosServer.get(link, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (response.data.success == false  || (response.data.data.products.length  < 1 &&   response.data.data.desktop_widgets.length < 1  && response.data.data.widgets.length < 1)) {
          return {
            notFound: true,
          };
        }
        data = response.data.data;
      } else {
        var filter = "";
        if (has_filter !== undefined) {
          filter += "&has_filter=" + has_filter;
        }
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
        if (last != undefined) {
          filter += "&last=" + last;
        }

        if (sort !== undefined && order !== undefined) {
          filter += "&sort=" + sort;
          filter += "&order=" + order;
        }

        if (limit != undefined) {
          filter += "&limit=" + limit;
        } else {
          filter += "&limit=50";
        }

        link =
          buildLink("filter", undefined, undefined, site_host) +
          path +
          id +
          filter +
          (typeof AdminToken !== "undefined" ? "&adm_quantity=true" : "");

        const response = await axiosServer.get(link, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        if (response.data.success == false  || (response.data.data.products.length  < 1 &&   response.data.data.desktop_widgets.length < 1  && response.data.data.widgets.length < 1)) {
          return {
            notFound: true,
          };
        }
        data = response?.data?.data;

        // console.log(data)
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
        type_id: id,
        host: site_host,
        config,
        hovered: false,
        isLoading: "false",
        p,
        additionalData
      }
    };
  } else {
    return {
      notFound: true,
    };
  }
}
export default SlugPage;

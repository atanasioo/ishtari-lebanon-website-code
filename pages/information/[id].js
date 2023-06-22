import { useEffect, useState } from "react";
import buildLink from "@/urls";
import dynamic from "next/dynamic";
import { axiosServer } from "@/axiosServer";
import cookie from "cookie";
import { sanitizeHTML } from "@/components/Utils";
import Head from "next/head";
var htmlEntities = {
  nbsp: " ",
  cent: "¢",
  pound: "£",
  yen: "¥",
  euro: "€",
  copy: "©",
  reg: "®",
  lt: "<",
  gt: ">",
  quot: '"',
  amp: "&",
  apos: "'",
};

function unescapeHTML(str) {
  if (!str) {
    return;
  }
  return str.replace(/\&([^;]+);/g, function (entity, entityCode) {
    var match;

    if (entityCode in htmlEntities) {
      return htmlEntities[entityCode];
      /*eslint no-cond-assign: 0*/
    } else if ((match = entityCode.match(/^#x([\da-fA-F]+)$/))) {
      return String.fromCharCode(parseInt(match[1], 16));
      /*eslint no-cond-assign: 0*/
    } else if ((match = entityCode.match(/^#(\d+)$/))) {
      return String.fromCharCode(~~match[1]);
    } else {
      return entity;
    }
  });
}
function Information(props) {
  const { data } = props;

  //   const PointsLoader = dynamic(() => import("@/components/PointsLoader"), {
  //     ssr: false, // Disable server-side rendering
  //   });

  return (
    <div>
      <Head>
        <title>{data?.title}</title>

        <title>{data?.title}| ishtari</title>
      </Head>

      <div
        dangerouslySetInnerHTML={{
          __html: sanitizeHTML(unescapeHTML(data.description)),
        }}
      />
    </div>
  );
}

export default Information;

export async function getServerSideProps(context) {
  const { req } = context;
  const { id } = context.query;
  const host = req.headers.host;

  const cookies = req.headers.cookie;
  const parsedCookies = cookie.parse(cookies);
  const host_cookie = parsedCookies["site-local-name"];
  const token = parsedCookies["api-token"];
  var data;
  await axiosServer
    .get(
      buildLink("information", undefined, undefined) + "&information_id=" + id,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
    .then((response) => {
      //   response.data.data.description = unescape(response.data.data.description);
      data = response.data.data;
      console.log(data);
      console.log("data-ppppp");
    });

  return {
    props: {
      data,
    },
  };
}

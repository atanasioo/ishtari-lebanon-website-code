import { useEffect, useState } from "react";
import buildLink from "@/urls";
import { axiosServer } from "@/axiosServer";
import cookie from "cookie";
import { sanitizeHTML } from "@/components/Utils";
import Head from "next/head";
import { useRouter } from "next/router";
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
function Information() {
  // const { data } = props;
  const [data, setData] = useState();
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (typeof id !== "undefined") {
      axiosServer
        .get(
          buildLink("information", undefined, undefined, window.location.host) +
            "&information_id=" +
            id
        )
        .then((resp) => {
          setData(resp.data.data);
        });
    }
  }, [id]);

  return (
    <div className="container">
      <Head>
        <title>{data?.title}</title>

        <title>{data?.title}| ishtari</title>
      </Head>
      <div
                id="desc"
                  className=' text-left  '
                dangerouslySetInnerHTML={{
                  __html: sanitizeHTML(unescapeHTML(data?.description))
                }}
              />
     
    </div>
  );
}

export default Information;

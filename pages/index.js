import Image from "next/image";
import { Inter } from "next/font/google";
import cookie from "cookie";
import buildLink from "@/urls";
import { axiosServer } from "@/axiosServer";
import WidgetsLoop from "@/components/WidgetsLoop";
const inter = Inter({ subsets: ["latin"] });

export default function Home(widgets) {
  const data = widgets.data.widgets;

  return (
    <div>
      {data.map((widget, index) => (
        <WidgetsLoop widget={widget} />
      ))}
    </div>
  );
}

export async function getServerSideProps(context) {
  // Fetch the corresponding API endpoint based on the page type
  const { req } = context;
  let data = null;
  const userAgent = context.req.headers["user-agent"];
  console.log({ userAgent });
  console.log("userAgent");
  const screenWidth = parseScreenWidth(userAgent);
  // console.log("width=" + screenWidth);
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
  var obj = {
    view: screenWidth == "mobile" ? "web_mobile" : "web_desktop",
    limit: 10,
    page: 1
  };

  //fetch product data
  let link = buildLink("home", undefined, undefined) + "&source_id=1";
  const response = await axiosServer.post(link, obj, {
    headers: {
      Authorization: "Bearer " + token
    }
  });
  if (!response.data.success) {
    return {
      notFound: true
    };
  }

  data = response.data.data;

  //redirect to 404

  return {
    props: { data }
  };
}

function parseScreenWidth(userAgent) {
  // var screenWidth
  // console.log(match)
  // if (userAgent) {
  //   const match = userAgent.match(/(?:^|\s)(\d+)x(\d+)(?:\s|$)/);
  //   if (match && match.length >= 3) {
  //     screenWidth = parseInt(match[1], 10);
  //   }
  // }
  if (userAgent.includes("Mobile")) {
    return "mobile";
  }
  // Return a default width if the extraction fails
  return "desktop"; // Default width of 1920 pixels
}

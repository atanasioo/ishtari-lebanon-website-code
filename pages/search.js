import { axiosServer } from "@/axiosServer";
import buildLink from "@/urls";
import cookie from "cookie";
import { useRouter } from "next/router";
import { useState } from "react";

function search(props) {
  const { data, filters } = props;
  const router = useRouter();
  const [baseURL, setBaseURL] = useState(router.query.keyword);

  function handleFilter(type, name) {
    const Name = encodeURIComponent(name);

    if (router.query.hasOwnProperty(Name) > 0) {
      router.push(`/search${baseURL.replace("&" + type + "=" + Name, "")}`);
    } else {
      router.push(`/search${baseURL + "&" + type + "=" + Name}`);
      setBaseURL(router.query);
    }
  }

  console.log(router.query);

  // CheckFilter
  function checkFilter(filter) {
    const Fil = encodeURIComponent(filter);
    if (router.query.hasOwnProperty(Fil) < 0) {
      return <input type="checkbox" className="" checked />;
    } else {
      return <input type="checkbox" className="" />;
    }
  }

  return (
    <div>
      <div className="flex">
        <div className="w-full mobile:w-1/5 mobile:px-5 ">
          {filters.length > 0 ? (
            filters?.map((filter) => (
              <div key={filter.name} className="hidden mobile:block">
                {filter["new_items"].length > 0 && (
                  <div
                    className=" capitalize mb-3 mt-1 text-base font-semibold  text-dblack flex items-center justify-between cursor-pointer hover:opacity-80 relative "
                    onClick={(e) => toggleVisibility(e.target)}
                  >
                    <div className="absolute w-full h-full"></div>
                    <span>{filter.name}</span>
                    <i className="icon icon-angle-down text-dgrey1 text-2xl transition-all"></i>
                  </div>
                )}
                <div className="block">
                  <div>
                    {filter["new_items"].slice(0, 5).map((sub_filter) => (
                      <div
                        className="my-2 float flex justify-between  items-center cursor-pointer hover:text-dblue"
                        key={sub_filter.name}
                        onClick={() => {
                          handleFilter(filter.name, sub_filter.name);
                        }}
                      >
                        <div className="flex gap-1">
                          <div className={`icon mr-1 text-base `}>
                          {checkFilter(sub_filter.name)}
                        </div>
                        <span className="text-d13 font-light">
                          {sub_filter.name}
                        </span>
                        </div>
                        
                        <span className="float-right text-d13 font-light">
                          ({sub_filter.count})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="hidden md:block w-2/12 pr-4 pt-2"></div>
          )}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { keyword, brand, seller, category, page } = context.query;

  let encodedKeyword = encodeURIComponent(keyword);

  console.log(context.query);
  const { req } = context;
  let data = null;
  let type = "";
  var p = "";
  if (page !== undefined) {
    p = page;
  }
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

  let link =
    buildLink("alg", undefined, undefined, site_host) +
    encodedKeyword +
    "&limit=50&page=" +
    Number(p);

  if (brand) {
    link += "&brand=" + brand.replaceAll(" & ", "--");
  }
  if (seller) {
    link += "&seller=" + seller.replaceAll(" & ", "--");
  }
  if (category) {
    link += "&category=" + category.replaceAll(" & ", "--");
  }

  const response = await axiosServer.get(link, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  console.log(link);

  data = response.data;

  console.log(data);

  return {
    props: {
      data,
      filters: data.data.facets,
    },
  };
}

export default search;

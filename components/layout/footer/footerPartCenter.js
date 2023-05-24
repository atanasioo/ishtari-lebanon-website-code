import React from "react";
import Link from "next/link";
import DOMPurify from "dompurify";
import dynamic from "next/dynamic";

export default function FooterPartCenter(props) {

  const data = props?.data;



  return (

    <div>
    <div className={`flex justify-between px-5`}>
      {data?.data?.map((cat) => {
        return (
          <div key={cat?.category_id} className="pb-3">
            <div className="pb-3">
              <Link
                className="text-df uppercase hover:text-dblue pr-semibold leading-dsnug	"
                href={`${
                  cat.name?.length > 0
                    ? "/" +
                      cat?.name
                        .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                        .replaceAll("%", "")
                        .replace(/\s+/g, "-") +
                      "/c=" +
                      cat?.category_id
                    : "cat/c=" + cat?.category_id
                }`}
                dangerouslySetInnerHTML={{
                  __html: cat.name
                }}
              />
            </div>
            {cat?.data?.map((sub) => {
              return (
                <div
                  key={sub.category_id}
                  className="flex font-light loading-dtight py-1.5 opacity-60"
                >
                  {sub.category_id === "1697" ? (
                    <Link
                      className="text-d14 hover:text-dblue "
                      href={`${
                        sub.name.length > 0
                          ? "/" +
                            sub.name
                              .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                              .replaceAll("%", "")
                              .replace(/\s+/g, "-") +
                            "/c=" +
                            sub.category_id
                          : "cat/c=" + sub.category_id
                      }`}
                    >
                      <p
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(sub.name)
                        }}
                      />
                    </Link>
                  ) : (
                    <Link
                    className="text-d14 hover:text-dblue "
                      href={`${
                        sub.name.length > 0
                          ? "/" +
                            sub.name
                              .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                              .replaceAll("%", "")
                              .replace(/\s+/g, "-") +
                            "/c=" +
                            sub.category_id
                          : "cat/c=" + sub.category_id
                      }`}
                     
                      dangerouslySetInnerHTML={{
                        __html:
                         sub.name
                      }}
                    ></Link>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      <div className="mt-3">
        <div>
          <div
            className=" uppercase  hover:text-dblue text-df pb-3   pr-semibold loading-dsnug"
            dangerouslySetInnerHTML={{ __html: "TOP BRAND" }}
          />
        </div>
        {data?.brand?.map((brand) => {
          return (
            <div key={brand.id}    
            >
              <Link
                className="text-d14 hover:text-dblue"
                href={`${

                  brand.name.length > 0
                    ? "/" +
                      brand.name
                        .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                        .replaceAll("%", "")
                        .replace(/\s+/g, "-") +
                      "/m=" +
                      brand.id
                    : "cat/m=" + brand.id
                }`}
              
              >
             

              <div  className="flex opacity-60 loading-dtight py-1.5"   dangerouslySetInnerHTML={{
                  __html: brand.name
                }}></div>
                </Link>
            </div>
          );
        })}
      </div>
     
    </div>

    </div>
  );
}

import React from "react";
import Link from "next/link";
import DOMPurify from "dompurify";
export default function Footer(props) {
  const data = props.footer_categories;
  console.log(data);
  return (
    <div className={`flex justify-between mt-5  text-dblack`}>
          {data?.data?.map((cat) => {
            return (
              <div key={cat.category_id} className="mt-2 pb-3">
                <div className="pb-3">
                  <Link
                    className="font-bold text-d15 uppercase hover:text-dblue"
                    to={`${
                      // state.admin
                      //   ? path + "/category/" + cat.category_id
                      //   :
                         cat.name.length > 0
                        ? "/" +
                          cat.name
                            .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-").replaceAll('%', '')
                            .replace(/\s+/g, "-") +
                          "/c=" +
                          cat.category_id
                        : "cat/c=" + cat.category_id
                    }`}
                    // to={`/${cat.name}/c=${cat.category_id}`}
                    // dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(cat.name) }}
                  />
                </div>
                {cat?.data?.map((sub) => {
                  return (
                    <div
                      key={sub.category_id}
                      className="flex font-light text-d13 py-1"
                    >
                      {sub.category_id === "1697" ? (
                        <Link
                          className="text-d13 hover:text-dblue"
                          to={`${
                            // state.admin
                            //   ? path + "/category/" + sub.category_id
                            //   :
                               sub.name.length > 0
                              ? "/" +
                                sub.name
                                  .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-").replaceAll('%', '')
                                  .replace(/\s+/g, "-") +
                                "/c=" +
                                sub.category_id
                              : "cat/c=" + sub.category_id
                          }`}
                          // to={`/${sub.name}/c=${sub.category_id}`}
                        >
                          {/* <img src={}  className="w-5 h-5" alt="24-hr-deals"/> */}
                          <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(sub.name) }} />
                        </Link>
                      ) : (
                        <Link
                          className="text-d13 hover:text-dblue"
                          to={`${
                            // state.admin
                            //   ? path + "/category/" + sub.category_id
                            //   :
                               sub.name.length > 0
                              ? "/" +
                                sub.name
                                  .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-").replaceAll('%', '')
                                  .replace(/\s+/g, "-") +
                                "/c=" +
                                sub.category_id
                              : "cat/c=" + sub.category_id
                          }`}
                          // to={`/${sub.name}/c=${sub.category_id}`}
                        //   dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(sub.name) }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}

          <div className="mt-2 pb-3">
            <div className={ window.config !="undefined" && !window.config["showTopBrand"] ? "hidden" : "pb-3"}>
              <div
                className="font-bold uppercase text-d15 hover:text-dblue"
                dangerouslySetInnerHTML={{ __html: "TOP BRAND" }}
              />
            </div>
            {data?.brand?.map((brand) => {
              return (
                <div key={brand.id} className="flex font-light text-d13 py-1">
                  <Link
                    className="text-d13 hover:text-dblue"
                    to={`${
                      // state.admin
                      //   ? path + "/manufacturer/" + brand.id
                      //   :
                         brand.name.length > 0
                        ? "/" +
                          brand.name
                            .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-").replaceAll('%', '')
                            .replace(/\s+/g, "-") +
                          "/m=" +
                          brand.id
                        : "cat/m=" + brand.id
                    }`}
                    // to={`${brand.name}/c=${brand.id}`}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(brand.name) }}
                  />
                </div>
              );
            })}
          </div>
        </div>
  );
}

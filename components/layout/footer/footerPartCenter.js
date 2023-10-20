import React, { useState } from "react";
import Link from "next/link";
import DOMPurify from "dompurify";

export default function FooterPartCenter(props) {
  const data = props?.data;
  const [show, setShow] = useState({ id: "", status: false });

  function toggleButton(id) {
    if (show.id === id) {
      setShow({ id: "", status: false });
    } else {
      setShow({ id: id, status: true });
    }
  }

  return (
    <div className="container">
      {/* desktop */}
      <div className={` justify-between px-5 hidden mobile:flex`}>
        {data?.data?.data?.map((cat) => {
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
                    __html: cat.name,
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
                            __html: DOMPurify.sanitize(sub.name),
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
                          __html: sub.name,
                        }}
                      ></Link>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        <div className="">
          <div>
            <div
              className=" uppercase  hover:text-dblue text-df pb-3   pr-semibold loading-dsnug"
              dangerouslySetInnerHTML={{ __html: "TOP BRAND" }}
            />
          </div>
          {data?.data?.brand?.map((brand) => {
            return (
              <div key={brand.id}>
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
                  <div
                    className="flex opacity-60 loading-dtight py-1.5"
                    dangerouslySetInnerHTML={{
                      __html: brand.name,
                    }}
                  ></div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      {/* mobile */}
      <div className="mt-2 mobile:hidden">
        {data?.data?.data?.map((cat) => {
          return (
            <div
              key={cat.category_id}
              className="flex-row container justify-between"
            >
              <div className="mt-1 border-b  border-dinputBorder ">
                <div className="flex items-center mx-4 justify-between font-normal text-sm pb-1 hover:text-dblue">
                  <Link
               
                    href={`${
                      // state.admin
                      //   ? path + "/category/" + cat.category_id
                      //   :
                      cat.name.length > 0
                        ? "/" +
                          cat.name
                            .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                            .replaceAll("%", "")
                            .replace(/\s+/g, "-") +
                          "/c=" +
                          cat.category_id
                        : "cat/c=" + cat.category_id
                    }`}
                    to={`/${cat.name}/c=${cat.category_id}`}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(cat.name),
                    }}
                  ></Link>
                  <span
                    onClick={() => toggleButton(cat.category_id)}
                    className={
                      show.id === cat.category_id
                        ? " text-dgrey1 font-thin text-2xl transition-all "
                        : " text-dgrey1 font-thin text-2xl transition-all "
                    }
                  >
                    {show.id === cat.category_id ? "-" : "+"}
                  </span>
                </div>
                <div
                  className={
                    show.id === cat.category_id && show.status
                      ? "flex-row mx-4"
                      : "hidden"
                  }
                >
                  {cat.data.map((sub) => (
                    <Link
                      key={sub.category_id}
                      className="block font-light text-d13 py-1 hover:text-dblue"
                      href={`${
                        // state.admin
                        //   ? path + "/category/" + sub.category_id
                        //   :

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
                      // to={`${path}/${sub.name}/c=${sub.id}}`}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(sub.name),
                      }}
                    ></Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        <div>
          <div className="flex-row container justify-between">
            <div className="border-b pb-2 border-dinputBorder ">
              <div
                onClick={() => toggleButton("tb")}
                className="flex items-center mx-4 justify-between font-normal text-sm hover:text-dblue"
              >
                <p
                  dangerouslySetInnerHTML={{
                    __html: `Top Brand`,
                  }}
                ></p>
                <span
                  className={
                    show.id === "tb"
                      ? "font-thin text-dgrey1 text-2xl transition-all"
                      : "font-thin text-dgrey1 text-2xl transition-all"
                  }
                >
                  {show.id === "tb" ? "-" : "+"}
                </span>
              </div>
              <div
                className={
                  show.id === "tb" && show.status ? "flex-row mx-4" : "hidden"
                }
              >
                {data?.brand?.map((brand) => (
                  <Link
                    key={brand.name}
                    className="block font-light text-d13 py-1 hover:text-dblue"
                    href={"/"}
                    // to={`${
                    //   // state.admin
                    //   //   ? path + "/manufacturer/" + brand.id
                    //   //   :
                    //   brand.name.length > 0
                    //     ? "/" +
                    //       brand.name
                    //         .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                    //         .replaceAll("%", "")
                    //         .replace(/\s+/g, "-") +
                    //       "/m=" +
                    //       brand.id
                    //     : "cat/m=" + brand.id
                    // }`}
                    // to={`${path}/${sub.name}/c=${sub.id}}`}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(brand.name),
                    }}
                  ></Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

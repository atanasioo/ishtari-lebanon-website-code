import buildLink from "@/urls";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import _axios from "@/axios";
import { FiChevronDown } from "react-icons/fi";
import DOMPurify from "dompurify";
import Link from "next/link";
import Image from "next/image";
import React from "react";

function DesktopMenuCategories(props) {
  const { header_categories } = props;
  const [menuCategories2, setMenuCategories2] = useState([]);
  const [selectedMenuCategory2, setSelectedMenuCategory2] = useState();
  const [viewSubAllCategories2, setViewSubAllCategories2] = useState(false);
  const [overlay, setOverlay] = useState(true);
  const [viewMenuCategories2, setViewMenuCategories2] = useState(true);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedTopCategory, setSelectedTopCategory] = useState({});
  const [clearHover, setClearHover] = useState(false);

  useEffect(() => {
    if (header_categories) {
      setMenuCategories2(header_categories);
      // setSelectedMenuCategory2(header_categories[0]);
    } else {
      _axios
        .get(buildLink("headerv2", undefined, window.innerWidth))
        .then((response) => {
          const data = response?.data;
          setMenuCategories2(data.data);
          // setSelectedMenuCategory2(data[0]);
        });
    }
    //sub menu categories
    _axios
      .get(buildLink("all_categories", undefined, window.innerWidth))
      .then((response) => {
        try {
          const data = response.data.data;
          setAllCategories(data);
          setSelectedTopCategory(data[0]);
        } catch (error) {}
      });
    //
  }, []);

  /* ON CLICK ESC CLOSE OVERLAY */

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      // setOverlay(false);
      setViewMenuCategories2(false);
      setViewSubAllCategories2(false);
    }
  });

  /* ON LINK CHANGE CLOSE OVERLAY */
  useEffect(() => {
    setOverlay(false);
    setViewMenuCategories2(false);
  }, [location]);

  function useTimeout(callback, delay) {
    const timeoutRef = React.useRef(null);
    const savedCallback = React.useRef(callback);
    React.useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
    React.useEffect(() => {
      const tick = () => savedCallback.current();
      if (typeof delay === "number") {
        timeoutRef.current = window.setTimeout(tick, delay);
        return () => window.clearTimeout(timeoutRef.current);
      }
    }, [delay]);
    return timeoutRef;
  }

  useTimeout(
    () => {
      if (selectedMenuCategory2) {
        // setOverlay(true);
        setViewMenuCategories2(true);
      }
    },
    clearHover ? null : 300
  );

  function refresh(test) {
    // alert(test);
    // alert(window.location.pathname)
    if (test === window.location.pathname) {
      window.location.reload();
    } else {
      history.push({ pathname: test });
    }
  }

  // useEffect(() => {
  //   _axios
  //       .get(buildLink("all_categories", undefined, window.innerWidth))
  //       .then((response) => {
  //         try {
  //           const data = response.data.data;
  //           console.log(response);
  //         } catch (error) {}
  //       });
  // },[])

  return (
    <div>
      <div
        className="hidden lg:block bg-white w-full shadow-md shadow-dbeigeRed  text-d16 "
        onClick={() => {
          setOverlay(false);
          setClearHover(true);
          setViewMenuCategories2(false);
          setViewSubAllCategories2(false);
        }}
        onMouseLeave={() => {
          setOverlay(false);
          setClearHover(true);
          setViewSubAllCategories2(false);
          setViewMenuCategories2(false);
        }}
      >
        <div>
          <div
            className={` ${
              window.config["showMenu"] ? "block" : "hidden"
            } flex items-center text-base`}
            style={{ minHeight: "48px" }}
          >
            <div>
              <div
                onMouseEnter={() => {
                  setOverlay(true);
                  setViewSubAllCategories2(true);
                  setViewMenuCategories2(false);
                }}
                className="flex items-center border-r px-4 border-dplaceHolder hover:text-dbase cursor-pointer "
              >
                <div>All Categories</div>
                <FiChevronDown className="w-5 h-5 mr-4" />
              </div>

              {/* Subcategories' menu */}

              {viewSubAllCategories2 && (
              <div className="relative">
                <div className="absolute top-4 z-20">
                  <div>
                    <div className="flex">
                      <div className="bg-dsearchGrey py-3 w-284px">
                        {allCategories?.map((category) => (
                          <div
                            key={category.category_id}
                            onMouseEnter={() =>
                              setSelectedTopCategory(category)
                            }
                          >
                            <Link
                              href={"/"} //wa2tiye
                              className="flex items-center py-1 hover:text-dblue px-4"
                            >
                              <Image
                                alt={category.name}
                                src={category.image}
                                width={40}
                                height={40}
                              />
                              <span
                                className="ml-3 font-light text-d13"
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(category.name),
                                }}
                              ></span>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              )}
            </div>

            {menuCategories2.length > 1 &&
              menuCategories2.map((category) => (
                <div
                  key={category["top-category"].category_id}
                  className="border-r border-dplaceHolder px-4 hover:text-dbase cursor-pointer"
                  onMouseEnter={() => {
                    setClearHover(false);
                    setViewSubAllCategories2(false);
                    setSelectedMenuCategory2(category);
                  }}
                  onMouseLeave={() => {
                    setClearHover(true);
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(category["title"].title),
                    }}
                  ></div>
                </div>
              ))}
            <div className="px-4 hover:text-dbase cursor-pointer">
              <div>New Arrivals</div>
            </div>
          </div>
        </div>
      </div>
      {/* Menu category */}

      <div className="absolute bg-dsearchGrey w-screen z-20">
        {viewMenuCategories2 && selectedMenuCategory2 && (
          <div
            className="container"
            onMouseEnter={() => setViewMenuCategories2(true)}
            onMouseLeave={() => {
              setViewSubAllCategories2(false);
              setViewMenuCategories2(false);
            }}
            style={{ borderTop: "1px solid rgb(226, 229, 241)" }}
          >
            <div className="flex py-6 px-10">
              <div className="pl-4 w-2/12">
                <Link
                  href={"/"}
                  className="font-semibold mb-4"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      selectedMenuCategory2["top-category"].name?.toUpperCase()
                    ),
                  }}
                ></Link>
                {selectedMenuCategory2["sub-categories"]?.map((category) => (
                  <Link
                    key={category.category_id}
                    className="block text-sm py-2 hover:text-dblue "
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(category.name),
                    }}
                    href={"/"}
                  ></Link>
                ))}
              </div>
              {/* brands */}
              <div className={`flex space-x-1 w-10/12 ml-10`}>
                {selectedMenuCategory2["partitions"]?.map((ban) => (
                  <div className={`p-0 `} key={Math.random()}>
                    {ban?.banners?.map((banner) => (
                      <div className={` cursor-pointer `} key={Math.random()}>
                        <Image
                          src={`${window.config["site-url"]}/image/${banner.image}`}
                          width={600}
                          height={400}
                          alt={banner.image.name}
                          title={banner.image.name}
                          style={{ width: "100%", height: "350px" }}
                          priority="true"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DesktopMenuCategories;

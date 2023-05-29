import React from "react";
import Link from "next/link";
import Image from "next/image";
import { slugify } from "@/components/Utils";
import { sanitizeHTML } from "@/components/Utils";

function DesktopMenuClientPopups(props) {
  const {
    viewMenuCategories2,
    viewSubAllCategories2,
    selectedMenuCategory2,
    handleState,
    allCategories,
    selectedTopCategory,
    overlay
  } = props;


  return (
    <div>
      {/* Subcategories' menu */}

      {viewSubAllCategories2 && (
        <div className="relative" onMouseEnter={()=>{handleState("viewSubAllCategories2", true); handleState("overlay", true);}}>
          <div className="absolute top-0 z-20">
            <div>
              <div className="flex">
                <div className="bg-dsearchGrey py-3 w-284px">
                  {allCategories?.map((category) => (
                    <div
                      key={category.category_id}
                      onMouseEnter={() => 
                        // setSelectedTopCategory(category)
                        handleState("selectedTopCategory", category)
                      }
                    >
                      <Link
                        href={`/${slugify(category.name)}/c=${
                          category.category_id
                        }`}
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
                            __html: sanitizeHTML(category.name),
                          }}
                        ></span>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="bg-white px-4" style={{ width: "500px" }}>
                  <div className="flex item-center justify-between py-5 border-b border-dinputBorder mb-2">
                    <h2
                      className=" font-semibold"
                      dangerouslySetInnerHTML={{
                        __html: selectedTopCategory.name,
                      }}
                    ></h2>
                    <Link
                      className="text-dblue text-sm"
                      href={`/category/${selectedTopCategory.category_id}`}
                    >
                      <span>View All </span>
                      <i className="icon icon-angle-right"></i>
                    </Link>
                  </div>
                  {selectedTopCategory?.categories &&
                    selectedTopCategory["categories"]?.map((sub_category) => (
                      <Link
                        key={Math.random()}
                        href={`/category/${sub_category.category_id}`}
                        className=" flex items-center py-1 hover:bg-dsearchGrey"
                      >
                        <Image
                          alt={sub_category.name}
                          src={sub_category.image}
                          width={35}
                          height={35}
                        />
                        <span
                          className="ml-3 font-light text-xs"
                          dangerouslySetInnerHTML={{
                            __html: sub_category.name,
                          }}
                        ></span>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu category */}

      <div className="absolute bg-dsearchGrey w-screen z-20">
        {viewMenuCategories2 && selectedMenuCategory2 && (
          <div
            className="container"
            onMouseEnter={() => {
              //setViewMenuCategories2(true);
              handleState("viewMenuCategories2", true);
              // setOverlay(true);
              handleState("overlay", true);
            }}
            onMouseLeave={() => {
              // setViewSubAllCategories2(false);
              handleState("viewSubAllCategories2", false)
              // setViewMenuCategories2(false);
              handleState("viewMenuCategories2", false)
            }}
            style={{ borderTop: "1px solid rgb(226, 229, 241)" }}
          >
            <div className="flex py-6 px-10">
              <div className="pl-4 w-2/12">
                <Link
                  href={`/${slugify(
                    selectedMenuCategory2["top-category"].name
                  )}/c=${selectedMenuCategory2["top-category"].category_id}`}
                  className="font-semibold mb-4"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHTML(
                      selectedMenuCategory2["top-category"].name?.toUpperCase()
                    ),
                  }}
                ></Link>
                {selectedMenuCategory2["sub-categories"]?.map((category) => (
                  <Link
                    key={category.category_id}
                    className="block text-sm py-2 hover:text-dblue "
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML(category.name),
                    }}
                    href={`/${slugify(category.name)}/c=${
                      category.category_id
                    }`}
                  ></Link>
                ))}
              </div>
              {/* brands */}
              <div className={`flex space-x-1 w-10/12 ml-10`}>
                {selectedMenuCategory2["partitions"]?.map((ban) => (
                  <div className={`p-0 `} key={Math.random()}>
                    {ban?.banners?.map((banner) => (
                      <div
                        className={` cursor-pointer `}
                        key={Math.random()}
                        onClick={() =>
                          router.push(
                            `${slugify(banner.name)}/${types[
                              banner.mobile_type
                            ].slice(0, 1)}=${banner.mobile_type_id}`
                          )
                        }
                      >
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

export default DesktopMenuClientPopups;

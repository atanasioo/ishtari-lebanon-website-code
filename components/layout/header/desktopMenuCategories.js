import buildLink from "@/urls";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import _axios from "@/axios";
import { FiChevronDown } from "react-icons/fi";
import DOMPurify from "dompurify";
import Link from "next/link";
import Image from "next/image";

function DesktopMenuCategories(props) {
  const { header_categories } = props;
  const [menuCategories2, setMenuCategories2] = useState([]);
  const [selectedMenuCategory2, setSelectedMenuCategory2] = useState();
  const [viewSubAllCategories2, setViewSubAllCategories2] = useState(false);
  const [overlay, setOverlay] = useState(true);
  const [viewMenuCategories2, setViewMenuCategories2] = useState(true);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedTopCategory, setSelectedTopCategory] = useState({});

  // console.log(header_categories);

  useEffect(() => {
    if (header_categories) {
      setMenuCategories2(header_categories);
      setSelectedMenuCategory2(header_categories[0]);
    } else {
      _axios
        .get(buildLink("headerv2", undefined, window.innerWidth))
        .then((response) => {
          const data = response?.data;
          setMenuCategories2(data.data);
          setSelectedMenuCategory2(data[0]);
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
    <div
      className="pr-bold bg-white w-full container shadow-md shadow-dbeigeRed pb-4"
      onMouseLeave={() => {
        setOverlay(false);
        setViewSubAllCategories2(false);
        setViewMenuCategories2(false);
      }}
    >
      <div>
        <div className="flex items-center text-base">
          <div>
            <div
              onMouseEnter={() => {
                setOverlay(true);
                setViewSubAllCategories2(true);
                setViewMenuCategories2(false);
              }}
              className="flex items-center border-r px-4 border-dplaceHolder hover:text-dbase cursor-pointer"
            >
              <div>All Categories</div>
              <FiChevronDown className="w-5 h-5 mr-4" />
            </div>

            {/* Subcategories' menu */}

            {viewSubAllCategories2 && (
              <div className="relative">
                <div className="absolute top-4 z-20">
                  <div className="container">
                    <div className="flex">
                      <div className="bg-dgrey py-3 w-284px">
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
        <div className="flex items-center text-base">
          <div className="country-flag"></div>
        </div>
      </div>
    </div>
  );
}

export default DesktopMenuCategories;

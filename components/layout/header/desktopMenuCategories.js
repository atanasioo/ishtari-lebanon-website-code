import buildLink from "@/urls";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import _axios from "@/axios";
import { FiChevronDown } from "react-icons/fi";
import DOMPurify from "dompurify";


function DesktopMenuCategories(props) {
  const { header_categories } = props;
  const [menuCategories2, setMenuCategories2] = useState([]);
  const [selectedMenuCategory2, setSelectedMenuCategory2] = useState();

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
    <div className="pr-bold bg-white w-full container shadow-md shadow-dbeigeRed pb-5 uppercase">
      <div>
        <div className="flex items-center text-base">
          <div className="flex items-center border-r pr-4 border-dplaceHolder hover:text-dbase cursor-pointer">
            <div>All Categories</div>
            <FiChevronDown className="w-5 h-5 mr-4" />
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

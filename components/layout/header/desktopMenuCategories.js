import buildLink from "@/urls";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FiChevronDown, FiList } from "react-icons/fi";
import Link from "next/link";
import React from "react";
import { slugify } from "@/components/Utils";
import { HeaderOverlay } from "@/components/Overlay";
import DesktopMenuClientPopups from "./DesktopMenuClientPopups";
import { sanitizeHTML } from "@/components/Utils";
import { axiosServer } from "@/axiosServer";
import { useMarketingData } from "@/contexts/MarketingContext";
import { useHeaderColor } from "@/contexts/HeaderContext";
import { FaAngleDown, FaCaretDown } from "react-icons/fa";

function DesktopMenuCategories(props) {
  const { header_categories, local, headerSettings } = props;
  const [menuCategories2, setMenuCategories2] = useState([]);
  const [selectedMenuCategory2, setSelectedMenuCategory2] = useState();
  const [viewSubAllCategories2, setViewSubAllCategories2] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [viewMenuCategories2, setViewMenuCategories2] = useState(true);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedTopCategory, setSelectedTopCategory] = useState(null);
  const [clearHover, setClearHover] = useState(false);
  const { setMarketingData } = useMarketingData();
  const { headerColor, setHeaderColor } = useHeaderColor();
  const { temp, setTemp } = useState();


  const router = useRouter();

  // const DesktopMenuClientPopups = dynamic(
  //   () => import("./DesktopMenuClientPopups"),
  //   {
  //     ssr: false, // Disable server-side rendering
  //   }
  // );

  function handleState(state, value) {
    if (state === "selectedTopCategory") {
      setSelectedTopCategory(value);
    } else if (state === "viewMenuCategories2") {
      setViewMenuCategories2(value);
    } else if (state === "viewSubAllCategories2") {
      setViewSubAllCategories2(value);
    } else if (state === "overlay") {
      setOverlay(value);
    }
  }

  useEffect(() => {
    if (header_categories) {
      setMenuCategories2(header_categories);
      // setSelectedMenuCategory2(header_categories[0]);
    } else {
      
      axiosServer
        .get(
          buildLink("headerv2", undefined, undefined, window.config["site-url"])
        )
        .then((response) => {
          const data = response?.data;
          console.log(data);
          setMenuCategories2(data.data);
          // setSelectedMenuCategory2(data[0]);
        });
    }
    //sub menu categories
    if (window.innerWidth > 1024) {
      axiosServer
        .get(
          buildLink(
            "all_categories",
            undefined,
            undefined,
            window.config["site-url"]
          )
        )
        .then((response) => {
          try {
            const data = response.data.data;
            setAllCategories(data);
            setSelectedTopCategory(data[0]);
            // setTemp(data[0])
          } catch (error) {}
        });
    }

    //
  }, []);


  // useEffect(()=>{
  //   setSelectedTopCategory(temp);
  // },[viewSubAllCategories2])

  /* ON CLICK ESC CLOSE OVERLAY */

  // if (typeof window !== "undefined" && window !== undefined) {
  //   window.addEventListener("keydown", (e) => {
  //     if (e.key === "Escape") {
  //       // setOverlay(false);
  //       setViewMenuCategories2(false);
  //       setViewSubAllCategories2(false);
  //     }
  //   });


  /* ON LINK CHANGE CLOSE OVERLAY */
  useEffect(() => {
    setOverlay(false);
    setViewMenuCategories2(false);
    setViewSubAllCategories2(false);
  }, [router]);

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
        setOverlay(true);
        setViewMenuCategories2(true);
      }
   
    },
    clearHover ? null : 100
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


  return (
    <div  className="  relative   border-t bg-[#F5EFF0] border-dborderColor " 
    //  style={{
    //   backgroundColor: headerColor ,
    // }}
    >
      {router.asPath.indexOf("pos") < 0 && (
        <div
          className="hidden lg:block   px-9 w-full  text-d16 "
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
              className={` hidden  lg:flex items-center text-base`}
              style={{ minHeight: "48px" }}
            >
              <div>
                <div
                onClick={()=>router.push("/allcategories")}
                  onMouseEnter={() => {
                    setOverlay(true);
                    setViewSubAllCategories2(true);
                    setViewMenuCategories2(false);
                  }}
                  className="flex items-center border-r gap-3 px-4 text-dblackk  font-[900] text-md border-dplaceHolder hover:text-dbase cursor-pointer "
                >
                  <FiList />
                  <div >All Categories</div>
                  <FaAngleDown className={`text-md transition-all  ${viewSubAllCategories2?"rotate-180 text-dbase":"rotate-0 text-dblack"} `} />
                </div>

                {/* Overlay */}
                {overlay && (
                  <div
                    onMouseEnter={() => {
                      setClearHover(true);
                      setOverlay(false);
                      setViewSubAllCategories2(false);
                      setViewMenuCategories2(false);
                    }}
                  >
                    <HeaderOverlay local={local} />
                  </div>
                )}
              </div>

              {header_categories?.length > 1 &&
                header_categories.map((category) => (
                  <div
                    key={category["top-category"].category_id}
                    className={` px-4 text-sm
                     hover:text-dbase cursor-pointer group relative flex gap-3  ${viewMenuCategories2 && selectedMenuCategory2 == category?"text-dbase":"text-dblack"} justify-center text-clip`}
                    onMouseEnter={() => {
                      setClearHover(false);
                      setViewSubAllCategories2(false);
                      setSelectedMenuCategory2(category);
                    }}
                    onMouseLeave={() => {
                      setClearHover(true);
                    }}
                  >
                    <div className={` ${viewMenuCategories2 && selectedMenuCategory2 == category?"w-full":"w-0"} transition-all h-[2px] w-0 group-hover:w-full absolute -bottom-1 bg-dbase rounded-lg`}></div>
                    <Link
                      href={`/${slugify(category["title"].title)}/c=${
                        category["title"].mobile_type_id
                      }`}
                      onClick={() =>
                        setMarketingData({
                          ignore: false,
                          banner_image_id: "",
                          source_type: "default",
                          source_type_id: "",
                        })
                      }
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHTML(category["title"].title),
                      }}
                    ></Link>
                    <FaCaretDown  className={`${viewMenuCategories2 && selectedMenuCategory2 == category?"text-dbase":"text-dblack"} h-full my-auto  `}/>
                  </div>
                ))}
              {/* <div className="px-4 hover:text-dbase cursor-pointer">
                <Link href={`/latest`} onClick={() => setMarketingData({})}>
                  New Arrivals
                </Link>,
              </div> */}



              
              {headerSettings.length > 0 &&
                headerSettings.map((setting, index) => (
                  <div className={`px-4 hover:text-dbase text-sm text-dblack cursor-pointer ${index !== headerSettings.length -1 ? "" : "" }  ${!setting.value ? "hidden" : ""}`}>
                    <Link href={`/${ setting.key == "new_arrivals" ?"new-arrivals/c=4617"  :"back-to-stock/c=4616" }`} onClick={() => setMarketingData({})}>
                      {setting.title}
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      <DesktopMenuClientPopups
        viewSubAllCategories2={viewSubAllCategories2}
        selectedMenuCategory2={selectedMenuCategory2}
        allCategories={allCategories}
        handleState={handleState}
        selectedTopCategory={selectedTopCategory}
        viewMenuCategories2={viewMenuCategories2}
        overlay={overlay}
      />
    </div>
  );
}

export default DesktopMenuCategories;

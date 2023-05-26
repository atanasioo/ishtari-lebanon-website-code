import React, { useState, useEffect } from "react";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { useRouter } from "next/router";

function CatalogPage(props) {
  const [filters, setFilters] = useState(props.data?.filters);
  const [data, setData] = useState(props.data?.filters);
  const router = useRouter();
  const {
    filter_categories,
    filter_manufacturers,
    filter_sellers,
    filter_options
  } = router.query;

  // Access the query parameter values
  console.log("Param1:", filter_categories);
  console.log("Param2:", filter_manufacturers);
  console.log("Param3:", filter_sellers);
  console.log("Param4:", filter_options);

  // useEffect(() => {
  // if (router && router.pathname) {
  //   const currentUrl = router.pathname;
  //   console.log('Current URL:', currentUrl);
  // }

  function checkFilter(type, name, filter) {
    console.log(router.asPath);
    console.log(type);
    if (  filter_options != undefined  && (name === "Color" || name === "Light Color")) {
      if (filter_options.indexOf(filter["id"]) > -1) {
        return "rounded-full border border-dblue";
      } else {
        return "rounded-full border relative border-dgreyRate cursor-pointer hover:shadow";
      }
    } else if (  filter_options != undefined  &&
     ( name === "Shoes Size" ||
      name === "Size by Age" ||
      name === "jeans Size" ||
      name === "Socks")
    ) {
      if ( filter_options.indexOf(filter["id"]) > -1) {
        return "border rounded text-dblue border-dblue p-2";
      } else {
        return "border rounded relative border-dgreyRate cursor-pointer hover:shadow p-2";
      }
    } else if(  type === "filter_categories" || type === "filter_manufacturers"  || type === "filter_sellers") {
      if (filter_categories != undefined && type === "filter_categories") {

        if (filter_categories.indexOf(filter["id"]) > -1)
        return <input type="checkbox" className="" checked />;  
       }

      if (
        filter_manufacturers != undefined &&
        type === "filter_manufacturers"
      ) {

   
        if (filter_manufacturers.indexOf(filter["id"]) > -1)
          return <input type="checkbox" className="" checked />;
      
      }

      if (filter_sellers != undefined && type === "filter_sellers") {
        if (filter_sellers.indexOf(filter["id"]) > -1)
        return <input type="checkbox" className="" checked />;
      
      }

      return <input type="checkbox" className=""  />;
    }else{
      if (filter_options != undefined && type === "filter_options") {
        if (filtefilter_optionsr_sellers.indexOf(filter["id"]) > -1)
      return <input type="checkbox" className="" checked />;
      
      }
      return <input type="checkbox" className=""  />;

    }
 
  }

  return (
    <div className="flex">
      <div className="w-1/1"></div>
      <div className="w-1/5 p-5 ">
        {filters &&
          Object.keys(filters).map((key) => (
            <div>
              <div className="text-dcf pr-semibold leading-lfc font-bold capitalize ">
                {filters[key].name}
              </div>
              <div style={{ display: "block" }}>
                {key ? (
                  <div>
                    {filters[key].items.slice(0, 5).map((filter) => (
                      <div key={Math.random()}>
                        {filters[key].name === "Light Color" ||
                        filters[key].name === "Color" ? (
                          <div
                            className="my-2 flex items-center cursor-pointer hover:text-dblue"
                            key={filter.name}
                            // onClick={() => parseFilter(filters[key].id, filter)}
                          >
                            <span className="flex w-10/12">
                              <span
                              className={`flex w-7 h-7 ${checkFilter(
                                filters[key].id,
                                filters[key].name,
                                filter
                              )}`}
                              >
                                <img
                                  src={filter.image}
                                  style={{
                                    padding: `1px`
                                  }}
                                  className={`w-12/12 rounded-full border border-dgreyRate`}
                                  alt="Not Found"
                                />
                              </span>
                              <p className="py-2 mx-2 text-d14 leading-dtight w-8/12 font-light">
                                {" "}
                                {filter.name}
                              </p>
                            </span>
                            <span className="flex w-1/12"></span>
                            <span className="text-d14 text-right font-light opacity-70">
                              ({filter.count})
                            </span>
                          </div>
                        ) : (
                          <div >
                            <p
                              className="my-2 flex  items-center cursor-pointer hover:text-dblue "
                              key={filter.name}
                            
                            >
                              <i >
                                {checkFilter(
                                  filters[key].id,
                                  filter.name,
                                  filter
                                )}
                              </i>
                              <span className="mx-2 text-d14 font-light w-full leading-dtight mb-1">
                                {filter.name} 
                              </span>

                              <span className="text-d14 text-right font-light opacity-70">
                                ({filter.count})
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                    <div>
                      <label
                        className={
                          filters[key].items.length > 5
                            ? `text-dblue text-xs cursor-pointer`
                            : "hidden"
                        }
                        // onClick={(e) => toggleFilters(e.target)}
                      >
                        See All
                      </label>
                    </div>
                    <div style={{ display: "none" }}>
                      {filters[key].items
                        .slice(5, filters[key].items.length)
                        .map((filter) => (
                          <div key={Math.random()}>
                            {filters[key].name === "Light Color" ||
                            filters[key].name === "Color" ? (
                              <div
                                className="my-2 flex items-center cursor-pointer hover:text-dblue"
                                key={filter.name}
                                // onClick={() =>
                                //   parseFilter(filters[key].id, filter)
                                // }
                              >
                                <span className="flex w-10/12">
                               
                                  <span
                                  // className={`flex w-7 h-7 ${checkFilter(
                                  //   filters[key].id,
                                  //   filters[key].name,
                                  //   filter
                                  // )}`}
                                  >
                                    <img
                                      src={filter.image}
                                      style={{
                                        padding: `1px`
                                      }}
                                      className={`w-12/12 rounded-full border border-dgreyRate`}
                                      alt="Not Found"
                                    />
                                  </span>
                                  <p className="py-2 mx-2 text-d14 w-8/12 font-light leading-dtight ">
                                    {" "}
                                    {filter.name}
                                  </p>
                                </span>
                                <span className="flex w-1/12"></span>
                                <span className="text-d14 text-right font-light ">
                                  ({filter.count})
                                </span>
                              </div>
                            ) : (
                              <div>
                                <p
                                  className="my-2 float items-center cursor-pointer hover:text-dblue "
                                  key={filter.name}
                                  onClick={() =>
                                    parseFilter(filters[key].id, filter)
                                  }
                                >
                                  <i>
                                    {checkFilter(
                                      filters[key].id,
                                      filter.name,
                                      filter
                                    )}
                                  </i>
                                  <span className="text-d14 font-light leading-dtight mb-1">
                                    {filter.name}
                                  </span>

                                  <span className="text-d14 text-right font-light opacity-70 ">
                                    ({filter.count})
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          ))}
      </div>
      <div className="w-3/4"></div>
    </div>
  );
}

export default CatalogPage;

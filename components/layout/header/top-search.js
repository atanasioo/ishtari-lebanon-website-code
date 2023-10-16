import { axiosServer } from "@/axiosServer";
import { useRouter } from "next/router";
import React from "react";
import { useContext, useEffect, useState, useRef } from "react";
import buildLink, { path } from "@/urls";
import Link from "next/link";
import { BsFire, BsSearch, BsTrash } from "react-icons/bs";
import { sanitizeHTML } from "@/components/Utils";

// import {sellerImage}  from "/public/images/shop-svgrepo-com.svg";
// import {brandImage}  from "/public/images/brand-svgrepo-com.svg";
import { AccountContext } from "@/contexts/AccountContext";
import { AiFillCloseCircle } from "react-icons/ai";

function TopSearch() {
  const wrapperRef = useRef(null);
  const [query, setQuery] = useState("");
  const [overlay, setOverlay] = useState(false);
  const [results, setResults] = useState([]);
  const [viewResults, setViewResults] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stateAcc, dispatch] = useContext(AccountContext);
  const [message, setMessage] = useState();
  const [trendingSearch, setTrendingSearch] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [searchHistory, setSearchHistory] = useState([]);
  const [topSearch, setTopSearch] = useState([]);
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const currentIndexRef = useRef(0);
  const [trash, setTrash] = useState(true);
  let placeholderInterval;

  function setShowSearchFunction() {
    setShowSearch(false);
    setResults([]);
    setViewResults(false);
  }

  useOutsideAlerter(wrapperRef);
  const router = useRouter();
  useEffect(() => {
    setResults([]);
    setViewResults(false);
    setShowSearch(false);
    setTrash(true);
  }, [router]);

  const types = {
    1: "product",
    2: "category",
    3: "manufacturer",
    4: "seller",
  };

  useEffect(()=>{
  setQuery("")
  }, [router])
  function useOutsideAlerter(ref) {
    useEffect(() => {
      if (overlay) {
        function handleClickOutside(event) {
          if (ref.current && !ref.current.contains(event.target)) {
            const isTrashIconClicked = event.target.closest(".trash-icon");
            if (!isTrashIconClicked) {
              setTimeout(() => setOverlay(false), 200);
              setTimeout(() => setViewResults(false), 200);
              if (window.innerWidth > 1024) {
                const input = document.getElementById("searchInput").value;
                if (input.length === 0) {
                  setTimeout(() => setResults([]), 200);
                }
                setTimeout(() => setTrash(true), 200);
              }
            }
          }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }
    }, [ref, overlay]);
  }
  function navigateSearch(e) {
    if (e.keyCode === 13 && e?.target?.value?.length > 2) {
      const query = e.target.value;
      setQuery("");
      setLoading(false);
      saveSearchHistory(query);
      router.push({
        pathname: "/search",
        search: "?keyword=" + query,
        state: location.pathname,
      });
    }
  }

  function saveSearchHistory(query, type = "") {
    if (type !== "product") {
      let searchHistory =
        JSON.parse(localStorage.getItem("search_history")) || [];

      searchHistory.unshift(query);

      if (searchHistory.length > 10) {
        searchHistory.pop();
      }

      setSearchHistory(searchHistory);

      localStorage.setItem("search_history", JSON.stringify(searchHistory));
    }
  }

  function deleteHistoryItem(e, index) {
    e.preventDefault();
    let searchHistory =
      JSON.parse(localStorage.getItem("search_history")) || [];

    searchHistory.splice(index, 1);

    setSearchHistory(searchHistory);

    localStorage.setItem("search_history", JSON.stringify(searchHistory));
  }

  function clearAllHistory() {
    let searchHistory =
      JSON.parse(localStorage.getItem("search_history")) || [];
    searchHistory = [];
    setSearchHistory(searchHistory);

    localStorage.setItem("search_history", JSON.stringify(searchHistory));
    setTrash(true);
  }

  function handleOverlay(e) {
    if (e.keyCode === 13) {
      setOverlay(false);
    }
  }

  function handleSearchResults() {
    if (window.innerWidth > 1024) {
      const input = document.getElementById("searchInput").value;
      // if (input === "") {
      //   setViewResults(false);
      //   setLoading(false);
      // } else {
      setViewResults(true);
      //}
      if (trendingSearch.length === 0) {
        axiosServer
          .get(buildLink("trendingSearch", undefined, window.innerWidth))
          .then((response) => {
            if (response.data.success) {
              setTrendingSearch(response.data.data.topsearch);
              setViewResults(true);
              setTrendingLoading(false);
            }
          });
      }
    } else {
      setShowSearch(true);
      if (trendingSearch.length === 0) {
        axiosServer
          .get(buildLink("trendingSearch", undefined, window.innerWidth))
          .then((response) => {
            setTrendingSearch(response.data.data.topsearch);
            setTrendingLoading(false);
          });
      }
    }
  }

  useEffect(() => {
    async function search() {
      setLoading(true);
      const res = await axiosServer.get(
        buildLink("search", undefined, undefined, window.config["site-url"]) +
          query +  `${stateAcc?.admin && "&employer=true"}`
      );
      try {
        setResults(!res?.data?.message && res?.data?.data);
        // setMessage(res?.data?.message);
        setLoading(false);
        setViewResults(true);
        // setOverlay(true);
      } catch (error) {
        // if (axios.isCancel(error)) {
        //   console.error("axios error", error.message);
        // } else {
          console.error(error);
        //}
      }
    }
    if (query.length > 1) {
      search();
    } else {
      setLoading(false);
    }

    // return () => source.cancel("Previous request is canceled");
  }, [query]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("search_history")) || [];
    setSearchHistory(history);

    axiosServer
      .get(buildLink("historySearch", undefined, undefined, window.location.host))
      .then((response) => {
        setTopSearch(response.data?.data?.topsearch);
        startPlaceholderLoop(response.data.data?.topsearch);
      });
    return () => {
      clearInterval(placeholderInterval);
    };
  }, []);

  const startPlaceholderLoop = (searchArray) => {
    if (searchArray.length > 0) {
      setCurrentPlaceholder(searchArray[0]["keyphrase"]);
      currentIndexRef.current = 1;

      placeholderInterval = setInterval(() => {
        const currentIndex = currentIndexRef.current;
        if (currentIndex < searchArray.length) {
          setCurrentPlaceholder(searchArray[currentIndex]["keyphrase"]);
          currentIndexRef.current = (currentIndex + 1) % searchArray.length;
        }
      }, 5000);
    }
  };

  return (
    <>
      {overlay && (
        <div
          className={`absolute z-50  bg-dblackk opacity-50 min-h-screen min-w-full min-w-screen left-0 ${
            stateAcc.admin ? "top-182px" : "top-32"
          }  mt-1 hidden mobile:block `}
          style={{ height: "1400px" }}
        ></div>
      )}
      <div className="relative flex justify-center lg:flex-grow">
        {/* mobile search */}
        {showSearch && (
          <div className="fixed top-0 left-0 bottom-0 right-0 bg-white z-50">
            <div className="flex px-3 border border-dgrey items-center">
              <i
                className="icon icon-angle-left text-2xl text-dgrey1"
                onClick={() => setShowSearchFunction()}
              ></i>
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                onKeyDown={(e) => navigateSearch(e)}
                autoFocus
                className="block flex-grow mx-2 h-12 outline-none px-4 text-dblack"
                type="text"
                // placeholder="What are you looking for? "
                placeholder={
                  topSearch?.length > 0
                    ? currentPlaceholder
                    : "What are you looking for?"
                }
              />
              <i className="icon icon-search text-2xl text-dgrey1"></i>
            </div>
            {results?.length > 0 && viewResults ? (
              <div
                onMouseLeave={() => {
                  setViewResults(false);
                }}
                className="text-dblack"
              >
                {" "}
                {results?.length > 0 &&
                  results
                    .slice(0, 8)
                    .map(({ type, id, value, img, num_prods }) => (
                      <Link
                        key={Math.random()}
                        className="px-4 py-2 cursor-pointer hover:bg-dgrey flex border-b-2 border-dgrey  capitalize text-d14"
                        href={
                          isNaN(type)
                            ? `${path}/search?keyword=${value}`
                            : `${path}/${value
                                .replaceAll("/", "-")
                                .replaceAll("/", "-")
                                .replaceAll("%", parseInt("%"))
                                .replaceAll("%20", "-")}/${types[type]?.slice(
                                0,
                                1
                              )}=${id}`
                        }
                        onClick={() => {
                          saveSearchHistory(value, types[type]);
                          setShowSearch(false);
                        }}
                      >
                        <span className="flex w-full align-middle items-center   h-auto my-2 px-1 ">
                          <span class="w-12 ">
                            {img.length > 0 ? (
                              <img
                                onError={(event) => (event.target.src = "/images/product_placeholder_square.png")}
                                width="24"
                                height="24"
                                src={`${window.config["site-url"]}/image/${img}`}
                                alt="image"
                              />
                            ) : types[type] === "seller" ||
                              types[type] === "manufacturer" ? (
                              <img
                                // onError={(event) => (event.target.src = sq)}
                                width="24"
                                height="24"
                                src={
                                  types[type] === "seller"
                                    ? "/images/shop-svgrepo-com.svg"
                                    : "/images/brand-svgrepo-com.svg"
                                }
                                alt="catalog_image"
                              />
                            ) : (
                              <BsSearch />
                            )}
                          </span>
                          <span className=" w-full align-middle items-start  justify-center ml-1 leading-4 ">
                            <span
                              className=""
                              dangerouslySetInnerHTML={{
                                __html: sanitizeHTML(value),
                              }}
                            ></span>
                            <span className="text-dgrey1 font-light  ">
                              {" "}
                              {num_prods}
                            </span>{" "}
                          </span>
                        </span>

                        <span className="text-dgrey1 space-y-0 font-light text-right ml-1 my-2 ">
                          {" "}
                          {types[type]}{" "}
                        </span>
                      </Link>
                    ))}{" "}
              </div>
            ) : results.length === 0 && trendingSearch.length > 0 ? (
              <div>
                {searchHistory.length > 0 && (
                  <div className="px-4 py-2 trash-icon">
                    <div className="flex items-center justify-between gap-2 py-2 ">
                      <div className="pr-semibold text-d18">
                        Recently Searched
                      </div>

                      {trash ? (
                        <BsTrash
                          className="w-4 h-4 text-dgrey1 cursor-pointer "
                          onClick={() => setTrash(false)}
                        />
                      ) : (
                        <div className="flex items-center text-sm gap-4 pr-light">
                          <div
                            className="cursor-pointer"
                            onClick={() => clearAllHistory()}
                          >
                            Clear All
                          </div>
                          <div
                            className="cursor-pointer"
                            onClick={() => setTrash(true)}
                          >
                            Done
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searchHistory.map((history, index) => (
                        <Link
                          href={`${path}/search?keyword=${history}`}
                          key={index}
                          className="bg-dsearchGrey px-2.5 py-1 cursor-pointer relative"
                          onClick={()=> setShowSearch(false)}
                        >
                          <div onClick={() => setOverlay(false)}>{history}</div>
                          {!trash && (
                            <AiFillCloseCircle
                              onClick={(e) => deleteHistoryItem(e, index)}
                              className="absolute text-dgreyQtyProduct w-5 h-4 -top-1 -right-1"
                            />
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {trendingSearch.length > 0 && (
                  <div className="px-4 py-2">
                    <div className="flex items-center gap-2 pr-semibold text-d18 py-2">
                      Trending <BsFire className="text-dbase" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearch.map((search, index) => (
                        <Link
                          href={`${path}/search?keyword=${search.keyphrase}`}
                          key={index}
                          className="bg-dsearchGrey px-2.5 py-1 cursor-pointer"
                          onClick={()=> setShowSearch(false)}
                        >
                          {search.keyphrase}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <span className="text-dgrey1 space-y-0 font-light text-right m-2">
                {message}{" "}
              </span>
            )}
          </div>
        )}

        <input
          type={"text"}
          placeholder={
            topSearch?.length > 0
              ? currentPlaceholder
              : "What are you looking for?"
          }
          autoComplete="off"
          className="hidden lg:block rounded-sm h-11  w-4/5  outline-none p-4 bg-dsearchGrey "
          id="searchInput"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          onKeyDown={(e) => {
            navigateSearch(e);
            handleOverlay(e);
          }}
          ref={wrapperRef}
          onClick={() => {
            setOverlay(true);
            handleSearchResults();
          }}
        />
        {/* {query.length === 0 && (
            <div className={`hidden lg:flex placeholder-wrapper`}>
              {topSearch.length > 0 && (
                <div
                  className={`placeholder text-dgrey1 ${
                    topSearch.length > 1 ? "with-transition" : ""
                  }`}
                >
                  {currentPlaceholder}
                </div>
              )}
            </div>
          )} */}

        <i
          onClick={() => handleSearchResults()}
          className="block lg:hidden icon icon-search text-dgreyBlack text-2xl"
        ></i>

        {/* Results */}
        {results.length > 0 && viewResults ? (
          <div
            onClick={() => setOverlay(false)}
            className="hidden xl:block lg:block absolute top-10 w-4/5  border-2 border-dgrey border-t-0 z-50 bg-white  text-dblack rounded rounded-tl-none rounded-tr-none"
          >
            {results.length > 0 &&
              results.slice(0, 8).map(({ type, id, value, img, num_prods }) => (
                <Link
                  key={Math.random()}
                  className="px-4 py-2 cursor-pointer hover:bg-dgrey flex items-center "
                  href={
                    isNaN(type)
                      ? //? "search?keyword=" + value
                        `${path}/search?keyword=${value}`
                      : // state.admin
                        // ? `${path}/${types[type]}/${id}`
                        // :
                        `${path}/${value
                          .replaceAll("/", "-")
                          .replaceAll("%", parseInt("%"))
                          .replaceAll("%20", "-")}/${types[type]?.slice(
                          0,
                          1
                        )}=${id}`
                  }
                  onClick={() => saveSearchHistory(value, types[type])}
                >
                  <span className="flex w-full items-center align-middle  h-auto my-2 px-1 ">
                    <span className="w-12 ">
                      {img.length > 0 ? (
                        <img
                          onError={(event) => (event.target.src = "/images/product_placeholder_square.png")}
                          width="24"
                          height="24"
                          src={`${window.config["site-url"]}/image/${img}`}
                          alt=""
                        />
                      ) : types[type] === "seller" ||
                        types[type] === "manufacturer" ? (
                        <img
                          // onError={(event) => (event.target.src = sq)}
                          width="24"
                          height="24"
                          src={
                            types[type] === "seller"
                              ? "/images/shop-svgrepo-com.svg"
                              : "/images/brand-svgrepo-com.svg"
                          }
                          alt="catalog_image"
                        />
                      ) : (
                        <BsSearch />
                      )}
                    </span>
                    <span className=" w-full align-middle items-center justify-center ml-1 leading-4">
                      <span
                        className=""
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHTML(value),
                        }}
                      ></span>
                      <span className="text-dgrey1 font-light">
                        {" "}
                        {num_prods}
                      </span>{" "}
                    </span>
                  </span>
                  <span className="text-dgrey1 text-left  capitalize text-sm">
                    {types[type]}
                  </span>
                </Link>
              ))}
          </div>
        ) : results.length === 0 &&
          viewResults &&
          (trendingSearch.length > 0 || searchHistory.length > 0) ? (
          <div className="hidden xl:block lg:block absolute top-10 w-4/5  border-2 border-dgrey border-t-0 z-50 bg-white  text-dblack rounded rounded-tl-none rounded-tr-none">
            {searchHistory.length > 0 && (
              <div className="px-4 py-2 trash-icon">
                <div className="flex items-center justify-between gap-2 py-2 ">
                  <div className="pr-semibold text-d18">Recently Searched</div>

                  {trash ? (
                    <BsTrash
                      className="w-4 h-4 text-dgrey1 cursor-pointer "
                      onClick={() => setTrash(false)}
                    />
                  ) : (
                    <div className="flex items-center text-sm gap-4 pr-light">
                      <div
                        className="cursor-pointer"
                        onClick={() => clearAllHistory()}
                      >
                        Clear All
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={() => setTrash(true)}
                      >
                        Done
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((history, index) => (
                    <Link
                      href={`${path}/search?keyword=${history}`}
                      key={index}
                      className="bg-dsearchGrey  cursor-pointer relative"
                    >
                      <div
                        className="px-2.5 py-1"
                        dangerouslySetInnerHTML={{ __html: history }}
                        onClick={() => setOverlay(false)}
                      ></div>
                      {!trash && (
                        <AiFillCloseCircle
                          onClick={(e) => deleteHistoryItem(e, index)}
                          className="absolute text-dgreyQtyProduct w-5 h-4 -top-1 -right-1"
                        />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {trendingSearch.length > 0 && !trendingLoading ? (
              <div className="px-4 py-2">
                <div className="flex items-center gap-2 pr-semibold text-d18 py-2">
                  Trending <BsFire className="text-dbase" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearch.map((search, index) => (
                    <Link
                      href={`${path}/search?keyword=${search.keyphrase}`}
                      key={index}
                      className="bg-dsearchGrey px-2.5 py-1 cursor-pointer"
                    >
                      {search.keyphrase}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="px-4 py-2">
                <div className="flex items-center gap-2 pr-semibold text-d18 py-2">
                  Trending <BsFire className="text-dbase" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-dsearchGrey px-7 py-4 cursor-pointer"></div>
                  <div className="bg-dsearchGrey px-7 py-4 cursor-pointer"></div>
                  <div className="bg-dsearchGrey px-7 py-4 cursor-pointer"></div>
                  <div className="bg-dsearchGrey px-7 py-4 cursor-pointer"></div>
                  <div className="bg-dsearchGrey px-7 py-4 cursor-pointer"></div>
                  <div className="bg-dsearchGrey px-7 py-4 cursor-pointer"></div>
                  <div className="bg-dsearchGrey px-7 py-4 cursor-pointer"></div>
                  <div className="bg-dsearchGrey px-7 py-4 cursor-pointer"></div>
                  <div className="bg-dsearchGrey px-7 py-4 cursor-pointer"></div>
                  <div className="bg-dsearchGrey px-7 py-4 cursor-pointer"></div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default TopSearch;

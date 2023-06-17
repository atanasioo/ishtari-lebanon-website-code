import { axiosServer } from "@/axiosServer";
import { useRouter } from "next/router";
import React  from "react";
import { useContext, useEffect, useState, useRef } from "react";
import buildLink, {path} from "@/urls";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { BsSearch } from "react-icons/bs";
import { sanitizeHTML } from "@/components/Utils";

import {sellerImage}  from "/public/images/shop-svgrepo-com.svg";
import {brandImage}  from "/public/images/brand-svgrepo-com.svg";

function TopSearch() {
  const wrapperRef = useRef(null);
const [query, setQuery] = useState("");
const [overlay, setOverlay] = useState(false);
const [results, setResults] = useState([]);
const [viewResults, setViewResults] = useState(false);
const [showSearch, setShowSearch] = useState(false);
const [loading, setLoading] = useState(false);
useOutsideAlerter(wrapperRef);
const router  = useRouter()
useEffect(() => {
  setResults([]);
  setViewResults(false);
  setShowSearch(false);
}, [router]);

const types = {
  1: "product",
  2: "category",
  3: "manufacturer",
  4: "seller",
};


function useOutsideAlerter(ref) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */

    if (overlay) {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setTimeout(() => setOverlay(false), 200);
          setTimeout(() => setViewResults(false), 200);
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
    if (e.keyCode === 13) {
      const query = e.target.value;
      setQuery("");
      setLoading(false);
      router.push({
        pathname: "/search",
        search: "?keyword=" + query,
        state: location.pathname,
      });
    }
  }

  function handleOverlay(e) {
    if (e.keyCode === 13) {
      setOverlay(false);
    }
  }

  function handleSearchResults() {
    const input = document.getElementById("searchInput").value;
    if (input === "") {
      setViewResults(false);
      setLoading(false);
    } else {
      setViewResults(true);
    }
  }

  useEffect(() => {
    // const source = axios.CancelToken.source();
    async function search() {
      setLoading(true);
      const res = await axiosServer.get(
        buildLink("search", undefined, window.innerWidth) + query
      );
      try {
        setResults(!res?.data?.message && res?.data?.data);
        // setMessage(res?.data?.message);
        setLoading(false);
        setViewResults(true);
        setOverlay(true);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.error("axios error", error.message);
        } else {
          console.error(error);
        }
      }
    }
    if (query.length > 1) {
      search();
    } else {
      setLoading(false);
    }

    // return () => source.cancel("Previous request is canceled");
  }, [query]);

  return (
    <>
       {overlay && (
        <div
          className="absolute z-50  bg-dblackk opacity-50 min-h-screen min-w-full min-w-screen left-0 top-32 mt-1 hidden mobile:block "
          style={{ height: "1400px" }}
        ></div>
      )}
      <div className="relative flex justify-center lg:flex-grow">
   
        <input
          type={"text"}
          placeholder={"What are you looking for?"}
          autoComplete="off"
          className="hidden lg:block rounded-sm h-11  w-11/12  outline-none p-4 bg-dsearchGrey "
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
          {/* Results */}
          {results.length > 0 && viewResults && (
          <div
            onMouseLeave={() => {
              setViewResults(false);
              setOverlay(false);
            }}
            onClick={() => setOverlay(false)}
            className="hidden xl:block lg:block absolute top-10 w-11/12  border-2 border-dgrey border-t-0 z-50 bg-white  text-dblack rounded rounded-tl-none rounded-tr-none"
          >
            {results.length > 0 &&
              results.slice(0, 8).map(({ type, id, value, img, num_prods }) => (
                <Link
                  key={Math.random()}
                  className="px-4 py-2 cursor-pointer hover:bg-dgrey flex items-center "
                  href={
                    isNaN(type)
                      //? "search?keyword=" + value
                      ? `${path}/search?keyword=${value}`
                      : 
                      // state.admin
                      // ? `${path}/${types[type]}/${id}`
                      // : 
                      `${path}/${value
                          .replaceAll("/", "-").replaceAll('%',parseInt("%"))
                          .replaceAll("%20", "-")}/${types[type]?.slice(
                          0,
                          1
                        )}=${id}`
                  }
                >
                  <span className="flex w-full items-center align-middle  h-auto my-2 px-1 ">
                    <span class="w-12 ">
                      {img.length > 0 ? (
                        <img
                          onError={(event) => (event.target.src = sq)}
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
                            types[type] === "seller" ? sellerImage : brandImage
                          }
                          alt=""
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
        )}
      </div>
    </>
  );
}

export default TopSearch;

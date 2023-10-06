import { axiosServer } from "@/axiosServer";
import PointsLoader from "@/components/PointsLoader";
import UserSidebar from "@/components/account/UserSidebar";
import UserSidebarMobile from "@/components/account/UserSidebarMobile";
import useDeviceSize from "@/components/useDeviceSize";
import buildLink from "@/urls";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BsChevronLeft, BsChevronRight, BsPlus } from "react-icons/bs";
import ReactPaginate from "react-paginate";

function index() {
  const [width] = useDeviceSize();
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(router.query.page || 1);
  const [deleteMsg, setDeleteMsg] = useState("");
  const [deleteErr, setDeleteErr] = useState("");
  const path = "";

  useEffect(() => {
    setLoading(true);
    axiosServer
      .get(buildLink("suggestion", undefined, undefined) + `&page=${page}`)
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          setData(response.data.data);
        }
        setLoading(false);
      });
  }, [page]);

  const handlePageClick = (event) => {
    const new_page = parseInt(event.selected) + 1;
    const query = { ...router.query };

    query.page = new_page;

    setPage(new_page);

    router.push({
      pathname: router.pathname,
      query,
    });
  };

  return (
    <div>
      <div className="flex-row md:flex">
        <div className="w-full mb-3 md:w-1/5">
          {width > 650 ? (
            <UserSidebar active={"suggestion"} />
          ) : (
            <UserSidebarMobile active={"suggestion"} />
          )}
        </div>
        <div className="w-full md:w-4/5 px-2 md:px-0  mb-5 relative">
          <div>
            {/* banner */}

            <div className="relative  justify-center hidden mobile:flex">
              <Image
                src={"/images/cutomer-suggestion.png"}
                width={1220}
                height={320}
              />
              <Link
                href={"/account/suggestion/add"}
                className="absolute z-10 flex items-center gap-1 hover:text-dbase transition-all duration-300 bg-white border border-dgreyZoom text-dblack text-sm shadow-md px-4 py-1.5 rounded-md -bottom-4 cursor-pointer"
              >
                Add New Suggestion <BsPlus className="w-5 h-5" />
              </Link>
            </div>
            <div className="mobile:hidden">
              <Image src={"/images/sugg-mobile.png"} width={359} height={323} />
            </div>
            {loading ? (
              <div className="h-screen">
                <PointsLoader />
              </div>
              
            ) : (
              <div className="bg-white">
                {data?.suggestions?.map((sugg) => (
                  <div
                    className="mb-5 border-b-2 border-dinputBorder mx-2 md:mx-5"
                    key={sugg.customer_suggestion_ID}
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center gap-6">
                        <div>
                          {sugg?.images.length > 0 ? (
                            <Image
                              src={sugg?.images[0]}
                              width={100}
                              height={100}
                              alt={"suggestion image"}
                            />
                          ) : (
                            <div className="w-[100px] h-[100px]"></div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <div>{sugg.name}</div>
                          <div className="pr-light text-light">
                            {sugg.status}
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`${path}/account/suggestion/${sugg.customer_suggestion_ID}/edit`}
                        className="flex items-center text-dgreyAddress text-sm md:mr-5 gap-1.5 cursor-pointer"
                      >
                        <div>Edit</div>
                        <BsChevronRight />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mobile:hidden fixed z-10 bottom-2 left-0 right-0 mx-auto w-3/4 bg-white border border-dgrey1 text-center text-dblack text-sm shadow-md px-4 py-1.5 rounded-md  cursor-pointer">
            <Link href={"/account/suggestion/add"}>ADD NEW SUGGESTION</Link>
          </div>

          {data.totalpages > 1 && (
            <div className="h-12">
              <ReactPaginate
                className={"category-pagination"}
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={width < 650 ? 1 : 2}
                marginPagesDisplayed={width < 650 ? 1 : 2}
                pageCount={data?.totalpages}
                previousLabel="<"
                activeClassName={"active-pagination-category"}
                renderOnZeroPageCount={null}
                forcePage={
                  router.query.page ? parseInt(router.query.page) - 1 : 0
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default index;

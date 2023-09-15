import { axiosServer } from "@/axiosServer";
import buildLink from "@/urls";
import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import useDeviceSize from "@/components/useDeviceSize";
import UserSidebar from "@/components/account/UserSidebar";
import UserSidebarMobile from "@/components/account/UserSidebarMobile";
import { AccountContext } from "@/contexts/AccountContext";
import { useSession } from "next-auth/react";
export default function MenmberShip() {
  const [state, setState] = useState([]);
  const [width, height] = useDeviceSize();
  const [accountState] = useContext(AccountContext);
  const { data: session, status } = useSession();

  useEffect(() => {
    axiosServer
      .get(buildLink("memberShip") + "&page=1" + "&limit=12")
      .then((resp) => {
        setState(resp.data);
      });
  }, []);
  return (
    <div className="container">
      <div className="container text-dblack">
        <Head>
          <title>My Account | ishtari</title>
        </Head>
        <div className="pb-2">
          <div className="flex-row md:flex">
            <div className="w-full mb-3 md:w-1/5">
              {width > 650 ? (
                <UserSidebar active={"buyagain"} />
              ) : (
                <UserSidebarMobile active={"buyagain"} />
              )}
            </div>
            <div className="w-full">
              <div className=" bg-dbase text-white px-5 h-1/3">
                <p className="text-lg pr-semibold py-4 w-full">MemberShip </p>

                <div className="flex flex-row">
                  <div
                    className="rounded-full w-max p-5 pr-semibold bg-dgreySeller"
                    style={{ backgroundColor: "" }}
                  >
                    {session?.user?.firstname
                      ?.replace(/\s+/g, "")
                      .charAt(0)
                      .toUpperCase()}
                    {session?.user?.lastname
                      ?.replace(/\s+/g, "")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div className="text-white px-5">
                    {" "}
                    {session?.user?.firstname} {session?.user?.lastname}{" "}
                  </div>
                </div>
                {/* {total > 48 &&
              (width > 650 ? (
                <ReactPaginate
                  pageCount={Math.ceil(total / limit)}
                  containerClassName={"pagination"}
                  onPageChange={pageSetter}
                  pageRangeDisplayed={8}
                  marginPagesDisplayed={2}
                  previousLabel={"<"}
                  nextLabel={">"}
                  activeClassName={"active-pagination"}
                  forcePage={
                    page
                      ? parseInt(page) - 1
                      : 0
                  }
                ></ReactPaginate>
              ) : (
                <ReactPaginate
                  pageCount={Math.ceil(total / limit)}
                  containerClassName={"pagination"}
                  onPageChange={pageSetter}
                  pageRangeDisplayed={3}
                  marginPagesDisplayed={1}
                  previousLabel={"<"}
                  nextLabel={">"}
                  activeClassName={"active-pagination"}
                  forcePage={
                    page
                      ? parseInt(page) - 1
                      : 0
                  }
                ></ReactPaginate>
              ))} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

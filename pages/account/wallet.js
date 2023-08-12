import { axiosServer } from "@/axiosServer";
import UserSidebar from "@/components/account/UserSidebar";
import UserSidebarMobile from "@/components/account/UserSidebarMobile";
import PointsLoader from "@/components/PointsLoader";
import useDeviceSize from "@/components/useDeviceSize";
import { AccountContext } from "@/contexts/AccountContext";
import buildLink from "@/urls";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useContext, useEffect, useRef, useState } from "react";
import { FaWallet } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import ReactPaginate from "react-paginate";
import { authOptions } from "../api/auth/[...nextauth]";

function wallet() {
  const [width] = useDeviceSize();
  const [state] = useContext(AccountContext);
  const { data: session, status } = useSession();
  const [balance, setBalance] = useState(0);
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    axiosServer
      .get(buildLink("getBalance", undefined, window.innerWidth))
      .then((response) => {
        console.log("balance is ", response);
        if (response.data.success) {
          setBalance(response.data.data.balance);
        }
      });
  }, []);

  useEffect(() => {
    axiosServer
      .get(
        buildLink("getTransactionHistory", undefined, window.innerWidth) +
          "&limit=" +
          limit +
          "&page=" +
          page
      )
      .then((response) => {
        console.log(response.data.data);
        if (response.data.success) {
          setTransactionData(response.data.data);
          setLoading(false);
        }
      });
  }, [page]);

  function pageSetter(page) {
    setPage(page["selected"] + 1);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="container text-dblack">
      <Head>
        <title>My Account | ishtari</title>
      </Head>
      <div className="pb-2">
        <div className="flex-row md:flex">
          <div className="w-full mb-3 md:w-1/5">
            {width > 650 ? (
              <UserSidebar active={"wallet"} />
            ) : (
              <UserSidebarMobile active={"wallet"} />
            )}
          </div>

          {loading ? (
            <div className="flex justify-center w-full">
              <PointsLoader />
            </div>
          ) : (
            <div className="w-full md:mx-auto">
              <div
                className="w-full h-56 md:h-44 flex flex-col gap-3 md:gap-0 md:flex-row justify-between items-start md:items-center p-5"
                style={{ backgroundColor: "#59acf4" }}
              >
                <div className="flex flex-col">
                  <div
                    className="rounded-full w-max p-5 pr-semibold"
                    style={{ backgroundColor: "#a8e8ff" }}
                  >
                    {session?.user?.firstname
                      .replace(/\s+/g, "")
                      .charAt(0)
                      .toUpperCase()}{" "}
                    {session?.user?.lastname
                      .replace(/\s+/g, "")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div className="text-white">
                    {" "}
                    {session?.user?.firstname} {session?.user?.lastname}{" "}
                  </div>
                </div>
                <div
                  className="flex justify-between items-center p-3 text-white w-full md:w-2/5 lg:w-1/3"
                  style={{ backgroundColor: "#ffffff4a" }}
                >
                  <div className="pr-semibold">
                    <div>Available balance:</div>
                    <div className="text-d20">{balance}</div>
                  </div>
                  <FaWallet className="w-6 h-6 md:w-8 md:h-8" />
                </div>
              </div>

              <div className="py-4">
                {transactionData?.data_transactions?.map((data) => (
                  <div
                    key={data.transaction_id}
                    className="bg-white rounded-md shadow-md mb-3 p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="rounded-full p-4 text-sm"
                          style={{ backgroundColor: "#a8e8ff" }}
                        >
                          {session?.user?.firstname
                            .replace(/\s+/g, "")
                            .charAt(0)
                            .toUpperCase()}{" "}
                          {session?.user?.lastname
                            .replace(/\s+/g, "")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div>
                          <div>
                            {" "}
                            {session?.user?.firstname} {session?.user?.lastname}{" "}
                          </div>
                          <div className="text-sm text-dgreyQtyProduct">
                            {data.date}
                          </div>
                        </div>
                      </div>
                      <div className="pr-semibold text-dgreyProduct">
                        {data.type}
                      </div>
                    </div>
                    <div>
                      Amount:{" "}
                      <span
                        className={` ${
                          data.isDeposit ? "text-dgreen" : "text-dbase"
                        }`}
                      >
                        {data.amount}
                      </span>{" "}
                    </div>
                    {data.description.length > 0 && (
                      <div>
                        Description:{" "}
                        <span className="text-dgreyProduct">
                          {data.description}
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                <div className="pagination-div pt-4">
                  {!loading && transactionData?.total_transactions > limit && (
                    <ReactPaginate
                      pageCount={Math.ceil(
                        transactionData?.total_transactions /
                          transactionData?.total_pages
                      )}
                      containerClassName={"category-pagination"}
                      onPageChange={pageSetter}
                      pageRangeDisplayed={width > 650 ? 2 : 1}
                      marginPagesDisplayed={width > 650 ? 1 : 1}
                      previousLabel={<IoIosArrowBack />}
                      previousLinkClassName={"arrowLink"}
                      nextLinkClassName={"arrowLink"}
                      nextLabel={<IoIosArrowForward />}
                      activeClassName={"active-pagination-category"}
                      forcePage={page - 1}
                    ></ReactPaginate>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default wallet;

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

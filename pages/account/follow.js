import { axiosServer } from "@/axiosServer";
import UserSidebar from "@/components/account/UserSidebar";
import UserSidebarMobile from "@/components/account/UserSidebarMobile";
import SingleProduct from "@/components/product/SingleProduct";
import useDeviceSize from "@/components/useDeviceSize";
import { AccountContext } from "@/contexts/AccountContext";
import buildLink from "@/urls";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Image from "next/image";
import PointsLoader from "@/components/PointsLoader";
import NotFound from "../404";
import NoData from "@/components/NoData";
import { slugify } from "@/components/Utils";
import Link from "next/link";
function Follow() {
  const router = useRouter();
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [showLimit, setShowLimit] = useState(false);
  const [limit, setLimit] = useState(48);
  const [mobileSort, showMobileSort] = useState(false);
  const [total, setTotal] = useState(0);
  const [state, dispatch] = useContext(AccountContext);
  const [loading, setLoading] = useState(true);
  const [width, height] = useDeviceSize();
  const [follow, setFollow] = useState(false);
  function pageSetter(page) {
    setPage(page["selected"] + 1);
    router.push(
      `/account/buyagain&page=${page["selected"] + 1}&limit=${limit}`
    );
  }

  function followAction(id) {
    if (!state.loged) {
      dispatch({ type: "setShowOver", payload: true });
      dispatch({ type: "setShowLogin", payload: true });
    }
    var obj = {
      type: "seller",
      type_id: id
    };

    axiosServer
      .post(
        buildLink("follow", undefined, undefined, window.location.host),
        obj
      )
      .then((resp) => {
        if (!resp.data.data.follow) {
          setFollow(true);
        }
      });
  }
  function limitSetter(lim) {
    setLimit(lim);
    history.push({
      pathname: "/account/buyagain",
      search: `&page=${page}&limit=${lim}`
    });
  }

  useEffect(() => {
    if (!state.loading && !state.loged) {
      router.push("/");
      setLoading(false);
    } else if (state.loged) {
      axiosServer
        .get(
          buildLink(
            "follow",
            undefined,
            window.innerWidth,
            window.location.host
          )
        )
        .then((response) => {
          if (response?.data?.success) {
            const data = response?.data;
            setData(data);
            setTotal(data?.length);
            setLoading(false);
            if (!state.loged) {
            }
          } else {
            setLoading(false);
          }
        });
    }
  }, [state, follow]);

  return (
    <div className="container text-dblack">
      <Head>
        <title>My Account | ishtari</title>
      </Head>
      <div className="pb-2">
        <div className="flex-row md:flex">
          <div className="w-full mb-3 md:w-1/5">
            {width > 650 ? (
              <UserSidebar active={"follow"} />
            ) : (
              <UserSidebarMobile active={"follow"} />
            )}
          </div>
          {loading ? (
            <div className="flex justify-center w-full">
              <PointsLoader />
            </div>
          ) : (
            <div className="w-full px-2 md:w-4/5 md:pl-8 mb-8">
              <div className="flex justify-between">
                <p className="text-lg pr-semibold py-4">Following </p>
              </div>
              {!data?.data?.followed && <NoData />}
              {data?.data?.followed && (
                <div className="flex flex-col grid-3">
                  {data?.data?.followed?.map((item) => (
                    <div className=" w-full  flex flex-row justify-between items-center bg-white p-5 text-d14 mobile:text-d16 my-1">
                      {" "}
                      <Link href={'/' + slugify(item.name) + '/s=' +item.seller_id}>
                      <div className="flex justify-center items-center">
                        <div className=" border rounded-full flex justify-center items-center p-4 w-16 h-16   border-dgrey1 border-opacity-50 font-semibold text-d18">
                          {item.image ? (
                            <Image src={item.image} width="100" height="100" />
                          ) : (
                            "S"
                          )}
                        </div>{" "}
                        <div className="mx-5 uppercase">{item.name}</div>
                      </div>
                      </Link>
                      <div
                        className="flex justify-center bg-dbase pr-semibold text-white px-4  rounded-full items-center h-10 cursor-pointer"
                        onClick={() => followAction(item?.seller_id)}
                      >
                        following
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {data?.data?.followed && (
                <div className="w-full mt-5 py-5 text-d28">Products</div>
              )}
              <div className="grid grid-cols-2  lg:grid-cols-6 gap-2 ">
                {data?.data?.products?.map((item) => (
                  <SingleProduct item={item} key={item.product_id} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Follow;

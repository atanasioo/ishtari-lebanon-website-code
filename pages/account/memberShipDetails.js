import { axiosServer } from "@/axiosServer";
import buildLink from "@/urls";
import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import useDeviceSize from "@/components/useDeviceSize";
import UserSidebar from "@/components/account/UserSidebar";
import UserSidebarMobile from "@/components/account/UserSidebarMobile";
import { AccountContext } from "@/contexts/AccountContext";
import { useSession } from "next-auth/react";
import { AiOutlineLeft, AiOutlineStar } from "react-icons/ai";
import { useRouter } from "next/router";

import PointsLoader from "@/components/PointsLoader";

export default function MenmberShip() {
  const [state, setState] = useState([]);
  const [width, height] = useDeviceSize();
  const [accountState] = useContext(AccountContext);
  const [totalPage, setTotalPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(0);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosServer
      .get(buildLink("memberShip") + "&page=" + page + "&limit=" + limit)
      .then((resp) => {
        console.log(resp.data);
        setState(resp.data);
        setTotalPage(resp.data.data?.suggestions?.total_pages);
      
        if (!accountState.loged) {
          router.push("/");
        }
        setLoading(false)
        
      });
  }, [page]);

  function goTo() {
    router.push("/account/memberShip");
  }

  function pageSetter(page) {
    setPage(page["selected"] + 1);
    router.push(
      `/account/memberShip?&page=${page["selected"] + 1}&limit=${limit}`
    );
  }
  return (
    <div className="mobilecontainer mobile:overflow-hidden">
      <div className=" text-dblack">
        <Head>
          <title>My Account | ishtari</title>
        </Head>
        <div className="containerpb-2">
          <div className="flex-row md:flex">
            <div className="w-full mb-3 md:w-1/5">
              {width > 650 ? (
                <UserSidebar active={"memberShip"} />
              ) : (
                <UserSidebarMobile active={"memberShip"} />
              )}
            </div>
            {loading ? (
            <div className="flex justify-center w-full">
              <PointsLoader />
            </div>
          ) : (
            <div className="w-full h-full">
              <div
                className=" text-white px-5 h-1/3"
                style={{
                  backgroundColor: "#f5f5f1",
                  backgroundImage:
                    "linear-gradient(215deg, #f5f5f1 -50%, #e50914 90%)"
                }}
              >
                <p
                  className="flex items-center text-lg pr-semibold py-4 w-full"
                  onClick={goTo}
                >
                  {" "}
                  <AiOutlineLeft className="mx-2" /> MemberShip{" "}
                </p>

                <div className="flex flex-row pb-7 relative">
                  <div className="flex flex-col px-5 w-full">
                    <div className=" text-center  text-dblack pl-5 text-2xl space-x-2  w-full">
                      {state.data.current_points.toFixed(1)}
                    </div>

                    <div className="flex mt-2 px-12 pb-3">
                      <div className="h-1 w-full bg-dTransparentWhite1 mt-2">
                        <div
                          className="h-1 bg-white"
                          style={{
                            width: state?.data?.current_point_precentage + "%"
                          }}
                        ></div>
                      </div>
                    
                    </div>
                  </div>
                  <div className="flex-col starts-div absolute z-10 rounded-lg bg-white text-dgreyProduct text-sm md:text-d14 shadow-md  px-6 py-1.5 -bottom-10 w-full">
                    <div>My Points</div>
                    <div className="flex justify-between w-full mt-2 ">
                      <div className="">Last month</div>{" "}
                      <div className="">
                        {state?.data?.points_earned_last_month}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-xl  text-dblackOverlay3 opacity-80  px-2 mt-16">
                My Points
              </div>
              <div className=" mobile:grid grid-cols-1 min-h-max  px-2">
                {state?.data?.point_ranges?.map((p) => (
                  <div className="flex justify-between my-2 bg-white px-3">
                    <div className="flex items-center">
                      <AiOutlineStar
                        className={"w-5"}
                        style={{
                          color: p.title.includes("Platinum")
                            ? "E5E4E2"
                            : p.title.includes("Diamond")
                            ? "B9ECFC"
                            : p.title.replace(" Member", "")
                        }}
                      />{" "}
                      <span className="pl-2">{p.title}</span>
                    </div>
                    {p.start==1500 ? 
                    <div className="flex-col p-5  text-l">
                     { ">= " +p.start  } 
                  </div>
                  :
                    <div className="flex-col p-5  text-l">
                      {p.start}-{p.end}
                    </div>
}
                  </div>
                ))}
              </div>
            </div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

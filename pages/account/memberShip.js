import { axiosServer } from "@/axiosServer";
import buildLink from "@/urls";
import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import useDeviceSize from "@/components/useDeviceSize";
import UserSidebar from "@/components/account/UserSidebar";
import UserSidebarMobile from "@/components/account/UserSidebarMobile";
import { AccountContext } from "@/contexts/AccountContext";
import { useSession } from "next-auth/react";
import { AiOutlineRight, AiOutlineStar } from "react-icons/ai";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import Link from "next/link";
import { slugify } from "@/components/Utils";
import { BiArrowToRight } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import Image from "next/legacy/image";

export default function MenmberShip() {
  const [state, setState] = useState([]);
  const [width, height] = useDeviceSize();
  const [accountState] = useContext(AccountContext);
  const { data: session, status } = useSession();
  const[totalPage, setTotalPage]=useState(0)
  const[limit, setLimit]=useState(20)
  const[page, setPage]=useState(0)
 const router =useRouter()
  useEffect(() => {
    axiosServer
      .get(buildLink("memberShip") + "&page="+page + "&limit="+limit)
      .then((resp) => {
        console.log(resp.data);
        setState(resp.data);
        setTotalPage(resp.data.data?.suggestions?.total_pages)
      });
  }, [page]);

  function goTo(){
    router.push('/account/memberShipDetails')
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
                <UserSidebar active={"buyagain"} />
              ) : (
                <UserSidebarMobile active={"buyagain"} />
              )}
            </div>
            <div className="w-full h-full">
              <div
                className=" text-white px-5 h-1/3"
                style={{
                  backgroundColor: "#f5f5f1",
                  backgroundImage:
                    "linear-gradient(215deg, #f5f5f1 -50%, #e50914 90%)"
                }}
              >
                <p className="text-lg pr-semibold py-4 w-full">MemberShip </p>

                <div className="flex flex-row pb-7 relative">
                  <div
                    className="rounded-full w-28 h-22 mobile:w-1/12 mobile:h-auto text-4xl h-mino-8 pr-semibold border-4 border-white text-dblack  flex  justify-center align-middle items-center uppercase opacity-90"
                    // style={{ backgroundColor: state?.data?.current_level }}

                    style={{
                      backgroundColor: state?.data?.current_level,
                      backgroundImage:
                        "linear-gradient(180deg, " + `${state?.data?.current_level}`+ " 50%, white 100%)"
                    }}
                  >
                    {session?.user?.firstname
                      ?.replace(/\s+/g, "")
                      .charAt(0)
                      .toUpperCase() ||
                      accountState?.firstname
                        ?.replace(/\s+/g, "")
                        .charAt(0)
                        .toUpperCase()}
                  </div>
                  <div className="flex flex-col px-5 w-full">
                    <div className="flex">
                      <div className="flex text-white text-d18 font-extrabold first-letter:uppercase">
                        {" "}
                        <span className=" first-letter:uppercase">
                          {" "}
                          {session?.user?.firstname ||
                            accountState?.firstname}{" "}
                        </span>
                        <span className="pl-1 first-letter:uppercase">
                          {" "}
                          {session?.user?.lastname ||
                            accountState.lastname}{" "}
                        </span>
                      </div>
                      <div className="flex text-dblack pl-5 text-d12 space-x-2 mt-1">
                        <AiOutlineStar className="mt-0.5 mr-1" />{" "}
                        {state?.data?.current_level} Member
                      </div>
                    </div>
                    <div className="flex mt-2">
                      <div className="h-1 w-full bg-dTransparentWhite1 mt-2">
                        <div
                          className="h-1 bg-white"
                          style={{ width: state?.data?.current_point_precentage+ "%" }}
                        ></div>
                      </div>
                      <div className="px-5 text-d14">{state?.data?.current_point_precentage}%</div>
                    </div>
                    <div className="text-d14 ">
                      Earn {state?.points_earned_last_month || 'zero'} more points to
                      become a Gold Member
                    </div>
                  </div>
                  <div onClick={goTo} className="flex  justify-between starts-div absolute z-10 rounded-lg bg-white text-dgreyProduct text-sm md:text-d14 shadow-md  px-6 py-1.5 -bottom-10 w-full">
                    <div className="flex-col">
                      <div>{state?.data?.current_level} Member</div>
                      <div>Rewards</div>

                    </div>
                    <div className="flex align-middle items-center"><AiOutlineRight className="text-d20" /><AiOutlineRight className="text-d20" /></div>
                  </div>

                </div>
                 

              </div>
                <div className="text-xl  text-dblackOverlay3 opacity-80  px-2 mt-16">Hot picks for you</div>
              <div className=" mobile:grid grid-cols-2 min-h-max  px-2">
                {state?.data?.suggestions?.products.map((p) => (
                  <Link href={"/"+ slugify(p.name) + "/p="+p.product_id}>
                  <div className="flex my-2 bg-white">

                    <div className=" w-24">
                      <Image src={p.mobile_image} widt={59} height={80} />
                    </div>
                    <div className="flex-col p-5  text-l">
                      <div>{p.name}</div>
                      <div className="text-l">
                        {p.special ? p.special : p.price}
                      </div>
                      <div className=" text-dmenusepaalbeit">
                        {p.saving}% OFF
                      </div>
                    </div>
                  </div>
                  </Link>
                ))}


              </div>

              {totalPage > 48 &&
         
         <ReactPaginate
           pageCount={Math.ceil(totalPage / limit)}
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

       }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

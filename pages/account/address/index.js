import { axiosServer } from "@/axiosServer";
import UserSidebar from "@/components/account/UserSidebar";
import UserSidebarMobile from "@/components/account/UserSidebarMobile";
import PointsLoader from "@/components/PointsLoader";
import useDeviceSize from "@/components/useDeviceSize";
import { AccountContext } from "@/contexts/AccountContext";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import buildLink from "@/urls";
import { getServerSession } from "next-auth";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import cookie from "cookie";
import { getHost } from "@/functions";


function Adresses() {
  const [width, height] = useDeviceSize();
  const [state, dispatch] = useContext(AccountContext);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState([]);
  const path = "";
const router = useRouter()
  useEffect(() => {
    axiosServer
      .get(buildLink("address", undefined, window.innerWidth))
      .then((response) => {
        if (response.status) {
          setAddresses(response.data.data);
          setLoading(false);
          if (!state.loged) {
            router.push({
              pathname: "/",
            });
          }
        } else {
          dispatch({ type: "setLoading", payload: false });
          if (!state.loading && !state.loged) {
            router.push({
              pathname: "/",
            });
          }
        }
      });
  }, [dispatch, state.loged, router]);

  //delete address
  function deleteAddress(address_id) {
    if (addresses.length !== 1) {
      axiosServer
        .delete(
          buildLink("address", undefined, window.innerWidth) +
            "&address_id=" +
            address_id
        )
        .then((response) => {
          setAddresses(addresses.filter((a) => a.address_id !== address_id));
        });
    }
  }

  return (
    <div className="container text-dblack">
      <Head>
        <title>My Account | ishtari</title>
      </Head>
      <div>
        <div className="flex-row md:flex">
          <div className="w-full mb-3 md:w-1/5">
            {width > 650 ? (
              <UserSidebar active={"addresses"} />
            ) : (
              <UserSidebarMobile active={"addresses"} />
            )}
          </div>
          <div className="w-full md:w-4/5 px-2 md:px-0 md:pl-8 mb-5">

            <div className="lg:p-6">
              <div className="address-header ">
                <div className="header-content mb-8">
                  <p className="pr-bold text-d28">Addresses</p>
                  <p style={{ color: "rgb(126, 133, 155)" }}>
                    Manage your saved addresses for fast and easy checkout
                    across our marketplaces
                  </p>
                </div>
                <Link
                  href={"/account/address/add"}
                  className="new-addr-btn rounded-md px-8 py-3.5 uppercase relative pr-bold  bg-dblueHover text-white"
                >
                  ADD NEW ADDRESS
                </Link>
              </div>

              {loading ? (
                <PointsLoader />
              ) : addresses?.length === 0 ? (
                <div>No Addresses</div>
              ) : (
                addresses?.map((address) => (
                  <div
                    className="p-8 mobile:flex mobile:justify-between bg-white mt-10"
                    key={address.address_id}
                  >
                    <div>
                      <div className="flex gap-4 mb-5">
                        <div className="text-d18 capitalize pr-bold ">
                          {address.zone}
                        </div>
                      </div>
                      <div className="">
                        <div className="flex ">
                          <span className="lg:w-28 text-dgreyAddress">
                            First Name:
                          </span>
                          <div>{address.firstname}</div>
                        </div>
                        <div className="flex mt-3 ">
                          <span className="lg:w-28 text-dgreyAddress">
                            Last Name:
                          </span>
                          <div>{address.lastname}</div>
                        </div>
                        <div className="flex mt-3 ">
                          <span className="lg:w-28 text-dgreyAddress">
                            Address:
                          </span>
                          <div>{address.address_1}</div>
                        </div>
                        <div className="flex mt-3 ">
                          <span className="lg:w-28 text-dgreyAddress">
                            Telephone:
                          </span>
                          <div>{address.telephone}</div>
                        </div>
                        {window.config["useTown"] && (
                          <div className="flex mt-3">
                            <span className="lg:w-28 text-dgreyAddress">
                              Town:{" "}
                            </span>
                            <div className="font-semibold">
                              {address.town_name}
                            </div>
                          </div>
                        )}
                        <div className="mobile:hidden border-t border-dgreyZoom mt-6 pt-4 flex gap-6">
                          <button
                            className="text-dgreyAddress underline cursor-pointer"
                            onClick={() => deleteAddress(address?.address_id)}
                          >
                            Delete
                          </button>
                          <Link
                            href={`${path}/account/address/${address.address_id}/edit`}
                            className="text-dgreyAddress underline cursor-pointer"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="hidden mobile:block">
                      <div className="flex items-center gap-6">
                        <button
                          className="text-dgreyAddress underline cursor-pointer"
                          onClick={() => deleteAddress(address?.address_id)}
                        >
                          Delete
                        </button>
                        <Link
                          href={`${path}/account/address/${address.address_id}/edit`}
                          className="text-dgreyAddress underline cursor-pointer"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Adresses;

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const { req } = context;

  if (!session) {
    //check whether the user is logged using facebook login

    var site_host = "";
    let host_url = "";

    const host = req.headers.host;

    let token = "";

    const cookies = req?.headers.cookie || "";
    if (typeof cookies !== "undefined" && cookies !== "") {
      const parsedCookies = cookie?.parse(cookies);
      site_host = parsedCookies["site-local-name"];
      token = parsedCookies["api-token"];

      if (typeof site_host === "undefined") {
        site_host = host;
      }
    }

    host_url = await getHost(site_host);
    try {
      const response = await axiosServer.get(
        buildLink("login", undefined, undefined, host_url),
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log(response.data);
      if (response.data.customer_id === 0) {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
    } catch(error) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  }

  return {
    props: {},
  };
}

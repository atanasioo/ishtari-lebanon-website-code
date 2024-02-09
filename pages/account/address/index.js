import { axiosServer } from "@/axiosServer";
import UserSidebar from "@/components/account/UserSidebar";
import UserSidebarMobile from "@/components/account/UserSidebarMobile";
import AdressCard from "@/components/adressCard";
import PointsLoader from "@/components/PointsLoader";
import useDeviceSize from "@/components/useDeviceSize";
import { AccountContext } from "@/contexts/AccountContext";
import buildLink from "@/urls";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { FaSms } from "react-icons/fa";

function Adresses() {
  const [width, height] = useDeviceSize();
  const [state, dispatch] = useContext(AccountContext);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const path = "";
  const router = useRouter();
  useEffect(() => {
    if (!state.loading && !state.loged) {
      router.push({
        pathname: "/",
      });
    } else if (state.loged) {
    getAdress();
    }
  }, [dispatch, state.loading, router]);



 async function getAdress(){
   await axiosServer
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
  }




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
              </div>
              <div className=" w-full container flex justify-center items-center">
                <Link
                  href={"/account/address/add"}
                  className="new-addr-btn rounded-md px-20 py-2 uppercase relative pr-bold bg-dblueHover text-white"
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
                  <AdressCard getAdress={getAdress} address={address} deleteAddress={deleteAddress} />
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

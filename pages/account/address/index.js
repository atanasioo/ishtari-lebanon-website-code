import UserSidebar from "@/components/account/UserSidebar";
import UserSidebarMobile from "@/components/account/UserSidebarMobile";
import useDeviceSize from "@/components/useDeviceSize";
import React from "react";

function AddAdress() {
  const [width, height] = useDeviceSize();
  return (
    <div className="container text-dblack">
      <div>
        <div className="flex-row md:flex">
          <div className="w-full mb-3 md:w-1/5">
            {width > 650 ? (
              <UserSidebar active={"addresses"} />
            ) : (
              <UserSidebarMobile active={"addresses"} />
            )}
          </div>
          <div className="w-full">
            <div className="lg:p-6">
              <div className="address-header ">
                <div className="header-content mb-4">
                  <p className="pr-bold text-d28">Addresses</p>
                  <p style={{ color: "rgb(126, 133, 155)" }}>
                    Manage your saved addresses for fast and easy checkout
                    across our marketplaces
                  </p>
                </div>
                <button className="new-addr-btn rounded-md px-8 uppercase relative pr-bold h-12 bg-dblueHover text-white">
                  ADD NEW ADDRESS
                </button>
              </div>
              <div className="p-8 flex justify-between bg-white mt-10 ">
                <div>
                  <div className="flex gap-4 mb-5">
                    <div className="text-d18 capitalize pr-bold ">
                      zone here
                    </div>
                  </div>
                  <div className="">
                    <div className="flex ">
                      <span
                        className="lg:w-28 text-dgreyAddress"
                      >
                        First Name:
                      </span>
                      <div>fatima</div>
                    </div>
                    <div className="flex mt-3 ">
                      <span
                        className="lg:w-28 text-dgreyAddress"
                      >
                        Last Name:
                      </span>
                      <div>Hasan</div>
                    </div>
                    <div className="flex mt-3 ">
                      <span
                        className="lg:w-28 text-dgreyAddress"
                      >
                        Address:
                      </span>
                      <div>test test</div>
                    </div>
                    <div className="flex mt-3 ">
                      <span
                        className="lg:w-28 text-dgreyAddress"
                      >
                        Teleohone:
                      </span>
                      <div>+96178865036</div>
                    </div>
                  </div>
                </div>
                <div>
                    <div className="flex items-center gap-6">
                        <button className="text-dgreyAddress underline cursor-pointer">Delete</button>
                        <button className="text-dgreyAddress underline cursor-pointer">Edit</button>
                    </div> 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddAdress;

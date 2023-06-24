import React, { useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { axiosServer } from "@/axiosServer";
import SellerHeader from "@/components/seller/SellerHeader";
import useDeviceSize from "@/components/useDeviceSize";
import { FaPen } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSellerContext } from "@/contexts/SellerContext";
import buildLink from "@/urls";
const EditSeller = () => {
  const { width } = useDeviceSize();
  const [data, setData] = useState();
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(
    "https://www.ishtari.com/image/cache/default-100x100.jpg?18"
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [thumb, setThumb] = useState("");
  const { toggle } = useSellerContext();
  const router = useRouter();
// const toggle = false
  useEffect(() => {
    setLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    axiosServer
      .get(
        buildLink("seller_profile")
      )
      .then((response) => {
        setData(response.data.data);
        setFirstName(response.data.data.seller_firstname);
        setLastName(response.data.data.seller_lastname);
        setPhone(response.data.data.seller_telephone);
        setProfileImage(
          response.data.data.image
            ? response.data.data.image
            : "https://www.ishtari.com/image/cache/default-100x100.jpg?18"
        );
        setThumb(response.data.data.thumb ? response.data.data.thumb : "");
        setLoading(false);
      });
  }, []);

  function toggleMenuu() {
    setShowMenu(!showMenu);
  }

  function submit() {
    var formData = new FormData(); // Currently empty
    formData.append("firstname", firstName);
    formData.append(
      "image",
      typeof profileImage === "object" ? profileImage : thumb
    );
    formData.append("lastname", lastName);
    formData.append("telephone", phone);

    const obj = {
      image: profileImage,
      firstname: firstName,
      lastname: lastName,
      telephone: phone,
    };
    _axios
      .post(
        `https://www.ishtari.com/motor/v2/index.php?route=seller_report/profile/edit`,
        formData
      )
      .then((response) => {
        //  console.log(response.data);
        if (response.data.success) {
          router.push("/seller_report/home");
        }
      });
  }

  function deleteImage() {
    setThumb("data/default.jpg");
    setProfileImage(
      "https://www.ishtari.com/image/cache/default-100x100.jpg?18"
    );
  }

  return data ? (
    <div className="absolute top-0 left-0 right-0 w-full h-full bg-slate200">
      <div
        className={`flex-auto min-w-0 flexflex-col aside-animation ${
          toggle ? "pl-64" : width < 1025 ? "pl-0" : "pl-20"
        } max-w-full box-border`}
      >
        <SellerHeader showMenu={showMenu} toggleMenuu={toggleMenuu} />

        <div className="flex flex-col pt-0 pb-10  bg-slate200">
          <div className="px-3.5 flex items-center py-4">
            <p className="text-lg ml-3 ">Profile</p>
            <Link
              href={`/seller_report/home`}
              className={`pl-1 ml-3  text-dgrey1 hover:text-dblue`}
            >
              <AiOutlineHome />
            </Link>
            <span className="seller-dot  p-2"></span>
            <Link
              href={`/seller_report/home`}
              className="font-medium text-sm"
              style={{ color: "#959cb6" }}
            >
              Dashboard
            </Link>
            <span className="seller-dot  p-2"></span>

            <p className="text-dblue text-sm">Profile</p>
          </div>
          <div className="w-full px-6 box-border">
            <div className="box-border">
              <div className="transition-opacity block box-border">
                <div className="orders-table items-stretch justify-between relative  px-0 py-25 border-b-1 border-borderbottom bg-white">
                  <div className="border-b flex justify-between items-center border-dinputBorder p-4">
                    <span
                      className={`flex ${
                        width > 768 ? "flex-row" : "flex-col"
                      } gap-2 px-2`}
                    >
                      <h3 className="font-medium text-xl items-center">
                        {" "}
                        Personal Information
                      </h3>{" "}
                      <div
                        className="text-center flex items-center font-light text-sm"
                        style={{ color: "#959cb6" }}
                      >
                        update your personal informaiton
                      </div>
                    </span>{" "}
                  </div>
                  <div className=" flex flex-col px-2 mt-2 rounded box-border overflow-auto ">
                    <div className="table-wrapper">
                      <div className="flex flex-wrap box-border pb-3">
                        {!loading ? (
                          <form
                            className="w-full"
                            onSubmit={(e) => {
                              e.preventDefault();
                            }}
                          >
                            <div
                              className={`flex flex-col w-full rounded ${
                                width > 768 ? "p-6" : "p-2"
                              } `}
                            >
                              <div className="m-0 p-0">
                                <div className="mb-10">
                                  {" "}
                                  <div className="box-border w-full">
                                    <h3
                                      className="text-base font-medium block "
                                      style={{ color: "#48465b" }}
                                    >
                                      Seller Info :
                                    </h3>

                                    {/* IMAGE */}
                                    <div
                                      className={`grid ${
                                        width > 768
                                          ? "grid-cols-3"
                                          : "grid-cols-1"
                                      } my-4 w-10/12`}
                                    >
                                      <label
                                        className={`${
                                          width > 768
                                            ? "text-right p-1"
                                            : "text-left"
                                        } font-normal  w-full text-sm`}
                                        style={{
                                          color: "#959cb6",
                                          // maxWidth: "25%",
                                        }}
                                      >
                                        Profile Image:
                                      </label>
                                      <div className="ml-4 ">
                                        <img
                                          className="w-32 h-32 rounded p-1 "
                                          style={{
                                            border: "1px solid #dee2e6",
                                          }}
                                          src={
                                            profileImage &&
                                            typeof profileImage === "string"
                                              ? profileImage
                                              : profileImage
                                              ? URL.createObjectURL(
                                                  profileImage
                                                )
                                              : "https://www.ishtari.com/image/cache/default-100x100.jpg?18"
                                          }
                                        />

                                        <div className="flex w-full mt-2 ml-2 gap-4 tooltip">
                                          <label
                                            for="upload-photo"
                                            className="rounded-full w-7 h-7 flex items-center justify-center text-sm cursor-pointer"
                                            style={{
                                              color: "#5d78ff",
                                              border: "1px solid #5d78ff",
                                            }}
                                          >
                                            <FaPen />
                                          </label>

                                          <input
                                            className="opacity-0 hidden absolute -z-1"
                                            type="file"
                                            id="upload-photo"
                                            disabled
                                            onChange={(event) => {
                                              console.log(
                                                event.target.files[0]
                                              );
                                              setProfileImage(
                                                event.target.files[0]
                                              );
                                            }}
                                            style={{
                                              color: "#5d78ff",
                                              border: "1px solid #5d78ff",
                                            }}
                                          />

                                          <button
                                            className="rounded-full w-7 h-7 flex items-center justify-center text-sm"
                                            style={{
                                              color: "red",
                                              border: "1px solid red",
                                            }}
                                            onClick={() => {
                                              deleteImage();
                                            }}
                                          >
                                            <BsTrash />
                                          </button>
                                          <span className="tooltiptext text-sm">
                                            you don't have a permission to edit
                                            profile image
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div
                                  className={`mb-7 w-10/12 grid tooltip ${
                                    width > 768 ? "grid-cols-3" : "grid-cols-1"
                                  } `}
                                >
                                  <label
                                    className={`text-right p-3 font-light flex ${
                                      width > 768
                                        ? "gap-3 justify-end"
                                        : "justify-start gap-1"
                                    } items-center`}
                                  >
                                    <span
                                      className="flex items-center text-center"
                                      style={{ color: "#fd397a" }}
                                    >
                                      *
                                    </span>
                                    <span style={{ color: "#959cb6" }}>
                                      First Name:
                                    </span>
                                  </label>
                                  <div className=" flex items-center">
                                    <input
                                      className="w-full block py-2 px-4 font-normal leading-relaxed rounded h-10"
                                      value={firstName}
                                      disabled
                                      style={{ border: "1px solid #e2e5ec" }}
                                      onChange={(e) => {
                                        setFirstName(e.target.value);
                                      }}
                                    />
                                    <span className="tooltiptext text-sm">
                                      you don't have a permission to edit first
                                      name
                                    </span>
                                  </div>
                                </div>
                                <div
                                  className={`mb-7 w-10/12 grid tooltip ${
                                    width > 768 ? "grid-cols-3" : "grid-cols-1"
                                  } `}
                                >
                                  <label
                                    className={`text-right p-3 font-light flex ${
                                      width > 768
                                        ? "gap-3 justify-end"
                                        : "justify-start gap-1"
                                    } items-center`}
                                  >
                                    <span
                                      className="flex items-center text-center"
                                      style={{ color: "#fd397a" }}
                                    >
                                      *
                                    </span>
                                    <span style={{ color: "#959cb6" }}>
                                      Last Name:
                                    </span>
                                  </label>
                                  <div className=" flex items-center">
                                    <input
                                      className="w-full block py-2 px-4 font-normal leading-relaxed rounded h-10"
                                      value={lastName}
                                      disabled
                                      style={{ border: "1px solid #e2e5ec" }}
                                      onChange={(e) => {
                                        setLastName(e.target.value);
                                      }}
                                    />
                                    <span className="tooltiptext text-sm">
                                      you don't have a permission to edit last
                                      name
                                    </span>
                                  </div>
                                </div>
                                <div
                                  className={`mb-7 w-10/12 grid tooltip ${
                                    width > 768 ? "grid-cols-3" : "grid-cols-1"
                                  } `}
                                >
                                  <label
                                    className={`text-right p-3 font-light flex ${
                                      width > 768
                                        ? "gap-3 justify-end"
                                        : "justify-start gap-1"
                                    } items-center`}
                                  >
                                    <span
                                      className="flex items-center text-center"
                                      style={{ color: "#fd397a" }}
                                    >
                                      *
                                    </span>
                                    <span style={{ color: "#959cb6" }}>
                                      Contact Phone:
                                    </span>
                                  </label>
                                  <div className=" flex items-center">
                                    <div className="-mr-px">
                                      {" "}
                                      <span
                                        className="flex font-normal py-2 px-4 text-center seller-edit-form-right items-center leading-relaxed rounded h-10"
                                        style={{
                                          border: "1px solid #e2e5ec",
                                          color: "#74788d",
                                          background: "#f7f8fa",
                                        }}
                                      >
                                        <FiPhone />
                                      </span>
                                    </div>
                                    <input
                                      className="w-full block py-2 px-4 font-normal seller-edit-form-left leading-relaxed rounded h-10"
                                      value={phone}
                                      disabled
                                      style={{
                                        border: "1px solid #e2e5ec",
                                      }}
                                      onChange={(e) => {
                                        setPhone(e.target.value);
                                      }}
                                    />
                                    <span className="tooltiptext text-sm">
                                      you don't have a permission to edit phone
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* BUTTONS */}
                              <div
                                className="p-6"
                                style={{
                                  borderTop: "1px solid #ebedf2",
                                  borderBottomLeftRadius: "4px",
                                  borderBottomRightRadius: "4px",
                                }}
                              >
                                <div className="box-border w-full">
                                  <div className="flex w-full flex-wrap justify-start gap-8">
                                    {width > 768 && (
                                      <div className="w-72 h-1"></div>
                                    )}
                                    <div className="flex flex-wrap gap-2 font-light">
                                      <button
                                        type="submit"
                                        className="uppercase font-semibold text-xs py-2 px-3 rounded text-white bg-dsuccess"
                                        onClick={() => {
                                          submit();
                                        }}
                                      >
                                        submit
                                      </button>
                                      <Link
                                        href={`/seller_report/home`}
                                        type="reset"
                                        className="uppercase font-semibold text-xs py-2 px-3 text-dblackk rounded bg-white"
                                        style={{ border: "1px solid #e2e5ec" }}
                                      >
                                        cancel
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                        ) : (
                          <div className="flex w-full justify-center items-center h-96 text-center">
                            {" "}
                            Loading...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div></div>
  );
};

export default EditSeller;

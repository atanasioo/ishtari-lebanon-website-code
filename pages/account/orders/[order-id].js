import { axiosServer } from "@/axiosServer";
import ReturnModal from "@/components/account/ReturnModal";
import PointsLoader from "@/components/PointsLoader";
import useDeviceSize from "@/components/useDeviceSize";
import { AccountContext } from "@/contexts/AccountContext";
import { useMarketingData } from "@/contexts/MarketingContext";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import buildLink from "@/urls";
import { getServerSession } from "next-auth";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineCar } from "react-icons/ai";
import { BiBox } from "react-icons/bi";
import { BsCart2 } from "react-icons/bs";
import { HiOutlineHome } from "react-icons/hi";
import cookie from "cookie";
import { getHost } from "@/functions";

function OrderDetails() {
  const router = useRouter();
  const [data, setData] = useState();
  const [email, setEmail] = useState("");
  let id = router.query["order-id"];
  const [width, height] = useDeviceSize();
  const [loading, setLoading] = useState(true);
  const [state, dispatch] = useContext(AccountContext);
  const { setMarketingData } = useMarketingData();
  const [returnItem, setReturnItem] = useState(0);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [returnProducts, setReturnProducts] = useState([]);
  const [returnErr, setReturnErr] = useState("");


  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    axiosServer
      .get(buildLink("get_account", undefined, window.innerWidth))
      .then((response) => {
        setEmail(response?.data?.data?.email);
        setLoading(false);

        if (!response.data.success) {
          router.push("/");
        }
      });
    axiosServer
      .get(buildLink("order_details", undefined, window.innerWidth) + id)
      .then((response) => {
        if (response.data.success) {
          setData(response?.data.data);
          setLoading(false);
          if (response.data.data.order_status_id === "155") {
            setOrderComplete(true);
          }
        }
      });
  }, [id]);

  const closeModal = () => {
    setShowReturnModal(false);
  };

  function addReturnProduct(product_id) {
    if (returnProducts.includes(product_id)) {
      setReturnProducts(returnProducts.filter((sel) => sel !== product_id));
    } else {
      setReturnProducts(returnProducts.concat(product_id));
    }
  }

  console.log(returnProducts);

  function SelectAll() {
    const allProducts = [];
    setReturnProducts([]);
    if (!document.getElementById("check_all").checked) {
      data?.products.map((product) => {
        document.getElementById(`product${product.product_id}`).checked = false;
      });
    } else {
      data?.products.map((product) => {
        allProducts.push(product.product_id);
        document.getElementById(`product${product.product_id}`).checked = true;
      });
    }

    setReturnProducts(allProducts);
  }

  function validateReturn(){
    if(returnProducts.length >0){
      router.push(`/account/return/${id}?products=${returnProducts}`)
    }else{
      setReturnErr("Please select the products that you want to return");
      setTimeout(() => {
        setReturnErr("")
      }, 5000);
    }
  }

  return (
    <div>
      <Head>
        <title>My Account | ishtari</title>
      </Head>
      {loading ? (
        <PointsLoader />
      ) : (
        state.loged && (
          <div className="px-2 pb-5 md:px-0 md:mx-24 md:pb-14">
            <div className="flex justify-between pt-5 text-sm font-bold">
              <p>#{data?.order_id}</p>
              <p>{data?.date_added}</p>
            </div>
            <div className="main_container">
              <div className="container padding-bottom-3x mb-1">
                <div className="card mb-3">
                  <div className="p-4 text-center text-white text-lg bg-dark rounded-top">
                    {/* <span className="text-uppercase">Tracking Order No - </span>
                    <span className="text-medium">001698653lp</span> */}
                  </div>

                  <div className="card-body">
                    <div className="flex steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                      <div
                        className={`step  w-1/5 text-center ${
                          data &&
                          data?.order_status[0]?.status?.indexOf(
                            "Order Placed"
                          ) > -1 &&
                          "completed"
                        }`}
                      >
                        <div className="step-icon-wrap ">
                          <div className="step-icon">
                            <BsCart2 className="text-d18 m-2.5" />
                          </div>
                        </div>
                        <h4 className="step-title">Order Placed</h4>
                      </div>
                      <div
                        className={`step  w-1/5 text-center ${
                          data?.order_status[1]?.status?.indexOf("Ready") >
                            -1 && "completed"
                        }`}
                      >
                        <div className="step-icon-wrap">
                          <div className="step-icon">
                            <BiBox className="text-d18 m-2.5" />
                          </div>
                        </div>
                        <h4 className="step-title">Ready</h4>
                      </div>
                      <div
                        className={`step  w-1/12 text-center ${
                          data?.order_status[1]?.status?.indexOf("Ready") >
                            -1 && "completed"
                        }`}
                      >
                        <div className="step-icon-wrap"></div>
                      </div>
                      <div
                        className={`step  w-1/12 text-center ${
                          data?.order_status[2]?.status?.indexOf("Shipped") >
                            -1 && "completed"
                        }`}
                      >
                        <div className="step-icon-wrap"></div>
                      </div>

                      <div
                        className={`step  w-1/5 text-center ${
                          data?.order_status[2]?.status?.indexOf("Shipped") >
                            -1 && "completed"
                        }`}
                      >
                        <div className="step-icon-wrap">
                          <div className="step-icon">
                            <AiOutlineCar className="text-d18 m-2.5" />
                          </div>
                        </div>
                        <h4 className="step-title">Pickup</h4>
                      </div>
                      <div
                        className={`step  w-1/5 text-center ${
                          data?.order_status[3]?.status?.indexOf("Delivered") >
                            -1 && "completed"
                        }`}
                      >
                        <div className="step-icon-wrap">
                          <div className="step-icon ">
                            <HiOutlineHome className="text-d18 m-2.5" />
                          </div>
                        </div>
                        <h4 className="step-title">Delivered</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <p className="text-xs font-semibold">
                {data?.firstname + " "}
                {data?.lastname}
              </p>
              <p className="text-xs">{data?.telephone}</p>
              <p className="text-xxs text-gray-600">{email}</p>
            </div>

            <div className="flex-row md:flex mt-5 pb-7  border-b  border-dgrey1 justify-between">
              <div className="w-full md:w-1/2 border  border-dgrey shadow-lg mr-5 rounded-md">
                {/* right */}
                <p className="cart-header">Shipping Address</p>
                <div className="cart-body">
                  <p className="text-sm py-5 mx-3 rounded-t-md border-b text-dblack border-dgrey1">
                    {data?.firstname + " "}
                    {data?.lastname}
                  </p>
                  <p
                    className="mt-5 text-sm mx-3 pb-2"
                    dangerouslySetInnerHTML={{ __html: data?.shipping_address }}
                  ></p>
                </div>
              </div>
              <div className="w-full md:w-1/2 border mt-3 md:mt-0 border-dgrey shadow-lg rounded-md">
                {/* right */}
                <p className="cart-header">Payment Address</p>
                <div className="cart-body">
                  <p className="text-sm py-5 mx-3 rounded-t-md border-b text-dblack border-dgrey1">
                    {data?.firstname + " "}
                    {data?.lastname}
                  </p>
                  <p
                    className="mt-5 text-sm mx-3 pb-2 "
                    dangerouslySetInnerHTML={{ __html: data?.payment_address }}
                  ></p>
                </div>
              </div>
            </div>

            {orderComplete && (
              <div className={`w-full flex ${returnErr.length >0 ? "justify-between" : "justify-end"}  pt-5`}>
                {returnErr.length > 0 && (
                  <div className="text-dbase pr-semibold">{returnErr}</div>
                )}
                <div
                  href={`/account/return/${id}`}
                  className="px-3 py-2 mx-2 bg-dmenusep rounded-full text-white cursor-pointer whitespace-nowrap"
                  onClick={() => {
                    // setReturnItem(i);
                    // setShowReturnModal(true);
                    validateReturn()
                  }}
                >
                  Request a Return
                </div>
              </div>
            )}

            {/* TABLE */}
            <div className="mt-7 overflow-x-scroll">
              {width > 650 ? (
                <table className="w-full  text-left">
                  <thead className="border">
                    <tr>
                      <th className="px-4">
                        <input
                          type="checkbox"
                          id="check_all"
                          onClick={() => SelectAll()}
                        />
                      </th>
                      <th className=" border-l  px-4  py-1 text-sm">#</th>
                      <th className="border-l px-2 md:px-4 py-1  text-sm">
                        Product
                      </th>

                      <th className="border-l px-4 md:px-4 py-1  text-sm">
                        SKU
                      </th>
                      <th className="border-l px-2 md:px-4 py-1  text-sm">
                        Quantity
                      </th>
                      <th className="border-l px-2 md:px-4 py-1  text-sm">
                        Price
                      </th>
                      <th className="px-2 border-l md:px-4  py-1 text-sm">
                        Total
                      </th>
                      {/* {orderComplete && (
                      <th className="px-2 border-l md:px-4  py-1 text-sm">
                        Action
                      </th>
                    )} */}
                    </tr>
                  </thead>
                  {data?.products?.map((data, i) => (
                    <tbody key={i}>
                      <tr className="border">
                        <td className="px-4">
                          <input
                            type="checkbox"
                            id={`product${data.product_id}`}
                            onClick={() => addReturnProduct(data.product_id)}
                          />
                        </td>
                        <td className="border  px-4">
                          <Link
                            href={`/product/${data.product_id}`}
                            onClick={() =>
                              setMarketingData({
                                ignore: false,
                                banner_image_id: "",
                                source_type: "order",
                                source_type_id: id,
                              })
                            }
                          >
                            <img
                              className="w-12"
                              src={data.image}
                              alt={data.name}
                            />
                          </Link>
                        </td>
                        <td className="px-4 text-sm">
                          <span
                            dangerouslySetInnerHTML={{ __html: data.name }}
                          ></span>
                          <span className="font-semibold">
                            {" "}
                            {data?.option[0]?.name &&
                              "( " + data?.option[0]?.value + " )"}{" "}
                          </span>{" "}
                        </td>

                        <td className="border   px-4 text-sm">{data.model}</td>
                        <td className="border  px-4 text-sm">
                          {data.quantity}
                        </td>
                        <td className="border  px-4 text-sm whitespace-nowrap">
                          {data.price}
                        </td>
                        <td className="border  px-4 text-sm whitespace-nowrap">
                          {" "}
                          {data.total}
                        </td>
                        {/* only show return button when order is complete */}
                        {/* {orderComplete && (
                          <td className="border  px-4 text-sm">
                            <div
                              className="px-3 py-2 mx-2 bg-dmenusep rounded-full text-white cursor-pointer whitespace-nowrap"
                              onClick={() => {
                                setReturnItem(i);
                                setShowReturnModal(true);
                              }}
                            >
                              Request a Return
                            </div>
                          </td>
                        )} */}
                      </tr>
                    </tbody>
                  ))}
                </table>
              ) : (
                <table className="w-full text-left">
                  <thead className="border">
                    <div className="hidden md:block">
                      {" "}
                      <th className=" border-l  px-4  py-1 text-sm">#</th>
                    </div>
                    <th className="border-l px-2  py-1  text-sm">Product</th>
                    <th className="border-l px-4  py-1  text-sm">SKU</th>
                    <th className="border-l px-2  py-1  text-sm">Quantity</th>
                    <th className="border-l px-2  py-1  text-sm">Price</th>
                    <th className="border-l px-2  py-1 text-sm">Total</th>
                    {orderComplete && (
                      <th className="border-l px-2  py-1 text-sm">Action</th>
                    )}
                  </thead>
                  {data?.products.map((data, i) => (
                    <tbody key={i}>
                      <tr className="border">
                        <div className="hidden md:flex-wrap">
                          {" "}
                          <td className="border  px-4">
                            <img className="w-12" src={data.image} alt="" />
                          </td>
                        </div>
                        <td className=" px-2 md:px-4 text-sm line-clamp-3 md:line-clamp-none">
                          {data.name}
                        </td>
                        <td className="border  px-2 md:px-4 text-sm">
                          {data.model}
                        </td>
                        <td className="border px-2 md:px-4 text-sm">
                          {data.quantity}
                        </td>
                        <td className="border px-2 md:px-4 text-sm">
                          {data.price}
                        </td>
                        <td className="border px-2 md:px-4 text-sm">
                          {data.total}
                        </td>
                        {orderComplete && (
                          <td className="border px-2 md:px-4 text-sm">
                            <div
                              className="px-3 py-2 mx-2 bg-dmenusep rounded-full text-white cursor-pointer whitespace-nowrap"
                              onClick={() => {
                                setReturnItem(i);
                                setShowReturnModal(true);
                              }}
                            >
                              Request a Return
                            </div>
                          </td>
                        )}
                      </tr>
                    </tbody>
                  ))}
                </table>
              )}
            </div>
            <div className="flex justify-between mt-5 md:mt-10 border-b border-dgrey1 pb-2 items-centre">
              {data?.totals?.map((data) => (
                <div key={data.order_total_id}>
                  <div className="flex-row">
                    <p className="border-b border-dgrey1"> {data.title}</p>
                  </div>
                  <div>
                    <p className="mt-4"> {data.text} </p>
                  </div>
                </div>
              ))}
            </div>

            {/* return modal */}
            {/* {showReturnModal && ( */}
            {/* <div>
              <ReturnModal
                data={data}
                index={returnItem}
                closeModal={closeModal}
                showReturnModal={showReturnModal}
              />
            </div> */}
            {/* )} */}
          </div>
        )
      )}
    </div>
  );
}

export default OrderDetails;

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
      if (response.data.data.customer_id === 0) {
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

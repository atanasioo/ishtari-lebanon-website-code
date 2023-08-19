import { axiosServer } from "@/axiosServer";
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

function OrderDetails() {
  const router = useRouter();
  const [data, setData] = useState();
  const [email, setEmail] = useState("");
  let id = router.query["order-id"];
  const [width, height] = useDeviceSize();
  const [loading, setLoading] = useState(true);
  const [state, dispatch] = useContext(AccountContext);
  const [success, setSuccess] = useState(false);
  const { setMarketingData } = useMarketingData();

  //   useEffect(() => {
  //     if (!state.loged) {
  //       dispatch({ type: "setShowOver", payload: true });
  //       dispatch({ type: "setShowLogin", payload: true });
  //     } else {
  //       dispatch({ type: "setShowOver", payload: false });
  //       dispatch({ type: "setShowLogin", payload: false });
  //     }
  //   }, [state.loged, loading, success]);

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
        if (response.data.success) {
          setSuccess(true);
        }
      });
    axiosServer
      .get(buildLink("order_details", undefined, window.innerWidth) + id)
      .then((response) => {
        if (response.data.success) {
          setData(response?.data.data);
          setLoading(false);
          setSuccess(true);
        }
      });
  }, [id]);

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

            {/* TABLE */}
            <div className="mt-7 overflow-x-scroll">
              {width > 650 ? (
                <table className="w-full  text-left">
                  <thead className="border">
                    <th className=" border-l  px-4  py-1 text-sm">#</th>
                    <th className="border-l px-2 md:px-4 py-1  text-sm">
                      Product
                    </th>

                    <th className="border-l px-4 md:px-4 py-1  text-sm">SKU</th>
                    <th className="border-l px-2 md:px-4 py-1  text-sm">
                      Quantity
                    </th>
                    <th className="border-l px-2 md:px-4 py-1  text-sm">
                      Price
                    </th>
                    <th className="px-2 border-l md:px-4  py-1 text-sm">
                      Total
                    </th>
                  </thead>
                  {data?.products?.map((data) => (
                    <tr className="border">
                      <td className="border  px-4">
                        <Link href={`/product/${data.product_id}`} onClick={() => setMarketingData({
                          ignore: false,
                          banner_image_id: "",
                          source_type: "order",
                          source_type_id: id,
                        })}>
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
                      <td className="border  px-4 text-sm">{data.quantity}</td>
                      <td className="border  px-4 text-sm">{data.price}</td>
                      <td className="border  px-4 text-sm"> {data.total}</td>
                    </tr>
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
                  </thead>
                  {data?.products.map((data) => (
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
                    </tr>
                  ))}
                </table>
              )}
            </div>
            <div className="flex justify-between mt-5 md:mt-10 border-b border-dgrey1 pb-2 items-centre">
              {data?.totals?.map((data) => (
                <div>
                  <div className="flex-row  ">
                    <p className="border-b border-dgrey1"> {data.title} </p>
                  </div>
                  <div>
                    <p className="mt-4"> {data.text} </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default OrderDetails;

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

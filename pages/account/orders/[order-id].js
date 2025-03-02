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
import { AiOutlineCar, AiOutlineClose } from "react-icons/ai";
import { BiBox } from "react-icons/bi";
import { BsCart2 } from "react-icons/bs";
import { HiOutlineHome } from "react-icons/hi";

import Image from "next/legacy/image";

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
  const [returnProducts, setReturnProducts] = useState([]);
  const [returnErr, setReturnErr] = useState("");
  const [success, setSuccess] = useState(false);
  // const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [otherReason, setOtherReason] = useState(false);
  const [otherReasonTxt, setOtherReasonTxt] = useState("");

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    if (!state.loading && !state.loged) {
      router.push("/");
    } else if (state.loged) {
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
            console.log(response.data.data);
            setData(response?.data.data);
            setLoading(false);
          }
        });
    }
  }, [id, state.loading, success]);

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

  // console.log(returnProducts);

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

  function validateReturn() {
    if (returnProducts.length > 0) {
      router.push(`/account/return/${id}?products=${returnProducts}`);
    } else {
      setReturnErr("Please select the products that you want to return");
      setTimeout(() => {
        setReturnErr("");
      }, 5000);
    }
  }

  // function cancelOrder(id) {
  //   setLoading(true);

  //   axiosServer
  //     .get(
  //       buildLink("cancelOrder", undefined, undefined, window.location.host) +
  //         id
  //     )
  //     .then((resp) => {
  //       // console.log(resp);
  //       if (resp.data.succes) {
  //         setSuccess(true);
  //         setLoading(false);
  //         setConfirmModal(false)
  //         setConfirmCancel(true);
  //       }
  //     });
  // }

  // function submitCancelReason(e) {
  //   e.preventDefault();
  //   //make api request to submit the reason
  //   setConfirmCancel(false);
  // }

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
            {/* <div className="w-full text-dgreen">
              {success && "Success Order Canceled"}
            </div> */}
            {/* <div className="flex items-center justify-between">
              <div className="mt-5 w-1/2">
                <p className="text-xs font-semibold">
                  {data?.firstname + " "}
                  {data?.lastname}
                </p>
                <p className="text-xs">{data?.telephone}</p>
                <p className="text-xxs text-gray-600">{email}</p>
              </div>

              {data?.eligible_to_cancel && (
                <div
                  className="flex mx-4 text-right justify-end bg-dbase text-white p-2 rounded-full font-bold cursor-pointer h-10"
                  // onClick={(e) => cancelOrder(data.order_id)}
                  onClick={(e) => setConfirmModal(true)}
                >
                  <span className="mx-1 whitespace-nowrap space-x-2">
                    {" "}
                    Cancel Order
                  </span>
                </div>
              )}
            </div> */}

            <div className="flex-row md:flex mt-5 pb-7   justify-between">
              <div className="w-full md:w-1/2 border  border-dgrey shadow-lg mr-5 rounded-md">
                {/* right */}
                <p className="cart-header">Shipping Address</p>
                <div className="cart-body">
                  <p className="text-sm py-5 mx-3 rounded-t-md text-dblack border-dgrey1">
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
                  <p className="text-sm py-5 mx-3 rounded-t-md text-dblack border-dgrey1">
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

            {/* {orderComplete && (
              <div
                className={`w-full flex ${
                  returnErr.length > 0 ? "justify-between" : "justify-end"
                }  pt-5`}
              >
                {returnErr.length > 0 && (
                  <div className="text-dbase pr-semibold">{returnErr}</div>
                )}
                <div
                  href={`/account/return/${id}`}
                  className="px-3 py-2 mx-2 bg-dmenusep rounded-full text-white cursor-pointer whitespace-nowrap"
                  onClick={() => {
                    // setReturnItem(i);
                    // setShowReturnModal(true);
                    validateReturn();
                  }}
                >
                  Request a Return
                </div>
              </div>
            )} */}

            {/* TABLE */}
            <div className="relative overflow-x-auto w-full border mt-3 md:mt-0 bg-white border-dgrey shadow-lg rounded-md">
              {width > 650 ? (
                <table className="w-full text-sm hover:table-auto text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className=" bg-gray-200 text-xs  text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="bg-white  dark:bg-gray-800 dark:border-gray-700">
                      {/* {orderComplete && (
                        <th className="px-4">
                          <input
                            type="checkbox"
                            id="check_all"
                            onClick={() => SelectAll()}
                          />
                        </th>
                      )} */}

                      <th className="  dark:bg-gray-800 dark:border-gray-700 pl-2 ">#</th>
                      <th className=" px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        Product
                      </th>

                      <th className="  px-4 md:px-4 py-1  text-sm">
                        SKU
                      </th>
                      <th className="  px-2 md:px-4 py-1  text-sm">
                        Quantity
                      </th>
                      <th className="  px-2 md:px-4 py-1  text-sm">
                        Price
                      </th>
                      <th className="  px-2  md:px-4  py-1 text-sm">
                        Total
                      </th>
                      {/* {data?.can_be_returned && (
                      <th className="px-2 border-l md:px-4  py-1 text-sm">
                        Action
                      </th>
                    )} */}
                    </tr>
                  </thead>
                  {data?.products?.map((product, i) => (
                    <tbody key={i}>
                      <tr className="bg-white border-t-2 border-b-2 border-dgrey ">
                        {/* {orderComplete && (
                          <td className="px-4">
                            <input
                              type="checkbox"
                              id={`product${data.product_id}`}
                              onClick={() => addReturnProduct(data.product_id)}
                            />
                          </td>
                        )} */}

                        <td className=" p-4 px-4">
                          <Link
                            href={`/product/${product.product_id}`}
                            onClick={() =>
                              setMarketingData({
                                ignore: false,
                                banner_image_id: "",
                                source_type: "order",
                                source_type_id: id,
                              })
                            }
                          >
                            <Image
                              className="w-12 mt-2"
                              src={product.image}
                              alt={product.name}
                              width="55"
                              height="70"
                            />
                          </Link>
                        </td>
                        <td className="px-4 text-sm">
                          <span
                            dangerouslySetInnerHTML={{ __html: product.name }}
                          ></span>
                          <span className="font-semibold">
                            {" "}
                            {product?.option[0]?.name &&
                              "( " + product?.option[0]?.value + " )"}{" "}
                          </span>{" "}
                        </td>

                        <td className=" p-2  px-4 text-sm">
                          {product.sku}
                        </td>
                        <td className=" p2 px-4 text-sm">
                          {product.quantity}
                        </td>
                        <td className=" p2  px-4 text-sm whitespace-nowrap">
                          {product.price}
                        </td>
                        <td className=" p2 px-4 text-sm whitespace-nowrap">
                          {" "}
                          {product.total}
                        </td>
                        {/* only show return button when order is complete */}
                        {/* {product?.can_be_returned && !product.non_refundable && (
                          <td className="border  px-4 text-sm">
                            <div
                              className="px-2 py-2 text-center mx-2 bg-dmenusep rounded-full text-white cursor-pointer whitespace-nowrap"
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
                <table className="w-full text-left ">
                  <thead className=" h-20 ">
                    <div className="hidden md:block">
                      {" "}
                      <th className="     px-4  py-1 text-sm">#</th>
                    </div>
                    <th className=" px-2  py-1  text-sm">Product</th>
                    <th className=" px-4  py-1  text-sm">SKU</th>
                    <th className=" px-2  py-1  text-sm">Quantity</th>
                    <th className=" px-2  py-1  text-sm">Price</th>
                    <th className=" px-2  py-1 text-sm">Total</th>
                    {/* {data?.can_be_returned && (
                      <th className="border-l px-2  py-1 text-sm">Action</th>
                    )} */}
                  </thead>
                  {data?.products.map((product, i) => (
                    <tbody key={i}>
                      <tr className="border-t border-b border-dashed border-dgrey  h-20  ">
                        <div className="hidden md:flex-wrap">
                          {" "}
                          <td className="  px-4">
                            <img className="w-12" src={product.image} alt="" />
                          </td>
                        </div>
                       
                        <td className=" h-full my-auto px-2 md:px-4  tracking-wide">
                        <span className=" text-ellipsis overflow-hidden text-sm line-clamp-3 my-auto    md:line-clamp-none"
                            dangerouslySetInnerHTML={{ __html: product.name }}
                          ></span>
                        </td>
                        <td className="  px-2 md:px-4 text-sm">
                          {product.sku}
                        </td>
                        <td className=" px-2 md:px-4 text-sm">
                          {product.quantity}
                        </td>
                        <td className=" px-2 md:px-4 text-sm">
                          {product.price}
                        </td>
                        <td className=" px-2 md:px-4 text-sm">
                          {product.total}
                        </td>
                        {/* {data?.can_be_returned && !product?.non_refundable && (
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
                        )} */}
                      </tr>
                    </tbody>
                  ))}
                </table>
              )}
            </div>
            <div className="relative overflow-x-auto shadow-lg sm:rounded-lg  bg-white mt-5 md:mt-10   pb-2 items-centre">
              {data?.totals?.map((data) => (
                <div className="flex flex-row " key={data.order_total_id}>
                  <div className="m-4">
                    <p className=" border-dgrey1"> {data.title}</p>
                  </div>
                  <div>
                    <p className="mt-4"> {data.text} </p>
                  </div>
                </div>
              ))}
            </div>

            {/* return modal */}
            {showReturnModal && (
              <div>
                <ReturnModal
                  data={data}
                  index={returnItem}
                  closeModal={closeModal}
                  showReturnModal={showReturnModal}
                />
              </div>
            )}

            {/* cancel order modal */}

            {/* <div className="relative">
              {confirmCancel && (
              <div className="fixed bg-dblackOverlay top-0 left-0 right-0 bottom-0 z-20">
                <div className="absolute z-30 rounded-md bg-white top-0 left-0 bottom-0 right-0 w-max h-max m-auto">
                  <div className="p-7 relative">
                    <p className="pr-bold pb-3 text-d18">
                      Help us understand Why you cancelled?
                    </p>
                    <AiOutlineClose
                      className="absolute right-2 top-2 w-5 h-5 cursor-pointer"
                      onClick={() => setConfirmCancel(false)}
                    />

                    <form onSubmit={(e) => submitCancelReason(e)}>
                      {!otherReason ? (
                        <div>
                          <div className="flex items-center gap-3 pb-2">
                            <input
                              type="radio"
                              name="cancel_reason"
                              value="1"
                            />
                            <label>
                              I changed my mind. I don't need the order anymore.
                            </label>
                          </div>
                          <div className="flex items-center gap-3 pb-2">
                            <input
                              type="radio"
                              name="cancel_reason"
                              value="2"
                            />
                            <label>I placed the order by mistake.</label>
                          </div>
                          <div className="flex items-center gap-3 pb-2">
                            <input
                              type="radio"
                              name="cancel_reason"
                              value="3"
                            />
                            <label>I need to modify my ordered products.</label>
                          </div>
                          <div className="flex items-center gap-3 pb-2">
                            <input
                              type="radio"
                              name="cancel_reason"
                              value="4"
                            />
                            <label>
                              I need to change the delivery address.
                            </label>
                          </div>
                          <div
                            className="flex items-center gap-3 pb-2"
                            onClick={() => setOtherReason(true)}
                          >
                            <input
                              type="radio"
                              name="cancel_reason"
                              value="5"
                            />
                            <label>Other.</label>
                          </div>
                        </div>
                      ) : (
                        <>
                          <input
                            type="text"
                            placeholder="Enter the reason why you cancelled the order"
                            className="w-full text-sm border border-dinputBorder py-2 px-3 my-5 rounded-md"
                            onChange={(e) => setOtherReasonTxt(e.target.value)}
                          />
                        </>
                      )}

                      <div className="w-full flex justify-center">
                        <button
                          type="submit"
                          className="rounded-md bg-dblue text-white px-10 py-1 mt-3"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              )}
              {confirmModal && (
                <div className="fixed bg-dblackOverlay top-0 left-0 right-0 bottom-0 z-20">
                  <div className="absolute z-30 rounded-md bg-white top-0 left-0 bottom-0 right-0 w-max h-max m-auto">
                    <div className="px-4 py-7">
                      <p className="pr-semibold text-d18 mb-5">Are you sure you want to cancel this order?</p>
                      <div className="flex justify-around items-center mt-7">
                        <div className="rounded-md px-8 py-1 cursor-pointer bg-dblue text-white" onClick={(e) => {cancelOrder(data.order_id)}}>Yes</div>
                        <div className="rounded-md px-8 py-1 cursor-pointer bg-dbase text-white" onClick={() => setConfirmModal(false)}>No</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div> */}
          </div>
        )
      )}
    </div>
  );
}

export default OrderDetails;

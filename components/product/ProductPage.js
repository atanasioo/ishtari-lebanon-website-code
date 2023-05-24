import Link from "next/link";
import { BsChevronRight } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import DOMPurify from "dompurify";
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Timer from "./Timer";

function ProductPage(props) {
  const [countDownPointer, setCountDonwPointer] = useState();
  const [hasAddToCartError, setHasAddToCartError] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [successAdded, setSuccessAdded] = useState(false);
  const [toggleQty, setToggleQty] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [countDown, setCountDown] = useState();
  const [hasBannerEvent, setHasBannerEvent] = useState();
  const { data } = props; //instead of productData

  console.log(data);

  useEffect(() =>{
    if(data.special_end !== null && data.special_end !==0){
      setHasBannerEvent(data?.bannerevent);
    }
  },[])

  return (
    <div style={{ backgroundColor: "#f8f8f9" }}>
      <div className="px-5">
        <div className="flex flex-col px-5 mx-auto">
          <div className="breadcrumbs py-3 hidden md:block">
            <div className="flex items-center">
              {data?.breadcrumbs.category && (
                <div className="flex items-center">
                  <Link
                    href={"/"}
                    className="text-dblack font-light truncate text-d11 md:text-sm mr-2"
                  >
                    Home
                  </Link>
                  <BsChevronRight className="hidden sm:block icon icon-angle-right text-d11 md:text-xs text-dgrey1" />
                  <Link
                    href={`/category/${data?.breadcrumbs?.category[0]?.category_id}`}
                    className="hidden md:block text-dblack font-light truncate text-d11 md:text-sm mx-2"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        data?.breadcrumbs?.category[0]?.name
                      ),
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="product-div flex items-stretch bg-white">
            <div className="flex flex-col md:flex-row py-3 pr-9">
              <div className="product-zoom w-full h-full">
                <Image width={380} height={518} src={data.popup} />
              </div>
              <div className="product-info">
                {/* BRAND NAME */}
                <Link href={"/"} className="text-dgrey1 hover:text-dblue">
                  {data?.manufacturer_image ? (
                    <Image
                      src={data.manufacturer_image}
                      alt={data.manufacturer_id}
                      className="w-24"
                      width={96}
                      height={38}
                    />
                  ) : (
                    data?.manufacturer?.toUpperCase()
                  )}
                </Link>
                <h1
                  className="text-dblack font-semibold text-d22 mb-3"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(data.name),
                  }}
                ></h1>
                <div className="mb-3 product-info">
                  <div className="mb-3">
                    <div className="product-model-rating mb-3 text-d14 text-dgreyProduct flex flex-wrap items-center">
                      <div className="modelNumber mr-1.5">
                        Model Number: {data.sku}
                      </div>
                      <div className="divider h-4 w-0.5 bg-dplaceHolder mr-1.5"></div>
                      <div className="product-rating"></div>
                    </div>
                    <div className="product-price">
                      <div
                        className={`${
                          data.special !== "0"
                            ? "flex items-center mb-3"
                            : "hidden"
                        }`}
                      >
                        <div
                          className={`${
                            data.special !== "0"
                              ? "mr-9 text-d14 text-dblack"
                              : "hidden"
                          }`}
                        >
                          Was:
                        </div>
                        <div
                          className={`${
                            data.special !== "0"
                              ? "text-dgreyProduct line-through"
                              : "hidden"
                          }`}
                        >
                          {data.price}
                        </div>
                      </div>
                      <div className="flex items-center mb-3">
                        <div className="mr-9 text-d14 text-dblack">
                          {data.special !== "0" ? "Now:" : "Price:"}
                        </div>
                        <div
                          className={`text-dblack ${
                            data.special !== "0" ? "text-d20 font-bold " : ""
                          }`}
                        >
                          {data.special !== "0" ? data.special : data.price}
                        </div>
                      </div>

                      {/* missing span */}

                      {data.special !== "0" && (
                        <div className="flex items-center">
                          <div className="mr-9 text-d14 text-dblack">
                            Saving:
                          </div>
                          <div className={`text-dblack`}>
                            <span
                              className={
                                data.special !== "0"
                                  ? "bg-dgreenop text-dgreen font-semibold px-2 text-xs"
                                  : "invisible"
                              }
                            >
                              {data.saving + "% OFF"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Add to cart */}

                  <div className="flex text-d15 mt-4">
                    <div className="w-16 font-semibold">Quantity</div>
                    {data["quantity"] <= 5 && data["quantity"] > 0 && (
                      <div className="text-dbase ml-2">
                        Low stock: only {data["quantity"]} left
                      </div>
                    )}
                  </div>

                  <div
                    className={`flex items-center mt-4 mb-4 ${
                      data["quantity"] <= 5 ? "mt-1" : "mt-4"
                    }`}
                  >
                    {/* <input
                      onChange={(e) => setQuantity(e.target.value)}
                      type="number"
                      value={quantity}
                      className={`${productData["quantity"] === "0" && "hidden"}
                                            border
                                            w-16
                                            h-12
                                            rounded
                                            text-dblack text-center
                                            border-dgrey1
                                            text-xl
                                            `}
                    /> */}

                    <div
                      className="qty-picker font-semibold cursor-pointer"
                      onClick={() => setToggleQty(!toggleQty)}
                    >
                      <div className="relative box-border">
                        <div className="flex items-center justify-center border border-dgreyQtyProduct rounded-md relative h-12 py-2 px-1.5">
                          <div className="mx-3">{quantity}</div>
                          <div className="flex items-center">
                            <div
                              style={{ width: "1px" }}
                              className="dividor h-7 bg-dgreyQtyProduct "
                            ></div>
                            <div className="px-1">
                              <FiChevronDown
                                className="text-dgreyQtyProduct h-6 w-6"
                                style={{
                                  transform: toggleQty ? "rotate(-180deg)" : "",
                                  transition: "transform 0.2s ease",
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div
                          className={`${
                            toggleQty ? "" : "hidden"
                          } absolute bg-white flex flex-col items-center  justify-center rounded-md border border-dgreyQtyProduct mt-1.5 w-full`}
                        >
                          <div
                            className="overflow-y-scroll w-full"
                            style={{ maxHeight: "200px" }}
                          >
                            {Array.from(
                              { length: data.quantity },
                              (_, index) => index + 1
                            ).map((value) => (
                              <div
                                key={value}
                                onClick={() => setQuantity(value)}
                                className={`py-1  hover:bg-dblue hover:text-white w-full text-center`}
                              >
                                {value}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      className={` text-white flex-grow h-12 relative rounded   ${
                        data["quantity"] === "0"
                          ? "bg-dbase mr-1"
                          : "bg-dblue mx-1 hover:bg-dbluedark"
                      } flex items-center justify-center rounded-md text-white `}
                    >
                      <span>
                        {data["quantity"] === "0" ? (
                          "Out Of Stock"
                        ) : (
                          <div>
                            <p
                              className={`absolute z-10  transition duration-100 ease-in left-5 md:left-14 top-3 text-white ${
                                successAdded && countDown && !countDownPointer
                                  ? "translate-x-0 "
                                  : "translate-x-full invisible"
                              } `}
                            >
                              <span className="bg-white  px-2 rounded-full text-dblue">
                                1
                              </span>{" "}
                              item Added to the Cart
                            </p>
                            {countDownPointer === true &&
                            hasAddToCartError === false ? (
                              <div className="top-5 lds-ellipsis">
                                <div />
                                <div />
                                <div />
                                <div />
                              </div>
                            ) : (
                              !addingToCart && (
                                <span className="">Add To Cart </span>
                              )
                            )}
                          </div>
                        )}
                      </span>{" "}
                    </button>
                  </div>
                </div>
                {/* TIMER */}
                {data?.special_end !== 0 &&
                  typeof data?.special_end !== typeof null &&
                  data?.special_end !== "0" &&
                  window.config !== "undefined" && (
                    <Timer
                      date={
                        (window.config["site-url"] ===
                          "https://www.ishtari.com.gh" ||
                          Cookies.get("site-local-name") === "ishtari-ghana") &&
                        data?.special_end === "2023-01-10"
                          ? "2022-12-19"
                          : data?.special_end
                      }
                    />
                  )}
                {/*banner */}
                {hasBannerEvent && hasBannerEvent.thumb && (
                  <div className="mt-5">
                    <img
                      src={hasBannerEvent.thumb}
                      alt={hasBannerEvent.name}
                      className="w-full"
                    />
                  </div>
                )}
                <div className="product-bundle"></div>
              </div>
            </div>
            <div className="pl-3 border-l border-dborderProduct"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;

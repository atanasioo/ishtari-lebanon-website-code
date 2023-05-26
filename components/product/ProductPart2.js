import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import StarRatings from "react-star-ratings";
import Image from "next/image";
import useDeviceSize from "@/components/useDeviceSize";
import { BsPlusLg } from "react-icons/bs";

function ProductPart2(props) {
  const { titleRef, loader, productData2 } = props;
  const [width, height] = useDeviceSize();
  const [starRating, setStarRating] = useState(0);
  const [ReviewImages, setReviewImages] = useState([]);
  const [exceededMaxnb, setExceededMaxNb] = useState(false);
  const hiddenFileInput = useRef(null);
  const textRef = useRef();
  const [required, setRequired] = useState();
  console.log(productData2);

  const PointsLoader = dynamic(() => import("../PointsLoader"), {
    ssr: false, // Disable server-side rendering
  });

  function changeRating(newRating, name) {
    console.log(newRating);
    setStarRating(newRating);
  }

  const handleImageUpload = (event) => {
    hiddenFileInput.current.click();
  };

  const handleFileLimit = () => {
    if (ReviewImages.length >= 5) {
      return true;
    }
    return false;
  };

//   const requestBody= JSON.stringify({
//     "charge_msisdn": "233549455903",
//     "charge_amount": 84,
//     "country_code": "GHA",
//     "currency_code": "GHS",
//     "merchant_transaction_id": 53872,
//     "service_code": "ISHTARI_GHANA_LIMITE",
//     "payment_mode_code": "STK_PUSH",
//     "payment_option_code": "MTNGHS"
//   });

//   const contentLength = Buffer.byteLength(requestBody, 'utf8');
// console.log(contentLength);
  

  return (
    <div className="w-full bg-white">
      <div
        className=" border-t-8 border-dinputBorder space-x-10  "
        ref={titleRef}
      >
        {loader ? (
          <PointsLoader />
        ) : (
          productData2?.product_reviews && (
            <div ref={titleRef} className="container">
              <div className="flex space-x-10 px-6 ">
                <p
                  className={`${
                    // showReview &&
                    "border-b-4 border-dblue scale-110 transform ease-in-out duration-300"
                  }  font-semibold cursor-pointer text-xl mx-2  py-4`}
                >
                  Product Reviews
                </p>
              </div>
              <div
              // className={
              //   showReview
              //     ? " bg-white  mb-2 container"
              //     : "bg-white my-2 mx-1 container"
              // }
              >
                <div className="grid gap-4 lg:grid-cols-3 pt-4">
                  <div className="flex p-1 border-r-2 border-dgreyRate">
                    <div className="flex ">
                      <div className="text-center">
                        <div className="text-center font-bold text-d14">
                          Overall Rating
                        </div>
                        <div className="font-bold text-xxl text-dRate">
                          {productData2.product_reviews?.avg_rating?.toFixed(
                            1
                          ) || "0.0"}
                        </div>
                        <div className="grid place-items-center  just auto-rows-max">
                          <StarRatings
                            starDimension="20px"
                            starEmptyColor="#e3e3e3"
                            starRatedColor="#f5a523"
                            starSpacing="1px"
                            rating={productData2?.product_reviews?.avg_rating}
                          />
                        </div>
                        <div className="pl-3">
                          Based on{" "}
                          {productData2?.product_reviews?.totals
                            ? productData2?.product_reviews?.totals
                            : "0"}{" "}
                          ratings
                        </div>
                      </div>
                    </div>
                    {/* {!stateAccount.loged && (
                      <div className="grid place-items-center ">
                        <div></div>
                        <div className="text-center ml-12">
                          {" "}
                          <button
                            className="flex rounded bg-dblue text-white px-3 py-1 hover:opacity-50	"
                            onClick={() => {
                              dispatchAccount({
                                type: "setShowOver",
                                payload: true,
                              });
                              dispatchAccount({
                                type: "setShowLogin",
                                payload: true,
                              });
                              dispatchAccount({
                                type: "setShowSignup",
                                payload: false,
                              });
                            }}
                          >
                            Write a review
                          </button>
                        </div>
                        <div></div>
                      </div>
                    )} */}
                  </div>
                  <div className="p-1 py-2">
                    <div className="flex">
                      <div className="">
                        <Image
                          src={"/images/review.png"}
                          alt={"reviewimg"}
                          className="w-5 rounded-xl"
                          width="10"
                          height="10"
                        />
                      </div>
                      <div className="font-semibold px-4">
                        {" "}
                        How do I review this product?
                      </div>
                    </div>
                    <div className="text-d12 ">
                      If you recently purchased this product from ishtari, you
                      can add Review.
                    </div>
                  </div>
                  <div className="p-1 py-2 ">
                    <div className="flex ">
                      <div className="">
                        <Image
                          src={"/images/review-1.png"}
                          alt={"reviewimg1"}
                          width="10"
                          height="10"
                          className="w-5 rounded-xl"
                        />
                      </div>
                      <div className="font-semibold px-4">
                        {" "}
                        Where do the reviews come from?
                      </div>
                    </div>
                    <div className="text-d12">
                      Our verified reviews are from ishtari customers who
                      purchased the product and submitted a review
                    </div>
                  </div>
                </div>

                <div className="px-6">
                  <div className="ml-1">
                    {/* only if logged */}
                    <div className="mt-4 flex justify-start items-center flex-row space-x-2.5">
                      <div
                        className={
                          width > 650
                            ? "flex flex-col w-1/2 font-bold pt-1 "
                            : "flex flex-col w-14/24 font-bold pt-1 "
                        }
                      >
                        <div className="flex items-center">
                          <div className="flex rounded-full w-14 h-14  bg-Orangeflo  text-white  text-d22 items-center justify-center disable">
                            F
                          </div>
                          <div className="flex flex-col ml-3">
                            <div className=""> Fatima</div>
                            <div className="flex">
                              <StarRatings
                                starDimension="18px"
                                starEmptyColor="#e3e3e3"
                                starRatedColor="#f5a523"
                                starHoverColor="#f5a523"
                                starSpacing="1px"
                                isSelectable="true"
                                rating={starRating}
                                changeRating={changeRating}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex my-3 ml-1.5">
                            <div
                              className={`xs:border-2 xs:border-dslate xs:border-dashed relative h-14 w-14  sm:h-20 sm:w-20  ${
                                (handleFileLimit() && "opacity-50",
                                !handleFileLimit() && "cursor-pointer")
                              }`}
                              onClick={() => handleImageUpload()}
                            >
                              <div className="add_images_upload">
                                <BsPlusLg
                                  className={`w-4 h-4 text-dblue  ${
                                    handleFileLimit() && "opacity-50"
                                  }`}
                                />
                                <input
                                  type="file"
                                  id="fileUpload"
                                  multiple
                                  onChange={(e) => onFileChange(e)}
                                  onClick={(event) => {
                                    event.target.value = null;
                                  }}
                                  disabled={handleFileLimit()}
                                  className="hidden"
                                  ref={hiddenFileInput}
                                  accept="image/png, image/jpeg, image/jpg"
                                />
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 justify-center">
                              {ReviewImages?.slice(0, 5).map((img, index) => (
                                <div
                                  className="relative ml-2"
                                  key={Math.random()}
                                >
                                  <img
                                    src={URL.createObjectURL(img)}
                                    style={{
                                      height: "80px",
                                      width: "80px",
                                    }}
                                    className="h-14 w-14 sm:h-20 sm:w-20"
                                    alt=""
                                  />
                                  <button
                                    className="absolute z-10 bottom-0 w-full align-middle"
                                    style={{
                                      backgroundColor: "#00000066",
                                    }}
                                    onClick={() =>
                                      setImagess(
                                        ReviewImages.filter((e) => e !== img)
                                      )
                                    }
                                  >
                                    <FaTrash className="w-4 h-4 my-1 mr-auto ml-auto text-white " />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {exceededMaxnb && (
                            <div className="text-dbase">
                              Number of selected images exceeds maxNumber "5"
                            </div>
                          )}
                        </div>
                        {required && (
                          <span className="text-dbase text-d13 pt-1">
                            {required}
                          </span>
                        )}
                        <div className="flex pt-2">
                          <input
                            type="text"
                            className={
                              width > 650
                                ? "rounded w-full px-2 border-2 border-dinputBorder"
                                : "rounded w-full px-2 border-2 border-dinputBorder"
                            }
                            ref={textRef}
                            placeholder="Write a comment…"
                          />
                          <button
                            className="rounded bg-dblue mx-2 pl-2 pr-4 py-3 text-white"
                            onClick={(e) => addReview(e)}
                          >
                            <svg
                              className="h-6 w-6  transform rotate-45	"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              {" "}
                              <line x1="22" y1="2" x2="11" y2="13" />{" "}
                              <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>{" "}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default ProductPart2;

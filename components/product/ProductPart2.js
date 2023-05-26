import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import StarRatings from "react-star-ratings";
import Image from "next/image";
import useDeviceSize from "@/components/useDeviceSize";
import { BsPlusLg } from "react-icons/bs";
import SingleProduct from "./SingleProduct";
import { sanitizeHTML } from "../DompurifyUtils";
import Slider from "react-slick";
import Link from "next/link";

function ProductPart2(props) {
  const { titleRef, loader, productData2, data, reviews } = props; //data is for product part one data
  const [width, height] = useDeviceSize();
  const [starRating, setStarRating] = useState(0);
  const [ReviewImages, setReviewImages] = useState([]);
  const [exceededMaxnb, setExceededMaxNb] = useState(false);
  const [isDetails, setIsDetails] = useState(false);
  const hiddenFileInput = useRef(null);
  const textRef = useRef();
  const [required, setRequired] = useState();
  console.log(productData2);

  const PointsLoader = dynamic(() => import("../PointsLoader"), {
    ssr: false, // Disable server-side rendering
  });

  const color = {
    a: "#FFEBCD	",
    b: "#00BFFF",
    c: "#00BFFF",
    d: "#00BFFF",
    e: "#DC143C",
    f: "#bf1b26",
    g: "#008000",
    h: "#008000",
    i: "#008000",
    j: "#008000",
    k: "#008000",
    l: "#008000",
    m: "#008000",
    n: "#008000",
    o: "#F08080	",
    p: "#bf1b26",
    q: "#bf1b26",
    r: "#DC143C",
    t: "#FFD700",
    u: "#bf1b26",
    v: "#bf1b26",
    w: "#bf1b26",
    x: "#bf1b26",
    y: "#00BFFF",
    z: "#00BFFF",
    s: "#DC143C",
  };

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

  const productSetting = {
    speed: 200,
    slidesToShow: 7,
    slidesToScroll: 7,
    infinite: false,
    vertical: false,
    prevArrow: <CustomPrevArrows direction={"l"} />,
    nextArrow: <CustomNextArrows direction={"r"} />,
  };

  const productMobile = {
    dots: false,
    speed: 200,
    slidesToShow: 2.5,
    swipeToSlide: true,
    infinite: false,
    arrows: false,
    lazyLoad: true,
  };

  const moreSettings = {
    speed: 200,
    slidesToShow: 8,
    slidesToScroll: 7,
    vertical: false,
    infinite: false,
    prevArrow: <CustomPrevArrows direction={"l"} />,
    nextArrow: <CustomNextArrows direction={"r"} />,
  };

  function CustomPrevArrows({ direction, onClick, style, className }) {
    return (
      <div
        style={{ ...style, padding: "2px 5px" }}
        onClick={onClick}
        className="mySwiper"
      >
        <div className="swiper-button-prev"></div>
      </div>
    );
  }

  function CustomNextArrows({ direction, onClick, style, className }) {
    return (
      <div
        style={{ ...style, padding: "2px 5px" }}
        onClick={onClick}
        className="mySwiper"
      >
        <div className="swiper-button-next"></div>
      </div>
    );
  }

  return (
    <div className="">
      <div className=" mobile:overflow-hidden">
        <div className="w-full bg-white pb-2">
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
                                rating={
                                  productData2?.product_reviews?.avg_rating
                                }
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
                          If you recently purchased this product from ishtari,
                          you can add Review.
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
                                  {ReviewImages?.slice(0, 5).map(
                                    (img, index) => (
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
                                              ReviewImages.filter(
                                                (e) => e !== img
                                              )
                                            )
                                          }
                                        >
                                          <FaTrash className="w-4 h-4 my-1 mr-auto ml-auto text-white " />
                                        </button>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>

                              {exceededMaxnb && (
                                <div className="text-dbase">
                                  Number of selected images exceeds maxNumber
                                  "5"
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

                      {!productData2?.product_reviews?.reviews &&
                        productData2?.product_reviews?.reviews?.length < 1 &&
                        (width >= 650 ? (
                          <div className="px-1 py-1 bg-dinputBorder w-1/4 font-light text-center text-d12 mt-3">
                            There are no customer reviews or customer ratings.
                          </div>
                        ) : (
                          <div className="px-1 py-1 bg-dinputBorder w-full font-light text-center text-d12 mt-3">
                            There are no customer reviews or customer ratings.
                          </div>
                        ))}
                      {data?.product_reviews?.totals > 0 && (
                        <div
                          className="font-bold text-xl border-b border-dinputBorder px-4 pt-8 pb-2"
                          ref={commentRef}
                        >
                          {data?.product_reviews?.totals} Customer Reviews
                        </div>
                      )}

                      {/* {productData2.product_related.map((item, index) => {
                    return (
                      <div className="pr-2" key={item.product_id}>
                        <SingleProduct
                          // likedData={likedData}
                          item={item}
                        />
                      </div>
                    );
                  })} */}

                      <div className="mt-2">
                        {reviews?.map((r) => (
                          <div className="border-b-2 border-dinputBorder pb-2">
                            <div className="mt-4 flex justify-start items-center flex-row space-x-2.5 ">
                              <div
                                className="flex rounded-full w-14 h-14 border-2 text-white  text-d22 items-center justify-center"
                                style={{
                                  backgroundColor:
                                    color[
                                      r.name
                                        .replace(/\s+/g, "")
                                        .charAt(0)
                                        .toLowerCase()
                                    ] || "red",
                                  minWidth: "56px",
                                }}
                              >
                                {r.name
                                  .replace(/\s+/g, "")
                                  .charAt(0)
                                  .toUpperCase()}{" "}
                              </div>
                              <div className="flex flex-col justify-start ">
                                <div className="flex">
                                  <p className="text-base font-bold pr-3 w-48">
                                    {r?.name}
                                  </p>
                                  {r.check_purchase && (
                                    <div className="flex items-center justify-center text-d12 border-l-2 border-dinputBorder pl-2 pr-3">
                                      <svg
                                        width="13"
                                        height="13"
                                        className=" mr-2"
                                        viewBox="0 0 13 13"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          fill-rule="evenodd"
                                          clip-rule="evenodd"
                                          d="M5.07262 9.64218L2.67767 7.24723L3.52189 6.403L5.07262 7.94775L9.0183 4.00206L9.86252 4.85227L5.07262 9.64218ZM6.2701 0.661133C2.96506 0.661133 0.282715 3.34348 0.282715 6.64851C0.282715 9.95355 2.96506 12.6359 6.2701 12.6359C9.57513 12.6359 12.2575 9.95355 12.2575 6.64851C12.2575 3.34348 9.57513 0.661133 6.2701 0.661133Z"
                                          fill="#3866DF"
                                        ></path>
                                      </svg>
                                      <p className="item-center justified-item mt-1">
                                        Verified Purchase
                                      </p>
                                    </div>
                                  )}
                                </div>
                                <div className="flex -mt-1.5">
                                  <StarRatings
                                    starDimension="18px"
                                    size="13"
                                    starSpacing="1px"
                                    starEmptyColor="#e3e3e3"
                                    starRatedColor="#f5a523"
                                    rating={parseInt(r.rating)}
                                  />
                                </div>

                                <p
                                  className="text-sm leading-none  font-d11 pt-1"
                                  style={{ color: "rgb(189, 189, 189)" }}
                                >
                                  {/* {r.reviews.text} */}
                                  {r?.date_added
                                    .replace("-", " ")
                                    .replace("-", " ")}
                                </p>
                              </div>
                            </div>
                            <div className="images flex flex-wrap gap-1 my-4">
                              {r?.images.map((img) => (
                                <div className="mr-2">
                                  <img
                                    src={img}
                                    alt=""
                                    className="w-14 h-14 sm:w-20 sm:h-20"
                                  />
                                </div>
                              ))}
                            </div>
                            <div className="text-sm leading-none   pt-3 ">
                              {r?.text}
                            </div>
                          </div>
                        ))}
                        {/* {productData2?.product_reviews?.total_pages > 1 && (
                      <ReactPaginate
                        pageCount={Math.ceil(
                          productData2?.product_reviews?.total_pages
                        )}
                        containerClassName={"product-pagination"}
                        onPageChange={pageSetter}
                        pageRangeDisplayed={-1}
                        marginPagesDisplayed={0}
                        previousLabel={
                          <div
                            className={`flex ${
                              pageValue === 1 &&
                              "pointer-events-none opacity-50"
                            }`}
                          >
                            <IoIosArrowBack />{" "}
                            <span className="text-d13 ml-1">Previous Page</span>{" "}
                          </div>
                        }
                        activeClassName={"active-pagination-product"}
                        nextLinkClassName={"bg-dgreyPrev  w-32 pr-1"}
                        previousLinkClassName={
                          "bg-dgreyPrev items-center	justify-center"
                        }
                        nextLabel={
                          <div
                            className={`flex ml-2 p-0 ${
                              pageValue ===
                                productData2?.product_reviews?.total_pages &&
                              "pointer-events-none opacity-50"
                            }`}
                          >
                            {" "}
                            <span className="text-d13 mr-1">
                              Next Page
                            </span>{" "}
                            <IoIosArrowForward className="" />{" "}
                          </div>
                        }
                      />
                    )} */}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      {/* Poduct Details for Mobile :) */}
      <div className="my-2 container bg-white mobile:hidden">
        <div
          className="flex justify-between items-center"
          onClick={() => setIsDetails((prev) => !prev)}
        >
          <p className="font-semibold text-xl py-2 text-dblack mb-1">
            Product Details
          </p>
          {/* <i
              className={
                !isDetails
                  ? "icon icon-angle-right text-dgrey1 text-2xl transition-all"
                  : "icon icon-angle-down text-dgrey1 text-2xl transition-all"
              }
            ></i> */}
        </div>
        <div
          className={!isDetails ? "hidden" : "block"}
          id="desc"
          dangerouslySetInnerHTML={{
            __html: sanitizeHTML(data.description),
          }}
        />
      </div>

      {/* Related Product */}
      {productData2?.product_related &&
        productData2?.product_related?.length > 0 && (
          <div className="bg-white">
            <div className="border-t-8 border-dinputBorder bg-dinputBorder"></div>
            <div
              className={`mb-2 mt-4  px-8 ${
                width > 1920 && "mt-10"
              }  container`}
            >
              <p className="pr-semibold text-xl py-2 text-dblack mb-1 md:mb-4">
                Related products
              </p>
              {width < 650 ? (
                <Slider {...productMobile}>
                  {productData2.product_related.map((item, index) => {
                    return (
                      <div className="pr-2" key={item.product_id}>
                        <SingleProduct item={item} />
                      </div>
                    );
                  })}
                </Slider>
              ) : (
                <Slider {...productSetting} className="product-carousel">
                  {productData2.product_related.map((item) => (
                    <div className="pr-2" key={item.product_id}>
                      <SingleProduct item={item} />
                    </div>
                  ))}
                </Slider>
              )}
            </div>
          </div>
        )}

      {productData2?.product_categories &&
        // !loader &&
        productData2?.product_categories?.length > 0 && (
          <div className="w-full px-6 my-2 bg-white  ">
            <div className="container pb-2 md:pb-8">
              <p className="pr-semibold text-xl text-dblack mb-4 pt-2 md:pt-8">
                More to explore
              </p>
              {width < 650 ? (
                <div className="flex overflow-x-scroll">
                  {productData2.product_categories?.map((category) => (
                    <Link
                      key={category.category_id}
                      // href={`${path}/category/${category.category_id}`}
                      href={`/`}
                      className="cursor-pointer hover:opacity-80 min-w-max mr-4"
                    >
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={128}
                        height={128}
                        className=" w-32 block mx-auto"
                      />
                      <p
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHTML(category.name),
                        }}
                        className="text-center mt-4 font-semibold text-sm"
                      ></p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div>
                  <Slider {...moreSettings} className="categories-carousel">
                    {productData2?.product_categories?.map((category) => (
                      <Link
                        key={category.category_id}
                        // href={`${path}/${category.name
                        //   .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                        //   .replace(/\s+/g, "-")
                        //   .replaceAll("%", parseInt("%"))
                        //   .replaceAll("/", "-")
                        //   .replaceAll("#", parseInt("#"))
                        //   .replace(/'/g, "")}/c=${category.category_id}`}
                        href={"/"}
                        className="cursor-pointer hover:opacity-80  mr-4"
                      >
                        <Image
                          src={category.image}
                          alt={category.name}
                          width={128}
                          height={128}
                          className=" w-32 block mx-auto"
                        />
                        <p
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHTML(category.name),
                          }}
                          className="text-center mt-4 font-semibold text-sm line-clamp-2"
                        ></p>
                      </Link>
                    ))}
                  </Slider>
                </div>
              )}
            </div>
          </div>
        )}


      {productData2?.smallest_cat_products &&
        productData2?.smallest_cat_products?.length > 0 && (
          <div className=" w-full px-6 bg-white pt-1">
            <div className="container pb-2 md:pb-8">
              <p className="pr-semibold text-xl text-dblack mb-4 pt-2 md:pt-8">
                {productData2.product_categories[0]?.name}
              </p>
              {width < 650 ? (
                <Slider {...productMobile}>
                  {productData2.smallest_cat_products.map((item) => (
                    <SingleProduct item={item}></SingleProduct>
                  ))}
                </Slider>
              ) : (
                <div>
                  <Slider {...moreSettings}>
                    {productData2?.smallest_cat_products?.map((item) => (
                      <SingleProduct item={item}></SingleProduct>
                    ))}
                  </Slider>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
}

export default ProductPart2;

import { useEffect, useState, useRef, useContext } from "react";
import { axiosServer } from "@/axiosServer";
import { AccountContext } from "@/contexts/AccountContext";
import { useRouter } from "next/router";
import useDeviceSize from "@/components/useDeviceSize";
import dynamic from "next/dynamic";
import buildLink from "@/urls";
import StarRatings from "react-star-ratings";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import Head from "next/head";


export async function getServerSideProps(context){
  const session = await getServerSession(context.req, context.res, authOptions);
  let isLogged= false;

  if(session){
   isLogged = true
  }

  return {
    props: { isLogged },
  }
}

export default function OrderReviews(props) {
  const [data, setData] = useState();
  const [width, height] = useDeviceSize();
  const [loading, setLoading] = useState(true);
  const textRef = useRef();
  const [required, setRequired] = useState("");
  const [keyy, setKeyy] = useState("");
  const [err, setErr] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [selected, setSelected] = useState([]);
  const [review, setReview] = useState(1);
  const [orderId, setOrderId] = useState();
  const [state, dispatch] = useContext(AccountContext);
  const [ratingstar, setRatingstar] = useState(0);
  const [reviews, setReviews] = useState([]);
  const router = useRouter();
  let id = router.query["order-review-id"];

  const PointsLoader = dynamic(() => import("@/components/PointsLoader"), {
    ssr: false, // Disable server-side rendering
  });

  let commentErr = " ";

  useEffect(() => {
    if (!props.isLogged) {
      dispatch({ type: "setShowOver", payload: true });
      dispatch({ type: "setShowLogin", payload: true });
    } else {
      dispatch({ type: "setShowOver", payload: false });
      dispatch({ type: "setShowLogin", payload: false });
    }
  }, [data]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    let params = new URLSearchParams(window.location.href);

    if (id === undefined || id === "") {
      id = params.get("orderId");
      setOrderId(id);
    }

    if (params.get("productId")) {
      if (params.get("review")) {
        setReview(params.get("review"));
      }
      axiosServer
        .get(
          buildLink("product", undefined, window.innerWidth) +
            params.get("productId") +
            "&get_disabled=true&part_one"
        )
        .then((response) => {
          if (response.data.success) {
            setData(response.data.data);
            setLoading(false);
          } else {
            setLoading(false);
            dispatch({ type: "setLoading", payload: false });
          }
        });
    } else {
      axiosServer
        .get(buildLink("order_details", undefined, window.innerWidth) + id)
        .then((response) => {
          if (response.data.success) {
            setData(response.data.data);
            console.log(response.data.data);
            setLoading(false);
            const reviewsData = response.data.data.products.map((product) => ({
              product_id: product.product_id,
              rating: product.review.rating,
              comment: product.review.text,
            }));
            setReviews(reviewsData);
          } else {
            setLoading(false);
            dispatch({ type: "setLoading", payload: false });
          }
        });
    }
  }, [id]);


  function addReview(product_id, key) {
    setRequired("");
    setErr("");
    const review = reviews.find((review) => review.product_id === product_id);
    console.log(review);
    if (review.rating !== "0") {
      setRequired("");
      var formData = new FormData(); // Currently empty

      formData.append("product_id", product_id);
      formData.append("rating", review.rating);
      formData.append("comment", review.comment);
      formData.append("images", []);
      axiosServer
        .post(buildLink("reviews", undefined, window.innerWidth), formData)
        .then((response) => {
          const data = response.data;
          if (data.success === true) {
            setReviewSuccess(true);
            setSelected([...selected, key]);
          } else {
            commentErr = data.error;
            setErr(commentErr);
          }
        });
    } else {
      setRequired("Please provide a rating");
    }
  }

  const handleCommentChange = (productId, event) => {
    const updatedReviews = reviews.map((review) => {
      if (review.product_id === productId) {
        return { ...review, comment: event.target.value };
      }
      return review;
    });
    setReviews(updatedReviews);
  };

  const handleStarRatingChange = (productId, rating) => {
    const updatedReviews = reviews.map((review) => {
      if (review.product_id === productId) {
        return { ...review, rating };
      }
      return review;
    });
    setReviews(updatedReviews);
  };



  return (
    <div className="container">
      <Head>
        <title>My Account | ishtari</title>
      </Head>
      {loading ? (
        <PointsLoader />
      ) : (
        state.loged && (
          <div>
            <div>
              <p className="text-center pr-semibold text-d22 pt-6 tracking-wider">
                Provide Your Review
              </p>
            </div>
            <div className="flex justify-between mt-5 text-sm font-bold p2-4 px-8">
              {data?.order_id > 0 && (
                <p>#{data?.order_id > 0 ? data?.order_id : orderId}</p>
              )}
              <p>{data?.date_added}</p>
            </div>
            <div className="p-8 overflow-auto">
              {width < 650 ? (
                <table className="table-fixed  w-full">
                  <tbody>
                    {data?.products?.length > 0 &&
                      data?.products?.map((data, key) => (
                        <>
                          <tr className="mt-12">
                            <td className="w-16  border-b  border-dinputBorder bg-dinputBorder text-center">
                              #
                            </td>
                            <td className="px-3 py-2 border-b  border-dinputBorder text-d22 bg-dinputBorder">
                              {key + 1}
                            </td>
                          </tr>
                          <tr className="">
                            <td className="w-16 p-2 border-b  border-dinputBorder ">
                              Image:
                            </td>
                            <td className="p-2 border-b  border-dinputBorder ">
                              <img
                                className="w-12"
                                src={data.image}
                                alt={data.name}
                              />
                            </td>
                          </tr>
                          <tr className="">
                            <td className=" p-2 border-b  border-dinputBorder align-top">
                              Product:
                            </td>
                            <td className=" p-2 border-b  border-dinputBorder flex items-center ">
                              <span>{data.name}</span>
                            </td>
                          </tr>

                          <tr className="">
                            <td className="w-20 p-2 border-b  border-dinputBorder">
                              sku:
                            </td>
                            <td className="w-20 py-2 px-2 border-b  border-dinputBorder">
                              {data.model}
                            </td>
                          </tr>

                          <tr className="">
                            <td className="w-20 p-1   border-dinputBorder">
                              Rating:
                            </td>
                            <td className=" py-2   border-dinputBorder">
                              <div className="">
                                <StarRatings
                                  starDimension="24px"
                                  starSpacing="1px"
                                  isSelectable="true"
                                  containerClassName="flex mr-2"
                                  starEmptyColor="#e3e3e3"
                                  starRatedColor="#f5a523"
                                  starHoverColor="#f5a523"
                                  rating={parseFloat(
                                    reviews.find(
                                      (review) =>
                                        review.product_id === data.product_id
                                    )?.rating || 0
                                  )}
                                  changeRating={(rating) =>
                                    handleStarRatingChange(
                                      data.product_id,
                                      rating
                                    )
                                  }
                                />
                                <div
                                  className="text-dbase my-1 italic text-sm"
                                  key={key}
                                >
                                  {required !== null && key === keyy && (
                                    <div>{required}</div>
                                  )}
                                </div>
                              </div>

                              {/* <input
                                className="hidden"
                                name={key}
                                value={data.review.rating}
                              /> */}
                              <div className="flex pt-2">
                                <input
                                  id={"t" + data.product_id}
                                  defaultValue={
                                    data.review.text
                                      ? data.review.text.replace(/"/g, "")
                                      : ""
                                  }
                                  type="text"
                                  className={
                                    "rounded w-full h-12 px-2 border-2 border-dinputBorder"
                                  }
                                  placeholder="Write a comment…"
                                  ref={textRef}
                                  onChange={(e) =>
                                    handleCommentChange(data.product_id, e)
                                  }
                                />
                              </div>
                              {err && key === keyy && (
                                <div className="text-sm mt-2 text-dbase italic">
                                  {err}
                                </div>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td></td>
                            <td>
                              <div className="relative">
                                {" "}
                                <button
                                  className="w-full rounded bg-dblue  px-2 py-3 text-white flex items-center justify-center mb-6"
                                  onClick={() => {
                                    setKeyy(key);
                                    addReview(data.product_id, key);
                                  }}
                                >
                                  <svg
                                    className="h-6 w-6  transform rotate-45"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    {" "}
                                    <line x1="22" y1="2" x2="11" y2="13" />{" "}
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                  </svg>{" "}
                                </button>
                                {reviewSuccess && selected.includes(key) && (
                                  <button
                                    className=" w-full px-2 absolute rounded bg-dgreen mx-2 pl-2 pr-2 py-2 flex 
                                    items-center justify-center  -right-2 mb-6 top-0"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 48 48"
                                      width="32px"
                                      height="32px"
                                    >
                                      <path
                                        fill="#FFFFFF"
                                        d="M40.6 12.1L17 35.7 7.4 26.1 4.6 29 17 41.3 43.4 14.9z"
                                      />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        </>
                      ))}

                    {data && !data?.products && (
                      <>
                        <tr className="mt-12">
                          <td className="w-16  border-b  border-dinputBorder bg-dinputBorder text-center">
                            #
                          </td>
                          <td className="px-3 py-2 border-b  border-dinputBorder text-d22 bg-dinputBorder">
                            {1}
                          </td>
                        </tr>
                        <tr className="">
                          <td className="w-16 p-2 border-b  border-dinputBorder ">
                            Image:
                          </td>
                          <td className="p-2 border-b  border-dinputBorder ">
                            <img
                              className="w-12"
                              src={data.mobile_image}
                              alt={data.name}
                            />
                          </td>
                        </tr>
                        <tr className="">
                          <td className=" p-2 border-b  border-dinputBorder align-top">
                            Product:
                          </td>
                          <td className=" p-2 border-b  border-dinputBorder flex items-center ">
                            <span>{data.name}</span>
                          </td>
                        </tr>

                        <tr className="">
                          <td className="w-20 p-2 border-b  border-dinputBorder">
                            sku:
                          </td>
                          <td className="w-20 py-2 px-2 border-b  border-dinputBorder">
                            {data.model}
                          </td>
                        </tr>

                        <tr className="">
                          <td className="w-20 p-1   border-dinputBorder">
                            Rating:
                          </td>
                          <td className=" py-2   border-dinputBorder">
                            <div className="">
                            <StarRatings
                                isSelectable="true"
                                starClassName={"r" + data.product_id}
                                starDimension="22"
                                starSpacing="1px"
                                containerClassName="flex mr-2"
                                starEmptyColor="#e3e3e3"
                                starRatedColor="#f5a523"
                                starHoverColor="#f5a523"
                                rating={parseFloat(
                                  reviews.find(
                                    (review) =>
                                      review.product_id === data.product_id
                                  )?.rating || 0
                                )}
                                changeRating={(rating) =>
                                  handleStarRatingChange(
                                    data.product_id,
                                    rating
                                  )
                                }
                              />
                              <div
                                className="text-dbase my-1 italic text-sm"
                                key={1}
                              >
                                {required !== null && 1 === keyy && (
                                  <div>{required}</div>
                                )}
                              </div>
                            </div>

                            {/* <input
                              className="hidden"
                              name={1}
                              value={data?.review?.rating}
                            /> */}
                            <div className="flex pt-2">
                              <input
                                id={"t" + data.product_id}
                                defaultValue={
                                  data.review.text
                                    ? data.review.text.replace(/"/g, "")
                                    : ""
                                }
                                type="text"
                                className={
                                  "rounded w-full h-12 px-2 border-2 border-dinputBorder"
                                }
                                placeholder="Write a comment…"
                                ref={textRef}
                                onChange={(e) =>
                                  handleCommentChange(data.product_id, e)
                                }
                              />
                            </div>
                            {err && 1 === keyy && (
                              <div className="text-sm mt-2 text-dbase italic">
                                {err}
                              </div>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td>
                            <div className="relative">
                              {" "}
                              <button
                                className="w-full rounded bg-dblue  px-2 py-3 text-white flex items-center justify-center mb-6"
                                onClick={() => {
                                  setKeyy(1);
                                  addReview(data?.product_id, 1);
                                }}
                              >
                                <svg
                                  className="h-6 w-6  transform rotate-45"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  {" "}
                                  <line x1="22" y1="2" x2="11" y2="13" />{" "}
                                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>{" "}
                              </button>
                              {reviewSuccess && selected.includes(1) && (
                                <button
                                  className=" w-full px-2 absolute rounded bg-dgreen mx-2 pl-2 pr-2 py-2 flex 
                                    items-center justify-center  -right-2 mb-6 top-0"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 48 48"
                                    width="32px"
                                    height="32px"
                                  >
                                    <path
                                      fill="#FFFFFF"
                                      d="M40.6 12.1L17 35.7 7.4 26.1 4.6 29 17 41.3 43.4 14.9z"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              ) : (
                <table className="table-fixed  w-full">
                  <thead>
                    <tr>
                      <th className="font-bold p-2 border-b border-dinputBorder w-20">
                        #
                      </th>
                      <th className="font-bold p-2 border-b border-dinputBorder">
                        Product
                      </th>
                      <th className="font-bold  py-2 px-4 border-b border-dinputBorder w-18">
                        Sku
                      </th>
                      <th className=" font-bold  py-2 px-4 border-b border-dinputBorder">
                        Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.products?.map((data, key) => (
                      <tr className="">
                        <td className="p-2 border-b  border-dinputBorder ">
                          <img
                            className="w-12"
                            src={data.image}
                            alt={data.name}
                          />
                        </td>
                        <td className="p-2 border-b  border-dinputBorder">
                          {data.name}
                        </td>
                        <td className="py-2 px-4 border-b  border-dinputBorder text-center">
                          {data.model}
                        </td>
                        <td className=" w-1/3 py-2 px-4 border-b  border-dinputBorder">
                          <>
                            <div className="">
                              <StarRatings
                                isSelectable="true"
                                starClassName={"r" + data.product_id}
                                starDimension="22"
                                starSpacing="1px"
                                containerClassName="flex mr-2"
                                starEmptyColor="#e3e3e3"
                                starRatedColor="#f5a523"
                                starHoverColor="#f5a523"
                                rating={parseFloat(
                                  reviews.find(
                                    (review) =>
                                      review.product_id === data.product_id
                                  )?.rating || 0
                                )}
                                changeRating={(rating) =>
                                  handleStarRatingChange(
                                    data.product_id,
                                    rating
                                  )
                                }
                              />
                              <div
                                className="flex items-center text-dbase text-sm italic my-1"
                                key={key}
                              >
                                {required !== null && key === keyy && (
                                  <div>{required}</div>
                                )}
                              </div>
                            </div>
                            {/* <input
                              className="hidden"
                              name={key}
                              value={data.review.rating}
                            /> */}
                          </>
                          <div className="flex pt-2 relative">
                            <>
                              <input
                                id={"t" + data.product_id}
                                type="text"
                                className={
                                  "rounded w-full px-2 border-2 border-dinputBorder"
                                }
                                defaultValue={
                                  data.review.text
                                    ? data.review.text.replace(/"/g, "")
                                    : ""
                                }
                                ref={textRef}
                                key={key}
                                onChange={(e) =>
                                  handleCommentChange(data.product_id, e)
                                }
                                placeholder="Write a comment…"
                              />
                            </>

                            <button
                              className="rounded bg-dblue mx-2 pl-2 pr-4 py-3 text-white"
                              onClick={() => {
                                setKeyy(key);

                                addReview(data.product_id, key);
                              }}
                            >
                              <svg
                                className="h-6 w-6  transform rotate-45	"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                {" "}
                                <line x1="22" y1="2" x2="11" y2="13" />{" "}
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                              </svg>{" "}
                            </button>
                            {reviewSuccess && selected.includes(key) && (
                              <button className="absolute rounded bg-dgreen mx-2 pl-2 pr-2 py-2 right-0">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 48 48"
                                  width="32px"
                                  height="32px"
                                >
                                  <path
                                    fill="#FFFFFF"
                                    d="M40.6 12.1L17 35.7 7.4 26.1 4.6 29 17 41.3 43.4 14.9z"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                          {err && key === keyy && (
                            <div className="text-sm mt-2 text-dbase italic ">
                              {err}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}

                    {!data?.products && data && (
                      <tr className="">
                        <td className="p-2 border-b  border-dinputBorder ">
                          <img
                            className="w-12"
                            src={data.mobile_image}
                            alt={data.name}
                          />
                        </td>
                        <td className="p-2 border-b  border-dinputBorder">
                          {data.name}
                        </td>
                        <td className="py-2 px-4 border-b  border-dinputBorder text-center">
                          {data.model}
                        </td>
                        <td className=" w-1/3 py-2 px-4 border-b  border-dinputBorder">
                          <>
                            <div className="">
                            <StarRatings
                                isSelectable="true"
                                starClassName={"r" + data.product_id}
                                starDimension="22"
                                starSpacing="1px"
                                containerClassName="flex mr-2"
                                starEmptyColor="#e3e3e3"
                                starRatedColor="#f5a523"
                                starHoverColor="#f5a523"
                                rating={parseFloat(
                                  reviews.find(
                                    (review) =>
                                      review.product_id === data.product_id
                                  )?.rating || 0
                                )}
                                changeRating={(rating) =>
                                  handleStarRatingChange(
                                    data.product_id,
                                    rating
                                  )
                                }
                              />
                              <div
                                className="flex items-center text-dbase text-sm italic my-1"
                                key={1}
                              >
                                {required !== null && 1 === keyy && (
                                  <div>{required}</div>
                                )}
                              </div>
                            </div>
                            {/* <input className="hidden" name={1} value={review} /> */}
                          </>
                          <div className="flex pt-2 relative">
                            <>
                              <input
                                id={"t" + data.product_id}
                                type="text"
                                className={
                                  "rounded w-full px-2 border-2 border-dinputBorder"
                                }
                                defaultValue={
                                  data.review.text
                                    ? data.review.text.replace(/"/g, "")
                                    : ""
                                }
                                ref={textRef}
                                key={1}
                                onChange={(e) =>
                                  handleCommentChange(data.product_id, e)
                                }
                                placeholder="Write a comment…"
                              />
                            </>

                            <button
                              className="rounded bg-dblue mx-2 pl-2 pr-4 py-3 text-white"
                              onClick={() => {
                                setKeyy(1);

                                addReview(data.product_id, 1);
                              }}
                            >
                              <svg
                                className="h-6 w-6  transform rotate-45	"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                {" "}
                                <line x1="22" y1="2" x2="11" y2="13" />{" "}
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                              </svg>{" "}
                            </button>
                            {reviewSuccess && selected.includes(1) && (
                              <button className="absolute rounded bg-dgreen mx-2 pl-2 pr-2 py-2 right-0">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 48 48"
                                  width="32px"
                                  height="32px"
                                >
                                  <path
                                    fill="#FFFFFF"
                                    d="M40.6 12.1L17 35.7 7.4 26.1 4.6 29 17 41.3 43.4 14.9z"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                          {err && 1 === keyy && (
                            <div className="text-sm mt-2 text-dbase italic ">
                              {err}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}

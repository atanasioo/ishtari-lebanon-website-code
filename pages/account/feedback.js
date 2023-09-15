import { axiosServer } from "@/axiosServer";
import { AccountContext } from "@/contexts/AccountContext";
import { useContext } from "react";
import UserSidebar from "@/components/account/UserSidebar";
import UserSidebarMobile from "@/components/account/UserSidebarMobile";
import PointsLoader from "@/components/PointsLoader";
import useDeviceSize from "@/components/useDeviceSize";
import buildLink from "@/urls";
import { getServerSession } from "next-auth";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import StarRatings from "react-star-ratings";
import { authOptions } from "../api/auth/[...nextauth]";
import { useRouter } from "next/router";
import cookie from "cookie";
import { getHost } from "@/functions";
function feedback() {
  const [width] = useDeviceSize();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [required, setRequired] = useState("");
  const [success, setSucess] = useState("")
  const [activeService, setActiveService] = useState(0);
  const [showSubmitBtn, setShowSubmitBtn] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [state, dispatch] = useContext(AccountContext);
  const router = useRouter()

  useEffect(() => {
    axiosServer
      .get(buildLink("getcustomerfeedback", undefined, window.innerWidth))
      .then((response) => {
        const data = response.data.data;
        setData(data);
        const feedbacksData = response.data.data.map((service) => ({
          service_id: !service.is_general ? service.service_id : "general",
          rating: !service.is_general ? service.rate : "",
          comment: !service.is_general
            ? service.service_comment
            : service.comment,
        }));
        setFeedbacks(feedbacksData);
        setLoading(false);
        if (!state.loged) {
          router.push("/");
        }
      });
  }, []);


  function handleActiveService(operation) {
    if (operation === "inc") {
      setActiveService(activeService + 1);
      if (activeService === data.length - 2) {
        setShowSubmitBtn(true);
      }
    } else {
      setActiveService(activeService - 1);
      if (activeService !== data.length - 2) {
        setShowSubmitBtn(false);
      }
    }
  }

  function handleSubmit() {
    setRequired("");
    setSucess("");
    var obj = {
      data: [],
    };
    const generalFeedback = feedbacks.find(
      (feedback) => feedback.service_id === "general"
    );
    if (generalFeedback.comment === "") {
      setRequired("General Feedback is required!");
    } else {
      obj["data"][0] = {
        comment: generalFeedback.comment,
        src: "",
        version_number: "",
      };
      for (let index = 1; index < data.length; index++) {
        const feedback = feedbacks[index];
        obj["data"][index] = {
          serveice_id: feedback.service_id, //maktube ghalat mn l backend
          service_comment: feedback.comment,
          rate: feedback.rating,
        };
      }
      axiosServer
        .put(
          buildLink("editcustomerfeedback", undefined, window.innerWidth),
          obj
        )
        .then((response) => {
          if(response.data.success){
            setSucess(response.data.message);
          }
        });
    }
  }

  function handleStarRatingChange(service_id, rating) {
    const updatedFeedbacks = feedbacks.map((feedback) => {
      if (feedback.service_id === service_id) {
        return { ...feedback, rating };
      }
      return feedback;
    });
    setFeedbacks(updatedFeedbacks);
  }

  const handleCommentChange = (service_id, event) => {
    const updatedFeedbacks = feedbacks.map((feedback) => {
      if (feedback.service_id === service_id) {
        return { ...feedback, comment: event.target.value };
      }
      return feedback;
    });
    setFeedbacks(updatedFeedbacks);
  };

  return (
    <div className="container text-dblack">
      <Head>
        <title>My Account | ishtari</title>
      </Head>
      <div className="pb-2">
        <div className="flex-row md:flex">
          <div className="w-full mb-3 md:w-1/5">
            {width > 650 ? (
              <UserSidebar active={"feedback"} />
            ) : (
              <UserSidebarMobile active={"feedback"} />
            )}
          </div>
          <div className="w-full md:w-4/5 px-2 md:px-0 md:pl-8 mb-5">

          {loading ? (
            <div className="flex justify-center w-full">
              <PointsLoader />
            </div>
          ) : (
            <div className="w-full flex flex-col gap-10">
              <div className="relative flex justify-center">
                <div className="banner-image w-full flex justify-center">
                  <img
                    src={"/images/feedback-website.png"}
                    width={1100}
                    height={200}
                    className="w-full hidden md:block"
                    alt="feedback_banner"
                  />
                  <img
                    src={"/images/feedback.png"}
                    width={1100}
                    height={200}
                    className="w-full md:hidden"
                    alt="feedback_banner_mobile"
                  />
                </div>
                {data?.map((service, i) => (
                  <div
                    className={`starts-div absolute z-10 rounded-lg bg-white text-dgreyProduct text-sm md:text-d18 shadow-md italic px-6 py-1.5 -bottom-4 ${
                      activeService === i ? "" : "hidden"
                    }`}
                    key={i}
                  >
                    {service.is_general ? (
                      <div className="">We appreciate your feedback</div>
                    ) : (
                      <div>
                        <StarRatings
                          starDimension="24px"
                          starSpacing="1px"
                          isSelectable="true"
                          containerClassName="flex mr-2"
                          starEmptyColor="#e3e3e3"
                          starRatedColor="#f5a523"
                          starHoverColor="#f5a523"
                          rating={parseFloat(
                            feedbacks.find(
                              (feedback) =>
                                feedback.service_id === service.service_id
                            )?.rating || 0
                          )}
                          changeRating={(rating) =>
                            handleStarRatingChange(service.service_id, rating)
                          }
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {required.length > 0 && (
                <div className="alert rounded-md text-dbase  text-d20 text-center">
                  {required}
                </div>
              )}
              {success.length > 0 && (
                <div className="alert rounded-md text-dgreen text-d20 text-center">
                  {success}
                </div>
              )}

              {data?.map((service, i) => (
                <div
                  className={`mt-7 flex flex-col justify-center items-center gap-5 ${
                    activeService === i ? "" : "hidden"
                  }`}
                  key={i}
                >
                  <div className=" pr-semibold text-d20">
                    {service.is_general ? (
                      <div>General Feedback</div>
                    ) : (
                      <div>{service.service_name}</div>
                    )}
                  </div>

                  <textarea
                    id={`feedback${i}`}
                    className="w-11/12 md:w-3/4 h-44 rounded-lg shadow-lg p-5 text-sm"
                    placeholder="There is no failure. Only feedback."
                    defaultValue={
                      service.is_general
                        ? service.comment
                        : service.service_comment
                    }
                    onChange={(e) =>
                      handleCommentChange(
                        !service.is_general ? service.service_id : "general",
                        e
                      )
                    }
                  ></textarea>
                </div>
              ))}

              <div className="service-pagination flex w-full justify-center gap-5 mt-10">
                <div
                  className={`arrow-left rounded-lg shadow-md bg-white p-3 cursor-pointer ${
                    activeService === 0 ? "hidden" : ""
                  }`}
                  onClick={() => handleActiveService("dec")}
                >
                  <BsArrowLeft className="w-6 h-6" />
                </div>

                <div
                  className={`arrow-left-hidden bg-transparent p-3 cursor-pointer w-12 ${
                    activeService === 0 ? "" : "hidden"
                  }`}
                ></div>

                <div className="page-nb bg-white rounded-lg shadow-md p-3 w-24 text-center text-d18">
                  {activeService + 1}
                </div>
                <div
                  className={`arrow-right rounded-lg shadow-md bg-white p-3 cursor-pointer ${
                    showSubmitBtn ? "hidden" : ""
                  }`}
                  onClick={() => handleActiveService("inc")}
                >
                  <BsArrowRight className="w-6 h-6" />
                </div>
                <div
                  className={`submit-btn rounded-lg shadow-md bg-white p-3 cursor-pointer ${
                    showSubmitBtn ? "" : "hidden"
                  }`}
                  onClick={() => handleSubmit()}
                >
                  <AiOutlineCheck className="w-6 h-6" />
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

export default feedback;

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const { req } = context;

  // if (!session) {
  //   //check whether the user is logged using facebook login

  //   var site_host = "";
  //   let host_url = "";

  //   const host = req.headers.host;

  //   let token = "";

  //   const cookies = req?.headers.cookie || "";
  //   if (typeof cookies !== "undefined" && cookies !== "") {
  //     const parsedCookies = cookie?.parse(cookies);
  //     site_host = parsedCookies["site-local-name"];
  //     token = parsedCookies["api-token"];

  //     if (typeof site_host === "undefined") {
  //       site_host = host;
  //     }
  //   }

  //   host_url = await getHost(site_host);
  //   try {
  //     const response = await axiosServer.get(
  //       buildLink("login", undefined, undefined, host_url),
  //       {
  //         headers: {
  //           Authorization: "Bearer " + token,
  //         },
  //       }
  //     );
  //     console.log(response.data);
  //     if (response.data.customer_id === 0) {
  //       return {
  //         redirect: {
  //           destination: "/",
  //           permanent: false,
  //         },
  //       };
  //     }
  //   } catch(error) {
  //     return {
  //       redirect: {
  //         destination: "/",
  //         permanent: false,
  //       },
  //     };
  //   }
  // }

  return {
    props: {},
  };
}
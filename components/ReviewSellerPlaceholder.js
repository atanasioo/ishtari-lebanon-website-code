import React from "react";
import { AiFillStar } from "react-icons/ai";

export default function reviewSellerPlaceholderMobile() {
  return (
    <div className="container">
      <div className="placeholder_animation relative w-full h-48 flex justify-center items-center text-6xl uppercase font-sans bg-dlabelColor bg-opacity-30">
        <div className="absolute z-20 rounded-full w-32 h-32 border-4 border-white -bottom-16 left-16 text-d18 flex items-center justify-center bg-white placeholder_animation">
          {" "}
        </div>
      </div>
      <div className="flex mt-20 space-x-5">
        <div className="flex w-full space-x-5 flex-col pr-6 h-32">
          <div className="w-1/2 border border-dgrey1 text-d14 flex flex-col rounded-lg border-opacity-20 p-5 space-y-0.5">
            <span className="text-d16 pr-semibold text-dblackOverlay3 ">
              Seller Rating
            </span>
            <div className="flex items-center pr-semibold h-12">
              <span className=" text-2xl pr-semibold h-2 placeholder_animation"></span>{" "}
              <AiFillStar className="text-d18 ml-1 text-dlabelColor opacity-20" />
            </div>
            <div className="flex">
              {" "}
              <div className="text-dgrey1 pl-1 text-opacity-70 text-d14 ">
                {" "}
                Positive Ratings
              </div>
            </div>
          </div>
{/* 
          <div className="w-1/2 border border-dgrey1 text-d14 flex flex-col rounded-lg border-opacity-20 p-5 space-y-0.5 h-32">
            <div className="text-d16 pr-semibold text-dblackOverlay3 h-3 mb-3">
              Customers
            </div>
            <div className="h-9 mt-5 placeholder_animation my-12 w-24"></div>
            <div className="flex">
              {" "}
              <span className="text-dgrey1 pl-1 text-opacity-70 text-d14 mt-2">
                {" "}
                During the last 90 days
              </span>
            </div>
          </div> */}
        </div>
        <div className="w-6/12 flex flex-col  border-dgrey1 border-opacity-20 pl-6 -mt-12 border-l">
          <div className="text-d22 pr-semibold px-2">
            Seller Ratings & Reviews
          </div>
          <div className=" flex flex-row  border-dgrey1 border-opacity-10 pl-2 space-x-5 mt-5">
            <div className="flex justify-end flex-col w-4/12">
              <div className=" pr-semibold text-5xxl h-12 py-5 mb-5 w-1/2 bg-dlabelColor bg-opacity-10 placeholder_animation"></div>
              <div className="h-6 flex flex-row  justify-start ">
                <AiFillStar className="text-d18 ml-1 text-dlabelColor opacity-20" />{" "}
                <AiFillStar className="text-d18 ml-1 text-dlabelColor opacity-20" />{" "}
                <AiFillStar className="text-d18 ml-1 text-dlabelColor opacity-20" />{" "}
                <AiFillStar className="text-d18 ml-1 text-dlabelColor opacity-20" />{" "}
                <AiFillStar className="text-d18 ml-1 text-dlabelColor opacity-20" />
              </div>
              {/* <StarRatings
                                  starDimension="30px"
                                  starEmptyColor="#e3e3e3"
                                 
                                  starSpacing="0"
                                 
                                /> */}
              <div className="text-d16 h-2">
                Based on <span> </span>
                ratings
              </div>
            </div>

            <div classname="flex  flex-col w-full">
              <div className="flex flex-row w-full items-center space-x-1">
                <div className="w-2 text-center">5</div>

                <div>
                  {" "}
                  <AiFillStar
                    className="text-d18 ml-1"
                    style={{
                      color: "rgb(0, 158, 0)"
                    }}
                  />{" "}
                </div>
                <div className=" h-1.5 bg-dgreySeller bg-opacity-20 rounded w-52">
                  <div className="h-full placeholder_animation"></div>
                </div>
              </div>
              <div className="flex flex-row w-full items-center space-x-1">
                <div className="w-2 text-center">4</div>

                <div>
                  {" "}
                  <AiFillStar
                    className="text-d18 ml-1"
                    style={{
                      color: "rgb(110, 159, 0)"
                    }}
                  />{" "}
                </div>
                <div className=" h-1.5 bg-dgreySeller bg-opacity-20 rounded w-52">
                  <div className="h-full placeholder_animation"></div>
                </div>
              </div>
              <div className="flex flex-row w-full items-center space-x-1">
                <div className="w-2 text-center">3</div>

                <div>
                  {" "}
                  <AiFillStar
                    className="text-d18 ml-1"
                    style={{ color: "rgb(243, 153, 22)" }}
                  />{" "}
                </div>
                <div className=" h-1.5 bg-dgreySeller bg-opacity-20 rounded w-52">
                  <div className="h-full placeholder_animation"></div>
                </div>
              </div>
              <div className="flex flex-row w-full items-center space-x-1">
                <div className="w-2 text-center">2</div>

                <div>
                  {" "}
                  <AiFillStar
                    className="text-d18 ml-1"
                    style={{
                      color: "rgb(246,90,31)"
                    }}
                  />{" "}
                </div>
                <div className=" h-1.5 bg-dgreySeller bg-opacity-20 rounded w-52">
                  <div className="h-full placeholder_animation"></div>
                </div>
              </div>
              <div className="flex flex-row w-full items-center space-x-1">
                <div className="w-2 text-center">1</div>

                <div>
                  {" "}
                  <AiFillStar
                    className="text-d18 ml-1"
                    style={{
                      color: "rgb(246,90,31)"
                    }}
                  />{" "}
                </div>
                <div className=" h-1.5 bg-dgreySeller bg-opacity-20 rounded w-52">
                  <div className="h-full placeholder_animation"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full py-5">
        <div className="text-d22 pr-semibold px-2 py-3 ">
          All products by this seller
        </div>
        <div className="h-52 placeholder_animation"></div>
      </div>
    </div>
  );
}

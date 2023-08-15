import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsFillAwardFill } from "react-icons/bs";
import { HiStar } from "react-icons/hi";
import { sanitizeHTML } from "../Utils";

function SingleProductTopSelling(props) {
  const { item, index } = props;
  const path = "";
  console.log(item);
  return (
    <Link
      className="rounded-lg p-4 bg-white relative"
      style={{
        height: "170px",
        border: "solid 1px #e6e6e6",
        boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.05)",
      }}
      href={`${path}/${item.name
        .replaceAll(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
        .replaceAll("%", "")
        .replaceAll(/\s+/g, "-")
        .replaceAll("..", "")
        .replaceAll("/", "-")
        .replaceAll("---", "-")
        .replaceAll("--", "-")
        .replaceAll("100%", "")
        .replaceAll("#", "")
        .replaceAll("/", "")}/p=${props.item.product_id}`}
    >
      <div className="flex items-center gap-2">
        <div className="image-container mr-3.5 relative flex justify-center items-center" style={{height:"138px", width: "92px"}}>
          <Image src={item.popup} width={92} height={138} alt={item.name} />
          <div className="rank-badge absolute z-10 top-1 left-1">
            <div className="relative">
              <BsFillAwardFill className="text-dyellow w-8 h-8" />  
              <div className="absolute top-0 left-0 bottom-0 right-0 pr-semibold text-white text-sm flex justify-center items-center mb-1.5">{index + 1}</div>
            </div>
          </div>
        </div>
        <div className="product-info-container">
          <div className="text-d14">
            {" "}
            <span
              className={`text-dblack pr-semibold mb-1 h-10 pr-semibold`}
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(props.item.manufacturer_name),
              }}
            />{" "}
            <span
              className={`text-dblack mb-1`}
              dangerouslySetInnerHTML={{
                __html: item.full_name,
              }}
            />
          </div>
          <div className="">
            <div>
              <strong className="pr-bold text-d16">
                {item.special !== "0" &&
                item.special !== "" &&
                item.special !== false
                  ? item.special
                  : item.price}
              </strong>
            </div>
            <div
              className={`mt-0.5 text-d12 flex items-center ${
                (item.special === "0" ||
                  item.special === "" ||
                  item.special === false) &&
                "invisible"
              }`}
            >
              <div
                className={`oldPrice text-d13 line-through text-dgreyProduct mr-1.5 font-normal`}
              >
                {item.price}
              </div>
              <div className="discount text-dgreen pr-bold whitespace-nowrap">
                {item.saving + "% OFF"}
              </div>
            </div>
            <div className="product-card-footer flex flex-col gap-4 mt-4"></div>
            <div
              className="splitter w-full"
              style={{ height: "1px", backgroundColor: "#E6E6E6" }}
            ></div>
            <div className={`flex`}>
              <div
                className="mt-3 flex flex-row gap-7 items-center justify-start w-full"
                style={{ minHeight: "16px" }}
              >
                <div className="express  -mt-1">
                  {props.item.market === "0" ? (
                    <Image
                      width={64}
                      height={24}
                      src={"/images/express.png"}
                      className="h-6 w-16 py-1 mobile:py-0 lg:py-1"
                      alt="Express delivery"
                      priority={true}
                    />
                  ) : (
                    <Image
                      width={64}
                      height={24}
                      src={"/images/market.svg"}
                      className="h-6 w-16 py-1 mobile:py-0 lg:py-1 "
                      alt={"market image"}
                      priority={true}
                    />
                  )}
                </div>
                {item?.nb_of_reviews > 0 && (
                  <div className=" flex ">
                    <div
                      className="flex rounded-full  place-content-end h-4  align-bottom pl-1"
                      style={{
                        backgroundColor:
                          item?.rating >= 4.5
                            ? "rgb(0,158,0)"
                            : item?.rating < 4.5 && item?.rating >= 4
                            ? "rgb(110, 159, 0)"
                            : item?.rating < 4 && item?.rating >= 3.5
                            ? "rgb(243, 153, 22)"
                            : "rgb(246,90,31)",
                      }}
                    >
                      <div
                        className="text-d11 font-bold text-white"
                        style={{ paddingTop: "0.5px" }}
                      >
                        {item?.rating || "0.0"}
                      </div>
                      <HiStar
                        className="pt-1 text-white text-bold text-d12"
                      />{" "}
                    </div>

                    <div className="font-light text-d11 pl-0.5">
                      ({" "}
                      {props?.item?.reviews?.length < 1 &&
                      props?.item?.reviews?.length === ""
                        ? "0"
                        : item?.nb_of_reviews}{" "}
                      )
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default SingleProductTopSelling;

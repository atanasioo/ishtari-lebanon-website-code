import Image from "next/image";
import Link from "next/link";
import { HiStar } from "react-icons/hi";

function SingleProduct(props) {
  const { item } = props;
  return (
    <Link href="/">
      <div className="flex flex-col h-full bg-white text-dblack p-2.5 relative">
        <div className="flex flex-col h-full">
          <div className="product-image relative -mt-1.5 -mx-1.5">
            <div></div>
            <div className="relative w-full">
              <Image
                src={item.thumb}
                width={200}
                height={300}
                className="max-w-full max-h-full"
              />
            </div>
          </div>
          <div className="product-info pt-3 flex flex-col">
            <div className="product-name text-d14 font-semibold leading-spn h-9 mb-2 overflow-hidden">
              <span>{item.name}</span>
            </div>
            <div className="">
              <div>
                <strong className="pr-bold text-d18">
                  {item.special !== "0" &&
                  item.special !== "" &&
                  item.special !== false
                    ? item.special
                    : item.price}
                </strong>
              </div>
              <div
                className={`mt-0.5 text-d12 flex items-center ${
                  !item.special && "invisible"
                } ${props.isList && "m-px"}`}
              >
                <div
                  className={`oldPrice text-d13 line-through text-dgreyProduct mr-1.5 font-normal`}
                >
                  {item.price}
                </div>
                <div className="discount text-dgreen pr-bold ">
                  {item.saving + "% OFF"}
                </div>
              </div>
            </div>
            <div className="flex pt-2">
              <div
                className="mt-3.5 flex justify-between items-center w-full"
                style={{ minHeight: "16px" }}
              >
                <div className="express">
                  {props.item.market === "0" ? (
                    <img
                      src={"/images/express.png"}
                      className="h-6 py-1"
                      alt="Express delivery"
                    />
                  ) : (
                    <img
                      src={"/images/market.svg"}
                      className="h-6 py-1 "
                      alt=""
                    />
                  )}
                </div>
                {item?.nb_of_reviews > 0 && (
                  <div className="flex items-center gap-1 ml-3">
                    <div
                      className="flex rounded-full px-1 place-content-end h-4 w-9 align-bottom"
                      style={{
                        backgroundColor:
                          item?.rating >= 4.5
                            ? "rgb(0,158,0)"
                            : item?.rating < 4.5 &&
                              item?.rating >= 4
                            ? "rgb(110, 159, 0)"
                            : item?.rating < 4 &&
                              item?.rating >= 3.5
                            ? "rgb(243, 153, 22)"
                            : "rgb(246,90,31)",
                      }}
                    >
                      <div
                        className="text-d11 font-bold text-white "
                        style={{ paddingTop: "1px" }}
                      >
                        {item?.rating || "0.0"}
                      </div>
                      <HiStar
                        className="pt-1 text-white text-bold text-d12"
                        // emptyColor="#FFFFFF"
                      />{" "}
                    </div>

                    <div className="font-light text-d11 ">
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
            <div className="relative flex mt-2.5 text-d12"></div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default SingleProduct;

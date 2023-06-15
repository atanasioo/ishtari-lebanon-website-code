import Image from "next/image";
import Link from "next/link";
import { HiStar } from "react-icons/hi";
import { useRouter } from "next/router";
import { AiOutlinePlus } from "react-icons/ai";

function SingleProduct(props) {
  const { item, host, addToCart } = props;
  const router = useRouter();
  const path = "";
  return (
    <Link
    href={`${path}/${item.name
      .replaceAll(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
      .replaceAll("%", parseInt(""))
      .replaceAll(/\s+/g, "-")
      .replaceAll("..", "")
      .replaceAll("/", "-")
      .replaceAll("---", "-")
      .replaceAll("--", "-")
      .replaceAll("100%", "")
      .replaceAll("#", "")
      .replaceAll("/", "")}/p=${props.item.product_id}`}
      // onClick={() =>
      //   router.push(
      //     `${path}/${item.name
      //       .replaceAll(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
      //       .replaceAll("%", parseInt(""))
      //       .replaceAll(/\s+/g, "-")
      //       .replaceAll("..", "")
      //       .replaceAll("/", "-")
      //       .replaceAll("---", "-")
      //       .replaceAll("--", "-")
      //       .replaceAll("100%", "")
      //       .replaceAll("#", "")
      //       .replaceAll("/", "")}/p=${props.item.product_id}`
      //   )
      // }
      className="cursor-pointer"
    >
      <div className="flex flex-col h-full bg-white text-dblack p-2.5 relative">
        <div className="flex flex-col h-full">
          <div className="product-image relative -mt-1.5 -mx-1.5">
            <div></div>
            <div className="relative w-full">
              <Image
                alt={item.name}
                src={item.thumb}
                width={200}
                height={300}
                priority={true}
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
                className="mt-3 flex flex-row justify-between w-full"
                style={{ minHeight: "16px" }}
              >
                <div className="express w-6/12 -mt-1">
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
                      alt={111}
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
                        // emptyColor="#FFFFFF"
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
            {addToCart && (
              <div className="flex flex-col justify-between gap-3">
                <div className="min-w-full bg-dgreyZoom mt-3" style={{height: "1px"}}></div>
                <div className="w-full flex justify-center items-center text-dblue h-6 ">
                  Add To Cart
                  <AiOutlinePlus className="ml-5" />
                </div>
              </div>
            )}
            <div className={`relative flex mt-2.5 text-d12 ${addToCart ? "hidden" : ""}`}></div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default SingleProduct;

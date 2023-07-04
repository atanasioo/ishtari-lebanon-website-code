import { useState } from "react";
import { AccountContext } from "../../contexts/AccountContext";
import { useContext } from "react";
import ImageFilter from "react-image-filter";
import DOMPurify from "dompurify";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

function SingleProductBundle(props) {
  const [state] = useContext(AccountContext);
  const [fetching, setFetching] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const path = "";
  async function getProductData(e) {
    e.preventDefault();
    setFetching(true);
    const product_id = props.item.product_id.toString();
    const product_name = props.item.name
      .replaceAll(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
      .replaceAll(/\s+/g, "-")
      .replaceAll("..", "")
      .replaceAll("/", "-")
      .replaceAll("---", "-")
      .replaceAll("--", "-")
      .replaceAll("/", "").replaceAll("%", parseInt("%"));


    const index = props.products && props.products.indexOf(product_id);

    //   history.push({
    //     pathname: `${path}/${product_name}/p=` + product_id,

    //     products: props.products,
    //     index: index,
    //   });
      router.push(`${path}/${product_name}/p=` + product_id);

  }

  function copyContent(e, sku){
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    const el = document.createElement("input");
    el.value = sku;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

  }


  return (
    <Link
    href={`${path}/${props.item.name.replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
    .replace(/\s+/g, "-").replace("%", parseInt("%"))
    .replace("..", "")
    .replace("/", "-")
    .replace("---", "-")
    .replace("--", "-")
    .replace("/", "")}/p=${props.item.product_id}`}
      className={`cursor-pointer`}
      onClick={(e) => getProductData(e)}
    >
      {
        <div
          className={`bg-white h-full ${fetching && "animate-pulse"}`}
          style={{
            width: props.carousel ? "40vw" : "100%",
            marginRight: props.carousel ? "7.5px" : "0",
            minWidth:"100px"
          }}
        >
          <div className="relative">
            {props.item.quantity === "0" && (
              <div
                className={
                  window.innerWidth > 650
                    ? "absolute z-20 text-dbase w-full text-center  bottom-0"
                    : "absolute z-20 text-dbase  w-full text-center  bottom-0 "
                }
              >
                Out Of Stock
              </div>
            )}
            {props.item.quantity === "0" ? (
              <ImageFilter
                image={props.item.thumb}
                filter={"duotone"} // see docs beneath
                colorOne={[96, 96, 96]}
                colorTwo={[255, 255, 255]}
              />
            ) : (
              <div className="w-full content-center	justify-center	">
                <Image
                  alt={props.item.name}
                  src={
                    fetching
                      ? ""
                      : props.item.thumb
                  }
                  width="100"
                  height="100"
                  placeholder=""
                  style={{maxHeight: '120px'}}
                />
                {/* <span className="text-d22">+</span> */}
              </div>
            )}
          </div>
          <div className="px-0">
            <div className={`${props.item.quantity === "0" && "opacity-40"}`}>
              {/* PUT IS AFTER _html "[brand name]  " +  */}
              <div className="h-17 overflow-hidden text-center leading-4 pt-1">
                <p className="text-dblack text-d16 md:text-base flex flex-col gap-1 md:w-full pr-bold p-1 mb-1">
                  {props.item.special !== "0" && props.item.special !== 0 && props.item.special !== "" && props.item.special !== false &&  props.item.special !== "$0" ? props.item.special : props.item.price}
                  <span className="text-dblack text-d13 md:text-thin  pr-light">
                    x{props.item.required_quantity}
                  </span>
                </p>
                <span
                  className="text-dblack text-11 md:text-thin  pr-semibold"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(props.item.manufacturer_name),
                  }}
                />
                {props?.item?.name?.split(" ")[0] ===
                  props.item.manufacturer_name &&
                props.item.manufacturer_name !== undefined ? (
                  <span
                    className={
                      "text-dblack ml-1 text-d11 md:text-thin  pr-light"
                    }
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(props?.item?.name?.split(
                        props.item.manufacturer_name
                      )[1]),
                    }}
                  />
                ) : (
                  <span
                    className={`${
                      props.item.manufacturer_name && "ml-1"
                    } ' text-dblack text-d11 md:text-thin  font-light'`}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(props.item.name),
                    }}
                  />
                )}
              </div>
            </div>
            <div className="w-full flex items-center justify-center">
              {" "}
              {props.item.market === "0" ? (
                props.item.quantity === "0" ? (
                  <ImageFilter
                    className="h-4 w-16"
                    image={"/images/express.png"}
                    filter={"duotone"} // see docs beneath
                    colorOne={[96, 96, 96]}
                    colorTwo={[255, 255, 255]}
                  />
                ) : (
                  <img
                    src={"/images/express.png"}
                    className="h-6 py-1"
                    alt="Express delivery"
                  />
                )
              ) : (
                <img src={"/images/express.png"} className="h-6 py-1 invisible" alt="" />
              )}
            </div>
          </div>
          {state.admin && (
            <div className="my-1 px-1 flex justify-between z-10 rounded">
              <span className={`p-1  ${copied ? "text-dgreen" : ""}`} onClick={(e) => copyContent(e, props.item.sku)}> {!copied ? props.item.sku : "Copied!"}</span>
              <span className="bg-dgrey1 bg-opacity-25 p-1 rounded">
                {props.item.quantity}
              </span>
            </div>
          )}
        </div>
      }
    </Link>
  );
}

export default SingleProductBundle;

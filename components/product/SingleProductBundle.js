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
    href={`${path}/${props.item.name
      .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
      .replace(/\s+/g, "-")
      .replace("%", parseInt("%"))
      .replace("..", "")
      .replace("/", "-")
      .replace("---", "-")
      .replace("--", "-")
      .replace("/", "")}/p=${props.item.product_id}`}
    className="cursor-pointer"
    onClick={(e) => getProductData(e)}
  >
    <div
      className={`flex items-center justify-center mb-2 md:mb-0 ml-10 text-center {
        props.carousel ? "w-40" : "w-full"
      } ${props.carousel ? "mr-1.5" : ""} min-w-28`}
    >
      <div className="relative">
        {props.item.quantity === "0" && (
          <div className={`absolute z-10 text-dbase w-full text-center bottom-0 ${window.innerWidth > 650 ? "" : ""}`}>
            Out Of Stock
          </div>
        )}
        {props.item.quantity === "0" ? (
          <ImageFilter
            image={props.item.thumb}
            filter="duotone"
            colorOne={[96, 96, 96]}
            colorTwo={[255, 255, 255]}
          />
        ) : (
          <div className="w-full content-center justify-center">
            <div className=" items-center justify-center  w-40 ">
            {props.item.option_name ? (
                <span className="text-dbase1 text-sm md:text-thin pr-light ">
                  choose: {props.item.option_name}
                </span>
              ):<span className="text-dbase1 text-sm md:text-thin pr-light ">
             <br></br>
            </span>}
            </div>
            {/* here to put the price */}
            <div className="mt-1 text-center text-xs">
            {/* {props.item.special !== "0" &&
            props.item.special !== 0 &&
            props.item.special !== "" &&
            props.item.special !== false &&
            props.item.special !== "$0"
              ? props.item.special
              : props.item.price} */}
          </div>
            <Image
              alt={props.item.name}
              src={props?.item?.thumb}
              width="100"
              height="100"
              placeholder=""
              style={{ maxHeight: "200px" }}
              className="ml-4"
            />
            {props?.item?.name?.split(" ")[0] ===
              props.item.manufacturer_name &&
              props.item.manufacturer_name !== undefined ? (
              <span
                className="text-dblack ml-1 text-d11 md:text-thin pr-light"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    props?.item?.name?.split(props.item.manufacturer_name)[1]
                  ),
                }}
              />
            ) : (
              <span
                className={`${
                  props.item.manufacturer_name ? "ml-1" : ""
                } text-dblack text-d11 md:text-thin font-light`}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(props.item.name),
                }}
              />
            )}
            <div className="overflow-hidden text-center leading-4">
            <p className="text-dblack text-d16 md:text-base flex flex-col md:w-full pr-semibold mb-1">
              <span className=" text-md  ">
                x{props.item.required_quantity}
              </span>
            </p>
            <span
              className="text-dblack text-11 md:text-thin pr-semibold"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(props.item.manufacturer_name),
              }}
            />
            
          </div>
          </div>
        )}
      </div>
      <div className="ml-4 flex-1">
        <div className={`${props.item.quantity === "0" ? "opacity-40" : ""}`}>
          {/* <div className="overflow-hidden text-center leading-4">
            <p className="text-dblack text-d16 md:text-base flex flex-col md:w-full pr-bold mb-1">
              <span className="text-dblack text-d18 md:text-thin pr-light">
                x{props.item.required_quantity}
              </span>
            </p>
            <span
              className="text-dblack text-11 md:text-thin pr-semibold"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(props.item.manufacturer_name),
              }}
            />
            
          </div> */}
          {/* <div className="mt-1 text-center">
            {props.item.special !== "0" &&
            props.item.special !== 0 &&
            props.item.special !== "" &&
            props.item.special !== false &&
            props.item.special !== "$0"
              ? props.item.special
              : props.item.price}
          </div> */}
        </div>
      </div>
    </div>
  </Link>
  
  );
}

export default SingleProductBundle;

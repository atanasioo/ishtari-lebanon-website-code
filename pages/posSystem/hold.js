import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
export default function Hold() {
  const [result, setResult] = useState();
  const [hold, setHold] = useState();
  const [site, setSite] = useState("");
  const [date, setDate] = useState({});
  const router = useRouter();
  useEffect(() => {
    var data = localStorage.getItem("print_order");
    try {
      data = JSON.parse(data);
      setResult(data);
      console.log(result);
      setSite(window !== undefined && window.config["site-name"]);
    } catch (error) {}

    const now = new Date();
    if (typeof now === "object" && now instanceof Date) {
      // Use toLocaleDateString here
      // ...
      setDate(now);
    } else {
      console.error("date is not a valid Date object:", date);
    }
  }, [router.asPath]);

  useEffect(() => {
    if (
      result?.order_product?.length > 0 ||
      result?.data?.order_product?.length > 0
    ) {
      // window.print();
      // window.close();
    }
  }, [result]);
  // if(!props){
  // window.print()
  // window.close()

  //  }
  // console.log(props)
  return (
    <div
      className="fixed pb-2 top-0 z-40 bg-white left-0 px-3"
      style={{ color: "rgb(20,20,20)" }}
    >
      <div className="w-full text-center text-7xl">{site}</div>
      <div className="w-full text-center text-4xxl"> ########</div>
      <div className="flex w-full  text-4xxl">
        {" "}
        <span className="w-4/12 font-semibold">Customer : </span>{" "}
        <span className="">
          {" "}
          {(result?.firstname || result?.data.social_data?.firstname) +
            "  "}{" "}
          {result?.lastname !== "Local Customer" &&
            result?.lastname != "0" &&
            result?.lastname}{" "}
          {result?.data?.social_data?.lastname !== "Local Customer" &&
            result?.data?.social_data?.lastname}
        </span>
      </div>
      <div className="flex w-full text-4xxl">
        {" "}
        <span className="w-4/12 test-left font-semibold">phone : </span>{" "}
        <span className="">
          {" "}
          {result?.telephone !== "0961" &&
            result?.telephone !== "0000000" &&
            result?.telephone
              ?.replaceAll("96100000000", "")
              ?.replace("961", "")
              ?.replace("0961", "")
              ?.replaceAll("0000000", "")}
          {result?.data?.social_data?.telephone !== "0961" &&
            result?.data?.social_data?.telephone !== "0000000" &&
            result?.data?.social_data?.telephone
              ?.replaceAll("96100000000", "")
              ?.replace("961", "")
              ?.replace("0961", "")
              ?.replaceAll("0", "")}
        </span>
      </div>
      <div className="flex w-full  pt-3 border-b pb-2  text-4xxl">
        <span className="w-1/2">
          <span className="font-semibold">Date : </span>
          <span className="w-1/2 pl-1">
            {typeof date === "object" &&
              date instanceof Date &&
              date?.toLocaleDateString()}{" "}
          </span>
        </span>{" "}
        <span>
          <span className="w-1/2 font-semibold">Time : </span>
          <span className="pl-1 w-1/2">
            {typeof date === "object" &&
              date instanceof Date &&
              date?.toLocaleTimeString()}
          </span>
        </span>{" "}
      </div>

      <table className="table-fixed text-3xl mt-2 w-full">
        <thead>
          <tr className="font-bold">
            <th className="w-5/12 text-left">Item</th>
            <th className="w-2/12 ">QTY</th>
            <th className="w-2/12 ">Price</th>
            <th className="w-3/12 text-center">Total</th>
          </tr>
        </thead>
        <tbody>
          {result?.data?.order_product?.map((p) => (
            <tr>
              <td className="w-5/12 ">{p.name}</td>
              <td className={"text-center text-2/12"}>{p.quantity}</td>
              <td className="w-2/12 text-center">{p.total}</td>
              <td className="w-3/12 text-center">{p.total}</td>
            </tr>
          ))}
          {result?.order_product?.map((p) => (
            <tr>
              <td className="w-5/12 ">{p.name}</td>
              <td className={"text-center text-2/12"}>{p.quantity}</td>
              <td className="w-2/12 text-center">{p.price}</td>
              <td className="w-3/12 text-center">{p.price * p.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {result?.data?.order_total ? (
        <div className="flex  w-full text-4xxl mb-8">
          <div className="w-7/12 font-bold">
            Total Items {result?.data.order_product?.length}
          </div>
          <div className="w-5/12 ">
            {result?.data?.order_total?.map(
              (total) =>
                total.title !== "Store" && (
                  <div className="w-full flex  mb-1">
                    <div className="w-3/4">{total.title}</div>
                    <div className="text-right ">{total.text}</div>
                  </div>
                )
            )}
          </div>
        </div>
      ) : (
        <div>
          {result?.totals ? (
            <div className="flex  w-full text-4xxl mb-8">
              <div className="w-7/12 font-bold">
                Total Items {result?.order_product?.length}
              </div>
              <div className="w-5/12 ">
                {result?.totals?.map(
                  (total) =>
                    total.title !== "Store" && (
                      <div className="w-full flex  mb-1">
                        <div className="w-3/4">{total.title}</div>
                        <div className="text-right ">{total.text}</div>
                      </div>
                    )
                )}
              </div>
            </div>
          ) : (
            <div className="flex  w-full text-4xxl mb-8">
              <div className="w-7/12 font-bold">
                Total Items {result?.order_product?.length}
              </div>

              <div className="w-5/12 ">
                {result?.order_total && (
                  <div className="w-full flex  mb-1">
                    <div className="w-3/4">{"Sub Total"}</div>
                    <div className="text-right ">${result.sub_total}</div>
                  </div>
                )}

                {result?.modification && (
                  <div className="w-full flex  mb-1">
                    <div className="w-3/4">Discount: </div>
                    <div className="text-right ">{result.modification_type ==="amount" && "$"}{result.modification}{result.modification_type != "amount" && "%"}</div>

                  </div>
                )}

                {result?.order_total && (
                  <div className="w-full flex  mb-1">
                    <div className="w-3/4">{"Total"}</div>
                    <div className="text-right"> ${result.modification_type ? (result.modification_type == "discount" ? result.total - result.total*result.modification/100 : result.total - result.modification ) : (  result.total)}</div>

                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* {result && (
        <div className="flex  w-full text-4xxl mb-8">
          <div className="w-7/12 font-bold">
            Total Items {props?.products?.length}
          </div>

          <div className="w-5/12 ">
            {hold?.totals?.map(
              (total) =>
                total.title !== "Store" && (
                  <div className="w-full flex  mb-1">
                    <div className="w-3/4">{total.title}</div>
                    <div className="text-right ">{total.text}</div>
                  </div>
                )
            )}

          
          </div>
        </div>
      )} */}

      <div className=" text-4xxl mt-12">
        <span className="font-semibold"> Mode of payment: </span>{" "}
        <span className="mr-1"> Cash</span>
      </div>
      <div className="w-full text-center px-3 text-2xl">
        {" "}
        exchange is allowed in 2 weeks time with the receipt and same same state
        of receiving the items no returns. no refuned allowed
      </div>
    </div>
  );
}

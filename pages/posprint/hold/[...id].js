import { useContext, useEffect, useState } from "react";
import _axios from "../../../axios";
import { useRouter } from "next/router";
export default function PosPrint(props) {
  var param = props.id;
  const [result, setResult] = useState();
  const [hold, setHold] = useState();
  const [site, setSite] = useState("");
  const [date, setDate] = useState({});
  const router = useRouter();
  useEffect(() => {
    var data =  param =="print" ? localStorage.getItem("print-order") :  localStorage.getItem("hold-order");
    try{
      data =  JSON.parse(data)
      setHold(param =="print" ?  data : data[param]);
      setSite(window !== undefined && window.config["site-name"]);
    }catch(error){


    }
 

    const now = new Date();
    if (typeof now === 'object' && now instanceof Date) {
      // Use toLocaleDateString here
      // ...
      setDate(now)
    } else {
      console.error('date is not a valid Date object:', date);
    }
  }, [router.asPath]);

  useEffect(() => {
    // if (hold?.order_product?.length > 0) {
    //   window.print();
    //   window.close();
    // }
  }, [hold]);
  // if(!props){
  // window.print()
  // window.close()

  //  }
  // console.log(props)
  return (
    <div className="fixed pb-2 top-0   px-3" style={{ color: "rgb(20,20,20)" }}>
      <div className="w-full text-center text-7xl">{site}</div>
      <div className="w-full text-center text-4xxl"> ########</div>
      <div className="flex w-full  text-4xxl">
        {" "}
        <span className="w-4/12 font-semibold">Customer : </span>{" "}
        <span className="">
          {" "}
          {hold?.firstname + "  "}{" "}
          {hold?.lastname !== "Local Customer" && hold?.lastname}
        </span>
      </div>
      <div className="flex w-full text-4xxl">
        {" "}
        <span className="w-4/12 test-left font-semibold">phone : </span>{" "}
        <span className="">
          {" "}
          {hold?.telephone !== "0961" &&
            hold?.telephone !== "0000000" &&
            hold?.telephone?.replaceAll("96100000000", "")?.replace("961", "")
              ?.replace("0961", "")
              ?.replaceAll("0000000", "") }
        </span>
      </div>
      <div className="flex w-full  pt-3 border-b pb-2  text-4xxl">
        <span className="w-1/2">
          <span className="font-semibold">Date : </span>
          <span className="w-1/2 pl-1">{typeof date === 'object' && date instanceof Date && date?.toLocaleDateString()} </span>
        </span>{" "}
        <span>
          <span className="w-1/2 font-semibold">Time : </span>
          <span className="pl-1 w-1/2">{typeof date === 'object' && date instanceof Date  && date?.toLocaleTimeString()}</span>
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
          {/* {result?.products?.map((p) => (
            <tr>
              <td className="w-5/12 ">{p.name}</td>
              <td className={"text-center text-2/12"}>{p.quantity}</td>
              <td className="w-2/12 text-center">{p.total}</td>
              <td className="w-3/12 text-center">{p.total}</td>
            </tr>
          ))} */}
          {hold?.order_product?.map((p) => (
            <tr>
              <td className="w-5/12 ">{p.name}</td>
              <td className={"text-center text-2/12"}>{p.quantity}</td>
              <td className="w-2/12 text-center">{p.unit_price}</td>
              <td className="w-3/12 text-center">{p.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {hold && (
        <div className="flex  w-full text-4xxl mb-8">
          <div className="w-7/12 font-bold">
            Total Items {props?.products?.length}
          </div>

          <div className="w-5/12 ">
            <div className="w-full flex  mb-1">
              <div className="w-3/4">sub Total</div>
              <div className="text-right "> ${ hold.sub_total}</div>
            </div>

            {hold?.modification && (
              <div className="w-full flex  mb-1">
                <div className="w-3/4">{hold.modification_type}</div>
                <div className="text-right ">{hold?.modification}</div>
              </div>
            )}

            {hold?.coupon && (
              <div className="w-full flex  mb-1">
                <div className="w-3/4">coupon</div>
                <div className="text-right ">{hold.coupon}</div>
              </div>
            )}
            <div className="w-full flex  mb-1">
              <div className="w-3/4">Total</div>
              <div className="text-right ">${hold?.total}</div>
            </div>
          </div>
        </div>
      )}

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
export async function getServerSideProps(context) {
  // Fetch the corresponding API endpoint based on the page type
  // const { catalog,  slug  , resolvedUrl } = context.params;
  const { id } = context.query;

  return {
    props: {
      id
    }
  };
}

import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";
import { useRouter } from "next/router";
import buildLink from "@/urls";
import { axiosServer } from "@/axiosServer";

function PrintOrderInvoice() {
  const router = useRouter();
  const [sellerData, setSellerData] = useState([]);
  const [printData, setPrintData] = useState([]);
  // const parsedQueryString = queryString.parse(location.search);
  const invoiceRef = useRef();
  const selected_orders = router.query.orders?.split(",");
  const current = new Date();
  const date = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });

  useEffect(() => {
    axiosServer
      .get(
        buildLink("seller_profile")
        // `https://www.ishtari.com/motor/v1/index.php?route=seller_report/profile`
      )
      .then((response) => {
        setSellerData(response.data.data);
      });

    printOrders(selected_orders);
  }, []);

  function printOrders(selected_orders) {
    axiosServer
      .post(
        buildLink("seller_print_orders"),
        // "https://www.ishtari.com/motor/v2/index.php?route=seller_report/orders/getSellerOrders",
        selected_orders
      )
      .then((response) => {
        setPrintData(response.data.data);
      });
  }

  return (
    <div className="container">
      <button
        className="px-3 bg-dblue text-white rounded-md py-2 ml-5 mt-2 mb-3.5 float-right"
        onClick={handlePrint}
      >
        Print invoice
      </button>
      <div ref={invoiceRef}>
        {printData?.map((order) => (
          <div className="py-3 min-w-full" >
            <div className="invoice-header flex justify-between w-full  border-b border-dgreyRate my-5">
              <div className="">
                <Barcode
                  value={order.order_id}
                  height={45}
                  format={"CODE39"}
                  fontSize="16"
                />
              </div>
              <div className="font-bold text-lg" style={{ color: "#ccc" }}>
                ORDER ID: {order.order_id}
              </div>
            </div>
            <div className="invoice-second-header flex justify-between w-full text-sm mt-8">
              <div className="text-left">
                <p>{sellerData.seller_name}</p>
                <p>Telephone: {sellerData.seller_telephone}</p>
                <p>Seller Id: {order.seller_id}</p>
              </div>
              <div className="text-right">
                <div className="flex justify-between">
                  <p className="font-bold">Date Printed:</p>
                  <p className="ml-5">{date}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-bold">Order Id:</p>
                  <p className="ml-5">{order.order_id}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-bold">Order Type:</p>
                  <p className="ml-5">Normal Order</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col mb-8">
              <div className="w-full border border-dgreyRate flex flex-col mt-10">
                <div
                  className="w-full bg-dgrey"
                  style={{ minHeight: "20px" }}
                ></div>
                <div className="flex justify-center py-1.5">
                  <div className="border-r border-dgreyRate flex justify-center pr-10 font-semibold">
                    <p>{order.order_type}</p>
                  </div>
                  <div className="flex flex-col justify-center ml-10">
                   <p>Track: {order.track}</p> 
                   <div>
                    <Barcode
                      value={order.track}
                      height={40}
                      format={"CODE39"}
                      fontSize="16"
                    />
                  </div>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col mt-3">
                {/* <div
              className="w-full bg-dgrey"
              style={{ minHeight: "20px" }}
            ></div> */}
                <table className="border border-dgreyRate">
                  <thead className="bg-dgrey">
                    <th className="border border-dgreyRate text-left">
                      Product
                    </th>
                    <th className="border border-dgreyRate text-left">Model</th>
                    <th className="border border-dgreyRate text-left">
                      Barcode
                    </th>
                    <th className="border border-dgreyRate text-left">UPC</th>
                    <th className="border border-dgreyRate text-left">Quantity</th>
                    <th className="border border-dgreyRate text-left">
                      Date Added
                    </th>
                    {/* <th className="border border-dgreyRate">Quantity</th> */}
                  </thead>
                  <tbody>
                    {order.products.map((product) => (
                      <tr>
                        <td className="border border-dgreyRate text-xs  md:text-sm text-left">
                          {product.product_name}
                        </td>
                        <td className="border border-dgreyRate text-xs  md:text-sm text-left">
                          {product.model}
                        </td>
                        {product.barcode ? (
                          <td className="border border-dgreyRate text-xs  md:text-sm text-left">
                            {product.barcode}
                          </td>
                        ) : (
                          <td className="border border-dgreyRate text-xs  md:text-sm text-center">
                            ---
                          </td>
                        )}
                        <td className="border border-dgreyRate text-xs  md:text-sm text-left">
                          {product.upc}
                        </td>
                        <td className="border border-dgreyRate text-xs  md:text-sm text-left">
                          {product.op_qty}
                        </td>
                        <td className="border border-dgreyRate text-xs  md:text-sm text-left">
                          {product.date_added}
                        </td>
                        {/* <td className="border border-dgreyRate text-sm text-center">{product.op_qty}</td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PrintOrderInvoice;

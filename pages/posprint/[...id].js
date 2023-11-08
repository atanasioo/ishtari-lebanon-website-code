import React, { useState, useEffect } from "react";
import buildLink from "../../urls";
import { axiosServer } from "@/axiosServer";

export default function PosOrdersPrint(props) {
  const [storedArray, setMyArray] = useState([]);
  const [hold, setHold] = useState([]);
  const [totalsHold, setTotalsHold] = useState("");
  const [totals, setTotals] = useState("");

  const date = props.id;
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (storedArray?.length > 0 && storedArray[0].order_id > 0) {
        // console.log(storedArray.length)
        window.print();
      } else {
      }
    }, 500); // Delay in milliseconds (2 seconds in this example)
  }, [storedArray]);

  useEffect(() => {
    getOrders();
  }, []);

  function getOrders() {
    const stored = localStorage.getItem("orders");
    if (stored) {
      var param = JSON.parse(stored);
      var sum = 0;
      axiosServer
        .get(
          buildLink("order_details") + param + "&pos=true&date_added=" + date
        )
        .then((response) => {
          if (response.data.success) {
            setMyArray(response?.data?.data);

            response?.data?.data?.map((order) => {
              // console.log(order);
              // if (date === order?.date_added) {
              // storedArray.push(order)

              order.totals.map((item) => {
                if (item.code === "total")
                  sum += Number(item?.text?.replace("$", "")); // Replace "columnName" with the actual column you want to sum
              });
              // }
            });
          }
          setTotals(sum);
        });
    }

    const storedDataHolder = localStorage.getItem("hold-order");
    try {
      const storedHolder = JSON.parse(storedDataHolder);
      // console.log(storedHolder);
      setHold(storedHolder);

      var sumHold = 0;

   storedHolder?.map((item) => {
    // console.log(item)
        // console.log(item?.order_total)
        if (item?.total !== undefined)
          sumHold += Number(item?.total); // Replace "columnName" with the actual column you want to sum
      });

      setTotalsHold(sumHold);
      // Use the parsedData as needed
    } catch (error) {
      console.error("Error parsing data from localStorage:", error);
    }
  }

  return (
    <div className="">
      Date : {date}
      <table class="min-w-full text-left  font-light stripe hover">
        <thead class="border-b font-medium border-DarkGrey">
          <tr>
            <th scope="col" class="px-2 py-4  w-1/12">
              OrderID
            </th>
            <th scope="col" class="px-2 py-4 w-2/12">
              customer name
            </th>
            <th scope="col" class="px-2 py-4  w-1/12">
              telephone
            </th>

            <th scope="col" class="px-2 py-4">
              sub total
            </th>
            <th scope="col" class="px-2 py-4">
              discount
            </th>
            <th scope="col" class="px-2 py-4">
              coupon
            </th>
            <th scope="col" class="px-2 py-4 w-1/12">
              total
            </th>
          </tr>
        </thead>
        <tbody>
          {storedArray?.map((order) => (
            <tr class="border border-DarkGrey ">
              <td class="whitespace-nowrap px-2 py-2 font-medium">
                {order?.order_id}
              </td>
              <td class="whitespace-nowrap px-2 py-2 font-medium">
                {order?.firstname + " "}{" "}
                {order?.lastname !== "Local Customer" && order?.lastname}
              </td>
              <td class="whitespace-nowrap px-2 py-2 font-medium">
                {order?.telephone}
              </td>
              <td class="whitespace-nowrap px-2 py-4">
                {order?.totals?.map(
                  (item) => item?.code === "sub_total" && item?.text
                )}
              </td>

              <td class="whitespace-nowrap px-2 py-4">
                {order?.totals?.map(
                  (item) => item?.code === "discount" && item?.text
                )}
              </td>

              <td class="whitespace-nowrap px-2 py-4">
                {order?.totals?.map(
                  (item) => item?.code === "coupon" && item?.text
                )}
              </td>
              <td class="whitespace-nowrap px-2 py-4">
                {order?.totals?.map(
                  (item) => item?.code === "total" && item?.text
                )}
              </td>
            </tr>
          ))}

          {hold?.length > 0 &&
            hold?.map(
              (order, key) => (
                // date === order.date_added && (
                <tr class="border border-DarkGrey bg-dmenusep bg-opacity-40 ">
                  <td class="whitespace-nowrap px-2 py-2 font-medium ">hold</td>
                  <td class="whitespace-nowrap px-2 py-2 font-medium">
                    {order?.firstname + " "}{" "}
                    {order?.lastname !== "Local Customer" && order?.lastname}
                  </td>
                  <td class="whitespace-nowrap px-2 py-2 font-medium">
                    {order?.telephone}
                  </td>
                  <td class="whitespace-nowrap px-2 py-4">
                    ${order.sub_total}
                  </td>

                  <td class="whitespace-nowrap px-2 py-4">
                    {order.modification &&
                      order.modification +
                        "  (" +
                        order.modification_type +
                        ":" +
                        order.modification +
                        ")"}
                  </td>

                  <td class="whitespace-nowrap px-2 py-4">
                    {order.coupon && "$" + order.coupon}
                  </td>
                  <td class="whitespace-nowrap px-2 py-4">
                    ${order?.total || order?.order_total}
                  </td>
                </tr>
              )
              // )
            )}
        </tbody>
      </table>
      <div className=" pr-7   px-12 py-6 w-full  text-xxl font-semibold ">
        <div className="flex justify-between">
          <div className=""></div>
          <div className=""></div>
          <div className="">
            {" "}
            Total Hold ${totalsHold > 0 ? totalsHold : 0}
          </div>{" "}
          <div className=""> Total ${totals > 0 ? totals : 0}</div>{" "}
        </div>
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

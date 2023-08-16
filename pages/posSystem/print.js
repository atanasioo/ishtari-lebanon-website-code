import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";

export default function PosOrdersPrint() {
  const [orders, setOrders] = useState([]);
  const [holds, setHolds] = useState([]);
  const [totalsHold, setTotalsHold] = useState("");
  const [total, setTotal] = useState("");
  const router = useRouter();
  const { startDate, endDate } = router.query;

  // useEffect(() => {
  //   console.log();
  //   const timeoutId = setTimeout(() => {
  //     if (orders?.length > 0 && orders[0].order_id > 0) {
  //       // console.log(storedArray.length)
  //       window.print();
  //     } else {
  //     }
  //   }, 500); // Delay in milliseconds (2 seconds in this example)
  // }, [orders]);

  useEffect(() => {
    var sumHold = 0;

    holds?.map((item) => {
      // console.log(item);
      // console.log(item?.order_total)
      if (item?.total !== undefined) sumHold += Number(item?.total); // Replace "columnName" with the actual column you want to sum
    });

    var sumOrder = 0;
    orders?.map((item) => {
      // console.log(item);
      // console.log(item?.order_total)
      if (item?.data.total !== undefined) sumOrder += Number(item?.data.total); // Replace "columnName" with the actual column you want to sum
    });

    setTotal({ order: sumOrder, hold: sumHold });
  }, [holds, orders, router]);

  useEffect(() => {

    //order
    setOrders([]);
    getData("orders");

    //hold
    setHolds([]);
    getData("hold_orders");
  }, [router]);

  function getData(storeName) {

    const urlSearchParams = new URLSearchParams(window.location.search);

    // Get the value of a specific parameter
     var startDate = urlSearchParams.get('startDate');
     var endDate = urlSearchParams.get('endDate');
    
     console.log(startDate, endDate)
    // Open a connection to the IndexedDB database
    var request = indexedDB.open("posDB", 8);

    // Handle database open success
    request.onsuccess = function (event) {
      var db = event.target.result;

      // Start a transaction on the object store
      var transaction = db.transaction(storeName, "readonly");
      var objectStore = transaction.objectStore(storeName);

      // Open a cursor to iterate over all records
      var cursorRequest = objectStore.openCursor();

      // Handle cursor success
      cursorRequest.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {

          var data = cursor.value;

          //   console.log(data) ;
          if (storeName === "hold_orders") {
            setHolds([]);
            holds.push(data);
            setHolds([...holds]);
            
          } else {
            // // alert(date);
            // alert(startDate, endDate, data.data.date);
             startDate = new Date(startDate).getTime(); // Convert start date to timestamp
             endDate = new Date(endDate).getTime();
            var  orderDate = new Date(data.data.date); // Convert start date to timestamp

            var  month = "" + (orderDate.getMonth() + 1);
            var  day   = "" + orderDate.getDate();
            var  year  = orderDate.getFullYear();


            if (month.length < 2) month = "0" + month;
            if (day.length < 2) day = "0" + day;
        
            orderDate = [year, month, day].join("-");
            orderDate = new Date(orderDate).getTime()

            console.log(startDate, endDate, orderDate)
            // if (data.id) {
            //   orders.push(data);
            // } else {
            if (
              orderDate != NaN &&
              orderDate &&
              orderDate >= startDate &&
              orderDate <= endDate
              // data.id != orderID
            ) {
              orders.push(data);
            }
            // }

            setOrders([...orders]);
          }
          // Move to the next cursor
          cursor.continue();
        }
      };

      // Handle cursor error
      cursorRequest.onerror = function (event) {
        console.error("Error opening cursor:", event.target.error);
      };
    };

    // Handle database open error
    request.onerror = function (event) {
      console.error("Error opening database:", event.target.error);
    };
  }

  return (
    <div className="">
      Date : {startDate }  {startDate != endDate && "- " +endDate}
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
            <th scope="col" class="px-2 py-4 w-1/12">
              total
            </th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr class="border border-DarkGrey ">
              <td class="whitespace-nowrap px-2 py-2 font-medium">
                {order?.id}
              </td>
              <td class="whitespace-nowrap px-2 py-2 font-medium">
                {order?.data.social_data.firstname + " "}{" "}
                {order?.data.social_data.lastname !== "Local Customer" && order?.data.social_data.lastname}
              </td>
              <td class="whitespace-nowrap px-2 py-2 font-medium">
                {order?.data.social_data?.telephone}
              </td>
              <td class="whitespace-nowrap px-2 py-4">
                {order?.data.order_total?.map(
                  (item) => item?.code === "sub_total" && item?.text
                )}
              </td>

              <td class="whitespace-nowrap px-2 py-4 ">
                {order?.data?.order_total?.map(
                  (item) => item?.code !== "sub_total"  &&  item?.code !== "total" &&  item?.code !== "shipping" && item?.code + ": "+ item?.text
                )}
              </td>

              <td class="whitespace-nowrap px-2 py-4">
                {order?.data.order_total?.map(
                  (item) => item?.code === "total" && item?.text
                )}
              </td>
            </tr>
          ))}

          {holds?.length > 0 &&
            holds?.map(
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
      
            Total Hold: ${total.hold > 0 ? total.hold.toFixed(2) : 0}
          </div>
          <div className=""> Total: ${total.order > 0 ? total.order.toFixed(2) : 0}</div>{" "}
        </div>
      </div>
    </div>
  );
}

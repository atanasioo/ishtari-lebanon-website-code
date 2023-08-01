import React, { useEffect, useState } from "react";
import { axiosServer } from "@/axiosServer";

const dbName = "posDB";

const handleSaveIndexDb = async () => {
  // const dbName = "posDB";
  const openRequest = indexedDB.open(dbName, 2);

  openRequest.onupgradeneeded = (event) => {
    const db = event.target.result;

    // Create the first object store
    if (!db.objectStoreNames.contains("products")) {
      const objectStore1 = db.createObjectStore("products", {
        keyPath: "id",
        autoIncrement: true
      });
      // You can add indexes for faster searching if needed
    }

    // Create the second object store
    if (!db.objectStoreNames.contains("carts")) {
      const objectStore2 = db.createObjectStore("carts", {
        keyPath: "id",
        autoIncrement: true
      });
      // You can add indexes for faster searching if needed
    }
  };

  openRequest.onsuccess = (event) => {
    const db = event.target.result;
    getData(db);

    // Database opened successfully, you can start using it
  };

  openRequest.onerror = (event) => {
    console.error("Error opening database", event.target.error);
  };
};
const getData = async (db) => {
  console.log(db);
  const resp = await axiosServer.post(
    "https://www.flo-lebanon.com/api/v2/?route=catalog/product/ListOfProductsPos&limit=50&page=1",
    {
      headers: {
        "Content-Type": "application/json"
      },
      body: {}
    }
  );

  // Assuming the response data has a property "data" containing the actual response
  const data = resp.data;
  insertBatchData(data.products, db);
  // setData(data.products);
  if (resp.data.total) {
    //resp.data.total / resp.data.limit
    for (var i = 2; i < 5; i++) {
      const resp = await axiosServer.post(
        "https://www.flo-lebanon.com/api/v2/?route=catalog/product/ListOfProductsPos&limit=50&page=" +
          i,
        {
          headers: {
            "Content-Type": "application/json"
          },
          body: {}
        }
      );
      if (resp.status == 200) {
        const newData = resp.data;
        // setData((prevData) => [...prevData, ...newData.products]);
        insertBatchData(newData.products, db);
      }
    }
  }
};

const insertBatchData = (dataArray, db) => {
  const transaction = db.transaction("products", "readwrite");
  const objectStore = transaction.objectStore("products");

  // Function to insert the next object in the dataArray
  const insertNext = (index) => {
    if (index < dataArray.length) {
      const request = objectStore.add(dataArray[index]);

      request.onsuccess = () => {
        console.log("Data inserted successfully");

        // Successfully inserted, move to the next object
        insertNext(index + 1);
      };

      request.onerror = (event) => {
        console.error("Error inserting data", event.target.error);
      };
    } else {
      console.log("Batch insert completed");
    }
  };

  // Start inserting from index 0
  insertNext(0);
};

const insertToCart =  (products) => {
  const transaction = db.transaction("carts", "readwrite");
  const objectStore = transaction.objectStore("carts");
console.log("yes")
  // Function to insert the next object in the dataArray
  const insertNext = (index) => {
    const request = objectStore.add(products);

    request.onsuccess = () => {
      console.log("Data inserted successfully");

      // Successfully inserted, move to the next object
      insertNext(index + 1);
    };

    request.onerror = (event) => {
      console.error("Error inserting data", event.target.error);
    };
    console.log("Batch insert completed");
  };

  // Start inserting from index 0
  insertNext(0);
};

export { handleSaveIndexDb, insertBatchData };



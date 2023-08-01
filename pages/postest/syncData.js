import React, { useEffect, useState } from "react";
import { axiosServer } from "@/axiosServer";
function Syncdata() {
  const [search, setSearch] = useState();
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

  useEffect(() => {
    console.log(search);
    queryProductsByBarcodeAndOption("posDB", "products", search)
      .then((products) => {
        console.log("Products matching the query:");
        console.log(products);
      })
      .catch((error) => {
        console.error("Error querying products:", error);
      });
  }, [search]);
  function queryProductsByBarcodeAndOption(dbName, objectStoreName, barcode) {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open(dbName);

      openRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(objectStoreName, "readonly");
        const objectStore = transaction.objectStore(objectStoreName);

        const products = [];
        const request = objectStore.openCursor();

        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            const product = cursor.value;
            // Check if the desired option value exists in the product's options
            const matchingOption =
              product.product_options[0]?.option_value?.find(
                (opt) => opt.barcode === search || product.sku === search
              );
            console.log(matchingOption);
            if (matchingOption) {
              products.push({
                name: product.name,
                price: product.price,
                sku: product.sku,
                optin_name: product?.product_options[0]?.name,
                option_value: matchingOption
              });
              return;
              console.log(products);
            }
            cursor.continue();
          } else {
            resolve(products);
          }
        };

        request.onerror = (event) => {
          reject(event.target.error);
        };
      };

      openRequest.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  function addNewTable() {
    // Your logic to insert products to the cart goes here
    const openRequest = indexedDB.open("posDB", 4);
    console.log("event");
    openRequest.onupgradeneeded = (event) => {
      console.log(event);
      // const openRequest = indexedDB.open(dbName, 2);
      const db = event.target.result;

      // Create the second object store
      if (!db.objectStoreNames.contains("cart")) {
        const objectStore = db.createObjectStore("cart", {
          keyPath: "id",
          autoIncrement: true
        });
        objectStore.createIndex("tabIndex", "tab", { unique: false });
        objectStore.createIndex("statusIndex", "status", { unique: false });



        // You can add indexes for faster searching if needed
      }

    };
    openRequest.onsuccess = (event) => {
      // Database opened successfully, you can start using it
      console.log(event);
      const db = event.target.result;
      const transaction = db.transaction("cart", "readwrite");
      const objectStore = transaction.objectStore("cart");

      // Function to insert the next object in the dataArray

      // const request = objectStore.add(products);

      request.onsuccess = () => {
        console.log("Data inserted successfully");

        // Successfully inserted, move to the next object
      };

      request.onerror = (event) => {
        console.error("Error inserting data", event.target.error);
      };
      // console.log("cart insert completed");
    };
  }
  return (
    <div>
      {/* Your component content */}

      <button onClick={handleSaveIndexDb} className="bg-dblue text-white p-2">
        Save indexDb
      </button>

      {/* <input
        className="border"
        onKeyUp={(e) => setSearch(e.target.value)}
        placeholder="enter"
      /> */}

      <button onClick={addNewTable} className="bg-dblue text-white p-2 mx-3">
        create new table
      </button>
    </div>
  );
}

export default Syncdata;

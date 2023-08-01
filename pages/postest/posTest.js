import React, { useEffect } from "react";
import { useState } from "react";
import { axiosServer } from "@/axiosServer";
import { insertToCart } from "@/functions";

function Pos() {
  const [result, setResult] = useState();

  useEffect(() => {
    // Open the database
    const request = indexedDB.open("posDB", 4);

    // Event handler for successful database open
    request.onsuccess = function (event) {
      const db = event.target.result;

      // Start a transaction and access the object store (table)
      const transaction = db.transaction("cart", "readonly");
      const objectStore = transaction.objectStore("cart");

      // Use a cursor to read all data in the object store
      const getAllRequest = objectStore.getAll();

      getAllRequest.onsuccess = function (event) {
        const data = event.target.result;

        if (data && data.length > 0) {
          // 'data' contains an array with all the records in the object store
          setResult(data);
          console.log("All data in the object store:", data);
        } else {
          console.log("No data found in the object store.");
        }
      };

      transaction.oncomplete = function () {
        console.log("Transaction completed.");
      };

      transaction.onerror = function (event) {
        console.error("Transaction error:", event.target.error);
      };
    };

    // Event handler for any errors during database open
    request.onerror = function (event) {
      console.error("Error opening database:", event.target.error);
    };
  }, []);

  function addToCart(e) {
    const searchKeyWord = e.target.value;
    if (e.target.value.trim() !== "" && e.key === "Enter") {
      queryProductsByBarcodeAndOption("posDB", "products", searchKeyWord)
        .then((products) => {
          console.log("Products matching the query:");
          console.log(products);
        })
        .catch((error) => {
          console.error("Error querying products:", error);
        });
    }
  }

  // search product bay barcode, sku and model
  function queryProductsByBarcodeAndOption(dbName, objectStoreName, search) {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open(dbName);

      openRequest.onsuccess = (event) => {
        const db = event.target.result;
                const transaction = db.transaction(['products', 'cart'], "readonly");

                  // Check if a value exists in table1
  const table1Store = transaction.objectStore('cart');


  const request1 = table1Store.openCursor();

  request1.onsuccess = (event) => {
    const result = event.target.result;
   const  cart = result.value
// console.log(cart)

console.log(cart[0]?.option_value?.barcode)
console.log(search)
    const check =  cart[0]?.option_value?.barcode === search && true
              // find(
              //   (opt) =>
              //     opt.barcode === search ||
              //     cart.sku === search ||
              //     cart.model === search
              // );
    if (check) {
      console.log(`${search} exists in table1.`);

      updateQuantity()
    } else {
      console.log(`${search} does not exist in table1.`);
  

        // const transaction = db.transaction(objectStoreName, "readonly");
        const objectStore = transaction.objectStore(objectStoreName);
      
        const products = [];
        const request = objectStore.openCursor();

        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            const product = cursor.value;
            // Check if the desired option value exists in the product's options


            // const check =
            // product.product_options[0]?.option_value?.find(
            //   (opt) =>
            //     opt.barcode === search ||
            //     product.sku === search ||
            //     product.model === search
            // );
            const matchingOption =
              product.product_options[0]?.option_value?.find(
                (opt) =>
                  opt.barcode === search ||
                  product.sku === search ||
                  product.model === search
              );
            if (matchingOption) {

              products.push({
                name: product.name,
                price: product.price,
                sku: product.sku,
                optin_name: product?.product_options[0]?.name,
                option_value: matchingOption,
                quantity: 1
              });
              console.log(products);
              insertToCart(products);
              return;
            }
            // cursor.continue();
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
    }
  };
    });
  }

  function insertToCart(products) {
    console.log(products);
    // Your logic to insert products to the cart goes here
    const openRequest = indexedDB.open("posDB", 4);
    console.log("event");
    openRequest.onupgradeneeded = (event) => {
      console.log("ddddddd" + event);
      // const openRequest = indexedDB.open(dbName, 2);
      const db = event.target.result;

      // Create the second object store
      if (!db.objectStoreNames.contains("cart")) {
        const objectStore2 = db.createObjectStore("cart", {
          keyPath: "id",
          autoIncrement: true
        });
        // You can add indexes for faster searching if needed
      }
    };
    openRequest.onsuccess = (event) => {
      // Database opened successfully, you can start using it
      console.log("event+ 333");
      const db = event.target.result;
      const transaction = db.transaction("cart", "readwrite");
      const objectStore = transaction.objectStore("cart");

      // Function to insert the next object in the dataArray

      const request = objectStore.add(products);

      request.onsuccess = () => {
        console.log("Data inserted successfully");

        // Successfully inserted, move to the next object
      };

      request.onerror = (event) => {
        console.error("Error inserting data", event.target.error);
      };
      // console.log("cart insert completed");
    };

    // Start inserting from index 0
  }

  function updateQuantity(e) {
    const search = e.target.value;

    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open("posDB");

      openRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("cart", "readonly");
        const objectStore = transaction.objectStore("cart");

        const products = [];
        const request = objectStore.openCursor();

        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            const product = cursor.value;
            // Check if the desired option value exists in the product's options
            console.log(product);
            const matchingOption =
              product && product?.find((opt) => opt.barcode === search);

            console.log(product.id);
            if (matchingOption) {
              console.log(product);
              products.push({
                name: product.name,
                price: product.price,
                sku: product.sku,
                optin_name: product?.product_options[0]?.name,
                option_value: matchingOption
              });

              console.log(products);
              updateQuantitys(products);
            }
            // cursor.continue();
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
    // Open the database
  }

  function updateQuantitys(product) {
    const request = indexedDB.open("posDB", 4);

    // Event handler for database creation or version change
    request.onupgradeneeded = function (event) {
      const db = event.target.result;

      // Create an object store (table) with an auto-incrementing key
      const objectStore = db.createObjectStore("cart", {
        keyPath: "id",
        autoIncrement: true
      });

      // Define the columns (properties) you want to store
      // objectStore.createIndex("name", "name", { unique: false });
      // objectStore.createIndex("age", "age", { unique: false });
    };

    // Event handler for successful database open
    request.onsuccess = function (event) {
      const db = event.target.result;

      // Start a transaction and access the object store (table)
      const transaction = db.transaction("cart", "readwrite");
      const objectStore = transaction.objectStore("cart");

      // Retrieve the record you want to update using a key or index
      const keyToFind = product.key; // Assuming the record's key is 1
      const getRequest = objectStore.get(keyToFind);

      getRequest.onsuccess = function (event) {
        // Get the record from the request result
        const record = event.target.result;

        if (record) {
          // Modify the record properties (for example, update the 'name' property)
          record.quantity = product.quantity + 1;

          // Use the 'put' method to update the modified record
          const updateRequest = objectStore.put(record);

          updateRequest.onsuccess = function () {
            console.log("Record updated successfully!");
          };

          updateRequest.onerror = function (event) {
            console.error("Error updating record:", event.target.error);
          };
        } else {
          console.log("Record not found.");
        }
      };

      transaction.oncomplete = function () {
        console.log("Transaction completed.");
      };

      transaction.onerror = function (event) {
        console.error("Transaction error:", event.target.error);
      };
    };

    // Event handler for any errors during database open
    request.onerror = function (event) {
      console.error("Error opening database:", event.target.error);
    };
  }

  return (
    <div>
      {/* Add your POS page content here */}

      <div className="flex">
        <div className="w-1/2 bg-white m-2">
          <div>
            <input
              id="code"
              type="text"
              className="py-2 border-dblue border rounded-lg w-full px-2  focus:outline-black"
              placeholder="Enter SKU CODE "
              onKeyUp={(e) => addToCart(e)}
            />
          </div>
          {result?.map((cart , key) => (
            <div className="flex justify-between my-2 w-full">
                 <div>{key}</div> 
       <div className="w-3/4">{cart[0].name}</div>  
       <div>{cart[0].sku}</div> 
          <div className="mx-1"><input className="px-2 border border-1 w-1/3 text-center" defaultValue={cart[0].quantity} /></div>   
            </div>
          ))}
        </div>
        <div className="w-1/2"></div>
      </div>
    </div>
  );
}
export default Pos;

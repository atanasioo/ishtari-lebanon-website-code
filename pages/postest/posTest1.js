import React, { useEffect } from "react";
import { useState } from "react";
import { axiosServer } from "@/axiosServer";
import { useRouter } from "next/router";
function Pos() {
  const [result, setResult] = useState();
  const [update, setUpdate] = useState(false);
  const [total, setTotal] = useState(false);

  const router = useRouter();

  function addNewTable() {
    console.log("omar");
    // Your logic to insert products to the cart goes here
    const openRequest = indexedDB.open("posDB", 5);


    // console.log("event");
    openRequest.onupgradeneeded = (event) => {
      console.log("omar" + event);

      // console.log("ddddddd" + event);
      // const openRequest = indexedDB.open(dbName, 2);
      const db = event.target.result;

      // Create the second object store
      if (!db.objectStoreNames.contains("carts")) {
        db.createObjectStore("carts", {
          keyPath: "id",
          // autoIncrement: true

        });
        // You can add indexes for faster searching if needed
      }
    };
    openRequest.onsuccess = (event) => {
      // Database opened successfully, you can start using i
      console.log(event);
      console.log("cart insert completed");
    };
  }
  useEffect(() => {
    // Open the database
    const request = indexedDB.open("posDB", 5);

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
          var total_cart = 0;
          data.map((t) => {
            if (t[0].total) total_cart += Number(t[0].total);
          });
          setTotal(total_cart);
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
  }, [router, update]);

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
        const transaction = db.transaction(["products", "cart"], "readonly");

        // Check if a value exists in table1
        const table1Store = transaction.objectStore("cart");

        const request1 = table1Store.openCursor();

        request1.onsuccess = (event) => {
          const result = event.target.result;
          const cart = result.value;
          // console.log(cart)

          console.log(cart[0]?.option_value?.barcode);
          console.log(search);
          const check = cart[0]?.option_value?.barcode === search && cart.id;
          // find(
          //   (opt) =>
          //     opt.barcode === search ||
          //     cart.sku === search ||
          //     cart.model === search
          // );
          if (check) {
            console.log(`${search} exists in table1.`);

            updateQuantity(check, search);
          } else {
            console.log(`${search} does not exist in table1.`);

            // const transaction = db.transaction(objectStoreName, "readonly");
            const objectStore = transaction.objectStore(objectStoreName);

            const products = [];
            const request = objectStore.openCursor();

            request.onsuccess = (event) => {
              const cursor = event.target.result;
              console.log(cursor);
              if (cursor) {
                const product = cursor.value;
                // Check if the desired option value exists in the product's options

                console.log("products");
                const matchingOption =
                  product.product_options[0]?.option_value?.map(
                    (opt) =>
                      (opt.barcode === search ||
                        product.sku === search ||
                        product.model === search) &&
                      true
                  );
                console.log(product.product_options[0]?.option_value);
                if (matchingOption) {
                  console.log("products");

                  products.push({
                    name: product.name,
                    price: product.price,
                    sku: product.sku,
                    optin_name: product?.product_options[0]?.name,
                    option_value: matchingOption,
                    quantity: 1,
                    total: product.price
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
          }

          openRequest.onerror = (event) => {
            reject(event.target.error);
          };
        };
      };
    });
  }

  //insert in cart
  function insertToCart(products) {
    // console.log(products);
    setUpdate(false);
    // Your logic to insert products to the cart goes here
    const openRequest = indexedDB.open("posDB", 5);
    // console.log("event");
    openRequest.onupgradeneeded = (event) => {
      // console.log("ddddddd" + event);
      // const openRequest = indexedDB.open(dbName, 2);
      const db = event.target.result;

      // Create the second object store
      if (!db.objectStoreNames.contains("carts")) {
        const objectStore2 = db.createObjectStore("carts", {
          keyPath: "id"
        });
        // You can add indexes for faster searching if needed
      }
    };
    openRequest.onsuccess = (event) => {
      // Database opened successfully, you can start using it
      // console.log("event+ 333");
      const db = event.target.result;
      const transaction = db.transaction("cart", "readwrite");
      const objectStore = transaction.objectStore("cart");

      // Function to insert the next object in the dataArray

      const request = objectStore.add(products);

      request.onsuccess = () => {
        console.log("Data inserted successfully");

        const objectIdToUpdate = 8; // Provide the ID of the object you want to update

        // Step 4: Retrieve the object from the object store
        const getRequest = objectStore.get(objectIdToUpdate);

        getRequest.onsuccess = function (event) {
          const existingObject = event.target.result;
          console.log(existingObject);
          // Check if the object with the provided ID exists
          if (existingObject) {
            // Step 5: Modify the object by adding the new array to the existing table array
            const newArrayToAdd = products;
            existingObject.push(newArrayToAdd);

            // Update the modified object back into the object store
            const updateRequest = objectStore.put(existingObject);

            updateRequest.onsuccess = function (event) {
              console.log("Object updated successfully!");
            };

            updateRequest.onerror = function (event) {
              console.error("Error updating object:", event.target.error);
            };
          }
        };
        // Successfully inserted, move to the next object
      };

      request.onerror = (event) => {
        console.error("Error inserting data", event.target.error);
      };
      // console.log("cart insert completed");
    };

    // Start inserting from index 0
  }

  function updateQuantity(check, search) {
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
            var products = [];
            const product = cursor.value;
            // Check if the desired option value exists in the product's options
            console.log(product);
            const matchingOption =
              product &&
              product[0]?.option_value.barcode === search &&
              product[0];

            console.log(product.id);
            if (matchingOption) {
              console.log(matchingOption);
              products.push({
                name: matchingOption.name,
                price: matchingOption.price,
                sku: matchingOption.sku,
                option_name: matchingOption?.option_name,
                option_value: matchingOption.option_value
              });

              console.log(products);
              updateQuantitys(matchingOption, product.id);
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

  function updateQuantitys(product, key) {
    const request = indexedDB.open("posDB", 5);
    console.log(product, key);
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
      const keyToFind = key; // Assuming the record's key is 1
      const getRequest = objectStore.get(keyToFind);

      getRequest.onsuccess = function (event) {
        // Get the record from the request result
        const record = event.target.result;
        // setUpdate(false);
        if (record) {
          console.log(product.quantity);
          // Modify the record properties (for example, update the 'name' property)
          record[0].quantity = product.quantity + 1;
          record[0].total = product.price * record[0].quantity;
          // console.log("record = " + product.quantity);
          // Use the 'put' method t o update the modified record
          const updateRequest = objectStore.put(record);

          updateRequest.onsuccess = function () {
            setUpdate(true);

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

  function deleteRowById(tableName, idToDelete) {
    const openRequest = indexedDB.open("posDB", 5);
    console.log("event");
    var db;
    openRequest.onupgradeneeded = (event) => {
      // const openRequest = indexedDB.open(dbName, 2);
      db = event.target.result;

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
      setUpdate(false);

      const db = event.target.result;
      const transaction = db.transaction(tableName, "readwrite");
      const objectStore = transaction.objectStore(tableName);

      const request = objectStore.delete(idToDelete);

      request.onsuccess = (event) => {
        console.log(
          `Row with ID ${idToDelete} deleted successfully from ${tableName}.`
        );
        setUpdate(true);
      };

      request.onerror = (event) => {
        console.error(
          `Error deleting row with ID ${idToDelete} from ${tableName}: ${event.target.error}`
        );
      };
    };
  }

  function deleteTable() {
    const dbName = "posDB";
    const objectStoreNameToDelete = "carts";

    const request = indexedDB.open(dbName, 5);
    console.log("yes de");
    request.onerror = function (event) {
      console.error("Error opening IndexedDB:", event.target.errorCode);
    };

    request.onsuccess = function (event) {
      const db = event.target.result;

      // Step 2: Check if the object store exists
      if (db.objectStoreNames.contains(objectStoreNameToDelete)) {
        // Step 3: Delete the object store from the database
        const version = db.version;

        // Close the database connection to perform the delete operation
        // db.close();

        const requestDelete = indexedDB.open(dbName, version);

        requestDelete.onupgradeneeded = function (event) {
          const dbToDelete = event.target.result;

          // Delete the object store from the database
          dbToDelete.deleteObjectStore(objectStoreNameToDelete);
        };

        requestDelete.onerror = function (event) {
          console.error("Error deleting object store:", event.target.error);
        };

        requestDelete.onsuccess = function (event) {
          console.log("Object store deleted successfully!");
        };
      } else {
        console.error("Object store not found.");
      }
    };

    request.onupgradeneeded = function (event) {
      // This event will only be triggered if the database is not yet created
      console.log("Database created successfully.");
    };
  }

  return (
    <div className="fixed min-h-screen w-full top-0 bg-dlabelColor -ml-3">
      {/* Add your POS page content here */}

      <div className="flex">
        <div className="w-8/12 m-2">
          <div>
            <input
              id="code"
              type="text"
              className="py-2 border-dblue border rounded-lg w-full px-2  focus:outline-black"
              placeholder="Enter SKU CODE "
              onKeyUp={(e) => addToCart(e)}
            />
          </div>
          <div onClick={() => deleteTable()}>delete</div>
          <div onClick={() => addNewTable()}>Add</div>

          <div className=" overflow-y-auto h-2/3">
            {result?.map((cart, key) => (
              <div className="flex my-2 justify-between w-full px-5 pt-2  bg-white ">
                <div className="w-1/12">{key}</div>
                <div className="w-6/12 text-l ">
                  {cart[0].name}
                  <div className="flex ">
                    <div className="flex justify-between text-dbase">
                      {cart[0].optin_name || cart[0].option_name} :{" "}
                      {cart[0].option_value.name}
                    </div>
                    <div className="pl-6">{cart[0].sku}</div>
                  </div>
                </div>

                <div className="flex w-5/12 justify-between">
                  <div className="text-l mt-2 text-center pr-semibold px-6">
                    {" "}
                    ${cart[0].total ? cart[0].price : 0}
                  </div>
                  <input
                    className="px-2 border border-1 text-center w-20 h-10"
                    value={cart[0].quantity}
                  />

                  <div className="text-l mt-2 text-center pr-semibold px-6">
                    {" "}
                    ${cart[0].total ? cart[0].total : 0}
                  </div>
                  <span
                    className="text-xxl text-dbase pr-bold pb-2"
                    onClick={() => deleteRowById("cart", cart.id)}
                  >
                    x
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex w-full justify-between  h-1/6 bg-white p-6 ">
        <div className=" pr-semibold  text-2xl"> Total: ${total}</div>

        <span className=" bg-Orangeflo px-12 text-white text-xxl w-1/3 text-center ">
          {" "}
          Pay
        </span>
      </div>
    </div>
  );
}
export default Pos;

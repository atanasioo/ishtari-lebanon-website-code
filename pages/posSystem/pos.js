import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { axiosServer } from "@/axiosServer";
import { useRouter } from "next/router";
import buildLink from "@/urls";
import Link from "next/link";
import HandlePhoneModel from "@/components/PhoneHanlder";

function Pos() {
  const [result, setResult] = useState();
  const [update, setUpdate] = useState(false);
  const [total, setTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);

  const dbName = "posDB";

  const router = useRouter();

  const tabValue = router.query.tab ? router.query.tab : 1;

  const [showModel, setShowModel] = useState(false);

  const [confirmDisabled, setConfirmDisalbe] = useState(false);

  const [showCalculte, setShowCalculate] = useState(false);

  const [isOnline, setIsOnline] = useState(true);

  const [modificationError, setModificationError] = useState({});

  const [manualResponse, setManualResponse] = useState({});

  const [error, setError] = useState({ firstName: "" });

  const [change, setChange] = useState();

  const [firstName, setFirstName] = useState();

  const [lastName, setLastName] = useState();

  const [isValid, setIsValid] = useState();

  const [success, setSuccess] = useState(false);

  const fnameRef = useRef();
  const lnameRef = useRef();
  const telephone = useRef();
  const typeRef = useRef("");
  const amountRef = useRef("");
  const remarqueRef = useRef("");
  const couponRef = useRef("");

  const phoneHanlder = (childData, isValid) => {
    // console.log(telephone.current.value);
    if (isValid === true) {
      telephone.current.value = childData;
    } else {
      telephone.current.value = childData;
    }

    setIsValid(isValid);
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const AdminPhoneHandler = (obj, isValid) => {
    console.log(obj);
    if (isValid) {
      fnameRef.current.value = obj.firstname !== "undefined" && obj.firstname;
      lnameRef.current.value = obj.lastname !== "undefined" && obj.lastname;
      telephone.current.value = obj.telephone;

      const data = {
        name: obj.city,
        value: obj.zone
      };
      manual(false);
    }
    const onEscape = function (action) {
      window &&
        window.addEventListener("keydown", (e) => {
          if (e.key === "Escape") {
            action();
          }
        });
    };
    onEscape(() => {
      telephone.current.blur();
    });
  };

  useEffect(() => {
    addNewTable();
    const handleOnlineStatusChange = () => {
      setIsOnline(!window.navigator.onLine);
      setIsOnline(window.navigator.onLine);
    };

    const handleOnlineStatusChangeoff = () => {
      setIsOnline(!window.navigator.onLine);
      setIsOnline(window.navigator.onLine);
    };

    // Add event listener to check network status changes
    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChangeoff);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChangeoff);
    };
  }, []);

  function fetchById(db, objectStoreName, id) {
    setResult("");

    const transaction = db.transaction(objectStoreName, "readonly");
    const objectStore = transaction.objectStore(objectStoreName);
    const request = objectStore.get(id);

    request.onsuccess = function (event) {
      const data = event.target.result;
      if (data) {
        setResult(data);
        // Data found
        var total_cart = 0;
        data?.cart?.map((t) => {
          if (t.total) total_cart += Number(t.total);
        });
        setTotal(total_cart);
        setSubTotal(total_cart);
        console.log("Data:", data);
      } else {
        // Data with the given ID not found
        console.log("Data not found");
      }
    };

    request.onerror = function (event) {
      console.error("Error fetching data by ID: ", event.target.errorCode);
    };
  }
  function addNewTable() {
    console.log("omar");
    // Your logic to insert products to the cart goes here
    const dbName = "posDB";
    const dbVersion = 8;
    const objectStoreName = "draft_cart";

    // Open a connection to a database or create it if it doesn't exist.
    const request = indexedDB.open(dbName, dbVersion);
    console.log("request" + request);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Check if the object store already exists
      if (!db.objectStoreNames.contains("draft_cart")) {
        // Create a new object store with an auto-incrementing key
        db.createObjectStore("draft_cart", {
          keyPath: "id",
          autoIncrement: false
        });
      }

      if (!db.objectStoreNames.contains("products")) {
        // Create a new object store with an auto-incrementing key
        db.createObjectStore("products", {
          keyPath: "id",
          autoIncrement: false
        });
      }

      if (!db.objectStoreNames.contains("orders")) {
        // Create a new object store with an auto-incrementing key
        db.createObjectStore("orders", {
          keyPath: "id",
          autoIncrement: false
        });
      }

      if (!db.objectStoreNames.contains("hold_orders")) {
        // Create a new object store with an auto-incrementing key
        db.createObjectStore("hold_orders", {
          keyPath: "id",
          autoIncrement: true
        });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      console.log("success");
      // Now, you can interact with the database using 'db' object.
    };

    request.onerror = (event) => {
      console.error("Error opening or creating database:", event.target.error);
    };
  }
  useEffect(() => {
    const request = indexedDB.open("posDB", 8);

    request.onerror = function (event) {
      console.error("Database error: ", event.target.errorCode);
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      fetchById(db, "draft_cart", tabValue); // Call your function to fetch data by ID
    };
  }, [router, update, tabValue]);

  function addToCart(e) {
    const searchKeyWord = e.target.value;
    if (e.target.value.trim() !== "" && e.key === "Enter") {
      queryProductsByBarcodeAndOption("posDB", "products", searchKeyWord)
        .then((products) => {
          console.log("Products matching the query:");
          console.log(products);
          // Assuming you have scanned a value and now want to clear the input field
          clearInputAfterScan();
        })
        .catch((error) => {
          console.error("Error querying products:", error);
        });
    }
  }
  function clearInputAfterScan() {
    var codeElement = document.getElementById("code");
    if (codeElement) {
      codeElement.value = ""; // Clear the value of the input field
      codeElement.focus(); // Optionally set focus back to the input field
    }
  }

  // search product bay barcode, sku and model
  function queryProductsByBarcodeAndOption(dbName, objectStoreName, search) {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open(dbName, 8);

      openRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(
          ["products", "draft_cart"],
          "readonly"
        );
        const objectIdToUpdate = tabValue;
        // Check if a value exists in table1
        const table1Store = transaction.objectStore("draft_cart");

        const request1 = table1Store.get(objectIdToUpdate);

        request1.onsuccess = (event) => {
          clearInputAfterScan();

          const result = event.target.result && event.target.result.cart;

          const cart = result != null && result;

          const check = findDataCart(cart, search);

          // console.log(check);
          if (check) {
            console.log(`${search} exists in table1.`);

            updateQuantity(check, search);
          } else {
            const objectStore = transaction.objectStore("products");

            const products = [];
            const request = objectStore.getAll();
            console.log(request);
            request.onsuccess = (event) => {
              console.log(event);
              const cursor = event.target.result;
              console.log(cursor);
              if (cursor) {
                const product = cursor;

                const matchingOption = findData(product, search);

                // console.log("matchingOption-1");
                // console.log(matchingOption);
                // console.log("matchingOption-2");
                if (matchingOption) {
                  products.push(matchingOption);
                  // console.log(products);
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

  // Recursive function to find data in an object of objects
  function findData(obj, search) {
    for (const key in obj) {
      if (obj[key].data.sku === search) {
        return obj[key];
      }
      var option = obj[key].data.product_options[0]?.option_value;
      for (const id in option) {
        if (option[id].barcode === search) {
          return {
            product_id: obj[key].data?.product_id,
            name: obj[key].data.name,
            price: obj[key].data.price
              ? obj[key].data.special
              : obj[key].data.price,
            sku: obj[key].data.sku,
            option_name: obj[key]?.data.product_options[0]?.name,
            option_value: option[id],
            product_option_id:
              obj[key]?.data.product_options[0]?.product_option_id,
            quantity: 1,
            total: obj[key].data.price
              ? obj[key].data.special
              : obj[key].data.price
          };
        }
      }
    }
    return null; // Data not found
  }

  function findDataCart(obj, search) {
    console.log("oobj" + obj);
    for (const key in obj) {
      console.log(obj[key]);
      if (
        obj[key].option_value?.barcode === search ||
        obj[key].sku === search ||
        obj[key].model === search
      ) {
        return key;
      }
    }
    return null; // Data not found
  }

  //insert in cart
  function insertToCart(products) {
    setUpdate(false);
    const openRequest = indexedDB.open("posDB", 8);
    console.log("event");

    openRequest.onupgradeneeded = (event) => {
      console.log(event);
      const db = event.target.result;

      if (!db.objectStoreNames.contains("draft_cart")) {
        const objectStore2 = db.createObjectStore("draft_cart", {
          keyPath: "id"
        });
        // You can add indexes for faster searching if needed
      }
    };
    openRequest.onsuccess = (event) => {
      const db = event.target.result;

      const transaction = db.transaction("draft_cart", "readwrite");

      const objectStore = transaction.objectStore("draft_cart");

      const objectIdToUpdate = tabValue; // Provide the ID of the object you want to update

      const request = objectStore.get(objectIdToUpdate);

      request.onsuccess = (event) => {
        const existingObject = event.target.result;

        if (
          existingObject &&
          (!existingObject?.cart || !Array.isArray(existingObject?.cart))
        ) {
          existingObject.cart = [];
        }
        // Check if the object with the provided ID exists
        if (existingObject) {
          // console.log(existing)
          const newArrayToAdd = products;
          console.log("products-tabValue");
          console.log(products);
          console.log("products-2");

          existingObject.cart.push(newArrayToAdd[0]);

          // Update the modified object back into the object store
          const updateRequest = objectStore.put(existingObject);
          setUpdate(true);

          updateRequest.onsuccess = function (event) {
            console.log("Object updated successfully!");
            setUpdate(true);
          };

          var codeElement = document.getElementById("code");
          if (codeElement) {
            codeElement.value = ""; // Clear the value of the input field
            codeElement.focus(); // Optionally set focus back to the input field
          }

          updateRequest.onerror = function (event) {
            objectStore.add({ id: objectIdToUpdate, cart: products });

            setUpdate(true);
            console.error("Error updating object:", event.target.error);
            // setUpdate(true);
          };
        } else {
          setUpdate(true);
          objectStore.add({ id: objectIdToUpdate, cart: products });
        }
      };

      request.onerror = (event) => {
        console.error("Error inserting data", event.target.error);
      };
      // console.log("cart insert completed");
    };

    // Start inserting from index 0
  }

  function updateQuantity(d, search) {
    setUpdate(false);
    const productIdToUpdate = tabValue; // Provide the ID of the product you want to update
    const newQuantity = 5; // Provide the new quantity value

    const dbName = "posDB";
    const objectStoreName = "draft_cart";

    // Open the IndexedDB database
    const openRequest = indexedDB.open(dbName, 8);

    openRequest.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(objectStoreName, "readwrite");
      const objectStore = transaction.objectStore(objectStoreName);

      // Retrieve the main object from the object store
      const getRequest = objectStore.get(productIdToUpdate);

      getRequest.onsuccess = (event) => {
        const mainObject = event.target.result;
        console.log(mainObject);

        if (mainObject) {
          // Check if the product with the specified ID exists in the main object
          if (mainObject.cart && mainObject.cart.length > 0) {
            const productToUpdate = mainObject.cart.find(
              (product) => product.option_value?.barcode === search
            );

            if (productToUpdate) {
              // Update the quantity of the nested object within the main object
              productToUpdate.quantity = productToUpdate.quantity + 1;
              productToUpdate.total =
                productToUpdate.quantity * productToUpdate.price;
            } else {
              console.error(
                "Product with specified ID not found in the main object."
              );
              return;
            }
          } else {
            console.error(
              "Main object does not have a cart property or the cart is empty."
            );
            return;
          }

          // Update the modified main object back into the object store
          const updateRequest = objectStore.put(mainObject);

          updateRequest.onsuccess = function (event) {
            setUpdate(true);
            console.log("Main object updated successfully!");
          };

          updateRequest.onerror = function (event) {
            console.error("Error updating main object:", event.target.error);
          };
        } else {
          console.error(
            "Main object with the specified ID not found in the object store."
          );
        }
      };

      getRequest.onerror = (event) => {
        console.error("Error retrieving main object", event.target.error);
      };
    };
  }

  function deleteProduct(key) {
    const objectIdToDelete = tabValue; // Provide the ID of the row (object) you want to delete
    setUpdate(false);
    const dbName = "posDB";
    const objectStoreName = "draft_cart";
    const openRequest = indexedDB.open(dbName, 8);

    openRequest.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(objectStoreName, "readwrite");
      const objectStore = transaction.objectStore(objectStoreName);

      // Retrieve the main object from the object store
      const getRequest = objectStore.get(objectIdToDelete);

      getRequest.onsuccess = (event) => {
        const mainObject = event.target.result;
        console.log(mainObject);

        if (mainObject) {
          // Check if the object with the specified ID exists in the main object
          if (mainObject.cart && mainObject.cart.length > 0) {
            // Find the index of the object to be deleted
            const indexToDelete = key;

            if (indexToDelete !== -1) {
              // Remove the object from the main object (array) using 'splice'
              mainObject.cart.splice(indexToDelete, tabValue);

              // Update the modified main object back into the object store
              const updateRequest = objectStore.put(mainObject);
              setUpdate(true);
              updateRequest.onsuccess = function (event) {
                console.log("Object deleted successfully!");
              };

              updateRequest.onerror = function (event) {
                console.error("Error deleting object:", event.target.error);
              };
            } else {
              console.error(
                "Object with specified ID not found in the main object."
              );
            }
          } else {
            console.error(
              "Main object does not have a cart property or the cart is empty."
            );
          }
        } else {
          console.error(
            "Main object with the specified ID not found in the object store."
          );
        }
      };

      getRequest.onerror = (event) => {
        console.error("Error retrieving main object", event.target.error);
      };
    };
  }

  function updateQuantityValue(index, value, type) {
    setUpdate(false);
    const productIdToUpdate = tabValue; // Provide the ID of the product you want to update
    const newQuantity = 5; // Provide the new quantity value
    const dbName = "posDB";
    const objectStoreName = "draft_cart";

    // Open the IndexedDB database
    const openRequest = indexedDB.open(dbName, 8);

    openRequest.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(objectStoreName, "readwrite");
      const objectStore = transaction.objectStore(objectStoreName);

      // Retrieve the main object from the object store
      const getRequest = objectStore.get(productIdToUpdate);

      getRequest.onsuccess = (event) => {
        const mainObject = event.target.result;
        console.log(mainObject);

        if (mainObject) {
          // Check if the product with the specified ID exists in the main object
          if (mainObject.cart && mainObject.cart.length > 0) {
            const productToUpdate = mainObject.cart.find(
              (product, key) => key === index
            );

            console.log("productToUpdate");
            if (productToUpdate) {
              // Update the quantity of the nested object within the main object
              if (type === "plus") {
                productToUpdate.quantity = Number(productToUpdate.quantity) + 1;
                productToUpdate.total =
                  productToUpdate.price * productToUpdate.quantity;
              }

              if (type === "minus") {
                productToUpdate.quantity = Number(productToUpdate.quantity) - 1;
                productToUpdate.total =
                  productToUpdate.price * productToUpdate.quantity;
              }

              if (type === "value") {
                productToUpdate.quantity = value;
                productToUpdate.total =
                  productToUpdate.price * productToUpdate.quantity;
              }

              try {
                document.getElementById("cart_" + index).value = value;
              } catch (e) {}
              // alert(index)

              // productToUpdate.quantity;

              setUpdate(true);
            } else {
              console.error(
                "Product with specified ID not found in the main object."
              );
              return;
            }
          } else {
            console.error(
              "Main object does not have a cart property or the cart is empty."
            );
            return;
          }

          // Update the modified main object back into the object store
          const updateRequest = objectStore.put(mainObject);

          updateRequest.onsuccess = function (event) {
            setUpdate(true);
            console.log("Main object updated successfully!");
          };

          updateRequest.onerror = function (event) {
            console.error("Error updating main object:", event.target.error);
          };
        } else {
          console.error(
            "Main object with the specified ID not found in the object store."
          );
        }
      };

      getRequest.onerror = (event) => {
        console.error("Error retrieving main object", event.target.error);
      };
    };
  }

  function pay() {
    setShowModel(true);
  }

  function handlePrintOrder() {
    const url = "/posSystem/hold/";

    const windowFeatures =
      " toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=302.36220472441, height=250";

    window.open(url, "_blank", windowFeatures);
  }

  function confirmPos(confirm, calculate) {
    setConfirmDisalbe(true);
    manual(confirm, calculate);
  }
  function manual(confirm, calculate) {
    setManualResponse([]);
    var date = "";
    var time = "";
    const currentDate = new Date();
    const formattedDateTime = currentDate.toLocaleString();

    // saveOrderLocal();
    let body = {};
    console.log(result);
    let temp = [];
    const dt = result.cart;
    for (let index = 0; index < dt?.length; index++) {
      let new_product = {};
      let product_option = {};
      new_product.product_id = dt[index]["product_id"];
      new_product.name = dt[index]["name"];
      new_product.sku = dt[index]["sku"];
      new_product.model = dt[index]["model"];
      new_product.quantity = dt[index]["quantity"];
      new_product.unit_price = dt[index]["unit_price"];
      new_product.price = dt[index]["special"]
        ? dt[index]["special"]
        : dt[index]["price"];
      if (dt[index]["option_value"].length !== 0) {
        product_option["type"] = "radio";
        product_option["product_option_id"] = dt[index]["product_option_id"];
        product_option["name"] = dt[index]["option_name"];
        product_option["value"] = dt[index]["option_value"]["name"];
        product_option["product_option_value_id"] =
          dt[index]["option_value"]["product_option_value_id"];

        new_product.order_option = [product_option];
      }
      temp.push(new_product);
    }
    // console.log("manual-2");
    console.log(temp);
    if (!typeRef?.current?.value && !amountRef?.current?.value) {
      body = {
        order_product: temp,
        firstname: fnameRef?.current?.value || firstName || "",
        lastname: lnameRef?.current?.value || lastName || "Local Customer",
        email: "",
        address_1: "store",
        telephone: "9610000000044",
        address_2: "store store",
        city: "",
        shipping_method: "Delivery ( 1-4 days )",
        shipping_code: "ultimate_shipping.ultimate_shipping_0",
        payment_method: "Cash On Delivery",
        payment_code: "cod",
        comment: "",
        country_id: window.config["zone"],
        zone_id: 3995,
        modification_type: typeRef.current.value || "",
        modification: amountRef.current.value || "",
        modification_remarque: remarqueRef.current.value || "",
        zone: "Store",
        town_id: "",
        town: "",
        is_web: true,
        payment_session: false,
        source_id: 1,
        coupon: (couponRef && couponRef.current?.value) || "",
        code_version: window.innerWidth > 600 ? "web_desktop" : "web_mobile",
        total: total,
        sub_total: subTotal,
        user_id: 1069,
        order_total: total
      };
    } else {
      body = {
        order_product: temp,
        firstname: fnameRef?.current?.value || firstName || "",
        lastname: lnameRef?.current?.value || lastName || "Local Customer",
        email: "",
        address_1: "store",
        telephone: "96100000000",
        address_2: "store store",
        city: "",
        shipping_method: "Delivery ( 1-4 days )",
        shipping_code: "ultimate_shipping.ultimate_shipping_0",
        payment_method: "Cash On Delivery",
        payment_code: "cod",
        comment: "",
        country_id: window.config["zone"],
        zone: "Store",
        zone_id: 3995,
        modification_type: typeRef.current.value || "",
        modification: amountRef.current.value || "",
        modification_remarque: remarqueRef.current.value || "",
        currency_code: "USD",
        total: total,
        sub_total: subTotal,
        user_id: 1069, //Cookies.get("salsMan") ? Cookies.get("salsMan") : "",
        order_total: total,
        town_id: "",
        town: "",
        is_web: true,
        payment_session: false,
        source_id: 1,
        coupon: couponRef.current.value || "",
        code_version: window.innerWidth > 600 ? "web_desktop" : "web_mobile"
      };
    }

    if (isOnline) {
      axiosServer
        .post(
          buildLink(
            "manual",
            undefined,
            window.innerWidth,
            window.config["site-url"]
          ),
          body
        )
        .then((response) => {

          if (response.status == 200) {

          setManualResponse(response?.data?.data);

          if (response?.data?.success === false) {
            if (
              response?.data?.errors.length === 1 &&
              (response?.data.message === "OUT OF STOCK" ||
                response?.data?.message?.includes("STOCK") ||
                response?.data.message.includes("stock") ||
                response?.data.message.includes("Stock"))
            ) {
              if (calculate) {
                setShowCalculate(true);
                setTotal(response?.data?.data.total);
                setChange(response?.data?.data.total);
              }
              if (confirm) {
                body.hold_reason = response?.data.message;
                body.totals = response?.data?.data?.order_total;
                body.date = formattedDateTime;
                localStorage.setItem("print_order", JSON.stringify(body));
                handlePrintOrder();
                addOrder("hold_orders", body);
                setShowModel(false);
                setShowCalculate(false);
                setSuccess(true);
              }
            }
          } else {
            if (confirm == true) {
              const res = response?.data?.data;
              res.date  = formattedDateTime;
              paymentForm(confirm, "cod", res);

              body.totals = response?.data?.data?.order_total;
              body.date   = formattedDateTime;
              localStorage.setItem("print_order", JSON.stringify(body));

              handlePrintOrder();
              setShowModel(false);
              setShowCalculate(false);
              setSuccess(true);
            } else {
              if (calculate === true) {
                setShowCalculate(true);
                // setShowModel(false);
                setTotal(response?.data?.data.total);
                setChange(response?.data?.data.total);
              }
            }
          }
        }else{
          body.date = date + " " + time;

          localStorage.setItem("print_order", JSON.stringify(body));
    
          if (calculate) {
            if (fnameRef.current.value) {
              setShowCalculate(true);
              setChange(total);
            } else {
              setError({ firstName: "First Name is requird" });
            }
          }
          if (confirm) {
            body.hold_reason = "offline";
            addOrder("hold_orders", body);
            setShowCalculate(false);
            setShowModel(false);
            handlePrintOrder();
            deleteRow("draft_cart", tabValue);
          }

          
        }
        });
    } else {
      body.date = date + " " + time;

      localStorage.setItem("print_order", JSON.stringify(body));

      if (calculate) {
        if (fnameRef.current.value) {
          setShowCalculate(true);
          setChange(total);
        } else {
          setError({ firstName: "First Name is requird" });
        }
      }
      if (confirm) {
        body.hold_reason = "offline";
        addOrder("hold_orders", body);
        setShowCalculate(false);
        setShowModel(false);
        handlePrintOrder();
        deleteRow("draft_cart", tabValue);
      }
    }
  }
  // save order
  // function saveOrderLocal() {
  //   const dbName = "posDB";
  //   const dbVersion = 8;

  //   const request = indexedDB.open(dbName, dbVersion);

  //   // Handle database upgrade or creation
  //   request.onupgradeneeded = function (event) {
  //     const db = event.target.result;

  //     // Create an object store (table) in the database
  //     if (!db.objectStoreNames.contains("orders")) {
  //       const objectStore = db.createObjectStore("orders", {
  //         keyPath: "order_id",
  //         autoIncrement: false
  //       });
  //     }
  //   };

  //   // Handle successful database opening
  //   request.onsuccess = function (event) {
  //     const db = event.target.result;
  //     console.log("Database opened successfully.");

  //     // Now you can perform CRUD operations on the object store.
  //   };

  //   // Handle database opening error
  //   request.onerror = function (event) {
  //     console.error("Error opening database:", event.target.error);
  //   };
  // }

  function changeResult(value) {
    setChange(total);
    if (value !== "") {
      setChange(total - value);
    }
  }
  function addOrder(type, data) {
    const dbName = "posDB";
    const objectStoreName = type;

    const request = indexedDB.open(dbName);

    request.onsuccess = function (event) {
      const db = event.target.result;

      // Start a transaction on the object store for readwrite access
      const transaction = db.transaction(objectStoreName, "readwrite");

      // Get a reference to the object store
      const objectStore = transaction.objectStore(objectStoreName);

      // Use the add method to add the data to the object store
      var dataValue = {};
      if (type === "orders") {
        dataValue = { id: data.order_id, data: data };
      }
      if (type === "hold_orders") {
        dataValue = data;
      }

      const addRequest = objectStore.add(dataValue);

      addRequest.onsuccess = function (event) {
        console.log("Data added successfully:", event.target.result);
      };

      addRequest.onerror = function (event) {
        console.error("Error adding data:", event.target.error);
      };
    };

    request.onerror = function (event) {
      console.error("Error opening database:", event.target.error);
    };
  }

  function paymentForm(confirm, p_m, dataOrder) {
    axiosServer
      .post(
        buildLink(
          "payment_form",
          undefined,
          undefined,
          window.config["site-url"]
        ),
        { payment_method: p_m }
      )
      .then((response) => {
        const data = response.data;
        try {
          document.getElementById("simp-id").outerHTML = "";
        } catch (e) {}
        const script = document.createElement("script");
        script.src = "https://www.simplify.com/commerce/simplify.pay.js";
        script.async = false;
        script.id = "simp-id";
        document.body.appendChild(script);

        if (data.success) {
          if (p_m === "cod" && confirm) {
            confirmOrder(data.confirm_url, data.success_url, dataOrder);
          }
        } else {
          localStorage.setItem("payment_error-2", data);
        }
      });
  }

  function confirmOrder(c_url, s_url, dataOrder) {
    axiosServer.post(c_url).then((response) => {
      const data = response.data;
      if (data.success) {
        successOrder(s_url, dataOrder);
      }
    });
  }

  function successOrder(url, dataOrder) {
    axiosServer.get(url).then((response) => {
      const data = response.data;

      if (data.success) {
        addOrder("orders", dataOrder);
        deleteRow("draft_cart", tabValue);
      }
    });
  }

  function handleCouponChange() {
    if (couponRef.current.value.length < 1) {
      couponRef.current.value = "";
    }
  }

  function setCoupon() {
    if (couponRef.current.value.length > 1) {
      manual(false, false, true);
    } else {
    }
  }

  function modification() {
    // alert(1);
    setModificationError({});
    //  console.log(amountRef.current.value )
    if (remarqueRef.current.value === "" && amountRef.current.value === "") {
      setModificationError({
        remarque: "remarque is required",
        amount: "modifiction number is required"
      });
    } else if (amountRef.current.value === "") {
      setModificationError({ amount: "modifiction number is required" });
    } else if (remarqueRef.current.value === "") {
      setModificationError({
        remarque: "remarque is required"
      });
    } else {
      manual(false, false, true);
    }
  }

  function deleteRow(storeName, keyToDelete) {
    // Open a connection to the database
    setUpdate(false);

    const request = indexedDB.open(dbName);

    request.onerror = (event) => {
      console.error("Database error:", event.target.error);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;

      // Start a transaction on the object store
      const transaction = db.transaction(storeName, "readwrite");
      const objectStore = transaction.objectStore(storeName);

      // Delete the record using the key
      const deleteRequest = objectStore.delete(keyToDelete);
      setUpdate(true);
      deleteRequest.onsuccess = (event) => {
        console.log("Record deleted successfully");
      };

      deleteRequest.onerror = (event) => {
        console.error("Error deleting record:", event.target.error);
      };
    };

    request.onupgradeneeded = (event) => {
      // Handle database upgrades if needed
      console.log("Database upgrade needed");
    };
  }

  function newOrder() {
    document.getElementById("code")?.focus();

    setError({});
    setFirstName("");
    setLastName("");

    setSubTotal(0);
    setTotal(0);
    deleteRow("draft_cart", tabValue);
    var body = {
      order_product: [],
      customer_id: "",
      firstname: "initial firstname",
      lastname: "initial lastname",
      email: "initialmail@mail.com",
      address_1: "initial address one",
      telephone: "00000000",
      address_2: "",
      city: "",
      shipping_method: "Delivery ( 1-4 days )",
      shipping_code: "ultimate_shipping.ultimate_shipping_0",
      payment_method: "Cash On Delivery",
      payment_code: "cod",
      comment: "",
      country_id: window.config["zone"],
      payment_session: "",
      zone_id: "",
      zone: "",
      modification_type: "",
      modification: "",
      modification_remarque: "",

      is_web: true,
      //   Cookies.get("change") === "false" || Cookies.get("change") === false
      //     ? false
      //     : true,
      // user_id: Cookies.get("salsMan")
      //   ? Cookies.get("salsMan")
      //   : Cookies.get("user_id"),
      user_id: 1069,

      source_id: 1,
      coupon: "",
      code_version: window.innerWidth > 600 ? "web_desktop" : "web_mobile"
    };
    axiosServer
      .post(
        buildLink("manual", undefined, undefined, window.config["site-url"]),
        body
      )
      .then((response) => {
        if (response.status == 200) {
          setIsOnline(true);
        } else {
          setIsOnline(false);
        }
      });
    document.getElementById("code").focus();
  }

  return (
    <div className="fixed min-h-screen w-full z-30 top-0 bg-dgrey -ml-3">
      <div className="flex justify-start bg-white px-5 py-2 mb-2">
        <a
          target="_blank"
          className="text-dblue text-xl"
          rel="noreferrer"
          href={"/posSystem/pos"}
        >
          Pos
        </a>
        <a
          target="_blank"
          className="px-6 text-dblue text-xl"
          rel="noreferrer"
          href={"/posSystem/orders"}
        >
          orders list
        </a>
      </div>
      {success && (
        <div className="absolute z-30 w-full min-h-screen bg-dblack opacity-20 -ml-3 pointer-events-none flex justify-center"></div>
      )}
      {/* Add your POS page content here */}
      {showCalculte && (
        <>
          <div className="absolute z-50 w-full min-h-screen bg-dblack opacity-20 -ml-3 pointer-events-none flex justify-center "></div>
          <div class="absolute w-1/2  left-1/4 top-1/3  z-50">
            <div class="pointer-events-none   translate-y-[-50px]  transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]">
              <div class="p-5 min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-dinputBorder bg-white  text-current shadow-lg outline-none ">
                <div class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-dinputBorder ">
                  <h5
                    class="text-xl font-medium leading-normal"
                    id="exampleModalLabel"
                  >
                    Complete Order
                  </h5>
                  <button onClick={() => setShowCalculate(false)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="h-6 w-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div class="relative flex-auto p-4">
                  <div>
                    <label className="w-1/2">rendered : </label>
                    <input
                      className="w-1/2 border ml-3 border-dlabelColor p-2 rounded-sm"
                      id="rendered"
                      onChange={(e) => changeResult(e.target.value)}
                    />
                  </div>
                </div>
                <div class="relative flex-auto p-4">
                  <div>
                    <label className="w-1/2">Change : </label>
                    <span className="w-1/2 border ml-3 border-dinputBorder bg-dgreyRate p-2">
                      {change}{" "}
                    </span>
                  </div>
                </div>

                <div class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-dinputBorder pt-3">
                  <button
                    class="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border  text-dbase border-dbase text-gray-600 rounded-full hover:shadow-lg"
                    // onClick={() => setShowCalculate(false)}
                  >
                    Close
                  </button>
                  <button
                    class="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-dblue border-dblue rounded-full hover:shadow-lg ml-3"
                    onClick={() => confirmPos(true, false)}
                  >
                    Confirm Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {showModel && (
        <>
          <div className="absolute z-10 w-full min-h-screen bg-dblack opacity-20 -ml-3 pointer-events-none flex justify-center "></div>
          <div class="absolute w-1/2  left-1/4 top-5  z-40">
            <div class="absolute top-0"></div>
            <div class="w- p-5  mx-auto my-auto rounded-xl shadow-lg  bg-white ">
              {/* <button
                onClick={() => {
                  setShowModel(false);
                }}
                class=" absolute z-60  -top-2.5 -right-2.5 mb-2 md:mb-0 bg-white w-7 h-7 text-sm shadow-sm font-xl tracking-wider  text-gray-600  hover:shadow-lg rounded-full"
              >
               X
              </button> */}
              <div class="">
                <div className="pr-semibold  text-xl w-full">
                  {" "}
                  Customer Info
                </div>
                <div className="flex  px-2 pt-2">
                  <div>
                    <div className="text-l"> telephone: </div>{" "}
                    <div className="w-full">
                      <HandlePhoneModel
                        phone={telephone}
                        phoneHanlder={phoneHanlder}
                        pos={true}
                        AdminPhoneHandler={AdminPhoneHandler}
                      />{" "}
                    </div>
                  </div>{" "}
                  <div className="px-2">
                    <div className="text-l"> First Name: </div>{" "}
                    <div className="text-xl flex-col">
                      {" "}
                      <input
                        className="rounded border border-dlabelColor py-0.5 px-2 w-full"
                        ref={fnameRef}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                        }}
                      />
                      {error.firstName && (
                        <span className="text-dbase text-md">
                          {error.firstName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-l"> Last Name: </div>{" "}
                    <div className="  text-xl">
                      {" "}
                      <input
                        className="rounded border border-dlabelColor py-0.5 px-2"
                        ref={lnameRef}
                        onChange={(e) => {
                          setLastName(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="pr-semibold  text-xl w-full py-5">
                  {" "}
                  Summary Order
                </div>
                <div className="flex pb-8  ">
                  <div className="pt-3 pr-2"></div>
                  <input
                    style={{ borderColor: "rgb(230, 230, 230)" }}
                    type="text"
                    className="border flex-grow rounded-tl rounded-bl border-dlabelColor  h-10 px-5"
                    placeholder="Coupon Code or Gift Card"
                    ref={couponRef}
                    onChange={() => handleCouponChange()}
                  />
                  <div
                    onClick={() => setCoupon()}
                    className="bg-dblue text-white px-3 h-10 rounded-tr rounded-br text-sm"
                  >
                    <p className="text-center mt-3">APPLY</p>
                  </div>{" "}
                </div>{" "}
                <div className="flex px-2">
                  <div className="w-1/3">
                    <div className="text-l w-1/4 "> type: </div>{" "}
                    <div className=" text-xl ">
                      <select
                        style={{ borderColor: "rgb(230, 230, 230)" }}
                        className="bg-white relative px-5 h-9 border text-sm font-semibold border-dlabelColor cursor-pointer rounded"
                        ref={typeRef}
                      >
                        <option value="amount"> Amount</option>
                        <option value="discount"> % percentage</option>
                      </select>
                    </div>
                  </div>
                  <div className="px-2">
                    <div className="text-l w-1/4"> modification: </div>{" "}
                    <div className=" text-xl">
                      {" "}
                      <input
                        className="rounded border border-dlabelColor py-0.5 px-2"
                        ref={amountRef}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-l w-1/4"> Remarq: </div>{" "}
                    <div className="  text-xl">
                      {" "}
                      <input
                        className="rounded border border-dlabelColor py-0.5 px-2"
                        ref={remarqueRef}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex  text-xl justify-end px-2">
                  <button
                    onClick={modification}
                    className="m-2 w-auto md:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider bg-dblue text-white rounded-full hover:shadow-lg hover:bg-red-600"
                  >
                    apply
                  </button>
                </div>
                {manualResponse?.order_total?.length > 0 ? (
                  manualResponse?.order_total?.map(
                    (total) =>
                      total.title !== "Store" && (
                        <div className="flex items-center justify-between mb-1 text-dblack w-1/2">
                          <span>{total.title}</span>
                          <span>{total.text}</span>
                        </div>
                      )
                  )
                ) : (
                  <div className="">
                    <div className="flex items-center justify-between mb-1 text-dblack w-1/2">
                      <div className=" w-1/4"> Sub-Total: </div>{" "}
                      <div className="  "> ${total}</div>
                    </div>
                    <div className="flex items-center justify-between mb-1 text-dblack w-1/2">
                      <div className=""> Total: </div>{" "}
                      <div className=" "> ${total}</div>
                    </div>
                  </div>
                )}
                {/* <div className="grid grid-cols-2 space-y-1  pt-2">
                  <div className="text-l w-1/4"> Number: </div>{" "}
                  <div className="text-xl">
                    {" "}
                    <input className="rounded border border-dlabelColor p-0.5" />
                  </div>
                  <div className="text-l w-1/4"> Change: </div>{" "}
                  <div className="  text-xl">${total}</div>
                </div> */}
                <div class="p-3  mt-2 text-center space-x-4 md:block">
                  <button
                    onClick={() => {
                      setShowModel(false);
                    }}
                    class="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      confirmPos(false, true);
                    }}
                    class="mb-2 md:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-dhotPink rounded-full hover:shadow-lg hover:bg-red-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

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
          {/* <div onClick={() => deleteTable()}>delete</div>
          <div onClick={() => addNewTable()}>Add</div> */}

          <div className=" overflow-y-auto h-3/3 py-6">
            {result?.cart
              ?.map((cart, key) => (
                <div className="flex my-2 justify-between w-full px-5 pt-5  bg-white rounded-xl">
                  <div className="w-1/12">{key}</div>
                  <div className="w-5/12 text-l ">
                    {cart.name}
                    <div className="flex ">
                      <div className="flex justify-between text-dbase">
                        {cart.option_name || cart.option_name} :{" "}
                        {cart.option_value?.name}
                      </div>
                      <div className="pl-6">{cart.sku}</div>
                    </div>
                  </div>

                  <div className="flex w-6/12 justify-between">
                    <div className="text-l mt-1  pr-semibold   text-center w-1/3">
                      {" "}
                      ${cart.total ? cart.price : 0}
                    </div>
                    {/* <input
                    onKeyDown={() =>
                      updateQuantityValue(key, e.target.value, "value")
                    }
                    className="px-2 border border-1 text-center w-20 h-10"
                    value={cart.quantity}
                  /> */}

                    <div className=" px-6 w-1/3 flex flex-col items-end text-dblack justify-center -mt-9">
                      <span className=" font-semibold text-lg">
                        {/* {item.total} */}
                      </span>
                      <div className="flex mt-4">
                        <button
                          className="w-10 h-10  text-2xl border border-dinputBorder rounded-tl rounded-bl cursor-pointer hover:shadow"
                          onClick={() =>
                            updateQuantityValue(key, cart?.quantity, "minus")
                          }
                        >
                          -
                        </button>
                        <input
                          type="number"
                          id={`cart_${key}`}
                          //  ref={qtyRef}
                          value={cart?.quantity}
                          className="border border-dinputBorder w-12 h-10 border-r-0 border-l-0 text-center focus:outline-none"
                          onKeyDown={(e) =>
                            updateQuantityValue(key, e.target.value, "value")
                          }
                        />

                        <button
                          className="w-10 h-10  text-2xl border border-dinputBorder  rounded-tr rounded-br cursor-pointer hover:shadow"
                          onClick={() =>
                            updateQuantityValue(key, cart?.quantity, "plus")
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-l mt-1 text-center pr-semibold px-6 w-1/3">
                      {" "}
                      ${cart.total ? cart.total : 0}
                    </div>
                  </div>
                  <div className="w-1/24">
                    <button
                      className="text-xxl text-dbase pr-bold align-middle -mt-3"
                      onClick={() => deleteProduct(key)}
                    >
                      x
                    </button>
                  </div>
                </div>
              ))
              .reverse()}
          </div>
        </div>
        <div className="w-4/12 pt-5 ">
          <Link
            href="/posSystem/pos"
            className={` w-full p-3 m-5  ${
              tabValue === 1
                ? "bg-dblue text-white rounded-md"
                : "border rounded-md  border-dblue text-dblue "
            }`}
          >
            Tab 1 {}
          </Link>
          <Link
            href="/posSystem/pos?tab=2"
            className={` w-full p-3 m-5  ${
              tabValue === "2"
                ? "bg-dblue text-white rounded-md"
                : "border rounded-md  border-dblue text-dblue"
            }`}
          >
            Tab 2
          </Link>
          <Link
            href="/posSystem/pos?tab=3"
            className={` w-full p-3 m-5  ${
              tabValue === "3"
                ? "bg-dblue text-white rounded-md"
                : "border rounded-md  border-dblue text-dblue "
            }`}
          >
            Tab 3
          </Link>

          <Link
            href="/posSystem/pos?tab=4"
            className={` w-full p-3 m-5  ${
              tabValue === "4"
                ? "bg-dblue text-white rounded-md"
                : "border rounded-md  border-dblue text-dblue "
            }`}
          >
            Tab 4
          </Link>
        </div>
        <div className=" fixed flex w-full bottom-0 justify-between  h-1/12 bg-white p-6   ">
          <div className="flex ">
            You are {isOnline ? "online" : "offline"}{" "}
            <span
              className={` ml-2 mt-1.5 w-3 h-3 p-1  rounded-full ${
                !isOnline ? " bg-dbase" : "bg-dgreen"
              }`}
            ></span>
          </div>

          <div className="pr-semibold  text-2xl"> Total: ${subTotal || 0}</div>

          {/* {success ? ( */}
          <button
            className=" bg-dblue px-8 text-white text-xxl w-3/12  text-center py-1 z-50 -mr-48"
            onClick={newOrder}
          >
            New Order
          </button>
          {/* ) : ( */}
          <button
            className=" bg-Orangeflo px-12 text-white text-xxl w-3/12  text-center py-1"
            onClick={pay}
          >
            {" "}
            Pay
          </button>

          {/* )} */}
        </div>
      </div>
    </div>
  );
}
export default Pos;

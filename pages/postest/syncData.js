import React, { useEffect, useState } from "react";
import { axiosServer } from "@/axiosServer";
import ProgressBar from "@/components/ProgressBar";

function Syncdata() {
  const [search, setSearch] = useState();
  const [data, setData] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tasks, setTasks] = useState();

  const syncData = (totalTask) => {
    const totalTasks = totalTask;
    let completedTasks = 0;

    setSyncing(true);
    setProgress(0);

    const intervalId = setInterval(() => {
      completedTasks++;
      const progress = (completedTasks / totalTasks) * 100;
      setProgress(progress);

      if (progress === 100) {
        clearInterval(intervalId);
        setSyncing(false);
      }
    }, 1000);
  };

  const completeTask = (taskId) => {
    console.log(taskId);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task
      )
    );
  };

  const dbName = "posDB";

  const handleSaveIndexDb = async () => {
    const openRequest = indexedDB.open(dbName, 7);

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
    const data = resp.data;
    console.log(data);
    insertBatchData(data.products, db);

    if (resp.data.total) {
      completeTask(1);
      console.log(tasks);
      syncData(Math.ceil(resp.data.total / itemsPerPage) + 1);

      for (var i = 2; i < Math.ceil(resp.data.total / 50) + 1; i++) {
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
        // completeTask(i);
        if (resp.status == 200) {
          completeTask(i);
          const newData = resp.data;

          insertBatchData(newData.products, db);
        }
      }
    }
  };

  const insertBatchData = (dataArray, db) => {
    const transaction = db.transaction("products", "readwrite");
    const objectStore = transaction.objectStore("products");
    console.log(dataArray);

    const insertNext = (index) => {
      if (index < dataArray?.length) {
        const request = objectStore.add({
          id: Number(dataArray[index].product_id),
          data: dataArray[index]
        });
        // completeTask(index)
        request.onsuccess = () => {
          console.log("Data inserted successfully");
          insertNext(index + 1);
        };

        request.onerror = (event) => {
          console.error("Error inserting data", event.target.error);
        };
      } else {
        console.log("Batch insert completed");
      }
    };

    insertNext(0);
  };

  function getDataFromObjectStore(db, objectStoreName, key) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(objectStoreName, "readonly");
      const objectStore = transaction.objectStore(objectStoreName);
      const request = objectStore.getAll();

      transaction.oncomplete = () => {
        resolve(request.result);
      };

      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  }
  function getAllProducts(tableName) {
    // Usage example:

    const dbName = "posDB";
    const key = "id"; // Replace with the specific key you want to retrieve

    const request = indexedDB.open(dbName);

    request.onerror = (event) => {
      console.error("Error opening the database", event);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      getDataFromObjectStore(db, tableName, key)
        .then((data) => {
          if (data) {
            console.log("Data:", data);
            setData(data);
            // Do something with the data
          } else {
            console.log("Data not found.");
          }
        })
        .catch((error) => {
          console.error("Error getting data:", error);
        });
    };
  }
  useEffect(() => {
    getAllProducts("products");

    axiosServer
      .post(
        "https://www.flo-lebanon.com/api/v2/?route=catalog/product/ListOfProductsPos&limit=50&page=1",
        {
          headers: {
            "Content-Type": "application/json"
          },
          body: {}
        }
      )
      .then((resp) => {
        const taskList = [];

        if (resp.data.total) {
          for (
            var i = 1;
            i < Math.ceil(resp.data.total / itemsPerPage) + 1;
            i++
          ) {
            taskList.push({
              id: i,
              description: "Task " + i,
              completed: false
            });
            console.log(taskList);
          }
          setTasks(taskList);
        }
      });
  }, []);

  function addNewTable() {
    // Your logic to insert products to the cart goes here
    const openRequest = indexedDB.open("posDB", 7);
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

  const itemsPerPage = 50;
  const offset = currentPage * itemsPerPage;
  const currentPageData = data?.slice(offset, offset + itemsPerPage);

  function createTable(tableName) {
    // Open a connection to the IndexedDB database
    const dbName = "posDB";
    const dbVersion = 7;

    let request = indexedDB.open(dbName, dbVersion);

    request.onerror = function (event) {
      console.error("Error opening database:", event.target.errorCode);
    };

    request.onupgradeneeded = function (event) {
      const db = event.target.result;

      // Create a new object store (table) if it doesn't exist
      if (!db.objectStoreNames.contains(tableName)) {
        db.createObjectStore(tableName, { keyPath: "id" });
        // Replace "id" with your desired key for each record.
        // Setting autoIncrement to true will automatically generate unique IDs for each record.
      }

      // Check if the object store (table) exists
      if (db.objectStoreNames.contains("products")) {
        // Delete the existing object store
        db.deleteObjectStore("products");
      }

      // Recreate the object store without autoIncrement
      const objectStore = db.createObjectStore("products", {
        keyPath: "id"
      });
      // Replace "id" with your desired key for each record.
    };

    request.onsuccess = function (event) {
      console.log("Database opened successfully!");
      const db = event.target.result;
      // You can start working with the database here
    };

    request.onblocked = function (event) {
      console.error(
        "Database connection blocked. Please close other tabs or applications using this database."
      );
    };
  }

  return (
    <div className="pr-5">
      <button onClick={handleSaveIndexDb} className="bg-dblue text-white p-2">
        Sync products all
      </button>

      <button onClick={addNewTable} className="bg-dblue text-white p-2 mx-3">
        create new table
      </button>

      <button
        onClick={() => createTable("product")}
        className="bg-dblue text-white p-2 mx-3"
      >
        create new table product
      </button>

      <div>
        {syncing && (
          <>
            <br></br>
            <ProgressBar progress={progress} />

            <table class="table border-collapse border w-full mt-5">
              <thead className=" text-left pr-bold bg-dlabelColor">
                <tr class="border border-gray-400 p-2"> 
                  <th class="border border-gray-400 p-2">#</th>
                  <th class="border border-gray-400 p-2">sync</th>
                  <th class="border border-gray-400 p-2">action</th>
                </tr>
              </thead>

              <tbody>
                {tasks?.map((task, i) => (
                  <tr key={i}>
                    <td class="border border-gray-400 p-2">{task.id} </td>

                    <td class="border border-gray-400 p-2">
                      {" "}
                      {task.completed ? (
                        <span className="px-7 text-dgreen">Completed</span>
                      ) : (
                        <span className="px-7 text-dhotPink">
                          Not Completed
                        </span>
                      )}
                    </td>

                    <td class="border border-gray-400 p-2">
                      {" "}
                      {!task.completed && (
                        <button
                          className="px-5 bg-dblue text-white"
                          onClick={() => completeTask(task.id)}
                        >
                          Task
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default Syncdata;

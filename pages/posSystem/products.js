import React, { useEffect, useState } from "react";
import { axiosServer } from "@/axiosServer";
import ReactPaginate from "react-paginate";

function Syncdata() {
  const [data, setData] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  

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
  }, []);

 

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  const itemsPerPage = 20;
  const offset = currentPage * itemsPerPage;
  const currentPageData = data?.slice(offset, offset + itemsPerPage);



  return (
    <div className="pr-5">
   
      <table className="table border-collapse border w-full mt-5">
        <thead className=" text-left pr-bold bg-dlabelColor">
          <tr className="border border-gray-400 p-2">
            <th className="border border-gray-400 p-2">id</th>
            <th className="border border-gray-400 p-2">name</th>
            <th className="border border-gray-400 p-2">sku</th>
            <th className="border border-gray-400 p-2">model</th>
            <th className="border border-gray-400 p-2">qty</th>
          </tr>
        </thead>

        <tbody>
          {currentPageData?.map((p, key) => (
            <tr>
              <td className="border border-gray-400 p-2">{p.data.product_id}</td>
              <td className="border border-gray-400 p-2">{p.data.name}</td>
              <td className="border border-gray-400 p-2">{p.data.sku}</td>
              <td className="border border-gray-400 p-2">{p.data.model}</td>
              <td className="border border-gray-400 p-2">{p.data.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={Math.ceil(data?.length / itemsPerPage)}
        onPageChange={handlePageChange}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
}

export default Syncdata;

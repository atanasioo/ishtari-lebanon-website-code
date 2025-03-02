import Image from "next/image";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import useDeviceSize from "../useDeviceSize";

const ProductOptionModal = ({ setShowOptionModal, bundle, addCart }) => {
  const [width] = useDeviceSize();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const temp = [];
    bundle.products.map((p, i) => {
      p.product_options.length > 0
        ? temp.push({
            product_id: p.product_id,
            quantity: Number(p.required_quantity),
            checked: false,
            // Store options for each individual item in the quantity
            options: Array(p.required_quantity).fill(null),
          })
        : temp.push({
            product_id: p.product_id,
            quantity: Number(p.required_quantity),
          });
    });
    setProducts(temp);
  }, []);

  function checkActive(id, key, value, quantity, itemIndex) {
    const temp = [...products];
    const productIndex = temp.findIndex((p) => p.product_id === id);
    if (productIndex !== -1) {
      temp[productIndex].options[itemIndex] = { [`${key}`]: value };
      // Corrected condition: checked is true if *at least one* option is selected
      temp[productIndex].checked = temp[productIndex].options.some(
        (option) => option !== null
      );
    }
    setProducts(temp);
    setError("");
  }


  function prepareData() {
    let totalSelectedOptions = 0;
    let totalRequiredQuantity = 0;
  
    products.forEach((p) => {
      if (p.options !== undefined) {
        totalRequiredQuantity += p.quantity; 
        totalSelectedOptions += p.options.filter(option => option !== null).length;
      }
    });
  
    if (totalSelectedOptions !== totalRequiredQuantity) {
      setError("Please select an option for each item");
    } else {
      const temp = [];
      products.map((p) => {
        if (p.options !== undefined) {
          p.options.forEach((option) => {
            temp.push({
              product_id: p.product_id,
              quantity: 1, 
              option: option,
            });
          });
        } else {
          temp.push({
            product_id: p.product_id,
            quantity: p.quantity,
          });
        }
      });
      temp.map((p) => {
        addCart(p);
      });
      setShowOptionModal({ show: false });
    }
  }

  return (
    <div className="relative">
      <div className="fixed w-full min-h-full bg-dblack top-0 left-0 z-50 bg-opacity-50 flex flex-col items-center justify-center">
        <div
          className="verifyPhone flex flex-col bg-white lg:w-1/2"
          style={{ height: "530px" }}
        >
          <div className="flex w-full justify-end ">
            <div
              className="cursor-pointer text-d22 px-4 py-1"
              onClick={() => {
                setShowOptionModal({ show: false });
              }}
            >
              x
            </div>
          </div>
          <div
            className="w-full flex-1 flex flex-col justify-end "
            style={{ height: "100px", borderRadius: "16px 16px 0px 0px" }}
          >
            <div
              className={`flex-1 bg-white  ${
                width > 650 ? "px-10 py-6" : "px-2"
              }`}
            >
              <div className="block flex-1 justify-center h-full">
                <div className="pt-3 flex-1 flex flex-col gap-4 justify-center ">
                  {/* <span className="font-bold text-2xl flex text-center justify-center items-center">
                    Product Options
                  </span> */}
                  <span className=" font-bold flex text-center justify-center items-center">
                    Please select options:
                  </span>
                  {error !== "" && (
                    <span className="bg-dbase p-2 text-center text-white">
                      {" "}
                      Must select an option{" "}
                    </span>
                  )}
                  <div className="flex flex-col gap-1 w-full h-80 overflow-y-auto">
                    {bundle.products.map((p, i) => {
                      let repeatedProducts = [];
                      for (let j = 0; j < p.required_quantity; j++) {
                        repeatedProducts.push(
                          <div
                            key={`${p.product_id}_${j}`}
                            className={`flex items-center ${
                              width > 650 && "ml-10"
                            } gap-3 p-1`}
                          >
                            <img src={p.thumb} className="w-20 h-20 " />
                            <div className="flex flex-col w-full">
                              {" "}
                              <p className={"w-full"}>{p.name} x1</p>
                              <div
                                className={`flex ${width > 650 && "gap-1"}w-20`}
                              >
                                {p.product_options.length > 0 &&
                                  p.product_options[0]["option_value"].map(
                                    (option) => (
                                      <div
                                        key={option.product_option_id}
                                        className="mr-3 w-10 h-10"
                                        onClick={() => {
                                          option.quantity !== "0"
                                            ? checkActive(
                                                p.product_id,
                                                p.product_options[0]
                                                  .product_option_id,
                                                option.product_option_value_id,
                                                p.required_quantity,
                                                j
                                              )
                                            : console.log();
                                        }}
                                      >
                                        <div
                                          key={option.image}
                                          className={`p-1 border cursor-pointer hover:shadow w-10 md:w-12 md:h-12 rounded relative ${
                                            products.filter(
                                              (ps) =>
                                                ps.product_id === p.product_id
                                            )[0]?.options[j] && // check option for this specific item (j)
                                            option.product_option_value_id ===
                                              products.filter(
                                                (ps) =>
                                                  ps.product_id === p.product_id
                                              )[0]?.options[j][
                                                p.product_options[0]
                                                  .product_option_id
                                              ]
                                              ? "border-dblue"
                                              : " border-dgrey"
                                          }`}
                                        >
                                          {option.quantity === "0" && (
                                            <div className=" bg-dgrey bg-opacity-50 w-full h-full absolute top-0 left-0 flex items-center justify-center cursor-not-allowed">
                                              <div className=" text-dblack text-4xl font-bold">
                                                X
                                              </div>
                                            </div>
                                          )}

                                          <img
                                            src={option.image}
                                            key={option.image}
                                            width={40}
                                            height={40}
                                            alt={"Option"}
                                            className="w-full h-auto"
                                            placeholdersrc="https://www.sari3.com/ishtaridemo/product_placeholder.png"
                                          />
                                        </div>
                                      </div>
                                    )
                                  )}
                              </div>{" "}
                              {p.product_options.length > 0 && error !== "" && (
                                <div className="mt-1 text-sm text-dbase">
                                  {error}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }
                      return repeatedProducts;
                    })}
                  </div>
                </div>

                <div
                  className={`mt-1 py-3 flex justify-center border-t border-dplaceHolder gap-6 w-full ${
                    width > 650 ? "text-sm" : "text-xs "
                  }`}
                >
                  <button
                    className={`uppercase text-center ${
                      width > 650 ? "w-32" : "w-20"
                    } text-white py-2 px-4 cursor-pointer rounded`}
                    style={{
                      background: "rgb(56, 102, 223)",
                    }}
                    onClick={() => {
                      prepareData();
                    }}
                  >
                    Confirm
                  </button>
                  <button
                    className={`uppercase  text-center ${
                      width > 650 ? "w-32" : "w-20"
                    } text-white py-2 px-4 cursor-pointer rounded`}
                    style={{
                      background: "rgb(56, 102, 223)",
                    }}
                    onClick={() => {
                      setShowOptionModal({ show: false });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOptionModal;

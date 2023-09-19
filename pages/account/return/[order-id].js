import { axiosServer } from "@/axiosServer";
import buildLink from "@/urls";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { BsCamera } from "react-icons/bs";
import Image from "next/image";
function ReturnProducts() {
  const router = useRouter();
  let id = router.query["order-id"];
  const products = router.query["products"];
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [returnProducts, setReturnProducts] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [actionReqs, setActionsReqs] = useState([]);
  const [qtyDropDown, setQtyDropDown] = useState({ bool: false, index: 0 });
  const [reasonDropDown, setReasonDropDown] = useState({
    bool: false,
    index: 0,
  });
  const [actionDropDown, setActionDropDown] = useState({
    bool: false,
    index: 0,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    axiosServer
      .get(buildLink("get_account", undefined, window.innerWidth))
      .then((response) => {
        setLoading(false);

        if (!response.data.success) {
          router.push("/");
        }
      });
    axiosServer
      .get(buildLink("order_details", undefined, window.innerWidth) + id)
      .then((response) => {
        if (response.data.success) {
          setData(response?.data.data);
          setLoading(false);
        }
      });

    axiosServer
      .get(buildLink("getReturnReasons", undefined, undefined))
      .then((response) => {
        setReasons(response.data.data.reasons);
        setActionsReqs(response.data.data.action_requests);
      });
  }, []);

  console.log(actionReqs);

  const handleQty = (value, index) => {
    const updatedReturnProducts = [...returnProducts];

    if (!updatedReturnProducts[index]) {
      updatedReturnProducts[index] = {};
    }
    updatedReturnProducts[index].quantity = value;
    setReturnProducts(updatedReturnProducts);
  };

  const handleActionReq = (value, text, index) => {
    const updatedReturnProducts = [...returnProducts];

    if (!updatedReturnProducts[index]) {
      updatedReturnProducts[index] = {};
    }
    updatedReturnProducts[index].action_request = value;
    updatedReturnProducts[index].action_request_text = text;
    setReturnProducts(updatedReturnProducts);
  };

  const handleReturnReason = (id, name, index) => {
    const updatedReturnProducts = [...returnProducts];
    if (!updatedReturnProducts[index]) {
      updatedReturnProducts[index] = {};
    }
    updatedReturnProducts[index].return_reason_id = id;
    updatedReturnProducts[index].return_reason_name = name;
    setReturnProducts(updatedReturnProducts);
  };

  const handleComment = (value, index) => {
    const updatedReturnProducts = [...returnProducts];
    if (!updatedReturnProducts[index]) {
      updatedReturnProducts[index] = {};
    }
    updatedReturnProducts[index].comment = value;
    setReturnProducts(updatedReturnProducts);
  };

  console.log(returnProducts);

  const submitRequest = () => {};

  return (
    <div>
      <div className="py-5 relative">
        <h1 className="text-center pr-bold text-d20 pt-2 pb-8">
          Return Products
        </h1>

        <div
          onClick={() => submitRequest()}
          className={` ${
            success
              ? "bg-dgreen pointer-events-none"
              : "bg-dblue cursor-pointer"
          } rounded-full text-white py-1 px-8 pr-semibold text-center w-max text-d17 absolute top-7 right-2 `}
        >
          {success ? "Request sent successfully" : "Save"}
        </div>

        <div className="grid lg:grid-cols-2 mt-2 gap-10">
          {data?.products.map((item, i) => (
            <div
              className={`${
                products.includes(item.product_id) ? "" : "hidden"
              }`}
              key={item.product_id}
            >
              <div className="flex items-center mb-3 gap-3">
                <div>
                  <Image
                    className="w-36 h-[196px]"
                    height={"196"}
                    width={144}
                    src={item?.image}
                    alt={item?.name}
                  />
                </div>
                <div>
                  <div>{item?.name}</div>
                  <div>{item?.price}</div>
                  <span className="font-semibold text-sm">
                    {" "}
                    {item?.option[0]?.name &&
                      item?.option[0]?.name +
                        " ( " +
                        item?.option[0]?.value +
                        " )"}{" "}
                  </span>{" "}
                </div>
              </div>
              <div className="text-sm  flex flex-col gap-5">
                <div className="relative">
                  <div
                    onClick={() =>
                      setQtyDropDown({ bool: !qtyDropDown.bool, index: i })
                    }
                    className="border rounded-tl-3xl rounded-br-3xl rounded-tr-md rounded-bl-md p-1.5 px-3  flex justify-between cursor-pointer"
                  >
                    <div>
                      Quantity:{" "}
                      {returnProducts[i] && returnProducts[i].quantity && (
                        <span className="pr-semibold">{returnProducts[i].quantity}</span>
                      )}
                    </div>

                    <BiChevronDown className="w-6 h-6" />
                  </div>
                  {qtyDropDown.bool && qtyDropDown.index === i && (
                    <div className="bg-white absolute z-10 w-full border rounded">
                      {Array.from(
                        {
                          length: parseInt(item?.quantity),
                        },
                        (_, index) => index + 1
                      ).map((value, k) => (
                        <div
                          onClick={() => {
                            handleQty(value, i);
                            setQtyDropDown(false);
                          }}
                          className=" px-2 py-1 hover:bg-dblue hover:text-white cursor-pointer"
                          key={k}
                        >
                          {value}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <div
                    onClick={() =>
                      setActionDropDown({
                        bool: !actionDropDown.bool,
                        index: i,
                      })
                    }
                    className="border rounded-tl-3xl rounded-br-3xl rounded-tr-md rounded-bl-md p-1.5 px-3  flex justify-between cursor-pointer"
                  >
                    <div>Action request: {returnProducts[i] && returnProducts[i].action_request_text && (
                        <span className="pr-semibold">{returnProducts[i].action_request_text}</span>
                      )}</div>
                    <BiChevronDown className="w-6 h-6" />
                  </div>
                  {actionDropDown.bool && actionDropDown.index === i && (
                    <div className="bg-white absolute z-10 w-full border rounded">
                      {actionReqs.map((req) => (
                        <div
                        onClick={() => {
                          handleActionReq(req.key, req.value, i);
                          setActionDropDown({
                            bool: !actionDropDown.bool,
                            index: i,
                          });
                        }}
                        className=" px-2 py-1 hover:bg-dblue hover:text-white cursor-pointer"
                      >
                        {req.value}
                      </div>
                      ))}
                      
                      {/* <div
                        onClick={() => {
                          handleActionReq("replace", actionReqs.replace, i);
                          setActionDropDown({
                            bool: !actionDropDown.bool,
                            index: i,
                          });
                        }}
                        className=" px-2 py-1 hover:bg-dblue hover:text-white cursor-pointer"
                      >
                        {actionReqs.replace}
                      </div> */}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <div
                    onClick={() =>
                      setReasonDropDown({
                        bool: !reasonDropDown.bool,
                        index: i,
                      })
                    }
                    className="border rounded-tl-3xl rounded-br-3xl rounded-tr-md rounded-bl-md p-1.5 px-3  flex justify-between cursor-pointer"
                  >
                    <div>Return Reason:  {returnProducts[i] && returnProducts[i].return_reason_name && (
                        <span className="pr-semibold">{returnProducts[i].return_reason_name}</span>
                      )}</div>
                    <BiChevronDown className="w-6 h-6" />
                  </div>
                  {reasonDropDown.bool && reasonDropDown.index === i && (
                    <div className="bg-white absolute w-full border rounded">
                      {reasons?.map((reason, k) => (
                        <div
                          onClick={() => {
                            handleReturnReason(
                              reason.return_reason_id,
                              reason.name,
                              i
                            );
                            setReasonDropDown({
                              bool: !reasonDropDown.bool,
                              index: i,
                            });
                          }}
                          className=" px-2 py-1 hover:bg-dblue hover:text-white cursor-pointer"
                          key={k}
                        >
                          {reason.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  type={"text"}
                  placeholder="Enter your reason"
                  className="border rounded-tl-3xl rounded-br-3xl rounded-tr-md rounded-bl-md p-1.5 px-3 outline-none"
                  onChange={(e) => handleComment(e.target.value, i)}
                />
                <div
                  className={`flex gap-1 w-max 
               
                `}
                  // onClick={() => handleImageUpload()}
                >
                  <BsCamera className="w-7 h-7 " />
                  <p className="text-d18">+</p>
                  <input
                    type="file"
                    id="fileUpload"
                    multiple
                    onChange={(e) => onFileChange(e)}
                    onClick={(event) => {
                      event.target.value = null;
                    }}
                    // disabled={handleFileLimit()}
                    className="hidden"
                    // ref={hiddenFileInput}
                    accept="image/png, image/jpeg, image/jpg"
                  />
                </div>
                <div className="flex flex-wrap gap-2 justify-start mt-1">
                  {/* {returnImgs?.slice(0, 5).map((img, index) => (
                  <div className="relative " key={Math.random()}>
                    <img
                      src={URL.createObjectURL(img)}
                      width={80}
                      height={80}
                      style={{
                        height: "80px",
                        width: "80px",
                      }}
                      className="h-14 w-14 sm:h-20 sm:w-20"
                      alt={URL.createObjectURL(img)}
                    />
                    <button
                      className="absolute z-10 bottom-0 w-full align-middle"
                      style={{
                        backgroundColor: "#00000066",
                      }}
                      onClick={() =>
                        setReturnImgs(returnImgs.filter((e) => e !== img))
                      }
                    >
                      <FaTrash className="w-4 h-4 my-1 mr-auto ml-auto text-white " />
                    </button>
                  </div>
                ))} */}
                </div>
                {/* {exceededMaxnb && (
                <div className="text-dbase pr-semibold">
                  Number of selected images exceeds maxNumber "5"
                </div>
              )} */}
                {/* {error.length > 0 && (
                <div className="text-dbase pr-semibold">{error}</div>
              )} */}
                <div className="w-full flex justify-center mt-2">
                  <div
                    onClick={() => submitRequest()}
                    className={` ${
                      ""
                      // success
                      //   ? "bg-dgreen pointer-events-none"
                      //   : "bg-dblue cursor-pointer"
                    } rounded-full text-white py-1 px-8 pr-semibold text-center w-max text-d17 `}
                  >
                    {/* {success ? "Request sent successfully" : "Save"} */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReturnProducts;

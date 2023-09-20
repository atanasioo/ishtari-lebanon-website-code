import React, { useEffect, useRef, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { BsCamera, BsFillCameraFill } from "react-icons/bs";
import imageCompression from "browser-image-compression";
import { FullOverlay } from "../Overlay";
import { FaTrash } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { axiosServer } from "@/axiosServer";
import buildLink from "@/urls";

function ReturnModal({ data, index, closeModal, showReturnModal }) {
  const [quantity, setQuantity] = useState(1);
  const [returnReason, setReturnReason] = useState({
    name: "",
    id: 0,
  });
  const [reasonDropDown, setReasonDropDown] = useState(false);
  const [actionDropDown, setActionDropDown] = useState(false);
  const [qtyDropDown, setQtyDropDown] = useState(false);
  const [reasons, setReasons] = useState([]);
  const [actionReqs, setActionsReqs] = useState([]);
  const [action, setAction] = useState({
    key: "",
    value:""
  });
  const [comment, setComment] = useState("");
  const [returnImgs, setReturnImgs] = useState([]);
  const [exceededMaxnb, setExceededMaxNb] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const item = data?.products[index];

  // console.log(returnImgs);

  const hiddenFileInput = useRef(null);

  const defaultOptions = {
    maxSizeMB: 1,
  };

  console.log(actionReqs);

  useEffect(() => {
    if (showReturnModal && reasons.length === 0) {
      axiosServer
        .get(buildLink("getReturnReasons", undefined, undefined))
        .then((response) => {
          setReasons(response.data.data.reasons);
          setActionsReqs(response.data.data.action_requests);
        });
    }
  }, [showReturnModal]);

  const handleFileLimit = () => {
    if (returnImgs.length >= 5) {
      return true;
    }
    return false;
  };

  if (returnImgs?.length > 5) {
    setReturnImgs(returnImgs.slice(0, 5));
  }

  const handleImageUpload = (event) => {
    hiddenFileInput.current.click();
  };

  function compressFile(imageFile, options = defaultOptions) {
    return imageCompression(imageFile, options);
  }

  async function onFileChange(event) {
    const selectedFiles = event.target.files;
    const compressedImages = [];
    if (event.target.files.length === 5) {
      for (const image of selectedFiles) {
        try {
          const compressedImageFile = await compressFile(image);
          var file = new File([compressedImageFile], image.name);
          compressedImages.push(file);
        } catch (error) {
          console.error("Error compressing image:", error);
        }
      }

      setReturnImgs(compressedImages);
      setExceededMaxNb(false);
    } else if (event.target.files.length > 5) {
      for (let i = 0; i < 5; i++) {
        try {
          const compressedImageFile = await compressFile(event.target.files[i]);
          var file = new File(
            [compressedImageFile],
            event.target.files[i].name
          );
          compressedImages.push(file);
        } catch (error) {
          console.error("Error compressing image:", error);
        }
      }
      setReturnImgs(compressedImages);
      setExceededMaxNb(true);
      setTimeout(() => {
        setExceededMaxNb(false);
      }, 3500);
    } else {
      setExceededMaxNb(false);

      for (const image of selectedFiles) {
        try {
          const compressedImageFile = await compressFile(image);
          var file = new File([compressedImageFile], image.name);
          compressedImages.push(file);
        } catch (error) {
          console.error("Error compressing image:", error);
        }
      }

      setReturnImgs([...returnImgs, ...compressedImages]);
    }
  }

  console.log(data);

  const submitRequest = () => {
    setError("");
    if (returnReason.id === 0) {
      setError("Please select a specific return reason");
    } else if (comment.length === 0) {
      setError(
        "Please provide a return reason consisting of at least 3 characters."
      );
    } else if (returnImgs.length === 0) {
      setError("Minimum of 1 image for the product is required");
    }else if (actionReqs.key === "") {
      setError("Action request must be selected");
    } else {
      var formData = new FormData();

      formData.append("customer_id", data.customer_id);
      formData.append("order_id", data.order_id);
      formData.append("products[0][product_id]", item?.product_id);
      formData.append("products[0][comment]", comment);
      formData.append("products[0][return_reason_id]", returnReason.id);
      formData.append("products[0][price]", item?.price);
      formData.append("products[0][quantity]", quantity);
      formData.append("products[0][action_request]", actionReqs.key);
      returnImgs.slice(0, 5).map((image) => {
        formData.append("products[0][images][]", image);
      });

      axiosServer
        .post(buildLink("addReturnOrder", undefined, undefined), formData)
        .then((response) => {
          if (!response.data.success) {
            setError(response.data?.errors?.errorMsg);
          } else {
            setError("");
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
            }, 6000);
          }
        });
    }
  };


  return (
    <div>
      {showReturnModal && (
        <div
          onClick={() => closeModal()}
          className={`fixed z-10 w-full h-screen left-0 bottom-0 top-0 bg-dblackOverlay `}
        ></div>
      )}

      <div
        className={`bg-white p-4 fixed z-20 right-0 top-0 bottom-0 w-4/5 md:w-1/2 h-full ease-in-out duration-300 ${
          showReturnModal ? "translate-x-0 " : "translate-x-full"
        }`}
      >
        <AiOutlineClose
          className="absolute right-7 w-6 h-6 cursor-pointer"
          onClick={() => closeModal()}
        />
        <p className="text-d20 pr-semibold mb-4 text-center">Return Item</p>
        <div className="flex items-center mb-3 gap-3">
          <div>
            <img className="w-36" src={item?.image} alt={item?.name} />
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
        <div className="text-sm mx-6 flex flex-col gap-5">
          <div className="relative">
            <div
              onClick={() => setQtyDropDown(!qtyDropDown)}
              className="border rounded-tl-3xl rounded-br-3xl rounded-tr-md rounded-bl-md p-1.5 px-3  flex justify-between cursor-pointer"
            >
              <div>Quantity: <span className="pr-semibold">{quantity}</span></div>
              <BiChevronDown className="w-6 h-6" />
            </div>
            {qtyDropDown && (
              <div className="bg-white absolute z-10 w-full border rounded">
                {Array.from(
                  {
                    length: parseInt(item?.quantity),
                  },
                  (_, index) => index + 1
                ).map((value) => (
                  <div
                    onClick={() => {
                      setQuantity(value);
                      setQtyDropDown(false);
                    }}
                    className=" px-2 py-1 hover:bg-dblue hover:text-white cursor-pointer"
                  >
                    {value}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <div
              onClick={() => setActionDropDown(!actionDropDown)}
              className="border rounded-tl-3xl rounded-br-3xl rounded-tr-md rounded-bl-md p-1.5 px-3  flex justify-between cursor-pointer"
            >
              <div>Action request: 
                        <span className="pr-semibold"> {action.value}</span>
                      </div>
              <BiChevronDown className="w-6 h-6" />
            </div>
            {actionDropDown && (
              <div className="bg-white absolute z-10 w-full border rounded">
                {actionReqs.map((req) => (
                  <div
                    onClick={() => {
                      setAction({key:req.key, value:req.value});
                      setActionDropDown(!actionDropDown);
                    }}
                    className=" px-2 py-1 hover:bg-dblue hover:text-white cursor-pointer"
                  >
                    {req.value}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <div
              onClick={() => setReasonDropDown(!reasonDropDown)}
              className="border rounded-tl-3xl rounded-br-3xl rounded-tr-md rounded-bl-md p-1.5 px-3  flex justify-between cursor-pointer"
            >
              <div>Return Reason: <span className="pr-semibold">{returnReason.name}</span></div>
              <BiChevronDown className="w-6 h-6" />
            </div>
            {reasonDropDown && (
              <div className="bg-white absolute w-full border rounded">
                {reasons?.map((reason) => (
                  <div
                    onClick={() => {
                      setReturnReason({
                        name: reason.name,
                        id: reason.return_reason_id,
                      });
                      setReasonDropDown(false);
                    }}
                    className=" px-2 py-1 hover:bg-dblue hover:text-white cursor-pointer"
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
            onChange={(e) => setComment(e.target.value)}
          />
          <div
            className={`flex gap-1 w-max ${
              handleFileLimit() ? "opacity-30" : "cursor-pointer"
            }`}
            onClick={() => handleImageUpload()}
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
              disabled={handleFileLimit()}
              className="hidden"
              ref={hiddenFileInput}
              accept="image/png, image/jpeg, image/jpg"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-start mt-1">
            {returnImgs?.slice(0, 5).map((img, index) => (
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
            ))}
          </div>
          {exceededMaxnb && (
            <div className="text-dbase pr-semibold">
              Number of selected images exceeds maxNumber "5"
            </div>
          )}
          {error.length > 0 && (
            <div className="text-dbase pr-semibold">{error}</div>
          )}
          <div className="w-full flex justify-center mt-2">
            <div
              onClick={() => submitRequest()}
              className={` ${
                success
                  ? "bg-dgreen pointer-events-none"
                  : "bg-dblue cursor-pointer"
              } rounded-full text-white py-1 px-8 pr-semibold text-center w-max text-d17 `}
            >
              {success ? "Request sent successfully" : "Save"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReturnModal;

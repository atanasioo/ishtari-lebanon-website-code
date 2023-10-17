import React, { useEffect, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import UserSidebar from "@/components/account/UserSidebar";
import UserSidebarMobile from "@/components/account/UserSidebarMobile";
import { axiosServer } from "@/axiosServer";
import buildLink from "@/urls";
import { BsPlusLg } from "react-icons/bs";
import { FaPlus, FaTrash } from "react-icons/fa";
import useDeviceSize from "@/components/useDeviceSize";
import { useRouter } from "next/router";

function suggestionDetails() {
  const router = useRouter();
  const [suggImgs, setSuggImgs] = useState([]);
  const [exceededMaxnb, setExceededMaxNb] = useState(false);
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [dataImgs, setDataImgs] = useState([]);
  const [deletedImgs, setDeletedImgs] = useState([]);
  const [leftImgs, setLeftImgs] = useState(5);
  const [deleteMsg, setDeleteMsg] = useState("");
  const [deleteErr, setDeleteErr] = useState("");
  const hiddenFileInput = useRef(null);
  // const isEdit = router.query["suggestion-id"][1] === "edit";
  const [width] = useDeviceSize();
  const [isEdit, setIsEdit] = useState(false);
  const [suggestion_id, setSuggest] = useState();
  const slug = router.query;

  useEffect(() => {
    console.log("slug")
    console.log(slug)
    if (Object.keys(slug).length > 0) {
      setIsEdit(slug && slug["suggestion-id"][1] === "edit" && true);
      setSuggest(slug["suggestion-id"][0]);
    }
  }, [router]);
  // const suggestion_id = router.query["suggestion-id"][0];

  console.log(deletedImgs);

  useEffect(() => {
    if (isEdit) {
      axiosServer
        .get(
          buildLink("suggestion", undefined, undefined) +
            `&suggestion_id=${suggestion_id}`
        )
        .then((response) => {
          console.log(response.data);
          if (response.data.success) {
            setName(response.data.data[0].name);
            setDesc(response.data.data[0].description);
            setDataImgs(response.data.data[0].images);
            const left = 5 - response.data.data[0].images.length;
            setLeftImgs(left);
          }
        });
    }
  }, [isEdit]);

  useEffect(() => {
    const left = 5 - dataImgs.length;
    setLeftImgs(left);
  }, [dataImgs]);

  const defaultOptions = {
    maxSizeMB: 1
  };

  function compressFile(imageFile, options = defaultOptions) {
    return imageCompression(imageFile, options);
  }

  console.log("dataimgs", dataImgs);

  async function onFileChange(event) {
    const selectedFiles = event.target.files;
    const compressedImages = [];
    if (
      // event.target.files.length === 5 &&
      event.target.files.length === leftImgs
    ) {
      for (const image of selectedFiles) {
        try {
          const compressedImageFile = await compressFile(image);
          var file = new File([compressedImageFile], image.name);
          compressedImages.push(file);
        } catch (error) {
          console.error("Error compressing image:", error);
        }
      }

      setSuggImgs(compressedImages);
      setExceededMaxNb(false);
    } else if (
      event.target.files.length > 5 ||
      event.target.files.length > leftImgs
    ) {
      for (let i = 0; i < leftImgs; i++) {
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
      setSuggImgs(compressedImages);
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

      setSuggImgs([...suggImgs, ...compressedImages]);
    }
  }

  const handleFileLimit = () => {
    if (
      suggImgs.length >= 5 ||
      dataImgs.length >= 5 ||
      suggImgs.length + dataImgs.length >= 5
    ) {
      return true;
    }
    return false;
  };

  const handleImageUpload = (event) => {
    hiddenFileInput.current.click();
  };

  console.log("left imgs " + leftImgs);

  // if (suggImgs?.length > leftImgs) {
  //   setSuggImgs(suggImgs.slice(0, leftImgs));
  // }

  console.log("sugg imgs", suggImgs);

  const submitRequest = (e) => {
    e.preventDefault();
    var formData = new FormData();

    console.log(suggImgs);

    formData.append("name", name);
    formData.append("description", desc);
    formData.append("source_id", 1);

    if (!isEdit) {
      suggImgs.slice(0, 5).map((image, index) => {
        formData.append(`images[${index}]`, image);
      });

      axiosServer
        .post(buildLink("suggestion", undefined, undefined), formData)
        .then((response) => {
          console.log(response.data);
          if (response.data.success) {
            setSuccess(response.data.message);
            setTimeout(() => {
              router.push("/account/suggestion");
            }, 4000);
          }
        });
    } else {
      deletedImgs.map((path, index) => {
        formData.append(`old_images[${index}]`, path);
      });

      suggImgs.slice(0, leftImgs).map((image, index) => {
        formData.append(`images[${index}]`, image);
      });
      axiosServer
        .post(
          buildLink("suggestion", undefined, undefined) +
            `&suggestion_id=${suggestion_id}`,
          formData
        )
        .then((response) => {
          console.log(response.data);
          if (response.data.success) {
            setSuccess(response.data.message);
            setTimeout(() => {
              router.push("/account/suggestion");
            }, 4000);
          }
        });
    }
  };

  const deleteSuggestion = (sugg_id) => {
    setDeleteErr("");
    setDeleteMsg("");
    axiosServer
      .delete(
        buildLink("suggestion", undefined, undefined) +
          `&suggestion_id=${sugg_id}`
      )
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          setDeleteMsg("Suggestion deleted successfully");
          setTimeout(() => {
            setDeleteMsg("");
            router.push("/account/suggestion");
          }, [3000]);
        } else {
          setDeleteErr(response.data?.errors[0]?.errorMsg);
        }
      });
  };

  return (
    <div className="relative">
      {success.length > 0 && (
        <div className="bg-dgreen text-white py-2 px-6 rounded pr-semibold fixed bottom-10 right-3 z-10">
          {success}
        </div>
      )}
      {deleteMsg.length > 0 && (
        <div className="bg-dgreen text-white py-2 px-6 rounded pr-semibold fixed bottom-10 right-3 z-10">
          {deleteMsg}
        </div>
      )}
      {deleteErr.length > 0 && (
        <div className="bg-dbase text-white py-2 px-6 rounded pr-semibold fixed bottom-10 right-3 z-10">
          {deleteErr}
        </div>
      )}
      <div className="flex-row md:flex">
        <div className="w-full mb-3 md:w-1/5">
          <div className="hidden mobile:block">
            <UserSidebar active={"suggestion"} />
          </div>

          <div className="mobile:hidden">
            <UserSidebarMobile active={"suggestion"} />
          </div>
        </div>
        <div className="w-full md:w-4/5 p-8">
          <div className="text-d20 pr-semibold py-5 w-full ">
            {!isEdit ? "Add new suggestion" : "Edit your suggestion"}
          </div>
          <form onSubmit={(e) => submitRequest(e)}>
            <div className="pb-5">
              <div>
                <div>Product Name:</div>
                <input
                  type="text"
                  defaultValue={name}
                  placeholder="Please enter product name"
                  onChange={(e) => setName(e.target.value)}
                  className="p-2 border border-dgrey1 rounded-md w-full lg:w-[656px] mt-4 outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <div className="pb-5">
                <div>Product Description:</div>
                <textarea
                  type="text"
                  defaultValue={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="We take your feedback seriously and even though we may not be able to respond personnaly,
                   consideration is given to any submission. If you wish to give us a suggestion, please be sure to include any 
                   relevant details including order numbers and product links"
                  required
                  rows={width > 1024 ? 8 : 6}
                  cols={
                    width > 1024 ? 80 : width > 650 ? 50 : width > 650 ? 30 : 20
                  }
                  className="p-2 border border-dgrey1 rounded-md w-full lg:w-[656px] mt-4 outline-none"
                />
              </div>
            </div>
            <div>
              <div className="pb-5">
                <div>Product Images:</div>
                <div className="flex item-start md:items-center gap-2 mt-4">
                  <div
                    className={`border-2 border-dslate border-dashed relative h-[90px] w-[90px] min-w-[90px] md:min-w-[80px] md:h-20 md:w-20  ${
                      (handleFileLimit() && "opacity-50",
                      !handleFileLimit() && "cursor-pointer")
                    }`}
                    onClick={() => handleImageUpload()}
                  >
                    <div className="add_images_upload">
                      <FaPlus
                        className={`w-4 h-4 text-dblue  ${
                          handleFileLimit() && "opacity-40"
                        }`}
                      />
                      <input
                        type="file"
                        multiple
                        onChange={(e) => onFileChange(e)}
                        disabled={handleFileLimit()}
                        required
                        className="hidden"
                        ref={hiddenFileInput}
                        accept="image/png, image/jpg"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-start">
                    {suggImgs?.slice(0, 5).map((img, index) => (
                      <div className="relative " key={Math.random()}>
                        {/* {img} */}
                        <img
                          src={URL.createObjectURL(img)}
                          width={80}
                          height={80}
                          className="h-[90px] w-[90px] md:h-20 md:w-20"
                          alt={URL.createObjectURL(img)}
                        />
                        <button
                          className="absolute z-10 bottom-0 w-full align-middle"
                          style={{
                            backgroundColor: "#00000066"
                          }}
                          onClick={() =>
                            setSuggImgs(suggImgs.filter((e) => e !== img))
                          }
                        >
                          <FaTrash className="w-4 h-4 my-1 mr-auto ml-auto text-white " />
                        </button>
                      </div>
                    ))}
                  </div>

                  {dataImgs.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-start">
                      {dataImgs?.slice(0, 5).map((img, index) => (
                        <div className="relative " key={Math.random()}>
                          <img
                            src={img}
                            width={80}
                            height={80}
                            className="h-[90px] w-[90px] md:h-20 md:w-20"
                            alt={img}
                          />
                          <button
                            className="absolute z-10 bottom-0 w-full align-middle"
                            style={{
                              backgroundColor: "#00000066"
                            }}
                            onClick={() => {
                              setDataImgs(dataImgs.filter((e) => e !== img));
                              setDeletedImgs((current) => [
                                ...current,
                                dataImgs[index]
                              ]);
                            }}
                          >
                            <FaTrash className="w-4 h-4 my-1 mr-auto ml-auto text-white " />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="pr-light text-[#9ea4b0] text-sm mt-4">
                  You can upload a maximum of 5 files. Individual image size
                  should not exceed 1MB and supported file formats are PNG and
                  JPG{" "}
                </div>
              </div>
              {exceededMaxnb && (
                <div className="text-dbase pr-semibold py-2">
                  Number of selected images exceeds maxNumber "5"
                </div>
              )}
            </div>
            {!isEdit ? (
              <button
                className="rounded-md text-white px-8 py-1.5 w-full md:w-60"
                style={{
                  background:
                    "linear-gradient(98.3deg, rgb(204, 0, 0) 30.6%, rgb(255, 153, 153) 97.7%)"
                }}
              >
                Submit
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => submitRequest(e)}
                  className="rounded-md shadow-md border border-dgreyZoom px-8 py-1.5 w-1/2 md:w-60"
                >
                  Edit
                </button>
                <div
                  onClick={() => deleteSuggestion(suggestion_id)}
                  className="cursor-pointer bg-dbase text-white w-1/2 md:w-60 rounded-md text-center py-1.5"
                >
                  Delete
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default suggestionDetails;

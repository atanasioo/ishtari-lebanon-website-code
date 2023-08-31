import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import _axios from "../../../axios";
import SellerHeader from "../../../components/seller/SellerHeader";
import { useSellerContext } from "../../../contexts/SellerContext";
import { FaPen } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";
import useDeviceSize from "@/components/useDeviceSize";
import { useRouter } from "next/router";
import Link from "next/link";
import buildLink from "@/urls";

const EditProduct = () => {
  const router = useRouter();
  const [width] = useDeviceSize();
  const [data, setData] = useState();
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const [productImage, setProductImage] = useState(
    "https://www.ishtari.com/image/cache/no_image-120x164.jpg"
  );
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [thumb, setThumb] = useState("");
  const [model, setModel] = useState("");
  const [tags, setTags] = useState("");
  const { toggle } = useSellerContext();
  const [permissions, setPermissions] = useState();
  const [value, setValue] = useState();
  const editorConfiguration = {
    toolbar: ["bold", "italic"],
  };
  function checkPermission(str) {
    let temp;
    permissions.map((p) => {
      if (p.name === str) {
        return (temp = !p.has_permission);
      }
    });
    return temp;
  }

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };
    setEditorLoaded(true);
  }, []);


  useEffect(() => {
    setLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    _axios
      .get(
        buildLink("seller_product_info")
        + `&product_id=${router.query.id}`
      )
      .then((response) => {
        setData(response.data.data);
        setPrice(response.data.data.price);
        setProductName(response.data.data.name);
        setModel(response.data.data.model);
        setQuantity(response.data.data.quantity);
        setProductImage(response.data.data.image);
        setValue(response.data.data.description);
        setPermissions(response.data.data.permissions);
        setThumb(response.data.data.thumb ? response.data.data.thumb : "");
        setLoading(false);
      });
  }, []);

  function toggleMenuu() {
    setShowMenu(!showMenu);
  }

  function submit() {
    var formData = new FormData(); // Currently empty
    formData.append("name", productName);
    formData.append(
      "image",
      typeof productImage === "object" ? productImage : thumb
    );
    formData.append("description", value);
    formData.append("price", price);
    formData.append("model", model);
    formData.append("quantity", quantity);
    const obj = {
      image: productImage,
      name: productName,
      description: value,
      price: price,
      quantity: quantity,
      model: model,
    };
    console.log(formData);
    _axios
      .post(
        buildLink("seller_edit_product")
        +`&product_id=${router.query.id}`,
        formData
      )
      .then((response) => {
        router.push("/seller_report/products");
        console.log(response.data);
      });
  }

  function deleteImage() {
    setThumb("data/no_image.jpg");
    setProductImage("https://www.ishtari.com/image/cache/no_image-120x164.jpg");
  }

  return data ? (
    <div className="absolute top-0 left-0 right-0 w-full h-full bg-slate200">
      <div
        className={`flex-auto min-w-0 flexflex-col aside-animation ${
          toggle ? "pl-64" : width < 1025 ? "pl-0" : "pl-20"
        } max-w-full box-border`}
      >
        <SellerHeader showMenu={showMenu} toggleMenuu={toggleMenuu} />

        <div className="flex flex-col pt-0 pb-10  bg-slate200">
          <div className="px-3.5 flex items-center py-4">
            <p className="text-lg ml-3 ">Products</p>
            <Link
              href={`/seller_report/home`}
              className={`pl-1 ml-3  text-dgrey1 hover:text-dblue`}
            >
              <AiOutlineHome />
            </Link>
            <span className="seller-dot  p-2"></span>
            <Link
              href={`/seller_report/products`}
              className="font-medium text-sm text-dgreySeller"
            >
              Products
            </Link>
            <span className="seller-dot  p-2"></span>

            <p className="text-dblue text-sm">Edit Product</p>
          </div>
          <div className="w-full px-6 box-border">
            <div className="box-border">
              <div className="transition-opacity block box-border">
                <div className="orders-table items-stretch justify-between relative  px-0 py-25 border-b-1 border-borderbottom bg-white">
                  <div className="border-b flex justify-between items-center border-dinputBorder p-4">
                    <h3 className="font-medium text-base items-center">
                      Products
                    </h3>
                    <div className="flex gap-2 text-sm">
                      <button
                        className="cursor-pointer text-white py-2 px-4"
                        style={{ borderRadius: "2rem", background: "#5867dd" }}
                        onClick={() => {
                          submit();
                        }}
                      >
                        Save
                      </button>
                      <Link
                        href={`/seller_report/products`}
                        className="cursor-pointer text-white py-2 px-4"
                        style={{ borderRadius: "2rem", background: "#5867dd" }}
                      >
                        Cancel
                      </Link>
                    </div>
                  </div>
                  <div className=" flex flex-col px-2 mt-2 rounded box-border overflow-y-visible">
                    <div className="table-wrapper overflow-y-visible">
                      <div className="flex flex-wrap box-border pb-3 overflow-y-visible ">
                        {!loading ? (
                          <div className="w-full overflow-y-visible">
                            <div
                              className={`flex flex-col w-full rounded ${
                                width > 768 ? "p-6" : "p-2"
                              } `}
                            >
                              <div className="mt-0">
                                <div className="box-border">
                                  {/*NAME*/}
                                  <div
                                    className={`mb-7  grid ${
                                      width > 768
                                        ? "grid-cols-3 w-10/12"
                                        : "grid-cols-1 w-full"
                                    } `}
                                  >
                                    <label
                                      className={`text-right font-light flex ${
                                        width > 768
                                          ? "gap-3 justify-end p-3"
                                          : "justify-start gap-1 pb-1"
                                      } items-center`}
                                    >
                                      <span
                                        className="flex items-center text-center"
                                        style={{ color: "#fd397a" }}
                                      >
                                        *
                                      </span>
                                      <span className="text-dgreySeller">
                                        Name:
                                      </span>
                                    </label>
                                    <div
                                      className=" flex items-center"
                                      style={{
                                        gridColumn: width > 768 ? "2 / 4" : "",
                                      }}
                                    >
                                      <div className="w-full tooltip">
                                        <input
                                          className="w-full block py-2 px-4 font-normal leading-relaxed rounded h-10 "
                                          disabled={
                                            checkPermission("name") ||
                                            permissions.length === 0
                                          }
                                          value={productName}
                                          style={{
                                            border: "1px solid #e2e5ec",
                                          }}
                                          onChange={(e) => {
                                            setProductName(e.target.value);
                                          }}
                                        />
                                        {(checkPermission("name") ||
                                          permissions.length === 0) && (
                                          <span className="tooltiptext text-sm">
                                            you don't have a permission to edit
                                            name
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="border-b border-dashed my-6 border-dplaceHolder"></div>

                                  <div
                                    className={`mb-7   grid ${
                                      width > 768
                                        ? "grid-cols-3 w-10/12"
                                        : "grid-cols-1 w-full"
                                    } `}
                                  >
                                    <label
                                      className={`text-right  font-light flex ${
                                        width > 768
                                          ? "gap-3 justify-end p-3"
                                          : "justify-start gap-1 pb-1"
                                      } items-center`}
                                    >
                                      <span className="text-dgreySeller">
                                        Description:
                                      </span>
                                    </label>
                                    <div
                                      className="h-60 w-full tooltip items-center"
                                      style={{
                                        gridColumn: width > 768 ? "2 / 4" : "",
                                      }}
                                    >
                                      {editorLoaded ? (
                                        <CKEditor
                                        editor={ClassicEditor}
                                          // editorLoaded={editorLoaded}
                                          disabled={
                                            checkPermission("description") ||
                                            permissions.length === 0
                                          }
                                          config={{
                                            toolbar: [
                                              "heading",
                                              "|",
                                              "bold",
                                              "italic",

                                              "bulletedList",
                                              "numberedList",

                                              "blockQuote",
                                              "|",
                                              "undo",
                                              "redo",
                                            ],
                                          }}
                                          
                                          data={value}
                                          onChange={(event, editor) => {
                                            const data = editor.getData();
                                            setValue(data);
                                          }}
                                        />
                                      ) : (
                                        <div>loading...</div>
                                      )}

                                      {(checkPermission("description") ||
                                        permissions.length === 0) && (
                                        <span className="tooltiptext text-sm">
                                          you don't have a permission to edit
                                          description
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div
                                    className={`border-b border-dashed mb-6 mt-20 border-dplaceHolder`}
                                  ></div>
                                  {/* MODEL */}
                                  <div
                                    className={`mb-7  grid ${
                                      width > 768
                                        ? "grid-cols-3 w-10/12"
                                        : "grid-cols-1 w-full"
                                    } `}
                                  >
                                    <label
                                      className={`text-right  font-light flex ${
                                        width > 768
                                          ? "gap-3 justify-end p-3"
                                          : "justify-start gap-1 pb-1"
                                      } items-center`}
                                    >
                                      <span
                                        className="flex items-center text-center"
                                        style={{ color: "#fd397a" }}
                                      >
                                        *
                                      </span>
                                      <span className="text-dgreySeller">
                                        Model:
                                      </span>
                                    </label>
                                    <div
                                      className=" flex items-center"
                                      style={{
                                        gridColumn: width > 768 ? "2 / 4" : "",
                                      }}
                                    >
                                      <div className="w-full tooltip">
                                        <input
                                          className="w-full block py-2 px-4 font-normal leading-relaxed rounded h-10"
                                          value={model}
                                          disabled={
                                            checkPermission("model") ||
                                            permissions.length === 0
                                          }
                                          style={{
                                            border: "1px solid #e2e5ec",
                                          }}
                                          onChange={(e) => {
                                            setModel(e.target.value);
                                          }}
                                        />
                                        {(checkPermission("model") ||
                                          permissions.length === 0) && (
                                          <span className="tooltiptext text-sm">
                                            you don't have a permission to edit
                                            model
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="border-b border-dashed my-6 border-dplaceHolder"></div>
                                  {/* PRICE */}
                                  <div
                                    className={`mb-7  grid ${
                                      width > 768
                                        ? "grid-cols-3 w-10/12"
                                        : "grid-cols-1 w-full"
                                    } `}
                                  >
                                    <label
                                      className={`text-right  font-light flex ${
                                        width > 768
                                          ? "gap-3 justify-end p-3"
                                          : "justify-start gap-1 pb-1"
                                      } items-center`}
                                    >
                                      <span className="text-dgreySeller">
                                        Price:
                                      </span>
                                    </label>
                                    <div
                                      className=" flex items-center"
                                      style={{
                                        gridColumn: width > 768 ? "2 / 4" : "",
                                      }}
                                    >
                                      <div className="w-full tooltip">
                                        <input
                                          className="w-full block py-2 px-4 font-normal leading-relaxed rounded h-10"
                                          value={price}
                                          disabled={
                                            checkPermission("price") ||
                                            permissions.length === 0
                                          }
                                          style={{
                                            border: "1px solid #e2e5ec",
                                          }}
                                          onChange={(e) => {
                                            setPrice(e.target.value);
                                          }}
                                        />
                                        {(checkPermission("price") ||
                                          permissions.length === 0) && (
                                          <span className="tooltiptext text-sm">
                                            you don't have a permission to edit
                                            price
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="border-b border-dashed my-6 border-dplaceHolder"></div>
                                  {/* QUANTITY */}
                                  <div
                                    className={`mb-7 grid ${
                                      width > 768
                                        ? "grid-cols-3 w-10/12 "
                                        : "grid-cols-1 w-full"
                                    } `}
                                  >
                                    <label
                                      className={`text-right  font-light flex ${
                                        width > 768
                                          ? "gap-3 justify-end p-3"
                                          : "justify-start gap-1 pb-1"
                                      } items-center`}
                                    >
                                      <span className="text-dgreySeller">
                                        Quantity:
                                      </span>
                                    </label>
                                    <div
                                      className=" flex items-center"
                                      style={{
                                        gridColumn: width > 768 ? "2 / 4" : "",
                                      }}
                                    >
                                      <div className="w-full tooltip">
                                        <input
                                          className="w-full block py-2 px-4 font-normal leading-relaxed rounded h-10"
                                          value={quantity}
                                          disabled={
                                            checkPermission("quantity") ||
                                            permissions.length === 0
                                          }
                                          style={{
                                            border: "1px solid #e2e5ec",
                                          }}
                                          onChange={(e) => {
                                            setQuantity(e.target.value);
                                          }}
                                        />
                                        {(checkPermission("quantity") ||
                                          permissions.length === 0) && (
                                          <span className="tooltiptext text-sm">
                                            you don't have a permission to edit
                                            quantity
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="border-b border-dashed my-6 border-dplaceHolder"></div>
                                  {/* IMAGE */}
                                  <div className="box-border w-full">
                                    {/* IMAGE */}
                                    <div
                                      className={`grid ${
                                        width > 768
                                          ? "grid-cols-3"
                                          : "grid-cols-1"
                                      } my-4 w-10/12`}
                                    >
                                      <label
                                        className={`${
                                          width > 768
                                            ? "text-right py-1 px-4"
                                            : "text-left"
                                        } font-light w-full text-dgreySeller`}
                                      >
                                        Image:
                                      </label>
                                      <div>
                                        {productImage ? (
                                          <img
                                            className="w-32 h-32 rounded p-1 "
                                            style={{
                                              border: "1px solid #dee2e6",
                                            }}
                                            src={
                                              typeof productImage === "string"
                                                ? productImage
                                                : URL.createObjectURL(
                                                    productImage
                                                  )
                                            }
                                          />
                                        ) : (
                                          <div
                                            className="w-32 text-center h-32 rounded p-1 "
                                            style={{
                                              border: "1px solid #dee2e6",
                                            }}
                                          >
                                            <img
                                              className="w-28 h-28 mt-1 ml-1 rounded"
                                              src={
                                                "https://www.ishtari.com/image/cache/no_image-120x164.jpg"
                                              }
                                            />
                                          </div>
                                        )}
                                        <div className="flex mt-2 ml-2 gap-4 tooltip">
                                          <label
                                            for="upload-photo"
                                            className="rounded-full w-7 h-7 flex items-center justify-center text-sm cursor-pointer"
                                            style={{
                                              color: "#5d78ff",
                                              border: "1px solid #5d78ff",
                                            }}
                                          >
                                            <FaPen />
                                          </label>
                                          <input
                                            className="opacity-0 hidden absolute -z-1"
                                            type="file"
                                            disabled={
                                              checkPermission("image") ||
                                              permissions.length === 0
                                            }
                                            id="upload-photo"
                                            onChange={(event) => {
                                              console.log(
                                                event.target.files[0]
                                              );
                                              setProductImage(
                                                event.target.files[0]
                                              );
                                            }}
                                            style={{
                                              color: "#5d78ff",
                                              border: "1px solid #5d78ff",
                                            }}
                                          />
                                          <button
                                            className="rounded-full w-7 h-7 flex items-center justify-center text-sm"
                                            style={{
                                              color: "red",
                                              border: "1px solid red",
                                            }}
                                            onClick={() => {
                                              deleteImage();
                                            }}
                                          >
                                            <BsTrash />
                                          </button>
                                          {(checkPermission("image") ||
                                            permissions.length === 0) && (
                                            <span className="tooltiptext text-sm">
                                              you don't have a permission to
                                              edit image
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex w-full justify-center items-center h-96 text-center">
                            {" "}
                            Loading...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div></div>
  );
};

export default EditProduct;

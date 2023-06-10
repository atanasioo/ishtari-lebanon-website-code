import { axiosServer } from "@/axiosServer";
import UserSidebar from "@/components/account/UserSidebar";
import UserSidebarMobile from "@/components/account/UserSidebarMobile";
import PointsLoader from "@/components/PointsLoader";
import useDeviceSize from "@/components/useDeviceSize";
import { sanitizeHTML } from "@/components/Utils";
import { CartContext } from "@/contexts/CartContext";
import buildLink from "@/urls";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";
import Loader from "@/components/Loader";
function wishlist() {
  const [state, dispatch] = useContext(CartContext);
  const [width, height] = useDeviceSize();

  const [success, setSuccess] = useState(false);
  const [successGroup, setSuccessGroup] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [groups, setGroups] = useState();
  const [products, setProducts] = useState();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [result, setResult] = useState();
  const [id, setId] = useState(0); // groups -id
  const [nameValue, setName] = useState();
  const [descriptionValue, setDescription] = useState();
  const [value, setvalue] = useState();
  const ref = useRef();

  useEffect(() => {
    axiosServer
      .get(buildLink("wishlist_group", undefined, window.innerWidth))
      .then((response) => {
        if (response.data.success) {
          const data = response.data.data;
          setGroups(data);
        }
      });
  }, [successGroup]);

  useEffect(() => {
    setLoading(true);
    axiosServer
      .get(
        buildLink("whishlistProducts", undefined, window.innerWidth) +
          "&id=" +
          id +
          "&page=" +
          page +
          "&limit=" +
          limit
      )
      .then((response) => {
        if (response.data.success) {
          const data = response.data.data;
          setLoading(false);

          setProducts(data);
        }
      });
  }, [successGroup, id, page]);

    // create group
    function addGroup(action) {
        setResult("");
        var obj = {};
        if (action === true) {
          obj = {
            name: nameValue,
            description: descriptionValue
          };
          _axios
            .post(buildLink("wishlistAdd", undefined, undefined), obj)
            .then((response) => {
              if (response.data.success) {
                setShowModel(false);
                setSuccessGroup(true);
              }
              setResult(response.data);
            });
        } else {
          obj = {
            group_id: value,
            name: nameValue,
            description: descriptionValue
          };
          _axios
            .post(buildLink("wishlistUpdate", undefined, undefined), obj)
            .then((response) => {
              setResult(response.data);
              if (response.data.success) {
                setShowModel(false);
                setSuccessGroup(true);
    
              } else {
                setDescription(descriptionValue);
                setvalue(value);
                setName(nameValue);
              }
              setResult(response.data);
    
              if (response.data.message === "Already updated!") {
                setShowModel(false);
              }
            });
        }
    
        setvalue("");
        setName("");
        setDescription("");
      }

  function deleteGroup(id) {
    axiosServer
      .post(buildLink("wishlistDelete", undefined, undefined) + id)
      .then((response) => {
        if (response.data.success) {
          setSuccessGroup(true);
          setResult(response.data);
        }
      });
  }

  console.log(groups);

  return (
    <div className="container text-dblack">
      <div>
        {state.loading ? (
          <div className="">
            <PointsLoader />
          </div>
        ) : (
          <div className="flex-row md:flex">
            <div className="w-full mb-3 md:w-1/5">
              {width > 650 ? (
                <UserSidebar active={"wishlist"} />
              ) : (
                <UserSidebarMobile active={"wishlist"} />
              )}
            </div>

            <div className="w-full md:w-4/5 px-2 md:px-0 md:pl-8 ">
              {/* Header */}
              <div className="flex items-center my-6">
                <div className="w-1/2">
                  <p className="text-2xl pr-semibold">WishList</p>
                </div>
                <div className="w-1/2">
                  <button
                    className=" hidden mobile:block pr-semibold bg-dblue text-white rounded ml-6 px-4 py-2 text-sm float-right"
                    onClick={() => {
                      setShowModel(true);
                      setResult("");
                      setDescription("");
                      setvalue();
                      setName();
                    }}
                  >
                    CREATE NEW WISHLIST
                  </button>

                  <span
                    className="mobile:hidden text-dblue text-lg  font-semibold rounded ml-6 px-2 py-2 float-right"
                    onClick={() => {
                      setShowModel(true);
                      setResult("");
                      setDescription("");
                      setvalue();
                      setName();
                    }}
                  >
                    + Create
                  </span>
                </div>
              </div>
              {success && (
                <div
                  className="text-white bg-dgreen py-3 px-4 rounded my-4 cursor-pointer"
                  onClick={() => setSuccess(false)}
                >
                  {successMessage}
                </div>
              )}
              {/* Items */}
              <div
                className="flex flex-row py-2 border-b border-dinputBorder overflow-y-auto"
                ref={ref}
              >
                {groups &&
                  groups?.map((gs, i) => (
                    <div
                      onClick={(e) => {
                        setId(gs?.wishlist_group_id);
                        setPage(1);
                      }}
                      className={`mx-3 cursor-pointer  hover:border-b hover:border-dblue  inline-block whitespace-nowrap flex ${
                        id == gs?.wishlist_group_id &&
                        "text-dblue border-b-2 border-dblue "
                      }`}
                    >
                      {gs.name} <HiLockClosed className="m-1" />
                    </div>
                  ))}
              </div>
              <div className="w-full ">
                {groups?.map((ps) => (
                  <div
                    className={`"cart w-full" my-3 container ${
                      id != ps?.wishlist_group_id && "hidden"
                    }`}
                  >
                    <div className="cart-header flex justify-between items-center ">
                      <span className="font-bold flex">
                        {ps?.products.length === 0 && "No Items"}
                        {ps?.products.length === 1 && "1 Item"}
                        {ps?.products.length > 1 &&
                          ps?.products.length + " Items"}{" "}
                        <HiLockClosed className="m-1" />{" "}
                      </span>

                      <div className="float-right hidden mobile:flex justify-end items-center ">
                        <button
                          className={
                            "ml-6 px-8 py-1.5 pr-semibold text-sm pointer-events-auto flex items-center gap-2 justify-center border border-dgreyZoom rounded-2xl "
                          }
                          onClick={(e) => deleteGroup(ps?.wishlist_group_id)}
                        >
                          {window.innerWidth > 650 && "Delete"}
                          <BsTrash className="" />
                        </button>

                        <button
                          className=" ml-6 px-8 py-1.5 pr-semibold text-sm flex items-center gap-2 justify-center border border-dgreyZoom rounded-2xl "
                          onClick={(e) =>
                            editGroup(
                              ps?.wishlist_group_id,
                              ps?.name,
                              ps?.description
                            )
                          }
                        >
                          {window.innerWidth > 650 && "Edit"}{" "}
                          <AiOutlineEdit className="" />
                        </button>
                      </div>

                      <div className="float-right mobile:hidden">
                        <span
                          className="bg-white text-dgrey1  ml-6 text-xl rounded-full px-2 py-1"
                          onClick={(e) => deleteGroup(ps?.wishlist_group_id)}
                        >
                          {window.innerWidth > 650 && "Delete Group "}
                          <i className="icon icon-trash "></i>
                        </span>

                        <span
                          className="bg-white text-dgrey1  ml-6 text-xl rounded-full px-1 py-1"
                          onClick={(e) =>
                            editGroup(
                              ps?.wishlist_group_id,
                              ps?.name,
                              ps?.description
                            )
                          }
                        >
                          {window.innerWidth > 650 && "Edit Group "}{" "}
                          <i className="icon icon-edit "></i>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {loading && <PointsLoader />}
                {!loading &&
                  products?.products?.map((product) => (
                    <div
                      className={`flex mb-2 px-4 py-2 rounded bg-white`}
                      key={product?.product_id}
                    >
                      <Link
                        className="block"
                        href={`/product/${product?.product_id}`}
                      >
                        <img
                          src={product?.thumb}
                          className="w-24 block rounded"
                          alt={product?.name}
                        />
                      </Link>

                      <div className="flex flex-col justify-between items-start px-9 text-dblack py-2 flex-grow w-2/3">
                        <p className="text-d13 text-dgrey1">{product?.sku}</p>
                        <p
                          className="w-full text-sm font-semibold"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHTML(product?.name),
                          }}
                        ></p>
                        <div>
                          <span className="mr-4 line-through text-sm">
                            {product.price}
                          </span>
                          <span className="font-semibold">
                            {product.special}
                          </span>
                        </div>
                        <div className="flex ">
                          <button
                            onClick={() => addToCart(product.product_id)}
                            className="cursor-pointer text-dgrey1 text-sm"
                          >
                            <span>Add To Cart</span>
                            <i className="icon icon-basket ml-1"></i>
                          </button>
                          <button
                            onClick={() => remove(product.product_id)}
                            className="cursor-pointer text-dgrey1 text-sm ml-4"
                          >
                            <span>Remove</span>
                            <i className="icon icon-trash ml-1"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}{" "}
                {!loading && products?.total_product > limit && (
                  <ReactPaginate
                    pageCount={Math.ceil(products?.total_product / 6)}
                    containerClassName={"category-pagination"}
                    onPageChange={pageSetter}
                    pageRangeDisplayed={width > 650 ? 2 : 1}
                    marginPagesDisplayed={width > 650 ? 1 : 1}
                    previousLabel={<IoIosArrowBack />}
                    previousLinkClassName={"arrowLink"}
                    nextLinkClassName={"arrowLink"}
                    nextLabel={<IoIosArrowForward />}
                    activeClassName={"active-pagination-category"}
                  ></ReactPaginate>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {showModel && (
        <div className="container">
          <div
            id="overlay"
            className="fixed  z-40 w-screen h-screen inset-0 bg-dblack bg-opacity-60"
          ></div>

          <div
            id="dialog"
            className={` fixed z-50 top-1/3  bg-white rounded-md px-8 py-6 space-y-5 drop-shadow-lg ${
              window.innerWidth > 650
                ? "left-1/3 top-1/3 w-1/3"
                : "top-1 w-10/12 "
            }`}
          >
            <button
              id="close"
              className=" ml-3 top-0 -mt-10 w-10 h-10 hover:bg-indigo-700 bg-dgreyRate cursor-pointer float-right rounded-full  font-semibold text-dbgrey hover:opacity-90"
              onClick={() => setShowModel(false)}
            >
              X
            </button>
            <span className="text-l font-semibold">New Group</span>

            <div className="py-1 border-t border-dinputBorder">
              <div className="text-dbase w-full">
                {result?.errors && result?.errors[0]?.errorMsg}
              </div>
              <div className="mt-5">
                <div className="input mb-6 required">
                  <label htmlFor=""> Name </label>{" "}
                  <input
                    value={nameValue}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
              </div>
              <div className="input mb-6 ">
                <label htmlFor=""> Description </label>
                <input
                  value={descriptionValue}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
            </div>
            <div class="flex justify-end">
              <button
                id="close"
                class="w-full px-5 py-1 bg-dblue hover:bg-indigo-700 text-white cursor-pointer rounded-md"
                onClick={() => addGroup(value ? false : true)}
              >
                save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default wishlist;

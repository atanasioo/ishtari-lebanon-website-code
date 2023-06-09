import UserSidebar from "@/components/account/UserSidebar";
import UserSidebarMobile from "@/components/account/UserSidebarMobile";
import useDeviceSize from "@/components/useDeviceSize";
import { CartContext } from "@/contexts/CartContext";
import Link from "next/link";
import React, { useContext, useRef, useState } from "react";
import { HiLockClosed } from "react-icons/hi";

function wishlist() {
  const [state, dispatch] = useContext(CartContext);
  const [width, height] = useDeviceSize();

  const [success, setSuccess] = useState(false);
  const [successGroup, setSuccessGroup] = useState(false);
  const [groups, setGroups] = useState();
  const [products, setProducts] = useState();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const ref = useRef();
  return (
    <div className="container text-dblack">
      <div>
        {state.loading ? (
          <div className="">
            <Loader />
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

            <div className="w-full md:w-4/5 px-2 md:px-0 md:pl-8">
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
                    className={`"cart w-full" ${
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

                      {window.innerWidth > 650 ? (
                        <div className="float-right">
                          <button
                            className={
                              "bg-dbase text-white rounded ml-6 px-4 py-1 text-sm pointer-events-auto"
                            }
                            onClick={(e) => deleteGroup(ps?.wishlist_group_id)}
                          >
                            {window.innerWidth > 650 && "Delete Group "}
                            <i className="icon icon-trash "></i>
                          </button>

                          <button
                            className="bg-dblue text-white rounded ml-6 px-4 py-1 text-sm "
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
                          </button>
                        </div>
                      ) : (
                        <div className="float-right">
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
                      )}
                    </div>
                  </div>
                ))}
                {loading && <Loader />}
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
                            __html: DOMPurify.sanitize(product?.name),
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
    </div>
  );
}

export default wishlist;

import { CartContext } from "../contexts/CartContext";
import { WishlistContext } from "@/contexts/WishlistContext";
import { useContext, useEffect, useState, useRef } from "react";
import buildLink from "../urls";
import Link from "next/link";
import { useRouter } from "next/router";
import { path } from "../urls";
import { AccountContext } from "../contexts/AccountContext";
import Cookies from "js-cookie";
import DOMPurify from "dompurify";
import Head from "next/head";
import dynamic from "next/dynamic";
import { BsTrashFill } from "react-icons/bs";
import { axiosServer } from "@/axiosServer";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { AiOutlineShopping } from "react-icons/ai";
import { slugify } from "@/components/Utils";
import { useMarketingData } from "@/contexts/MarketingContext";
import { FaShare, FaShareAltSquare, FaWindowClose } from "react-icons/fa";
import ShareCart from "@/components/cart/shareCart";

function Cart() {
  const [loading, setLoading] = useState(true);
  const [showSelect, setShowSelect] = useState(false);
  const [select, setSelect] = useState(true);


  // console.log(data)
  const [error, setError] = useState(false);
  const [selectProduct, setSelectProduct] = useState([]);
  const [showShare,setShowShare]= useState(false);

  const [stateAccount, dispatchAccount] = useContext(AccountContext);
  const [opacity, setOpacity] = useState(false);
  const [quantiy, setQuantity] = useState();
  const [state, dispatch] = useContext(CartContext);
  const [accountState] = useContext(AccountContext);
  const [sel, setSel] = useState([]);
  const router = useRouter();
  const route = useRouter();
  const { setMarketingData } = useMarketingData();
  const [maxQtyErr, setMaxQtyErr] = useState(0);
  const PointsLoader = dynamic(() => import("../components/PointsLoader"), {
    ssr: false, // Disable server-side rendering
  });
  useEffect(() => {
    function getCart() {
      axiosServer
        .get(
          buildLink("cart", undefined, undefined, window.config["site-url"]) +
            "&source_id=1"
        )
        .then((response) => {
          if (response.data.success) {
            dispatch({
              type: "setProducts",
              payload: response.data.data.products,
            });

            dispatch({
              type: "setProductsCount",
              payload: response.data.data.total_product_count,
            });
            dispatch({
              type: "setTotals",
              payload: response.data.data.totals,
            });
            dispatch({
              type: "loading",
              payload: false,
            });
            dispatch({
              type: "setAsidecart",
              payload: false
            });
          }
          setLoading(false);
        });
    }
    getCart();
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [router]);

  function updateQuantity(key, quantity, i, type) {
    if (type === "d") {
      if (document.getElementById("p-quantity" + i)) {
        if (
          (state?.products[i]?.maximum !== "0" &&
            parseInt(quantity) <= parseInt(state?.products[i]?.maximum)) ||
          state?.products[i]?.maximum === "0"
        ) {
          document.getElementById("p-quantity" + i).value = quantity;
          document.getElementById("p-quantitym" + i).value = quantity;
          if (maxQtyErr !== 0) {
            setMaxQtyErr(0);
          }
        } else {
          setMaxQtyErr(state?.products[i]?.maximum);
        }
      }
    } else {
      if (document.getElementById("p-quantitym" + i)) {
        document.getElementById("p-quantitym" + i).value = quantity;
        document.getElementById("p-quantity" + i).value = quantity;
      }
    }

    if (
      (state?.products[i]?.maximum !== "0" &&
        parseInt(quantity) <= parseInt(state?.products[i]?.maximum)) ||
      state?.products[i]?.maximum === "0" ||
      typeof i === "undefined"
    ) {
      // console.log("herereer");
      const obj = { key, quantity };
      setOpacity(true);
      dispatch({
        type: "loading",
        payload: true,
      });
      axiosServer
        .put(
          buildLink(
            "cart",
            undefined,
            window.innerWidth,
            window.config["site-url"]
          ),
          obj
        )
        .then(() => {
          axiosServer
            .get(
              buildLink(
                "cart",
                undefined,
                window.innerWidth,
                window.config["site-url"]
              )
            )
            .then((response) => {
              dispatch({
                type: "setProducts",
                payload:
                  response.data?.data?.products?.length > 0
                    ? response.data.data.products
                    : [],
              });
              dispatch({
                type: "setTotals",
                payload:
                  response.data?.data?.totals?.length > 0
                    ? response.data.data.totals
                    : 0,
              });
              dispatch({
                type: "setProductsCount",
                payload:
                  response.data?.data?.total_product_count > 0
                    ? response.data.data.total_product_count
                    : 0,
              });
              dispatch({
                type: "loading",
                payload: false,
              });
              if (quantity === 0) {
                //   window.location.reload();
              }
            });
          setOpacity(false);
        });
    }
  }



  function closeShare (){
    setShowShare(false)
  }

  function handleChangeQuantity(e, key, i) {
    if (document.getElementById("p-quantity" + i)) {
      document.getElementById("p-quantity" + i).value = e.target.value;
      document.getElementById("p-quantitym" + i).value = e.target.value;
    }
    if (e.keyCode === 13) {
      let quantity = e.target.value;
      const obj = { key, quantity };
      setOpacity(true);
      dispatch({
        type: "loading",
        payload: true,
      });
      axiosServer
        .put(
          buildLink(
            "cart",
            undefined,
            window.innerWidth,
            window.config["site-url"]
          ),
          obj
        )
        .then(() => {
          axiosServer
            .get(
              buildLink(
                "cart",
                undefined,
                window.innerWidth,
                window.config["site-url"]
              )
            )
            .then((response) => {
              dispatch({
                type: "setProducts",
                payload:
                  response.data?.data?.products?.length > 0
                    ? response.data.data.products
                    : [],
              });
              dispatch({
                type: "setTotals",
                payload:
                  response.data?.data?.totals?.length > 0
                    ? response.data.data.totals
                    : 0,
              });
              dispatch({
                type: "setProductsCount",
                payload:
                  response?.data.data?.total_product_count > 0
                    ? response.data?.data?.total_product_count
                    : 0,
              });
              dispatch({
                type: "loading",
                payload: false,
              });
            });

          e.target.blur();
          setOpacity(false);
        });
    }
  }

  const [stateWishlist, dispatchWishlist] = useContext(WishlistContext);
  const [products, setProducts] = useState([]);
  const [success, setSuccess] = useState(false);
  const [selectAll1, setSelectAll1] = useState(false);

  const [successMessage, setSuccessMessage] = useState(
    "Product added to cart successfully"
  );

  // Remove
  function remove(product_id) {
    axiosServer
      .delete(
        buildLink(
          "wishlist",
          undefined,
          window.innerWidth,
          window.config["site-url"]
        ) +
          "/&id=" +
          product_id
      )
      .then(() => {
        axiosServer
          .get(
            buildLink(
              "wishlist",
              undefined,
              window.innerWidth,
              window.config["site-url"]
            )
          )
          .then((response) => {
            const data = response.data.data.products;
            setProducts(data);
            dispatchWishlist({
              type: "setProductsCount",
              payload: response.data.data.total,
            });
            dispatchWishlist({
              type: "setProducts",
              payload: response.data.data.products,
            });
          });
        window.location.reload();
      });
  }

  // Add to cart
  function addToCart(product_id) {
    dispatch({
      type: "loading",
      payload: true,
    });
    let obj = {
      product_id,
      quantity: 1,
    };
    // console.log(obj);
    axiosServer
      .post(
        buildLink(
          "cart",
          undefined,
          window.innerWidth,
          window.config["site-url"]
        ),
        obj
      )
      .then((response) => {
        const data = response.data;
        if (!data.success) {
          route.push({
            pathname: "/product/" + product_id,
          });
          // console.log(data);
        }
        // window.location.reload();
        dispatch({
          type: "loading",
          payload: true,
        });
        axiosServer
          .get(
            buildLink(
              "cart",
              undefined,
              window.innerWidth,
              window.config["site-url"]
            )
          )
          .then((response) => {
            dispatch({
              type: "setProducts",
              payload: response.data.data.products,
            });
            dispatch({
              type: "setProductsCount",
              payload: response.data.total_product_count,
            });
            dispatch({
              type: "setTotals",
              payload: response.data.data.totals,
            });
            dispatch({
              type: "loading",
              payload: false,
            });
            setSuccess(true);
            setSuccessMessage("Product added to cart successfully");
          });
      });
  }

  function selectAll(res) {
    var array = [];

    var ele = document.getElementsByName("chk");
    if (res === true) {
      for (var i = 0; i < ele.length; i++) {
        if (ele[i].type === "checkbox") ele[i].checked = true;
        // ele[i].click()
        array.push(ele[i].id);
      }
      setSelectProduct(array);
      // console.log(selectProduct)
    } else {
      var elem = document.getElementsByName("chk");
      for (var j = 0; i < elem.length; j++) {
        if (elem[j].type === "checkbox") elem[j].click();
        ele[j].checked = false;

        // console.log("selectProduct")
      }
      setSelectProduct([]);
    }
    setSelectAll1(res);
  }
  function deleteSelect() {
    // console.log(selectProduct.toString());
    // console.log({"key" :selectProduct.toString()})
    if (selectProduct.length > 0) {
      var obj = { key: selectProduct };
      axiosServer
        .delete(
          buildLink(
            "cart",
            undefined,
            window.innerWidth,
            window.config["site-url"]
          ),
          { data: obj }
        )
        .then((response) => {
          // router.reload();
          dispatch({
            type: "setProducts",
            payload: response.data.data.products,
          });

          dispatch({
            type: "setProductsCount",
            payload: response.data.data.total_product_count || 0,
          });
          dispatch({
            type: "setTotals",
            payload: response.data.data.totals,
          });
        });
    } else {
      setError(true);
    }
  }

  function change(id) {
    selectProduct.indexOf(id) < 0
      ? setSelectProduct([...selectProduct, id])
      : setSelectProduct(selectProduct.splice(selectProduct.indexOf(id) + 1));
  }
  function checkNow() {
    const obj = {
      content_ids: state?.products?.social_data?.content_ids,
      email: state?.products?.social_data?.email,
      fb_login_id: state.products.social_data?.fb_login_id,
      firstname: state.products.social_data?.firstname,
      ip: state.products.social_data?.ip,
      lastname: state.products.social_data?.lastname,
      name: state.products.social_data?.name,
      quantity: state.products.social_data?.quantity,
      telephone: state.products.social_data?.telephone,
      user_agent: state.products.social_data?.user_agent,
      value: state.products.social_data?.value,
      from: "checkout",
    };
    axiosServer
      .post(
        buildLink(
          "pixel",
          undefined,
          window.innerWidth,
          window.location.host)
        ,
        obj
      )
      .then((response) => {
        const data = response.data;
        if (data.success === true) {
        }
      });
  }

  // console.log(state);

  return (
    <div className="min-h-screen">

      <div className="container pb-8" style={{}}>
        {/* Seo */}

        <Head>
          <title> Shopping Cart | ishtari</title>
          <meta
            name="description"
            content="Review and finalize your order with our convenient and secure shopping cart. Add items, adjust quantities, and proceed to checkout with confidence. Enjoy hassle-free online shopping and quick delivery of your favorite products."
          ></meta>
        </Head>
        {loading ? (
          <PointsLoader />
        ) : state?.products?.length > 0 || stateWishlist?.length > 0 ? (
          <div className="flex py-4">
            <div className="w-full mobile:w-3/4 ">
              <div className="flex items-center">
                <h1 className=" font-bold" style={{ fontSize: "23px" }}>
                  Cart
                </h1>{" "}
                <h1
                  className=" font-light pl-1 font-d14 "
                  style={{ color: "rgb(126, 133, 155)" }}
                >
                  {" "}
                  ({state.productsCount}{" "}
                  {state?.productsCount > 1 ? "items" : "item"})
                </h1>
                <button className=" ml-5 text-lg rounded-md text-dblue mt-1" onClick={()=>setShowShare(true)}>
                     <FaShareAltSquare/>
                    </button>
              </div>
              {maxQtyErr !== 0 && (
                <div className="pt-3 pb-1 text-dbase">
                  Maximum allowed quantity for this product is{" "}
                  <span className="pr-bold">{maxQtyErr}</span>
                </div>
              )}
              <div className="block xl:flex lg:flex">
                <div className="inline-block w-full  relative">
                  {opacity && (
                    <div className=" h-full w-full  bg-dblack bg-opacity-10 absolute top-0 left-0 cursor-wait rounded"></div>
                  )}

                  <div className=" w-full pb-8 text-dblue">
                    {showSelect && (
                      <button
                        className="float-left mx-6"
                        onClick={(e) => selectAll(!selectAll1 ? true : false)}
                      >
                        {!selectAll1 ? "Select All" : "Unsellect"}
                      </button>
                    )}
                    {select && showSelect && selectProduct?.length > 0 && (
                      <button
                        className="float-right mx-6 text-d18"
                        onClick={() => deleteSelect()}
                      >
                        <BsTrashFill />
                      </button>
                    )}{" "}
                    {!showSelect && (
                      <button
                        className="float-right mx-6 text-d18"
                        onClick={() => setShowSelect(true)}
                      >
                        Select
                      </button>
                    )}
                   
                  </div>

                  { state.products.map((product, i) => (
                    <div key={product.cart_id}>
                      {/* Desktop Design */}
                      <div
                        className={`hidden xl:flex lg:flex mb-2 px-4 py-2 rounded justify-center items-center ${
                          product.stock ? "bg-white " : "bg-dbase bg-opacity-10"
                        }`}
                      >
                        {select && showSelect && (
                          <div className="">
                            <input
                              className="mx-1"
                              type="checkbox"
                              id={product.cart_id}
                              onClick={() => change(product.cart_id)}
                              checked={
                                selectProduct.indexOf(product.cart_id) > -1
                                  ? "checked"
                                  : ""
                              }
                              name="chk"
                            />
                          </div>
                        )}
                        <img
                          onClick={() => {
                            route.push(
                              `${slugify(product.name)}/p=${product.product_id}`
                            );
                            setMarketingData({
                              ignore: false,
                              banner_image_id: "",
                              source_type: "cart",
                              source_type_id: "",
                            });
                          }}
                          src={product.thumb}
                          className="w-24 cursor-pointer block rounded"
                          alt={product.name}
                          loading="lazy"
                        />
                        <div className="flex flex-col justify-between items-start px-9 text-dblack py-2 flex-grow ">
                          <p className="text-d13 text-dgrey1">{product.sku}</p>
                          <p
                            className=" text-sm font-semibold"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(product.name),
                            }}
                          ></p>
                          {product.option.length > 0 && (
                            <p className="text-dgreen text-sm">
                              {product.option[0].name +
                                " (" +
                                product.option[0].value +
                                ")"}
                            </p>
                          )}
                          {product.warranty.length > 0 && (
                            <p className="text-dgreen text-sm">
                              {product.warranty[0].warranty_name +
                                " ( " +
                                product.warranty[0].warranty_titles +
                                " / " +
                                product.warranty[0].warranty_days +
                                " )"}{" "}
                            </p>
                          )}
                          <button
                            className="cursor-pointer text-dgrey1 text-xs"
                            onClick={() => updateQuantity(product.cart_id, 0)}
                          >
                            <span>Remove</span>
                            <i className="icon icon-trash ml-1"></i>
                          </button>
                        </div>

                        <div className="py-2 px-6 w-48 flex flex-col items-end text-dblack justify-center">
                          <span className=" font-semibold text-lg">
                            {product.total}
                          </span>
                          <div className="flex mt-4">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  product.cart_id,
                                  Number(product.quantity) - 1,
                                  i,
                                  "d"
                                )
                              }
                              className="w-10 h-10  text-2xl border border-dinputBorder rounded-tl rounded-bl cursor-pointer hover:shadow"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              className="border border-dinputBorder w-20 h-10 border-r-0 border-l-0 text-center"
                              id={"p-quantity" + i}
                              onKeyDown={(e) =>
                                handleChangeQuantity(e, product.cart_id, i, "d")
                              }
                              defaultValue={product.quantity}
                            />
                            <button
                              onClick={() =>
                                updateQuantity(
                                  product.cart_id,
                                  Number(product.quantity) + 1,
                                  i,
                                  "d"
                                )
                              }
                              className="w-10 h-10  text-2xl border border-dinputBorder  rounded-tr rounded-br cursor-pointer hover:shadow"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* Mobile design */}
                      <div
                        className={`flex xl:hidden lg:hidden mb-2 px-4 py-2 rounded ${
                          product.stock ? "bg-white " : "bg-dbase bg-opacity-10"
                        }`}
                      >
                        <div className="w-3/12 ">
                          <div className="flex justify-center items-center">
                            {select && showSelect && (
                              <div className="">
                                <input
                                  className="mx-1"
                                  type="checkbox"
                                  id={product.cart_id}
                                  onClick={() => change(product.cart_id)}
                                  checked={
                                    selectProduct.indexOf(product.cart_id) > -1
                                      ? "checked"
                                      : ""
                                  }
                                  name="chk"
                                />
                              </div>
                            )}
                            <img
                              onClick={() => {
                                route.push(
                                  `${product.name
                                    .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                                    .replace(/\s+/g, "-")
                                    .replace("/", "-")}/p=${product.product_id}`
                                );
                                setMarketingData({
                                  ignore: false,
                                  banner_image_id: "",
                                  source_type: "cart",
                                  source_type_id: "",
                                });
                              }}
                              src={product.thumb}
                              className="w-full block cursor-pointer rounded"
                              alt={product.name}
                              loading="lazy"
                            />
                          </div>
                          <div className="flex flex-col items-end text-dblack justify-center">
                            <div className="flex mt-2">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    product.cart_id,
                                    Number(product.quantity) - 1,
                                    i,
                                    "m"
                                  )
                                }
                                className="w-1/3 h-10 text-2xl border border-dinputBorder rounded-tl rounded-bl cursor-pointer hover:shadow"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                className="border border-dinputBorder w-1/3 h-10 border-r-0 border-l-0 text-center"
                                defaultValue={product.quantity}
                                id={"p-quantitym" + i}
                                onKeyDown={(e) =>
                                  handleChangeQuantity(
                                    e,
                                    product.cart_id,
                                    i,
                                    "m"
                                  )
                                }
                              />
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    product.cart_id,
                                    Number(product.quantity) + 1,
                                    i,
                                    "m"
                                  )
                                }
                                className="w-1/3 h-10 text-2xl border border-dinputBorder  rounded-tr rounded-br cursor-pointer hover:shadow"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="w-9/12 flex flex-col justify-between items-start pl-6 text-dblack py-2 flex-grow ">
                          <p className="text-d13 text-dgrey1">{product.sku}</p>
                          <p
                            className=" text-sm "
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(product.name),
                            }}
                          ></p>
                          {product.option.length > 0 && (
                            <p className="text-dgreen text-sm">
                              {product.option[0].name +
                                " (" +
                                product.option[0].value +
                                ")"}
                            </p>
                          )}
                          <span className=" font-semibold text-lg">
                            {product.total}
                          </span>

                          <button
                            className="cursor-pointer text-dgrey1 text-xs"
                            onClick={() => updateQuantity(product.cart_id, 0)}
                          >
                            <span>Remove</span>
                            <i className="icon icon-trash ml-1"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {window.innerWidth > 650 && (
                    <div className="mt-6">
                      <Link
                        className="rounded px-3 py-2 border border-dblue text-dblue text-d16 pr-semibold mt-12"
                        href="/"
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  )}

                  {!stateAccount.loged && window.config["loginRequired"] ? (
                    <button
                      className="block xl:hidden lg:hidden text-center bg-dblue text-white rounded w-full py-3 mt-4 hover:bg-dbluedark"
                      onClick={() => {
                        dispatchAccount({ type: "setShowOver", payload: true });
                        dispatchAccount({
                          type: "setShowLogin",
                          payload: true,
                        });
                        dispatchAccount({
                          type: "setShowSignup",
                          payload: false,
                        });
                      }}
                    >
                      CHECKOUT NOW
                    </button>
                  ) : (
                    <Link
                      href={`${path}/checkout`}
                      className="block xl:hidden lg:hidden text-center bg-dblue text-white rounded w-full py-3 mt-4 hover:bg-dbluedark"
                    >
                      CHECKOUT NOW
                    </Link>
                  )}

                  {window.innerWidth < 650 && (
                    <div className="py-4">
                      <Link
                        className="block rounded px-3 py-2 text-center  border-2 border-dblue text-dblue text-d16 pr-semibold w-full"
                        href="/"
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              {stateAccount.loged && (
                <div className="flex justify-between  py-5">
                  <div className="flex items-center">
                    <h1 className=" font-bold" style={{ fontSize: "23px" }}>
                      Wishlist
                    </h1>{" "}
                    <h1
                      className=" font-light pl-1 font-d14 "
                      style={{ color: "rgb(126, 133, 155)" }}
                    >
                      {" "}
                      ({stateWishlist?.productsCount}{" "}
                      {stateWishlist?.productsCount > 1 ? " items" : "item"})
                    </h1>
                  </div>
                  <div className="flex items-center text-d14  ">
                    <Link
                      href="/account/wishlist"
                      className="text-dblue font-bold"
                    >
                      {" "}
                      View All <span className="ml-1">{" >"}</span>{" "}
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className="hidden xl:inline-block py-6 lg:inline-block  w-full pl-0 xl:w-2/6 lg:w-2/6 xl:pl-6 lg:pl-6">
              <div className="border border-dgrey1 border-opacity-20 px-6 py-4 rounded ">
                <h1 className=" font-semibold text-xl text-dblack mb-4">
                  Order Summary
                </h1>
                <div className="flex justify-between items-center text-dgrey1 font-light mt-1">
                  <p>
                    Subtotal ({state.products.length}{" "}
                    {state.products.length > 1 ? "items" : "item"})
                  </p>
                </div>

                <h2 className="mt-4 mb-2 font-semibold text-lg">
                  Order Totals
                </h2>
                <div>
                  {state?.totals?.map((total) => (
                    <div
                      className={` flex items-center justify-between mb-1 text-dblack `}
                      key={total.title}
                    >
                      <span>
                        {total.title}{" "}
                        {total.code === "subTotal" &&
                          "(" + state.products.length + "items)"}
                      </span>
                      <span>{total.text}</span>
                    </div>
                  ))}
                </div>

                {!stateAccount.loged && window.config["loginRequired"] ? (
                  <button
                    className="block text-center bg-dblue text-white rounded w-full py-3 mt-4 hover:bg-dbluedark"
                    onClick={() => {
                      dispatchAccount({ type: "setShowOver", payload: true });
                      dispatchAccount({
                        type: "setShowLogin",
                        payload: true,
                      });
                      dispatchAccount({
                        type: "setShowSignup",
                        payload: false,
                      });
                    }}
                  >
                    CHECKOUT NOW
                  </button>
                ) : (
                  <Link
                    href={`${path}/checkout`}
                    className="block text-center bg-dblue text-white rounded w-full py-3 mt-4 hover:bg-dbluedark"
                    onClick={() => checkNow}
                  >
                    CHECKOUT NOW
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            {products.length < 1 && (
              <div className="flex items-center justify-center flex-col pt-16 sm:pt-20 text-dblack">
                <AiOutlineShopping className="text-7xl mobile:text-7xl" />
                <h2 className=" text-2xl mobile:text-4xl mt-6 font-semibold">
                  Your shopping cart is empty
                </h2>
                <h3 className=" font-light text-xl">
                  What are you waiting for ?
                </h3>
                <Link
                  className="bg-dblue px-16 py-3 text-white mt-7 inline-block font-semibold rounded hover:bg-dbluedark"
                  href="/"
                >
                  START SHOPPING
                </Link>
              </div>
            )}
          </div>
        )}
      </div>











     {state.productsCount>0&& <ShareCart products={state.products} isShowShare={showShare} closeShare={closeShare}/>}














    </div>
  );
}

export default Cart;

// export async function getServerSideProps(context) {
//   const session = await getServerSession(context.req, context.res, authOptions);

//   var data = false;
//   if (session) {
//     data = true;
//   }
//   return {
//     props: { data: data },
//   };
// }

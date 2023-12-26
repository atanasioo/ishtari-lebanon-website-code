import { CartContext } from "@/contexts/CartContext";
import Link from "next/link";
import React, { useContext } from "react";
import useDeviceSize from "../useDeviceSize";
import { sanitizeHTML } from "../Utils";

function CartSideModal(props) {
  const { successAdded, data, toggleSucccessAdded, hasBannerEvent, image } = props;
  //console.log(data)
  const [state, dispatch] = useContext(CartContext);
  const [width, height] = useDeviceSize();
  //console.log(state)
  const path ="";
  return (
    <div>
      {/* for mobile */}
      { (state.aside ) && (
        <div
          className=" block md:hidden fixed top-0 left-0 right-0 min-h-screen w-full bg-dblack bg-opacity-30 z-50 overflow-y-auto overflow-auto"
          // onClick={() => toggleSucccessAdded(false)}
        >
          <div className="bg-white py-4 px-2 text-sm">
            <h2
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(data?.name  || state?.product?.name),
              }}
            />
            <p className="mt-2 text-dgreen">Successfully added to cart</p>
            <div className="flex items-center justify-between mt-4 space-x-4">
              <Link
                href={`${path}/checkout`}
                className="rounded text-center bg-dblue text-white py-2 w-3/6 border border-dblue font-semibold"
              >
                CHECKOUT
              </Link>
              <button className="rounded py-2 w-3/6 border border-dblue text-dblue ">
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        </div>
      )}

      {( state.aside) && (
        <div
          className="fixed w-screen h-full min-h-screen top-0 left-0  bg-opacity-30 bg-dblack z-30"
          onClick={() => setTimeout(() =>  dispatch({
            type: "setAsidecart",
            payload: false
          }), 200)}
        ></div>
      )}

      <div
        className={`${width < 650 && "hidden"}`}
        // onClick={() => toggleSucccessAdded(false)}
      >
        <div
          className={`${
            width < 650 && "hidden"
          } top-0  bg-white right-0 w-3/12 px-4 min-h-screen transform  overflow-y-auto  fixed h-full z-40  ease-in-out duration-300 ${
            (state.aside) ? "translate-x-0 " : "translate-x-full"
          }`}
        >
          <div>
            <div className=" border-b border-dinputBorder py-2">
              <div className="flex ">
                <img
                  src={state?.product?.image}
                  alt={state?.product?.name}
                  height={200}
                  width={100}
                  className=" w-4/12 rounded"
                />
                <div className="mt-2 pl-4 py-2">
                  <p
                    className="text-xs font-semibold "
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML(state?.product && state?.product['name']  )
                    }}
                  />
                  {hasBannerEvent?.name !== undefined &&
                  hasBannerEvent?.name !== "" && (
                    <p
                      className="text-xs font-semibold "
                      dangerouslySetInnerHTML={{
                        __html:
                          hasBannerEvent?.name +
                          " - " +
                          data?.name?.toUpperCase(),
                      }}
                    />
                  )
                  //  : (
                  //   <p
                  //     className="text-xs font-semibold "
                  //     dangerouslySetInnerHTML={{
                  //       __html: sanitizeHTML(
                  //         data?.name?.toUpperCase() ||  state?.product?.name
                  //       )
                  //     }}
                  //   />
                  // )
                  
                  }
                  <p className="text-xs font-semibold mt-2 text-dgreen">
                    Added To Cart
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center  mt-2 mb-2">
                <Link
                  href={`${path}/cart/`}
                  className="text-center text-xs bg-dblue border border-dblue rounded text-white py-2 px-2 flex-grow mr-2 hover:bg-dbluedark"
                >
                  CHECKOUT
                </Link>
                <button
                  onClick={() => toggleSucccessAdded(false)}
                  className=" border text-xs border-dblue rounded text-dblue py-2 flex-grow ml-2 hover:bg-dblue hover:text-white"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            </div>

            <h2 className="my-4 font-semibold text-dblack text-xl">My Cart</h2>
            {state.products?.map((product) => (
              <div className="flex border-b border-dinputBorder py-2">
                <img
                  src={product.thumb}
                  alt={product.name}
                  className=" w-3/12 rounded"
                />
                <div className="flex flex-col items-start justify-between pl-4 py-2">
                  <p
                    className=" text-sm font-light"
                    dangerouslySetInnerHTML={{
                      __html:
                        product.name.substring(0, 75) +
                        (product.name.length > 75 && "..."),
                    }}
                  />
                  <p className="font-semibold">
                    {product.total + " "} ( {product.quantity} item
                    {product.quantity > 1 && <span>s</span>} )
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartSideModal;

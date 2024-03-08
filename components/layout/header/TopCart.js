import { useContext, useEffect } from "react";
import { CartContext } from "@/contexts/CartContext";
import buildLink, { path } from "@/urls";
import { axiosServer } from "@/axiosServer";
import Loader from "@/components/Loader";
import Link from "next/link";
import { AccountContext } from "@/contexts/AccountContext";
import { AiOutlineShopping } from "react-icons/ai";
import CartSideModal from "@/components/product/CartSideModal";
import { FaShoppingBasket } from "react-icons/fa";
import { BiCart } from "react-icons/bi";

function TopCart() {
  const [state, dispatch] = useContext(CartContext);
  const [accountState] = useContext(AccountContext);

  useEffect(() => {
    dispatch({
      type: "loading",
      payload: true,
    });
    axiosServer
      .get(
        buildLink("cartCount", undefined, undefined, window.config["site-url"])
      )
      .then((response) => {
        if (response.data.success) {
          dispatch({
            type: "setProductsCount",
            payload: response.data.data.nb_of_products,
          });

          dispatch({
            type: "loading",
            payload: false,
          });
        } else {
          dispatch({
            type: "setProductsCount",
            payload: 0,
          });
          dispatch({
            type: "loading",
            payload: false,
          });
        }
      });
  }, [accountState.loged]);

  return (
    <>
      <CartSideModal />

      <Link
        className={`${
          "window.config[showCart]" == 1 ? "block" : "block"
        } transition ease-in-out duration-300 delay-150 max-md:hidden bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 font-extrabold  md:text-white text-base flex items-center pl-1.5 pr-1 sm:pl-3 sm:pr-6 cursor-pointer hover:opacity-80 relative`}
        href={`${path}/cart`}
      >
        <span className="hidden lg:block ">Basket</span>
        {/* <i className={`icon icon-basket ml-2  text-dgreyBlack w-4 mobile:text-white mobile:w-5`}></i> */}
        <BiCart className="ml-1   text-2xl" />
        <span
          className={`w-5 h-5  bg-dblue flex text-white items-center justify-center rounded-full text-xs absolute right-0 sm:right-2 -top-1.5 border border-white -mr-2 mobile:mr-1`}
        >
          <span>
            {state.loading ? (
              <Loader styles={"h-4 w-4 text-white"} />
            ) : (
              <span>{state.productsCount}</span>
            )}
          </span>
        </span>
      </Link>
    </>
  );
}
export default TopCart;

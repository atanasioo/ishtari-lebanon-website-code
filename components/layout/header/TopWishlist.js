import { axiosServer } from "@/axiosServer";
import Loader from "@/components/Loader";
import { AccountContext } from "@/contexts/AccountContext";
import { WishlistContext } from "@/contexts/WishlistContext";
import buildLink from "@/urls";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { FiHeart } from "react-icons/fi";

function TopWishlist() {
  const [state, dispatch] = useContext(WishlistContext);
  const [accountState] = useContext(AccountContext);

  const path = "";

  useEffect(() => {
    dispatch({
      type: "loading",
      payload: true,
    });

    axiosServer
      .get(
        buildLink("wishlistCount", undefined, undefined, window.location.host)
      )
      .then((response) => {
        if (response.data.success) {
          dispatch({
            type: "setProductsCount",
            payload: response.data.data.total,
          });
          dispatch({
            type: "setProductIds",
            payload: response.data.data.products,
          });
          dispatch({
            type: "loading",
            payload: false,
          });
        } else {
          dispatch({
            type: "setProductsCount",
            payload: response.data.data?.total,
          });
          dispatch({
            type: "loading",
            payload: false,
          });
        }
      });
  }, [dispatch]);

  return (
    <>
      <Link
        // className={`${window.config["showCart"] ? "block" : "hidden"} text-white  font-semibold text-base flex items-center h-8 pr-3 sm:px-5 cursor-pointer hover:opacity-70 hover:text-d17 transition ease-in-out duration-300 delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 relative`}
        className={`${
          window.config["showCart"] ? "block" : "hidden"
        } font-extrabold  md:text-white text-base flex items-center pl-1.5 pr-1 sm:pl-3 sm:pr-6 cursor-pointer  hover:opacity-70 transition ease-in-out duration-300 delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 relative`}
        href={`${path}/account/wishlist`}
      >
        <span className="hidden xl:block lg:block">Wishlist</span>
        <FiHeart
          className={`ml-2 font-extrabold text-2xl  ${
            window.innerWidth < 650 ? " text-dlabelColor " : "text-white"
          }`}
        />

        <span
          className={`w-5 h-5  bg-dblue flex text-white items-center justify-center rounded-full text-xs absolute right-0 sm:right-2 -top-1 border border-white  -mr-0.5 mobile:mr-1`}
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
      <div>
        <span className="lg:border-r lg:border-dplaceHolder">&nbsp;</span>
      </div>
    </>
  );
}

export default TopWishlist;

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
      payload: true
    });

    axiosServer
      .get(buildLink("wishlistCount", undefined, undefined, window.location.host))
      .then((response) => {
        if (response.data.success) {
          dispatch({
            type: "setProductsCount",
            payload: response.data.data.total
          });
          dispatch({
            type: "setProductIds",
            payload: response.data.data.products
          });
          dispatch({
            type: "loading",
            payload: false
          });
        } else {
          dispatch({
            type: "setProductsCount",
            payload: response.data.data?.total
          });
          dispatch({
            type: "loading",
            payload: false
          });
        }
      });
  }, [dispatch]);

  return (
    <Link
      className={`${
        window.config["showCart"] ? "block" : "hidden"
      } text-white lg:border-r lg:border-dplaceHolder font-semibold text-base flex items-center h-8 pr-3 sm:px-5 cursor-pointer hover:opacity-80 relative`}
      href={`${path}/account/wishlist`}
    >
      <span className="hidden xl:block lg:block">Wishlist</span>
      <FiHeart
        className={`ml-2 w-5 h-5  font-extrabold  ${
          window.innerWidth < 650 ? "text-dblack" : "text-white"
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
  );
}

export default TopWishlist;

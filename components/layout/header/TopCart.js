import { useContext, useEffect } from "react"
import { CartContext } from "@/contexts/CartContext";
import buildLink, {path} from "@/urls";
import { axiosServer } from "@/axiosServer";
import Loader from "@/components/Loader";
import Link from "next/link";
import { AccountContext } from "@/contexts/AccountContext";
import { AiOutlineShopping } from "react-icons/ai";
function TopCart() {
    const [state, dispatch] = useContext(CartContext)
    const [accountState] = useContext(AccountContext)
  
    useEffect(() => {
        dispatch({
            type: "loading",
            payload: true
        })
        axiosServer.get(buildLink("cartCount",undefined, undefined)).then((response) => {
            if (response.data.success) {
                
                dispatch({
                    type: "setProductsCount",
                    payload: response.data.data.nb_of_products
                })
                
                dispatch({
                    type: "loading",
                    payload: false
                })
            }
            else {
                dispatch({
                    type: "setProductsCount",
                    payload: 0
                })
                dispatch({
                    type: "loading",
                    payload: false
                })
            }
        })
    }, [])
 
    return (
        <Link className={`${"window.config[showCart]"==1 ? 'block' : 'block'} font-semibold text-base flex items-center pl-1.5 pr-1 sm:pl-3 sm:pr-6 cursor-pointer hover:opacity-80 relative`} href={`${path}/cart`}>
            <span className="hidden lg:block ">Cart</span>
            {/* <i className={`icon icon-basket ml-2  text-dgreyBlack w-4 mobile:text-white mobile:w-5`}></i> */}
            <AiOutlineShopping className="ml-1 w-5.5 h-5.5 lg:w-5 lg:h-6" />
            <span className={`w-5 h-5  bg-dbase flex text-white items-center justify-center rounded-full text-xs absolute right-0 sm:right-2 -top-1.5 border border-white -mr-2 mobile:mr-1`}>
                 
                <span>
                    {
                        state.loading ?
                            <Loader styles={'h-4 w-4 text-white'} />
                            :
                            <span>{state.productsCount}</span>
                    }
                </span>
            </span>
        </Link>
    )
}
export default TopCart
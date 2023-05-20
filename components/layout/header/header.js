import DesktopMenuCategories from "./desktopMenuCategories";
import { useState, useEffect } from "react";
import _axios from "@/axios";
import buildLink from "@/urls";
import SiteHeaders from "./site-headers";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineShopping, AiOutlineUser } from "react-icons/ai";
import { FiChevronDown } from "react-icons/fi";
import TopSearch from "./top-search";
import useDeviceSize from "@/components/useDeviceSize";


function Header(props) {
  const [local, setLocal] = useState(false);
  const { header_categories } = props;
  const [width, height] = useDeviceSize();

  useEffect(() => {
    if (window.location.host === "localhost:3000") {
      setLocal(true);
    }
  }, []);



  //   const [state, setState]= useState([])
  //   useEffect(()=>{
  //     _axios(buildLink('headerv2', undefined, undefined)).then((response)=>{
  //         console.log(response.data)
  //         setState(response.data.data)
  //     })
  // },[])

  return (
    <div>
      {local && <SiteHeaders local={local} />}
      <div className="flex items-center justify-between my-4 h-14 container">
        <Link href="/" className="header-logo">
          <Image
            src="/images/logo/logo-red.png"
            width={130}
            height={130}
            alt="ishtari-logo"
            priority={true}
            style={{ width: '80%', height: 'auto' }}
          />
        </Link>
        <TopSearch />
        <div className="flex  items-center">
          <div className="country-flag flex justify-center items-center border-r mr-5 border-dplaceHolder pr-5 cursor-pointer">
              <img
                className="w-7 h-5 "
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAhCAYAAACbffiEAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAMrSURBVFhH7VhbSFRRFD1iVBj1I/QVhJMoaQ1mKSaBmJmWaWpgD7KHZlmJWoL0UMtCRSU0ykcPx2cPMsvSKZ/5IiM1K0clMUMkKzXTNAMtXe17vR8JfkhzLgwxCxb3nn3Onrlr1tlnZg8bXGaK/4F6IbpGvRBdo17IXPl1lpgcZP1sPuRiH/GHwRLxOts8T7JfmjbIRXT0QF2uAj4MzDrPkwwy4uXwe7DUVfCqj5ci8kFWIYY528ByiZmbwJLNoSwMwMjET2mWL2QRMjk1BdunYWCqjVA88INrRQQsio6BXVXiaGOatIovZBHS9KUFxnkeONGswkUiS7eDZdFxuFVE4krbfTR/65JW8gN3IUH1SWCXlmN3XSLYtfWwLzuNwIZ0mJAzZgUHYPkoUFrJF1yFJL5SIfxNLlqGuuFUEg6W7QqWRfWR4QCb4mB4VZ4TxbF0W5R8ei1l8QF3R+r7NGBJK8BytkBRsB+OZafofitYnjuJcsbJpgw4lJ9BDG2xofFRKUt7cBXC0qxhku+LSKEuVE5Q0CnFVI642Vk6fXrd8hTdURYHIaQ6BqGN6VKm9uAmRHHXBwMTY/CoisbBugR6YEdywWPaiUxnErEd80jIXmEuZQ2sCg9LmXzA1REHdSi5slZ0I6TxOhbd9sTOqgswEJwgR9wrorBBHYy+8RGsfkzHcYoSLcM9UrZ24CKkc/QzWLQRdtXGI7e7hsTYwO5JKFY+9INFoT8VvVAj5E6qNdXJZqohM4SRUAFdlMsDWgsRCtafjtwpuk/W3AO7bE41kgWXykh6aBdxSwkilubvEdf718TB+9l5eFdGid/2pR8bxLi24OJI2/de+FABx7bmS5FpsBQrsDs7aFu5waPirBSdCWXBPtT1t0ujfwfXGvkbe2rjxE+cpa0THTGkopcTsgjxfR4Ls6IAaURvcsMOZuojsK+OkCL8wa0fmdS0o6/pBRLUSdSH0G+pzl78phhaO6gf6cWQ5i1Vdg8OZQcD77oxMctraENuHaLQBQ4xI4yxxRhgC2bMCeNBtlC8Thoay9Ixcu3Z59Kfy9XD6/9F0TXqhega9UJ0i6b4A/QB3t+zIyKhAAAAAElFTkSuQmCC"
                alt="Lebanon"
              />{" "}
              {width > 650 && <div className="flex ml-2"> Lebanon</div>}
              <FiChevronDown className="w-5 " />
          </div>
          <div className=" flex justify-center items-center border-r mr-5 border-dplaceHolder pr-5 cursor-pointer">
            <p>Sign In</p> <AiOutlineUser className="ml-1 w-5 h-5" />
          </div>
          <div className="flex justify-center items-center mr-5 cursor-pointer">
            <p>Cart</p>
            <AiOutlineShopping className="ml-1 w-5 h-5" />
          </div>
        </div>
      </div>
      <DesktopMenuCategories header_categories={header_categories} />
    </div>
  );
}

export default Header;

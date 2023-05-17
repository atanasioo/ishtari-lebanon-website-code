import buildLink from "@/urls"
import { useEffect } from "react"
import { useRouter } from "next/router"
import _axios from "@/axios";


function DesktopMenuCategories(props) {
  // useEffect(() => {
  //   _axios
  //       .get(buildLink("all_categories", undefined, window.innerWidth))
  //       .then((response) => {
  //         try {
  //           const data = response.data.data;
  //           console.log(response);
  //         } catch (error) {}
  //       });
  // },[])

  return (
    <div>desktopMenuCategories</div>
  )
}

export default DesktopMenuCategories
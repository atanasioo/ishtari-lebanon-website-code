import React from 'react'
import DesktopMenuCategories from './desktopMenuCategories'
import { useState, useEffect} from 'react'
import _axios from '@/axios'
import buildLink from '@/urls'
import SiteHeaders from './site-headers'

function Header(props) {
  const [local, setLocal] = useState(false);

  useEffect(() => {
    if (window.location.host === "localhost:3000") {
      setLocal(true);
    }
  }, []);

  console.log(local);

  // console.log(props.all_categories);

//   const [state, setState]= useState([])
//   useEffect(()=>{
//     _axios(buildLink('headerv2', undefined, undefined)).then((response)=>{
//         console.log(response.data)
//         setState(response.data.data)
//     })
// },[])

  return (
    <div>
      {local && (
        <SiteHeaders local={local} />
      )}
      <DesktopMenuCategories />
    </div>
  )
}

export default Header
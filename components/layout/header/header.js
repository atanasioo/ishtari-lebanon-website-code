import React from 'react'
import DesktopMenuCategories from './desktopMenuCategories'
import { useState, useEffect} from 'react'
import _axios from '@/axios'
import buildLink from '@/urls'

function Header() {

  const [state, setState]= useState([])
  useEffect(()=>{
    _axios(buildLink('headerv2', undefined, undefined)).then((response)=>{
        console.log(response.data)
        setState(response.data.data)
    })
},[])

  return (
    <div>Header
      <DesktopMenuCategories props={state}/>
    </div>
  )
}

export default Header
import React from 'react'
import Header from './header/header'
import header from './header/header'

function Layout({children, header_categories}) {

  // console.log(header_categories);
  
  return (
    <div>
        <Header header_categories={header_categories} />
        {children}
    </div>
  )
}

export default Layout
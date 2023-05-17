import React from 'react'
import Header from './header/header'
import header from './header/header'

function Layout({children, all_categories}) {
  
  return (
    <div>
        <Header all_categories={all_categories} />
        {children}
    </div>
  )
}

export default Layout
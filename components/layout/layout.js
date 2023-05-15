import React from 'react'
import Header from './header/header'
import header from './header/header'

function Layout({children}) {
  return (
    <div>
        <Header />
        {children}
    </div>
  )
}

export default Layout
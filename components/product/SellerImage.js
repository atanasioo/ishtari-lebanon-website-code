import React from 'react'

function SellerImage(props) {
  return (
    <div 
    className='rounded-full w-12 h-12 flex justify-between items-center border-2' 
    style={{borderColor: "rgb(243, 244, 248)",
    background: "url(" + window.config['site-url'] + "/image/" + props.src + ") center center / contain no-repeat"
    }}>

    </div>
  )
}

export default SellerImage
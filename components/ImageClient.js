import Image from 'next/image'
import React from 'react'


export default function ImageClient(props) {
    // console.group(props)
  return (
    <Image alt={props.alt} src={ `${ window !=undefined && window.config["site-url"]}/image/` + props.src}  width={props.width} height={props?.height} />
  )
}

 function SlideshowPlaceholder({alt}){
    return(
        <img src="/images/placeholder_slideshow.png" width={1440} height="270" alt={alt} />
    )
}
 function SquarePlaceholder({width, height, alt}){
    return(
        <img src="/images/product_placeholder_square.png" width={width ? width : 160} height={height ? height : 160} alt={alt} />
    )
}

export { SlideshowPlaceholder, SquarePlaceholder };

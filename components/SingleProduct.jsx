

import DOMPurify from "dompurify";
function SingleProducts(props) {
 

  
  async function getProductData(e) {

    const product_id = props.item.product_id.toString();
    const product_name = props.item.name
      .replaceAll(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
      .replaceAll(/\s+/g, "-")
      .replaceAll("..", "")
      .replaceAll("/", "-")
      .replaceAll("---", "-")
      .replaceAll("--", "-")
      .replaceAll("/", "")
      .replaceAll("%", parseInt("%"));

  }

  return (
    <div
      href={`/${props.item.name
        .replaceAll(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
        .replaceAll("%", parseInt(""))
        .replaceAll(/\s+/g, "-")
        .replaceAll("..", "")
        .replaceAll("/", "-")
        .replaceAll("---", "-")
        .replaceAll("--", "-")
        .replaceAll("100%", "")
        .replaceAll("#", "")
        .replaceAll("/", "")}/p=${props.item.product_id}`}
      className={` cursor-pointer ${props.isList && "mb-3 "}`}
      onClickCapture={props.click}
      onClick={(e) => {
        dragging === false && getProductData(e);
        setProductHolder(props.item);
      }}
    >
      { "yes"
        // <div
        //   className={`bg-white h-full ${
        //     props.isList ? "p-4 relative" : "pb-2"
        //   }  ${fetching && "animate-pulse"}`}
        //   style={{
        //     border: props.noBorder ? "" : "0px solid #eee",
        //     width: !props.scroll ? props.carousel ? "39vw" : "98%" : "39vw",
        //     marginRight: props.carousel ? "7.5px" : "0px",
        //     height: props.isList && "260px"
        //   }}
        // >
        //   {props.item.new && window.config['site-url'] !== "https://www.ishtari.com.gh" && (
        //     <img
        //       src={newImage}
        //       className="absolute z-10 h-5 "
        //       alt="Express delivery"
        //     />
        //   )}
        //   <div className={`${props.isList && "flex"}`}>
        //     <div
        //       className={` relative ${
        //         props.isList &&
        //         "flex-shrink-0 flex-grow-0 w-40 -my-4 -ml-4 mr-4"
        //       }`}
        //       onMouseEnter={handleMouseEnter}
        //       onMouseLeave={handleMouseLeave}
        //     >
        //       {props.item.quantity === "0" && (
        //         <div
        //           className={
        //             window.innerWidth > 650
        //               ? "absolute z-20 text-dbase w-full text-center  bottom-0"
        //               : "absolute z-20 text-dbase  w-full text-center  bottom-0 "
        //           }
        //         >
        //           Out Of Stock
        //         </div>
        //       )}
        //       {props.item.quantity === "0" ? (
        //         <ImageFilter
        //           image={props.item.thumb}
        //           filter={"duotone"} // see docs beneath
        //           colorOne={[96, 96, 96]}
        //           colorTwo={[255, 255, 255]}
        //         />
        //       ) : !props?.isSlider ||
        //         props?.item?.images?.length === 0 ||
        //         !props?.item?.images ? (
        //         <img
        //           alt={props.item.name}
        //           src={fetching ? placeholdersrc : props.item.thumb}
        //           width="288"
        //           height="396"
        //           style={{
        //             backgroundImage:
        //               'url("https://www.sari3.com/ishtaridemo/product_placeholder.png")',
        //             backgroundSize: "cover"
        //           }}
        //           // placeholdersrc={placeholdersrc}
        //         />
        //       ) : (
        //         <Swiper
        //           pagination={{
        //             el: ".my-custom-pagination-div",
        //             clickable: true,
        //             renderBullet: (index, className) => {
        //               return '<span class="' + className + '">' + "</span>";
        //             }
        //           }}
        //           loop={true}
        //           preventClicks={false}
        //           allowTouchMove={width > 650 ? false : true}
        //           modules={[Pagination, Autoplay]}
        //           autoplay={false}
        //           onInit={onInit}
        //           className="single-product-swiper"
        //         >
        //           <SwiperSlide>
        //             {" "}
        //             <img
        //               alt={props.item.name}
        //               src={fetching ? placeholdersrc : props.item.thumb}
        //               width="288"
        //               height="396"
        //               placeholdersrc={placeholdersrc}
        //               style={{
        //                 backgroundImage:
        //                   'url("https://www.sari3.com/ishtaridemo/product_placeholder.png")',
        //                 backgroundSize: "cover"
        //               }}
        //             />
        //           </SwiperSlide>
        //           {props?.item?.images?.slice(0, 2).map((image) => {
        //             return (
        //               <SwiperSlide key={image.mobile_image}>
        //                 {" "}
        //                 <img
        //                   alt={props.item.name}
        //                   src={fetching ? placeholdersrc : image.mobile_image}
        //                   width="288"
        //                   height="396"
        //                   // placeholdersrc={placeholdersrc}
        //                   style={{
        //                     backgroundImage:
        //                       'url("https://www.sari3.com/ishtaridemo/product_placeholder.png")',
        //                     backgroundSize: "cover"
        //                   }}
        //                 />
        //               </SwiperSlide>
        //             );
        //           })}
        //           <div
        //             className={`my-custom-pagination-div absolute left-0 z-50 right-0 ${
        //               props?.item?.option_color_count &&
        //               props?.item?.option_color_count > 1
        //                 ? "bottom-9"
        //                 : "bottom-3"
        //             }`}
        //           ></div>

        //           {props?.item?.option_color_count &&
        //           props?.item?.option_color_count > 1 ? (
        //             <div className="flex items-center flex-col ">
        //               <div
        //                 className="text-d12 absolute bottom-0 z-50 font-semibold mb-2 px-3 overflow-hidden whitespace-nowrap overflow-ellipsis w-auto"
        //                 style={{
        //                   borderRadius: "30px",
        //                   background: "rgb(239, 243, 253)",
        //                   border: "1px solid rgba(255, 255, 255, 0.7)",
        //                   maxWidth: width > 650 ? "45%" : "50%",
        //                   paddingTop: "2px",
        //                   paddingBottom: "2px"
        //                 }}
        //               >
        //                 {props?.item?.option_color_count} Colours
        //               </div>
        //             </div>
        //           ) : (
        //             ""
        //           )}
        //         </Swiper>
        //       )}
        //     </div>
        //     <div
        //       className={` ${
        //         props.isList ? "flex flex-col pb-1 flex-1" : "px-2"
        //       } `}
        //     >
        //       <div
        //         className={`${props.item.quantity === "0" && "opacity-40"} ${
        //           props.isList && "flex justify-between"
        //         }`}
        //       >
        //         {/* PUT IS AFTER _html "[brand name]  " +  */}
        //         <div className="h-12 overflow-hidden">
        //           <span
        //             className={`text-dblack ${
        //               props.isList ? "text-base font-semibold" : "text-d13 "
        //             }md:text-thin mb-1 h-10 font-semibold`}
        //             dangerouslySetInnerHTML={{
        //               __html: DOMPurify.sanitize(props.item.manufacturer_name)
        //             }}
        //           />
        //           {props.isList && <br />}

        //           {props?.item?.name?.split(" ")[0] ===
        //             props.item.manufacturer_name &&
        //           props.item.manufacturer_name !== undefined ? (
        //             <span
        //               className={`text-dblack ${
        //                 props.isList
        //                   ? "text-base leading-6"
        //                   : "ml-1 text-d13 md:text-thin font-light"
        //               }   mb-1 h-10 `}
        //               dangerouslySetInnerHTML={{
        //                 __html: DOMPurify.sanitize(
        //                   props?.item?.name?.split(
        //                     props.item.manufacturer_name
        //                   )[1]
        //                 )
        //               }}
        //             />
        //           ) : (
        //             <span
        //               className={`text-dblack ${
        //                 props.isList
        //                   ? "text-base leading-6"
        //                   : "ml-1 text-d13 md:text-thin font-light"
        //               }   mb-1 h-10 `}
        //               dangerouslySetInnerHTML={{
        //                 __html: props.isList
        //                   ? props.item.full_name
        //                   : props.item.name
        //               }}
        //             />
        //           )}
        //         </div>

        //         <div className={`${props.isList && "text-right"}`}>
        //           <p
        //             className={`text-dblack ${
        //               props.isList ? "text-xl" : "text-d14 md:text-base"
        //             } md:w-full font-bold `}
        //           >
        //             {props.item.special !== "0" &&
        //             props.item.special !== "" &&
        //             props.item.special !== false
        //               ? props.item.special
        //               : props.item.price}
        //           </p>
        //           <div
        //             className={`${
        //               !props.item.special && "invisible"
        //             } flex items-center ${props.isList && "m-px"}`}
        //           >
        //             <p
        //               className={`text-dgrey1 text-d12 line-through  ${
        //                 (props.item.special === "0" ||
        //                   props.item.special === "" ||
        //                   props.item.special === false) &&
        //                 "invisible"
        //               }`}
        //             >
        //               {props.item.price}
        //             </p>
        //             {props.item.saving !== 0 && props.item.saving !== "0" && (
        //               <p className="ml-2 text-d11 font-bold text-dgreen">
        //                 {props.item.saving + "% OFF"}
        //               </p>
        //             )}
        //           </div>
        //         </div>
        //       </div>

        //       {/* PRODUCT DESCRIPTION LIST */}
        //       {props.isList && props.item.description && (
        //         <div className="mt-2 overflow-ellipsis overflow-hidden w-full h-28 text-d12 text-dlabelColor">
        //           {" "}
        //           <div
        //             dangerouslySetInnerHTML={{
        //               __html:
        //                 DOMPurify.sanitize(
        //                   props.item.description.slice(0, 500)
        //                 ) + "..."
        //             }}
        //           ></div>
        //         </div>
        //       )}

        //       <div className="flex place-content-between">
        //         <div
        //           className={`w-5/12 ${
        //             props.isList
        //               ? "mt-auto pt-3 flex justify-between items-center"
        //               : "flex flex-row justify-between"
        //           } `}
        //         >
        //           {" "}
        //           {props.item.market === "0" ? (
        //             props.item.quantity === "0" ? (
        //               <ImageFilter
        //                 className="h-4 w-16"
        //                 image={ExpressImage}
        //                 filter={"duotone"} // see docs beneath
        //                 colorOne={[96, 96, 96]}
        //                 colorTwo={[255, 255, 255]}
        //               />
        //             ) : (
        //               <img
        //                 src={ExpressImage}
        //                 className="h-6 py-1"
        //                 alt="Express delivery"
        //               />
        //             )
        //           ) : (
        //             <img src={marketImage} className="h-6 py-1 " alt="" />
        //           )}{" "}
        //           {/* {state.loged && (
        //           <div
        //             className="pr-2 flex items-center w-auto gap-2 justify-between overflow-hidden"
        //             style={{ color: "rgba(67, 101, 216, 1)" }}
        //             onClick={(e) => {
        //               e.stopPropagation();
        //               e.nativeEvent.stopImmediatePropagation();
        //               e.preventDefault();
        //               setIsLiked(!isLiked);
        //               isLiked
        //                 ? removeLike(props.item.product_id)
        //                 : addLike(props.item.product_id);
        //             }}
        //           >
        //             <span className="text-lg">
        //               {" "}
        //               {isLiked ? <AiFillLike /> : <AiOutlineLike />}
        //             </span>

        //             <span className="text-sm h-4">
        //               {nFormatter(likeNumber)}
        //             </span>
        //           </div>
        //         )} */}
        //         </div>
        //         { props.item?.nb_of_reviews > 0 && (
        //           <div className="flex pt-1 space-x-1 	">
        //             <div
        //               className="flex rounded-full px-1 place-content-end h-4 w-9 align-bottom"
        //               style={{ backgroundColor:  props?.item?.rating >=  4.5 ? "rgb(0,158,0)"  :    props?.item?.rating < 4.5 &&    props?.item?.rating >=4  ? "rgb(110, 159, 0)" :  props?.item?.rating < 4  &&    props?.item?.rating >= 3.5  ? "rgb(243, 153, 22)"  : "rgb(246,90,31)"   }}
        //             >
        //               <div className="text-d12 font-bold text-white "  style={{ paddingTop: "1px" }}>
        //                 {props?.item?.rating > 0   && props.item?.rating }
        //               </div>
        //               <HiStar
        //                 className="pt-1 text-white text-bold text-d12"
        //                 emptyColor="#FFFFFF"
        //               />{" "}
        //             </div>

        //             <div className="font-light text-d11 ">
        //               ({" "}
        //               {props?.item?.reviews?.length < 1 &&
        //               props?.item?.reviews?.length === ""
        //                 ? "0"
        //                 : props.item?.nb_of_reviews}{" "}
        //               )
        //             </div>
        //           </div>
        //         )}
        //       </div>
        //       {props.addToCart && (
        //         <button className="w-full bg-dblue text-white h-8 rounded mt-2">
        //           Add To Cart
        //         </button>
        //       )}
        //     </div>
        //   </div>
        //   {state.admin && (
        //     <div className="my-1 px-1 flex justify-between z-10">
        //       {/* <button className=" text-dgrey1">Add To Cart</button> */}
        //       <span
        //         className={`p-1  ${copied ? "text-dgreen" : ""}`}
        //         onClick={(e) => copyContent(e, props.item.sku)}
        //       >
        //         {" "}
        //         {!copied ? props.item.sku : "Copied!"}
        //       </span>
        //       <span className="bg-dgrey1 bg-opacity-25 p-1 rounded">
        //         {props.item.quantity}
        //       </span>
        //     </div>
        //   )}
        // </div>

      }
    </div>
  );
}

export default SingleProducts;

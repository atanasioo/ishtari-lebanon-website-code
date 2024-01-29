import { axiosServer } from '@/axiosServer';
import PointsLoader from '@/components/PointsLoader';
import { CartContext } from '@/contexts/CartContext';
import buildLink from '@/urls';
import DOMPurify from 'dompurify';
import Head from 'next/head'
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react'
import { FaAddressCard, FaStar, FaUser } from 'react-icons/fa';
import { MdAddShoppingCart } from 'react-icons/md';

const CartShared = () => {


  const [loading, setLoading] = useState(true);
  const [state, dispatch] = useContext(CartContext);
  const router = useRouter();
  const [products,setProducts]= useState(null);

  // Retrieve the value of the 'url' parameter from the query object
  const { url } = router.query;


  async function getProducts(){
    setLoading(true)
    console.log(url)
    if (url== null || url == undefined){
    //  router.push("/");
    }else{
    await  axiosServer.get(buildLink("getSharedCart")+"&url="+url+"&source_id=2").then((res)=>{
      setLoading(false)
       if(res.data.success == true){
        setProducts(res.data.data.products);
       }
      })
    }
  }


  useEffect(()=>{
    getProducts()
  },[router.query])








 async function addSingleProduct(product){
    let obj ={
    
        product_id : product.product_id,
        quantity:1,
        option:product.options
    
    }
    axiosServer
      .post(
        buildLink(
          "cart",
          undefined,
          window.innerWidth,
          window.config["site-url"]
        ) + "&source_id=1",
        obj
      ) .then((response) => {
        const data = response.data;
         if (data.success !== true) {
      } else {
        dispatch({
          type: "loading",
          payload: true
        });
        axiosServer
          .get(
            buildLink(
              "cart",
              undefined,
              window.innerWidth,
              window.config["site-url"]
            )
          )
          .then((response_data) => {
            dispatch({
              type: "setProducts",
              payload: response_data.data?.data?.products
            });

            dispatch({
              type: "setProductsCount",
              payload: response_data?.data?.data?.total_product_count
            });
            dispatch({
              type: "setTotals",
              payload: response_data.data?.data?.totals
            });

            dispatch({
              type: "setAsidecart",
              payload: true
            });

            dispatch({
              type: "setProduct",
              payload: {
                name: product.name,
                image: product.thumb
              }
            });
            dispatch({
              type: "loading",
              payload: false
            });
       
      
          })

          }})}


  async function addAllProducts(){
    var listProducts = [];  
for (var i = 0; i < products.length; i++) {  // Use < instead of <=, and fix the loop condition
  var product = products[i];

   const obj ={
    product_id:product.product_id,
    quantity:product.quantity
   }
   if(product.options.length == 0){
    obj.option =[]
   }else{
    obj.option ={
        [product.options[0].product_option_id]:product.options[0].product_option_value_id
    }
   }
   listProducts.push(obj);
  
}

const listProductsObj = {
  products:listProducts
}
try{
  axiosServer.post(buildLink("addShareCart"),listProductsObj).then((res)=>{
   if(res.data.success == true){
    dispatch({
      type: "loading",
      payload: true
    });
    axiosServer
      .get(
        buildLink(
          "cart",
          undefined,
          window.innerWidth,
          window.config["site-url"]
        )
      )
      .then((response_data) => {
        dispatch({
          type: "setProducts",
          payload: response_data.data?.data?.products
        });

        dispatch({
          type: "setProductsCount",
          payload: response_data?.data?.data?.total_product_count
        });
        dispatch({
          type: "setTotals",
          payload: response_data.data?.data?.totals
        });
        dispatch({
          type: "loading",
          payload: false
        });
      })
   }
  })
}catch(e){
  console.log(e)
}

  }

  return (
    <div className=' bg-white my-4  min-h-screen'>
  <div className=" container pb-8">
<Head>
          <title> Sharing Cart | ishtari</title>
          <meta
            name="description"
            content="Review and finalize your order with our convenient and secure shopping cart. Add items, adjust quantities, and proceed to checkout with confidence. Enjoy hassle-free online shopping and quick delivery of your favorite products."
          ></meta>
        </Head>
       
        {loading ? (
          <PointsLoader />
        ) :(  <>
       <div className='  flex flex-col justify-center h-full'>
          <div className=' my-2 px-3 py-1 w-full rounded-full bg-dPink h-full flex flex-row align-middle  justify-start gap-4'>
            <FaUser className=' text-dDarkgrey max-sm:mt-2 md:my-auto text-xs'/>
          <div className='  felx flex-row gap-1 w-full '>
            <span className=' text-dgreyBlack font-bold text-sm tracking-normal' > Sharing with you some great items from others' shopping list. </span>
            </div>
            </div>
               <div></div>


<div className=' max-h-full overflow-auto flex flex-col px-4 justify-center gap-3'>
{products && products.map((product)=><div className=' w-full flex flex-row justify-between'>
                      {/* Desktop Design */}
                      <div
                        className={`hidden xl:flex lg:flex mb-2  py-2 rounded justify-center items-center `}
                      >
                     
                        <img
                          onClick={() => {
                            router.push(
                              `${slugify(product.name)}/p=${product.product_id}`
                            );
                         
                          }}
                          src={product.thumb}
                          className="w-24 cursor-pointer block rounded"
                          alt={product.name}
                          loading="lazy"
                        />
                        <div className="flex flex-col justify-between items-start px-9 text-dblack py-2 flex-grow ">
                          <p className="text-d13 text-dgrey1">{product.sku}</p>
                          <p
                            className=" text-sm font-semibold"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(product.name),
                            }}
                          ></p>
                          {product.options.length > 0 && (
                            <p className="text-dgreen text-sm">
                              {product.options[0].name +
                                " (" +
                                product.options[0].value +
                                ")"}
                            </p>
                          )}
                      
                        
                        </div>

                        <div className="py-2 px-6 w-48 flex flex-col items-end text-dblack justify-center">
                          <span className=" font-semibold text-lg">
                            {product.total}
                          </span>
                        
                         
                        </div>
                      </div>
                      {/* Mobile design */}
                      <div
                        className={`flex xl:hidden lg:hidden mb-2 px-4 py-2 rounded `}
                      >
                        <div className="w-3/12 ">
                          <div className="flex justify-center items-center">
                          
                            <img
                              onClick={() => {
                                router.push(
                                  `${product.name
                                    .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                                    .replace(/\s+/g, "-")
                                    .replace("/", "-")}/p=${product.product_id}`
                                );
                              
                              }}
                              src={product.thumb}
                              className="w-full block cursor-pointer rounded"
                              alt={product.name}
                              loading="lazy"
                            />
                          </div>
                          <div className="flex flex-col items-end text-dblack justify-center">
                            <div className="flex mt-2">
                            
                           
                            </div>
                          </div>
                        </div>
                        <div className="w-9/12 flex flex-col justify-between items-start pl-6 text-dblack py-2 flex-grow ">
                          <p className="text-d13 text-dgrey1">{product.sku}</p>
                          <p
                            className=" text-sm "
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(product.name),
                            }}
                          ></p>
                          {product.options.length > 0 && (
                            <p className="text-dgreen text-sm">
                              {product.options[0].name +
                                " (" +
                                product.options[0].value +
                                ")"}
                            </p>
                          )}
                          <span className=" font-semibold text-lg">
                            {product.total}
                          </span>

                        </div>
                      </div>
                     <div className=' my-auto'> <button onClick={()=>addSingleProduct(product)}  className=' py-1 px-3 shadow-md  border-dlabelColor border rounded-full'><MdAddShoppingCart className=' my-auto'/></button></div>
                    </div>)}
                   {products&& <div onClick={()=>addAllProducts()} className=' container flex flex-row gap-3'><button className=' w-full bg-dblue  py-1 text-white'>Add All </button>
                    <button onClick={()=>router.push("/cart")} className=' w-full  border border-dblue text-dblue  py-1'>View Cart </button>
                    </div>}
               
          </div>
          </div>
         </>

        )}









  </div>
    </div>
  )
}

export default CartShared
import DOMPurify from 'dompurify';
import React, { useState } from 'react'
import { FaShare, FaWindowClose } from 'react-icons/fa';
import useDeviceSize from "@/components/useDeviceSize";
const ShareCart = ({products , isShowShare, closeShare}) => {


  const [width] = useDeviceSize();
  const [selectProduct, setSelectProduct] = useState([]);
  const [selectAll1, setSelectAll1] = useState(false);

  function selectAll(res) {
    var array = [];

    var ele = document.getElementsByName("chk");
    if (res === true) {
      for (var i = 0; i < ele.length; i++) {
        if (ele[i].type === "checkbox") ele[i].checked = true;
        array.push(ele[i].id);
        console.log(array)
      }
      setSelectProduct(array);
      // console.log(selectProduct)
    } else {
      var elem = document.getElementsByName("chk");
      for (var j = 0; i < elem.length; j++) {
        if (elem[j].type === "checkbox") elem[j].click();
        ele[j].checked = false;

        // console.log("selectProduct")
      }
      setSelectProduct([]);
    }
    changeUrlShare();
    setSelectAll1(res);
  }


function changeUrlShare(){
var url = 'localhost:3000/cartShared/'
var shareUrl = url;
var listProducts = [];  
shareUrl = url+"count="+listProducts.length
for (var i = 0; i < products.length; i++) {  // Use < instead of <=, and fix the loop condition
  var product = products[i];
  if (selectProduct.includes(product.cart_id)) {

   const obj ={
    product_id:product.product_id,
    quantity:product.quantity,
   }
   if(product.option.length == 0){
    obj.option =[]
   }else{
    obj.option ={
        [product.option[0].product_option_id]:product.option[0].product_option_value_id
    }
   }
   listProducts.push(obj);
   console.log(listProducts)
  } 
}

console.log(url+`count=${listProducts.length}`)
}



  function change(e,id) {
    if(e.target.checked){
        setSelectProduct([...selectProduct, id])
    }else{
        let newArray = selectProduct.filter(item => item !== id);

        setSelectProduct(newArray);
    }
    changeUrlShare()
  }
  return (
    <div className={` ${isShowShare?"top-0 opacity-100":" -top-[100%] opacity-0"}  transition-all  duration-500 fixed bg-dgrey w-full h-full z-50 left-0 bottom-0 right-0 `}>
        
    <div className=" flex flex-col  relative container w-full h-full bg-white py-5 ">
      <div className="  px-2 py-2 border-b border-dplaceHolder flex flex-row justify-between w-full "><h2 className=" text-xl text-dblackk  font-[900] tracking-widest ">All Items ({products.length})</h2><button onClick={closeShare}><FaWindowClose/></button></div>
          









<div className=" max-h-full overflow-y-auto">
      {products.map((product, i) => (
                <div key={product.cart_id}>
                  {/* Desktop Design */}
                 {width >650 && <div
                    className={`hidden xl:flex lg:flex mb-2 px-4 py-2 rounded justify-center items-center ${
                      product.stock ? "bg-white " : "bg-dbase bg-opacity-10"
                    }`}
                  >
                  
                      <div className=" mr-5">
                        <input
                          className="mx-1"
                          type="checkbox"
                          name='chk'
                          id={product.cart_id}
                          onClick={(e) => change(e,product.cart_id)}
                          checked={
                            selectProduct.indexOf(product.cart_id) > -1
                              ? "checked"
                              : ""
                          }
                         
                        />
                      </div>
                 
                    <img
                      onClick={() => {
                        route.push(
                          `${slugify(product.name)}/p=${product.product_id}`
                        );
                        setMarketingData({
                          ignore: false,
                          banner_image_id: "",
                          source_type: "cart",
                          source_type_id: "",
                        });
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
                      {product.option.length > 0 && (
                        <p className="text-dgreen text-sm">
                          {product.option[0].name +
                            " (" +
                            product.option[0].value +
                            ")"}
                        </p>
                      )}
                      {product.warranty.length > 0 && (
                        <p className="text-dgreen text-sm">
                          {product.warranty[0].warranty_name +
                            " ( " +
                            product.warranty[0].warranty_titles +
                            " / " +
                            product.warranty[0].warranty_days +
                            " )"}{" "}
                        </p>
                      )}
                     
                    </div>

                    <div className="py-2 px-6 w-48 flex flex-col items-end text-dblack justify-center">
                      <span className=" font-semibold text-lg">
                        {product.total}
                      </span>
                    
                    </div>

                  </div>
                          }
                          
                  {/* Mobile design */}
                 {width<650 && <div
                    className={`flex xl:hidden lg:hidden mb-2 px-4 py-2 rounded ${
                      product.stock ? "bg-white " : "bg-dbase bg-opacity-10"
                    }`}
                  >
                    <div className="w-3/12 ">
                      <div className="flex justify-center items-center">
                       
                          <div className="">
                            <input
                              className="mx-1"
                              type="checkbox"
                              id={product.cart_id}
                              onChange={(e) => change(e,product.cart_id)}
                              checked={
                                selectProduct.indexOf(product.cart_id) > -1
                                  ? "checked"
                                  : ""
                              }
                              name="chk"
                            />
                          </div>
                       
                        <img
                          onClick={() => {
                            route.push(
                              `${product.name
                                .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                                .replace(/\s+/g, "-")
                                .replace("/", "-")}/p=${product.product_id}`
                            );
                            setMarketingData({
                              ignore: false,
                              banner_image_id: "",
                              source_type: "cart",
                              source_type_id: "",
                            });
                          }}
                          src={product.thumb}
                          className="w-full block cursor-pointer rounded"
                          alt={product.name}
                          loading="lazy"
                        />
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
                      {product.option.length > 0 && (
                        <p className="text-dgreen text-sm">
                          {product.option[0].name +
                            " (" +
                            product.option[0].value +
                            ")"}
                        </p>
                      )}
                      <span className=" font-semibold text-lg">
                        {product.total}
                      </span>

                    </div>
                  </div>
      }
                </div>
              ))}

</div>
<div className=" py-5 w-full border-t border-dplaceHolder ">   
<div className=" w-full flex flex-row  justify-between px-3">
<div className=" w-full flex justify-start gap-5 text-start  ">
   <input  onChange={()=> selectAll(!selectAll1 ? true : false)} id="selectAll"  type="checkbox"/>
    <label
      className="text-dlabelColor text-lg my-auto h-fit font-thin"
      htmlFor="selectAll">
     All 
    </label>
  </div>
  
  
  <div className=" flex flex-row justify-end"> 
  <button className=" bg-dblue text-white flex flex-row justify-center py-1 px-3 gap-2"><FaShare className=" h-fit my-auto"/> <p className=" block whitespace-nowrap">Share  {selectProduct.length}</p> </button>
  
  </div>
  </div>
  
  </div>
    </div>
   </div>
  )
}

export default ShareCart
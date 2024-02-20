import { axiosServer } from '@/axiosServer';
import PointsLoader from '@/components/PointsLoader';
import { sanitizeHTML } from '@/components/Utils';
import SingleProduct from '@/components/product/SingleProduct';
import { useMarketingData } from '@/contexts/MarketingContext';
import buildLink from '@/urls';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { BiCategoryAlt } from 'react-icons/bi';
import { FaAngleRight } from 'react-icons/fa';

const AllCategories = () => {
  const router = useRouter();
const[categories,setCategories] = useState([])
const [activeCategory,setActiveCategory]= useState(null);
const [topSelling,setTopSelling] = useState(null);
const[ loading,setLoading] = useState(false)
const [ loadingTopselling,setLoadingTopselling] = useState(false);
const [activeButton,setActiveButton] = useState(1);
const { setMarketingData } = useMarketingData();




const getCategoryLatest = (category_id) => {
  setActiveButton(2)
  setLoadingTopselling(true);
  axiosServer
    .get(
      buildLink("dynamicproducts", undefined, undefined) +
        "latest&nourtest&category_id=" +
        category_id
    )
    .then((response) => {
      // console.log(response);
      if (response.data.success) {
        setTopSelling(response.data.data.products);
      }
      setLoadingTopselling(false);
    });
};



function getTopSelling(category_id) {
  setActiveButton(1)
setLoadingTopselling(true)
  axiosServer
    .get(
      buildLink("getAllTopSellingbyCategoryid", undefined, window.innerWidth) +
        "&category_id=" +
        category_id + "&limit=20"
    )
    .then((response) => {
      setLoadingTopselling(false)
      if (response.data.success) {
        setTopSelling(response.data.data.products);
      }
    
    });
}
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setLoading(true)
      axiosServer
        .get(
          buildLink(
            "all_categories",
            undefined,
            undefined,
            window.location.host
          )
        )
        .then((response) => {
          setLoading(false)
          setCategories(response.data.data);
          setActiveCategory(response.data.data[0])
          getTopSelling(response.data.data[0].category_id)
        });
    }
  }, []);




  return ( 
    loading?<PointsLoader/>:
    <div className='w-full  relative '>
      <div className=' flex flex-row gap-1'>
        {categories && <div className=' w-[10rem] pb-10 overflow-x-hidden text-center   bg-dplaceHolder  max-h-screen overflow-y-auto relative  flex flex-col '>
    
      { categories.map((category,index)=>{
      return<button onClick={()=>{
        setActiveCategory(categories[index])
        getTopSelling(category.category_id)
      }}  className={`${category.category_id == activeCategory.category_id && "border-l-4 border-dbase bg-white"}  text-center px-2 py-4 w-full h-full   text-sm text-dblack `}  dangerouslySetInnerHTML={{
        __html: sanitizeHTML(category.name),
      } } ></button>
    })}
    </div>
}

{activeCategory && <div className='max-h-screen pb-10 overflow-x-hidden  overflow-y-auto  w-full'>
  <div className=' flex flex-col gap-5'>
    <div className='flex flex-col gap-3'>
      <div onClick={()=>{
           setMarketingData({
            ignore: false,
            banner_image_id: "",
            source_type: "categories",
            source_type_id: "",
          });
          router.push(
            `${
              activeCategory.name.length > 0
                ? "/" +
                  activeCategory.name
                    .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
                    .replace(/\s+/g, "-") +
                  "/c=" +
                  activeCategory.category_id
                : "cat/c=" + activeCategory.category_id
            }`
          );
      }} className=' flex flex-row justify-between px-2 py-2 shadow-sm  text-dbase'><BiCategoryAlt className=' text-lg'/> <h2>View All </h2> <FaAngleRight className=' text-lg'/></div>
    <h2  dangerouslySetInnerHTML={{
    __html: sanitizeHTML(activeCategory.name),
  } }  className=' px-2 font-extrabold text-sm '></h2>
    <div className='grid grid-cols-3 gap-[0.20rem]'>
{  activeCategory.categories.map((category)=>(

  <div onClick={()=>{
    setMarketingData({
      ignore: false,
      banner_image_id: "",
      source_type: "categories",
      source_type_id: "",
    });
    router.push(
      `${category.name.length > 0
          ? "/" +
            category.name
              .replace(/\s+&amp;\s+|\s+&gt;\s+/g, "-")
              .replace(/\s+/g, "-") +
            "/c=" +
            category.category_id
          : "cat/c=" + category.category_id
      }`
    );
  }} className='  h-fit   w-26 relative    flex flex-col text-center justify-start '>
    <div className=' h-full p-3 w-full'>
    <img className='' src={category.image}></img>
    </div>
  <div className=' text-sm  text-dblack'   dangerouslySetInnerHTML={{
    __html: sanitizeHTML(category.name),
  } } >

    </div>
    </div>
  


))}
</div>
</div>


<div className=' flex flex-col gap-3'>
  <div className=' flex flex-row justify-start gap-5 '> 
  <button onClick={()=>getTopSelling(activeCategory.category_id)} className={`${activeButton==1 ?"border-dbase text-dbase ":"border-dlabelColor text-dlabelColor"}  w-full rounded-md  border  py-1  transition-all `} > Top Selling</button>
  <button onClick={()=>getCategoryLatest(activeCategory.category_id)}  className={` ${activeButton==2 ?"border-dbase text-dbase ":"border-dlabelColor text-dlabelColor"} w-full rounded-md py-1 border  transition-none `} >New Products</button>
  </div>
  {loadingTopselling?<PointsLoader/>:
<div className=' relative grid grid-cols-2 gap-3'> 
  {topSelling && topSelling.map((item)=>{
    return <div>
      <SingleProduct item={item} topSelling={true} />
    </div>
  })}
</div>
}
</div>

</div>
    </div>
    
}

    <div>

    </div>
    </div>

    </div>
  )
}

export default AllCategories

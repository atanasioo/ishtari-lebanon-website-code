

function CatalogPlaceholder({style}) {


    return (

       <>
        <div className={`${style} container pt-2 mb-12 hidden mobile:block`} style={{ backgroundColor: "#f7f7fa" }}>
            <div className="placeholder_animation h-8 w-2/12 bg-white mt-4 mb-6"></div>
            <div className="flex">
                {/* Left */}
                <div className=" w-2/12">
                    <div className="h-8 mb-4 flex justify-between">
                        <div className="placeholder_animation w-8 h-8 bg-white"></div>
                        <div className="placeholder_animation ml-2 flex-grow h-8 bg-white"></div>
                    </div>
                    <div className="h-8 mb-4 flex justify-between">
                        <div className="placeholder_animation w-8 h-8 bg-white"></div>
                        <div className="placeholder_animation ml-2 flex-grow h-8 bg-white"></div>
                    </div><div className="h-8 mb-4 flex justify-between">
                        <div className="placeholder_animation w-8 h-8 bg-white"></div>
                        <div className="placeholder_animation ml-2 flex-grow h-8 bg-white"></div>
                    </div><div className="h-8 mb-4 flex justify-between">
                        <div className="placeholder_animation w-8 h-8 bg-white"></div>
                        <div className="placeholder_animation ml-2 flex-grow h-8 bg-white"></div>
                    </div><div className="h-8 mb-4 flex justify-between">
                        <div className="placeholder_animation w-8 h-8 bg-white"></div>
                        <div className="placeholder_animation ml-2 flex-grow h-8 bg-white"></div>
                    </div><div className="h-8 mb-4 flex justify-between">
                        <div className="placeholder_animation w-8 h-8 bg-white"></div>
                        <div className="placeholder_animation ml-2 flex-grow h-8 bg-white"></div>
                    </div><div className="h-8 mb-4 flex justify-between">
                        <div className="placeholder_animation w-8 h-8 bg-white"></div>
                        <div className="placeholder_animation ml-2 flex-grow h-8 bg-white"></div>
                    </div>

                    <div className="h-10"></div>
                    <div className="h-8 mb-4 flex justify-between">
                        <div className="placeholder_animation w-8 h-8 bg-white"></div>
                        <div className="placeholder_animation ml-2 flex-grow h-8 bg-white"></div>
                    </div><div className="h-8 mb-4 flex justify-between">
                        <div className="placeholder_animation w-8 h-8 bg-white"></div>
                        <div className="placeholder_animation ml-2 flex-grow h-8 bg-white"></div>
                    </div><div className="h-8 mb-4 flex justify-between">
                        <div className="placeholder_animation w-8 h-8 bg-white"></div>
                        <div className="placeholder_animation ml-2 flex-grow h-8 bg-white"></div>
                    </div><div className="h-8 mb-4 flex justify-between">
                        <div className="placeholder_animation w-8 h-8 bg-white"></div>
                        <div className="placeholder_animation ml-2 flex-grow h-8 bg-white"></div>
                    </div><div className="h-8 mb-4 flex justify-between">
                        <div className="placeholder_animation w-8 h-8 bg-white"></div>
                        <div className="placeholder_animation ml-2 flex-grow h-8 bg-white"></div>
                    </div><div className="h-8 mb-4 flex justify-between">
                        <div className="placeholder_animation w-8 h-8 bg-white"></div>
                        <div className="placeholder_animation ml-2 flex-grow h-8 bg-white"></div>
                    </div><div className="h-8 mb-4 flex justify-between">
                        <div className="placeholder_animation w-8 h-8 bg-white"></div>
                        <div className="placeholder_animation ml-2 flex-grow h-8 bg-white"></div>
                    </div>
                </div>
                <div className="w-10/12">
                    {/* Options */}
                    <div className=" h-12 flex justify-between mx-5">
                        <div className="placeholder_animation ml-2 bg-white h-full w-full "></div>
                        {/* <div className="flex h-full justify-between w-9/12">
                            <div className="placeholder_animation ml-2 bg-white h-full w-2/12"></div>
                            <div className="placeholder_animation ml-2 bg-white h-full w-4/12"></div>
                            <div className="placeholder_animation ml-2 bg-white h-full w-4/12 mx-2"></div>
                            <div className="placeholder_animation ml-2 bg-white h-full w-2/12"></div>
                        </div> */}
                    </div>
                    {/* Categories */}
                    <div className="placeholder_animation h-36 bg-white  my-4 mx-5" ></div>

                    <div className="grid grid-cols-5 gap-5 px-5">
                        <div className="placeholder_animation h-96 bg-white"></div>
                        <div className="placeholder_animation h-96 bg-white"></div>
                        <div className="placeholder_animation h-96 bg-white"></div>
                        <div className="placeholder_animation h-96 bg-white"></div>
                        <div className="placeholder_animation h-96 bg-white"></div>
                        <div className="placeholder_animation h-96 bg-white"></div>
                        <div className="placeholder_animation h-96 bg-white"></div>
                        <div className="placeholder_animation h-96 bg-white"></div>
                        <div className="placeholder_animation h-96 bg-white"></div>
                        <div className="placeholder_animation h-96 bg-white"></div>
                        <div className="placeholder_animation h-96 bg-white"></div>
                        <div className="placeholder_animation h-96 bg-white"></div>
                        <div className="placeholder_animation h-96 bg-white"></div>
                        <div className="placeholder_animation h-96 bg-white"></div>
                        <div className="placeholder_animation h-96 bg-white"></div>
                        <div className="placeholder_animation h-96 bg-white"></div>
                        <div className="placeholder_animation h-96 bg-white"></div>
                        <div className="placeholder_animation h-96 bg-white"></div>
                        <div className="placeholder_animation h-96 bg-white"></div>
                        <div className="placeholder_animation h-96 bg-white"></div>
                    </div>

                </div>
            </div>
        </div>
        
        <div className="animate-pulse container mb-12 mobile:hidden" style={{ backgroundColor: "#f7f7fa" }}>
            <div className="placeholder_animation h-8 w-1/2 bg-white mt-4 mb-6"></div>
            <div className="placeholder_animation h-8 w-full bg-white mt-4 mb-6"></div>
            <div className="flex">
                {/* Left */}
                <div className="w-full">
                    {/* Options */}
                    {/* <div className=" h-9 flex justify-between mb-3">
                        <div className="bg-white placeholder_animation h-full w-1/6"></div>
                        <div className="flex h-full justify-between w-9/12">
                            <div className="bg-white placeholder_animation h-full w-1/6"></div>
                            <div className="bg-white placeholder_animation h-full w-1/6"></div>
                            <div className="bg-white placeholder_animation h-full w-1/6 "></div>
                            <div className="bg-white placeholder_animation h-full w-1/6"></div>
                        </div>
                    </div> */}
                    {/* Categories */}
                    {/* <div className="placeholder_animation h-36 bg-white my-4"></div> */}

                    <div className="grid grid-cols-2 gap-3">
                        <div className="placeholder_animation h-72 bg-white"></div>
                        <div className="placeholder_animation h-72 bg-white"></div>
                        <div className="placeholder_animation h-72 bg-white"></div>
                        <div className="placeholder_animation h-72 bg-white"></div>
                        <div className="placeholder_animation h-72 bg-white"></div>
                        <div className="placeholder_animation h-72 bg-white"></div>
                        <div className="placeholder_animation h-72 bg-white"></div>
                        <div className="placeholder_animation h-72 bg-white"></div>
                        <div className="placeholder_animation h-72 bg-white"></div>
                        <div className="placeholder_animation h-72 bg-white"></div>
                        <div className="placeholder_animation h-72 bg-white"></div>
                        <div className="placeholder_animation h-72 bg-white"></div>
                        <div className="placeholder_animation h-72 bg-white"></div>
                        <div className="placeholder_animation h-72 bg-white"></div>
                        <div className="placeholder_animation h-72 bg-white"></div>
                        <div className="placeholder_animation h-72 bg-white"></div>
                        <div className="placeholder_animation h-72 bg-white"></div>
                        <div className="placeholder_animation h-72 bg-white"></div>
                        <div className="placeholder_animation h-72 bg-white"></div>
                        <div className="placeholder_animation h-72 bg-white"></div>
                    </div>
                </div>
            </div>
        </div>

    </>


    
    )
}
export default CatalogPlaceholder
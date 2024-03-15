import React, { useEffect, useRef, useState } from 'react'
import { FaPause, FaPlay, FaReply, FaUndo } from 'react-icons/fa';

const ProductVideo = ({video}) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [isEnded ,setIsEnded] = useState(false);
    const videoRef = useRef(null);
    const [isPlaying,setisPlaying] = useState(false);
    const [showControls,setShowControls] = useState(false);

    const handleSeek =(e)=>{
        // e.preventDefault()
        const seekTo = e.target.value;
        videoRef.current.currentTime = seekTo;
        setCurrentTime(e.target.value)
    }
    
//   useEffect(() => {
//     const videoElement = videoRef.current;

//     // const updateTime = () => {
//     //   setCurrentTime(videoElement.currentTime);
//     // };

//     // videoElement.addEventListener('timeupdate', updateTime);

//     // return () => {
//     //   videoElement.removeEventListener('timeupdate', updateTime);
//     // };
//   }, [videoRef]);


// useEffect(()=>[
// if(videoRef.current)
// ],[videoRef])
useEffect(() => {
    let intervalId;

    if (isPlaying) {
      const videoElement = videoRef.current;

      intervalId = setInterval(() => {
        setCurrentTime(videoElement.currentTime);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isPlaying]);

useEffect(()=>{
if(currentTime == videoRef.current.duration){
    setisPlaying(false)
    setIsEnded(true)
}else{
    setIsEnded(false)

}
},[currentTime])

    function toggleControls(){

        setShowControls(!showControls)
      }
      function startVideo(){
        setIsEnded(false)
        setShowControls(false);
        videoRef.current.play();
        setisPlaying(true)
    
      }
    
      function pauseVideo(){
        setShowControls(true);
        videoRef.current.pause();
        setisPlaying(false)
      }
    
    function togglePlay(){
     if(isPlaying){
      pauseVideo()
     }else{
      startVideo()
     }
    }

  return (
    <div className="h-full flex overflow-hidden   justify-center text-center relative bg-dblack">
                    <video
                    className=" w-full h-full"
                    ref={videoRef}
                      src={video.thumb}
                      type="video/mp4"
                      style={{ height: "480px" }}
                      onPlay={()=>setisPlaying(true)}
                    >
                      Your browser does not support the video tag.
                    </video>
                   <div onClick={()=>toggleControls()} className={`${!isPlaying ?"bg-opacity-60 ":" bg-opacity-0 hover:bg-opacity-60 "} group absolute w-full h-full flex justify-center bg-dblackk text-center left-0 bottom-0 top-0 right-0 transition-all duration-300 `}>
                    {isEnded?<div onClick={()=>startVideo()} className={`${isPlaying?"md:group-hover:opacity-100 opacity-0 scale-x-125 transition-all group-hover:scale-100 ":""} my-auto w-20 h-20 rounded-full bg-dblue text-white flex justify-center text-center `}>{<FaUndo  className=" text-xl my-auto"/>}</div>
                   :<div onClick={()=>togglePlay()} className={`${isPlaying ?"md:group-hover:opacity-100 opacity-0 scale-x-125 transition-all group-hover:scale-100 ":""} my-auto w-20 h-20 rounded-full bg-dblue text-white flex justify-center text-center `}>{ !isPlaying ? <FaPlay className=" text-xl my-auto"/>:<FaPause className=" text-xl my-auto"/>}</div>}
                    
                    <div className="w-full flex justify-center text-center h-10 bottom-0 absolute">
                      <div className=" relative flex w-full gap-1 px-2 mx-auto">
                    <input className={`${isPlaying?"group-hover:opacity-100 opacity-0  translate-y-10 transition-all group-hover:translate-y-0":""}  cursor-pointer  outline-none w-full`} min={0} onChange={(e)=>handleSeek(e)}   max={videoRef.current ? videoRef.current.duration : 0}
              value={currentTime}color="red" type="range"/>
                    </div>
                    </div>
                    </div>
                  </div>
  )
}

export default ProductVideo
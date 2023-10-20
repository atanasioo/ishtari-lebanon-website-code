import { useEffect, useState } from "react";

function TimerSingleProduct({ data, bannerEvent }) {
  const date = data;

  const calculateTimeLeft = () => {
    const day = date?.slice(8, 10);
    const month = date?.slice(5, 7);
    const year = date?.slice(0, 4);
    let timer = {};

    const difference = new Date(`${month}/${day}/${year}`) - +new Date();
    if (difference > 0) {
      timer = {
        // DAYS: Math.floor(difference / (1000 * 60 * 60 * 24)),
        HOURS: Math.floor((difference / (1000 * 60 * 60)) ) < 10 ? "0"+ Math.floor((difference / (1000 * 60 * 60)) ) + ":"  : Math.floor((difference / (1000 * 60 * 60)) ) + ":",
        MIN:  Math.floor((difference / 1000 / 60) % 60) < 10 ?   "0" +  Math.floor((difference / 1000 / 60) % 60)  +":"  :  Math.floor((difference / 1000 / 60) % 60)  +":",
        SEC: Math.floor((difference / 1000) % 60) < 10  ? "0"  + Math.floor((difference / 1000) % 60)  :  Math.floor((difference / 1000) % 60) 
      };
    }
    return timer;
  };

  const [timeLeft, setTimeLeft] = useState([]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [date, timeLeft]); // Include timeLeft as a dependency

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <div
        className="items-center space-y-2 text-center justify-center "
        key={Math.random()}
      >
        {interval === "DAYS" ? (
          <div className={` flex ${bannerEvent ? "" : " text-d22  pr-semibold rounded-full text-dblackOverlay3"} `}>
            {timeLeft[interval]} 
          </div>
        ) : (
          <div className={`flex ${bannerEvent ? "" : "text-d22 w-auto pr-semibold text-dblackOverlay3"} `}>
            {timeLeft[interval]} 
          </div>
        )}
        
        {/* <div className="text-md font-bold "> {interval} </div> */}
      </div>
    );
  });

  return timerComponents.length ? (
    <div>
    
      <div className="flex space-x-1">
        {timerComponents.length ? timerComponents : <span></span>}
      </div>
    </div>
  ) : (
    <span></span>
  );
}

export default TimerSingleProduct;

import { useEffect, useState } from "react";

function Timer({ date }) {
  const calculateTimeLeft = () => {
    const day = date?.slice(8, 10);
    const month = date?.slice(5, 7);
    const year = date?.slice(0, 4);
    let timer = {};

    const difference = +new Date(`${month}/${day}/${year}`) - +new Date();
    if (difference > 0) {
      timer = {
        DAYS: Math.floor(difference / (1000 * 60 * 60 * 24)),
        HOURS: Math.floor((difference / (1000 * 60 * 60)) % 24),
        MIN: Math.floor((difference / 1000 / 60) % 60),
        SEC: Math.floor((difference / 1000) % 60),
      };
    }
    return timer;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <div className="items-center space-y-2 text-center justify-center" key={Math.random()}>
        {interval === "DAYS" ? (
          <div className="text-4xl w-14 font-impact bg-dbluedark  px-4 rounded-full text-white">
            {timeLeft[interval]}
          </div>
        ) : (
          <div className="text-4xl w-14 font-impact bg-dbase  px-2 rounded-full text-white">
            {timeLeft[interval]}
          </div>
        )}
        <div className="text-md font-bold "> {interval} </div>
      </div>
    );
  });

  return timerComponents.length ? (
    <div>
      <div className="py-4 font-impact text-2xl">
        {timerComponents.length ? "SALES END IN :" : ""}
      </div>
      <div className="flex space-x-4">
        {timerComponents.length ? timerComponents : <span></span>}
      </div>
    </div>
  ) : (
    <span></span>
  );
}

export default Timer;

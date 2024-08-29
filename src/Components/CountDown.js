import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import "../App.css";

const secondsToHHMMSS = (seconds) => {
  if (seconds < 3600)
    return new Date(seconds * 1000).toISOString().substr(14, 5);

  return new Date(seconds * 1000).toISOString().substr(11, 8);
};

const Countdown = forwardRef((props, ref) => {
  const timerRef = useRef();
  const [currentTime, setCurrentTime] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    handleStart() {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setCurrentTime(300); // Reset to 5 minutes
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => prev - 1);
      }, 1000);
    }
  }));

  useEffect(() => {
    if (currentTime === 0) {
      clearInterval(timerRef.current);
      if (props.onComplete) {
        props.onComplete(); 
      }
    }
  }, [currentTime]);

  return (
    <div className="countDown">
      <div className="time">{secondsToHHMMSS(currentTime)}</div>
    </div>
  );
});

export default Countdown;

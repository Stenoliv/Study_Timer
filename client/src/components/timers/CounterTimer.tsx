import { useEffect, useRef, useState } from "react";
import Settings from "../settings/Settings";

export default function CounterTimer({ timerType, setTimerType }) {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [addTime, setAddTime] = useState<number>(5);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (!isRunning && time > 0) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime > 1) {
            return prevTime - 1;
          } else {
            if (!intervalRef.current) {
              return 0;
            }
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsRunning(false);
            return 0;
          }
        });
      }, 1000);
    }
  };

  const pauseTimer = () => {
    if (isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };

  const emptyTimer = () => {
    setTime(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const format = (value: number): string =>
      value < 10 ? `0${value}` : value.toString();
    return `${format(hours)}:${format(minutes)}:${format(seconds)}`;
  };

  const addTimeToTimer = () => {
    setTime((prevTime) => prevTime + addTime);
  };

  const removeTimeFromTimer = () => {
    setTime((prevTime) => Math.max(0, prevTime - addTime));
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex grow justify-center items-center flex-col z-0">
      <div className="border-white border-4 rounded-xl p-10 bg-slate-800 text-center">
        <Settings
          addTime={addTime}
          onSetAddTime={setAddTime}
          setTime={setTime}
          timerType={timerType}
          setTimerType={setTimerType}
        />
        <h1 className="text-white text-6xl mb-4">Counter Timer</h1>
        <div className="flex flex-row justify-between">
          <div className="relative group">
            <button
              className="text-6xl text-slate-950"
              onClick={removeTimeFromTimer}
            >
              🠋
            </button>
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 hidden group-hover:block bg-gray-800 text-white text-lg py-1 px-2 rounded">
              -{addTime}s
            </div>
          </div>

          <p className="text-white text-5xl text-center">{formatTime(time)}</p>
          <div className="relative group">
            <button
              className="text-6xl text-slate-950 z-0"
              onClick={addTimeToTimer}
            >
              🠉
            </button>
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 hidden group-hover:block bg-gray-800 text-white text-lg py-1 px-2 rounded">
              +{addTime}s
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <button
            onClick={startTimer}
            className="text-white text-xl text-center border-white bg-blue-500 hover:bg-blue-700 p-2 px-4 rounded border-2 mr-16"
          >
            Start
          </button>
          <button
            onClick={pauseTimer}
            className="text-white text-xl text-center border-white bg-blue-500 hover:bg-blue-700 p-2 px-4 rounded border-2 mr-16"
          >
            Pause
          </button>
          <button
            onClick={emptyTimer}
            className="text-white text-xl text-center border-white bg-blue-500 hover:bg-blue-700 p-2 px-4 rounded border-2"
          >
            Empty
          </button>
        </div>
        <div className="">
          <p className="text-white mt-20">
            Adjust the amount of time added by arrows in settings!
          </p>
        </div>
      </div>
    </div>
  );
}

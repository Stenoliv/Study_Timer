import { useRef, useState } from "react";
export default function Home() {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (isRunning && intervalRef.current) {
      localStorage.setItem("Time_Studied", JSON.stringify(time));
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
      setTime(0);
    }
  };
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const format = (value: number) => (value < 10 ? `0${value}` : value);

    return `${format(hours)}:${format(minutes)}:${format(seconds)}`;
  };
  const getFromLocalStorage = (locals: string): string => {
    if (localStorage.getItem(locals) != null) {
      const last_session = localStorage.getItem(locals);
      const session_time = Number(last_session);
      const last_ = formatTime(session_time);
      return `${last_}`;
    } else return `No session found`;
  };

  return (
    <div className="flex grow justify-center items-center flex-col">
      <div className="border-white border-4 rounded-xl p-10 bg-slate-800 ">
        <h1 className="text-white text-6xl mb-4 underline">Study Timer</h1>
        <p className="text-white text-xl text-center mb-2">
          last session {getFromLocalStorage("Time_Studied")}
        </p>
        <p className="text-white text-5xl text-center ">{formatTime(time)}</p>
        <div className="text-center mt-8">
          <button
            onClick={startTimer}
            className="text-white text-center border-white bg-blue-500 hover:bg-blue-700 p-2 rounded border-2 mr-16"
          >
            Start
          </button>
          <button
            onClick={stopTimer}
            className="text-white text-center border-white bg-blue-500 hover:bg-blue-700 p-2 rounded border-2"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}

import { API } from "@/utils/api";
import { useRef, useState } from "react";
export default function Home() {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const sessionNameMaker = () => {
    const date = new Date();

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const formattedString = `Session of ${day}.${month}.${year} at ${hours}.${minutes}`;
    return formattedString;
  };
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
  };

  const stopTimer = async () => {
    if (isRunning && intervalRef.current) {
      const sessionName = sessionNameMaker();
      const response = await API.post("/sessions", {
        name: sessionName,
        time: time,
      });
      if (!response) {
        console.log("error saving to database");
        return;
      }
      try {
        localStorage.setItem(
          "Session_id",
          JSON.stringify(response.data.session.id)
        );
      } catch {
        console.log("Something went wrong");
      }
      localStorage.setItem("Session_Time", JSON.stringify(time));
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
      setTime(0);
    }
  };
  const pauseTimer = () => {
    if (isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };
  const continuePreviousSession = async () => {
    const id = localStorage.getItem("Session_id");
    const prevSession = await API.get(`/sessions/${id}`);
    const sessionTime = Number(prevSession.data.time);
    setTime(sessionTime);
  };
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const format = (value: number) => (value < 10 ? `0${value}` : value);

    return `${format(hours)}:${format(minutes)}:${format(seconds)}`;
  };

  const getSession = async (locals: string) => {
    try {
      const session = await API.get(`/sessions`);
      return session.data.session.time;
    } catch {
      if (localStorage.getItem(locals) != null) {
        const last_session = localStorage.getItem(locals);
        const session_time = Number(last_session);
        const last_ = formatTime(session_time);
        return `${last_}`;
      } else {
        return `No session found locally`;
      }
    }
  };
  const previousSession = (local: string): string => {
    const sessionTime = getSession(local);
    if (!sessionTime) {
      return "error getting session";
    } else {
      const gottenTime = sessionTime.finally.toString();
      return gottenTime;
    }
  };

  return (
    <div className="flex grow justify-center items-center flex-col">
      <div className="border-white border-4 rounded-xl p-10 bg-slate-800 text-center">
        <h1 className="text-white text-6xl mb-4 underline">Study Timer</h1>
        <p className="text-white text-xl text-center mb-2">
          last session {previousSession("Session_Time")}
        </p>
        <p className="text-white text-5xl text-center ">{formatTime(time)}</p>
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
            onClick={stopTimer}
            className="text-white text-xl text-center border-white bg-blue-500 hover:bg-blue-700 p-2 px-4 rounded border-2"
          >
            Stop
          </button>
        </div>
        <button
          className="text-white text-center border-white bg-blue-500 hover:bg-blue-700 p-2 rounded border-2 mt-8 "
          onClick={continuePreviousSession}
        >
          Continue previous session
        </button>
      </div>
    </div>
  );
}

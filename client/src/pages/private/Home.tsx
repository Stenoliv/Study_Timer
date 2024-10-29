import { useState } from "react";
import ClassicTimer from "@/components/timers/ClassicTimer";
import CounterTimer from "@/components/timers/CounterTimer";

export default function Home() {
  const [timerType, setTimerType] = useState("classic");

  return (
    <div className="flex grow justify-center items-center flex-col z-0">
      <div>
        {timerType === "classic" && (
          <ClassicTimer timerType={timerType} setTimerType={setTimerType} />
        )}
        {timerType === "counter" && (
          <CounterTimer timerType={timerType} setTimerType={setTimerType} />
        )}
      </div>
    </div>
  );
}

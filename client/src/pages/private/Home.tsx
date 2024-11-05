import { useState } from "react";
import ClassicTimer from "@/components/timers/ClassicTimer";
import CounterTimer from "@/components/timers/CounterTimer";

export default function TimerPage() {
	const [timerType, setTimerType] = useState("classic");

	return (
		<div className="flex grow justify-center items-center flex-col z-0">
			<div className="flex flex-col gap-5">
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

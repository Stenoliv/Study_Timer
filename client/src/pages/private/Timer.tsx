import { useState } from "react";
import ClassicTimer from "@/components/timers/ClassicTimer";
import CounterTimer from "@/components/timers/CounterTimer";
import { NavLink } from "react-router-dom";

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
				<NavLink
					className="flex bg-slate-800 w-full p-4 justify-center border-white border-4 rounded-lg"
					to={"/"}
				>
					<span className="text-white text-lg">View Leaderboard</span>
				</NavLink>
			</div>
		</div>
	);
}

import { toast } from "@/contexts/ToastManager";
import { useSessionStore } from "@/stores/session";
import { Session } from "@/types/session";
import { API } from "@/utils/api";
import Settings from "@/components/settings/Settings";
import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

export default function ClassicTimer({ timerType, setTimerType }) {
	const [time, setTime] = useState<number>(0);
	const [oldSession, setOldSession] = useState<boolean>(false);
	const [isRunning, setIsRunning] = useState<boolean>(false);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const { setLastSession } = useSessionStore();
	const queryClient = useQueryClient();
	const [addTime, setAddTime] = useState<number>(5);

	const { isLoading, isError, isSuccess, data } = useQuery<
		Session | null,
		Error,
		Session | null,
		QueryKey
	>({
		queryKey: ["last_session"],
		queryFn: () => loadLastSession(setLastSession),
		refetchOnWindowFocus: "always",
		refetchOnMount: true,
		retry: true,
	});

	const sessionNameMaker = () => {
		const date = new Date();
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");
		return `Session of ${day}.${month}.${year} at ${hours}.${minutes}`;
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
			clearInterval(intervalRef.current);
			intervalRef.current = null;
			setIsRunning(false);
			try {
				if (oldSession && data && data.id) {
					await API.patch(`/sessions/${data.id}`, { time });
					toast.success("Previous session updated successfully!");
				} else {
					const sessionName = sessionNameMaker();
					const response = await API.post("/sessions", {
						name: sessionName,
						time,
					});
					setLastSession(response.data.session);
					toast.success("New session saved successfully!");
				}
				setTime(0);
				setOldSession(false);
				queryClient.invalidateQueries({ queryKey: ["last_session"] });
			} catch (error) {
				console.error("Something went wrong: ", error);
				toast.error("Failed to save session");
			}
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
		if (!data || !data.time) {
			toast.error("No previous session found");
			return;
		}
		setOldSession(true);
		setTime(data.time);
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
				<h1 className="text-white text-6xl mb-4">Classic Timer</h1>
				<p className="text-white text-xl text-center mb-2" id="previousSession">
					last session{" "}
					{isError
						? "Failed to get last session!"
						: isLoading
						? "Loading last session..."
						: isSuccess && data && data.time !== undefined
						? formatTime(data.time)
						: "No last session found"}
				</p>
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

const loadLastSession = async (setLastSession: (session: Session) => void) => {
	try {
		const response = await API.get(`/sessions/last`);
		console.log(response.data.session);
		setLastSession(response.data.session);
		return response.data.session;
	} catch (error: any) {
		console.error(error);
		toast.error("Failed to retrieve lastSession", 1000);
		return null;
	}
};

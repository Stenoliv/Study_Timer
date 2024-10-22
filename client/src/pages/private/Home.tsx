import { toast } from "@/contexts/ToastManager";
import { useSessionStore } from "@/stores/session";
import { Session } from "@/types/session";
import { API } from "@/utils/api";
import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
export default function Home() {
	const [time, setTime] = useState<number>(0);
	const [isRunning, setIsRunning] = useState<boolean>(false);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const { setLastSession } = useSessionStore();
	const queryClient = useQueryClient();

	const { isLoading, isError, isSuccess, data } = useQuery<
		Session,
		Error,
		Session,
		QueryKey
	>({
		queryKey: ["last_session"],
		queryFn: () => loadLastSession(setLastSession),
		refetchOnMount: true,
		refetchOnWindowFocus: true,
		retry: true,
	});

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
			API.post("/sessions", {
				name: sessionName,
				time: time,
			})
				.then((response) => {
					setLastSession(response.data.session);
					queryClient.invalidateQueries({ queryKey: ["last_session"] });
				})
				.catch((error) => {
					console.log("Something went wrong: " + error);
					toast.error("Failed to save session");
				});
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
		if (!data) return;
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

	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	return (
		<div className="flex grow justify-center items-center flex-col">
			<div className="border-white border-4 rounded-xl p-10 bg-slate-800 text-center">
				<h1 className="text-white text-6xl mb-4 underline">Study Timer</h1>
				<p className="text-white text-xl text-center mb-2" id="previousSession">
					last session{" "}
					{isError
						? "Failed to get last session!"
						: isLoading
						? "Loading last session..."
						: isSuccess
						? formatTime(data?.time || 0)
						: "No last session found"}
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

const loadLastSession = async (setLastSession: (session: Session) => void) => {
	try {
		const response = await API.get(`/sessions/last`);
		console.log(response.data.session);
		setLastSession(response.data.session);
		return response.data.session;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error: any) {
		toast.error("Failed to retrive lastSession", 1000);
		return null;
	}
};

import { toast } from "@/contexts/ToastManager";
import { API } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import LeaderboardItem from "./item";

export default function Leaderboard() {
	const [page, setPage] = useState<number>(1);

	const { isLoading, isError, error, data } = useQuery({
		queryKey: ["leaderboard", page],
		queryFn: () => loadLeaderboard(page),
	});

	const previousPage = () => {
		setPage((prev) => (prev <= 1 ? 1 : prev - 1));
	};

	const nextPage = () => {
		setPage((prev) => prev + 1);
	};

	return (
		<div className="flex flex-col m-auto bg-slate-800 border-white border-4 rounded-lg gap-2 p-4">
			<div className="flex flex-col">
				{isLoading && <div className="">Loading leaderboard</div>}
				{isError && <div>Error occured {error.message}</div>}
				{!isLoading && !isError && Array.isArray(data) && data.length > 0 ? (
					<>
						{data.map((i, idx) => (
							<LeaderboardItem
								key={idx}
								user={i.user}
								position={idx + 1}
								time={i.totalTime}
							/>
						))}
					</>
				) : (
					<div className="text-white text-xl font-semibold">
						No entries on this page!
					</div>
				)}
			</div>
			<div className="flex justify-between items-center gap-8">
				<button
					onClick={previousPage}
					className="bg-blue-500 p-1 rounded-md w-20"
				>
					Previous
				</button>
				<span className="text-white text-lg font-semibold">Page: {page}</span>
				<button onClick={nextPage} className="bg-blue-500 p-1 rounded-md w-20">
					Next
				</button>
			</div>
		</div>
	);
}

const loadLeaderboard = async (page: number) => {
	try {
		const response = await API.get(`/leaderboard?page=${page}`);
		return response.data.leaderboard;
	} catch (error) {
		console.error(error);
		toast.error("Failed to load leaderboard");
	}
};

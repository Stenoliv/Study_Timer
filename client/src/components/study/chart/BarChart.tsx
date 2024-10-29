import { useQuery } from "@tanstack/react-query";
import { toast } from "@/contexts/ToastManager";
import { SessionStats } from "@/types/session";
import { API } from "@/utils/api";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import dayjs from "dayjs";

const formatTime = (seconds) => {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;
	return `${hrs.toString().padStart(2, "0")}.${mins
		.toString()
		.padStart(2, "0")}.${secs.toString().padStart(2, "0")}`;
};

export default function BarChartStats() {
	const { isPending, data, error } = useQuery<SessionStats, Error>({
		queryKey: ["stats"],
		queryFn: () => statsLoader(),
		retry: false,
		retryOnMount: true,
	});

	if (isPending)
		return <div className="text-white">Loading study stats...</div>;

	if (error) return <div>Failed to load stats: {error.message}</div>;

	// Filter sessions from the past 7 days
	const pastSevenDaysSessions =
		data?.sessions.filter((session) => {
			const sessionDate = dayjs(session.createdAt);
			return sessionDate.isAfter(dayjs().subtract(7, "day"));
		}) || [];

	// Map sessions to chart data format
	const chartData = pastSevenDaysSessions.map((session) => ({
		name: dayjs(session.createdAt).format("MM-DD"), // Format as needed
		time: session.time, // Original time in seconds for the bar height
		formattedTime: formatTime(session.time), // Formatted time for display
	}));

	return (
		<div className="flex flex-col">
			<div className="flex flex-col flex-1">
				{chartData.length > 0 ? (
					<ResponsiveContainer width="100%" height={400}>
						<BarChart
							data={chartData}
							margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip formatter={(value) => formatTime(value)} />
							<Legend />
							<Bar
								barSize={30}
								dataKey="time" // Using seconds here for correct bar height
								fill="#8884d8"
								name="Studied time"
							/>
						</BarChart>
					</ResponsiveContainer>
				) : (
					<span className="w-full text-center text-white pt-4 font-bold text-xl">
						No study sessions recorded
					</span>
				)}
			</div>
		</div>
	);
}

// Function to load session stats
const statsLoader = async (): Promise<SessionStats> => {
	try {
		const response = await API.get(`/sessions/stats`);
		return response.data;
	} catch (error: any) {
		toast.error("Failed to load data: " + error?.message);
		throw new Error(error.message); // Throw the error to handle it in the query
	}
};

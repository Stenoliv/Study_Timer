import { useQuery } from "@tanstack/react-query";
import { toast } from "@/contexts/ToastManager";
import { SessionStats } from "@/types/session";
import { API } from "@/utils/api";
import {
	Legend,
	ResponsiveContainer,
	Tooltip,
	PieChart,
	Pie,
	Cell,
} from "recharts";
import dayjs from "dayjs";

const COLORS = [
	"#8884d8",
	"#82ca9d",
	"#ffc658",
	"#ff8042",
	"#0088FE",
	"#FFBB28",
	"#FF8042",
];

const formatTime = (seconds) => {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;
	return `${hrs.toString().padStart(2, "0")}.${mins
		.toString()
		.padStart(2, "0")}.${secs.toString().padStart(2, "0")}`;
};

export default function PieChartStats() {
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

	// Aggregate time per weekday
	const weekdayTotals = pastSevenDaysSessions.reduce((acc, session) => {
		const weekday = dayjs(session.createdAt).format("dddd"); // Get weekday name
		acc[weekday] = (acc[weekday] || 0) + session.time; // Sum time for each weekday
		return acc;
	}, {});

	// Convert aggregated weekday data to pie chart format
	const pieChartData = Object.entries(weekdayTotals).map(([day, total]) => ({
		name: day,
		value: total,
	}));

	return (
		<>
			{/* Pie Chart for total study time per weekday */}
			<div className="flex flex-col">
				<h1 className="text-white text-xl mb-4">
					Total study time per weekday
				</h1>
				{pieChartData.length > 0 ? (
					<ResponsiveContainer width="100%" height={300}>
						<PieChart>
							<Pie
								data={pieChartData}
								dataKey="value"
								nameKey="name"
								cx="50%"
								cy="50%"
								outerRadius={70}
								label={(entry) => `${entry.name}: ${formatTime(entry.value)}`}
							>
								{pieChartData.map((_, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
							<Tooltip formatter={(value) => formatTime(value)} />
							<Legend />
						</PieChart>
					</ResponsiveContainer>
				) : (
					<span className="w-full text-center text-white pt-4 font-bold text-xl">
						No study sessions recorded
					</span>
				)}
			</div>
		</>
	);
}

// Function to load session stats
const statsLoader = async (): Promise<SessionStats> => {
	try {
		const response = await API.get(`/sessions/stats`);
		return response.data;
	} catch (error: any) {
		toast.error("Failed to load data: " + error?.message);
		throw new Error(error.message);
	}
};

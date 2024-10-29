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

  // Generate an array of the past 7 days with default time set to 0
  const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
    const date = dayjs().subtract(i, "day").format("DD-MM");
    return { name: date, time: 0, formattedTime: formatTime(0) };
  }).reverse(); // Reverse to have the oldest day first

  // Aggregate session times by day
  const dailyTotals = pastSevenDaysSessions.reduce((acc, session) => {
    const date = dayjs(session.createdAt).format("DD-MM");
    acc[date] = (acc[date] || 0) + session.time; // Sum up time for each date
    return acc;
  }, {});

  // Map the session data onto the last 7 days array
  const chartData = lastSevenDays.map((day) => {
    const total = dailyTotals[day.name] || 0; // Get total time for the day or 0 if none
    return {
      name: day.name,
      time: total,
      formattedTime: formatTime(total),
    };
  });
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
    <div className="flex flex-col gap-3 my-14 border-t-2 border-white">
      {/* Bar Chart for sessions in the past 7 days */}
      <div className="flex flex-col w-full my-2">
        <h1 className="text-white text-xl my-4">Your studies past 7 days</h1>
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
                dataKey="time"
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

      {/* Pie Chart for total study time per weekday */}
      <div className="flex flex-col w-full my-2">
        <h1 className="text-white text-xl my-4">
          Total study time per weekday
        </h1>
        {pieChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
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
    throw new Error(error.message);
  }
};

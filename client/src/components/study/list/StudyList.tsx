import { useQuery } from "@tanstack/react-query";
import { toast } from "@/contexts/ToastManager";
import { SessionStats } from "@/types/session";
import { API } from "@/utils/api";
import StudyItem from "../item/StudyItem";
import { useState } from "react";

export default function StudyList() {
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const { isPending, data, error } = useQuery<SessionStats, Error>({
    queryKey: ["stats", page],
    queryFn: () => statsLoader(page, setPage, setTotalPage),
    retry: false,
    retryOnMount: true,
  });

  if (isPending) return <div>Loading study stats...</div>;

  if (error) return <div>Failed to load stats: {error.message}</div>;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex py-1 border-b-2 border-gray-400">
        <label className="w-1/2 text-white font-semibold text-xl">
          Todays-minutes:
        </label>
        <p className="w-1/2 text-right text-gray-400 font-semibold text-xl">
          {data?.todaysMinutes}
        </p>
      </div>
      <div className="flex mb-2 py-1 border-b-2 border-gray-400">
        <label className="w-1/2 text-white font-semibold text-xl">
          Total-Hours:
        </label>
        <p className="w-1/2 text-right text-gray-400 font-semibold text-xl">
          {data?.totalHours}
        </p>
      </div>
      <div>
        <div className="flex justify-between items-center">
          <button className="bg-blue-500 px-5 py-1 rounded-xl text-white font-semibold">
            Prev
          </button>
          <h3 className="text-white text-xl font-bold">
            Study sessions page: {page}/{totalPage}
          </h3>
          <button className="bg-blue-500 px-5 py-1 rounded-xl text-white font-semibold">
            Next
          </button>
        </div>
        <div className="flex flex-col w-full">
          {data.sessions &&
          Array.isArray(data.sessions) &&
          data.sessions.length > 0 ? (
            data.sessions.map((session) => <StudyItem session={session} />)
          ) : (
            <span className="w-full text-center text-white pt-4 font-bold text-xl">
              No study sessions recorded
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Function to load session stats
const statsLoader = async (
  page: number,
  setPage: (page: number) => void,
  setTotalPage: (total: number) => void
): Promise<SessionStats> => {
  try {
    const response = await API.get(`/sessions/stats?page=${page}&limit=${5}`);
    setPage(response.data.currentPage);
    setTotalPage(response.data.totalPages);
    return response.data;
  } catch (error: any) {
    toast.error("Failed to load data: " + error?.message);
    throw new Error(error.message); // Throw the error to handle it in the query
  }
};

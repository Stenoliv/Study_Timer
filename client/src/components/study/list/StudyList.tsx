import { useQuery } from "@tanstack/react-query";
import { toast } from "@/contexts/ToastManager";
import { SessionStats } from "@/types/session";
import { API } from "@/utils/api";
import StudyItem from "../item/StudyItem";

export default function StudyList() {
  const { isPending, data, error } = useQuery<SessionStats, Error>({
    queryKey: ["stats"],
    queryFn: statsLoader,
    retry: false,
    retryOnMount: true,
  });

  if (isPending) return <div>Loading study stats...</div>;

  if (error) return <div>Failed to load stats: {error.message}</div>;

  return (
    <div className="flex flex-col">
      <div className="flex py-1">
        <label className="text-white font-semibold text-xl">
          Todays-Hours: {data?.todayHours}
        </label>
        <p></p>
      </div>
      <div className="flex mb-2 py-1">
        <label className="text-white font-semibold text-xl">
          Total-Hours: {data?.totalHours}
        </label>
        <p></p>
      </div>
      <div>
        <h3 className="text-white text-xl font-bold underline">
          Study sessions:
        </h3>
        <div className="flex flex-col w-full">
          {data.sessions &&
            Array.isArray(data.sessions) &&
            data.sessions.map((session) => <StudyItem session={session} />)}
        </div>
      </div>
    </div>
  );
}

const statsLoader = async (): Promise<SessionStats> => {
  return API.get("/health-check").then((resp) => {
    toast.info("Loaded your study stats");
    return resp.data;
  });
};

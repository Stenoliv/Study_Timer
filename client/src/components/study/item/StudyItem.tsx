import { toast } from "@/contexts/ToastManager";
import { Session } from "@/types/session";
import { API } from "@/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

export interface StudyItemProps {
	session: Session;
}

export default function StudyItem(props: StudyItemProps) {
	const { session } = props;

	const queryClient = useQueryClient();

	const hours = Math.floor(session.time / 3600);
	const minutes = Math.floor((session.time % 3600) / 60);
	const seconds = session.time % 60;

	const handleDelete = () => {
		API.delete(`/sessions/${session.id}`)
			.then(() => {
				toast.success("Deleted session!");
				queryClient.invalidateQueries({ queryKey: ["stats"] });
			})
			.catch((error) => {
				console.log(error);
				if (isAxiosError(error))
					toast.error(
						"Failed to delete session: " + error.response?.data.error
					);
			});
	};

	return (
		<div className="flex pt-2 items-center">
			<div className="flex flex-col mr-auto">
				<h3 className="text-white font-semibold">{session.name}</h3>
				<div>
					<label className="text-white">Studied for: </label>
					<span className="text-gray-500">
						{hours} h {minutes} m {seconds} s
					</span>
				</div>
			</div>
			<img
				className="size-8 bg-red-500 rounded-md border-black border-4 cursor-pointer"
				src="/trashcan.svg"
				onClick={handleDelete}
			/>
		</div>
	);
}

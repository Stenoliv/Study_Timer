import { Session } from "@/types/session";

export interface StudyItemProps {
	session: Session;
}

export default function StudyItem(props: StudyItemProps) {
	const { session } = props;

	const hours = Math.floor(session.time / 3600);
	const minutes = Math.floor((session.time % 3600) / 60);
	const seconds = session.time % 60;

	return (
		<div className="flex flex-col pt-2">
			<h3 className="text-white font-semibold">{session.name}</h3>
			<div>
				<label className="text-white">Studied for: </label>
				<span className="text-gray-500">
					{hours} h {minutes} m {seconds} s
				</span>
			</div>
		</div>
	);
}

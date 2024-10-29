import { useAuthStore } from "@/stores/auth";
import { User } from "@/types/user";
import classNames from "classnames";

export interface LeaderboardItemProps {
	position: number;
	user: User;
	time: number;
}

export default function LeaderboardItem(props: LeaderboardItemProps) {
	const { user, position, time } = props;
	const { isUser } = useAuthStore();

	const hours = Math.floor(time / 3600);
	const minutes = Math.floor((time % 3600) / 60);
	const seconds = time % 60;

	const style = classNames({
		"border-white border-b-4": isUser(user),
		"bg-blue-600": isUser(user) && ![3, 2, 1].find((p) => p === position),
		"bg-slate-600":
			position % 2 === 0 &&
			!isUser(user) &&
			![3, 2, 1].find((p) => p === position),
		"bg-slate-700":
			position % 2 !== 0 &&
			!isUser(user) &&
			![3, 2, 1].find((p) => p === position),
		"bg-yellow-400": position === 1,
		"bg-stone-400": position === 2,
		"bg-amber-700": position === 3,
	});

	const positionStyle = classNames({
		"text-yellow-400": position === 1,
		"text-neutral-300": position === 2,
		"text-amber-700": position === 3,
		"text-stone-600": ![3, 2, 1].find((p) => p === position),
	});

	return (
		<div className={`flex px-2 py-1 gap-4 rounded mb-1 items-center  ${style}`}>
			<span
				className={`flex text-xl font-extrabold bg-orange-400 size-8 items-center justify-center rounded-full ${positionStyle}`}
			>
				{position}
			</span>
			<span className="mx-auto text-white font-semibold text-lg">
				{hours} h {minutes} m {seconds} s
			</span>
			<span className="text-stone-200 text-xl font-bold">{user.username}</span>
		</div>
	);
}

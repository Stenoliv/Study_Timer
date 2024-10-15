import { Outlet } from "react-router-dom";
import MainHeader from "@/components/MainHeader";

export default function StudyTimerLayout() {
	return (
		<div className="flex flex-col w-full min-h-screen">
			<MainHeader />
			<Outlet />
		</div>
	);
}

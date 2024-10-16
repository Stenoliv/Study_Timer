import { Outlet } from "react-router-dom";
import MainHeader from "@/components/header/MainHeader";

export default function StudyTimerLayout() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <MainHeader />
      <div className="flex grow justify-center items-center">
        <Outlet />
      </div>
    </div>
  );
}

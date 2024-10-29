import { Outlet } from "react-router-dom";
import ToastManager from "@/contexts/ToastManager";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainHeader from "@/components/header/MainHeader";

export default function DefaultLayout() {
	const queryClient = new QueryClient();

	return (
		<AuthProvider>
			<QueryClientProvider client={queryClient}>
				<div className="flex flex-col bg-primary w-full h-screen overflow-hidden">
					<MainHeader />
					<div className="flex flex-1 overflow-hidden relative">
						<div className="absolute flex flex-col justify-center items-center left-0 top-0 bottom-0 right-0 pointer-events-auto">
							<Outlet />
						</div>
						<ToastManager />
					</div>
				</div>
			</QueryClientProvider>
		</AuthProvider>
	);
}

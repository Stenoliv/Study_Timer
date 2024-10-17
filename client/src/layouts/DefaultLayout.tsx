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
        <div className="flex flex-col bg-primary w-full min-h-screen">
          <MainHeader />
          <div className="relative flex grow">
            <div className="flex grow pointer-events-auto justify-center items-center">
              <Outlet />
            </div>
            <ToastManager />
          </div>
        </div>
      </QueryClientProvider>
    </AuthProvider>
  );
}

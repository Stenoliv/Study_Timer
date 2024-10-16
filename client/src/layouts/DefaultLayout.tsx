import { Outlet } from "react-router-dom";
import ToastManager from "@/contexts/ToastManager";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function DefaultLayout() {
  const queryClient = new QueryClient();

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <div className="flex relative bg-primary min-h-screen justify-center items-center">
          <Outlet />
          <ToastManager />
        </div>
      </QueryClientProvider>
    </AuthProvider>
  );
}

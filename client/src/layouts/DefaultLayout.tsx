import { Outlet } from "react-router-dom";
import ToastManager from "@/contexts/ToastManager";
import { AuthProvider } from "@/contexts/AuthContext";

export default function DefaultLayout() {
  return (
    <AuthProvider>
      <div className="flex bg-primary min-h-screen justify-center items-center">
        <Outlet />
      </div>
      <ToastManager />
    </AuthProvider>
  );
}

import { useAuthStore } from "@/stores/auth";
import { API } from "@/utils/api";
import { createContext, useContext, ReactNode } from "react";
import { toast } from "./ToastManager";
import { useNavigate } from "react-router-dom";

// Define the shape of the authentication context
interface AuthContextType {
  authenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

// Create the context with an initial undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthProvider component
export const AuthProvider = (props: AuthProviderProps) => {
  const { children } = props;
  const { authenticated, setAuhtenticated, setUser, setToken } =
    useAuthStore.getState();
  const navigate = useNavigate();

  const login = (email: string, password: string) => {
    API.post("/auth/signin", { email, password })
      .then((response) => {
        toast.success(`Success! Signed in as ${response.data.user.username}`);
        setAuhtenticated(true);
        setToken(response.data.token);
        setUser(response.data.user);
        navigate("/");
      })
      .catch((error) => {
        console.log("Error login");
        toast.error("Failed to Signin: " + error.message, 2500);
      });
  };

  const logout = () => {
    setAuhtenticated(false);
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

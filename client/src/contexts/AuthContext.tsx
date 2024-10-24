import { useAuthStore } from "@/stores/auth";
import { API } from "@/utils/api";
import { createContext, useContext, ReactNode } from "react";
import { toast } from "./ToastManager";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Define the shape of the authentication context
interface AuthContextType {
	authenticated: boolean;
	login: (email: string, password: string) => void;
	register: (username: string, email: string, password: string) => void;
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
	const { authenticated, setAuhtenticated, setUser, setTokens } =
		useAuthStore();
	const navigate = useNavigate();

	const login = (email: string, password: string) => {
		API.post("/auth/signin", { email, password })
			.then((response) => {
				toast.success(`Success! Signed in as ${response.data.user.username}`);
				setAuhtenticated(true);
				setTokens(response.data.tokens);
				setUser(response.data.user);
				navigate("/");
			})
			.catch((error) => {
				if (axios.isAxiosError(error)) {
					const errorMessage =
						error.response?.data?.error || "An unkown error occured.";
					toast.error("Failed to Signin: " + errorMessage, 2500);
				} else {
					toast.error("Failed to Signin: " + error.message, 2000);
				}
			});
	};

	const register = (username: string, email: string, password: string) => {
		API.post("/auth/signup", {
			username,
			email,
			password,
		})
			.then((response) => {
				console.log(response.data);
				toast.success(
					`Success! Welcome to study timer ${response.data.user.username}`
				);
				setAuhtenticated(true);
				setTokens(response.data.tokens);
				setUser(response.data.user);
				navigate("/");
			})
			.catch((error) => {
				if (axios.isAxiosError(error)) {
					const errorMessage =
						error.response?.data?.error || "An unkown error occured.";
					toast.error("Failed to Signup: " + errorMessage, 2500);
				} else {
					toast.error("Failed to Signup: " + error.message, 2000);
				}
			});
	};

	const logout = () => {
		setAuhtenticated(false);
		setUser(null);
		setTokens({ access: null, refresh: null });
		toast.success("You logged out!");
	};

	return (
		<AuthContext.Provider value={{ authenticated, login, register, logout }}>
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

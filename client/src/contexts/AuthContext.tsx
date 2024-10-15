import { useAuthStore } from "@/stores/auth";
import React, { createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

// Define the shape of the authentication context
interface AuthContextType {
	authenticated: boolean;
	login: () => void;
	logout: () => void;
}

// Create the context with an initial undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

// Create the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const { authenticated, setAuhtenticated } = useAuthStore();
	const navigate = useNavigate();

	const login = () => {
		setAuhtenticated(true);
		navigate("/");
	};
	const logout = () => setAuhtenticated(false);

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

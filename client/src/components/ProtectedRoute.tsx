import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // Adjust the path as necessary

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { authenticated } = useAuth();

	if (!authenticated) {
		// Redirect to signin if not authenticated
		return <Navigate to="/signin" replace />;
	}

	return <>{children}</>; // Render children if authenticated
};

export default ProtectedRoute;

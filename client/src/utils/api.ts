import { toast } from "@/contexts/ToastManager";
import { useAuthStore } from "@/stores/auth";
import { JwtType } from "@/types/tokens";
import axios, { AxiosError } from "axios";

const { tokens } = useAuthStore.getState();

const BASE_URL = "http://localhost:3000";

export const API = axios.create({
	baseURL: BASE_URL,
	headers: {
		Authorization: "Bearer " + tokens?.access,
	},
});

const ErrorResponse = async (error: AxiosError<any>): Promise<any> => {
	const { tokens, setAuhtenticated, setToken } = useAuthStore.getState();
	if (
		tokens?.refresh &&
		error.response?.status == 401 &&
		error.config &&
		!error.config?.headers._retry
	) {
		(error.config.headers as any)._retry = true;
		try {
			const response = await axios.get(`${BASE_URL}/auth/refresh`, {
				headers: { Authorization: `Bearer ${tokens.refresh}` },
			});

			if (response.data.access) {
				setToken(JwtType.Access, response.data.access);

				if (error.config) {
					error.config.headers.Authorization = `Bearer ${response.data.access}`;
					return API.request(error.config);
				}
			}
		} catch (refreshError: any) {
			if (refreshError.response?.status === 401) {
				setAuhtenticated(false);
				toast.error(`Failed Unauthorized please login again!`);
			}
			return Promise.reject(error);
		}
	}
	return Promise.reject(error);
};

API.interceptors.request.use((config) => {
	const { tokens } = useAuthStore.getState();
	config.headers.Authorization = `Bearer ${tokens?.access}`;
	return config;
});

API.interceptors.response.use((response) => {
	return response;
}, ErrorResponse);

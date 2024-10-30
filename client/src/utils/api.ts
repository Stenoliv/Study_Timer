import { useAuthStore } from "@/stores/auth";
import axios from "axios";

const { token } = useAuthStore.getState();

export const API = axios.create({
	baseURL: "/api",
	headers: {
		Authorization: "Bearer " + token,
	},
});

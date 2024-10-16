import { useAuthStore } from "@/stores/auth";
import axios from "axios";

const { token } = useAuthStore.getState();

export const API = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    Authorization: "Bearer " + token,
  },
});

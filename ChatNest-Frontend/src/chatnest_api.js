import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const chatnestApi = axios.create({
  baseURL: import.meta.env.VITE_APP_URL,
});

chatnestApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

export default chatnestApi;

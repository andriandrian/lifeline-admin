import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (axiosConfig: InternalAxiosRequestConfig) => {
    const accessToken = Cookies.get("Authorization");

    if (axiosConfig.headers) {
      if (accessToken) {
        axiosConfig.headers.Authorization = `Bearer ${accessToken}`;
      }
      axiosConfig.headers.Accept = "application/json";
    }
    return axiosConfig;
  }
);

axiosInstance.interceptors.response.use(
  async (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (!originalRequest || originalRequest.url === "/api/v1/refreshToken") {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      try {
        await axiosInstance.get("/api/v1/refreshToken");
        // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        Cookies.remove("token");
        Cookies.remove("name");
        console.error("Refresh token failed:", refreshError);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

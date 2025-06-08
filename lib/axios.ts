import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Function to update content type when needed
const updateContentType = (config: InternalAxiosRequestConfig) => {
  // Don't modify content-type for FormData - let the browser set it with boundary
  if (config.data instanceof FormData) {
    // Remove content-type to let the browser set it with proper boundary
    delete config.headers["Content-Type"];
  }
  return config;
};

axiosInstance.interceptors.request.use(
  async (axiosConfig: InternalAxiosRequestConfig) => {
    const accessToken = Cookies.get("Authorization");

    if (axiosConfig.headers) {
      if (accessToken) {
        axiosConfig.headers.Authorization = `Bearer ${accessToken}`;
      }
      axiosConfig.headers.Accept = "application/json";

      if (axiosConfig.url === "/api/v1/refreshToken") {
        const refreshToken = Cookies.get("RefreshToken");
        if (refreshToken) {
          axiosConfig.headers["Refresh-Token"] = refreshToken;
        }
      }
    }

    // Handle FormData content type properly
    return updateContentType(axiosConfig);
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
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        Cookies.remove("Authorization");
        Cookies.remove("RefreshToken");
        Cookies.remove("name");
        Cookies.remove("userId");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

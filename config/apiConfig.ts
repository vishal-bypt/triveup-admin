import axios from "axios";
import { getAuthToken, removeAuthToken, storeAuthToken } from "../components/utils/authToken";
import { removeAuthUser } from "../components/utils/authUser";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://api.example.com/v1";
// const BASE_URL = "http://localhost:3000/v1";
console.log("BASE_URL", BASE_URL);
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const tokens: any = getAuthToken();
    const accessToken: any = tokens?.access;

    if (accessToken && accessToken?.token) {
      config.headers.Authorization = `Bearer ${accessToken?.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Unauthorized
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      const tokens: any = getAuthToken();
      if (tokens) {
        const refreshToken = tokens?.refresh?.token;
        if (refreshToken) {
          try {
            const refreshResponse = await axios.post(
              `${BASE_URL}/auth/refresh-tokens`,
              {
                refreshToken,
              }
            );

            if (!refreshResponse?.data?.success) {
              handleUnauthorized();
            } else {
              const newTokens = refreshResponse?.data?.data;
              storeAuthToken(newTokens);

              const newAccessToken = newTokens?.access?.token;
              error.config.headers.Authorization = `Bearer ${newAccessToken}`;
              return axiosInstance.request(error.config);
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            handleUnauthorized();
          }
        } else {
          handleUnauthorized();
        }
      } else {
        handleUnauthorized();
      }
    } else if (!error.response) {
      console.error("No response received:", error.message);
      console.log(error.response?.status);
    }
    return Promise.reject(error);
  }
);

const handleUnauthorized = async () => {
  console.warn("Unauthorized! Logging out...");
  removeAuthUser();
  removeAuthToken();
  window.location.href = "/authentication/sign-in";
};

export default axiosInstance;

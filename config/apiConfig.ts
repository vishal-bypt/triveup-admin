import axios from "axios";

const BASE_URL = "https://apidev.triveup.com/v1";
// const BASE_URL = "http://localhost:3000/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor for Handling Validation Errors
// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response, // Return response if successful
  (error) => {
    if (error.response) {
      console.error(`Error: ${error.response.status} - ${error.response.data}`);
    } else if (error.request) {
      console.error("No response received from server.");
    } else {
      console.error("Request error:", error.message);
    }
    return Promise.reject(error); // Ensure the error can still be handled by individual requests
  }
);

axiosInstance.interceptors.request.use(
  // async (config) => {
  //   const token:any = localStorage.getItem('token');
  //   if (token) {
  //     config.headers.Authorization = `Bearer ${token?.access?.token}`;
  //   }
  //   return config;
  // },
  // (error) => {
  //   //console.error("Request error:", error);
  //   return Promise.reject(error);
  // }
);

// Response Interceptor: Handle Unauthorized
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // if (error.response?.status === 401) {
    //   const token:any =  localStorage.getItem('token');;
    //   if (token) {
    //     const refreshToken = token?.refresh?.token;
    //     if (refreshToken) {
    //       try {
    //         const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh-tokens`, {
    //           refreshToken,
    //         });
    //         const newToken = refreshResponse.data.access.token;
    //         localStorage.setItem('token', JSON.stringify(refreshResponse.data));
    //         error.config.headers.Authorization = `Bearer ${newToken}`;
    //         return axiosInstance.request(error.config);
    //       } catch (refreshError) {
    //         console.error("Token refresh failed:", refreshError);
    //         handleUnauthorized();
    //       }
    //     } else {
    //       handleUnauthorized();
    //     }
    //   } else {
    //     handleUnauthorized();
    //   }
    // } else if (!error.response) {
    //   console.error("No response received:", error.message);
    //   console.log(error.response?.status)
    // }
    // return Promise.reject(error);
  }
);


const handleUnauthorized = async () => {
  console.warn("Unauthorized! Logging out...");
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};


export default axiosInstance;

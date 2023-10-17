import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
(function setupAxiosInterceptors(axios) {
  axios.interceptors.request.use(
    (config) => {
      if (!config?.headers?.Authorization && config?.headers) {
        const token = localStorage.getItem("jwToken");
        config.headers.Authorization = token ? `Bearer ${token}` : "";
      }

      return config;
    },
    (err) =>{  
          Promise.reject(err)
    } 
  );
})(axiosInstance);

export default axiosInstance;
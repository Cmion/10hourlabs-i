import axios from "axios";

// Default config options
const defaultOptions = {
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    Accept: "application/json",
  },
};

// Update instance
const instance = axios.create(defaultOptions);

instance.interceptors.request.use(
  (config: any) => {

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);
// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    // Do something with response data
    return response.data;
  },
  (error) => {
    // Do something with response error
    return Promise.reject(error.response);
  }
);

export const createApiRequest = (config: any) => instance(config);

export default createApiRequest;

export { instance as AxiosInstance };

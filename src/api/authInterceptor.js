import apiClient from "./apiClient";
import { store } from "../redux/store/store"
import { removeToken } from "../redux/slices/authSlice";

apiClient.interceptors.request.use(
  async (config) => {
    const state = store.getState();
    const token = state.auth?.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    if (error.response?.status === 401) {
      store.dispatch(removeToken())
    }

    if (!error.response) {
      console.log("Network Error");
    }

    return Promise.reject(error);
  },
);

export default apiClient;
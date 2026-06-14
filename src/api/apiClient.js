import axios from "axios";
import config from '../config/environment';

const apiClient = axios.create({
  //baseURL: "http://192.168.1.3:8000/api/v1",
  baseURL: config.PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
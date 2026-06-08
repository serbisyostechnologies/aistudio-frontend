import axios from "axios";
import config from '../config/environment';

const apiClient = axios.create({
  baseURL: config.PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
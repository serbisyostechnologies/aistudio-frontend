import axios from "axios";
import { PUBLIC_API_URL } from '@env';

console.log("PUBLIC_API_URL: ", PUBLIC_API_URL);
const apiClient = axios.create({
  baseURL: "http://192.168.1.3:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
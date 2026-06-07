import axios from "axios";
import { PUBLIC_API_URL } from '@env';

console.log("PUBLIC_API_URL: ", PUBLIC_API_URL);
const apiClient = axios.create({
  baseURL: PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
import axios from "axios";

const api = axios.create({
  baseURL: "https://shopkart-r0sv.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": 'application/json'
  }
});

export default api;
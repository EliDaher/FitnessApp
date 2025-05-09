// utils/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: "https://ftserver-ym6z.onrender.com", // عدل على حسب IP السيرفر
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;

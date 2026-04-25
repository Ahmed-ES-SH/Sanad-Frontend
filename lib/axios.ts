import axios from "axios";

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  // baseURL: "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

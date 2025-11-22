import axios from "axios";
// import { cookies } from "next/headers";

// Normalize base URL: trim spaces and avoid double trailing slashes
function normalizeBase(url: string) {
  return url.trim().replace(/\/$/, "");
}

const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export const BASE_URL = normalizeBase(RAW_BASE_URL);

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true, // has effect in browser only
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  // const token = (await cookies()).get("token")?.value; // server-side cookie read
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

// Helpful server-side logging to diagnose API issues
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.config) {
      const { method, url, baseURL } = error.config;
      console.error(
        `[API ${method?.toUpperCase()}] ${baseURL || ""}${url || ""} -> ${error?.response?.status || error.code || "ERR"
        }`
      );
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from "axios";
import Cookies from "js-cookie";

// Normalize base URL: trim spaces and avoid double trailing slashes
function normalizeBase(url: string) {
  return url.trim().replace(/\/$/, "");
}

function getBaseURL() {
  // Server-side (Next.js SSR)
  if (typeof window === "undefined") {
    if (!process.env.NEXT_PUBLIC_INTERNAL_API_URL) {
      throw new Error("NEXT_PUBLIC_INTERNAL_API_URL is not defined");
    }
    return process.env.NEXT_PUBLIC_INTERNAL_API_URL + "/api";
  }

  // return "/api";
  return process.env.NEXT_PUBLIC_INTERNAL_API_URL + "/api";
}
console.log("BASE_URL", getBaseURL());

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // has effect in browser only
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  // Get token from client-side cookie
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helpful server-side logging to diagnose API issues
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.config) {
      const { method, url, baseURL } = error.config;
      console.error(
        `[API ${method?.toUpperCase()}] ${baseURL || ""}${url || ""} -> ${
          error?.response?.status || error.code || "ERR"
        }`
      );
    }
    return Promise.reject(error);
  }
);

export default api;

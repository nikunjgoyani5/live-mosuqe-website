import api from "./axios";
import { AxiosRequestConfig } from "axios";

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

interface HttpOptions extends AxiosRequestConfig {
  params?: object;
  data?: object;
}

async function request<T>(
  method: HttpMethod,
  url: string,
  options: HttpOptions = {}
): Promise<T> {
  const { params, data, ...rest } = options;
  const response = await api.request<T>({
    url,
    method,
    params,
    data,
    ...rest,
  });
  return response.data;
}

export const Http = {
  get: <T>(url: string, params?: object, config?: AxiosRequestConfig) =>
    request<T>("get", url, { params, ...config }),

  post: <T>(url: string, data?: object, config?: AxiosRequestConfig) =>
    request<T>("post", url, { data, ...config }),

  put: <T>(url: string, data?: object, config?: AxiosRequestConfig) =>
    request<T>("put", url, { data, ...config }),

  patch: <T>(url: string, data?: object, config?: AxiosRequestConfig) =>
    request<T>("patch", url, { data, ...config }),

  delete: <T>(url: string, params?: object, config?: AxiosRequestConfig) =>
    request<T>("delete", url, { params, ...config }),
};

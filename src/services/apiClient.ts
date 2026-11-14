// Ponto único de acesso à API usado pelos serviços (cliente HTTP Axios em src/api).
import { httpClient } from '@/api/httpClient';

type ApiResponse<T> = { data: T; status: number };

export type ApiClient = {
  get: <T>(url: string) => Promise<ApiResponse<T>>;
  post: <T>(url: string, body?: unknown) => Promise<ApiResponse<T>>;
  put: <T>(url: string, body?: unknown) => Promise<ApiResponse<T>>;
  patch: <T>(url: string, body?: unknown) => Promise<ApiResponse<T>>;
  delete: <T>(url: string) => Promise<ApiResponse<T>>;
};

export const apiClient: ApiClient = {
  get: <T>(url: string) => httpClient.get<T>(url),
  post: <T>(url: string, body?: unknown) => httpClient.post<T>(url, body),
  put: <T>(url: string, body?: unknown) => httpClient.put<T>(url, body),
  patch: <T>(url: string, body?: unknown) => httpClient.patch<T>(url, body),
  delete: <T>(url: string) => httpClient.delete<T>(url),
};

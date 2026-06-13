import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { store } from "../../app/store";
import { logout, setTokens } from "../../features/auth/store/authSlice";
import { authService } from "../../features/auth/services/authService";
import { API_ENDPOINTS } from "./endpoints";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

// 2. Khởi tạo Axios Instance
const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// 3. Request Interceptor: Tự động đính kèm Access Token vào Header mỗi khi gọi API
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 4. Cấu hình Hàng đợi (Queue) quản lý các Request bị chặn khi đang Refresh Token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

// 5. Response Interceptor: Xử lý dữ liệu trả về tập trung (Thành công & Thất bại)
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;

    // Không phải lỗi 401 => trả lỗi về component/service xử lý
    if (status !== 401) {
      return Promise.reject(error.response?.data || error);
    }

    // Refresh token bị lỗi => logout
    if (originalRequest.url?.includes(API_ENDPOINTS.REFRESH_TOKEN)) {
      store.dispatch(logout());
      return Promise.reject(error.response?.data || error);
    }

    // Đã retry rồi mà vẫn 401 => logout
    if (originalRequest._retry) {
      store.dispatch(logout());
      return Promise.reject(error.response?.data || error);
    }

    // Nếu đang refresh thì đưa request vào hàng đợi
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return axiosClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = store.getState().auth.refreshToken;

    if (!refreshToken) {
      store.dispatch(logout());
      return Promise.reject(error.response?.data || error);
    }

    try {
      const tokenResponse = await authService.refreshToken({
        refreshToken,
      });

      store.dispatch(setTokens(tokenResponse));

      processQueue(null, tokenResponse.accessToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${tokenResponse.accessToken}`;
      }

      return axiosClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as Error, null);

      store.dispatch(logout());

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosClient;

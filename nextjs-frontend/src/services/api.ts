import axios, { AxiosError } from 'axios';
import { db } from './db';

// Use environment variable or fallback to localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token and handle offline queuing
api.interceptors.request.use(
  async (config) => {
    const isMutation = ['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase() || '');
    const isAuthRequest = config.url?.includes('/auth/');

    // Check online status
    if (typeof window !== 'undefined' && !navigator.onLine && isMutation && !isAuthRequest) {
      // Save it to IndexedDB
      await db.queued_requests.add({
        url: config.url || '',
        method: (config.method?.toUpperCase() as any) || 'POST',
        data: config.data,
        headers: config.headers,
        timestamp: Date.now(),
        status: 'pending',
        retryCount: 0
      });

      // Special handling: throw a custom object to be caught by response interceptor
      // or return a "Mock Success" promise
      console.log('📶 Offline: Request queued for background sync');
      return Promise.reject({
        isOfflineQueued: true,
        config
      });
    }

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and offline success mocks/cache
api.interceptors.response.use(
  async (response) => {
    // Cache successful GET requests for offline use
    if (typeof window !== 'undefined' && response.config.method?.toLowerCase() === 'get') {
      const cacheKey = response.config.url || '';
      await db.cache.put({
        key: cacheKey,
        data: response.data,
        timestamp: Date.now()
      });
    }
    return response;
  },
  async (error) => {
    // Handle the custom offline rejection for mutations
    if (error.isOfflineQueued) {
      return {
        data: {
          success: true,
          message: 'Saved offline. Will sync when online.',
          isOffline: true,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: error.config,
      };
    }

    // Handle offline for GET requests (serve from cache)
    if (
      typeof window !== 'undefined' && 
      !navigator.onLine && 
      error.config?.method?.toLowerCase() === 'get'
    ) {
      const cacheKey = error.config.url || '';
      const cached = await db.cache.get(cacheKey);
      if (cached) {
        console.log(`📦 Offline: Serving cached data for ${cacheKey}`);
        return {
          data: cached.data,
          status: 200,
          statusText: 'OK (Cached)',
          headers: {},
          config: error.config,
          isCached: true,
        };
      }
    }

    const originalRequest = error.config;

    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url?.includes('/auth/')
    ) {
      originalRequest._retry = true;

      try {
        if (typeof window !== 'undefined') {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken,
            });

            const { accessToken } = response.data.data;
            localStorage.setItem('accessToken', accessToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// API Response Interface
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Auth API
export const authApi = {
  sendOtp: (email: string) => api.post<ApiResponse>('/auth/send-otp', { email }),
  verifyOtp: (email: string, otp: string) =>
    api.post<ApiResponse>('/auth/verify-otp', { email, otp }),
  register: (data: any) => api.post<ApiResponse>('/auth/register', data),
  login: (familyCode: string, email: string, password: string) =>
    api.post<ApiResponse>('/auth/login', { familyCode, email, password }),
  logout: (refreshToken: string) => api.post<ApiResponse>('/auth/logout', { refreshToken }),
  forgotFamilyCode: (email: string) => api.post<ApiResponse>('/auth/forgot-family-code', { email }),
};

// Income API
export const incomeApi = {
  getMyIncomes: (bookId?: string) => api.get<ApiResponse>(`/incomes/my${bookId ? `?bookId=${bookId}` : ''}`),
  getFamilyIncomes: (bookId?: string) => api.get<ApiResponse>(`/incomes/family${bookId ? `?bookId=${bookId}` : ''}`),
  getMyStats: () => api.get<ApiResponse>('/incomes/my/stats'),
  getById: (id: string) => api.get<ApiResponse>(`/incomes/${id}`),
  create: (data: any) => api.post<ApiResponse>('/incomes', data),
  update: (id: string, data: any) => api.put<ApiResponse>(`/incomes/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse>(`/incomes/${id}`),
};

// Expense API
export const expenseApi = {
  getMyExpenses: (bookId?: string) => api.get<ApiResponse>(`/expenses/my${bookId ? `?bookId=${bookId}` : ''}`),
  getFamilyExpenses: (bookId?: string) => api.get<ApiResponse>(`/expenses/family${bookId ? `?bookId=${bookId}` : ''}`),
  getMyStats: () => api.get<ApiResponse>('/expenses/my/stats'),
  getById: (id: string) => api.get<ApiResponse>(`/expenses/${id}`),
  create: (data: any) => api.post<ApiResponse>('/expenses', data),
  update: (id: string, data: any) => api.put<ApiResponse>(`/expenses/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse>(`/expenses/${id}`),
};

// Dashboard API
export const dashboardApi = {
  getMyDashboard: (bookId?: string) => api.get<ApiResponse>(`/dashboard/my${bookId ? `?bookId=${bookId}` : ''}`),
  getFamilyDashboard: (bookId?: string) => api.get<ApiResponse>(`/dashboard/family${bookId ? `?bookId=${bookId}` : ''}`),
  getMyTrends: (months?: number, bookId?: string) => {
    let url = `/dashboard/my/trends?q=1`;
    if (months) url += `&months=${months}`;
    if (bookId) url += `&bookId=${bookId}`;
    return api.get<ApiResponse>(url);
  },
  getFamilyTrends: (months?: number, bookId?: string) => {
    let url = `/dashboard/family/trends?q=1`;
    if (months) url += `&months=${months}`;
    if (bookId) url += `&bookId=${bookId}`;
    return api.get<ApiResponse>(url);
  },
};

// Book API
export const bookApi = {
  getBooks: () => api.get<ApiResponse>('/books'),
  getById: (id: string) => api.get<ApiResponse>(`/books/${id}`),
  create: (data: any) => api.post<ApiResponse>('/books', data),
  update: (id: string, data: any) => api.put<ApiResponse>(`/books/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse>(`/books/${id}`),
};

// Family API
export const familyApi = {
  getFamily: () => api.get<ApiResponse>('/family'),
  getMembers: () => api.get<ApiResponse>('/family/members'),
  removeMember: (id: string) => api.delete<ApiResponse>(`/family/members/${id}`),
  updateName: (name: string) => api.patch<ApiResponse>('/family/name', { name }),
  updateLocation: (lat: number, lng: number) => api.patch<ApiResponse>('/family/location', { lat, lng }),
  requestLocationReport: () => api.patch<ApiResponse>('/family/request-location-report'),
};

export const categoryApi = {
  getCategories: () => api.get<ApiResponse>('/categories'),
  create: (data: { name: string; type: string }) => api.post<ApiResponse>('/categories', data),
  delete: (id: string) => api.delete<ApiResponse>(`/categories/${id}`),
};

// Reminder API
export const reminderApi = {
  sendToMember: (memberId: string) => api.post<ApiResponse>('/reminders/send-to-member', { memberId }),
  sendToAll: () => api.post<ApiResponse>('/reminders/send-to-all'),
  sendBulk: (memberIds: string[]) => api.post<ApiResponse>('/reminders/send-bulk', { memberIds }),
  sendTest: () => api.post<ApiResponse>('/reminders/test'),
  sendReport: (targetMemberId: string, csvData: string, reportName: string) => 
    api.post<ApiResponse>('/reminders/send-report', { targetMemberId, csvData, reportName }),
};

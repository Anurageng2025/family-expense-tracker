import axios from 'axios';

// Use environment variable or fallback to localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
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

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
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

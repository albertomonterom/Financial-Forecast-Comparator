import type {
  AnalysisRequest,
  AnalysisResponse,
  AnalysisHistoryItem,
  HealthResponse,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
} from '@/types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!res.ok) {
    throw new ApiError(res.status, await res.text());
  }
  return res.json();
}

export const api = {
  health: () => request<HealthResponse>('/health'),

  analyze: (data: AnalysisRequest) =>
    request<AnalysisResponse>('/api/v1/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAnalyses: () => request<AnalysisHistoryItem[]>('/api/v1/analyses'),

  getAnalysis: (id: string) => request<AnalysisResponse>(`/api/v1/analyses/${id}`),

  deleteAnalysis: (id: string) =>
    request<{ success: boolean }>(`/api/v1/analyses/${id}`, { method: 'DELETE' }),

  searchTickers: (q: string) =>
    request<{ symbol: string; name: string }[]>(`/api/v1/tickers/search?q=${encodeURIComponent(q)}`),

  // Auth
  register: (data: RegisterRequest) =>
    request<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: LoginRequest) =>
    request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

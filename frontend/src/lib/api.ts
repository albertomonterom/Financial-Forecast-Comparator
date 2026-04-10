import type {
  AnalysisRequest,
  AnalysisResponse,
  AnalysisHistoryItem,
  HealthResponse,
} from '@/types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
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
};

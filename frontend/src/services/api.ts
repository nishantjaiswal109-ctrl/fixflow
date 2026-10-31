import {
  User,
  ReportItem,
  DashboardStats,
  StudentDashboardStats,
  DuplicateSuggestionItem,
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('fixflow_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = {
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'An unexpected error occurred';
    try {
      const errorData = await response.json();
      errorMsg = errorData.detail || errorData.message || JSON.stringify(errorData);
    } catch {
      errorMsg = response.statusText || `Request failed with code ${response.status}`;
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

// Authentication
export async function loginUser(email: string, password: string) {
  return apiRequest<{ access_token: string; token_type: string; user: User }>(
    '/auth/login',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }
  );
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role?: string;
  department?: string;
}) {
  return apiRequest<{ access_token: string; token_type: string; user: User }>(
    '/auth/register',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  );
}

export async function getMe(): Promise<User> {
  return apiRequest<User>('/auth/me');
}

// Reports
export async function submitReport(formData: FormData) {
  const headers = getAuthHeader();
  const response = await fetch(`${API_BASE}/reports`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    let errorMsg = 'Submission failed';
    try {
      const err = await response.json();
      errorMsg = err.detail || err.message || errorMsg;
    } catch {
      // fallback
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export async function fetchReports(params: {
  category?: string;
  building?: string;
  priority?: string;
  status?: string;
  search?: string;
  view?: string;
  sortBy?: string;
  sortOrder?: string;
} = {}): Promise<ReportItem[]> {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'All') query.append('category', params.category);
  if (params.building && params.building !== 'All') query.append('building', params.building);
  if (params.priority && params.priority !== 'All') query.append('priority', params.priority);
  if (params.status && params.status !== 'All') query.append('status', params.status);
  if (params.search) query.append('search', params.search);
  if (params.view) query.append('view', params.view);
  if (params.sortBy) query.append('sort_by', params.sortBy);
  if (params.sortOrder) query.append('sort_order', params.sortOrder);

  const qs = query.toString();
  return apiRequest<ReportItem[]>(`/reports${qs ? `?${qs}` : ''}`);
}

export async function fetchReportDetail(reportId: string): Promise<ReportItem> {
  return apiRequest<ReportItem>(`/reports/${encodeURIComponent(reportId)}`);
}

export async function updateReportStatus(
  reportId: string,
  data: { new_status: string; comment?: string; assigned_team?: string }
) {
  return apiRequest(`/reports/${encodeURIComponent(reportId)}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function overrideReportPriority(
  reportId: string,
  data: { priority: string; comment?: string }
) {
  return apiRequest(`/reports/${encodeURIComponent(reportId)}/priority`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// Duplicates
export async function fetchDuplicates(status = 'pending'): Promise<DuplicateSuggestionItem[]> {
  return apiRequest<DuplicateSuggestionItem[]>(`/duplicates?status=${encodeURIComponent(status)}`);
}

export async function reviewDuplicate(
  suggestionId: number,
  action: 'confirm' | 'reject',
  comment?: string
) {
  return apiRequest(`/duplicates/${suggestionId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ suggestion_id: suggestionId, action, comment }),
  });
}

// Dashboards
export async function fetchAdminDashboardStats(): Promise<DashboardStats> {
  return apiRequest<DashboardStats>('/admin/dashboard');
}

export async function fetchStudentDashboardStats(): Promise<StudentDashboardStats> {
  return apiRequest<StudentDashboardStats>('/student/dashboard');
}

export async function resetDemoData() {
  return apiRequest<{ message: string }>('/admin/reset-demo-data', {
    method: 'POST',
  });
}


import {
  User,
  UserRole,
  PiiScanResult,
  ThreatScanResult,
  ModelAuditResult,
  SecurityLog,
  MetricsSummary,
} from '../types/index.ts';

const TOKEN_KEY = 'trustguard_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || (data.details ? JSON.stringify(data.details) : `Request failed (${response.status})`);
    throw new Error(errorMsg);
  }

  return data as T;
}

// Authentication APIs
export async function loginApi(email: string, password: string): Promise<{ token: string; user: User }> {
  return request<{ token: string; user: User }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerApi(
  name: string,
  email: string,
  password: string,
  role: UserRole
): Promise<{ token: string; user: User }> {
  return request<{ token: string; user: User }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  });
}

export async function getMeApi(): Promise<{ user: User }> {
  return request<{ user: User }>('/api/auth/me');
}

export async function switchRoleApi(role: UserRole): Promise<{ token: string; user: User }> {
  return request<{ token: string; user: User }>('/api/auth/role', {
    method: 'POST',
    body: JSON.stringify({ role }),
  });
}

export async function getDemoAccountsApi(): Promise<{ accounts: Array<{ email: string; role: UserRole; name: string; description: string }> }> {
  return request('/api/auth/demo-accounts');
}

// Scanning APIs
export async function scanPiiApi(
  text: string,
  redactionMode: 'token' | 'asterisk' | 'hash' = 'token'
): Promise<{ success: boolean; log_id: number; analysis: PiiScanResult }> {
  return request('/api/scan/pii', {
    method: 'POST',
    body: JSON.stringify({ text, redaction_mode: redactionMode }),
  });
}

export async function scanThreatApi(
  text: string,
  sensitivity: 'strict' | 'standard' | 'permissive' = 'strict'
): Promise<{ success: boolean; log_id: number; analysis: ThreatScanResult }> {
  return request('/api/scan/threat', {
    method: 'POST',
    body: JSON.stringify({ text, sensitivity }),
  });
}

export async function scanAuditApi(
  text: string,
  prompt?: string
): Promise<{ success: boolean; log_id: number; analysis: ModelAuditResult }> {
  return request('/api/scan/audit', {
    method: 'POST',
    body: JSON.stringify({ text, prompt }),
  });
}

// Logs and Metrics APIs
export async function getLogsApi(params?: {
  scan_type?: string;
  threats_only?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: SecurityLog[]; total: number; limit: number; offset: number; user_role: string }> {
  const query = new URLSearchParams();
  if (params?.scan_type) query.set('scan_type', params.scan_type);
  if (params?.threats_only) query.set('threats_only', 'true');
  if (params?.search) query.set('search', params.search);
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.offset) query.set('offset', String(params.offset));

  const qs = query.toString();
  return request(`/api/logs${qs ? '?' + qs : ''}`);
}

export async function deleteLogApi(id: number): Promise<{ success: boolean; message: string }> {
  return request(`/api/logs/${id}`, {
    method: 'DELETE',
  });
}

export async function getMetricsApi(): Promise<MetricsSummary> {
  return request<MetricsSummary>('/api/metrics');
}

export function downloadLogsExport(format: 'json' | 'csv') {
  const token = getStoredToken();
  const url = `/api/logs/export?format=${format}${token ? `&auth=${encodeURIComponent(token)}` : ''}`;
  window.open(url, '_blank');
}

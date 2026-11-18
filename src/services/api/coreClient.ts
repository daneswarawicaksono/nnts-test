/**
 * Core HTTP Client untuk NNTS
 * Standar: api-and-interface-design
 * Menyediakan fetch wrapper dengan authorization header otomatis & offline fallback queue
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://otakatik-api.vercel.app';

export class CoreApiClient {
  private tokenKey = 'nnts_auth_token';
  private sessionKey = 'nnts_auth_session';
  private vaultKey = 'nnts_offline_vault';

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getSession<T>(): T | null {
    const raw = localStorage.getItem(this.sessionKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  setSession<T>(session: T) {
    localStorage.setItem(this.sessionKey, JSON.stringify(session));
  }

  clearAuth() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.sessionKey);
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers = new Headers(options.headers || {});
    
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, { ...options, headers });
      
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorBody || response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      console.warn(`[CoreApiClient] Network error on ${url}:`, error);
      throw error;
    }
  }

  // Offline queue helpers
  getOfflineVault(): any[] {
    const raw = localStorage.getItem(this.vaultKey);
    return raw ? JSON.parse(raw) : [];
  }

  queueOfflineRecord(record: any) {
    const queue = this.getOfflineVault();
    queue.push(record);
    localStorage.setItem(this.vaultKey, JSON.stringify(queue));
  }

  clearOfflineVault() {
    localStorage.removeItem(this.vaultKey);
  }
}

export const coreClient = new CoreApiClient();

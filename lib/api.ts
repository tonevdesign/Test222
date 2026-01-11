const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errors?: Record<string, string>;
}

class ApiError<T> extends Error {
  constructor(
    public status: number,
    public response: ApiResponse<T>,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class TokenRefreshError extends Error {
  constructor() {
    super('Token refreshed, retry request');
    this.name = 'TokenRefreshError';
  }
}

class ApiClient {
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  private subscribeTokenRefresh(cb: (token: string) => void) {
    this.refreshSubscribers.push(cb);
  }

  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach(cb => cb(token));
    this.refreshSubscribers = [];
  }

  private getCSRFToken(): string | null {
  if (typeof document !== 'undefined') {
    // Try production cookie name first (__Host- prefix)
    const prodMatch = document.cookie.match(/(?:^|; )__Host-csrfToken=([^;]*)/);
    if (prodMatch) {
      return decodeURIComponent(prodMatch[1]);
    }
    
    // Fallback to development cookie name
    const devMatch = document.cookie.match(/(?:^|; )csrfToken=([^;]*)/);
    if (devMatch) {
      return decodeURIComponent(devMatch[1]);
    }
    
    console.warn('⚠️ No CSRF token found in cookies');
  }
  return null;
}

  private getAuthToken(): string | null {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='));
      return tokenCookie ? tokenCookie.split('=')[1] : null;
    }
    return null;
  }

  private async refreshAccessToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) return false;

      const data = await response.json();
      if (data.success && data.data?.user) {
        // Update Zustand store with fresh user data
        if (typeof window !== 'undefined') {
          const { useAuthStore } = await import('@/store/authStore');
          useAuthStore.getState().setUser(data.data.user);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  private async handleResponse<T>(res: Response, endpoint: string): Promise<ApiResponse<T>> {
    // Handle non-JSON responses (like network errors)
    let data: ApiResponse<T>;
    
    try {
      data = await res.json();
    } catch {
      throw new ApiError<T>(
        res.status,
        { success: false, message: 'Invalid server response' } as ApiResponse<T>,
        `Server returned ${res.status}: ${res.statusText}`
      );
    }

    // Handle 401 Unauthorized with token refresh (but not for auth endpoints)
    if (res.status === 401 && !endpoint.includes('/auth/')) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        const refreshed = await this.refreshAccessToken();
        this.isRefreshing = false;

        if (refreshed) {
          this.onRefreshed('refreshed');
          // Signal that request should be retried
          throw new TokenRefreshError();
        } else {
          // Refresh failed - logout and redirect
          if (typeof window !== 'undefined') {
            const { useAuthStore } = await import('@/store/authStore');
            useAuthStore.getState().logout();
            window.location.href = '/login?session=expired';
          }
          throw new ApiError<T>(401, data, 'Session expired');
        }
      } else {
        // Wait for ongoing refresh to complete
        return new Promise((resolve, reject) => {
          this.subscribeTokenRefresh(() => {
            // Signal retry after refresh completes
            reject(new TokenRefreshError());
          });
        });
      }
    }

    if (!res.ok) {
      throw new ApiError<T>(
        res.status,
        data,
        data.message || `API Error: ${res.status}`
      );
    }

    return data;
  }

  async fetch<T>(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<ApiResponse<T>> {
  const url = `${API_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Add Authorization header if token exists
  const authToken = this.getAuthToken();
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  // Add CSRF token for state-changing operations
  if (
    options.method && 
    !['GET', 'HEAD', 'OPTIONS'].includes(options.method)
  ) {
    const csrfToken = this.getCSRFToken();
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    } else {
      console.error('❌ CSRF token missing for:', endpoint, options.method);
    }
  }

  try {
    const res = await fetch(url, {
      headers,
      credentials: 'include',
      ...options,
    });

    return await this.handleResponse<T>(res, endpoint);
  } catch (error) {
    if (error instanceof TokenRefreshError && retryCount < 1) {
      return this.fetch<T>(endpoint, options, retryCount + 1);
    }

    if (error instanceof ApiError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Network error: ${message}`);
  }
}

  get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.fetch<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T, B = unknown>(
    endpoint: string,
    data?: B,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T, B = unknown>(
    endpoint: string,
    data?: B,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  patch<T, B = unknown>(
    endpoint: string,
    data?: B,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.fetch<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse, ApiError };
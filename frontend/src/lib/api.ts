const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface RequestOptions extends RequestInit {
  token?: string;
}

const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export const api = {
  async get<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const headers = getHeaders(options.token);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'GET',
      credentials: 'include',
      headers: { ...headers, ...options.headers },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(err.message || 'Request failed');
    }

    return response.json();
  },

  async post<T = any>(endpoint: string, body: any, options: RequestOptions = {}): Promise<T> {
    const headers = getHeaders(options.token);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'POST',
      credentials: 'include',
      headers: { ...headers, ...options.headers },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(err.message || 'Request failed');
    }

    return response.json();
  },

  async put<T = any>(endpoint: string, body: any, options: RequestOptions = {}): Promise<T> {
    const headers = getHeaders(options.token);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'PUT',
      credentials: 'include',
      headers: { ...headers, ...options.headers },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(err.message || 'Request failed');
    }

    return response.json();
  },

  async patch<T = any>(endpoint: string, body: any, options: RequestOptions = {}): Promise<T> {
    const headers = getHeaders(options.token);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'PATCH',
      credentials: 'include',
      headers: { ...headers, ...options.headers },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(err.message || 'Request failed');
    }

    return response.json();
  },

  async delete<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const headers = getHeaders(options.token);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'DELETE',
      credentials: 'include',
      headers: { ...headers, ...options.headers },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(err.message || 'Request failed');
    }

    return response.json();
  },
};

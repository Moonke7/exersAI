import { API_HOST } from '@env';
import { useAuthStore } from '../store/useAuthStore';

interface FetchOptions extends RequestInit {
  authenticated?: boolean;
}

export async function apiFetch(endpoint: string, options: FetchOptions = {}) {
  const { authenticated = false, headers = {}, ...restOptions } = options;
  const { session } = useAuthStore.getState();

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (authenticated && session?.access_token) {
    requestHeaders.Authorization = `Bearer ${session.access_token}`;
  }

  const response = await fetch(`${API_HOST}:3000${endpoint}`, {
    ...restOptions,
    headers: requestHeaders,
  });

  return response;
}

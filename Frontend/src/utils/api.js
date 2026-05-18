const API_BASE = import.meta.env.VITE_SERVER_DOMAIN;

export function getApiBase() {
  return API_BASE;
}

export async function apiFetch(path, options = {}) {
  const headers = { ...options.headers };
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('token');
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  return response;
}

export async function fetchOAuthProviders() {
  const res = await apiFetch('/auth/oauth/providers');
  if (!res.ok) return { enabled: false, providers: [] };
  return res.json();
}

export function startOAuthLogin(provider) {
  window.location.href = `${API_BASE}/oauth2/authorization/${provider}`;
}

export function buildListingsSearchUrl(params) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value);
    }
  });
  const qs = searchParams.toString();
  return `/listings/search${qs ? `?${qs}` : ''}`;
}

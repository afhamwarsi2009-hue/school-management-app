const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '');

function resolveApiUrl(path) {
  if (!API_BASE_URL) {
    return path.startsWith('/') ? path : `/${path}`;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const baseHasApiPrefix = API_BASE_URL.includes('/api');
  const pathHasApiPrefix = normalizedPath.startsWith('/api');

  if (baseHasApiPrefix) {
    const trimmedPath = pathHasApiPrefix ? normalizedPath.replace(/^\/api/, '') : normalizedPath;
    return `${API_BASE_URL}${trimmedPath}`;
  }

  return `${API_BASE_URL}${pathHasApiPrefix ? normalizedPath : `/api${normalizedPath}`}`;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export async function apiClient(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_URL is not configured.');
  }

  const url = resolveApiUrl(path);
  const token = sessionStorage.getItem('aurora_token');
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (error) {
    throw new Error(error?.message || 'Network request failed. Check the backend and CORS settings.');
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const error = await response.json();
      message = error.message || message;
    } catch {
      // Keep the HTTP status message when the server did not return JSON.
    }
    if (response.status === 401) {
      sessionStorage.removeItem('aurora_token');
      sessionStorage.removeItem('aurora_user');
      localStorage.removeItem('aurora_token');
      localStorage.removeItem('aurora_user');
      window.dispatchEvent(new Event('auth:expired'));
    }
    throw new Error(message);
  }

  if (options.responseType === 'blob') return response.blob();
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Invalid JSON from server:", text);
    throw new Error("Server returned invalid response");
  }
}

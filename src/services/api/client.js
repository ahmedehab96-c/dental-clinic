// Thin fetch wrapper — every API service module (services/api/doctors.js,
// services.js, etc.) calls this instead of hitting fetch directly, so the
// base URL, JSON envelope, and error shape only live in one place.
// VITE_API_URL should point at the Laravel API's v1 root, e.g.
// http://localhost:8000/api/v1 — never hardcode a host in a component.
const BASE_URL = import.meta.env.VITE_API_URL ?? ''

// No login flow ships in this phase, so nothing writes this key yet — but
// once one does (Sanctum bearer token), every request picks it up
// automatically without any call site needing to change.
const TOKEN_KEY = 'rdc-auth-token'

export function getAuthToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setAuthToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // Ignore storage errors (private browsing, quota, etc.) — the session
    // still works for the current request, it just won't persist.
  }
}

export function clearAuthToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // See setAuthToken — safe to ignore.
  }
}

async function request(path, { method = 'GET', body, headers, ...rest } = {}) {
  const token = getAuthToken()
  // A FormData body (file uploads) must go through untouched — stringifying
  // it would lose the file, and the browser needs to set its own
  // multipart/form-data Content-Type (with boundary) rather than JSON's.
  const isFormData = body instanceof FormData

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    ...rest,
  })

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const payload = isJson ? await response.json().catch(() => null) : null

  if (!response.ok) {
    // Laravel's envelope is { success: false, message, errors? } — surface
    // that message and status so callers can tell a 404 (not-found state)
    // apart from a 422 (validation) or a 500 (generic error state).
    const error = new Error(payload?.message || response.statusText || `Request failed with status ${response.status}`)
    error.status = response.status
    error.errors = payload?.errors
    throw error
  }

  if (response.status === 204) return null
  return payload
}

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
}

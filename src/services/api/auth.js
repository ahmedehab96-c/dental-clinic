import { apiClient } from './client'

// Adapts the Laravel UserResource shape to camelCase. Only ever the fields
// Laravel actually returns (id, name, email, phone, role) — nothing else is
// exposed, and role is never client-editable (see profile.js callers).
function mapUser(raw) {
  if (!raw) return null

  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    phone: raw.phone,
    role: raw.role,
  }
}

/**
 * @param {{ name: string, email: string, phone: string, password: string, passwordConfirmation: string }} payload
 * @returns {Promise<{ user: object, token: string }>}
 */
export async function register(payload) {
  const { data } = await apiClient.post('/register', {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    password: payload.password,
    password_confirmation: payload.passwordConfirmation,
  })

  return { user: mapUser(data.user), token: data.token }
}

/**
 * @param {{ email: string, password: string }} payload
 * @returns {Promise<{ user: object, token: string }>}
 */
export async function login(payload) {
  const { data } = await apiClient.post('/login', {
    email: payload.email,
    password: payload.password,
  })

  return { user: mapUser(data.user), token: data.token }
}

/**
 * Best-effort — the caller clears the local session regardless of whether
 * this succeeds (an already-expired token would otherwise strand the user
 * in a logged-in-looking state).
 */
export async function logout() {
  await apiClient.post('/logout')
}

/**
 * @returns {Promise<object>} the authenticated user, or rejects with `.status === 401` if the token is invalid/expired
 */
export async function me() {
  const { data } = await apiClient.get('/me')
  return mapUser(data)
}

/**
 * @param {{ name?: string, email?: string, phone?: string }} payload
 * @returns {Promise<object>} the updated user
 */
export async function updateProfile(payload) {
  const { data } = await apiClient.patch('/me', payload)
  return mapUser(data)
}

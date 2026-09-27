import { apiClient } from './client'

export const USER_ROLES = ['patient', 'doctor', 'admin']

// Adapts the Laravel Admin\UserResource shape to camelCase.
function mapUser(raw) {
  if (!raw) return null

  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    phone: raw.phone,
    role: raw.role,
    appointmentsCount: raw.appointments_count ?? 0,
    recentAppointments: raw.recent_appointments ?? [],
    createdAt: raw.created_at,
  }
}

/**
 * @param {{ page?: number, perPage?: number, search?: string, role?: string, sort?: 'newest'|'oldest'|'name' }} [params]
 * @returns {Promise<{ users: object[], meta: { currentPage: number, lastPage: number, total: number } }>}
 */
export async function fetchAdminUsers(params = {}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.perPage) query.set('per_page', String(params.perPage))
  if (params.search) query.set('search', params.search)
  if (params.role) query.set('role', params.role)
  if (params.sort) query.set('sort', params.sort)

  const search = query.toString()
  const { data, meta } = await apiClient.get(`/admin/users${search ? `?${search}` : ''}`)

  return {
    users: data.map(mapUser),
    meta: { currentPage: meta.current_page, lastPage: meta.last_page, total: meta.total },
  }
}

/**
 * @param {number} id
 * @returns {Promise<object>} includes a recent-appointments summary
 */
export async function fetchAdminUser(id) {
  const { data } = await apiClient.get(`/admin/users/${id}`)
  return mapUser(data)
}

function buildUserPayload(payload) {
  const body = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone || null,
    role: payload.role,
  }
  if (payload.password) {
    body.password = payload.password
    body.password_confirmation = payload.passwordConfirmation
  }

  return body
}

/**
 * @param {object} payload see buildUserPayload
 * @returns {Promise<object>} rejects with `.status === 422` and `.errors` on validation failure
 */
export async function createAdminUser(payload) {
  const { data } = await apiClient.post('/admin/users', buildUserPayload(payload))
  return mapUser(data)
}

/**
 * Password is only sent when the admin filled one in; otherwise it's left untouched.
 *
 * @param {number} id
 * @param {object} payload see buildUserPayload
 * @returns {Promise<object>} rejects with `.status === 422` (incl. the self-demotion guard)
 */
export async function updateAdminUser(id, payload) {
  const { data } = await apiClient.patch(`/admin/users/${id}`, buildUserPayload(payload))
  return mapUser(data)
}

/**
 * Laravel refuses this (422) for the current admin's own account and for
 * users with appointment history.
 *
 * @param {number} id
 */
export async function deleteAdminUser(id) {
  await apiClient.delete(`/admin/users/${id}`)
}

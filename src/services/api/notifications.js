import { apiClient } from './client'

// Laravel scopes every one of these to the authenticated account; no user id
// is ever sent from the client.

function mapNotification(raw) {
  return {
    id: raw.id,
    kind: raw.kind,
    data: raw.data ?? {},
    readAt: raw.read_at,
    createdAt: raw.created_at,
  }
}

/**
 * @param {{ page?: number, perPage?: number, unreadOnly?: boolean }} [params]
 * @returns {Promise<{ notifications: object[], meta: { currentPage: number, lastPage: number, total: number } }>}
 */
export async function fetchNotifications(params = {}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.perPage) query.set('per_page', String(params.perPage))
  if (params.unreadOnly) query.set('filter', 'unread')

  const search = query.toString()
  const { data, meta } = await apiClient.get(`/notifications${search ? `?${search}` : ''}`)

  return {
    notifications: data.map(mapNotification),
    meta: { currentPage: meta.current_page, lastPage: meta.last_page, total: meta.total },
  }
}

/** @returns {Promise<number>} */
export async function fetchUnreadCount() {
  const { data } = await apiClient.get('/notifications/unread-count')
  return data.count
}

/** @param {string} id */
export async function markNotificationRead(id) {
  const { data } = await apiClient.patch(`/notifications/${id}/read`)
  return mapNotification(data)
}

/** @returns {Promise<number>} how many were marked read */
export async function markAllNotificationsRead() {
  const { data } = await apiClient.post('/notifications/read-all')
  return data.updated
}

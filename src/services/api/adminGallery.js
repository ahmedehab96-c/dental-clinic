import { apiClient } from './client'

// Adapts the Laravel Admin\GalleryCaseResource shape to camelCase.
function mapGalleryCase(raw) {
  if (!raw) return null

  return {
    id: raw.id,
    title: raw.title,
    service: raw.service ?? null,
    beforeImage: raw.before_image_url,
    afterImage: raw.after_image_url,
    isPublished: raw.is_published,
    createdAt: raw.created_at,
  }
}

/**
 * @param {{ page?: number, perPage?: number, search?: string, service?: string, isPublished?: boolean }} [params]
 * @returns {Promise<{ cases: object[], meta: { currentPage: number, lastPage: number, total: number } }>}
 */
export async function fetchAdminGalleryCases(params = {}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.perPage) query.set('per_page', String(params.perPage))
  if (params.search) query.set('search', params.search)
  if (params.service) query.set('service', params.service)
  if (params.isPublished !== undefined && params.isPublished !== '') {
    query.set('is_published', params.isPublished ? '1' : '0')
  }

  const search = query.toString()
  const { data, meta } = await apiClient.get(`/admin/gallery${search ? `?${search}` : ''}`)

  return {
    cases: data.map(mapGalleryCase),
    meta: { currentPage: meta.current_page, lastPage: meta.last_page, total: meta.total },
  }
}

/**
 * @param {string|number} id
 * @returns {Promise<object>}
 */
export async function fetchAdminGalleryCase(id) {
  const { data } = await apiClient.get(`/admin/gallery/${id}`)
  return mapGalleryCase(data)
}

/**
 * Builds the multipart form body shared by create/update — `beforeImageFile`/
 * `afterImageFile` are each only appended when the admin actually picked a
 * new file, so editing without touching one side leaves it untouched
 * server-side (the two sides replace fully independently).
 */
function buildGalleryCaseFormData(payload) {
  const formData = new FormData()
  const fields = {
    title_ar: payload.titleAr,
    title_en: payload.titleEn,
    service_id: payload.serviceId,
  }

  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) formData.append(key, value)
  }

  if (payload.isPublished !== undefined) formData.append('is_published', payload.isPublished ? '1' : '0')
  if (payload.beforeImageFile) formData.append('before_image', payload.beforeImageFile)
  if (payload.afterImageFile) formData.append('after_image', payload.afterImageFile)

  // Laravel-only quirk: PHP never parses multipart bodies for PUT/PATCH,
  // so an update with a possible file attached always goes out as POST
  // with this spoofed-method field instead.
  if (payload.isUpdate) formData.append('_method', 'PATCH')

  return formData
}

/**
 * @param {object} payload see buildGalleryCaseFormData
 * @returns {Promise<object>} the created case; rejects with `.status === 422` and `.errors` on validation failure
 */
export async function createAdminGalleryCase(payload) {
  const { data } = await apiClient.post('/admin/gallery', buildGalleryCaseFormData(payload))
  return mapGalleryCase(data)
}

/**
 * @param {string|number} id
 * @param {object} payload see buildGalleryCaseFormData
 * @returns {Promise<object>} the updated case
 */
export async function updateAdminGalleryCase(id, payload) {
  const { data } = await apiClient.post(`/admin/gallery/${id}`, buildGalleryCaseFormData({ ...payload, isUpdate: true }))
  return mapGalleryCase(data)
}

/**
 * @param {string|number} id
 */
export async function deleteAdminGalleryCase(id) {
  await apiClient.delete(`/admin/gallery/${id}`)
}

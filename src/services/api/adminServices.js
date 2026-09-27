import { apiClient } from './client'

// Adapts the Laravel Admin\ServiceResource shape to camelCase.
function mapService(raw) {
  if (!raw) return null

  return {
    id: raw.id,
    slug: raw.slug,
    icon: raw.icon,
    name: raw.name,
    shortDescription: raw.short_description,
    description: raw.description,
    image: raw.image_url,
    duration: raw.duration,
    priceFrom: raw.price_from,
    isActive: raw.is_active,
    doctors: raw.doctors ?? [],
    doctorsCount: raw.doctors_count ?? (raw.doctors ?? []).length,
    createdAt: raw.created_at,
  }
}

/**
 * @param {{ page?: number, perPage?: number, search?: string, isActive?: boolean }} [params]
 * @returns {Promise<{ services: object[], meta: { currentPage: number, lastPage: number, total: number } }>}
 */
export async function fetchAdminServices(params = {}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.perPage) query.set('per_page', String(params.perPage))
  if (params.search) query.set('search', params.search)
  if (params.isActive !== undefined && params.isActive !== '') query.set('is_active', params.isActive ? '1' : '0')

  const search = query.toString()
  const { data, meta } = await apiClient.get(`/admin/services${search ? `?${search}` : ''}`)

  return {
    services: data.map(mapService),
    meta: { currentPage: meta.current_page, lastPage: meta.last_page, total: meta.total },
  }
}

/**
 * Builds the multipart form body shared by create/update — a File under
 * `image` is only appended when the admin actually picked a new one, so
 * editing without touching the image leaves it untouched server-side.
 */
function buildServiceFormData(payload) {
  const formData = new FormData()
  const fields = {
    slug: payload.slug,
    name_ar: payload.nameAr,
    name_en: payload.nameEn,
    short_description_ar: payload.shortDescriptionAr,
    short_description_en: payload.shortDescriptionEn,
    description_ar: payload.descriptionAr,
    description_en: payload.descriptionEn,
    duration_ar: payload.durationAr,
    duration_en: payload.durationEn,
    price_from: payload.priceFrom,
  }

  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) formData.append(key, value)
  }

  if (payload.isActive !== undefined) formData.append('is_active', payload.isActive ? '1' : '0')
  if (payload.imageFile) formData.append('image', payload.imageFile)

  const doctorIds = payload.doctorIds ?? []
  doctorIds.forEach((id) => formData.append('doctor_ids[]', id))

  // Laravel-only quirk: PHP never parses multipart bodies for PUT/PATCH,
  // so an update with a possible file attached always goes out as POST
  // with this spoofed-method field instead.
  if (payload.isUpdate) formData.append('_method', 'PATCH')

  return formData
}

/**
 * @param {object} payload see buildServiceFormData
 * @returns {Promise<object>} the created service; rejects with `.status === 422` and `.errors` on validation failure
 */
export async function createAdminService(payload) {
  const { data } = await apiClient.post('/admin/services', buildServiceFormData(payload))
  return mapService(data)
}

/**
 * @param {string} slug
 * @param {object} payload see buildServiceFormData
 * @returns {Promise<object>} the updated service
 */
export async function updateAdminService(slug, payload) {
  const { data } = await apiClient.post(`/admin/services/${slug}`, buildServiceFormData({ ...payload, isUpdate: true }))
  return mapService(data)
}

/**
 * Laravel refuses this (422) if the service has appointment history —
 * deactivate instead in that case.
 *
 * @param {string} slug
 */
export async function deleteAdminService(slug) {
  await apiClient.delete(`/admin/services/${slug}`)
}

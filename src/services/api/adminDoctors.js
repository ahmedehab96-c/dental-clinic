import { apiClient } from './client'

// Adapts the Laravel Admin\DoctorResource shape to camelCase.
function mapDoctor(raw) {
  if (!raw) return null

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    specialty: raw.specialty,
    bio: raw.bio,
    email: raw.email,
    phone: raw.phone,
    photo: raw.photo_url,
    experienceYears: raw.experience_years,
    rating: raw.rating,
    reviewsCount: raw.reviews_count,
    education: raw.education ?? [],
    featured: raw.featured,
    isActive: raw.is_active,
    userId: raw.user_id,
    services: raw.services ?? [],
    createdAt: raw.created_at,
  }
}

/**
 * @param {{ page?: number, perPage?: number, search?: string, isActive?: boolean }} [params]
 * @returns {Promise<{ doctors: object[], meta: { currentPage: number, lastPage: number, total: number } }>}
 */
export async function fetchAdminDoctors(params = {}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.perPage) query.set('per_page', String(params.perPage))
  if (params.search) query.set('search', params.search)
  if (params.isActive !== undefined && params.isActive !== '') query.set('is_active', params.isActive ? '1' : '0')

  const search = query.toString()
  const { data, meta } = await apiClient.get(`/admin/doctors${search ? `?${search}` : ''}`)

  return {
    doctors: data.map(mapDoctor),
    meta: { currentPage: meta.current_page, lastPage: meta.last_page, total: meta.total },
  }
}

/**
 * Builds the multipart form body shared by create/update — a File under
 * `photo` is only appended when the admin actually picked a new one, so
 * editing without touching the image leaves it untouched server-side.
 */
function buildDoctorFormData(payload) {
  const formData = new FormData()
  const fields = {
    name_ar: payload.nameAr,
    name_en: payload.nameEn,
    specialty_ar: payload.specialtyAr,
    specialty_en: payload.specialtyEn,
    bio_ar: payload.bioAr,
    bio_en: payload.bioEn,
    email: payload.email,
    phone: payload.phone,
  }

  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) formData.append(key, value)
  }

  if (payload.isActive !== undefined) formData.append('is_active', payload.isActive ? '1' : '0')
  if (payload.photoFile) formData.append('photo', payload.photoFile)

  const serviceIds = payload.serviceIds ?? []
  serviceIds.forEach((id) => formData.append('service_ids[]', id))
  // Laravel-only quirk: PHP never parses multipart bodies for PUT/PATCH,
  // so an update with a possible file attached always goes out as POST
  // with this spoofed-method field instead.
  if (payload.isUpdate) formData.append('_method', 'PATCH')

  return formData
}

/**
 * @param {object} payload see buildDoctorFormData
 * @returns {Promise<object>} the created doctor; rejects with `.status === 422` and `.errors` on validation failure
 */
export async function createAdminDoctor(payload) {
  const { data } = await apiClient.post('/admin/doctors', buildDoctorFormData(payload))
  return mapDoctor(data)
}

/**
 * @param {string} slug
 * @param {object} payload see buildDoctorFormData
 * @returns {Promise<object>} the updated doctor
 */
export async function updateAdminDoctor(slug, payload) {
  const { data } = await apiClient.post(`/admin/doctors/${slug}`, buildDoctorFormData({ ...payload, isUpdate: true }))
  return mapDoctor(data)
}

/**
 * Laravel refuses this (422) if the doctor has appointment history —
 * deactivate instead in that case.
 *
 * @param {string} slug
 */
export async function deleteAdminDoctor(slug) {
  await apiClient.delete(`/admin/doctors/${slug}`)
}

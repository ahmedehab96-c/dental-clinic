import { apiClient } from './client'

// Adapts the Laravel Admin\TestimonialResource shape to camelCase.
function mapTestimonial(raw) {
  if (!raw) return null

  return {
    id: raw.id,
    name: raw.name,
    role: raw.role,
    photo: raw.photo_url,
    rating: raw.rating,
    quote: raw.quote,
    isPublished: raw.is_published,
    createdAt: raw.created_at,
  }
}

/**
 * @param {{ page?: number, perPage?: number, search?: string, rating?: number, isPublished?: boolean }} [params]
 * @returns {Promise<{ testimonials: object[], meta: { currentPage: number, lastPage: number, total: number } }>}
 */
export async function fetchAdminTestimonials(params = {}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.perPage) query.set('per_page', String(params.perPage))
  if (params.search) query.set('search', params.search)
  if (params.rating) query.set('rating', String(params.rating))
  if (params.isPublished !== undefined && params.isPublished !== '') {
    query.set('is_published', params.isPublished ? '1' : '0')
  }

  const search = query.toString()
  const { data, meta } = await apiClient.get(`/admin/testimonials${search ? `?${search}` : ''}`)

  return {
    testimonials: data.map(mapTestimonial),
    meta: { currentPage: meta.current_page, lastPage: meta.last_page, total: meta.total },
  }
}

/**
 * @param {string|number} id
 * @returns {Promise<object>}
 */
export async function fetchAdminTestimonial(id) {
  const { data } = await apiClient.get(`/admin/testimonials/${id}`)
  return mapTestimonial(data)
}

/**
 * Builds the multipart form body shared by create/update — a File under
 * `photo` is only appended when the admin actually picked a new one, so
 * editing without touching the image leaves it untouched server-side.
 */
function buildTestimonialFormData(payload) {
  const formData = new FormData()
  const fields = {
    patient_name_ar: payload.nameAr,
    patient_name_en: payload.nameEn,
    role_ar: payload.roleAr,
    role_en: payload.roleEn,
    rating: payload.rating,
    quote_ar: payload.quoteAr,
    quote_en: payload.quoteEn,
  }

  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) formData.append(key, value)
  }

  if (payload.isPublished !== undefined) formData.append('is_published', payload.isPublished ? '1' : '0')
  if (payload.photoFile) formData.append('photo', payload.photoFile)

  // Laravel-only quirk: PHP never parses multipart bodies for PUT/PATCH,
  // so an update with a possible file attached always goes out as POST
  // with this spoofed-method field instead.
  if (payload.isUpdate) formData.append('_method', 'PATCH')

  return formData
}

/**
 * @param {object} payload see buildTestimonialFormData
 * @returns {Promise<object>} the created testimonial; rejects with `.status === 422` and `.errors` on validation failure
 */
export async function createAdminTestimonial(payload) {
  const { data } = await apiClient.post('/admin/testimonials', buildTestimonialFormData(payload))
  return mapTestimonial(data)
}

/**
 * @param {string|number} id
 * @param {object} payload see buildTestimonialFormData
 * @returns {Promise<object>} the updated testimonial
 */
export async function updateAdminTestimonial(id, payload) {
  const { data } = await apiClient.post(`/admin/testimonials/${id}`, buildTestimonialFormData({ ...payload, isUpdate: true }))
  return mapTestimonial(data)
}

/**
 * @param {string|number} id
 */
export async function deleteAdminTestimonial(id) {
  await apiClient.delete(`/admin/testimonials/${id}`)
}

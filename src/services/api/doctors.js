import { apiClient } from './client'

// Adapts the Laravel DoctorResource shape (snake_case, photo_url, ...) to
// the same camelCase shape src/data/mock/doctors.js already used, so every
// component that consumes a doctor object needs zero changes.
function mapDoctor(raw) {
  if (!raw) return null

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    specialty: raw.specialty,
    bio: raw.bio,
    photo: raw.photo_url,
    experienceYears: raw.experience_years,
    rating: raw.rating,
    reviewsCount: raw.reviews_count,
    education: raw.education ?? [],
    featured: raw.featured,
    serviceSlugs: (raw.services ?? []).map((service) => service.slug),
  }
}

/**
 * @param {{ service?: string, featured?: boolean, perPage?: number }} [params]
 * @returns {Promise<object[]>}
 */
export async function fetchDoctors(params = {}) {
  const query = new URLSearchParams()
  if (params.service) query.set('service', params.service)
  if (params.featured !== undefined) query.set('featured', params.featured ? '1' : '0')
  if (params.perPage) query.set('per_page', String(params.perPage))

  const search = query.toString()
  const { data } = await apiClient.get(`/doctors${search ? `?${search}` : ''}`)

  return data.map(mapDoctor)
}

export async function fetchFeaturedDoctors() {
  return fetchDoctors({ featured: true, perPage: 6 })
}

/**
 * @param {string} slug
 * @returns {Promise<object>} rejects with a `.status === 404` error when unknown
 */
export async function fetchDoctorBySlug(slug) {
  const { data } = await apiClient.get(`/doctors/${slug}`)
  return mapDoctor(data)
}

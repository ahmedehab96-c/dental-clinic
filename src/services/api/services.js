import { apiClient } from './client'

// Adapts the Laravel ServiceResource shape to the camelCase shape
// src/data/mock/services.js already used, so consuming components need no changes.
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
    features: raw.features ?? [],
    doctorSlugs: (raw.doctors ?? []).map((doctor) => doctor.slug),
  }
}

/**
 * @param {{ search?: string, perPage?: number }} [params]
 * @returns {Promise<object[]>}
 */
export async function fetchServices(params = {}) {
  const query = new URLSearchParams()
  if (params.search) query.set('search', params.search)
  if (params.perPage) query.set('per_page', String(params.perPage))

  const search = query.toString()
  const { data } = await apiClient.get(`/services${search ? `?${search}` : ''}`)

  return data.map(mapService)
}

/**
 * @param {string} slug
 * @returns {Promise<object>} rejects with a `.status === 404` error when unknown
 */
export async function fetchServiceBySlug(slug) {
  const { data } = await apiClient.get(`/services/${slug}`)
  return mapService(data)
}

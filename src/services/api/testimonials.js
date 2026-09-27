import { apiClient } from './client'

// Adapts the Laravel TestimonialResource shape to the camelCase shape
// src/data/mock/testimonials.js already used, so consuming components need no changes.
function mapTestimonial(raw) {
  if (!raw) return null

  return {
    id: raw.id,
    name: raw.name,
    role: raw.role,
    photo: raw.photo_url,
    rating: raw.rating,
    quote: raw.quote,
  }
}

/**
 * @returns {Promise<object[]>}
 */
export async function fetchTestimonials() {
  const { data } = await apiClient.get('/testimonials')
  return data.map(mapTestimonial)
}

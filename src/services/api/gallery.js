import { apiClient } from './client'

// Adapts the Laravel GalleryCaseResource shape to the camelCase shape
// src/data/mock/gallery.js already used, so consuming components need no changes.
function mapGalleryCase(raw) {
  if (!raw) return null

  return {
    id: raw.id,
    title: raw.title,
    category: raw.category,
    beforeImage: raw.before_image_url,
    afterImage: raw.after_image_url,
  }
}

/**
 * @param {{ service?: string, perPage?: number }} [params]
 * @returns {Promise<object[]>}
 */
export async function fetchGalleryCases(params = {}) {
  const query = new URLSearchParams()
  if (params.service) query.set('service', params.service)
  if (params.perPage) query.set('per_page', String(params.perPage))

  const search = query.toString()
  const { data } = await apiClient.get(`/gallery${search ? `?${search}` : ''}`)

  return data.map(mapGalleryCase)
}

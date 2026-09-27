import { apiClient } from './client'

// Adapts the Laravel BlogPostResource shape to the camelCase shape
// src/data/mock/blog.js already used, so consuming components need no changes.
function mapPost(raw) {
  if (!raw) return null

  return {
    id: raw.id,
    slug: raw.slug,
    category: raw.category,
    title: raw.title,
    excerpt: raw.excerpt,
    content: raw.content,
    image: raw.image_url,
    author: raw.author,
    date: raw.date,
    readMinutes: raw.read_minutes,
  }
}

/**
 * @param {{ category?: string, search?: string, perPage?: number }} [params]
 * @returns {Promise<object[]>}
 */
export async function fetchPosts(params = {}) {
  const query = new URLSearchParams()
  if (params.category) query.set('category', params.category)
  if (params.search) query.set('search', params.search)
  if (params.perPage) query.set('per_page', String(params.perPage))

  const search = query.toString()
  const { data } = await apiClient.get(`/posts${search ? `?${search}` : ''}`)

  return data.map(mapPost)
}

/**
 * @param {string} slug
 * @returns {Promise<object>} rejects with a `.status === 404` error when unknown
 */
export async function fetchPostBySlug(slug) {
  const { data } = await apiClient.get(`/posts/${slug}`)
  return mapPost(data)
}

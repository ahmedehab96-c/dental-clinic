import { apiClient } from './client'

// Adapts the Laravel Admin\BlogPostResource shape to camelCase.
function mapPost(raw) {
  if (!raw) return null

  return {
    id: raw.id,
    slug: raw.slug,
    category: raw.category ?? null,
    title: raw.title,
    excerpt: raw.excerpt,
    content: raw.content,
    image: raw.image_url,
    author: raw.author ?? null,
    status: raw.status,
    publishedAt: raw.published_at,
    readMinutes: raw.read_minutes,
    createdAt: raw.created_at,
  }
}

function mapCategory(raw) {
  if (!raw) return null

  return { id: raw.id, key: raw.key, label: raw.label }
}

/**
 * @param {{ page?: number, perPage?: number, search?: string, category?: string, status?: 'draft'|'published' }} [params]
 * @returns {Promise<{ posts: object[], meta: { currentPage: number, lastPage: number, total: number } }>}
 */
export async function fetchAdminPosts(params = {}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.perPage) query.set('per_page', String(params.perPage))
  if (params.search) query.set('search', params.search)
  if (params.category) query.set('category', params.category)
  if (params.status) query.set('status', params.status)

  const search = query.toString()
  const { data, meta } = await apiClient.get(`/admin/posts${search ? `?${search}` : ''}`)

  return {
    posts: data.map(mapPost),
    meta: { currentPage: meta.current_page, lastPage: meta.last_page, total: meta.total },
  }
}

/**
 * @param {string|number} id
 * @returns {Promise<object>}
 */
export async function fetchAdminPost(id) {
  const { data } = await apiClient.get(`/admin/posts/${id}`)
  return mapPost(data)
}

/**
 * @returns {Promise<object[]>} the shared category list used for both the filter and the form
 */
export async function fetchAdminBlogCategories() {
  const { data } = await apiClient.get('/admin/blog-categories')
  return data.map(mapCategory)
}

/**
 * Builds the multipart form body shared by create/update — a File under
 * `image` is only appended when the admin actually picked a new one, so
 * editing without touching the image leaves it untouched server-side.
 * Content is edited as plain multi-line text and split into a paragraph
 * array here, matching the `content_ar`/`content_en` JSON columns.
 */
function buildPostFormData(payload) {
  const formData = new FormData()
  const fields = {
    slug: payload.slug,
    category_id: payload.categoryId,
    title_ar: payload.titleAr,
    title_en: payload.titleEn,
    excerpt_ar: payload.excerptAr,
    excerpt_en: payload.excerptEn,
  }

  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) formData.append(key, value)
  }

  if (payload.contentAr !== undefined) {
    toParagraphs(payload.contentAr).forEach((paragraph) => formData.append('content_ar[]', paragraph))
  }
  if (payload.contentEn !== undefined) {
    toParagraphs(payload.contentEn).forEach((paragraph) => formData.append('content_en[]', paragraph))
  }

  if (payload.status !== undefined) formData.append('status', payload.status)
  if (payload.status === 'published' && payload.publishedAt) formData.append('published_at', payload.publishedAt)
  if (payload.imageFile) formData.append('image', payload.imageFile)

  // Laravel-only quirk: PHP never parses multipart bodies for PUT/PATCH,
  // so an update with a possible file attached always goes out as POST
  // with this spoofed-method field instead.
  if (payload.isUpdate) formData.append('_method', 'PATCH')

  return formData
}

/** Splits a textarea's plain text into non-empty paragraphs on blank lines. */
function toParagraphs(text) {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

/** Joins a paragraph array back into editable multi-line text. */
export function paragraphsToText(paragraphs) {
  return (paragraphs ?? []).join('\n\n')
}

/**
 * @param {object} payload see buildPostFormData
 * @returns {Promise<object>} the created post; rejects with `.status === 422` and `.errors` on validation failure
 */
export async function createAdminPost(payload) {
  const { data } = await apiClient.post('/admin/posts', buildPostFormData(payload))
  return mapPost(data)
}

/**
 * @param {string} slug
 * @param {object} payload see buildPostFormData
 * @returns {Promise<object>} the updated post
 */
export async function updateAdminPost(slug, payload) {
  const { data } = await apiClient.post(`/admin/posts/${slug}`, buildPostFormData({ ...payload, isUpdate: true }))
  return mapPost(data)
}

/**
 * @param {string} slug
 */
export async function deleteAdminPost(slug) {
  await apiClient.delete(`/admin/posts/${slug}`)
}

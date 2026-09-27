import { apiClient } from './client'

// Adapts the Laravel Admin\FaqResource shape to camelCase.
function mapFaq(raw) {
  if (!raw) return null

  return {
    id: raw.id,
    question: raw.question,
    answer: raw.answer,
    sortOrder: raw.sort_order,
    isPublished: raw.is_published,
    createdAt: raw.created_at,
  }
}

/**
 * @param {{ page?: number, perPage?: number, search?: string, isPublished?: boolean }} [params]
 * @returns {Promise<{ faqs: object[], meta: { currentPage: number, lastPage: number, total: number } }>}
 */
export async function fetchAdminFaqs(params = {}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.perPage) query.set('per_page', String(params.perPage))
  if (params.search) query.set('search', params.search)
  if (params.isPublished !== undefined && params.isPublished !== '') {
    query.set('is_published', params.isPublished ? '1' : '0')
  }

  const search = query.toString()
  const { data, meta } = await apiClient.get(`/admin/faqs${search ? `?${search}` : ''}`)

  return {
    faqs: data.map(mapFaq),
    meta: { currentPage: meta.current_page, lastPage: meta.last_page, total: meta.total },
  }
}

/**
 * @param {string|number} id
 * @returns {Promise<object>}
 */
export async function fetchAdminFaq(id) {
  const { data } = await apiClient.get(`/admin/faqs/${id}`)
  return mapFaq(data)
}

/** No file uploads on this resource, so create/update send plain JSON — no FormData needed. */
function buildFaqPayload(payload) {
  const body = {
    question_ar: payload.questionAr,
    question_en: payload.questionEn,
    answer_ar: payload.answerAr,
    answer_en: payload.answerEn,
  }
  if (payload.sortOrder !== undefined) body.sort_order = payload.sortOrder
  if (payload.isPublished !== undefined) body.is_published = payload.isPublished

  return body
}

/**
 * @param {object} payload see buildFaqPayload
 * @returns {Promise<object>} the created FAQ; rejects with `.status === 422` and `.errors` on validation failure
 */
export async function createAdminFaq(payload) {
  const { data } = await apiClient.post('/admin/faqs', buildFaqPayload(payload))
  return mapFaq(data)
}

/**
 * @param {string|number} id
 * @param {object} payload see buildFaqPayload
 * @returns {Promise<object>} the updated FAQ
 */
export async function updateAdminFaq(id, payload) {
  const { data } = await apiClient.patch(`/admin/faqs/${id}`, buildFaqPayload(payload))
  return mapFaq(data)
}

/**
 * @param {string|number} id
 */
export async function deleteAdminFaq(id) {
  await apiClient.delete(`/admin/faqs/${id}`)
}

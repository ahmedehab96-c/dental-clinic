import { apiClient } from './client'

// Adapts the Laravel FaqResource shape — question/answer stay bilingual
// { ar, en } objects here; FaqSection resolves the active language via
// tr() before handing plain strings to the shared FaqAccordion component.
function mapFaq(raw) {
  if (!raw) return null

  return {
    id: raw.id,
    question: raw.question,
    answer: raw.answer,
  }
}

/**
 * @returns {Promise<object[]>}
 */
export async function fetchFaqs() {
  const { data } = await apiClient.get('/faqs')
  return data.map(mapFaq)
}

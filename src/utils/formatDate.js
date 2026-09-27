export function formatDate(isoDate, language = 'en') {
  const locale = language === 'ar' ? 'ar-SA' : 'en-US'
  return new Date(isoDate).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

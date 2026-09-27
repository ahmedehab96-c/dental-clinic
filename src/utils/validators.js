const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Accepts +9665XXXXXXXX, 9665XXXXXXXX, or local 05XXXXXXXX formats.
const PHONE_PATTERN = /^(\+?966|0)?5\d{8}$/

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(value.trim())
}

export function isValidPhone(value) {
  return PHONE_PATTERN.test(value.replace(/[\s-]/g, ''))
}

export function isRequired(value) {
  return typeof value === 'string' ? value.trim().length > 0 : Boolean(value)
}

// Matches RegisterRequest's `password` rule (min:8) on the Laravel side.
export function isValidPassword(value) {
  return typeof value === 'string' && value.length >= 8
}

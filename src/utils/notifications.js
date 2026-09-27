// Presentation helpers for stored notifications. The API returns structured
// data (kind, status, bilingual service/doctor names…); the sentence itself
// is built here through the normal i18n dictionaries, so switching language
// re-renders every notification correctly.

const CHANGED_EVENT = 'notifications:changed'

/** Tell every mounted bell/page to refresh (after mark-read, mark-all…). */
export function emitNotificationsChanged() {
  window.dispatchEvent(new Event(CHANGED_EVENT))
}

export function onNotificationsChanged(handler) {
  window.addEventListener(CHANGED_EVENT, handler)
  return () => window.removeEventListener(CHANGED_EVENT, handler)
}

const BASE_BY_ROLE = { admin: '/admin', doctor: '/doctor' }

/** The notifications page for this user's own area. */
export function notificationsPathFor(user) {
  return `${BASE_BY_ROLE[user?.role] ?? ''}/notifications`
}

/** Where an appointment notification should lead for this user's role. */
export function notificationLinkFor(notification, user) {
  if (!notification.data?.appointment_id) return null
  return `${BASE_BY_ROLE[user?.role] ?? ''}/appointments`
}

// Each value is wrapped in a Unicode first-strong isolate (FSI…PDI) so Latin
// tokens like "(APT-5VEGTD)" or "2026-09-28" keep their own direction inside
// an Arabic sentence instead of being reordered by the bidi algorithm.
const isolate = (value) => `\u2068${value ?? ''}\u2069`

function fill(template, values) {
  return Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, isolate(value)), template)
}

/**
 * @returns {{ title: string, body: string }}
 */
export function describeNotification(notification, user, { t, tr }) {
  const data = notification.data ?? {}
  const isPatient = user?.role === 'patient'
  const values = {
    reference: data.reference,
    service: data.service ? tr(data.service) : '—',
    doctor: data.doctor ? tr(data.doctor) : '',
    patient: data.patient_name,
    date: data.date,
    time: data.time,
    status: t(`appointmentsPage.status.${data.status}`),
  }

  if (notification.kind === 'appointment_created') {
    const key = isPatient ? 'patient' : 'staff'
    return {
      title: t(`notifications.kinds.appointmentCreated.${key}.title`),
      body: fill(t(`notifications.kinds.appointmentCreated.${key}.body`), values),
    }
  }

  if (notification.kind === 'appointment_status_changed') {
    const known = ['confirmed', 'completed', 'cancelled'].includes(data.status)
    const titleKey = known ? data.status : 'other'
    const byPatient = !isPatient && data.actor_role === 'patient'
    const bodyKey = isPatient ? 'patient' : byPatient ? 'staffByPatient' : 'staff'

    return {
      title: fill(t(`notifications.kinds.statusChanged.titles.${titleKey}`), values),
      body: fill(t(`notifications.kinds.statusChanged.${bodyKey}`), values),
    }
  }

  return { title: t('notifications.kinds.generic'), body: '' }
}

/** "5 minutes ago" / "منذ 5 دقائق" via the browser's Intl — no dependency. */
export function formatRelativeTime(isoDate, language) {
  if (!isoDate) return ''
  const seconds = Math.round((new Date(isoDate).getTime() - Date.now()) / 1000)
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  const formatter = new Intl.RelativeTimeFormat(language, { numeric: 'auto' })

  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return formatter.format(Math.round(seconds / size), unit)
  }
  return formatter.format(seconds, 'second')
}

import { apiClient } from './client'

// Adapts the Laravel AppointmentResource shape to the camelCase shape the
// booking UI works with.
function mapAppointment(raw) {
  if (!raw) return null

  return {
    id: raw.id,
    reference: raw.reference,
    status: raw.status,
    service: raw.service,
    doctor: raw.doctor,
    date: raw.date,
    time: raw.time,
    patient: raw.patient,
    notes: raw.notes,
  }
}

/**
 * The next bookable dates (skips days the clinic is closed) — feeds the
 * booking form's date picker. Laravel decides what counts as bookable.
 *
 * @returns {Promise<string[]>} dates as 'YYYY-MM-DD'
 */
export async function fetchAvailableDates() {
  const { data } = await apiClient.get('/availability')
  return data.dates
}

/**
 * Time slots for one date (optionally scoped to a doctor). Laravel is the
 * only source of truth for which slots are actually free — it already
 * accounts for working hours, closed days, and existing bookings.
 *
 * @param {{ date: string, doctorId?: number|null }} params
 * @returns {Promise<{ time: string, available: boolean }[]>}
 */
export async function fetchTimeSlots({ date, doctorId }) {
  const query = new URLSearchParams({ date })
  if (doctorId) query.set('doctor_id', String(doctorId))

  const { data } = await apiClient.get(`/availability?${query.toString()}`)
  return data
}

/**
 * Books an appointment. Guest-allowed — if an auth token is present
 * (see client.js), Laravel links the appointment to that user automatically;
 * no separate "authenticated booking" call is needed.
 *
 * @param {{
 *   serviceId: number,
 *   doctorId: number|null,
 *   date: string,
 *   time: string,
 *   name: string,
 *   phone: string,
 *   email: string,
 *   notes: string,
 * }} payload
 * @returns {Promise<object>} rejects with `.status` (409 = slot taken, 422 = validation, ...) on failure
 */
export async function bookAppointment(payload) {
  const { data } = await apiClient.post('/appointments', {
    service_id: payload.serviceId,
    doctor_id: payload.doctorId ?? null,
    date: payload.date,
    time: payload.time,
    patient_name: payload.name,
    patient_phone: payload.phone,
    patient_email: payload.email,
    notes: payload.notes || null,
  })

  return mapAppointment(data)
}

/**
 * The authenticated user's own appointments.
 *
 * @param {{ perPage?: number }} [params]
 * @returns {Promise<object[]>}
 */
export async function fetchMyAppointments(params = {}) {
  const query = new URLSearchParams()
  if (params.perPage) query.set('per_page', String(params.perPage))

  const search = query.toString()
  const { data } = await apiClient.get(`/me/appointments${search ? `?${search}` : ''}`)
  return data.map(mapAppointment)
}

/**
 * Cancels one of the authenticated user's own appointments. Laravel is the
 * only place ownership and "is this still cancellable" are decided (see
 * AppointmentPolicy::cancel) — this never trusts anything the client
 * computed about whose appointment it is.
 *
 * @param {number} appointmentId
 * @returns {Promise<object>} the updated (now cancelled) appointment; rejects with `.status === 403` if not allowed
 */
export async function cancelAppointment(appointmentId) {
  const { data } = await apiClient.post(`/me/appointments/${appointmentId}/cancel`)
  return mapAppointment(data)
}

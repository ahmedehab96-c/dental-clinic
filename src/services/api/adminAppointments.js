import { apiClient } from './client'

// Adapts the Laravel AppointmentResource shape — mirrors services/api/appointments.js's
// mapper, duplicated locally so this module has no cross-dependency (same
// convention as services/api/admin.js).
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
    createdAt: raw.created_at,
  }
}

/**
 * @param {{
 *   page?: number, perPage?: number, status?: string, doctorId?: number,
 *   serviceId?: number, date?: string, search?: string,
 * }} [params]
 * @returns {Promise<{ appointments: object[], meta: { currentPage: number, lastPage: number, total: number, perPage: number } }>}
 */
export async function fetchAppointments(params = {}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.perPage) query.set('per_page', String(params.perPage))
  if (params.status) query.set('status', params.status)
  if (params.doctorId) query.set('doctor_id', String(params.doctorId))
  if (params.serviceId) query.set('service_id', String(params.serviceId))
  if (params.date) query.set('date', params.date)
  if (params.search) query.set('search', params.search)

  const search = query.toString()
  const { data, meta } = await apiClient.get(`/admin/appointments${search ? `?${search}` : ''}`)

  return {
    appointments: data.map(mapAppointment),
    meta: {
      currentPage: meta.current_page,
      lastPage: meta.last_page,
      total: meta.total,
      perPage: meta.per_page,
    },
  }
}

/**
 * @param {number} appointmentId
 * @param {'pending'|'confirmed'|'completed'|'cancelled'} status
 * @returns {Promise<object>} the updated appointment
 */
export async function updateAppointmentStatus(appointmentId, status) {
  const { data } = await apiClient.patch(`/admin/appointments/${appointmentId}/status`, { status })
  return mapAppointment(data)
}

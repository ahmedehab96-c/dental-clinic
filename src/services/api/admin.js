import { apiClient } from './client'

/**
 * @returns {Promise<{
 *   totalPatients: number, totalDoctors: number, totalServices: number,
 *   todayAppointments: number, pendingAppointments: number, confirmedAppointments: number,
 * }>}
 */
export async function fetchDashboardStats() {
  const { data } = await apiClient.get('/admin/dashboard')

  return {
    totalPatients: data.total_patients,
    totalDoctors: data.total_doctors,
    totalServices: data.total_services,
    todayAppointments: data.today_appointments,
    pendingAppointments: data.pending_appointments,
    confirmedAppointments: data.confirmed_appointments,
  }
}

// Adapts the Laravel AppointmentResource shape — same as services/api/appointments.js,
// duplicated locally so this module has no dependency on the patient-area service.
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
 * Every appointment in the system (admin-only) — used by the dashboard's
 * recent/upcoming widgets. Laravel decides sort order and filtering.
 *
 * @param {{ status?: string, doctorId?: number, date?: string, perPage?: number }} [params]
 * @returns {Promise<object[]>}
 */
export async function fetchAdminAppointments(params = {}) {
  const query = new URLSearchParams()
  if (params.status) query.set('status', params.status)
  if (params.doctorId) query.set('doctor_id', String(params.doctorId))
  if (params.date) query.set('date', params.date)
  if (params.perPage) query.set('per_page', String(params.perPage))

  const search = query.toString()
  const { data } = await apiClient.get(`/admin/appointments${search ? `?${search}` : ''}`)
  return data.map(mapAppointment)
}

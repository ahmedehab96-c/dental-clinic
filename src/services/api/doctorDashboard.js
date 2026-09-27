import { apiClient } from './client'

// Every call here hits /doctor/*, which Laravel scopes to the authenticated
// doctor's own linked profile — no doctor id is ever sent from the client.

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

function mapProfile(raw) {
  if (!raw) return null

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    specialty: raw.specialty,
    bio: raw.bio,
    email: raw.email,
    phone: raw.phone,
    photo: raw.photo_url,
    isActive: raw.is_active,
    services: raw.services ?? [],
  }
}

/**
 * @returns {Promise<{
 *   totalAppointments: number, todayAppointments: number, upcomingAppointments: number,
 *   pendingAppointments: number, confirmedAppointments: number, completedAppointments: number,
 *   cancelledAppointments: number, servicesCount: number,
 * }>} rejects with `.status === 404` when no doctor profile is linked yet
 */
export async function fetchDoctorDashboard() {
  const { data } = await apiClient.get('/doctor/dashboard')

  return {
    totalAppointments: data.total_appointments,
    todayAppointments: data.today_appointments,
    upcomingAppointments: data.upcoming_appointments,
    pendingAppointments: data.pending_appointments,
    confirmedAppointments: data.confirmed_appointments,
    completedAppointments: data.completed_appointments,
    cancelledAppointments: data.cancelled_appointments,
    servicesCount: data.services_count,
  }
}

/**
 * @param {{ page?: number, perPage?: number, scope?: 'today'|'upcoming'|'past', status?: string }} [params]
 * @returns {Promise<{ appointments: object[], meta: { currentPage: number, lastPage: number, total: number } }>}
 */
export async function fetchDoctorAppointments(params = {}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.perPage) query.set('per_page', String(params.perPage))
  if (params.scope) query.set('scope', params.scope)
  if (params.status) query.set('status', params.status)

  const search = query.toString()
  const { data, meta } = await apiClient.get(`/doctor/appointments${search ? `?${search}` : ''}`)

  return {
    appointments: data.map(mapAppointment),
    meta: { currentPage: meta.current_page, lastPage: meta.last_page, total: meta.total },
  }
}

/**
 * @param {number} id
 * @returns {Promise<object>} rejects with `.status === 403` for another doctor's appointment
 */
export async function fetchDoctorAppointment(id) {
  const { data } = await apiClient.get(`/doctor/appointments/${id}`)
  return mapAppointment(data)
}

/**
 * Laravel only allows the forward moves in STATUS_TRANSITIONS; anything else is a 422.
 *
 * @param {number} id
 * @param {'confirmed'|'completed'|'cancelled'} status
 */
export async function updateDoctorAppointmentStatus(id, status) {
  const { data } = await apiClient.patch(`/doctor/appointments/${id}/status`, { status })
  return mapAppointment(data)
}

export async function fetchDoctorProfile() {
  const { data } = await apiClient.get('/doctor/profile')
  return mapProfile(data)
}

/**
 * Multipart (POST + `_method=PATCH`) so a new photo can ride along; the
 * photo is only appended when the doctor picked one.
 */
export async function updateDoctorProfile(payload) {
  const formData = new FormData()
  const fields = {
    name_ar: payload.nameAr,
    name_en: payload.nameEn,
    specialty_ar: payload.specialtyAr,
    specialty_en: payload.specialtyEn,
    bio_ar: payload.bioAr,
    bio_en: payload.bioEn,
    email: payload.email,
    phone: payload.phone,
  }

  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) formData.append(key, value ?? '')
  }
  if (payload.photoFile) formData.append('photo', payload.photoFile)
  formData.append('_method', 'PATCH')

  const { data } = await apiClient.post('/doctor/profile', formData)
  return mapProfile(data)
}

export async function fetchDoctorServices() {
  const { data } = await apiClient.get('/doctor/services')
  return data.map((service) => ({ id: service.id, slug: service.slug, name: service.name, image: service.image_url }))
}

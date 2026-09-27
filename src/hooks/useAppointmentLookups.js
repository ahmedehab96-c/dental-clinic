import { useMemo } from 'react'
import { useApiData } from './useApiData'
import { fetchDoctors } from '@/services/api/doctors'
import { fetchServices } from '@/services/api/services'

const fetchAllDoctors = () => fetchDoctors({ perPage: 100 })
const fetchAllServices = () => fetchServices({ perPage: 100 })

/**
 * AppointmentResource only ever returns { id, slug } for the doctor/service
 * on an appointment (it was designed for the booking form, which already
 * has the full objects in memory) — so a page that loads appointments cold
 * needs to resolve those ids against the full lists to show real names.
 */
export function useAppointmentLookups() {
  const { data: doctors, loading: doctorsLoading } = useApiData(fetchAllDoctors, [])
  const { data: services, loading: servicesLoading } = useApiData(fetchAllServices, [])

  const doctorsById = useMemo(() => Object.fromEntries((doctors ?? []).map((doctor) => [doctor.id, doctor])), [doctors])
  const servicesById = useMemo(
    () => Object.fromEntries((services ?? []).map((service) => [service.id, service])),
    [services],
  )

  return {
    doctors: doctors ?? [],
    services: services ?? [],
    doctorsById,
    servicesById,
    loading: doctorsLoading || servicesLoading,
  }
}

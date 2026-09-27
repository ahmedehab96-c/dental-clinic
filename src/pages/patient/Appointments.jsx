import { useState } from 'react'
import { motion } from 'framer-motion'
import PageHero from '@/components/layout/PageHero'
import AsyncState from '@/components/ui/AsyncState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import PatientTabs from '@/components/patient/PatientTabs'
import AppointmentCard from '@/components/patient/AppointmentCard'
import { useApiData } from '@/hooks/useApiData'
import { useAppointmentLookups } from '@/hooks/useAppointmentLookups'
import { fetchMyAppointments, cancelAppointment } from '@/services/api/appointments'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const fetchAllAppointments = () => fetchMyAppointments({ perPage: 50 })

export default function Appointments() {
  const { t, tr } = useLanguage()
  usePageTitle(t('nav.appointments'), { description: t('appointmentsPage.heroSubtitle') })

  const [reloadKey, setReloadKey] = useState(0)
  const { data: appointments, loading, error } = useApiData(fetchAllAppointments, [reloadKey])
  const { doctorsById, servicesById } = useAppointmentLookups()

  const [pendingCancel, setPendingCancel] = useState(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [banner, setBanner] = useState(null) // { type: 'success' | 'error', message }

  const nameFor = (appointment) => {
    const doctor = appointment.doctor ? doctorsById[appointment.doctor.id] : null
    return doctor ? tr(doctor.name) : null
  }
  const serviceNameFor = (appointment) => {
    const service = servicesById[appointment.service?.id]
    return service ? tr(service.name) : null
  }

  const handleConfirmCancel = async () => {
    if (!pendingCancel) return
    setIsCancelling(true)

    try {
      await cancelAppointment(pendingCancel.id)
      setBanner({ type: 'success', message: t('appointmentsPage.cancelSuccess') })
      setPendingCancel(null)
      setReloadKey((key) => key + 1)
    } catch {
      setBanner({ type: 'error', message: t('appointmentsPage.cancelError') })
      setPendingCancel(null)
    } finally {
      setIsCancelling(false)
    }
  }

  const list = appointments ?? []

  return (
    <>
      <PageHero
        eyebrow={t('appointmentsPage.heroEyebrow')}
        title={t('appointmentsPage.heroTitle')}
        subtitle={t('appointmentsPage.heroSubtitle')}
      />

      <section className="py-14 sm:py-20">
        <div className="container-app">
          <PatientTabs />

          {banner && (
            <div
              role="alert"
              className={`mx-auto mt-8 max-w-3xl rounded-2xl border px-4 py-3 text-center text-sm font-medium ${
                banner.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-red-200 bg-red-50 text-red-600'
              }`}
            >
              {banner.message}
            </div>
          )}

          <div className="mx-auto mt-8 max-w-3xl">
            {loading && <AsyncState status="loading" />}
            {!loading && error && <AsyncState status="error" />}
            {!loading && !error && list.length === 0 && <AsyncState status="empty" />}

            {!loading && !error && list.length > 0 && (
              <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-4">
                {list.map((appointment) => (
                  <motion.div key={appointment.id} variants={item}>
                    <AppointmentCard
                      appointment={appointment}
                      doctorName={nameFor(appointment)}
                      serviceName={serviceNameFor(appointment)}
                      onCancelClick={(target) => {
                        setBanner(null)
                        setPendingCancel(target)
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <ConfirmDialog
        open={Boolean(pendingCancel)}
        title={t('appointmentsPage.cancelConfirmTitle')}
        message={t('appointmentsPage.cancelConfirmMessage')}
        confirmLabel={t('appointmentsPage.cancelConfirmButton')}
        cancelLabel={t('appointmentsPage.cancelDismissButton')}
        onConfirm={handleConfirmCancel}
        onCancel={() => setPendingCancel(null)}
        loading={isCancelling}
      />
    </>
  )
}

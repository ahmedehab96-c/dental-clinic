import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { FaRegCalendarCheck } from 'react-icons/fa'
import { HiOutlineEnvelope, HiOutlinePhone, HiOutlineSparkles } from 'react-icons/hi2'
import PageHero from '@/components/layout/PageHero'
import Button from '@/components/ui/Button'
import AsyncState from '@/components/ui/AsyncState'
import PatientTabs from '@/components/patient/PatientTabs'
import AppointmentCard from '@/components/patient/AppointmentCard'
import { useAuth } from '@/hooks/useAuth'
import { useApiData } from '@/hooks/useApiData'
import { useAppointmentLookups } from '@/hooks/useAppointmentLookups'
import { fetchMyAppointments } from '@/services/api/appointments'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'

const fetchAppointments = () => fetchMyAppointments({ perPage: 50 })

export default function Dashboard() {
  const { t, tr } = useLanguage()
  const { user } = useAuth()
  usePageTitle(t('nav.dashboard'))

  const { data: appointments, loading, error } = useApiData(fetchAppointments, [])
  const { doctorsById, servicesById } = useAppointmentLookups()

  const { upcoming, recent } = useMemo(() => {
    const list = appointments ?? []
    const todayStr = new Date().toISOString().slice(0, 10)
    const byDateTimeAsc = [...list].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    const upcomingAppointment = byDateTimeAsc.find(
      (appointment) => appointment.date >= todayStr && ['pending', 'confirmed'].includes(appointment.status),
    )
    const recentAppointments = [...list]
      .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`))
      .filter((appointment) => appointment.id !== upcomingAppointment?.id)
      .slice(0, 3)

    return { upcoming: upcomingAppointment, recent: recentAppointments }
  }, [appointments])

  const nameFor = (appointment) => {
    const doctor = appointment.doctor ? doctorsById[appointment.doctor.id] : null
    return doctor ? tr(doctor.name) : null
  }
  const serviceNameFor = (appointment) => {
    const service = servicesById[appointment.service?.id]
    return service ? tr(service.name) : null
  }

  return (
    <>
      <PageHero
        eyebrow={t('dashboardPage.welcome')}
        title={user?.name ? `${t('dashboardPage.welcome')}, ${user.name}` : t('dashboardPage.welcome')}
        subtitle={t('dashboardPage.subtitle')}
      />

      <section className="py-14 sm:py-20">
        <div className="container-app">
          <PatientTabs />

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <h2 className="font-heading text-lg font-bold text-ink-900">{t('dashboardPage.upcomingTitle')}</h2>

                <div className="mt-4">
                  {loading && <AsyncState status="loading" />}
                  {!loading && error && <AsyncState status="error" />}
                  {!loading && !error && !upcoming && (
                    <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 px-5 py-8 text-center text-sm text-ink-500">
                      {t('dashboardPage.noUpcoming')}
                    </div>
                  )}
                  {!loading && !error && upcoming && (
                    <AppointmentCard
                      appointment={upcoming}
                      doctorName={nameFor(upcoming)}
                      serviceName={serviceNameFor(upcoming)}
                    />
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-bold text-ink-900">{t('dashboardPage.recentTitle')}</h2>
                  <Button to="/appointments" variant="outline" size="md">
                    {t('dashboardPage.viewAllAppointments')}
                  </Button>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  {!loading && !error && recent.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 px-5 py-8 text-center text-sm text-ink-500">
                      {t('dashboardPage.noRecent')}
                    </div>
                  )}
                  {!loading &&
                    !error &&
                    recent.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        doctorName={nameFor(appointment)}
                        serviceName={serviceNameFor(appointment)}
                        compact
                      />
                    ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 }}
              className="flex flex-col gap-6"
            >
              <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
                <h2 className="font-heading text-base font-bold text-ink-900">{t('dashboardPage.profileSummaryTitle')}</h2>
                <p className="mt-3 text-lg font-semibold text-ink-900">{user?.name}</p>
                <div className="mt-3 flex flex-col gap-2 text-sm text-ink-500">
                  <span className="flex items-center gap-2">
                    <HiOutlineEnvelope className="text-base" />
                    {user?.email}
                  </span>
                  <span className="flex items-center gap-2" dir="ltr">
                    <HiOutlinePhone className="text-base" />
                    {user?.phone}
                  </span>
                </div>
                <Button to="/profile" variant="outline" size="md" className="mt-5 w-full">
                  {t('dashboardPage.editProfile')}
                </Button>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 p-6 text-center shadow-medium">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl text-white">
                  <HiOutlineSparkles />
                </span>
                <p className="mt-4 text-sm font-medium text-primary-50">{t('dashboardPage.quickBook')}</p>
                <Button
                  to="/book-appointment"
                  variant="glass"
                  size="md"
                  icon={<FaRegCalendarCheck />}
                  iconPosition="start"
                  className="mt-4 w-full"
                >
                  {t('common.bookAppointment')}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

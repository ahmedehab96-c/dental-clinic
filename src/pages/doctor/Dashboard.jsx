import { Link } from 'react-router-dom'
import {
  HiOutlineCalendarDays,
  HiOutlineCalendar,
  HiOutlineClipboardDocumentList,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineUser,
} from 'react-icons/hi2'
import StatCard from '@/components/admin/StatCard'
import ActiveStatusBadge from '@/components/admin/ActiveStatusBadge'
import AsyncState from '@/components/ui/AsyncState'
import StatusBadge from '@/components/ui/StatusBadge'
import DoctorProfileMissing from '@/components/doctor/DoctorProfileMissing'
import { useApiData } from '@/hooks/useApiData'
import { useAppointmentLookups } from '@/hooks/useAppointmentLookups'
import { fetchDoctorAppointments, fetchDoctorDashboard, fetchDoctorProfile } from '@/services/api/doctorDashboard'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'

const fetchToday = () => fetchDoctorAppointments({ scope: 'today', perPage: 20 })

export default function DoctorDashboard() {
  const { t, tr } = useLanguage()
  usePageTitle(t('doctorPanel.sidebar.overview'))

  const { data: profile, loading: profileLoading, error: profileError, notFound } = useApiData(fetchDoctorProfile, [])
  const { data: stats, loading: statsLoading, error: statsError } = useApiData(fetchDoctorDashboard, [])
  const { data: today, loading: todayLoading, error: todayError } = useApiData(fetchToday, [])
  const { servicesById } = useAppointmentLookups()

  if (notFound) return <DoctorProfileMissing />

  const serviceNameFor = (appointment) => {
    const service = servicesById[appointment.service?.id]
    return service ? tr(service.name) : '—'
  }

  const statCards = stats
    ? [
        { key: 'today', icon: HiOutlineCalendarDays, value: stats.todayAppointments, accent: 'primary' },
        { key: 'upcoming', icon: HiOutlineCalendar, value: stats.upcomingAppointments, accent: 'accent' },
        { key: 'total', icon: HiOutlineClipboardDocumentList, value: stats.totalAppointments, accent: 'primary' },
        { key: 'pending', icon: HiOutlineClock, value: stats.pendingAppointments, accent: 'amber' },
        { key: 'completed', icon: HiOutlineCheckCircle, value: stats.completedAppointments, accent: 'emerald' },
        { key: 'cancelled', icon: HiOutlineXCircle, value: stats.cancelledAppointments, accent: 'amber' },
      ]
    : []

  const todayList = today?.appointments ?? []

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft sm:p-6">
        {profileLoading && <AsyncState status="loading" className="!py-6" />}
        {!profileLoading && profileError && <AsyncState status="error" className="!py-6" />}
        {!profileLoading && !profileError && profile && (
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink-50 ring-1 ring-ink-100">
              {profile.photo ? (
                <img src={profile.photo} alt="" className="h-full w-full object-cover" />
              ) : (
                <HiOutlineUser className="text-2xl text-ink-300" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-ink-500">{t('doctorPanel.overview.welcome')}</p>
              <h1 className="font-heading text-2xl font-bold text-ink-900">{tr(profile.name)}</h1>
              <p className="text-sm text-primary-600">{tr(profile.specialty)}</p>
            </div>
            <ActiveStatusBadge isActive={profile.isActive} />
          </div>
        )}
      </div>

      {statsLoading && <AsyncState status="loading" />}
      {!statsLoading && statsError && <AsyncState status="error" />}
      {!statsLoading && !statsError && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((card) => (
            <StatCard
              key={card.key}
              icon={card.icon}
              label={t(`doctorPanel.overview.stats.${card.key}`)}
              value={card.value}
              accent={card.accent}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <section className="xl:col-span-3" aria-labelledby="doctor-today-title">
          <div className="flex items-center justify-between gap-3">
            <h2 id="doctor-today-title" className="font-heading text-lg font-bold text-ink-900">
              {t('doctorPanel.overview.todayTitle')}
            </h2>
            <Link to="/doctor/appointments" className="text-sm font-semibold text-primary-700 hover:text-primary-800">
              {t('doctorPanel.overview.viewAll')}
            </Link>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
            {todayLoading && <AsyncState status="loading" />}
            {!todayLoading && todayError && <AsyncState status="error" />}
            {!todayLoading && !todayError && todayList.length === 0 && (
              <AsyncState status="empty" message={t('doctorPanel.overview.noToday')} />
            )}
            {!todayLoading && !todayError && todayList.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-start text-sm">
                  <thead>
                    <tr className="border-b border-ink-100 text-xs font-semibold text-ink-500">
                      <th className="px-4 py-3 text-start">{t('appointmentsPage.timeLabel')}</th>
                      <th className="px-4 py-3 text-start">{t('admin.appointments.table.patient')}</th>
                      <th className="px-4 py-3 text-start">{t('appointmentsPage.serviceLabel')}</th>
                      <th className="px-4 py-3 text-start">{t('admin.dashboard.statusLabel')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayList.map((appointment) => (
                      <tr key={appointment.id} className="border-b border-ink-50 last:border-0">
                        <td className="px-4 py-3 font-medium text-ink-800" dir="ltr">{appointment.time}</td>
                        <td className="px-4 py-3 text-ink-700">{appointment.patient?.name}</td>
                        <td className="px-4 py-3 text-ink-600">{serviceNameFor(appointment)}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={appointment.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className="xl:col-span-2" aria-labelledby="doctor-services-title">
          <h2 id="doctor-services-title" className="font-heading text-lg font-bold text-ink-900">
            {t('doctorPanel.overview.servicesTitle')}
          </h2>
          <div className="mt-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
            {profileLoading && <AsyncState status="loading" className="!py-6" />}
            {!profileLoading && profile && profile.services.length === 0 && (
              <p className="text-sm text-ink-400">{t('doctorPanel.overview.noServices')}</p>
            )}
            {!profileLoading && profile && profile.services.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.services.map((service) => (
                  <span
                    key={service.id}
                    className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
                  >
                    {tr(service.name)}
                  </span>
                ))}
              </div>
            )}
            <p className="mt-4 text-xs text-ink-400">{t('doctorPanel.overview.servicesHint')}</p>
          </div>
        </section>
      </div>
    </div>
  )
}

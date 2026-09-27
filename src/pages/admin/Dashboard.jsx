import { useMemo } from 'react'
import {
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineSparkles,
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineCheckCircle,
} from 'react-icons/hi2'
import StatCard from '@/components/admin/StatCard'
import AsyncState from '@/components/ui/AsyncState'
import StatusBadge from '@/components/ui/StatusBadge'
import AppointmentCard from '@/components/patient/AppointmentCard'
import { useApiData } from '@/hooks/useApiData'
import { useAppointmentLookups } from '@/hooks/useAppointmentLookups'
import { fetchDashboardStats, fetchAdminAppointments } from '@/services/api/admin'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatDate } from '@/utils/formatDate'

const fetchRecentAppointments = () => fetchAdminAppointments({ perPage: 20 })

export default function Dashboard() {
  const { t, tr, language } = useLanguage()
  usePageTitle(t('admin.sidebar.dashboard'))

  const { data: stats, loading: statsLoading, error: statsError } = useApiData(fetchDashboardStats, [])
  const {
    data: appointments,
    loading: appointmentsLoading,
    error: appointmentsError,
  } = useApiData(fetchRecentAppointments, [])
  const { doctorsById, servicesById } = useAppointmentLookups()

  // One fetch feeds both widgets below — "recent" is just what the API
  // already returns (latest first); "upcoming" is derived from the same
  // batch client-side rather than firing a second request.
  const upcoming = useMemo(() => {
    const list = appointments ?? []
    const todayStr = new Date().toISOString().slice(0, 10)
    return list
      .filter((appointment) => appointment.date >= todayStr && ['pending', 'confirmed'].includes(appointment.status))
      .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
      .slice(0, 5)
  }, [appointments])

  const recent = (appointments ?? []).slice(0, 8)

  const nameFor = (appointment) => {
    const doctor = appointment.doctor ? doctorsById[appointment.doctor.id] : null
    return doctor ? tr(doctor.name) : null
  }
  const serviceNameFor = (appointment) => {
    const service = servicesById[appointment.service?.id]
    return service ? tr(service.name) : null
  }

  const statCards = stats
    ? [
        { key: 'totalPatients', icon: HiOutlineUsers, value: stats.totalPatients, accent: 'primary' },
        { key: 'totalDoctors', icon: HiOutlineUserGroup, value: stats.totalDoctors, accent: 'accent' },
        { key: 'totalServices', icon: HiOutlineSparkles, value: stats.totalServices, accent: 'primary' },
        { key: 'todayAppointments', icon: HiOutlineCalendarDays, value: stats.todayAppointments, accent: 'amber' },
        { key: 'pendingAppointments', icon: HiOutlineClock, value: stats.pendingAppointments, accent: 'amber' },
        { key: 'confirmedAppointments', icon: HiOutlineCheckCircle, value: stats.confirmedAppointments, accent: 'emerald' },
      ]
    : []

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink-900">{t('admin.dashboard.title')}</h1>
        <p className="mt-1 text-sm text-ink-500">{t('admin.dashboard.subtitle')}</p>
      </div>

      {statsLoading && <AsyncState status="loading" />}
      {!statsLoading && statsError && <AsyncState status="error" />}
      {!statsLoading && !statsError && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((card) => (
            <StatCard key={card.key} icon={card.icon} label={t(`admin.dashboard.stats.${card.key}`)} value={card.value} accent={card.accent} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <h2 className="font-heading text-lg font-bold text-ink-900">{t('admin.dashboard.recentTitle')}</h2>

          <div className="mt-4 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
            {appointmentsLoading && <AsyncState status="loading" />}
            {!appointmentsLoading && appointmentsError && <AsyncState status="error" />}
            {!appointmentsLoading && !appointmentsError && recent.length === 0 && <AsyncState status="empty" />}

            {!appointmentsLoading && !appointmentsError && recent.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-start text-sm">
                  <thead>
                    <tr className="border-b border-ink-100 text-xs font-semibold text-ink-500">
                      <th className="px-4 py-3 text-start">{t('appointmentsPage.doctorLabel')}</th>
                      <th className="px-4 py-3 text-start">{t('appointmentsPage.serviceLabel')}</th>
                      <th className="px-4 py-3 text-start">{t('appointmentsPage.dateLabel')}</th>
                      <th className="px-4 py-3 text-start">{t('appointmentsPage.timeLabel')}</th>
                      <th className="px-4 py-3 text-start">{t('admin.dashboard.statusLabel')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((appointment) => (
                      <tr key={appointment.id} className="border-b border-ink-50 last:border-0">
                        <td className="px-4 py-3 font-medium text-ink-800">{appointment.patient?.name}</td>
                        <td className="px-4 py-3 text-ink-600">{serviceNameFor(appointment) || '—'}</td>
                        <td className="px-4 py-3 text-ink-600">{formatDate(appointment.date, language)}</td>
                        <td className="px-4 py-3 text-ink-600" dir="ltr">{appointment.time}</td>
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
        </div>

        <div className="xl:col-span-2">
          <h2 className="font-heading text-lg font-bold text-ink-900">{t('admin.dashboard.upcomingTitle')}</h2>

          <div className="mt-4 flex flex-col gap-3">
            {appointmentsLoading && <AsyncState status="loading" />}
            {!appointmentsLoading && appointmentsError && <AsyncState status="error" />}
            {!appointmentsLoading && !appointmentsError && upcoming.length === 0 && <AsyncState status="empty" />}
            {!appointmentsLoading &&
              !appointmentsError &&
              upcoming.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  doctorName={nameFor(appointment)}
                  serviceName={serviceNameFor(appointment)}
                  patientName={appointment.patient?.name}
                  compact
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

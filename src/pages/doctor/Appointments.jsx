import { useEffect, useState } from 'react'
import { HiOutlineXMark } from 'react-icons/hi2'
import AsyncState from '@/components/ui/AsyncState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Pagination from '@/components/admin/Pagination'
import AppointmentsTable from '@/components/admin/AppointmentsTable'
import AppointmentDetailsModal from '@/components/admin/AppointmentDetailsModal'
import DoctorProfileMissing from '@/components/doctor/DoctorProfileMissing'
import { useApiData } from '@/hooks/useApiData'
import { useAppointmentLookups } from '@/hooks/useAppointmentLookups'
import { fetchDoctorAppointments, updateDoctorAppointmentStatus } from '@/services/api/doctorDashboard'
import { APPOINTMENT_STATUSES } from '@/utils/appointmentStatus'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'
import { cn } from '@/utils/cn'

const PER_PAGE = 10
const SCOPES = ['today', 'upcoming', 'past', 'all']

export default function DoctorAppointments() {
  const { t, tr } = useLanguage()
  usePageTitle(t('doctorPanel.sidebar.appointments'))

  const [page, setPage] = useState(1)
  const [scope, setScope] = useState('today')
  const [status, setStatus] = useState('')

  useEffect(() => {
    setPage(1)
  }, [scope, status])

  const { data: result, loading, error, notFound } = useApiData(
    () => fetchDoctorAppointments({ page, perPage: PER_PAGE, scope: scope === 'all' ? undefined : scope, status }),
    [page, scope, status],
  )
  const { doctorsById, servicesById } = useAppointmentLookups()

  const [appointments, setAppointments] = useState([])
  useEffect(() => {
    setAppointments(result?.appointments ?? [])
  }, [result])

  const [viewing, setViewing] = useState(null)
  const [pendingCancel, setPendingCancel] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [updatingTo, setUpdatingTo] = useState(null)
  const [banner, setBanner] = useState(null)

  if (notFound) return <DoctorProfileMissing />

  const hasActiveFilters = Boolean(status)

  const applyStatusChange = async (appointment, targetStatus) => {
    setBanner(null)
    setUpdatingId(appointment.id)
    setUpdatingTo(targetStatus)

    try {
      const updated = await updateDoctorAppointmentStatus(appointment.id, targetStatus)
      setAppointments((prev) => prev.map((entry) => (entry.id === updated.id ? updated : entry)))
      setBanner({ type: 'success', message: t('doctorPanel.appointments.updateSuccess') })
    } catch (err) {
      setBanner({
        type: 'error',
        message: err.status === 422 ? t('doctorPanel.appointments.transitionBlocked') : t('admin.appointments.updateError'),
      })
    } finally {
      setUpdatingId(null)
      setUpdatingTo(null)
      setPendingCancel(null)
    }
  }

  const handleChangeStatus = (appointment, targetStatus) => {
    // Cancelling is destructive — confirm first; confirm/complete apply immediately.
    if (targetStatus === 'cancelled') {
      setPendingCancel(appointment)
      return
    }
    applyStatusChange(appointment, targetStatus)
  }

  const serviceNameFor = (appointment) => {
    const service = servicesById[appointment?.service?.id]
    return service ? tr(service.name) : null
  }
  const doctorNameFor = (appointment) => {
    const doctor = appointment?.doctor ? doctorsById[appointment.doctor.id] : null
    return doctor ? tr(doctor.name) : null
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink-900">{t('doctorPanel.appointments.title')}</h1>
        <p className="mt-1 text-sm text-ink-500">{t('doctorPanel.appointments.subtitle')}</p>
      </div>

      {banner && (
        <div
          role="alert"
          className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
            banner.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-600'
          }`}
        >
          {banner.message}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-ink-100 bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label={t('doctorPanel.appointments.scopeLabel')} className="flex flex-wrap gap-2">
          {SCOPES.map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={scope === value}
              onClick={() => setScope(value)}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                scope === value
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : 'border-ink-200 text-ink-600 hover:border-primary-300 hover:text-primary-700',
              )}
            >
              {t(`doctorPanel.appointments.scopes.${value}`)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label={t('admin.appointments.table.status')}
            className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-800 outline-none transition-colors focus:border-primary-400 sm:w-48"
          >
            <option value="">{t('admin.appointments.filters.allStatuses')}</option>
            {APPOINTMENT_STATUSES.map((value) => (
              <option key={value} value={value}>
                {t(`appointmentsPage.status.${value}`)}
              </option>
            ))}
          </select>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => setStatus('')}
              aria-label={t('admin.appointments.filters.clear')}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink-200 text-ink-500 transition-colors hover:border-red-200 hover:text-red-600"
            >
              <HiOutlineXMark />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
        {loading && <AsyncState status="loading" />}
        {!loading && error && !notFound && <AsyncState status="error" />}
        {!loading && !error && appointments.length === 0 && (
          <AsyncState
            status="empty"
            message={t(hasActiveFilters ? 'doctorPanel.appointments.noResults' : `doctorPanel.appointments.empty.${scope}`)}
          />
        )}

        {!loading && !error && appointments.length > 0 && (
          <>
            <AppointmentsTable
              appointments={appointments}
              doctorsById={doctorsById}
              servicesById={servicesById}
              updatingId={updatingId}
              updatingTo={updatingTo}
              onView={setViewing}
              onChangeStatus={handleChangeStatus}
              hideDoctor
            />
            <Pagination
              currentPage={result?.meta.currentPage ?? 1}
              lastPage={result?.meta.lastPage ?? 1}
              totalLabel={t('doctorPanel.appointments.totalCount').replace('{count}', result?.meta.total ?? 0)}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <AppointmentDetailsModal
        appointment={viewing}
        doctorName={doctorNameFor(viewing)}
        serviceName={serviceNameFor(viewing)}
        onClose={() => setViewing(null)}
      />

      <ConfirmDialog
        open={Boolean(pendingCancel)}
        title={t('admin.appointments.cancelConfirm.title')}
        message={t('admin.appointments.cancelConfirm.message')}
        confirmLabel={t('admin.appointments.cancelConfirm.confirmButton')}
        cancelLabel={t('admin.appointments.cancelConfirm.dismissButton')}
        onConfirm={() => applyStatusChange(pendingCancel, 'cancelled')}
        onCancel={() => setPendingCancel(null)}
        loading={updatingTo === 'cancelled'}
      />
    </div>
  )
}

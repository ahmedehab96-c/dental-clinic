import { useEffect, useState } from 'react'
import AsyncState from '@/components/ui/AsyncState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import AppointmentsFilters from '@/components/admin/AppointmentsFilters'
import AppointmentsTable from '@/components/admin/AppointmentsTable'
import AppointmentDetailsModal from '@/components/admin/AppointmentDetailsModal'
import Pagination from '@/components/admin/Pagination'
import { useApiData } from '@/hooks/useApiData'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useAppointmentLookups } from '@/hooks/useAppointmentLookups'
import { fetchAppointments, updateAppointmentStatus } from '@/services/api/adminAppointments'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'

const PER_PAGE = 10

export default function AdminAppointments() {
  const { t, tr } = useLanguage()
  usePageTitle(t('admin.sidebar.appointments'))

  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [doctorId, setDoctorId] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [date, setDate] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const search = useDebouncedValue(searchInput, 400)

  // Any filter change starts back at page 1 — staying on e.g. page 3 of a
  // newly-narrowed result set would just show a confusing empty page.
  useEffect(() => {
    setPage(1)
  }, [status, doctorId, serviceId, date, search])

  const fetchParams = { page, perPage: PER_PAGE, status, doctorId, serviceId, date, search }
  const {
    data: result,
    loading,
    error,
  } = useApiData(
    () => fetchAppointments(fetchParams),
    [page, status, doctorId, serviceId, date, search],
  )

  const { doctors, services, doctorsById, servicesById } = useAppointmentLookups()

  // Local copy so a status change can patch one row in place — "refresh
  // only necessary data" instead of refetching the whole page.
  const [appointments, setAppointments] = useState([])
  useEffect(() => {
    setAppointments(result?.appointments ?? [])
  }, [result])

  const [viewing, setViewing] = useState(null)
  const [pendingCancel, setPendingCancel] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [updatingTo, setUpdatingTo] = useState(null)
  const [banner, setBanner] = useState(null)

  const hasActiveFilters = Boolean(status || doctorId || serviceId || date || searchInput)

  const clearFilters = () => {
    setStatus('')
    setDoctorId('')
    setServiceId('')
    setDate('')
    setSearchInput('')
  }

  const applyStatusChange = async (appointment, targetStatus) => {
    setBanner(null)
    setUpdatingId(appointment.id)
    setUpdatingTo(targetStatus)

    try {
      const updated = await updateAppointmentStatus(appointment.id, targetStatus)
      setAppointments((prev) => prev.map((entry) => (entry.id === updated.id ? updated : entry)))
      setBanner({ type: 'success', message: t('admin.appointments.updateSuccess') })
    } catch {
      setBanner({ type: 'error', message: t('admin.appointments.updateError') })
    } finally {
      setUpdatingId(null)
      setUpdatingTo(null)
      setPendingCancel(null)
    }
  }

  const handleChangeStatus = (appointment, targetStatus) => {
    // Cancellation is destructive — confirm first. Confirm/Complete apply
    // immediately.
    if (targetStatus === 'cancelled') {
      setPendingCancel(appointment)
      return
    }
    applyStatusChange(appointment, targetStatus)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink-900">{t('admin.appointments.title')}</h1>
        <p className="mt-1 text-sm text-ink-500">{t('admin.appointments.subtitle')}</p>
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

      <AppointmentsFilters
        search={searchInput}
        onSearchChange={setSearchInput}
        status={status}
        onStatusChange={setStatus}
        doctorId={doctorId}
        onDoctorChange={setDoctorId}
        serviceId={serviceId}
        onServiceChange={setServiceId}
        date={date}
        onDateChange={setDate}
        doctors={doctors}
        services={services}
        hasActiveFilters={hasActiveFilters}
        onClear={clearFilters}
      />

      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
        {loading && <AsyncState status="loading" />}
        {!loading && error && <AsyncState status="error" />}
        {!loading && !error && appointments.length === 0 && (
          <AsyncState
            status="empty"
            message={hasActiveFilters ? t('admin.appointments.noSearchResults') : t('admin.appointments.empty')}
            actionLabel={hasActiveFilters ? t('admin.appointments.filters.clear') : undefined}
            onAction={hasActiveFilters ? clearFilters : undefined}
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
            />
            <Pagination
              currentPage={result?.meta.currentPage ?? 1}
              lastPage={result?.meta.lastPage ?? 1}
              totalLabel={t('admin.appointments.pagination.totalCount').replace('{count}', result?.meta.total ?? 0)}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <AppointmentDetailsModal
        appointment={viewing}
        doctorName={viewing?.doctor ? tr(doctorsById[viewing.doctor.id]?.name) : null}
        serviceName={viewing ? tr(servicesById[viewing.service?.id]?.name) : null}
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
        loading={updatingId === pendingCancel?.id}
      />
    </div>
  )
}

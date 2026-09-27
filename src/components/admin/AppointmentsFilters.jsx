import { HiOutlineMagnifyingGlass, HiOutlineXMark } from 'react-icons/hi2'
import { APPOINTMENT_STATUSES } from '@/utils/appointmentStatus'
import { useLanguage } from '@/context/LanguageContext'

const inputClass =
  'w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-800 outline-none transition-colors focus:border-primary-400'

export default function AppointmentsFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  doctorId,
  onDoctorChange,
  serviceId,
  onServiceChange,
  date,
  onDateChange,
  doctors,
  services,
  hasActiveFilters,
  onClear,
}) {
  const { t, tr } = useLanguage()

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <HiOutlineMagnifyingGlass className="pointer-events-none absolute top-1/2 start-3.5 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t('admin.appointments.filters.searchPlaceholder')}
            className={`${inputClass} ps-10`}
          />
        </div>

        <select value={status} onChange={(event) => onStatusChange(event.target.value)} className={inputClass}>
          <option value="">{t('admin.appointments.filters.allStatuses')}</option>
          {APPOINTMENT_STATUSES.map((value) => (
            <option key={value} value={value}>
              {t(`appointmentsPage.status.${value}`)}
            </option>
          ))}
        </select>

        <select value={doctorId} onChange={(event) => onDoctorChange(event.target.value)} className={inputClass}>
          <option value="">{t('admin.appointments.filters.allDoctors')}</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {tr(doctor.name)}
            </option>
          ))}
        </select>

        <select value={serviceId} onChange={(event) => onServiceChange(event.target.value)} className={inputClass}>
          <option value="">{t('admin.appointments.filters.allServices')}</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {tr(service.name)}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          type="date"
          value={date}
          onChange={(event) => onDateChange(event.target.value)}
          className={`${inputClass} w-auto`}
        />

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-3.5 py-2 text-xs font-semibold text-ink-600 transition-colors hover:border-red-200 hover:text-red-600"
          >
            <HiOutlineXMark className="text-sm" />
            {t('admin.appointments.filters.clear')}
          </button>
        )}
      </div>
    </div>
  )
}

import { HiOutlineCalendarDays, HiOutlineClock, HiOutlineUser } from 'react-icons/hi2'
import StatusBadge from '@/components/ui/StatusBadge'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/context/LanguageContext'
import { formatDate } from '@/utils/formatDate'

const CANCELLABLE_STATUSES = ['pending', 'confirmed']

export default function AppointmentCard({ appointment, doctorName, serviceName, patientName, onCancelClick, compact = false }) {
  const { t, language } = useLanguage()
  const canCancel = CANCELLABLE_STATUSES.includes(appointment.status)

  return (
    <div
      className={
        compact
          ? 'flex flex-col gap-3 rounded-2xl border border-ink-100 bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between'
          : 'rounded-2xl border border-ink-100 bg-white p-6 shadow-soft'
      }
    >
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Admin context (patientName given): whose appointment matters
              most, so it leads; service name becomes the secondary label. */}
          <h3 className="font-heading text-base font-bold text-ink-900">{patientName || serviceName || '—'}</h3>
          <StatusBadge status={appointment.status} />
        </div>
        {patientName && serviceName && <p className="mt-0.5 text-sm text-ink-500">{serviceName}</p>}

        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-ink-500">
          <span className="flex items-center gap-1.5">
            <HiOutlineUser className="text-base" />
            {doctorName || t('appointmentsPage.noDoctorPreference')}
          </span>
          <span className="flex items-center gap-1.5">
            <HiOutlineCalendarDays className="text-base" />
            {formatDate(appointment.date, language)}
          </span>
          <span className="flex items-center gap-1.5" dir="ltr">
            <HiOutlineClock className="text-base" />
            {appointment.time}
          </span>
        </div>

        {!compact && appointment.notes && (
          <p className="mt-3 rounded-xl bg-ink-50/70 px-3.5 py-2.5 text-sm text-ink-600">
            <span className="font-semibold text-ink-700">{t('appointmentsPage.notesLabel')}: </span>
            {appointment.notes}
          </p>
        )}
      </div>

      {canCancel && onCancelClick && (
        <div className={compact ? 'shrink-0' : 'mt-4'}>
          <Button type="button" variant="outline" size="md" onClick={() => onCancelClick(appointment)}>
            {t('appointmentsPage.cancelButton')}
          </Button>
        </div>
      )}
    </div>
  )
}

import { AnimatePresence, motion } from 'framer-motion'
import { HiOutlineXMark } from 'react-icons/hi2'
import StatusBadge from '@/components/ui/StatusBadge'
import { useLanguage } from '@/context/LanguageContext'
import { formatDate } from '@/utils/formatDate'

export default function AppointmentDetailsModal({ appointment, doctorName, serviceName, onClose }) {
  const { t, language } = useLanguage()

  return (
    <AnimatePresence>
      {appointment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/50 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg rounded-[2rem] border border-ink-100 bg-white p-7 shadow-medium"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-ink-900">{t('admin.appointments.details.title')}</h2>
                <p dir="ltr" className="mt-0.5 text-xs text-ink-400">{appointment.reference}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t('admin.appointments.details.close')}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink-700"
              >
                <HiOutlineXMark className="text-lg" />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-2.5">
              <StatusBadge status={appointment.status} />
            </div>

            <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={t('admin.appointments.details.patientName')} value={appointment.patient?.name} />
              <Field label={t('admin.appointments.details.patientPhone')} value={appointment.patient?.phone} dir="ltr" />
              <Field label={t('admin.appointments.details.patientEmail')} value={appointment.patient?.email} dir="ltr" className="sm:col-span-2" />
              <Field label={t('appointmentsPage.doctorLabel')} value={doctorName || t('appointmentsPage.noDoctorPreference')} />
              <Field label={t('appointmentsPage.serviceLabel')} value={serviceName || '—'} />
              <Field label={t('appointmentsPage.dateLabel')} value={formatDate(appointment.date, language)} />
              <Field label={t('appointmentsPage.timeLabel')} value={appointment.time} dir="ltr" />
              {appointment.createdAt && (
                <Field
                  label={t('admin.appointments.details.createdAt')}
                  value={formatDate(appointment.createdAt, language)}
                  className="sm:col-span-2"
                />
              )}
            </dl>

            <div className="mt-4">
              <p className="text-xs font-semibold text-ink-500">{t('appointmentsPage.notesLabel')}</p>
              <p className="mt-1.5 rounded-xl bg-ink-50/70 px-3.5 py-2.5 text-sm text-ink-700">
                {appointment.notes || t('admin.appointments.details.noNotes')}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Field({ label, value, dir, className }) {
  return (
    <div className={className}>
      <dt className="text-xs font-semibold text-ink-500">{label}</dt>
      <dd dir={dir} className="mt-1 text-sm font-medium text-ink-800">{value || '—'}</dd>
    </div>
  )
}

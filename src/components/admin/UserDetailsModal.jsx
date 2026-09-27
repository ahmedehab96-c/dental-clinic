import { AnimatePresence, motion } from 'framer-motion'
import { HiOutlineXMark, HiOutlineEnvelope, HiOutlinePhone, HiOutlineCalendarDays } from 'react-icons/hi2'
import RoleBadge from '@/components/admin/RoleBadge'
import StatusBadge from '@/components/ui/StatusBadge'
import AsyncState from '@/components/ui/AsyncState'
import { useApiData } from '@/hooks/useApiData'
import { fetchAdminUser } from '@/services/api/adminUsers'
import { useLanguage } from '@/context/LanguageContext'

// Mounted only while a user is selected, so the fetch always has an id.
function UserDetailsBody({ user, onClose }) {
  const { t, tr } = useLanguage()
  const { data: details, loading, error } = useApiData(() => fetchAdminUser(user.id), [user.id])
  const appointments = details?.recentAppointments ?? []

  return (
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
          <h2 className="font-heading text-lg font-bold text-ink-900">{user.name}</h2>
          <RoleBadge role={user.role} className="mt-2" />
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

      <div className="mt-5 flex flex-col gap-2 text-sm text-ink-600">
        <span className="flex items-center gap-2" dir="ltr">
          <HiOutlineEnvelope className="text-base text-ink-400" />
          {user.email}
        </span>
        <span className="flex items-center gap-2" dir="ltr">
          <HiOutlinePhone className="text-base text-ink-400" />
          {user.phone || '—'}
        </span>
        <span className="flex items-center gap-2">
          <HiOutlineCalendarDays className="text-base text-ink-400" />
          {t('admin.users.details.registered')}: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
        </span>
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold text-ink-500">
          {t('admin.users.details.recentAppointments')} ({details?.appointmentsCount ?? user.appointmentsCount})
        </p>

        {loading && <AsyncState status="loading" className="!py-6" />}
        {!loading && error && <AsyncState status="error" className="!py-6" />}
        {!loading && !error && appointments.length === 0 && (
          <p className="mt-1.5 text-sm text-ink-400">{t('admin.users.details.noAppointments')}</p>
        )}
        {!loading && !error && appointments.length > 0 && (
          <ul className="mt-2 flex flex-col divide-y divide-ink-50 rounded-2xl border border-ink-100">
            {appointments.map((appointment) => (
              <li key={appointment.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink-800">{tr(appointment.service)}</p>
                  <p className="text-xs text-ink-500">
                    <span dir="ltr">{appointment.date} · {appointment.time}</span>
                    {appointment.doctor && <> · {tr(appointment.doctor)}</>}
                  </p>
                </div>
                <StatusBadge status={appointment.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  )
}

export default function UserDetailsModal({ user, onClose }) {
  return (
    <AnimatePresence>
      {user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-ink-950/50 px-4 py-8"
          onClick={onClose}
        >
          <UserDetailsBody key={user.id} user={user} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

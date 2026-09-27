import { HiOutlineCheck, HiOutlineCheckCircle, HiOutlineXMark } from 'react-icons/hi2'
import { STATUS_TRANSITIONS } from '@/utils/appointmentStatus'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/utils/cn'

const BUTTONS = {
  confirmed: { icon: HiOutlineCheck, labelKey: 'admin.appointments.actions.confirm', busyKey: 'admin.appointments.actions.confirming', tone: 'text-primary-700 border-primary-200 hover:bg-primary-50' },
  completed: { icon: HiOutlineCheckCircle, labelKey: 'admin.appointments.actions.complete', busyKey: 'admin.appointments.actions.completing', tone: 'text-emerald-700 border-emerald-200 hover:bg-emerald-50' },
  cancelled: { icon: HiOutlineXMark, labelKey: 'admin.appointments.actions.cancel', busyKey: 'admin.appointments.actions.cancelling', tone: 'text-red-600 border-red-200 hover:bg-red-50' },
}

/**
 * Renders only the transitions STATUS_TRANSITIONS allows from the
 * appointment's current status — the single place that decides which
 * status-change buttons exist, so no component hardcodes "if pending show X".
 */
export default function AppointmentStatusActions({ status, updatingTo, onChangeStatus }) {
  const { t } = useLanguage()
  const transitions = STATUS_TRANSITIONS[status] ?? []

  if (transitions.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {transitions.map((target) => {
        const { icon: Icon, labelKey, busyKey, tone } = BUTTONS[target]
        const isBusy = updatingTo === target
        const isDisabled = Boolean(updatingTo)

        return (
          <button
            key={target}
            type="button"
            disabled={isDisabled}
            onClick={() => onChangeStatus(target)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50',
              tone,
            )}
          >
            {isBusy ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Icon className="text-sm" />
            )}
            {t(isBusy ? busyKey : labelKey)}
          </button>
        )
      })}
    </div>
  )
}

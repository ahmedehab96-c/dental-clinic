import { cn } from '@/utils/cn'
import { useLanguage } from '@/context/LanguageContext'

const STYLES = {
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  confirmed: 'border-primary-200 bg-primary-50 text-primary-700',
  completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  cancelled: 'border-red-200 bg-red-50 text-red-600',
}

export default function StatusBadge({ status, className }) {
  const { t } = useLanguage()

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap',
        STYLES[status] ?? STYLES.pending,
        className,
      )}
    >
      {t(`appointmentsPage.status.${status}`)}
    </span>
  )
}

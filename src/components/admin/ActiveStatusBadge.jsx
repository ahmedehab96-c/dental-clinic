import { cn } from '@/utils/cn'
import { useLanguage } from '@/context/LanguageContext'

export default function ActiveStatusBadge({ isActive, className }) {
  const { t } = useLanguage()

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap',
        isActive ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-ink-200 bg-ink-50 text-ink-500',
        className,
      )}
    >
      {t(isActive ? 'admin.status.active' : 'admin.status.inactive')}
    </span>
  )
}

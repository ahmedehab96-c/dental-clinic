import { cn } from '@/utils/cn'
import { useLanguage } from '@/context/LanguageContext'

const STYLES = {
  admin: 'border-primary-200 bg-primary-50 text-primary-700',
  doctor: 'border-accent-200 bg-accent-50 text-accent-700',
  patient: 'border-ink-200 bg-ink-50 text-ink-600',
}

export default function RoleBadge({ role, className }) {
  const { t } = useLanguage()

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap',
        STYLES[role] ?? STYLES.patient,
        className,
      )}
    >
      {t(`admin.users.roles.${role}`)}
    </span>
  )
}

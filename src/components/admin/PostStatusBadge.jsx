import { cn } from '@/utils/cn'
import { useLanguage } from '@/context/LanguageContext'

const STYLES = {
  draft: 'border-ink-200 bg-ink-50 text-ink-500',
  published: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

export default function PostStatusBadge({ status, className }) {
  const { t } = useLanguage()

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap',
        STYLES[status] ?? STYLES.draft,
        className,
      )}
    >
      {t(`admin.blog.status.${status}`)}
    </span>
  )
}

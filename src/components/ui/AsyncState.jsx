import { useLanguage } from '@/context/LanguageContext'

/**
 * Shared loading/error/empty placeholder for API-backed sections — keeps
 * every section's "in between" states visually consistent without
 * touching the success-path markup, which stays exactly as it was.
 */
export default function AsyncState({ status, onRetry, className = '', message, actionLabel, onAction }) {
  const { t } = useLanguage()

  if (status === 'loading') {
    return (
      <div className={`flex items-center justify-center py-16 ${className}`} role="status" aria-live="polite">
        <span className="h-9 w-9 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
        <span className="sr-only">{t('common.loading')}</span>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className={`flex flex-col items-center gap-4 py-16 text-center ${className}`} role="alert">
        <p className="text-sm font-medium text-ink-500">{t('common.loadError')}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full border border-primary-200 bg-primary-50 px-5 py-2 text-sm font-semibold text-primary-700 transition-colors duration-200 hover:border-primary-300 hover:bg-primary-100"
          >
            {t('common.retry')}
          </button>
        )}
      </div>
    )
  }

  if (status === 'empty') {
    return (
      <div className={`flex flex-col items-center gap-4 py-16 text-center ${className}`}>
        <p className="text-sm font-medium text-ink-500">{message || t('common.noResults')}</p>
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="rounded-full border border-ink-200 bg-white px-5 py-2 text-sm font-semibold text-ink-600 transition-colors duration-200 hover:border-primary-300 hover:text-primary-700"
          >
            {actionLabel}
          </button>
        )}
      </div>
    )
  }

  return null
}

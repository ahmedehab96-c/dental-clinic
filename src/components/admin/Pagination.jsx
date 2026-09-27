import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2'
import { useLanguage } from '@/context/LanguageContext'

// `totalLabel` is a fully-formatted string the caller supplies (e.g. "23
// appointments total" vs "9 doctors total") — every other resource that
// paginates reuses this same component, but each owns its own noun.
export default function Pagination({ currentPage, lastPage, totalLabel, onPageChange }) {
  const { t, isRtl } = useLanguage()

  if (!lastPage || lastPage <= 1) return null

  const PrevIcon = isRtl ? HiOutlineChevronRight : HiOutlineChevronLeft
  const NextIcon = isRtl ? HiOutlineChevronLeft : HiOutlineChevronRight

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-ink-100 px-4 py-4 sm:flex-row">
      <p className="text-xs text-ink-500">{totalLabel}</p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex items-center gap-1.5 rounded-full border border-ink-200 px-3.5 py-2 text-sm font-medium text-ink-700 transition-colors hover:border-primary-300 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-ink-200 disabled:hover:text-ink-700"
        >
          <PrevIcon className="text-sm" />
          {t('admin.pagination.previous')}
        </button>

        <span className="text-sm font-medium text-ink-600">
          {t('admin.pagination.page')} {currentPage} {t('admin.pagination.of')} {lastPage}
        </span>

        <button
          type="button"
          disabled={currentPage >= lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center gap-1.5 rounded-full border border-ink-200 px-3.5 py-2 text-sm font-medium text-ink-700 transition-colors hover:border-primary-300 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-ink-200 disabled:hover:text-ink-700"
        >
          {t('admin.pagination.next')}
          <NextIcon className="text-sm" />
        </button>
      </div>
    </div>
  )
}

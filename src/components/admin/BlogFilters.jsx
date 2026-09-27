import { HiOutlineMagnifyingGlass, HiOutlineXMark } from 'react-icons/hi2'
import { useLanguage } from '@/context/LanguageContext'

const inputClass =
  'w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-800 outline-none transition-colors focus:border-primary-400'

export default function BlogFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  status,
  onStatusChange,
  hasActiveFilters,
  onClear,
}) {
  const { t, tr } = useLanguage()

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div className="relative sm:col-span-2">
          <HiOutlineMagnifyingGlass className="pointer-events-none absolute top-1/2 start-3.5 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t('admin.blog.filters.searchPlaceholder')}
            className={`${inputClass} ps-10`}
          />
        </div>

        <select value={category} onChange={(event) => onCategoryChange(event.target.value)} className={inputClass}>
          <option value="">{t('admin.blog.filters.allCategories')}</option>
          {categories.map((entry) => (
            <option key={entry.id} value={entry.key}>
              {tr(entry.label)}
            </option>
          ))}
        </select>

        <select value={status} onChange={(event) => onStatusChange(event.target.value)} className={inputClass}>
          <option value="">{t('admin.blog.filters.allStatuses')}</option>
          <option value="draft">{t('admin.blog.status.draft')}</option>
          <option value="published">{t('admin.blog.status.published')}</option>
        </select>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-3.5 py-2 text-xs font-semibold text-ink-600 transition-colors hover:border-red-200 hover:text-red-600"
        >
          <HiOutlineXMark className="text-sm" />
          {t('admin.appointments.filters.clear')}
        </button>
      )}
    </div>
  )
}

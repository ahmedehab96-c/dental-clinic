import { HiOutlineMagnifyingGlass, HiOutlineXMark } from 'react-icons/hi2'
import { useLanguage } from '@/context/LanguageContext'

const inputClass =
  'w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-800 outline-none transition-colors focus:border-primary-400'

export default function GalleryFilters({
  search,
  onSearchChange,
  service,
  onServiceChange,
  services,
  isPublished,
  onIsPublishedChange,
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
            placeholder={t('admin.gallery.filters.searchPlaceholder')}
            className={`${inputClass} ps-10`}
          />
        </div>

        <select value={service} onChange={(event) => onServiceChange(event.target.value)} className={inputClass}>
          <option value="">{t('admin.gallery.filters.allServices')}</option>
          {services.map((entry) => (
            <option key={entry.id} value={entry.slug}>
              {tr(entry.name)}
            </option>
          ))}
        </select>

        <select value={isPublished} onChange={(event) => onIsPublishedChange(event.target.value)} className={inputClass}>
          <option value="">{t('admin.gallery.filters.allStatuses')}</option>
          <option value="1">{t('admin.status.active')}</option>
          <option value="0">{t('admin.status.inactive')}</option>
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

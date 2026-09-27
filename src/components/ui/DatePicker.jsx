import { cn } from '@/utils/cn'
import { useLanguage } from '@/context/LanguageContext'

export default function DatePicker({ dates, selectedDate, onSelect }) {
  const { language } = useLanguage()
  const locale = language === 'ar' ? 'ar-SA' : 'en-US'

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {dates.map((dateStr) => {
        const date = new Date(dateStr)
        const isSelected = dateStr === selectedDate
        const weekday = date.toLocaleDateString(locale, { weekday: 'short' })
        const day = date.toLocaleDateString(locale, { day: 'numeric' })
        const month = date.toLocaleDateString(locale, { month: 'short' })

        return (
          <button
            key={dateStr}
            type="button"
            onClick={() => onSelect(dateStr)}
            aria-pressed={isSelected}
            className={cn(
              'flex shrink-0 flex-col items-center gap-0.5 rounded-2xl border px-4 py-3 text-center transition-all duration-200',
              isSelected
                ? 'border-primary-600 bg-primary-600 text-white shadow-soft'
                : 'border-ink-200 bg-white text-ink-700 hover:border-primary-300',
            )}
          >
            <span className="text-[11px] font-medium uppercase opacity-80">{weekday}</span>
            <span className="text-lg font-bold">{day}</span>
            <span className="text-[11px] opacity-80">{month}</span>
          </button>
        )
      })}
    </div>
  )
}

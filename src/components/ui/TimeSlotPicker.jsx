import { cn } from '@/utils/cn'

export default function TimeSlotPicker({ slots, selectedTime, onSelect }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
      {slots.map(({ time, available }) => {
        const isSelected = time === selectedTime
        return (
          <button
            key={time}
            type="button"
            disabled={!available}
            onClick={() => onSelect(time)}
            aria-pressed={isSelected}
            dir="ltr"
            className={cn(
              'rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all duration-200',
              !available && 'cursor-not-allowed border-ink-100 bg-ink-50 text-ink-300 line-through',
              available && isSelected && 'border-primary-600 bg-primary-600 text-white shadow-soft',
              available && !isSelected && 'border-ink-200 bg-white text-ink-700 hover:border-primary-300',
            )}
          >
            {time}
          </button>
        )
      })}
    </div>
  )
}

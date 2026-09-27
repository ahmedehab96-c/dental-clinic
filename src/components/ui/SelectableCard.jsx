import { HiCheckCircle } from 'react-icons/hi2'
import { cn } from '@/utils/cn'

export default function SelectableCard({ selected, onClick, icon, title, subtitle, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'relative flex w-full items-center gap-3 rounded-2xl border p-4 text-start transition-all duration-200',
        selected
          ? 'border-primary-600 bg-primary-50 shadow-soft'
          : 'border-ink-200 bg-white hover:border-primary-300',
        className,
      )}
    >
      {icon && (
        <span
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl',
            selected ? 'bg-primary-600 text-white' : 'bg-ink-50 text-ink-500',
          )}
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-ink-900">{title}</span>
        {subtitle && <span className="block truncate text-xs text-ink-500">{subtitle}</span>}
      </span>
      {selected && <HiCheckCircle className="shrink-0 text-xl text-primary-600" />}
    </button>
  )
}

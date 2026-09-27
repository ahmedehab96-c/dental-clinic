import { cn } from '@/utils/cn'

export default function FormField({
  label,
  name,
  type = 'text',
  multiline = false,
  rows = 5,
  value,
  onChange,
  onBlur,
  placeholder,
  required,
  dir,
  error,
  className,
}) {
  const Component = multiline ? 'textarea' : 'input'

  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-ink-700">
        {label}
      </label>
      <Component
        id={name}
        name={name}
        type={multiline ? undefined : type}
        rows={multiline ? rows : undefined}
        dir={dir}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(
          'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-ink-800 outline-none transition-colors',
          multiline && 'resize-none',
          error ? 'border-red-300 focus:border-red-400' : 'border-ink-200 focus:border-primary-400',
        )}
      />
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-1.5 text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}

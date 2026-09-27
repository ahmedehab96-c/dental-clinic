const ACCENTS = {
  primary: 'bg-primary-50 text-primary-600',
  accent: 'bg-accent-50 text-accent-600',
  amber: 'bg-amber-50 text-amber-600',
  emerald: 'bg-emerald-50 text-emerald-600',
}

export default function StatCard({ icon: Icon, label, value, accent = 'primary' }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
      <div className="flex items-center gap-3.5">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${ACCENTS[accent]}`}>
          <Icon />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-ink-500">{label}</p>
          <p className="font-heading text-2xl font-bold text-ink-900">{value}</p>
        </div>
      </div>
    </div>
  )
}

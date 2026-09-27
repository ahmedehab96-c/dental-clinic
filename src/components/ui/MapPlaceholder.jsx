import { HiMapPin } from 'react-icons/hi2'

export default function MapPlaceholder({ label }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-ink-100 bg-medical-gradient shadow-medium">
      <svg className="absolute inset-0 h-full w-full opacity-20" aria-hidden="true">
        <defs>
          <pattern id="map-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary-300" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-grid)" />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="relative flex h-16 w-16 items-center justify-center">
          <span className="absolute h-16 w-16 animate-ping rounded-full bg-primary-400/30" />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-accent-500 text-2xl text-white shadow-medium">
            <HiMapPin />
          </span>
        </span>
      </div>

      {label && (
        <div className="glass absolute inset-x-4 bottom-4 rounded-2xl px-4 py-3 text-sm font-semibold text-ink-900 sm:inset-x-6">
          {label}
        </div>
      )}
    </div>
  )
}

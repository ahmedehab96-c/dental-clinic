import { NavLink } from 'react-router-dom'
import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'
import { cn } from '@/utils/cn'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/hooks/useAuth'

const TABS = [
  { path: '/dashboard', labelKey: 'nav.dashboard' },
  { path: '/appointments', labelKey: 'nav.appointments' },
  { path: '/profile', labelKey: 'nav.profile' },
  { path: '/notifications', labelKey: 'notifications.title' },
]

// Shared pill-tab nav for the three patient-only pages — same visual
// language as the Blog/Gallery category filters, so it doesn't introduce a
// new pattern into the design system.
export default function PatientTabs() {
  const { t } = useLanguage()
  const { logout } = useAuth()

  // No explicit navigate() here — clearing the user is enough. We're
  // always on a ProtectedRoute-guarded page when this fires, and its own
  // effect already redirects to /login the moment isAuthenticated flips.
  // A competing navigate() call here raced that redirect and lost anyway.
  const handleLogout = () => {
    logout()
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {TABS.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            cn(
              'rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors duration-200',
              isActive
                ? 'border-primary-600 bg-primary-600 text-white'
                : 'border-ink-200 bg-white text-ink-600 hover:border-primary-300 hover:text-primary-700',
            )
          }
        >
          {t(tab.labelKey)}
        </NavLink>
      ))}
      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink-600 transition-colors duration-200 hover:border-red-300 hover:text-red-600"
      >
        <HiOutlineArrowRightOnRectangle className="text-base" />
        {t('nav.logout')}
      </button>
    </div>
  )
}

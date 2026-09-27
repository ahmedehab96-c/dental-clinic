import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { HiBars3, HiXMark, HiOutlineLanguage, HiOutlineUserCircle } from 'react-icons/hi2'
import { navLinks } from '@/data/navLinks'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/hooks/useAuth'
import { useScrollPosition } from '@/hooks/useScrollPosition'
import Button from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { homePathFor } from '@/utils/homePath'
import NotificationBell from '@/components/notifications/NotificationBell'

export default function Navbar() {
  const isScrolled = useScrollPosition(40)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { t, language, toggleLanguage } = useLanguage()
  const { isAuthenticated, user } = useAuth()
  const { pathname } = useLocation()

  const isTransparentRoute = pathname === '/'

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

  const isSolid = isScrolled || !isTransparentRoute || isMobileOpen

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        isSolid ? 'bg-white/90 shadow-soft backdrop-blur-lg' : 'bg-transparent',
      )}
    >
      <nav className="container-app flex h-20 items-center justify-between">
        <Link to="/" className="group flex items-center gap-2.5 font-heading text-lg font-bold">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-white shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <ToothMark />
          </span>
          <span className="text-ink-900">{t('common.brand')}</span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.key}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    'group relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'text-primary-700'
                      : isSolid
                        ? 'text-ink-600 hover:text-primary-700'
                        : 'text-ink-800 hover:text-primary-700',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {t(link.labelKey)}
                    <span
                      className={cn(
                        'absolute inset-x-4 -bottom-0.5 h-0.5 origin-center rounded-full bg-primary-600 transition-transform duration-300',
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                      )}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-ink-600 transition-colors hover:text-primary-700"
              aria-label="Toggle language"
            >
              <HiOutlineLanguage className="text-lg" />
              {language === 'ar' ? 'EN' : 'AR'}
            </button>
            <Link
              to={isAuthenticated ? homePathFor(user) : '/login'}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-200',
                isSolid ? 'text-ink-600 hover:text-primary-700' : 'text-ink-800 hover:text-primary-700',
              )}
            >
              <HiOutlineUserCircle className="text-lg" />
              {isAuthenticated ? user?.name?.split(' ')[0] : t('nav.login')}
            </Link>
            <Button to="/book-appointment" variant="primary" size="md">
              {t('common.bookAppointment')}
            </Button>
          </div>

          <NotificationBell />

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full text-2xl text-ink-800 lg:hidden"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <HiXMark /> : <HiBars3 />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-ink-100 bg-white lg:hidden"
          >
            <ul className="container-app flex flex-col gap-1 py-4">
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.key}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <NavLink
                    to={link.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'block rounded-xl px-4 py-3 text-sm font-medium',
                        isActive ? 'bg-primary-50 text-primary-700' : 'text-ink-700',
                      )
                    }
                  >
                    {t(link.labelKey)}
                  </NavLink>
                </motion.li>
              ))}
              <li>
                <NavLink
                  to={isAuthenticated ? homePathFor(user) : '/login'}
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-ink-700"
                >
                  <HiOutlineUserCircle className="text-lg" />
                  {isAuthenticated ? user?.name?.split(' ')[0] : t('nav.login')}
                </NavLink>
              </li>
              <li className="flex items-center justify-between px-4 pt-2">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="flex items-center gap-1.5 text-sm font-semibold text-ink-600"
                >
                  <HiOutlineLanguage className="text-lg" />
                  {language === 'ar' ? 'English' : 'العربية'}
                </button>
                <Button
                  to="/book-appointment"
                  variant="primary"
                  size="md"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {t('common.bookAppointment')}
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

function ToothMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3c-1.7 0-2.6.8-3.6.8-1.35 0-2.4 1.1-2.4 3.2 0 2.25.9 4.65 1.6 6.25.5 1.1.9 2.05 1.65 2.05.95 0 .97-2.3 1.35-3.95.23-1 .45-1.65 1.4-1.65s1.17.65 1.4 1.65c.38 1.65.4 3.95 1.35 3.95.75 0 1.15-.95 1.65-2.05.7-1.6 1.6-4 1.6-6.25 0-2.1-1.05-3.2-2.4-3.2-1 0-1.9-.8-3.6-.8z"
        fill="currentColor"
      />
    </svg>
  )
}

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HiBars3, HiOutlineLanguage, HiOutlineChevronDown, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'
import AdminBreadcrumbs from '@/components/admin/AdminBreadcrumbs'
import NotificationBell from '@/components/notifications/NotificationBell'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/hooks/useAuth'

export default function AdminTopbar({ onMenuClick, breadcrumbs }) {
  const { t, language, toggleLanguage } = useLanguage()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between border-b border-ink-100 bg-white/90 px-4 backdrop-blur-lg sm:px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-xl text-ink-700 hover:bg-ink-50 lg:hidden"
          aria-label={t('admin.topbar.toggleMenu')}
        >
          <HiBars3 />
        </button>
        <AdminBreadcrumbs {...breadcrumbs} />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleLanguage}
          className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-ink-600 transition-colors hover:text-primary-700 sm:flex"
          aria-label="Toggle language"
        >
          <HiOutlineLanguage className="text-lg" />
          {language === 'ar' ? 'EN' : 'AR'}
        </button>

        <NotificationBell />

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-full border border-ink-100 py-1.5 ps-1.5 pe-3 transition-colors hover:border-primary-200"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
              {user?.name?.[0]?.toUpperCase() ?? 'A'}
            </span>
            <span className="hidden max-w-[10rem] truncate text-sm font-semibold text-ink-800 sm:inline">{user?.name}</span>
            <HiOutlineChevronDown className="text-sm text-ink-400" />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute end-0 z-20 mt-2 w-52 rounded-2xl border border-ink-100 bg-white p-2 shadow-medium"
                >
                  <div className="border-b border-ink-100 px-3 py-2.5">
                    <p className="truncate text-sm font-semibold text-ink-900">{user?.name}</p>
                    <p className="truncate text-xs text-ink-500">{user?.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      logout()
                    }}
                    className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    <HiOutlineArrowRightOnRectangle className="text-base" />
                    {t('nav.logout')}
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

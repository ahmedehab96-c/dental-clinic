import { Suspense, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'
import PageLoader from '@/components/ui/PageLoader'
import { useLanguage } from '@/context/LanguageContext'

// Shared dashboard shell. Defaults render the admin panel; DoctorLayout
// passes the doctor panel's links, label and base path.
export default function AdminLayout({ links, panelLabelKey, basePath }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { isRtl } = useLanguage()

  return (
    <div className="flex min-h-screen bg-ink-50/60">
      <aside className="hidden lg:sticky lg:top-0 lg:block lg:h-screen lg:w-72 lg:shrink-0">
        <AdminSidebar links={links} panelLabelKey={panelLabelKey} />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-ink-950/50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: isRtl ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '100%' : '-100%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-y-0 start-0 z-50 w-72 lg:hidden"
            >
              <AdminSidebar links={links} panelLabelKey={panelLabelKey} onNavigate={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar onMenuClick={() => setMobileOpen(true)} breadcrumbs={{ links, panelLabelKey, basePath }} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Suspense fallback={<PageLoader />}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </Suspense>
        </main>
      </div>
    </div>
  )
}

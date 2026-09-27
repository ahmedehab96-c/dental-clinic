import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import PageLoader from '@/components/ui/PageLoader'
import { homePathFor } from '@/utils/homePath'

/**
 * Guards every patient-only route (/dashboard, /appointments, /profile).
 * Waits for the initial auth check (AuthContext.loading) before deciding —
 * otherwise a page refresh would bounce an already-logged-in patient to
 * /login for a flash before their token finishes verifying.
 *
 * Redirects imperatively (via an effect) rather than rendering a
 * declarative <Navigate> during render — MainLayout's AnimatePresence
 * wraps the outlet keyed by pathname, and a <Navigate> rendered inline
 * here fights that on the very first paint of a protected route.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, loading, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true, state: { from: location } })
    } else if (!loading && isAuthenticated && user?.role !== 'patient') {
      // These pages are patient self-service; admins and doctors go to
      // their own panel instead of loading patient-only data.
      navigate(homePathFor(user), { replace: true })
    }
    // Only the auth state should trigger this — `location`/`navigate` are
    // read at redirect time, not meant to re-fire the effect on their own.
    // eslint-disable-next-line
  }, [loading, isAuthenticated, user?.role])

  if (loading || !isAuthenticated || user?.role !== 'patient') return <PageLoader />

  return <Outlet />
}

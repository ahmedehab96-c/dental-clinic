import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { HiOutlineShieldExclamation } from 'react-icons/hi2'
import Button from '@/components/ui/Button'
import PageLoader from '@/components/ui/PageLoader'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/context/LanguageContext'
import { homePathFor } from '@/utils/homePath'

/**
 * Guards a role-specific area (/admin, /doctor). This is UX only — the
 * Laravel `role:` middleware is the real security boundary on every
 * endpoint these pages call.
 *
 * Unauthenticated → redirect to /login (same pattern as ProtectedRoute).
 * Authenticated but wrong role → inline access-denied message rather than a
 * silent redirect, so it's clear *why* they can't see this page.
 */
export default function RoleRoute({ role, deniedKey }) {
  const { isAuthenticated, loading, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true })
    }
    // eslint-disable-next-line
  }, [loading, isAuthenticated])

  if (loading || !isAuthenticated) return <PageLoader />

  if (user?.role !== role) return <AccessDenied deniedKey={deniedKey} homePath={homePathFor(user)} />

  return <Outlet />
}

function AccessDenied({ deniedKey, homePath }) {
  const { t } = useLanguage()

  return (
    <section className="bg-medical-gradient flex min-h-[70vh] items-center justify-center px-4 pt-32 pb-20">
      <div className="mx-auto max-w-md rounded-[2rem] border border-ink-100 bg-white p-9 text-center shadow-medium">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl text-red-600">
          <HiOutlineShieldExclamation />
        </span>
        <h1 className="font-heading mt-5 text-2xl font-bold text-ink-900">{t(`${deniedKey}.title`)}</h1>
        <p className="mt-3 text-ink-500">{t(`${deniedKey}.subtitle`)}</p>
        <Button to={homePath} variant="primary" size="lg" className="mt-7">
          {t('admin.accessDenied.backHome')}
        </Button>
      </div>
    </section>
  )
}

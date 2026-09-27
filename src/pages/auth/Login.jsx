import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageHero from '@/components/layout/PageHero'
import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'
import { isRequired, isValidEmail } from '@/utils/validators'
import { homePathFor } from '@/utils/homePath'

export default function Login() {
  const { t } = useLanguage()
  usePageTitle(t('nav.login'), { description: t('authPage.login.heroSubtitle') })
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  if (isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || homePathFor(user)
    return <Navigate to={redirectTo} replace />
  }

  const errors = {
    email: !isRequired(formData.email)
      ? 'required'
      : !isValidEmail(formData.email)
        ? 'invalidEmail'
        : null,
    password: !isRequired(formData.password) ? 'required' : null,
  }

  const setField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    setTouched((prev) => ({ ...prev, [key]: true }))
  }

  const errorFor = (field) => (touched[field] && errors[field] ? t(`authPage.validation.${errors[field]}`) : undefined)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (errors.email || errors.password) {
      setTouched({ email: true, password: true })
      return
    }

    setIsSubmitting(true)
    setFormError(null)

    try {
      const loggedInUser = await login({ email: formData.email.trim(), password: formData.password })
      const redirectTo = location.state?.from?.pathname || homePathFor(loggedInUser)
      navigate(redirectTo, { replace: true })
    } catch (error) {
      // A 422 here is Laravel's "these credentials are incorrect" response —
      // shown as one generic message rather than pointing at a specific
      // field, which avoids confirming whether an email is registered.
      setFormError(error.status === 422 ? 'authPage.login.invalidCredentials' : 'authPage.genericError')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <PageHero
        eyebrow={t('authPage.login.heroEyebrow')}
        title={t('authPage.login.heroTitle')}
        subtitle={t('authPage.login.heroSubtitle')}
      />

      <section className="py-14 sm:py-20">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mx-auto max-w-md rounded-[2rem] border border-ink-100 bg-white p-7 shadow-soft sm:p-9"
          >
            <form onSubmit={handleSubmit} noValidate>
              {formError && (
                <div role="alert" className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {t(formError)}
                </div>
              )}

              <div className="flex flex-col gap-5">
                <FormField
                  label={t('authPage.login.emailLabel')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => setField('email', event.target.value)}
                  placeholder={t('authPage.login.emailPlaceholder')}
                  error={errorFor('email')}
                  required
                />
                <FormField
                  label={t('authPage.login.passwordLabel')}
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={(event) => setField('password', event.target.value)}
                  placeholder={t('authPage.login.passwordPlaceholder')}
                  error={errorFor('password')}
                  required
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="mt-7 w-full" disabled={isSubmitting}>
                {isSubmitting ? t('authPage.login.submitting') : t('authPage.login.submit')}
              </Button>

              <p className="mt-6 text-center text-sm text-ink-500">
                {t('authPage.login.noAccount')}{' '}
                <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
                  {t('authPage.login.registerLink')}
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  )
}

import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageHero from '@/components/layout/PageHero'
import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'
import { isRequired, isValidEmail, isValidPhone, isValidPassword } from '@/utils/validators'

const initialFormState = { name: '', email: '', phone: '', password: '', passwordConfirmation: '' }

export default function Register() {
  const { t } = useLanguage()
  usePageTitle(t('nav.register'), { description: t('authPage.register.heroSubtitle') })
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState(initialFormState)
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const [serverFieldErrors, setServerFieldErrors] = useState({})

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const errors = {
    name: !isRequired(formData.name) || formData.name.trim().length < 2 ? 'required' : null,
    email: !isRequired(formData.email) ? 'required' : !isValidEmail(formData.email) ? 'invalidEmail' : null,
    phone: !isRequired(formData.phone) ? 'required' : !isValidPhone(formData.phone) ? 'invalidPhone' : null,
    password: !isRequired(formData.password)
      ? 'required'
      : !isValidPassword(formData.password)
        ? 'invalidPassword'
        : null,
    passwordConfirmation: !isRequired(formData.passwordConfirmation)
      ? 'required'
      : formData.passwordConfirmation !== formData.password
        ? 'passwordMismatch'
        : null,
  }

  const setField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    setTouched((prev) => ({ ...prev, [key]: true }))
    if (serverFieldErrors[key]) {
      setServerFieldErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  const errorFor = (field) => {
    if (touched[field] && errors[field]) return t(`authPage.validation.${errors[field]}`)
    if (serverFieldErrors[field] === 'emailTaken') return t('authPage.register.emailTaken')
    if (serverFieldErrors[field]) return t('authPage.validation.invalid')
    return undefined
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (Object.values(errors).some(Boolean)) {
      setTouched({ name: true, email: true, phone: true, password: true, passwordConfirmation: true })
      return
    }

    setIsSubmitting(true)
    setFormError(null)
    setServerFieldErrors({})

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        passwordConfirmation: formData.passwordConfirmation,
      })
      navigate('/dashboard', { replace: true })
    } catch (error) {
      if (error.status === 422 && error.errors) {
        const mapped = {}
        for (const field of Object.keys(error.errors)) {
          mapped[field] = field === 'email' ? 'emailTaken' : true
        }
        setServerFieldErrors(mapped)
        setTouched((prev) => ({ ...prev, ...Object.fromEntries(Object.keys(mapped).map((key) => [key, true])) }))
      } else {
        setFormError('authPage.genericError')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <PageHero
        eyebrow={t('authPage.register.heroEyebrow')}
        title={t('authPage.register.heroTitle')}
        subtitle={t('authPage.register.heroSubtitle')}
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
                  label={t('authPage.register.nameLabel')}
                  name="name"
                  value={formData.name}
                  onChange={(event) => setField('name', event.target.value)}
                  placeholder={t('authPage.register.namePlaceholder')}
                  error={errorFor('name')}
                  required
                />
                <FormField
                  label={t('authPage.register.emailLabel')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => setField('email', event.target.value)}
                  placeholder={t('authPage.register.emailPlaceholder')}
                  error={errorFor('email')}
                  required
                />
                <FormField
                  label={t('authPage.register.phoneLabel')}
                  name="phone"
                  type="tel"
                  dir="ltr"
                  value={formData.phone}
                  onChange={(event) => setField('phone', event.target.value)}
                  placeholder={t('authPage.register.phonePlaceholder')}
                  error={errorFor('phone')}
                  required
                />
                <FormField
                  label={t('authPage.register.passwordLabel')}
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={(event) => setField('password', event.target.value)}
                  placeholder={t('authPage.register.passwordPlaceholder')}
                  error={errorFor('password')}
                  required
                />
                <FormField
                  label={t('authPage.register.passwordConfirmationLabel')}
                  name="passwordConfirmation"
                  type="password"
                  value={formData.passwordConfirmation}
                  onChange={(event) => setField('passwordConfirmation', event.target.value)}
                  placeholder={t('authPage.register.passwordConfirmationPlaceholder')}
                  error={errorFor('passwordConfirmation')}
                  required
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="mt-7 w-full" disabled={isSubmitting}>
                {isSubmitting ? t('authPage.register.submitting') : t('authPage.register.submit')}
              </Button>

              <p className="mt-6 text-center text-sm text-ink-500">
                {t('authPage.register.haveAccount')}{' '}
                <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
                  {t('authPage.register.loginLink')}
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  )
}

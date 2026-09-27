import { useState } from 'react'
import { motion } from 'framer-motion'
import PageHero from '@/components/layout/PageHero'
import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'
import PatientTabs from '@/components/patient/PatientTabs'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'
import { isRequired, isValidEmail, isValidPhone } from '@/utils/validators'

export default function Profile() {
  const { t } = useLanguage()
  usePageTitle(t('nav.profile'), { description: t('profilePage.heroSubtitle') })
  const { user, updateProfile } = useAuth()

  // Role and every other backend field are deliberately never read into
  // this form — only name/email/phone are ever sent back to Laravel.
  const [formData, setFormData] = useState({ name: user?.name ?? '', email: user?.email ?? '', phone: user?.phone ?? '' })
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [banner, setBanner] = useState(null) // { type: 'success' | 'error', message }
  const [serverFieldErrors, setServerFieldErrors] = useState({})

  const errors = {
    name: !isRequired(formData.name) || formData.name.trim().length < 2 ? 'required' : null,
    email: !isRequired(formData.email) ? 'required' : !isValidEmail(formData.email) ? 'invalidEmail' : null,
    phone: !isRequired(formData.phone) ? 'required' : !isValidPhone(formData.phone) ? 'invalidPhone' : null,
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
      setTouched({ name: true, email: true, phone: true })
      return
    }

    setIsSubmitting(true)
    setBanner(null)
    setServerFieldErrors({})

    try {
      await updateProfile({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      })
      setBanner({ type: 'success', message: t('profilePage.success') })
    } catch (error) {
      if (error.status === 422 && error.errors) {
        const mapped = {}
        for (const field of Object.keys(error.errors)) {
          mapped[field] = field === 'email' ? 'emailTaken' : true
        }
        setServerFieldErrors(mapped)
        setTouched((prev) => ({ ...prev, ...Object.fromEntries(Object.keys(mapped).map((key) => [key, true])) }))
      } else {
        setBanner({ type: 'error', message: t('authPage.genericError') })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <PageHero
        eyebrow={t('profilePage.heroEyebrow')}
        title={t('profilePage.heroTitle')}
        subtitle={t('profilePage.heroSubtitle')}
      />

      <section className="py-14 sm:py-20">
        <div className="container-app">
          <PatientTabs />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mx-auto mt-10 max-w-md rounded-[2rem] border border-ink-100 bg-white p-7 shadow-soft sm:p-9"
          >
            <form onSubmit={handleSubmit} noValidate>
              {banner && (
                <div
                  role="alert"
                  className={`mb-6 rounded-2xl border px-4 py-3 text-sm font-medium ${
                    banner.type === 'success'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-red-200 bg-red-50 text-red-600'
                  }`}
                >
                  {banner.message}
                </div>
              )}

              <div className="flex flex-col gap-5">
                <FormField
                  label={t('profilePage.nameLabel')}
                  name="name"
                  value={formData.name}
                  onChange={(event) => setField('name', event.target.value)}
                  error={errorFor('name')}
                  required
                />
                <FormField
                  label={t('profilePage.emailLabel')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => setField('email', event.target.value)}
                  error={errorFor('email')}
                  required
                />
                <FormField
                  label={t('profilePage.phoneLabel')}
                  name="phone"
                  type="tel"
                  dir="ltr"
                  value={formData.phone}
                  onChange={(event) => setField('phone', event.target.value)}
                  error={errorFor('phone')}
                  required
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="mt-7 w-full" disabled={isSubmitting}>
                {isSubmitting ? t('profilePage.saving') : t('profilePage.save')}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  )
}

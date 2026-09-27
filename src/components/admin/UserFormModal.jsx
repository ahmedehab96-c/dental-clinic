import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HiOutlineXMark } from 'react-icons/hi2'
import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'
import { createAdminUser, updateAdminUser, USER_ROLES } from '@/services/api/adminUsers'
import { useLanguage } from '@/context/LanguageContext'
import { isRequired, isValidEmail, isValidPassword, isValidPhone } from '@/utils/validators'

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  role: 'patient',
  password: '',
  passwordConfirmation: '',
}

const API_FIELD_TO_FORM_FIELD = {
  name: 'name',
  email: 'email',
  phone: 'phone',
  role: 'role',
  password: 'password',
}

export default function UserFormModal({ open, user, currentUserId, onClose, onSaved }) {
  const { t } = useLanguage()
  const isEdit = Boolean(user)
  const isSelf = isEdit && user.id === currentUserId

  const [formData, setFormData] = useState(emptyForm)
  const [touched, setTouched] = useState({})
  const [serverFieldErrors, setServerFieldErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return

    setFormData(
      user
        ? { ...emptyForm, name: user.name ?? '', email: user.email ?? '', phone: user.phone ?? '', role: user.role }
        : emptyForm,
    )
    setTouched({})
    setServerFieldErrors({})
    setFormError(null)
  }, [open, user])

  if (!open) return null

  // Password is required on create; on edit it's optional and only
  // validated (and sent) when the admin actually types a new one.
  const wantsPassword = !isEdit || formData.password.length > 0
  const errors = {
    name: !isRequired(formData.name) ? 'required' : null,
    email: !isRequired(formData.email) ? 'required' : !isValidEmail(formData.email) ? 'invalidEmail' : null,
    phone: formData.phone && !isValidPhone(formData.phone) ? 'invalidPhone' : null,
    password: !wantsPassword
      ? null
      : !isRequired(formData.password)
        ? 'required'
        : !isValidPassword(formData.password)
          ? 'invalidPassword'
          : null,
    passwordConfirmation:
      wantsPassword && formData.password !== formData.passwordConfirmation ? 'passwordMismatch' : null,
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
    if (serverFieldErrors[field]) return serverFieldErrors[field]
    return undefined
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) return // guards against a double click firing two requests
    if (Object.values(errors).some(Boolean)) {
      setTouched({ name: true, email: true, phone: true, password: true, passwordConfirmation: true })
      return
    }

    setIsSubmitting(true)
    setFormError(null)
    setServerFieldErrors({})

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      role: formData.role,
      password: wantsPassword ? formData.password : '',
      passwordConfirmation: formData.passwordConfirmation,
    }

    try {
      const saved = isEdit ? await updateAdminUser(user.id, payload) : await createAdminUser(payload)
      onSaved(saved, isEdit)
    } catch (error) {
      if (error.status === 422 && error.errors) {
        const mapped = {}
        for (const [apiField, messages] of Object.entries(error.errors)) {
          const field = API_FIELD_TO_FORM_FIELD[apiField]
          if (!field) continue
          mapped[field] =
            apiField === 'email' && messages.some((message) => message.includes('taken'))
              ? t('admin.users.form.emailTaken')
              : t('authPage.validation.invalid')
        }
        setServerFieldErrors(mapped)
      } else if (error.status === 422) {
        // Business-rule refusal (e.g. the self-demotion guard) — no field errors.
        setFormError(t('admin.users.form.selfRoleBlocked'))
      } else {
        setFormError(t('authPage.genericError'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-ink-950/50 px-4 py-8"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          role="dialog"
          aria-modal="true"
          className="w-full max-w-xl rounded-[2rem] border border-ink-100 bg-white p-7 shadow-medium sm:p-9"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-heading text-lg font-bold text-ink-900">
              {t(isEdit ? 'admin.users.form.editTitle' : 'admin.users.form.addTitle')}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('admin.appointments.details.close')}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink-700"
            >
              <HiOutlineXMark className="text-lg" />
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-5">
            {formError && (
              <div role="alert" className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField
                label={t('admin.users.form.name')}
                name="name"
                value={formData.name}
                onChange={(event) => setField('name', event.target.value)}
                error={errorFor('name')}
                required
                className="sm:col-span-2"
              />
              <FormField
                label={t('admin.users.form.email')}
                name="email"
                type="email"
                dir="ltr"
                value={formData.email}
                onChange={(event) => setField('email', event.target.value)}
                error={errorFor('email')}
                required
              />
              <FormField
                label={t('admin.users.form.phone')}
                name="phone"
                type="tel"
                dir="ltr"
                value={formData.phone}
                onChange={(event) => setField('phone', event.target.value)}
                error={errorFor('phone')}
              />
              <div className="sm:col-span-2">
                <label htmlFor="role" className="mb-1.5 block text-sm font-semibold text-ink-700">
                  {t('admin.users.form.role')}
                </label>
                <select
                  id="role"
                  value={formData.role}
                  disabled={isSelf}
                  onChange={(event) => setField('role', event.target.value)}
                  className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-800 outline-none transition-colors focus:border-primary-400 disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-500"
                >
                  {USER_ROLES.map((value) => (
                    <option key={value} value={value}>
                      {t(`admin.users.roles.${value}`)}
                    </option>
                  ))}
                </select>
                {isSelf && <p className="mt-1.5 text-xs text-ink-400">{t('admin.users.form.selfRoleHint')}</p>}
                {errorFor('role') && <p className="mt-1.5 text-xs font-medium text-red-500">{errorFor('role')}</p>}
              </div>
            </div>

            <div className="mt-6 border-t border-ink-100 pt-5">
              <p className="text-sm font-semibold text-ink-700">
                {t(isEdit ? 'admin.users.form.changePassword' : 'admin.users.form.password')}
              </p>
              {isEdit && <p className="mt-1 text-xs text-ink-400">{t('admin.users.form.passwordHint')}</p>}
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  label={t('admin.users.form.newPassword')}
                  name="password"
                  type="password"
                  dir="ltr"
                  value={formData.password}
                  onChange={(event) => setField('password', event.target.value)}
                  error={errorFor('password')}
                  required={!isEdit}
                />
                <FormField
                  label={t('admin.users.form.confirmPassword')}
                  name="passwordConfirmation"
                  type="password"
                  dir="ltr"
                  value={formData.passwordConfirmation}
                  onChange={(event) => setField('passwordConfirmation', event.target.value)}
                  error={errorFor('passwordConfirmation')}
                  required={!isEdit}
                />
              </div>
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <Button type="button" variant="outline" size="md" onClick={onClose} disabled={isSubmitting}>
                {t('admin.users.form.cancel')}
              </Button>
              <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
                {isSubmitting ? t('admin.users.form.saving') : t('admin.users.form.save')}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

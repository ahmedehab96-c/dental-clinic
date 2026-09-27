import { useEffect, useState } from 'react'
import { HiOutlineUser } from 'react-icons/hi2'
import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'
import AsyncState from '@/components/ui/AsyncState'
import ActiveStatusBadge from '@/components/admin/ActiveStatusBadge'
import DoctorProfileMissing from '@/components/doctor/DoctorProfileMissing'
import { useApiData } from '@/hooks/useApiData'
import { fetchDoctorProfile, updateDoctorProfile } from '@/services/api/doctorDashboard'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'
import { isRequired, isValidEmail, isValidPhone } from '@/utils/validators'

const MAX_PHOTO_BYTES = 2 * 1024 * 1024
const ACCEPTED_PHOTO_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const REQUIRED_FIELDS = ['nameAr', 'nameEn', 'specialtyAr', 'specialtyEn', 'bioAr', 'bioEn']

const API_FIELD_TO_FORM_FIELD = {
  name_ar: 'nameAr',
  name_en: 'nameEn',
  specialty_ar: 'specialtyAr',
  specialty_en: 'specialtyEn',
  bio_ar: 'bioAr',
  bio_en: 'bioEn',
  email: 'email',
  phone: 'phone',
  photo: 'photo',
}

function toForm(profile) {
  return {
    nameAr: profile.name?.ar ?? '',
    nameEn: profile.name?.en ?? '',
    specialtyAr: profile.specialty?.ar ?? '',
    specialtyEn: profile.specialty?.en ?? '',
    bioAr: profile.bio?.ar ?? '',
    bioEn: profile.bio?.en ?? '',
    email: profile.email ?? '',
    phone: profile.phone ?? '',
  }
}

export default function DoctorProfile() {
  const { t, tr } = useLanguage()
  usePageTitle(t('doctorPanel.sidebar.profile'))

  const { data: loaded, loading, error, notFound } = useApiData(fetchDoctorProfile, [])

  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoError, setPhotoError] = useState(null)
  const [touched, setTouched] = useState({})
  const [serverFieldErrors, setServerFieldErrors] = useState({})
  const [banner, setBanner] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!loaded) return
    setProfile(loaded)
    setFormData(toForm(loaded))
    setPhotoPreview(loaded.photo)
  }, [loaded])

  if (notFound) return <DoctorProfileMissing />
  if (loading) return <AsyncState status="loading" />
  if (error || !formData) return <AsyncState status="error" />

  const errors = {
    ...Object.fromEntries(REQUIRED_FIELDS.map((field) => [field, isRequired(formData[field]) ? null : 'required'])),
    email: formData.email && !isValidEmail(formData.email) ? 'invalidEmail' : null,
    phone: formData.phone && !isValidPhone(formData.phone) ? 'invalidPhone' : null,
  }

  const setField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    setTouched((prev) => ({ ...prev, [key]: true }))
    setServerFieldErrors((prev) => ({ ...prev, [key]: false }))
  }

  const errorFor = (field) => {
    if (touched[field] && errors[field]) return t(`authPage.validation.${errors[field]}`)
    if (serverFieldErrors[field]) return t('authPage.validation.invalid')
    return undefined
  }

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
      setPhotoError(t('admin.doctors.form.photoInvalidType'))
      return
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError(t('admin.doctors.form.photoTooLarge'))
      return
    }

    setPhotoError(null)
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) return
    if (Object.values(errors).some(Boolean)) {
      setTouched(Object.fromEntries(Object.keys(errors).map((key) => [key, true])))
      return
    }

    setIsSubmitting(true)
    setBanner(null)
    setServerFieldErrors({})

    try {
      const saved = await updateDoctorProfile({
        nameAr: formData.nameAr.trim(),
        nameEn: formData.nameEn.trim(),
        specialtyAr: formData.specialtyAr.trim(),
        specialtyEn: formData.specialtyEn.trim(),
        bioAr: formData.bioAr.trim(),
        bioEn: formData.bioEn.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        photoFile,
      })
      setProfile(saved)
      setFormData(toForm(saved))
      setPhotoFile(null)
      setPhotoPreview(saved.photo)
      setTouched({})
      setBanner({ type: 'success', message: t('doctorPanel.profile.saveSuccess') })
    } catch (err) {
      if (err.status === 422 && err.errors) {
        const mapped = {}
        for (const apiField of Object.keys(err.errors)) {
          const field = API_FIELD_TO_FORM_FIELD[apiField]
          if (field) mapped[field] = true
        }
        setServerFieldErrors(mapped)
        if (mapped.photo) setPhotoError(t('admin.doctors.form.photoInvalidType'))
      }
      setBanner({ type: 'error', message: t('authPage.genericError') })
    } finally {
      setIsSubmitting(false)
    }
  }

  const bilingual = (base, extra = {}) =>
    ['Ar', 'En'].map((suffix) => (
      <FormField
        key={`${base}${suffix}`}
        label={t(`admin.doctors.form.${base}${suffix}`)}
        name={`${base}${suffix}`}
        dir={suffix === 'Ar' ? 'rtl' : 'ltr'}
        value={formData[`${base}${suffix}`]}
        onChange={(event) => setField(`${base}${suffix}`, event.target.value)}
        error={errorFor(`${base}${suffix}`)}
        required
        {...extra}
      />
    ))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink-900">{t('doctorPanel.profile.title')}</h1>
          <p className="mt-1 text-sm text-ink-500">{t('doctorPanel.profile.subtitle')}</p>
        </div>
        <ActiveStatusBadge isActive={profile?.isActive} />
      </div>

      {banner && (
        <div
          role="alert"
          className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
            banner.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-600'
          }`}
        >
          {banner.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft xl:col-span-2">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink-50 ring-1 ring-ink-100">
              {photoPreview ? (
                <img src={photoPreview} alt="" className="h-full w-full object-cover" />
              ) : (
                <HiOutlineUser className="text-3xl text-ink-300" />
              )}
            </div>
            <div>
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:border-primary-300 hover:text-primary-700">
                {t('admin.doctors.form.changePhoto')}
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoChange} />
              </label>
              <p className="mt-1.5 text-xs text-ink-400">{t('admin.doctors.form.photoHint')}</p>
              {photoError && <p className="mt-1 text-xs font-medium text-red-500">{photoError}</p>}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {bilingual('name')}
            {bilingual('specialty')}
            {bilingual('bio', { multiline: true, rows: 4, className: 'sm:col-span-2' })}
            <FormField
              label={t('admin.doctors.form.email')}
              name="email"
              type="email"
              dir="ltr"
              value={formData.email}
              onChange={(event) => setField('email', event.target.value)}
              error={errorFor('email')}
            />
            <FormField
              label={t('admin.doctors.form.phone')}
              name="phone"
              type="tel"
              dir="ltr"
              value={formData.phone}
              onChange={(event) => setField('phone', event.target.value)}
              error={errorFor('phone')}
            />
          </div>

          <div className="mt-7 flex justify-end">
            <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
              {isSubmitting ? t('admin.doctors.form.saving') : t('admin.doctors.form.save')}
            </Button>
          </div>
        </form>

        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
            <h2 className="font-heading text-base font-bold text-ink-900">{t('doctorPanel.overview.servicesTitle')}</h2>
            {profile.services.length === 0 ? (
              <p className="mt-2 text-sm text-ink-400">{t('doctorPanel.overview.noServices')}</p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.services.map((service) => (
                  <span
                    key={service.id}
                    className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
                  >
                    {tr(service.name)}
                  </span>
                ))}
              </div>
            )}
            <p className="mt-4 text-xs text-ink-400">{t('doctorPanel.overview.servicesHint')}</p>
          </div>
          <p className="rounded-2xl border border-ink-100 bg-white p-5 text-xs leading-relaxed text-ink-500 shadow-soft">
            {t('doctorPanel.profile.adminManagedHint')}
          </p>
        </aside>
      </div>
    </div>
  )
}

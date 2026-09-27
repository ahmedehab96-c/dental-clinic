import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HiOutlineXMark, HiOutlineUser } from 'react-icons/hi2'
import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'
import { createAdminDoctor, updateAdminDoctor } from '@/services/api/adminDoctors'
import { useLanguage } from '@/context/LanguageContext'
import { isRequired, isValidEmail, isValidPhone } from '@/utils/validators'

const MAX_PHOTO_BYTES = 2 * 1024 * 1024
const ACCEPTED_PHOTO_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const emptyForm = {
  nameAr: '',
  nameEn: '',
  specialtyAr: '',
  specialtyEn: '',
  bioAr: '',
  bioEn: '',
  email: '',
  phone: '',
  isActive: true,
  serviceIds: [],
}

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
  service_ids: 'serviceIds',
}

export default function DoctorFormModal({ open, doctor, services, onClose, onSaved }) {
  const { t, tr } = useLanguage()
  const isEdit = Boolean(doctor)

  const [formData, setFormData] = useState(emptyForm)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [touched, setTouched] = useState({})
  const [photoError, setPhotoError] = useState(null)
  const [serverFieldErrors, setServerFieldErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return

    if (doctor) {
      setFormData({
        nameAr: doctor.name?.ar ?? '',
        nameEn: doctor.name?.en ?? '',
        specialtyAr: doctor.specialty?.ar ?? '',
        specialtyEn: doctor.specialty?.en ?? '',
        bioAr: doctor.bio?.ar ?? '',
        bioEn: doctor.bio?.en ?? '',
        email: doctor.email ?? '',
        phone: doctor.phone ?? '',
        isActive: doctor.isActive,
        serviceIds: doctor.services.map((service) => service.id),
      })
      setPhotoPreview(doctor.photo)
    } else {
      setFormData(emptyForm)
      setPhotoPreview(null)
    }

    setPhotoFile(null)
    setTouched({})
    setPhotoError(null)
    setServerFieldErrors({})
    setFormError(null)
  }, [open, doctor])

  if (!open) return null

  const errors = {
    nameAr: !isRequired(formData.nameAr) ? 'required' : null,
    nameEn: !isRequired(formData.nameEn) ? 'required' : null,
    specialtyAr: !isRequired(formData.specialtyAr) ? 'required' : null,
    specialtyEn: !isRequired(formData.specialtyEn) ? 'required' : null,
    bioAr: !isRequired(formData.bioAr) ? 'required' : null,
    bioEn: !isRequired(formData.bioEn) ? 'required' : null,
    email: !isRequired(formData.email) ? 'required' : !isValidEmail(formData.email) ? 'invalidEmail' : null,
    phone: !isRequired(formData.phone) ? 'required' : !isValidPhone(formData.phone) ? 'invalidPhone' : null,
  }
  const photoMissing = !isEdit && !photoFile

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
    if (serverFieldErrors[field]) return t('authPage.validation.invalid')
    return undefined
  }

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]
    event.target.value = '' // allow re-picking the same file later
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
    if (serverFieldErrors.photo) {
      setServerFieldErrors((prev) => {
        const next = { ...prev }
        delete next.photo
        return next
      })
    }
  }

  const toggleService = (serviceId) => {
    setFormData((prev) => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter((id) => id !== serviceId)
        : [...prev.serviceIds, serviceId],
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (Object.values(errors).some(Boolean) || photoMissing) {
      setTouched({ nameAr: true, nameEn: true, specialtyAr: true, specialtyEn: true, bioAr: true, bioEn: true, email: true, phone: true })
      if (photoMissing) setPhotoError(t('admin.doctors.form.photoRequired'))
      return
    }

    setIsSubmitting(true)
    setFormError(null)
    setServerFieldErrors({})

    const payload = {
      nameAr: formData.nameAr.trim(),
      nameEn: formData.nameEn.trim(),
      specialtyAr: formData.specialtyAr.trim(),
      specialtyEn: formData.specialtyEn.trim(),
      bioAr: formData.bioAr.trim(),
      bioEn: formData.bioEn.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      isActive: formData.isActive,
      serviceIds: formData.serviceIds,
      photoFile,
    }

    try {
      const saved = isEdit ? await updateAdminDoctor(doctor.slug, payload) : await createAdminDoctor(payload)
      onSaved(saved, isEdit)
    } catch (error) {
      if (error.status === 422 && error.errors) {
        const mapped = {}
        for (const apiField of Object.keys(error.errors)) {
          const field = API_FIELD_TO_FORM_FIELD[apiField]
          if (field) mapped[field] = true
        }
        setServerFieldErrors(mapped)
        if (mapped.photo) setPhotoError(t('admin.doctors.form.photoInvalidType'))
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
          className="w-full max-w-2xl rounded-[2rem] border border-ink-100 bg-white p-7 shadow-medium sm:p-9"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-heading text-lg font-bold text-ink-900">
              {t(isEdit ? 'admin.doctors.form.editTitle' : 'admin.doctors.form.addTitle')}
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
                  {t(isEdit ? 'admin.doctors.form.changePhoto' : 'admin.doctors.form.choosePhoto')}
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoChange} />
                </label>
                <p className="mt-1.5 text-xs text-ink-400">{t('admin.doctors.form.photoHint')}</p>
                {photoError && <p className="mt-1 text-xs font-medium text-red-500">{photoError}</p>}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField
                label={t('admin.doctors.form.nameAr')}
                name="nameAr"
                dir="rtl"
                value={formData.nameAr}
                onChange={(event) => setField('nameAr', event.target.value)}
                error={errorFor('nameAr')}
                required
              />
              <FormField
                label={t('admin.doctors.form.nameEn')}
                name="nameEn"
                dir="ltr"
                value={formData.nameEn}
                onChange={(event) => setField('nameEn', event.target.value)}
                error={errorFor('nameEn')}
                required
              />
              <FormField
                label={t('admin.doctors.form.specialtyAr')}
                name="specialtyAr"
                dir="rtl"
                value={formData.specialtyAr}
                onChange={(event) => setField('specialtyAr', event.target.value)}
                error={errorFor('specialtyAr')}
                required
              />
              <FormField
                label={t('admin.doctors.form.specialtyEn')}
                name="specialtyEn"
                dir="ltr"
                value={formData.specialtyEn}
                onChange={(event) => setField('specialtyEn', event.target.value)}
                error={errorFor('specialtyEn')}
                required
              />
              <FormField
                label={t('admin.doctors.form.bioAr')}
                name="bioAr"
                multiline
                rows={3}
                dir="rtl"
                value={formData.bioAr}
                onChange={(event) => setField('bioAr', event.target.value)}
                error={errorFor('bioAr')}
                required
                className="sm:col-span-2"
              />
              <FormField
                label={t('admin.doctors.form.bioEn')}
                name="bioEn"
                multiline
                rows={3}
                dir="ltr"
                value={formData.bioEn}
                onChange={(event) => setField('bioEn', event.target.value)}
                error={errorFor('bioEn')}
                required
                className="sm:col-span-2"
              />
              <FormField
                label={t('admin.doctors.form.email')}
                name="email"
                type="email"
                dir="ltr"
                value={formData.email}
                onChange={(event) => setField('email', event.target.value)}
                error={errorFor('email')}
                required
              />
              <FormField
                label={t('admin.doctors.form.phone')}
                name="phone"
                type="tel"
                dir="ltr"
                value={formData.phone}
                onChange={(event) => setField('phone', event.target.value)}
                error={errorFor('phone')}
                required
              />
            </div>

            <div className="mt-5">
              <p className="mb-1.5 text-sm font-semibold text-ink-700">{t('admin.doctors.form.services')}</p>
              <div className="max-h-40 overflow-y-auto rounded-2xl border border-ink-200 p-2">
                {services.length === 0 && <p className="p-2 text-sm text-ink-400">{t('admin.doctors.noServices')}</p>}
                {services.map((service) => (
                  <label
                    key={service.id}
                    className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm text-ink-700 hover:bg-ink-50"
                  >
                    <input
                      type="checkbox"
                      checked={formData.serviceIds.includes(service.id)}
                      onChange={() => toggleService(service.id)}
                      className="h-4 w-4 rounded border-ink-300 text-primary-600 focus:ring-primary-400"
                    />
                    {tr(service.name)}
                  </label>
                ))}
              </div>
            </div>

            <label className="mt-5 flex items-center gap-2.5 text-sm font-medium text-ink-700">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(event) => setField('isActive', event.target.checked)}
                className="h-4 w-4 rounded border-ink-300 text-primary-600 focus:ring-primary-400"
              />
              {t('admin.doctors.form.isActive')}
            </label>

            <div className="mt-7 flex justify-end gap-3">
              <Button type="button" variant="outline" size="md" onClick={onClose} disabled={isSubmitting}>
                {t('admin.doctors.form.cancel')}
              </Button>
              <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
                {isSubmitting ? t('admin.doctors.form.saving') : t('admin.doctors.form.save')}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

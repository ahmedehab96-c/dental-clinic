import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HiOutlineXMark, HiOutlineUser } from 'react-icons/hi2'
import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'
import { createAdminTestimonial, updateAdminTestimonial } from '@/services/api/adminTestimonials'
import { useLanguage } from '@/context/LanguageContext'
import { isRequired } from '@/utils/validators'

const MAX_PHOTO_BYTES = 2 * 1024 * 1024
const ACCEPTED_PHOTO_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const emptyForm = {
  nameAr: '',
  nameEn: '',
  roleAr: '',
  roleEn: '',
  rating: 5,
  quoteAr: '',
  quoteEn: '',
  isPublished: true,
}

const API_FIELD_TO_FORM_FIELD = {
  patient_name_ar: 'nameAr',
  patient_name_en: 'nameEn',
  role_ar: 'roleAr',
  role_en: 'roleEn',
  rating: 'rating',
  quote_ar: 'quoteAr',
  quote_en: 'quoteEn',
  photo: 'photo',
}

export default function TestimonialFormModal({ open, item, onClose, onSaved }) {
  const { t } = useLanguage()
  const isEdit = Boolean(item)

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

    if (item) {
      setFormData({
        nameAr: item.name?.ar ?? '',
        nameEn: item.name?.en ?? '',
        roleAr: item.role?.ar ?? '',
        roleEn: item.role?.en ?? '',
        rating: item.rating ?? 5,
        quoteAr: item.quote?.ar ?? '',
        quoteEn: item.quote?.en ?? '',
        isPublished: item.isPublished,
      })
      setPhotoPreview(item.photo)
    } else {
      setFormData(emptyForm)
      setPhotoPreview(null)
    }

    setPhotoFile(null)
    setTouched({})
    setPhotoError(null)
    setServerFieldErrors({})
    setFormError(null)
  }, [open, item])

  if (!open) return null

  const errors = {
    nameAr: !isRequired(formData.nameAr) ? 'required' : null,
    nameEn: !isRequired(formData.nameEn) ? 'required' : null,
    roleAr: !isRequired(formData.roleAr) ? 'required' : null,
    roleEn: !isRequired(formData.roleEn) ? 'required' : null,
    quoteAr: !isRequired(formData.quoteAr) ? 'required' : null,
    quoteEn: !isRequired(formData.quoteEn) ? 'required' : null,
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
    if (touched[field] && errors[field]) return t(`admin.testimonials.form.errors.${errors[field]}`)
    if (serverFieldErrors[field]) return t('authPage.validation.invalid')
    return undefined
  }

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]
    event.target.value = '' // allow re-picking the same file later
    if (!file) return

    if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
      setPhotoError(t('admin.testimonials.form.photoInvalidType'))
      return
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError(t('admin.testimonials.form.photoTooLarge'))
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

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) return // guards against a double click firing two requests
    if (Object.values(errors).some(Boolean) || photoMissing) {
      setTouched({ nameAr: true, nameEn: true, roleAr: true, roleEn: true, quoteAr: true, quoteEn: true })
      if (photoMissing) setPhotoError(t('admin.testimonials.form.photoRequired'))
      return
    }

    setIsSubmitting(true)
    setFormError(null)
    setServerFieldErrors({})

    const payload = {
      nameAr: formData.nameAr.trim(),
      nameEn: formData.nameEn.trim(),
      roleAr: formData.roleAr.trim(),
      roleEn: formData.roleEn.trim(),
      rating: formData.rating,
      quoteAr: formData.quoteAr.trim(),
      quoteEn: formData.quoteEn.trim(),
      isPublished: formData.isPublished,
      photoFile,
    }

    try {
      const saved = isEdit ? await updateAdminTestimonial(item.id, payload) : await createAdminTestimonial(payload)
      onSaved(saved, isEdit)
    } catch (error) {
      if (error.status === 422 && error.errors) {
        const mapped = {}
        for (const apiField of Object.keys(error.errors)) {
          const field = API_FIELD_TO_FORM_FIELD[apiField]
          if (field) mapped[field] = true
        }
        setServerFieldErrors(mapped)
        if (mapped.photo) setPhotoError(t('admin.testimonials.form.photoInvalidType'))
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
              {t(isEdit ? 'admin.testimonials.form.editTitle' : 'admin.testimonials.form.addTitle')}
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
                  {t(isEdit ? 'admin.testimonials.form.changePhoto' : 'admin.testimonials.form.choosePhoto')}
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoChange} />
                </label>
                <p className="mt-1.5 text-xs text-ink-400">{t('admin.testimonials.form.photoHint')}</p>
                {photoError && <p className="mt-1 text-xs font-medium text-red-500">{photoError}</p>}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField
                label={t('admin.testimonials.form.nameAr')}
                name="nameAr"
                dir="rtl"
                value={formData.nameAr}
                onChange={(event) => setField('nameAr', event.target.value)}
                error={errorFor('nameAr')}
                required
              />
              <FormField
                label={t('admin.testimonials.form.nameEn')}
                name="nameEn"
                dir="ltr"
                value={formData.nameEn}
                onChange={(event) => setField('nameEn', event.target.value)}
                error={errorFor('nameEn')}
                required
              />
              <FormField
                label={t('admin.testimonials.form.roleAr')}
                name="roleAr"
                dir="rtl"
                value={formData.roleAr}
                onChange={(event) => setField('roleAr', event.target.value)}
                error={errorFor('roleAr')}
                required
              />
              <FormField
                label={t('admin.testimonials.form.roleEn')}
                name="roleEn"
                dir="ltr"
                value={formData.roleEn}
                onChange={(event) => setField('roleEn', event.target.value)}
                error={errorFor('roleEn')}
                required
              />
              <FormField
                label={t('admin.testimonials.form.quoteAr')}
                name="quoteAr"
                multiline
                rows={3}
                dir="rtl"
                value={formData.quoteAr}
                onChange={(event) => setField('quoteAr', event.target.value)}
                error={errorFor('quoteAr')}
                required
                className="sm:col-span-2"
              />
              <FormField
                label={t('admin.testimonials.form.quoteEn')}
                name="quoteEn"
                multiline
                rows={3}
                dir="ltr"
                value={formData.quoteEn}
                onChange={(event) => setField('quoteEn', event.target.value)}
                error={errorFor('quoteEn')}
                required
                className="sm:col-span-2"
              />
              <div>
                <label htmlFor="rating" className="mb-1.5 block text-sm font-semibold text-ink-700">
                  {t('admin.testimonials.form.rating')}
                </label>
                <select
                  id="rating"
                  value={formData.rating}
                  onChange={(event) => setField('rating', Number(event.target.value))}
                  className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-800 outline-none transition-colors focus:border-primary-400"
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {t('admin.testimonials.filters.ratingOption').replace('{count}', value)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="mt-5 flex items-center gap-2.5 text-sm font-medium text-ink-700">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(event) => setField('isPublished', event.target.checked)}
                className="h-4 w-4 rounded border-ink-300 text-primary-600 focus:ring-primary-400"
              />
              {t('admin.testimonials.form.isPublished')}
            </label>

            <div className="mt-7 flex justify-end gap-3">
              <Button type="button" variant="outline" size="md" onClick={onClose} disabled={isSubmitting}>
                {t('admin.testimonials.form.cancel')}
              </Button>
              <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
                {isSubmitting ? t('admin.testimonials.form.saving') : t('admin.testimonials.form.save')}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HiOutlineXMark, HiOutlineSparkles } from 'react-icons/hi2'
import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'
import { createAdminService, updateAdminService } from '@/services/api/adminServices'
import { useLanguage } from '@/context/LanguageContext'
import { isRequired } from '@/utils/validators'

const MAX_IMAGE_BYTES = 2 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const emptyForm = {
  slug: '',
  nameAr: '',
  nameEn: '',
  shortDescriptionAr: '',
  shortDescriptionEn: '',
  descriptionAr: '',
  descriptionEn: '',
  durationAr: '',
  durationEn: '',
  priceFrom: '',
  isActive: true,
  doctorIds: [],
}

const API_FIELD_TO_FORM_FIELD = {
  slug: 'slug',
  name_ar: 'nameAr',
  name_en: 'nameEn',
  short_description_ar: 'shortDescriptionAr',
  short_description_en: 'shortDescriptionEn',
  description_ar: 'descriptionAr',
  description_en: 'descriptionEn',
  duration_ar: 'durationAr',
  duration_en: 'durationEn',
  price_from: 'priceFrom',
  image: 'image',
  doctor_ids: 'doctorIds',
}

export default function ServiceFormModal({ open, service, doctors, onClose, onSaved }) {
  const { t, tr } = useLanguage()
  const isEdit = Boolean(service)

  const [formData, setFormData] = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [touched, setTouched] = useState({})
  const [imageError, setImageError] = useState(null)
  const [serverFieldErrors, setServerFieldErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return

    if (service) {
      setFormData({
        slug: service.slug ?? '',
        nameAr: service.name?.ar ?? '',
        nameEn: service.name?.en ?? '',
        shortDescriptionAr: service.shortDescription?.ar ?? '',
        shortDescriptionEn: service.shortDescription?.en ?? '',
        descriptionAr: service.description?.ar ?? '',
        descriptionEn: service.description?.en ?? '',
        durationAr: service.duration?.ar ?? '',
        durationEn: service.duration?.en ?? '',
        priceFrom: service.priceFrom !== undefined ? String(service.priceFrom) : '',
        isActive: service.isActive,
        doctorIds: service.doctors.map((doctor) => doctor.id),
      })
      setImagePreview(service.image)
    } else {
      setFormData(emptyForm)
      setImagePreview(null)
    }

    setImageFile(null)
    setTouched({})
    setImageError(null)
    setServerFieldErrors({})
    setFormError(null)
  }, [open, service])

  if (!open) return null

  const errors = {
    slug: !isRequired(formData.slug)
      ? 'required'
      : !SLUG_PATTERN.test(formData.slug.trim())
        ? 'invalidSlug'
        : null,
    nameAr: !isRequired(formData.nameAr) ? 'required' : null,
    nameEn: !isRequired(formData.nameEn) ? 'required' : null,
    shortDescriptionAr: !isRequired(formData.shortDescriptionAr) ? 'required' : null,
    shortDescriptionEn: !isRequired(formData.shortDescriptionEn) ? 'required' : null,
    descriptionAr: !isRequired(formData.descriptionAr) ? 'required' : null,
    descriptionEn: !isRequired(formData.descriptionEn) ? 'required' : null,
    durationAr: !isRequired(formData.durationAr) ? 'required' : null,
    durationEn: !isRequired(formData.durationEn) ? 'required' : null,
    priceFrom:
      !isRequired(formData.priceFrom) ? 'required' : Number(formData.priceFrom) < 0 || Number.isNaN(Number(formData.priceFrom)) ? 'invalidPrice' : null,
  }
  const imageMissing = !isEdit && !imageFile

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
    if (touched[field] && errors[field]) return t(`admin.services.form.errors.${errors[field]}`)
    if (serverFieldErrors[field]) return t('authPage.validation.invalid')
    return undefined
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    event.target.value = '' // allow re-picking the same file later
    if (!file) return

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageError(t('admin.services.form.imageInvalidType'))
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError(t('admin.services.form.imageTooLarge'))
      return
    }

    setImageError(null)
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    if (serverFieldErrors.image) {
      setServerFieldErrors((prev) => {
        const next = { ...prev }
        delete next.image
        return next
      })
    }
  }

  const toggleDoctor = (doctorId) => {
    setFormData((prev) => ({
      ...prev,
      doctorIds: prev.doctorIds.includes(doctorId)
        ? prev.doctorIds.filter((id) => id !== doctorId)
        : [...prev.doctorIds, doctorId],
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (Object.values(errors).some(Boolean) || imageMissing) {
      setTouched({
        slug: true, nameAr: true, nameEn: true, shortDescriptionAr: true, shortDescriptionEn: true,
        descriptionAr: true, descriptionEn: true, durationAr: true, durationEn: true, priceFrom: true,
      })
      if (imageMissing) setImageError(t('admin.services.form.imageRequired'))
      return
    }

    setIsSubmitting(true)
    setFormError(null)
    setServerFieldErrors({})

    const payload = {
      slug: formData.slug.trim(),
      nameAr: formData.nameAr.trim(),
      nameEn: formData.nameEn.trim(),
      shortDescriptionAr: formData.shortDescriptionAr.trim(),
      shortDescriptionEn: formData.shortDescriptionEn.trim(),
      descriptionAr: formData.descriptionAr.trim(),
      descriptionEn: formData.descriptionEn.trim(),
      durationAr: formData.durationAr.trim(),
      durationEn: formData.durationEn.trim(),
      priceFrom: Number(formData.priceFrom),
      isActive: formData.isActive,
      doctorIds: formData.doctorIds,
      imageFile,
    }

    try {
      const saved = isEdit ? await updateAdminService(service.slug, payload) : await createAdminService(payload)
      onSaved(saved, isEdit)
    } catch (error) {
      if (error.status === 422 && error.errors) {
        const mapped = {}
        for (const apiField of Object.keys(error.errors)) {
          const field = API_FIELD_TO_FORM_FIELD[apiField]
          if (field) mapped[field] = true
        }
        setServerFieldErrors(mapped)
        if (mapped.image) setImageError(t('admin.services.form.imageInvalidType'))
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
              {t(isEdit ? 'admin.services.form.editTitle' : 'admin.services.form.addTitle')}
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
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-ink-50 ring-1 ring-ink-100">
                {imagePreview ? (
                  <img src={imagePreview} alt="" className="h-full w-full object-cover" />
                ) : (
                  <HiOutlineSparkles className="text-3xl text-ink-300" />
                )}
              </div>
              <div>
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:border-primary-300 hover:text-primary-700">
                  {t(isEdit ? 'admin.services.form.changeImage' : 'admin.services.form.chooseImage')}
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} />
                </label>
                <p className="mt-1.5 text-xs text-ink-400">{t('admin.services.form.imageHint')}</p>
                {imageError && <p className="mt-1 text-xs font-medium text-red-500">{imageError}</p>}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField
                label={t('admin.services.form.nameAr')}
                name="nameAr"
                dir="rtl"
                value={formData.nameAr}
                onChange={(event) => setField('nameAr', event.target.value)}
                error={errorFor('nameAr')}
                required
              />
              <FormField
                label={t('admin.services.form.nameEn')}
                name="nameEn"
                dir="ltr"
                value={formData.nameEn}
                onChange={(event) => setField('nameEn', event.target.value)}
                error={errorFor('nameEn')}
                required
              />
              <FormField
                label={t('admin.services.form.slug')}
                name="slug"
                dir="ltr"
                value={formData.slug}
                onChange={(event) => setField('slug', event.target.value)}
                error={errorFor('slug')}
                placeholder="teeth-whitening"
                className="sm:col-span-2"
                required
              />
              <FormField
                label={t('admin.services.form.shortDescriptionAr')}
                name="shortDescriptionAr"
                dir="rtl"
                value={formData.shortDescriptionAr}
                onChange={(event) => setField('shortDescriptionAr', event.target.value)}
                error={errorFor('shortDescriptionAr')}
                required
              />
              <FormField
                label={t('admin.services.form.shortDescriptionEn')}
                name="shortDescriptionEn"
                dir="ltr"
                value={formData.shortDescriptionEn}
                onChange={(event) => setField('shortDescriptionEn', event.target.value)}
                error={errorFor('shortDescriptionEn')}
                required
              />
              <FormField
                label={t('admin.services.form.descriptionAr')}
                name="descriptionAr"
                multiline
                rows={3}
                dir="rtl"
                value={formData.descriptionAr}
                onChange={(event) => setField('descriptionAr', event.target.value)}
                error={errorFor('descriptionAr')}
                required
                className="sm:col-span-2"
              />
              <FormField
                label={t('admin.services.form.descriptionEn')}
                name="descriptionEn"
                multiline
                rows={3}
                dir="ltr"
                value={formData.descriptionEn}
                onChange={(event) => setField('descriptionEn', event.target.value)}
                error={errorFor('descriptionEn')}
                required
                className="sm:col-span-2"
              />
              <FormField
                label={t('admin.services.form.durationAr')}
                name="durationAr"
                dir="rtl"
                value={formData.durationAr}
                onChange={(event) => setField('durationAr', event.target.value)}
                error={errorFor('durationAr')}
                required
              />
              <FormField
                label={t('admin.services.form.durationEn')}
                name="durationEn"
                dir="ltr"
                value={formData.durationEn}
                onChange={(event) => setField('durationEn', event.target.value)}
                error={errorFor('durationEn')}
                required
              />
              <FormField
                label={t('admin.services.form.price')}
                name="priceFrom"
                type="number"
                dir="ltr"
                value={formData.priceFrom}
                onChange={(event) => setField('priceFrom', event.target.value)}
                error={errorFor('priceFrom')}
                required
              />
            </div>

            <div className="mt-5">
              <p className="mb-1.5 text-sm font-semibold text-ink-700">{t('admin.services.form.doctors')}</p>
              <div className="max-h-40 overflow-y-auto rounded-2xl border border-ink-200 p-2">
                {doctors.length === 0 && <p className="p-2 text-sm text-ink-400">{t('admin.services.noDoctors')}</p>}
                {doctors.map((doctor) => (
                  <label
                    key={doctor.id}
                    className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm text-ink-700 hover:bg-ink-50"
                  >
                    <input
                      type="checkbox"
                      checked={formData.doctorIds.includes(doctor.id)}
                      onChange={() => toggleDoctor(doctor.id)}
                      className="h-4 w-4 rounded border-ink-300 text-primary-600 focus:ring-primary-400"
                    />
                    {tr(doctor.name)}
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
              {t('admin.services.form.isActive')}
            </label>

            <div className="mt-7 flex justify-end gap-3">
              <Button type="button" variant="outline" size="md" onClick={onClose} disabled={isSubmitting}>
                {t('admin.services.form.cancel')}
              </Button>
              <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
                {isSubmitting ? t('admin.services.form.saving') : t('admin.services.form.save')}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

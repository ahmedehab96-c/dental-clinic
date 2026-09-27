import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HiOutlineXMark, HiOutlinePhoto } from 'react-icons/hi2'
import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'
import { createAdminGalleryCase, updateAdminGalleryCase } from '@/services/api/adminGallery'
import { useLanguage } from '@/context/LanguageContext'
import { isRequired } from '@/utils/validators'

const MAX_IMAGE_BYTES = 2 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const emptyForm = {
  titleAr: '',
  titleEn: '',
  serviceId: '',
  isPublished: true,
}

const API_FIELD_TO_FORM_FIELD = {
  title_ar: 'titleAr',
  title_en: 'titleEn',
  service_id: 'serviceId',
  before_image: 'beforeImage',
  after_image: 'afterImage',
}

/** One side (before/after) of the image picker — the two are fully independent. */
function ImageField({ label, chooseLabel, changeLabel, preview, error, isEdit, onChange }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold text-ink-700">{label}</p>
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-ink-50 ring-1 ring-ink-100">
          {preview ? (
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <HiOutlinePhoto className="text-3xl text-ink-300" />
          )}
        </div>
        <div>
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:border-primary-300 hover:text-primary-700">
            {isEdit ? changeLabel : chooseLabel}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onChange} />
          </label>
          {error && <p className="mt-1 text-xs font-medium text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  )
}

export default function GalleryCaseFormModal({ open, item, services, onClose, onSaved }) {
  const { t, tr } = useLanguage()
  const isEdit = Boolean(item)

  const [formData, setFormData] = useState(emptyForm)
  const [beforeImageFile, setBeforeImageFile] = useState(null)
  const [beforePreview, setBeforePreview] = useState(null)
  const [beforeError, setBeforeError] = useState(null)
  const [afterImageFile, setAfterImageFile] = useState(null)
  const [afterPreview, setAfterPreview] = useState(null)
  const [afterError, setAfterError] = useState(null)
  const [touched, setTouched] = useState({})
  const [serverFieldErrors, setServerFieldErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return

    if (item) {
      setFormData({
        titleAr: item.title?.ar ?? '',
        titleEn: item.title?.en ?? '',
        serviceId: item.service?.id !== undefined ? String(item.service.id) : '',
        isPublished: item.isPublished,
      })
      setBeforePreview(item.beforeImage)
      setAfterPreview(item.afterImage)
    } else {
      setFormData(emptyForm)
      setBeforePreview(null)
      setAfterPreview(null)
    }

    setBeforeImageFile(null)
    setAfterImageFile(null)
    setTouched({})
    setBeforeError(null)
    setAfterError(null)
    setServerFieldErrors({})
    setFormError(null)
  }, [open, item])

  if (!open) return null

  const errors = {
    titleAr: !isRequired(formData.titleAr) ? 'required' : null,
    titleEn: !isRequired(formData.titleEn) ? 'required' : null,
    serviceId: !isRequired(formData.serviceId) ? 'required' : null,
  }
  const beforeMissing = !isEdit && !beforeImageFile
  const afterMissing = !isEdit && !afterImageFile

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
    if (touched[field] && errors[field]) return t(`admin.gallery.form.errors.${errors[field]}`)
    if (serverFieldErrors[field]) return t('authPage.validation.invalid')
    return undefined
  }

  const handleImagePick = (side) => (event) => {
    const file = event.target.files?.[0]
    event.target.value = '' // allow re-picking the same file later
    if (!file) return

    const setFile = side === 'before' ? setBeforeImageFile : setAfterImageFile
    const setPreview = side === 'before' ? setBeforePreview : setAfterPreview
    const setError = side === 'before' ? setBeforeError : setAfterError
    const errorField = side === 'before' ? 'beforeImage' : 'afterImage'

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError(t('admin.gallery.form.imageInvalidType'))
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError(t('admin.gallery.form.imageTooLarge'))
      return
    }

    setError(null)
    setFile(file)
    setPreview(URL.createObjectURL(file))
    if (serverFieldErrors[errorField]) {
      setServerFieldErrors((prev) => {
        const next = { ...prev }
        delete next[errorField]
        return next
      })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) return // guards against a double click firing two requests
    if (Object.values(errors).some(Boolean) || beforeMissing || afterMissing) {
      setTouched({ titleAr: true, titleEn: true, serviceId: true })
      if (beforeMissing) setBeforeError(t('admin.gallery.form.imageRequired'))
      if (afterMissing) setAfterError(t('admin.gallery.form.imageRequired'))
      return
    }

    setIsSubmitting(true)
    setFormError(null)
    setServerFieldErrors({})

    const payload = {
      titleAr: formData.titleAr.trim(),
      titleEn: formData.titleEn.trim(),
      serviceId: formData.serviceId,
      isPublished: formData.isPublished,
      beforeImageFile,
      afterImageFile,
    }

    try {
      const saved = isEdit ? await updateAdminGalleryCase(item.id, payload) : await createAdminGalleryCase(payload)
      onSaved(saved, isEdit)
    } catch (error) {
      if (error.status === 422 && error.errors) {
        const mapped = {}
        for (const apiField of Object.keys(error.errors)) {
          const field = API_FIELD_TO_FORM_FIELD[apiField]
          if (field) mapped[field] = true
        }
        setServerFieldErrors(mapped)
        if (mapped.beforeImage) setBeforeError(t('admin.gallery.form.imageInvalidType'))
        if (mapped.afterImage) setAfterError(t('admin.gallery.form.imageInvalidType'))
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
              {t(isEdit ? 'admin.gallery.form.editTitle' : 'admin.gallery.form.addTitle')}
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

            <p className="mb-1.5 text-xs text-ink-400">{t('admin.gallery.form.imageHint')}</p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <ImageField
                label={t('admin.gallery.form.beforeImage')}
                chooseLabel={t('admin.gallery.form.chooseImage')}
                changeLabel={t('admin.gallery.form.changeImage')}
                preview={beforePreview}
                error={beforeError}
                isEdit={isEdit}
                onChange={handleImagePick('before')}
              />
              <ImageField
                label={t('admin.gallery.form.afterImage')}
                chooseLabel={t('admin.gallery.form.chooseImage')}
                changeLabel={t('admin.gallery.form.changeImage')}
                preview={afterPreview}
                error={afterError}
                isEdit={isEdit}
                onChange={handleImagePick('after')}
              />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField
                label={t('admin.gallery.form.titleAr')}
                name="titleAr"
                dir="rtl"
                value={formData.titleAr}
                onChange={(event) => setField('titleAr', event.target.value)}
                error={errorFor('titleAr')}
                required
              />
              <FormField
                label={t('admin.gallery.form.titleEn')}
                name="titleEn"
                dir="ltr"
                value={formData.titleEn}
                onChange={(event) => setField('titleEn', event.target.value)}
                error={errorFor('titleEn')}
                required
              />
              <div className="sm:col-span-2">
                <label htmlFor="serviceId" className="mb-1.5 block text-sm font-semibold text-ink-700">
                  {t('admin.gallery.form.service')}
                </label>
                <select
                  id="serviceId"
                  value={formData.serviceId}
                  onChange={(event) => setField('serviceId', event.target.value)}
                  className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-ink-800 outline-none transition-colors ${
                    errorFor('serviceId') ? 'border-red-300 focus:border-red-400' : 'border-ink-200 focus:border-primary-400'
                  }`}
                >
                  <option value="">{t('admin.gallery.form.selectService')}</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {tr(service.name)}
                    </option>
                  ))}
                </select>
                {errorFor('serviceId') && <p className="mt-1.5 text-xs font-medium text-red-500">{errorFor('serviceId')}</p>}
              </div>
            </div>

            <label className="mt-5 flex items-center gap-2.5 text-sm font-medium text-ink-700">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(event) => setField('isPublished', event.target.checked)}
                className="h-4 w-4 rounded border-ink-300 text-primary-600 focus:ring-primary-400"
              />
              {t('admin.gallery.form.isPublished')}
            </label>

            <div className="mt-7 flex justify-end gap-3">
              <Button type="button" variant="outline" size="md" onClick={onClose} disabled={isSubmitting}>
                {t('admin.gallery.form.cancel')}
              </Button>
              <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
                {isSubmitting ? t('admin.gallery.form.saving') : t('admin.gallery.form.save')}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

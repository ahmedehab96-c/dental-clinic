import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HiOutlineXMark, HiOutlineNewspaper } from 'react-icons/hi2'
import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'
import { createAdminPost, updateAdminPost, paragraphsToText } from '@/services/api/adminBlog'
import { useLanguage } from '@/context/LanguageContext'
import { isRequired } from '@/utils/validators'

const MAX_IMAGE_BYTES = 2 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const emptyForm = {
  slug: '',
  categoryId: '',
  titleAr: '',
  titleEn: '',
  excerptAr: '',
  excerptEn: '',
  contentAr: '',
  contentEn: '',
  status: 'draft',
  publishedAt: '',
}

const API_FIELD_TO_FORM_FIELD = {
  slug: 'slug',
  category_id: 'categoryId',
  title_ar: 'titleAr',
  title_en: 'titleEn',
  excerpt_ar: 'excerptAr',
  excerpt_en: 'excerptEn',
  content_ar: 'contentAr',
  content_en: 'contentEn',
  image: 'image',
  status: 'status',
  published_at: 'publishedAt',
}

/** ISO string → the local "YYYY-MM-DDTHH:mm" value a datetime-local input needs. */
function toDatetimeLocalValue(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function BlogPostFormModal({ open, post, categories, onClose, onSaved }) {
  const { t, tr } = useLanguage()
  const isEdit = Boolean(post)

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

    if (post) {
      setFormData({
        slug: post.slug ?? '',
        categoryId: post.category?.id !== undefined ? String(post.category.id) : '',
        titleAr: post.title?.ar ?? '',
        titleEn: post.title?.en ?? '',
        excerptAr: post.excerpt?.ar ?? '',
        excerptEn: post.excerpt?.en ?? '',
        contentAr: paragraphsToText(post.content?.ar),
        contentEn: paragraphsToText(post.content?.en),
        status: post.status ?? 'draft',
        publishedAt: toDatetimeLocalValue(post.publishedAt),
      })
      setImagePreview(post.image)
    } else {
      setFormData(emptyForm)
      setImagePreview(null)
    }

    setImageFile(null)
    setTouched({})
    setImageError(null)
    setServerFieldErrors({})
    setFormError(null)
  }, [open, post])

  if (!open) return null

  const errors = {
    slug: !isRequired(formData.slug)
      ? 'required'
      : !SLUG_PATTERN.test(formData.slug.trim())
        ? 'invalidSlug'
        : null,
    categoryId: !isRequired(formData.categoryId) ? 'required' : null,
    titleAr: !isRequired(formData.titleAr) ? 'required' : null,
    titleEn: !isRequired(formData.titleEn) ? 'required' : null,
    excerptAr: !isRequired(formData.excerptAr) ? 'required' : null,
    excerptEn: !isRequired(formData.excerptEn) ? 'required' : null,
    contentAr: !isRequired(formData.contentAr) ? 'required' : null,
    contentEn: !isRequired(formData.contentEn) ? 'required' : null,
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
    if (touched[field] && errors[field]) return t(`admin.blog.form.errors.${errors[field]}`)
    if (serverFieldErrors[field]) return t('authPage.validation.invalid')
    return undefined
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    event.target.value = '' // allow re-picking the same file later
    if (!file) return

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageError(t('admin.blog.form.imageInvalidType'))
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError(t('admin.blog.form.imageTooLarge'))
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

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) return // guards against a double click firing two requests
    if (Object.values(errors).some(Boolean) || imageMissing) {
      setTouched({
        slug: true, categoryId: true, titleAr: true, titleEn: true,
        excerptAr: true, excerptEn: true, contentAr: true, contentEn: true,
      })
      if (imageMissing) setImageError(t('admin.blog.form.imageRequired'))
      return
    }

    setIsSubmitting(true)
    setFormError(null)
    setServerFieldErrors({})

    const payload = {
      slug: formData.slug.trim(),
      categoryId: formData.categoryId,
      titleAr: formData.titleAr.trim(),
      titleEn: formData.titleEn.trim(),
      excerptAr: formData.excerptAr.trim(),
      excerptEn: formData.excerptEn.trim(),
      contentAr: formData.contentAr,
      contentEn: formData.contentEn,
      status: formData.status,
      publishedAt: formData.publishedAt,
      imageFile,
    }

    try {
      const saved = isEdit ? await updateAdminPost(post.slug, payload) : await createAdminPost(payload)
      onSaved(saved, isEdit)
    } catch (error) {
      if (error.status === 422 && error.errors) {
        const mapped = {}
        for (const apiField of Object.keys(error.errors)) {
          const field = API_FIELD_TO_FORM_FIELD[apiField]
          if (field) mapped[field] = true
        }
        setServerFieldErrors(mapped)
        if (mapped.image) setImageError(t('admin.blog.form.imageInvalidType'))
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
              {t(isEdit ? 'admin.blog.form.editTitle' : 'admin.blog.form.addTitle')}
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
                  <HiOutlineNewspaper className="text-3xl text-ink-300" />
                )}
              </div>
              <div>
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:border-primary-300 hover:text-primary-700">
                  {t(isEdit ? 'admin.blog.form.changeImage' : 'admin.blog.form.chooseImage')}
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} />
                </label>
                <p className="mt-1.5 text-xs text-ink-400">{t('admin.blog.form.imageHint')}</p>
                {imageError && <p className="mt-1 text-xs font-medium text-red-500">{imageError}</p>}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField
                label={t('admin.blog.form.titleAr')}
                name="titleAr"
                dir="rtl"
                value={formData.titleAr}
                onChange={(event) => setField('titleAr', event.target.value)}
                error={errorFor('titleAr')}
                required
              />
              <FormField
                label={t('admin.blog.form.titleEn')}
                name="titleEn"
                dir="ltr"
                value={formData.titleEn}
                onChange={(event) => setField('titleEn', event.target.value)}
                error={errorFor('titleEn')}
                required
              />
              <FormField
                label={t('admin.blog.form.slug')}
                name="slug"
                dir="ltr"
                value={formData.slug}
                onChange={(event) => setField('slug', event.target.value)}
                error={errorFor('slug')}
                placeholder="oral-hygiene-tips"
                required
              />
              <div>
                <label htmlFor="categoryId" className="mb-1.5 block text-sm font-semibold text-ink-700">
                  {t('admin.blog.form.category')}
                </label>
                <select
                  id="categoryId"
                  value={formData.categoryId}
                  onChange={(event) => setField('categoryId', event.target.value)}
                  className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-ink-800 outline-none transition-colors ${
                    errorFor('categoryId') ? 'border-red-300 focus:border-red-400' : 'border-ink-200 focus:border-primary-400'
                  }`}
                >
                  <option value="">{t('admin.blog.form.selectCategory')}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {tr(category.label)}
                    </option>
                  ))}
                </select>
                {errorFor('categoryId') && <p className="mt-1.5 text-xs font-medium text-red-500">{errorFor('categoryId')}</p>}
              </div>
              <FormField
                label={t('admin.blog.form.excerptAr')}
                name="excerptAr"
                multiline
                rows={2}
                dir="rtl"
                value={formData.excerptAr}
                onChange={(event) => setField('excerptAr', event.target.value)}
                error={errorFor('excerptAr')}
                required
                className="sm:col-span-2"
              />
              <FormField
                label={t('admin.blog.form.excerptEn')}
                name="excerptEn"
                multiline
                rows={2}
                dir="ltr"
                value={formData.excerptEn}
                onChange={(event) => setField('excerptEn', event.target.value)}
                error={errorFor('excerptEn')}
                required
                className="sm:col-span-2"
              />
              <FormField
                label={t('admin.blog.form.contentAr')}
                name="contentAr"
                multiline
                rows={6}
                dir="rtl"
                value={formData.contentAr}
                onChange={(event) => setField('contentAr', event.target.value)}
                error={errorFor('contentAr')}
                placeholder={t('admin.blog.form.contentHint')}
                required
                className="sm:col-span-2"
              />
              <FormField
                label={t('admin.blog.form.contentEn')}
                name="contentEn"
                multiline
                rows={6}
                dir="ltr"
                value={formData.contentEn}
                onChange={(event) => setField('contentEn', event.target.value)}
                error={errorFor('contentEn')}
                placeholder={t('admin.blog.form.contentHint')}
                required
                className="sm:col-span-2"
              />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="status" className="mb-1.5 block text-sm font-semibold text-ink-700">
                  {t('admin.blog.form.status')}
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(event) => setField('status', event.target.value)}
                  className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-800 outline-none transition-colors focus:border-primary-400"
                >
                  <option value="draft">{t('admin.blog.status.draft')}</option>
                  <option value="published">{t('admin.blog.status.published')}</option>
                </select>
              </div>
              <FormField
                label={t('admin.blog.form.publishedAt')}
                name="publishedAt"
                type="datetime-local"
                dir="ltr"
                value={formData.publishedAt}
                onChange={(event) => setField('publishedAt', event.target.value)}
                placeholder={formData.status === 'draft' ? t('admin.blog.form.publishedAtDisabledHint') : undefined}
              />
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <Button type="button" variant="outline" size="md" onClick={onClose} disabled={isSubmitting}>
                {t('admin.blog.form.cancel')}
              </Button>
              <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
                {isSubmitting ? t('admin.blog.form.saving') : t('admin.blog.form.save')}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

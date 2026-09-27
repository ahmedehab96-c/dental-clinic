import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HiOutlineXMark } from 'react-icons/hi2'
import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'
import { createAdminFaq, updateAdminFaq } from '@/services/api/adminFaqs'
import { useLanguage } from '@/context/LanguageContext'
import { isRequired } from '@/utils/validators'

const emptyForm = {
  questionAr: '',
  questionEn: '',
  answerAr: '',
  answerEn: '',
  sortOrder: 0,
  isPublished: true,
}

const API_FIELD_TO_FORM_FIELD = {
  question_ar: 'questionAr',
  question_en: 'questionEn',
  answer_ar: 'answerAr',
  answer_en: 'answerEn',
  sort_order: 'sortOrder',
}

export default function FaqFormModal({ open, item, onClose, onSaved }) {
  const { t } = useLanguage()
  const isEdit = Boolean(item)

  const [formData, setFormData] = useState(emptyForm)
  const [touched, setTouched] = useState({})
  const [serverFieldErrors, setServerFieldErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return

    if (item) {
      setFormData({
        questionAr: item.question?.ar ?? '',
        questionEn: item.question?.en ?? '',
        answerAr: item.answer?.ar ?? '',
        answerEn: item.answer?.en ?? '',
        sortOrder: item.sortOrder ?? 0,
        isPublished: item.isPublished,
      })
    } else {
      setFormData(emptyForm)
    }

    setTouched({})
    setServerFieldErrors({})
    setFormError(null)
  }, [open, item])

  if (!open) return null

  const errors = {
    questionAr: !isRequired(formData.questionAr) ? 'required' : null,
    questionEn: !isRequired(formData.questionEn) ? 'required' : null,
    answerAr: !isRequired(formData.answerAr) ? 'required' : null,
    answerEn: !isRequired(formData.answerEn) ? 'required' : null,
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
    if (touched[field] && errors[field]) return t(`admin.faqs.form.errors.${errors[field]}`)
    if (serverFieldErrors[field]) return t('authPage.validation.invalid')
    return undefined
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) return // guards against a double click firing two requests
    if (Object.values(errors).some(Boolean)) {
      setTouched({ questionAr: true, questionEn: true, answerAr: true, answerEn: true })
      return
    }

    setIsSubmitting(true)
    setFormError(null)
    setServerFieldErrors({})

    const payload = {
      questionAr: formData.questionAr.trim(),
      questionEn: formData.questionEn.trim(),
      answerAr: formData.answerAr.trim(),
      answerEn: formData.answerEn.trim(),
      sortOrder: Number(formData.sortOrder) || 0,
      isPublished: formData.isPublished,
    }

    try {
      const saved = isEdit ? await updateAdminFaq(item.id, payload) : await createAdminFaq(payload)
      onSaved(saved, isEdit)
    } catch (error) {
      if (error.status === 422 && error.errors) {
        const mapped = {}
        for (const apiField of Object.keys(error.errors)) {
          const field = API_FIELD_TO_FORM_FIELD[apiField]
          if (field) mapped[field] = true
        }
        setServerFieldErrors(mapped)
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
              {t(isEdit ? 'admin.faqs.form.editTitle' : 'admin.faqs.form.addTitle')}
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
                label={t('admin.faqs.form.questionAr')}
                name="questionAr"
                dir="rtl"
                value={formData.questionAr}
                onChange={(event) => setField('questionAr', event.target.value)}
                error={errorFor('questionAr')}
                required
              />
              <FormField
                label={t('admin.faqs.form.questionEn')}
                name="questionEn"
                dir="ltr"
                value={formData.questionEn}
                onChange={(event) => setField('questionEn', event.target.value)}
                error={errorFor('questionEn')}
                required
              />
              <FormField
                label={t('admin.faqs.form.answerAr')}
                name="answerAr"
                multiline
                rows={4}
                dir="rtl"
                value={formData.answerAr}
                onChange={(event) => setField('answerAr', event.target.value)}
                error={errorFor('answerAr')}
                required
                className="sm:col-span-2"
              />
              <FormField
                label={t('admin.faqs.form.answerEn')}
                name="answerEn"
                multiline
                rows={4}
                dir="ltr"
                value={formData.answerEn}
                onChange={(event) => setField('answerEn', event.target.value)}
                error={errorFor('answerEn')}
                required
                className="sm:col-span-2"
              />
              <FormField
                label={t('admin.faqs.form.order')}
                name="sortOrder"
                type="number"
                dir="ltr"
                value={formData.sortOrder}
                onChange={(event) => setField('sortOrder', event.target.value)}
              />
            </div>

            <label className="mt-5 flex items-center gap-2.5 text-sm font-medium text-ink-700">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(event) => setField('isPublished', event.target.checked)}
                className="h-4 w-4 rounded border-ink-300 text-primary-600 focus:ring-primary-400"
              />
              {t('admin.faqs.form.isPublished')}
            </label>

            <div className="mt-7 flex justify-end gap-3">
              <Button type="button" variant="outline" size="md" onClick={onClose} disabled={isSubmitting}>
                {t('admin.faqs.form.cancel')}
              </Button>
              <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
                {isSubmitting ? t('admin.faqs.form.saving') : t('admin.faqs.form.save')}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

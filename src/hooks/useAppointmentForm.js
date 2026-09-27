import { useEffect, useMemo, useState } from 'react'
import { isRequired, isValidEmail, isValidPhone } from '@/utils/validators'
import { bookAppointment } from '@/services/api/appointments'

const TOTAL_STEPS = 3

const initialFormState = {
  serviceSlug: '',
  doctorSlug: '', // 'any' = no preference
  date: '',
  time: '',
  name: '',
  phone: '',
  email: '',
  notes: '',
}

const STEP_FIELD_KEYS = {
  1: ['serviceSlug', 'doctorSlug'],
  2: ['date', 'time'],
  3: ['name', 'phone', 'email'],
}

// Maps Laravel's validation field names (from a 422 response) back to this
// form's own field keys, so a server-side error can be shown next to the
// right input and can send the wizard back to the right step.
const API_FIELD_TO_FORM_FIELD = {
  service_id: 'serviceSlug',
  doctor_id: 'doctorSlug',
  date: 'date',
  time: 'time',
  patient_name: 'name',
  patient_phone: 'phone',
  patient_email: 'email',
  notes: 'notes',
}

function stepForField(field) {
  return Number(Object.keys(STEP_FIELD_KEYS).find((step) => STEP_FIELD_KEYS[step].includes(field))) || 1
}

/**
 * Turns a thrown apiClient error (see services/api/client.js) into what the
 * booking UI needs to react to:
 *  - 'validation' (422): field-level errors, handled inline — never a
 *    full-page error screen.
 *  - 'conflict' (409): the slot was taken between availability check and
 *    submit — recoverable by picking another time.
 *  - 'generic': anything else (network failure, 401/403/404/500) — shown as
 *    one friendly message; the raw server/network error is never surfaced.
 */
function classifyError(error) {
  if (!error || error.status === undefined) return 'generic'
  if (error.status === 422) return 'validation'
  if (error.status === 409) return 'conflict'
  return 'generic'
}

/**
 * @param {{ initialServiceSlug?: string, initialDoctorSlug?: string, services: object[], doctors: object[] }} params
 * `services`/`doctors` are the already-fetched full lists (see
 * services/api/services.js, doctors.js) — this hook only looks slugs up in
 * them, it never fetches resource lists itself.
 */
export function useAppointmentForm({ initialServiceSlug = '', initialDoctorSlug = '', services, doctors }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    ...initialFormState,
    serviceSlug: initialServiceSlug,
    doctorSlug: initialDoctorSlug,
  })
  const [touchedFields, setTouchedFields] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState(null)
  // 'generic' | 'conflict' — see classifyError. null means no full-page error.
  const [submissionError, setSubmissionError] = useState(null)
  // Field-level messages from a 422 response, e.g. { time: 'The selected time is invalid.' }
  const [serverFieldErrors, setServerFieldErrors] = useState({})
  // Bumped on conflict recovery to force the time-slot list to refetch even
  // though date/doctor didn't change (the previously "available" slot just got taken).
  const [slotsRefreshKey, setSlotsRefreshKey] = useState(0)

  // Arriving from a doctor's profile with no service chosen: default to that
  // doctor's first service once the doctors list has actually loaded (it's
  // fetched async, so it may not be ready on first render).
  useEffect(() => {
    if (formData.serviceSlug || !initialDoctorSlug || doctors.length === 0) return
    const doctor = doctors.find((entry) => entry.slug === initialDoctorSlug)
    if (doctor?.serviceSlugs[0]) {
      setFormData((prev) => ({ ...prev, serviceSlug: doctor.serviceSlugs[0] }))
    }
    // Only re-check when the doctors list itself changes (loads).
    // eslint-disable-next-line
  }, [doctors])

  const setField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    setTouchedFields((prev) => ({ ...prev, [key]: true }))
    if (serverFieldErrors[key]) {
      setServerFieldErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  const errors = useMemo(() => {
    const next = {}
    if (!isRequired(formData.serviceSlug)) next.serviceSlug = 'required'
    if (!isRequired(formData.doctorSlug)) next.doctorSlug = 'required'
    if (!isRequired(formData.date)) next.date = 'required'
    if (!isRequired(formData.time)) next.time = 'required'
    if (!isRequired(formData.name) || formData.name.trim().length < 2) next.name = 'required'
    if (!isRequired(formData.phone)) next.phone = 'required'
    else if (!isValidPhone(formData.phone)) next.phone = 'invalidPhone'
    if (!isRequired(formData.email)) next.email = 'required'
    else if (!isValidEmail(formData.email)) next.email = 'invalidEmail'
    return next
  }, [formData])

  const isStepValid = (stepNumber) => STEP_FIELD_KEYS[stepNumber].every((key) => !errors[key])

  const goNext = () => {
    if (!isStepValid(step)) {
      setTouchedFields((prev) => ({
        ...prev,
        ...Object.fromEntries(STEP_FIELD_KEYS[step].map((key) => [key, true])),
      }))
      return
    }
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS))
  }

  const goBack = () => setStep((prev) => Math.max(prev - 1, 1))

  const submit = async () => {
    if (!isStepValid(3)) {
      setTouchedFields((prev) => ({
        ...prev,
        ...Object.fromEntries(STEP_FIELD_KEYS[3].map((key) => [key, true])),
      }))
      return
    }

    setIsSubmitting(true)
    setSubmissionError(null)
    setServerFieldErrors({})

    const service = services.find((entry) => entry.slug === formData.serviceSlug)
    const doctor = formData.doctorSlug === 'any' ? null : doctors.find((entry) => entry.slug === formData.doctorSlug)

    try {
      const result = await bookAppointment({
        serviceId: service?.id,
        doctorId: doctor?.id ?? null,
        date: formData.date,
        time: formData.time,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        notes: formData.notes.trim(),
      })
      setSubmissionResult(result)
    } catch (error) {
      const kind = classifyError(error)

      if (kind === 'validation') {
        // Laravel's validation messages are English-only and meant for API
        // consumers, not end users — flag which fields failed and show our
        // own bilingual copy (bookingPage.validation.invalid) instead of
        // that raw text.
        const mapped = {}
        let firstField = null
        for (const apiField of Object.keys(error.errors ?? {})) {
          const field = API_FIELD_TO_FORM_FIELD[apiField]
          if (!field) continue
          mapped[field] = true
          firstField ??= field
        }
        setServerFieldErrors(mapped)
        setTouchedFields((prev) => ({ ...prev, ...Object.fromEntries(Object.keys(mapped).map((key) => [key, true])) }))
        if (firstField) setStep(stepForField(firstField))
      } else {
        setSubmissionError(kind)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const dismissError = () => setSubmissionError(null)

  // Recovery action for a 409 conflict: send them back to pick a new time,
  // and force that step's slot list to refetch (the taken slot won't show
  // as available anymore).
  const editTimeSlot = () => {
    setField('time', '')
    setSubmissionError(null)
    setStep(2)
    setSlotsRefreshKey((prev) => prev + 1)
  }

  const reset = () => {
    setFormData(initialFormState)
    setTouchedFields({})
    setSubmissionResult(null)
    setSubmissionError(null)
    setServerFieldErrors({})
    setStep(1)
  }

  return {
    step,
    totalSteps: TOTAL_STEPS,
    formData,
    setField,
    errors,
    serverFieldErrors,
    touchedFields,
    isStepValid,
    goNext,
    goBack,
    submit,
    isSubmitting,
    submissionResult,
    submissionError,
    dismissError,
    editTimeSlot,
    reset,
    slotsRefreshKey,
  }
}

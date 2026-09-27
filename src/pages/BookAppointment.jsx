import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { HiOutlineCheckCircle, HiOutlineUserGroup, HiOutlineExclamationTriangle } from 'react-icons/hi2'
import PageHero from '@/components/layout/PageHero'
import Button from '@/components/ui/Button'
import Stepper from '@/components/ui/Stepper'
import SelectableCard from '@/components/ui/SelectableCard'
import DatePicker from '@/components/ui/DatePicker'
import TimeSlotPicker from '@/components/ui/TimeSlotPicker'
import FormField from '@/components/ui/FormField'
import AsyncState from '@/components/ui/AsyncState'
import { useAppointmentForm } from '@/hooks/useAppointmentForm'
import { useApiData } from '@/hooks/useApiData'
import { fetchServices } from '@/services/api/services'
import { fetchDoctors } from '@/services/api/doctors'
import { fetchAvailableDates, fetchTimeSlots } from '@/services/api/appointments'
import { serviceIconMap } from '@/data/serviceIconMap'
import { useLanguage } from '@/context/LanguageContext'
import { formatDate } from '@/utils/formatDate'
import { usePageTitle } from '@/hooks/usePageTitle'

const stepVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
}

const fetchAllServices = () => fetchServices({ perPage: 100 })
const fetchAllDoctors = () => fetchDoctors({ perPage: 100 })

export default function BookAppointment() {
  const { t, tr, language } = useLanguage()
  usePageTitle(t('nav.book'), { description: t('bookingPage.heroSubtitle') })
  const [searchParams] = useSearchParams()

  const initialServiceSlug = searchParams.get('service') || ''
  const initialDoctorSlug = searchParams.get('doctor') || ''

  // Laravel is the source of truth for all three — services/doctors decide
  // what step 1 offers, and availability (step 2) is never computed here.
  const { data: services, loading: servicesLoading, error: servicesError } = useApiData(fetchAllServices, [])
  const { data: doctors, loading: doctorsLoading, error: doctorsError } = useApiData(fetchAllDoctors, [])
  const { data: availableDates, loading: datesLoading, error: datesError } = useApiData(fetchAvailableDates, [])

  const bootstrapLoading = servicesLoading || doctorsLoading || datesLoading
  const bootstrapError = servicesError || doctorsError || datesError

  const {
    step,
    totalSteps,
    formData,
    setField,
    errors,
    serverFieldErrors,
    touchedFields,
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
  } = useAppointmentForm({ initialServiceSlug, initialDoctorSlug, services: services ?? [], doctors: doctors ?? [] })

  const eligibleDoctors = useMemo(
    () => (doctors ?? []).filter((doctor) => doctor.serviceSlugs.includes(formData.serviceSlug)),
    [doctors, formData.serviceSlug],
  )

  const selectedDoctorId = useMemo(() => {
    if (!formData.doctorSlug || formData.doctorSlug === 'any') return null
    return (doctors ?? []).find((doctor) => doctor.slug === formData.doctorSlug)?.id ?? null
  }, [doctors, formData.doctorSlug])

  // Refetches whenever the date or the chosen doctor changes (or after a 409
  // conflict recovery bumps slotsRefreshKey) — and only then, so switching
  // service/patient-details fields never triggers an extra request.
  const {
    data: timeSlots,
    loading: slotsLoading,
    error: slotsError,
  } = useApiData(
    () => (formData.date ? fetchTimeSlots({ date: formData.date, doctorId: selectedDoctorId }) : Promise.resolve([])),
    [formData.date, selectedDoctorId, slotsRefreshKey],
  )
  // Laravel returns every slot with an `available` flag; only bookable ones
  // are ever shown, so the empty state means "fully booked", not "no data".
  const availableTimeSlots = useMemo(() => (timeSlots ?? []).filter((slot) => slot.available), [timeSlots])

  const selectedService = (services ?? []).find((service) => service.slug === formData.serviceSlug)
  const selectedDoctor =
    formData.doctorSlug === 'any' ? null : (doctors ?? []).find((doctor) => doctor.slug === formData.doctorSlug)

  const stepLabels = t('bookingPage.steps')

  const errorFor = (field) => {
    if (touchedFields[field] && errors[field]) return t(`bookingPage.validation.${errors[field]}`)
    if (serverFieldErrors[field]) return t('bookingPage.validation.invalid')
    return undefined
  }

  if (bootstrapLoading || bootstrapError) {
    return (
      <>
        <PageHero
          eyebrow={t('bookingPage.heroEyebrow')}
          title={t('bookingPage.heroTitle')}
          subtitle={t('bookingPage.heroSubtitle')}
        />
        <section className="py-14 sm:py-20">
          <div className="container-app">
            <AsyncState status={bootstrapError ? 'error' : 'loading'} />
          </div>
        </section>
      </>
    )
  }

  if (submissionError) {
    const isConflict = submissionError === 'conflict'

    return (
      <section className="bg-medical-gradient flex min-h-[80vh] items-center pt-28 pb-16">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-lg rounded-[2rem] border border-ink-100 bg-white p-9 text-center shadow-medium"
          >
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl text-red-600">
              <HiOutlineExclamationTriangle />
            </span>
            <h1 className="font-heading mt-5 text-2xl font-bold text-ink-900">
              {isConflict ? t('bookingPage.error.conflictTitle') : t('bookingPage.error.title')}
            </h1>
            <p className="mt-3 text-ink-500">
              {isConflict ? t('bookingPage.error.conflictSubtitle') : t('bookingPage.error.subtitle')}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {isConflict ? (
                <Button onClick={editTimeSlot} variant="primary" size="lg">
                  {t('bookingPage.buttons.chooseAnotherTime')}
                </Button>
              ) : (
                <>
                  <Button onClick={dismissError} variant="outline" size="lg">
                    {t('bookingPage.error.editDetails')}
                  </Button>
                  <Button onClick={submit} variant="primary" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? t('bookingPage.buttons.submitting') : t('bookingPage.error.retry')}
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  if (submissionResult) {
    return (
      <section className="bg-medical-gradient flex min-h-[80vh] items-center pt-28 pb-16">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-lg rounded-[2rem] border border-ink-100 bg-white p-9 text-center shadow-medium"
          >
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-50 text-3xl text-accent-600">
              <HiOutlineCheckCircle />
            </span>
            <h1 className="font-heading mt-5 text-2xl font-bold text-ink-900">{t('bookingPage.success.title')}</h1>
            <p className="mt-3 text-ink-500">{t('bookingPage.success.subtitle')}</p>

            <div className="mt-6 rounded-2xl bg-ink-50 px-5 py-4">
              <p className="text-xs font-medium text-ink-500">{t('bookingPage.success.reference')}</p>
              <p dir="ltr" className="font-heading mt-1 text-lg font-bold text-ink-900">{submissionResult.reference}</p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={reset} variant="outline" size="lg">
                {t('bookingPage.buttons.bookAnother')}
              </Button>
              <Button to="/" variant="primary" size="lg">
                {t('bookingPage.buttons.backHome')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <>
      <PageHero
        eyebrow={t('bookingPage.heroEyebrow')}
        title={t('bookingPage.heroTitle')}
        subtitle={t('bookingPage.heroSubtitle')}
      />

      <section className="py-14 sm:py-20">
        <div className="container-app">
          <Stepper steps={stepLabels} currentStep={step} />

          <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-[2rem] border border-ink-100 bg-white p-6 shadow-soft sm:p-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {step === 1 && (
                  <div>
                    <h2 className="font-heading text-xl font-bold text-ink-900">{t('bookingPage.step1.title')}</h2>
                    <p className="mt-1.5 text-sm text-ink-500">{t('bookingPage.step1.subtitle')}</p>

                    <p className="mt-7 text-sm font-semibold text-ink-700">{t('bookingPage.step1.serviceLabel')}</p>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {(services ?? []).map((service) => {
                        const Icon = serviceIconMap[service.icon]
                        return (
                          <SelectableCard
                            key={service.id}
                            selected={formData.serviceSlug === service.slug}
                            onClick={() => {
                              setField('serviceSlug', service.slug)
                              if (!eligibleDoctors.some((doc) => doc.slug === formData.doctorSlug)) {
                                setField('doctorSlug', '')
                              }
                            }}
                            icon={Icon && <Icon />}
                            title={tr(service.name)}
                            subtitle={`${t('common.startingFrom')} ${service.priceFrom} ${t('common.currency')}`}
                          />
                        )
                      })}
                    </div>

                    <p className="mt-8 text-sm font-semibold text-ink-700">{t('bookingPage.step1.doctorLabel')}</p>
                    {formData.serviceSlug ? (
                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <SelectableCard
                          selected={formData.doctorSlug === 'any'}
                          onClick={() => setField('doctorSlug', 'any')}
                          icon={<HiOutlineUserGroup />}
                          title={t('bookingPage.step1.noPreference')}
                        />
                        {eligibleDoctors.map((doctor) => (
                          <SelectableCard
                            key={doctor.id}
                            selected={formData.doctorSlug === doctor.slug}
                            onClick={() => setField('doctorSlug', doctor.slug)}
                            icon={
                              <img
                                src={doctor.photo}
                                alt=""
                                loading="lazy"
                                className="h-full w-full rounded-xl object-cover"
                              />
                            }
                            title={tr(doctor.name)}
                            subtitle={tr(doctor.specialty)}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 rounded-2xl bg-ink-50 px-4 py-3 text-sm text-ink-500">
                        {t('bookingPage.step1.selectServiceFirst')}
                      </p>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="font-heading text-xl font-bold text-ink-900">{t('bookingPage.step2.title')}</h2>
                    <p className="mt-1.5 text-sm text-ink-500">{t('bookingPage.step2.subtitle')}</p>

                    <p className="mt-7 text-sm font-semibold text-ink-700">{t('bookingPage.step2.dateLabel')}</p>
                    <div className="mt-3">
                      <DatePicker
                        dates={availableDates ?? []}
                        selectedDate={formData.date}
                        onSelect={(date) => {
                          setField('date', date)
                          setField('time', '')
                        }}
                      />
                    </div>

                    <p className="mt-8 text-sm font-semibold text-ink-700">{t('bookingPage.step2.timeLabel')}</p>
                    {formData.date ? (
                      <div className="mt-3">
                        {slotsLoading && <AsyncState status="loading" className="py-8" />}
                        {!slotsLoading && slotsError && <AsyncState status="error" className="py-8" />}
                        {!slotsLoading && !slotsError && availableTimeSlots.length === 0 && (
                          <AsyncState status="empty" className="py-8" />
                        )}
                        {!slotsLoading && !slotsError && availableTimeSlots.length > 0 && (
                          <TimeSlotPicker
                            slots={availableTimeSlots}
                            selectedTime={formData.time}
                            onSelect={(time) => setField('time', time)}
                          />
                        )}
                      </div>
                    ) : (
                      <p className="mt-3 rounded-2xl bg-ink-50 px-4 py-3 text-sm text-ink-500">
                        {t('bookingPage.step2.selectDateFirst')}
                      </p>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="font-heading text-xl font-bold text-ink-900">{t('bookingPage.step3.title')}</h2>
                    <p className="mt-1.5 text-sm text-ink-500">{t('bookingPage.step3.subtitle')}</p>

                    <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <FormField
                        label={t('bookingPage.step3.nameLabel')}
                        name="name"
                        value={formData.name}
                        onChange={(event) => setField('name', event.target.value)}
                        placeholder={t('bookingPage.step3.namePlaceholder')}
                        error={errorFor('name')}
                        required
                      />
                      <FormField
                        label={t('bookingPage.step3.phoneLabel')}
                        name="phone"
                        type="tel"
                        dir="ltr"
                        value={formData.phone}
                        onChange={(event) => setField('phone', event.target.value)}
                        placeholder={t('bookingPage.step3.phonePlaceholder')}
                        error={errorFor('phone')}
                        required
                      />
                      <FormField
                        label={t('bookingPage.step3.emailLabel')}
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(event) => setField('email', event.target.value)}
                        placeholder={t('bookingPage.step3.emailPlaceholder')}
                        error={errorFor('email')}
                        required
                        className="sm:col-span-2"
                      />
                      <FormField
                        label={t('bookingPage.step3.notesLabel')}
                        name="notes"
                        multiline
                        rows={4}
                        value={formData.notes}
                        onChange={(event) => setField('notes', event.target.value)}
                        placeholder={t('bookingPage.step3.notesPlaceholder')}
                        className="sm:col-span-2"
                      />
                    </div>

                    <div className="mt-8 rounded-2xl border border-ink-100 bg-ink-50/60 p-5">
                      <p className="font-heading text-sm font-bold text-ink-900">{t('bookingPage.summary.title')}</p>
                      <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                        <SummaryRow label={t('bookingPage.summary.service')} value={selectedService ? tr(selectedService.name) : '—'} />
                        <SummaryRow
                          label={t('bookingPage.summary.doctor')}
                          value={selectedDoctor ? tr(selectedDoctor.name) : t('bookingPage.step1.noPreference')}
                        />
                        <SummaryRow label={t('bookingPage.summary.date')} value={formData.date ? formatDate(formData.date, language) : '—'} />
                        <SummaryRow label={t('bookingPage.summary.time')} value={formData.time || '—'} />
                      </dl>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-9 flex items-center justify-between border-t border-ink-100 pt-6">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={goBack}
                className={step === 1 ? 'invisible' : ''}
              >
                {t('bookingPage.buttons.back')}
              </Button>

              {step < totalSteps ? (
                <Button type="button" variant="primary" size="md" onClick={goNext}>
                  {t('bookingPage.buttons.next')}
                </Button>
              ) : (
                <Button type="button" variant="primary" size="md" onClick={submit} disabled={isSubmitting}>
                  {isSubmitting ? t('bookingPage.buttons.submitting') : t('bookingPage.buttons.confirm')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-start sm:gap-0.5">
      <dt className="text-xs text-ink-500">{label}</dt>
      <dd className="font-medium text-ink-800">{value}</dd>
    </div>
  )
}

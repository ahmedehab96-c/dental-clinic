import { Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineArrowLongLeft, HiOutlineArrowLongRight, HiOutlineAcademicCap, HiOutlineBriefcase } from 'react-icons/hi2'
import { FaStar, FaRegCalendarCheck } from 'react-icons/fa'
import Button from '@/components/ui/Button'
import RevealImage from '@/components/ui/RevealImage'
import AsyncState from '@/components/ui/AsyncState'
import { fetchDoctorBySlug } from '@/services/api/doctors'
import { fetchServices } from '@/services/api/services'
import { serviceIconMap } from '@/data/serviceIconMap'
import { useApiData } from '@/hooks/useApiData'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'

const fetchAllServices = () => fetchServices({ perPage: 100 })

export default function DoctorDetails() {
  const { slug } = useParams()
  const { t, tr, isRtl } = useLanguage()
  const { data: doctor, loading: doctorLoading, error: doctorError, notFound } = useApiData(
    () => fetchDoctorBySlug(slug),
    [slug],
  )
  const { data: allServices, loading: servicesLoading } = useApiData(fetchAllServices, [])

  usePageTitle(doctor ? tr(doctor.name) : t('nav.doctors'), {
    description: doctor ? tr(doctor.bio) : undefined,
    image: doctor?.photo,
  })

  if (notFound) return <Navigate to="/doctors" replace />

  if (doctorLoading) {
    return (
      <section className="pt-28 pb-16 sm:pt-32">
        <div className="container-app">
          <AsyncState status="loading" />
        </div>
      </section>
    )
  }

  if (doctorError || !doctor) {
    return (
      <section className="pt-28 pb-16 sm:pt-32">
        <div className="container-app">
          <AsyncState status="error" />
        </div>
      </section>
    )
  }

  const BackArrow = isRtl ? HiOutlineArrowLongRight : HiOutlineArrowLongLeft
  const specializedServices = servicesLoading
    ? []
    : (allServices ?? []).filter((service) => doctor.serviceSlugs.includes(service.slug))

  return (
    <>
      <section className="bg-medical-gradient pt-28 pb-16 sm:pt-32">
        <div className="container-app">
          <Button to="/doctors" variant="glass" size="md" icon={<BackArrow />} iconPosition="start" className="mb-8">
            {t('doctorDetails.back')}
          </Button>

          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[380px_1fr]">
            <RevealImage
              src={doctor.photo}
              alt={tr(doctor.name)}
              trigger="mount"
              className="rounded-[2rem] shadow-medium"
              imgClassName="aspect-[4/5] w-full"
            >
              <div className="absolute inset-x-4 bottom-4 flex items-center gap-1.5 rounded-full glass w-fit px-3 py-1.5 text-sm font-bold text-ink-900">
                <FaStar className="text-amber-400" />
                {doctor.rating}
                <span className="font-normal text-ink-500">
                  ({doctor.reviewsCount} {t('doctorDetails.reviews')})
                </span>
              </div>
            </RevealImage>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            >
              <h1 className="font-heading text-3xl font-bold text-ink-900 sm:text-4xl">{tr(doctor.name)}</h1>
              <p className="mt-2 text-lg font-semibold text-primary-600">{tr(doctor.specialty)}</p>

              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-ink-100 bg-white px-5 py-3 shadow-soft w-fit">
                <HiOutlineBriefcase className="text-xl text-primary-600" />
                <div>
                  <p className="text-xs text-ink-500">{t('common.yearsExperience')}</p>
                  <p className="text-sm font-bold text-ink-900">{doctor.experienceYears}+</p>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="font-heading text-lg font-bold text-ink-900">{t('doctorDetails.about')}</h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-ink-500">{tr(doctor.bio)}</p>
              </div>

              <div className="mt-8">
                <h2 className="font-heading flex items-center gap-2 text-lg font-bold text-ink-900">
                  <HiOutlineAcademicCap className="text-xl text-accent-600" />
                  {t('doctorDetails.education')}
                </h2>
                <ul className="mt-3 space-y-2">
                  {doctor.education.map((entry, index) => (
                    <li key={index} className="text-sm leading-relaxed text-ink-600">
                      • {tr(entry)}
                    </li>
                  ))}
                </ul>
              </div>

              {specializedServices.length > 0 && (
                <div className="mt-8">
                  <h2 className="font-heading text-lg font-bold text-ink-900">{t('doctorDetails.specializedIn')}</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {specializedServices.map((service) => {
                      const Icon = serviceIconMap[service.icon]
                      return (
                        <span
                          key={service.id}
                          className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700"
                        >
                          {Icon && <Icon />}
                          {tr(service.name)}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="mt-9">
                <Button
                  to={`/book-appointment?doctor=${doctor.slug}`}
                  variant="primary"
                  size="lg"
                  icon={<FaRegCalendarCheck />}
                  iconPosition="start"
                >
                  {t('doctorDetails.cta')} {tr(doctor.name)}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

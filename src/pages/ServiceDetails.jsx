import { Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineArrowLongLeft, HiOutlineArrowLongRight, HiOutlineClock, HiOutlineCheckCircle } from 'react-icons/hi2'
import { FaRegCalendarCheck } from 'react-icons/fa'
import Button from '@/components/ui/Button'
import DoctorCard from '@/components/ui/DoctorCard'
import RevealImage from '@/components/ui/RevealImage'
import AsyncState from '@/components/ui/AsyncState'
import { fetchServiceBySlug } from '@/services/api/services'
import { fetchDoctors } from '@/services/api/doctors'
import { serviceIconMap } from '@/data/serviceIconMap'
import { useApiData } from '@/hooks/useApiData'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const fetchAllDoctors = () => fetchDoctors({ perPage: 100 })

export default function ServiceDetails() {
  const { slug } = useParams()
  const { t, tr, isRtl } = useLanguage()
  const { data: service, loading: serviceLoading, error: serviceError, notFound } = useApiData(
    () => fetchServiceBySlug(slug),
    [slug],
  )
  const { data: allDoctors, loading: doctorsLoading } = useApiData(fetchAllDoctors, [])

  usePageTitle(service ? tr(service.name) : t('nav.services'), {
    description: service ? tr(service.shortDescription) : undefined,
    image: service?.image,
  })

  if (notFound) return <Navigate to="/services" replace />

  if (serviceLoading) {
    return (
      <section className="pt-28 pb-16 sm:pt-32">
        <div className="container-app">
          <AsyncState status="loading" />
        </div>
      </section>
    )
  }

  if (serviceError || !service) {
    return (
      <section className="pt-28 pb-16 sm:pt-32">
        <div className="container-app">
          <AsyncState status="error" />
        </div>
      </section>
    )
  }

  const Icon = serviceIconMap[service.icon]
  const BackArrow = isRtl ? HiOutlineArrowLongRight : HiOutlineArrowLongLeft
  const relatedDoctors = doctorsLoading
    ? []
    : (allDoctors ?? []).filter((doctor) => doctor.serviceSlugs.includes(service.slug))

  return (
    <>
      <section className="bg-medical-gradient pt-28 pb-16 sm:pt-32">
        <div className="container-app">
          <Button to="/services" variant="glass" size="md" icon={<BackArrow />} iconPosition="start" className="mb-8">
            {t('serviceDetails.back')}
          </Button>

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-2xl text-white shadow-soft">
                {Icon && <Icon />}
              </span>
              <h1 className="font-heading mt-6 text-4xl font-bold leading-tight text-ink-900 sm:text-5xl">
                {tr(service.name)}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-ink-500">{tr(service.description)}</p>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-white px-5 py-3 shadow-soft">
                  <HiOutlineClock className="text-xl text-primary-600" />
                  <div>
                    <p className="text-xs text-ink-500">{t('common.duration')}</p>
                    <p className="text-sm font-bold text-ink-900">{tr(service.duration)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-white px-5 py-3 shadow-soft">
                  <div>
                    <p className="text-xs text-ink-500">{t('common.startingFrom')}</p>
                    <p className="text-sm font-bold text-ink-900">
                      {service.priceFrom} {t('common.currency')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-9">
                <Button to={`/book-appointment?service=${service.slug}`} variant="primary" size="lg" icon={<FaRegCalendarCheck />} iconPosition="start">
                  {t('common.bookAppointment')}
                </Button>
              </div>
            </motion.div>

            <RevealImage
              src={service.image}
              alt={tr(service.name)}
              loading="lazy"
              trigger="mount"
              delay={0.15}
              className="rounded-[2rem] shadow-medium"
              imgClassName="aspect-[4/3] w-full"
            />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-app">
          <h2 className="font-heading text-2xl font-bold text-ink-900 sm:text-3xl">{t('serviceDetails.keyFeatures')}</h2>
          <motion.ul
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {service.features.map((feature, index) => (
              <motion.li
                key={index}
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                className="flex items-start gap-3 rounded-2xl border border-ink-100 bg-white p-5 shadow-soft"
              >
                <HiOutlineCheckCircle className="mt-0.5 shrink-0 text-xl text-accent-500" />
                <span className="text-sm font-medium text-ink-700">{tr(feature)}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {relatedDoctors.length > 0 && (
        <section className="bg-ink-50/60 py-16 sm:py-20">
          <div className="container-app">
            <h2 className="font-heading text-2xl font-bold text-ink-900 sm:text-3xl">{t('serviceDetails.relatedDoctors')}</h2>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {relatedDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      <section className="py-16 sm:py-20">
        <div className="container-app">
          <div className="rounded-[2rem] bg-gradient-to-br from-primary-600 to-accent-500 px-8 py-14 text-center shadow-medium sm:px-16">
            <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">{t('serviceDetails.cta')}</h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-50">{t('serviceDetails.ctaSubtitle')}</p>
            <div className="mt-8">
              <Button to={`/book-appointment?service=${service.slug}`} variant="glass" size="lg" icon={<FaRegCalendarCheck />} iconPosition="start">
                {t('common.bookAppointment')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

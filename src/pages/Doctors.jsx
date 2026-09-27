import { motion } from 'framer-motion'
import PageHero from '@/components/layout/PageHero'
import DoctorCard from '@/components/ui/DoctorCard'
import AsyncState from '@/components/ui/AsyncState'
import { fetchDoctors } from '@/services/api/doctors'
import { useApiData } from '@/hooks/useApiData'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const fetchAllDoctors = () => fetchDoctors({ perPage: 100 })

export default function Doctors() {
  const { t } = useLanguage()
  usePageTitle(t('nav.doctors'), { description: t('doctorsPage.heroSubtitle') })
  const { data: doctors, loading, error, notFound } = useApiData(fetchAllDoctors, [])

  return (
    <>
      <PageHero
        eyebrow={t('doctorsPage.heroEyebrow')}
        title={t('doctorsPage.heroTitle')}
        subtitle={t('doctorsPage.heroSubtitle')}
      />

      <section className="py-20 sm:py-24">
        <div className="container-app">
          {loading && <AsyncState status="loading" />}
          {!loading && error && !notFound && <AsyncState status="error" />}
          {!loading && !error && doctors?.length === 0 && <AsyncState status="empty" />}

          {!loading && !error && doctors?.length > 0 && (
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-100px' }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}

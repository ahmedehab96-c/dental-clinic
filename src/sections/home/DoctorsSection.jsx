import { motion } from 'framer-motion'
import SectionHeading from '@/components/ui/SectionHeading'
import DoctorCard from '@/components/ui/DoctorCard'
import Button from '@/components/ui/Button'
import AsyncState from '@/components/ui/AsyncState'
import { fetchFeaturedDoctors } from '@/services/api/doctors'
import { useApiData } from '@/hooks/useApiData'
import { useLanguage } from '@/context/LanguageContext'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

export default function DoctorsSection() {
  const { t } = useLanguage()
  const { data: featuredDoctors, loading, error, notFound } = useApiData(fetchFeaturedDoctors, [])

  return (
    <section className="bg-[#F7FBFC] py-20 sm:py-28">
      <div className="container-app">
        <SectionHeading
          eyebrow={t('doctorsSection.eyebrow')}
          title={t('doctorsSection.title')}
          subtitle={t('doctorsSection.subtitle')}
        />

        {loading && <AsyncState status="loading" />}
        {!loading && error && !notFound && <AsyncState status="error" />}
        {!loading && !error && featuredDoctors?.length === 0 && <AsyncState status="empty" />}

        {!loading && !error && featuredDoctors?.length > 0 && (
          <>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-100px' }}
              className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {featuredDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </motion.div>

            <div className="mt-12 flex justify-center">
              <Button to="/doctors" variant="outline" size="lg">
                {t('common.viewAll')} {t('nav.doctors')}
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

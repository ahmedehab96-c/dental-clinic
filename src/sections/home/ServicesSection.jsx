import { motion } from 'framer-motion'
import SectionHeading from '@/components/ui/SectionHeading'
import ServiceCard from '@/components/ui/ServiceCard'
import Button from '@/components/ui/Button'
import AsyncState from '@/components/ui/AsyncState'
import { fetchServices } from '@/services/api/services'
import { useApiData } from '@/hooks/useApiData'
import { useLanguage } from '@/context/LanguageContext'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const fetchFeaturedServices = () => fetchServices({ perPage: 6 })

export default function ServicesSection() {
  const { t } = useLanguage()
  const { data: services, loading, error, notFound } = useApiData(fetchFeaturedServices, [])

  return (
    <section className="bg-[#F7FBFC] py-20 sm:py-28">
      <div className="container-app">
        <SectionHeading
          eyebrow={t('servicesSection.eyebrow')}
          title={t('servicesSection.title')}
          subtitle={t('servicesSection.subtitle')}
        />

        {loading && <AsyncState status="loading" />}
        {!loading && error && !notFound && <AsyncState status="error" />}
        {!loading && !error && services?.length === 0 && <AsyncState status="empty" />}

        {!loading && !error && services?.length > 0 && (
          <>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-100px' }}
              className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </motion.div>

            <div className="mt-12 flex justify-center">
              <Button to="/services" variant="outline" size="lg">
                {t('common.viewAll')} {t('common.ourServices')}
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import PageHero from '@/components/layout/PageHero'
import ServiceCard from '@/components/ui/ServiceCard'
import AsyncState from '@/components/ui/AsyncState'
import { fetchServices } from '@/services/api/services'
import { useApiData } from '@/hooks/useApiData'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const fetchAllServices = () => fetchServices({ perPage: 100 })

export default function Services() {
  const { t } = useLanguage()
  usePageTitle(t('nav.services'), { description: t('servicesPage.heroSubtitle') })
  const { data: services, loading, error, notFound } = useApiData(fetchAllServices, [])

  return (
    <>
      <PageHero
        eyebrow={t('servicesPage.heroEyebrow')}
        title={t('servicesPage.heroTitle')}
        subtitle={t('servicesPage.heroSubtitle')}
      />

      <section className="py-20 sm:py-24">
        <div className="container-app">
          {loading && <AsyncState status="loading" />}
          {!loading && error && !notFound && <AsyncState status="error" />}
          {!loading && !error && services?.length === 0 && <AsyncState status="empty" />}

          {!loading && !error && services?.length > 0 && (
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-100px' }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}

import { motion } from 'framer-motion'
import SectionHeading from '@/components/ui/SectionHeading'
import TestimonialCard from '@/components/ui/TestimonialCard'
import AsyncState from '@/components/ui/AsyncState'
import { fetchTestimonials } from '@/services/api/testimonials'
import { useApiData } from '@/hooks/useApiData'
import { useLanguage } from '@/context/LanguageContext'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

export default function TestimonialsSection() {
  const { t } = useLanguage()
  const { data: testimonials, loading, error, notFound } = useApiData(fetchTestimonials, [])

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-app">
        <SectionHeading
          eyebrow={t('testimonialsSection.eyebrow')}
          title={t('testimonialsSection.title')}
          subtitle={t('testimonialsSection.subtitle')}
        />

        {loading && <AsyncState status="loading" />}
        {!loading && error && !notFound && <AsyncState status="error" />}
        {!loading && !error && testimonials?.length === 0 && <AsyncState status="empty" />}

        {!loading && !error && testimonials?.length > 0 && (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}

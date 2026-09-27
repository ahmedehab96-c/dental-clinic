import { motion } from 'framer-motion'
import SectionHeading from '@/components/ui/SectionHeading'
import BeforeAfterSlider from '@/components/ui/BeforeAfterSlider'
import Button from '@/components/ui/Button'
import AsyncState from '@/components/ui/AsyncState'
import { fetchGalleryCases } from '@/services/api/gallery'
import { useApiData } from '@/hooks/useApiData'
import { useLanguage } from '@/context/LanguageContext'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const fetchPreviewCases = () => fetchGalleryCases({ perPage: 3 })

export default function GallerySection() {
  const { t, tr } = useLanguage()
  const { data: preview, loading, error, notFound } = useApiData(fetchPreviewCases, [])

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-app">
        <SectionHeading
          eyebrow={t('gallerySection.eyebrow')}
          title={t('gallerySection.title')}
          subtitle={t('gallerySection.subtitle')}
        />

        {loading && <AsyncState status="loading" />}
        {!loading && error && !notFound && <AsyncState status="error" />}
        {!loading && !error && preview?.length === 0 && <AsyncState status="empty" />}

        {!loading && !error && preview?.length > 0 && (
          <>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-100px' }}
              className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {preview.map((galleryCase) => (
                <motion.div
                  key={galleryCase.id}
                  variants={item}
                  className="rounded-[1.75rem] border border-ink-100 bg-white p-3 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow"
                >
                  <BeforeAfterSlider beforeImage={galleryCase.beforeImage} afterImage={galleryCase.afterImage} />
                  <p className="mt-4 text-center font-heading font-semibold text-ink-800">{tr(galleryCase.title)}</p>
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-12 flex justify-center">
              <Button to="/gallery" variant="outline" size="lg">
                {t('common.viewAll')} {t('nav.gallery')}
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import PageHero from '@/components/layout/PageHero'
import BeforeAfterSlider from '@/components/ui/BeforeAfterSlider'
import AsyncState from '@/components/ui/AsyncState'
import { cn } from '@/utils/cn'
import { galleryCategories } from '@/data/mock/gallery'
import { fetchGalleryCases } from '@/services/api/gallery'
import { useApiData } from '@/hooks/useApiData'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const fetchAllGalleryCases = () => fetchGalleryCases({ perPage: 100 })

export default function Gallery() {
  const { t, tr } = useLanguage()
  usePageTitle(t('nav.gallery'), { description: t('gallery.heroSubtitle') })
  const [activeCategory, setActiveCategory] = useState('all')
  const { data: galleryCases, loading, error, notFound } = useApiData(fetchAllGalleryCases, [])
  const cases = galleryCases ?? []

  const filteredCases =
    activeCategory === 'all' ? cases : cases.filter((galleryCase) => galleryCase.category === activeCategory)

  return (
    <>
      <PageHero
        eyebrow={t('gallery.heroEyebrow')}
        title={t('gallery.heroTitle')}
        subtitle={t('gallery.heroSubtitle')}
      />

      <section className="py-16 sm:py-20">
        <div className="container-app">
          {loading && <AsyncState status="loading" />}
          {!loading && error && !notFound && <AsyncState status="error" />}
          {!loading && !error && cases.length === 0 && <AsyncState status="empty" />}

          {!loading && !error && cases.length > 0 && (
            <>
              <div className="flex flex-wrap justify-center gap-3">
                {galleryCategories.map((category) => (
                  <button
                    key={category.key}
                    type="button"
                    onClick={() => setActiveCategory(category.key)}
                    className={cn(
                      'rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors duration-200',
                      activeCategory === category.key
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : 'border-ink-200 bg-white text-ink-600 hover:border-primary-300 hover:text-primary-700',
                    )}
                  >
                    {t(category.labelKey)}
                  </button>
                ))}
              </div>

              <motion.div
                key={activeCategory}
                variants={container}
                initial="hidden"
                animate="show"
                className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredCases.map((galleryCase) => (
                  <motion.div key={galleryCase.id} variants={item}>
                    <BeforeAfterSlider beforeImage={galleryCase.beforeImage} afterImage={galleryCase.afterImage} />
                    <p className="mt-4 text-center font-heading font-semibold text-ink-800">{tr(galleryCase.title)}</p>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </section>
    </>
  )
}

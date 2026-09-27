import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { useTilt3D } from '@/hooks/useTilt3D'
import { heroStats } from '@/data/heroStats'
import { useLanguage } from '@/context/LanguageContext'

export default function AboutSection() {
  const { t } = useLanguage()
  const { ref: tiltRef, style: tiltStyle, onPointerMove, onPointerLeave } = useTilt3D({ max: 5 })

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-app grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ perspective: 800 }}
          className="relative mx-auto aspect-[5/4] w-full max-w-lg"
        >
          <div className="shape-blob-1 absolute -inset-3 bg-gradient-to-br from-primary-300 to-accent-300 opacity-30 blur-2xl" />
          <motion.div
            ref={tiltRef}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            style={{ ...tiltStyle, transformStyle: 'preserve-3d' }}
            className="relative h-full w-full overflow-hidden rounded-[2.5rem] shadow-medium ring-1 ring-white/70"
          >
            <img
              src="https://images.pexels.com/photos/6812429/pexels-photo-6812429.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=900&h=720&fit=crop"
              alt="Radiant Dental Care clinic interior"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-4 py-1.5 text-sm font-semibold text-accent-700">
            {t('aboutPage.heroEyebrow')}
          </span>
          <h2 className="font-heading mt-4 text-3xl font-bold text-ink-900 sm:text-4xl">{t('aboutPage.heroTitle')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-500">{t('aboutPage.heroSubtitle')}</p>

          <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {heroStats.map((stat) => (
              <div key={stat.key} className="rounded-2xl border border-ink-100 bg-[#F7FBFC] p-4 text-center">
                <dt className="sr-only">{t(stat.labelKey)}</dt>
                <dd className="font-heading text-xl font-bold text-primary-700 sm:text-2xl">{stat.value}</dd>
                <p className="mt-1 text-xs font-medium text-ink-500">{t(stat.labelKey)}</p>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <Button to="/about" variant="outline" size="lg">
              {t('common.learnMore')}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

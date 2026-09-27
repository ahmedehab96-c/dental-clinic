import { motion } from 'framer-motion'
import { HiOutlineFlag, HiOutlineEye } from 'react-icons/hi2'
import PageHero from '@/components/layout/PageHero'
import SectionHeading from '@/components/ui/SectionHeading'
import { heroStats } from '@/data/heroStats'
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

export default function About() {
  const { t } = useLanguage()
  const values = t('aboutPage.values')
  usePageTitle(t('nav.about'), { description: t('aboutPage.heroSubtitle') })

  return (
    <>
      <PageHero
        eyebrow={t('aboutPage.heroEyebrow')}
        title={t('aboutPage.heroTitle')}
        subtitle={t('aboutPage.heroSubtitle')}
      />

      <section className="py-16 sm:py-20">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="container-app grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          <motion.div
            variants={item}
            className="rounded-3xl border border-ink-100 bg-white p-8 shadow-soft transition-transform duration-300 hover:-translate-y-1.5"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-xl text-primary-600">
              <HiOutlineFlag />
            </span>
            <h2 className="font-heading mt-5 text-xl font-bold text-ink-900">{t('aboutPage.missionTitle')}</h2>
            <p className="mt-3 leading-relaxed text-ink-500">{t('aboutPage.mission')}</p>
          </motion.div>
          <motion.div
            variants={item}
            className="rounded-3xl border border-ink-100 bg-white p-8 shadow-soft transition-transform duration-300 hover:-translate-y-1.5"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-xl text-accent-600">
              <HiOutlineEye />
            </span>
            <h2 className="font-heading mt-5 text-xl font-bold text-ink-900">{t('aboutPage.visionTitle')}</h2>
            <p className="mt-3 leading-relaxed text-ink-500">{t('aboutPage.vision')}</p>
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-ink-50/60 py-16 sm:py-20">
        <motion.dl
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="container-app grid grid-cols-2 gap-8 sm:grid-cols-4"
        >
          {heroStats.map((stat) => (
            <motion.div key={stat.key} variants={item} className="text-center">
              <dt className="sr-only">{t(stat.labelKey)}</dt>
              <dd className="font-heading text-3xl font-bold text-primary-700 sm:text-4xl">{stat.value}</dd>
              <p className="mt-2 text-sm font-medium text-ink-500">{t(stat.labelKey)}</p>
            </motion.div>
          ))}
        </motion.dl>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-app">
          <SectionHeading
            eyebrow={t('aboutPage.valuesEyebrow')}
            title={t('aboutPage.valuesTitle')}
          />

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={item}
                className="rounded-3xl border border-ink-100 bg-white p-7 text-center shadow-soft transition-transform duration-300 hover:-translate-y-1.5"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 font-heading text-lg font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="font-heading mt-5 text-base font-bold text-ink-900">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}

import { motion } from 'framer-motion'
import SectionHeading from '@/components/ui/SectionHeading'
import { whyChooseUsIconMap } from '@/data/whyChooseUsIconMap'
import { useLanguage } from '@/context/LanguageContext'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function WhyChooseUsSection() {
  const { t } = useLanguage()
  const items = t('whyChooseUsSection.items')

  return (
    <section className="bg-[#F7FBFC] py-20 sm:py-28">
      <div className="container-app">
        <SectionHeading
          eyebrow={t('whyChooseUsSection.eyebrow')}
          title={t('whyChooseUsSection.title')}
          subtitle={t('whyChooseUsSection.subtitle')}
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((entry) => {
            const Icon = whyChooseUsIconMap[entry.icon]
            return (
              <motion.div
                key={entry.icon}
                variants={item}
                className="flex items-start gap-4 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 text-xl text-primary-600">
                  {Icon && <Icon />}
                </span>
                <div>
                  <h3 className="font-heading text-base font-bold text-ink-900">{entry.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{entry.description}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

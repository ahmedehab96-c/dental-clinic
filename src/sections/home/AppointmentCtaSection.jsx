import { motion } from 'framer-motion'
import { FaRegCalendarCheck, FaWhatsapp } from 'react-icons/fa'
import { HiOutlineSparkles } from 'react-icons/hi2'
import { GiTooth } from 'react-icons/gi'
import Button from '@/components/ui/Button'
import FloatingElement from '@/components/ui/FloatingElement'
import { useLanguage } from '@/context/LanguageContext'

export default function AppointmentCtaSection() {
  const { t } = useLanguage()

  return (
    <section className="py-6 sm:py-10">
      <div className="container-app">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 px-6 py-16 text-center shadow-medium sm:px-16 sm:py-20"
        >
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="shape-blob-1 absolute -top-16 -start-16 h-64 w-64 bg-white/10 blur-2xl" />
            <div className="shape-blob-1 absolute -bottom-20 -end-10 h-72 w-72 bg-white/10 blur-2xl" />
          </div>

          <FloatingElement className="start-[6%] top-10 z-10 hidden lg:block" distance={10} duration={4.5}>
            <div className="glass flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-white">
              <GiTooth />
            </div>
          </FloatingElement>

          <FloatingElement className="end-[8%] bottom-12 z-10 hidden lg:block" distance={12} duration={5} delay={0.5}>
            <div className="glass flex h-12 w-12 items-center justify-center rounded-xl text-lg text-white">
              <HiOutlineSparkles />
            </div>
          </FloatingElement>

          <div className="relative z-10 mx-auto max-w-2xl">
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-white">
              <HiOutlineSparkles className="text-base" />
              {t('appointmentCta.eyebrow')}
            </span>

            <h2 className="font-heading mt-6 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              {t('appointmentCta.title')}
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-white/85">{t('appointmentCta.subtitle')}</p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Button to="/book-appointment" variant="dark" size="lg" icon={<FaRegCalendarCheck />} iconPosition="start">
                {t('appointmentCta.ctaPrimary')}
              </Button>
              <Button
                href="https://wa.me/966550000000"
                variant="outlineLight"
                size="lg"
                icon={<FaWhatsapp />}
                iconPosition="start"
              >
                {t('appointmentCta.ctaSecondary')}
              </Button>
            </div>

            <p className="mt-6 text-sm text-white/70">{t('appointmentCta.note')}</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

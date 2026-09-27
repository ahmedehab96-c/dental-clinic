import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { HiOutlineShieldCheck, HiOutlineSparkles, HiOutlineArrowLongLeft, HiOutlineArrowLongRight } from 'react-icons/hi2'
import { GiTooth } from 'react-icons/gi'
import { FaStar, FaRegCalendarCheck } from 'react-icons/fa'
import Button from '@/components/ui/Button'
import FloatingElement from '@/components/ui/FloatingElement'
import { useTilt3D } from '@/hooks/useTilt3D'
import { heroStats } from '@/data/heroStats'
import { useLanguage } from '@/context/LanguageContext'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

export default function HeroSection() {
  const { t, isRtl } = useLanguage()
  const ArrowIcon = isRtl ? HiOutlineArrowLongLeft : HiOutlineArrowLongRight

  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const imageParallaxY = useTransform(scrollYProgress, [0, 1], [0, 50])
  const { ref: tiltRef, style: tiltStyle, onPointerMove, onPointerLeave } = useTilt3D({ max: 6 })

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-medical-gradient pt-32 pb-20 sm:pt-40 sm:pb-28">
      <BackgroundDecor />

      <div className="container-app relative grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <motion.div variants={container} initial="hidden" animate="show" className="relative z-10">
          <motion.span
            variants={fadeUp}
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-primary-700 shadow-soft"
          >
            <HiOutlineSparkles className="text-base text-accent-500" />
            {t('hero.eyebrow')}
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="font-heading mt-6 text-4xl font-bold leading-[1.1] text-ink-900 sm:text-5xl lg:text-6xl"
          >
            {t('hero.title')}
            <span className="text-gradient">{t('hero.titleHighlight')}</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-relaxed text-ink-500">
            {t('hero.subtitle')}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-4">
            <Button to="/book-appointment" variant="primary" size="lg" icon={<FaRegCalendarCheck />} iconPosition="start">
              {t('hero.ctaPrimary')}
            </Button>
            <Button to="/services" variant="outline" size="lg" icon={<ArrowIcon />}>
              {t('hero.ctaSecondary')}
            </Button>
          </motion.div>

          <motion.dl variants={fadeUp} className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {heroStats.map((stat) => (
              <div key={stat.key}>
                <dt className="sr-only">{t(stat.labelKey)}</dt>
                <dd className="font-heading text-2xl font-bold text-ink-900 sm:text-3xl">{stat.value}</dd>
                <p className="mt-1 text-xs font-medium text-ink-500 sm:text-sm">{t(stat.labelKey)}</p>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div style={{ y: imageParallaxY, perspective: 1200 }} className="relative mx-auto aspect-[4/5] w-full max-w-md lg:max-w-lg">
          <motion.div
            ref={tiltRef}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            style={tiltStyle}
            className="absolute inset-6 z-10"
          >
            <div className="shape-blob-1 absolute -inset-4 bg-gradient-to-br from-primary-400 to-accent-400 opacity-25 blur-2xl" />

            <div className="shape-blob-1 group relative h-full w-full overflow-hidden shadow-medium ring-1 ring-white/70">
              <img
                src="https://images.pexels.com/photos/19879741/pexels-photo-19879741.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=900&h=1100&fit=crop"
                alt="Dentist caring for a patient at Radiant Dental Care"
                loading="eager"
                fetchPriority="high"
                className="h-full w-full scale-110 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.18]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/25 via-transparent to-transparent" />
            </div>
          </motion.div>

          <FloatingElement className="start-[-10%] top-2 z-20 sm:start-[-16%]" distance={10} duration={5}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="h-20 w-20 overflow-hidden rounded-3xl shadow-medium ring-4 ring-white sm:h-24 sm:w-24"
            >
              <img
                src="https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=200&h=200&fit=crop"
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </FloatingElement>

          <FloatingElement className="end-[-4%] bottom-[24%] z-20 hidden sm:block" distance={12} duration={4.5} delay={0.9}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="h-16 w-16 overflow-hidden rounded-2xl shadow-medium ring-4 ring-white"
            >
              <img
                src="https://images.pexels.com/photos/6809645/pexels-photo-6809645.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=200&h=200&fit=crop"
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </FloatingElement>

          <FloatingElement className="start-[-8%] top-8 z-20 sm:start-[-14%]" distance={12} duration={4.5} delay={0.3}>
            <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-medium">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                <HiOutlineShieldCheck className="text-xl" />
              </span>
              <div className="text-start">
                <p className="text-sm font-bold text-ink-900">100%</p>
                <p className="text-xs text-ink-500">Certified Care</p>
              </div>
            </div>
          </FloatingElement>

          <FloatingElement className="bottom-10 end-[-6%] z-20 sm:end-[-12%]" distance={14} duration={5} delay={0.6}>
            <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-medium">
              <div className="flex -space-x-1">
                {[0, 1, 2].map((i) => (
                  <FaStar key={i} className="text-sm text-amber-400" />
                ))}
              </div>
              <div className="text-start">
                <p className="text-sm font-bold text-ink-900">4.9 / 5</p>
                <p className="text-xs text-ink-500">Patient Rating</p>
              </div>
            </div>
          </FloatingElement>

          <FloatingElement className="top-1/2 end-[-4%] z-20 hidden sm:block" distance={10} duration={4} delay={1.1}>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary-600 shadow-medium">
              <GiTooth className="text-2xl" />
            </div>
          </FloatingElement>
        </motion.div>
      </div>
    </section>
  )
}

function BackgroundDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -top-24 -start-24 h-80 w-80 rounded-full bg-primary-200/40 blur-3xl" />
      <div className="absolute top-1/3 -end-32 h-96 w-96 rounded-full bg-accent-200/50 blur-3xl" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.15]" width="100%" height="100%">
        <defs>
          <pattern id="hero-dots" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-primary-400" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-dots)" />
      </svg>
    </div>
  )
}

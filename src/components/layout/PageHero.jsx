import { motion } from 'framer-motion'
import { HiOutlineSparkles } from 'react-icons/hi2'

export default function PageHero({ eyebrow, title, subtitle, children }) {
  return (
    <section className="bg-medical-gradient relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 -start-24 h-72 w-72 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="absolute top-10 -end-24 h-72 w-72 rounded-full bg-accent-200/40 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="container-app relative text-center"
      >
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-4 py-1.5 text-sm font-semibold text-accent-700">
            <HiOutlineSparkles className="text-base" />
            {eyebrow}
          </span>
        )}
        <h1 className="font-heading mx-auto mt-5 max-w-3xl text-4xl font-bold leading-tight text-ink-900 sm:text-5xl">
          {title}
        </h1>
        {subtitle && <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-500">{subtitle}</p>}
        {children}
      </motion.div>
    </section>
  )
}

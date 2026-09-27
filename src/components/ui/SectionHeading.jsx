import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', dark = false, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-start',
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            'inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold',
            dark
              ? 'border-white/15 bg-white/5 font-mono text-xs tracking-[0.2em] text-white/60 uppercase'
              : 'border-accent-200 bg-accent-50 text-accent-700',
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2 className={cn('font-heading mt-4 text-3xl font-bold sm:text-4xl', dark ? 'text-white' : 'text-ink-900')}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn('mt-4 text-lg leading-relaxed', dark ? 'text-white/50' : 'text-ink-500')}>{subtitle}</p>
      )}
    </motion.div>
  )
}

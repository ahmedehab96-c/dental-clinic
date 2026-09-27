import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiOutlineArrowLongLeft, HiOutlineArrowLongRight } from 'react-icons/hi2'
import { serviceIconMap } from '@/data/serviceIconMap'
import { useLanguage } from '@/context/LanguageContext'
import { useTilt3D } from '@/hooks/useTilt3D'

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function ServiceCard({ service }) {
  const { tr, isRtl, t } = useLanguage()
  const Icon = serviceIconMap[service.icon]
  const ArrowIcon = isRtl ? HiOutlineArrowLongLeft : HiOutlineArrowLongRight
  const { ref: tiltRef, style: tiltStyle, onPointerMove, onPointerLeave } = useTilt3D({ max: 6 })

  return (
    <motion.div
      ref={tiltRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ ...tiltStyle, perspective: 800 }}
      variants={cardVariants}
      className="group h-full"
    >
      <Link
        to={`/services/${service.slug}`}
        className="flex h-full flex-col rounded-3xl border border-ink-100 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-200 hover:shadow-glow"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 text-2xl text-primary-600 transition-colors duration-300 group-hover:from-primary-600 group-hover:to-accent-500 group-hover:text-white">
          {Icon && <Icon />}
        </span>

        <h3 className="font-heading mt-5 text-lg font-bold text-ink-900">{tr(service.name)}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{tr(service.shortDescription)}</p>

        <div className="mt-6 flex items-center justify-between border-t border-ink-100 pt-5 text-sm">
          <span className="font-semibold text-primary-700">{t('common.learnMore')}</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-50 text-ink-500 transition-all duration-300 group-hover:bg-primary-600 group-hover:text-white">
            <ArrowIcon className="text-base" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

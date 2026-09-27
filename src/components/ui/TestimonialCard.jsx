import { motion } from 'framer-motion'
import { FaStar } from 'react-icons/fa'
import { HiMiniChatBubbleBottomCenterText } from 'react-icons/hi2'
import { useLanguage } from '@/context/LanguageContext'

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function TestimonialCard({ testimonial }) {
  const { tr } = useLanguage()

  return (
    <motion.div
      variants={cardVariants}
      className="relative flex h-full flex-col rounded-3xl border border-ink-100 bg-white p-7 shadow-soft"
    >
      <HiMiniChatBubbleBottomCenterText className="absolute end-6 top-6 text-3xl text-primary-100" />

      <div className="flex items-center gap-0.5 text-amber-400">
        {Array.from({ length: 5 }).map((_, index) => (
          <FaStar key={index} className={index < testimonial.rating ? '' : 'text-ink-200'} />
        ))}
      </div>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-600">"{tr(testimonial.quote)}"</p>

      <div className="mt-6 flex items-center gap-3 border-t border-ink-100 pt-5">
        <img
          src={testimonial.photo}
          alt={tr(testimonial.name)}
          loading="lazy"
          className="h-11 w-11 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-bold text-ink-900">{tr(testimonial.name)}</p>
          <p className="text-xs text-ink-500">{tr(testimonial.role)}</p>
        </div>
      </div>
    </motion.div>
  )
}

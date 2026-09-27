import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'
import { useLanguage } from '@/context/LanguageContext'
import { useTilt3D } from '@/hooks/useTilt3D'

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function DoctorCard({ doctor }) {
  const { tr } = useLanguage()
  const { ref: tiltRef, style: tiltStyle, onPointerMove, onPointerLeave } = useTilt3D({ max: 5 })

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
        to={`/doctors/${doctor.slug}`}
        className="flex h-full flex-col items-center rounded-3xl border border-ink-100 bg-gradient-to-b from-primary-50/60 to-white px-6 pt-8 pb-6 text-center shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow"
      >
        <div className="relative h-28 w-28">
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-60" />
          <img
            src={doctor.photo}
            alt={tr(doctor.name)}
            loading="lazy"
            className="relative h-28 w-28 rounded-full object-cover ring-4 ring-white shadow-medium transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute -bottom-1 start-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-ink-900 shadow-soft">
            <FaStar className="text-amber-400" />
            {doctor.rating}
          </span>
        </div>

        <h3 className="font-heading mt-5 text-lg font-bold text-ink-900">{tr(doctor.name)}</h3>
        <p className="mt-1 text-sm font-medium text-primary-600">{tr(doctor.specialty)}</p>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-500">{tr(doctor.bio)}</p>
      </Link>
    </motion.div>
  )
}

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiOutlineCalendarDays, HiOutlineClock } from 'react-icons/hi2'
import { useLanguage } from '@/context/LanguageContext'
import { formatDate } from '@/utils/formatDate'

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function BlogCard({ post }) {
  const { tr, t, language } = useLanguage()

  return (
    <motion.div variants={cardVariants} className="group h-full">
      <Link
        to={`/blog/${post.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-medium"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={post.image}
            alt={tr(post.title)}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <span className="absolute start-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary-700">
            {tr(post.category)}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-heading text-lg font-bold text-ink-900">{tr(post.title)}</h3>
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-500">{tr(post.excerpt)}</p>

          <div className="mt-5 flex items-center gap-4 border-t border-ink-100 pt-4 text-xs text-ink-500">
            <span className="flex items-center gap-1.5">
              <HiOutlineCalendarDays className="text-sm" />
              {formatDate(post.date, language)}
            </span>
            <span className="flex items-center gap-1.5">
              <HiOutlineClock className="text-sm" />
              {post.readMinutes} {t('articlePage.minRead')}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

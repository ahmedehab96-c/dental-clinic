import { AnimatePresence, motion } from 'framer-motion'
import { HiOutlineXMark, HiOutlineCalendarDays, HiOutlineUser } from 'react-icons/hi2'
import PostStatusBadge from '@/components/admin/PostStatusBadge'
import { useLanguage } from '@/context/LanguageContext'

export default function BlogPostDetailsModal({ post, onClose }) {
  const { t, tr } = useLanguage()

  return (
    <AnimatePresence>
      {post && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-ink-950/50 px-4 py-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            className="w-full max-w-xl rounded-[2rem] border border-ink-100 bg-white p-7 shadow-medium"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img src={post.image} alt="" className="h-14 w-14 rounded-xl object-cover ring-1 ring-ink-100" />
                <div>
                  <h2 className="font-heading text-lg font-bold text-ink-900">{tr(post.title)}</h2>
                  <p className="text-sm text-primary-600">{post.category ? tr(post.category.label) : '—'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t('admin.appointments.details.close')}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink-700"
              >
                <HiOutlineXMark className="text-lg" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <PostStatusBadge status={post.status} />
              <span className="flex items-center gap-1.5 text-sm text-ink-500">
                <HiOutlineCalendarDays className="text-base text-ink-400" />
                {post.publishedAt ? new Date(post.publishedAt).toLocaleString() : t('admin.blog.notPublished')}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-ink-500">
                <HiOutlineUser className="text-base text-ink-400" />
                {post.author ? tr(post.author.name) : t('admin.blog.noAuthor')}
              </span>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold text-ink-500">{t('admin.blog.form.excerpt')}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{tr(post.excerpt)}</p>
            </div>

            <div className="mt-5 max-h-56 overflow-y-auto">
              <p className="text-xs font-semibold text-ink-500">{t('admin.blog.form.content')}</p>
              <div className="mt-1.5 flex flex-col gap-2 text-sm leading-relaxed text-ink-700">
                {tr(post.content).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { AnimatePresence, motion } from 'framer-motion'
import { HiOutlineXMark } from 'react-icons/hi2'
import ActiveStatusBadge from '@/components/admin/ActiveStatusBadge'
import { useLanguage } from '@/context/LanguageContext'

export default function GalleryCaseDetailsModal({ item, onClose }) {
  const { t, tr } = useLanguage()

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/50 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg rounded-[2rem] border border-ink-100 bg-white p-7 shadow-medium"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-ink-900">{tr(item.title)}</h2>
                <p className="text-sm text-primary-600">{item.service ? tr(item.service.name) : '—'}</p>
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

            <div className="mt-4">
              <ActiveStatusBadge isActive={item.isPublished} />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div>
                <p className="mb-1.5 text-xs font-semibold text-ink-500">{t('admin.gallery.form.beforeImage')}</p>
                <img src={item.beforeImage} alt="" className="h-40 w-full rounded-2xl object-cover ring-1 ring-ink-100" />
              </div>
              <div>
                <p className="mb-1.5 text-xs font-semibold text-ink-500">{t('admin.gallery.form.afterImage')}</p>
                <img src={item.afterImage} alt="" className="h-40 w-full rounded-2xl object-cover ring-1 ring-ink-100" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

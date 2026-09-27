import { AnimatePresence, motion } from 'framer-motion'
import { HiOutlineXMark, HiOutlineClock, HiOutlineBanknotes } from 'react-icons/hi2'
import ActiveStatusBadge from '@/components/admin/ActiveStatusBadge'
import { useLanguage } from '@/context/LanguageContext'

export default function ServiceDetailsModal({ service, onClose }) {
  const { t, tr } = useLanguage()

  return (
    <AnimatePresence>
      {service && (
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
              <div className="flex items-center gap-3.5">
                <img src={service.image} alt="" className="h-14 w-14 rounded-xl object-cover ring-1 ring-ink-100" />
                <div>
                  <h2 className="font-heading text-lg font-bold text-ink-900">{tr(service.name)}</h2>
                  <p className="text-sm text-primary-600">{tr(service.shortDescription)}</p>
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

            <div className="mt-4">
              <ActiveStatusBadge isActive={service.isActive} />
            </div>

            <div className="mt-5 flex flex-col gap-2 text-sm text-ink-600">
              <span className="flex items-center gap-2">
                <HiOutlineBanknotes className="text-base text-ink-400" />
                {service.priceFrom} {t('common.currency')}
              </span>
              <span className="flex items-center gap-2">
                <HiOutlineClock className="text-base text-ink-400" />
                {tr(service.duration)}
              </span>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold text-ink-500">{t('admin.services.form.description')}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{tr(service.description)}</p>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold text-ink-500">{t('admin.services.table.doctors')}</p>
              {service.doctors.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {service.doctors.map((doctor) => (
                    <span
                      key={doctor.id}
                      className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
                    >
                      {tr(doctor.name)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-1.5 text-sm text-ink-400">{t('admin.services.noDoctors')}</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { AnimatePresence, motion } from 'framer-motion'
import Button from '@/components/ui/Button'

/**
 * Small, reusable confirm-before-destructive-action modal — styled to match
 * the success/error cards already used elsewhere (rounded-[2rem], shadow-medium).
 */
export default function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, loading }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/50 px-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            role="alertdialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-[2rem] border border-ink-100 bg-white p-7 text-center shadow-medium"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="font-heading text-lg font-bold text-ink-900">{title}</h2>
            <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{message}</p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button type="button" variant="outline" size="md" onClick={onCancel} disabled={loading}>
                {cancelLabel}
              </Button>
              <Button type="button" variant="primary" size="md" onClick={onConfirm} disabled={loading}>
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

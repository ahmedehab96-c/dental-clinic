import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HiOutlineChevronDown } from 'react-icons/hi2'
import { cn } from '@/utils/cn'

export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-3">
      {items.map((faqItem, index) => {
        const isOpen = openIndex === index
        return (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start"
            >
              <span className="font-heading text-base font-semibold text-ink-900">{faqItem.question}</span>
              <HiOutlineChevronDown
                className={cn(
                  'shrink-0 text-xl text-primary-600 transition-transform duration-300',
                  isOpen && 'rotate-180',
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-5 text-sm leading-relaxed text-ink-500">{faqItem.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export default function FloatingElement({
  children,
  className,
  distance = 14,
  duration = 4,
  delay = 0,
}) {
  return (
    <motion.div
      className={cn('absolute', className)}
      animate={{ y: [0, -distance, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

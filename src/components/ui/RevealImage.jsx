import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

// A directional "curtain" wipe (clip-path) plus a gentle zoom-out, used for
// hero/feature photos where a plain fade reads as too generic. `trigger`
// controls whether it plays on mount (above-the-fold hero images) or once
// scrolled into view (everything else).
const variants = {
  hidden: { clipPath: 'inset(0 0 100% 0)', scale: 1.08 },
  show: { clipPath: 'inset(0 0 0% 0)', scale: 1 },
}

export default function RevealImage({
  src,
  alt,
  className,
  imgClassName,
  children,
  trigger = 'view',
  delay = 0,
  ...imgProps
}) {
  const viewProps =
    trigger === 'view'
      ? { whileInView: 'show', viewport: { once: true, margin: '-80px' } }
      : { animate: 'show' }

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
      className={cn('relative overflow-hidden', className)}
      {...viewProps}
    >
      <img src={src} alt={alt} className={cn('h-full w-full object-cover', imgClassName)} {...imgProps} />
      {children}
    </motion.div>
  )
}

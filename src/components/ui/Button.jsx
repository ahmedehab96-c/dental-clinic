import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

const MotionLink = motion(Link)

const variants = {
  primary:
    'bg-primary-600 text-white shadow-soft hover:bg-primary-700 focus-visible:outline-primary-600',
  accent:
    'bg-accent-500 text-white shadow-soft hover:bg-accent-600 focus-visible:outline-accent-500',
  outline:
    'border border-ink-200 text-ink-800 bg-white hover:border-primary-300 hover:text-primary-700 focus-visible:outline-primary-600',
  glass: 'glass text-ink-900 hover:bg-white/80 focus-visible:outline-primary-600',
  dark: 'bg-white text-ink-950 shadow-glow hover:bg-white/90 focus-visible:outline-white',
  outlineLight:
    'border border-white/25 text-white hover:border-white hover:bg-white/10 focus-visible:outline-white',
}

const sizes = {
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export default function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'end',
  className,
  children,
  ...rest
}) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
    variants[variant],
    sizes[size],
    className,
  )

  const content = (
    <>
      {icon && iconPosition === 'start' && <span className="text-lg">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'end' && <span className="text-lg">{icon}</span>}
    </>
  )

  const motionProps = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 },
    transition: { type: 'spring', stiffness: 400, damping: 20 },
  }

  if (to) {
    return (
      <MotionLink to={to} className={classes} {...motionProps} {...rest}>
        {content}
      </MotionLink>
    )
  }

  if (href) {
    return (
      <motion.a href={href} className={classes} {...motionProps} {...rest}>
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button className={classes} {...motionProps} {...rest}>
      {content}
    </motion.button>
  )
}

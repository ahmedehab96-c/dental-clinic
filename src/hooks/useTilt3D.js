import { useRef } from 'react'
import { useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'

// Subtle pointer-driven 3D tilt for cards/images. Respects prefers-reduced-motion.
export function useTilt3D({ max = 8 } = {}) {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springConfig = { stiffness: 220, damping: 22, mass: 0.6 }
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), springConfig)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), springConfig)

  const onPointerMove = (event) => {
    if (prefersReducedMotion) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    x.set((event.clientX - rect.left) / rect.width - 0.5)
    y.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const onPointerLeave = () => {
    x.set(0)
    y.set(0)
  }

  return {
    ref,
    onPointerMove,
    onPointerLeave,
    style: prefersReducedMotion ? {} : { rotateX, rotateY, transformStyle: 'preserve-3d' },
  }
}

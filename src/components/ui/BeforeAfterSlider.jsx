import { useCallback, useRef, useState } from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2'

export default function BeforeAfterSlider({ beforeImage, afterImage, beforeLabel = 'Before', afterLabel = 'After' }) {
  const containerRef = useRef(null)
  const [position, setPosition] = useState(50)
  const isDragging = useRef(false)

  const updatePosition = useCallback((clientX) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const ratio = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(100, Math.max(0, ratio)))
  }, [])

  const handlePointerDown = (event) => {
    isDragging.current = true
    updatePosition(event.clientX)
  }

  const handlePointerMove = (event) => {
    if (!isDragging.current) return
    updatePosition(event.clientX)
  }

  const stopDragging = () => {
    isDragging.current = false
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full touch-none select-none overflow-hidden rounded-3xl shadow-medium"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerLeave={stopDragging}
    >
      <img
        src={afterImage}
        alt={afterLabel}
        draggable={false}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img
          src={beforeImage}
          alt={beforeLabel}
          draggable={false}
          loading="lazy"
          className="h-full object-cover"
          style={{ width: `${(100 / position) * 100 || 100}%`, maxWidth: 'none' }}
        />
      </div>

      {/* Physical left/right on purpose — this mirrors the left-anchored clip logic above, independent of page direction */}
      <span className="absolute left-3 top-3 rounded-full bg-ink-950/70 px-3 py-1 text-xs font-semibold text-white">
        {beforeLabel}
      </span>
      <span className="absolute right-3 top-3 rounded-full bg-ink-950/70 px-3 py-1 text-xs font-semibold text-white">
        {afterLabel}
      </span>

      <div className="absolute inset-y-0 w-0.5 bg-white" style={{ left: `${position}%` }}>
        <div className="absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink-700 shadow-medium">
          <HiChevronLeft className="-mr-1.5 text-base" />
          <HiChevronRight className="-ml-1.5 text-base" />
        </div>
      </div>
    </div>
  )
}

import { FaStar } from 'react-icons/fa'

export default function RatingStars({ rating, className = '' }) {
  return (
    <div className={`flex items-center gap-0.5 text-amber-400 ${className}`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <FaStar key={index} className={index < rating ? '' : 'text-ink-200'} />
      ))}
    </div>
  )
}

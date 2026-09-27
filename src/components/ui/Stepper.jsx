import { HiCheck } from 'react-icons/hi2'
import { cn } from '@/utils/cn'

export default function Stepper({ steps, currentStep }) {
  return (
    <ol className="flex items-center justify-center">
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isCompleted = stepNumber < currentStep
        const isActive = stepNumber === currentStep

        return (
          <li key={step} aria-current={isActive ? 'step' : undefined} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors duration-300',
                  isCompleted && 'bg-primary-600 text-white',
                  isActive && 'bg-white text-primary-700 ring-2 ring-primary-600',
                  !isCompleted && !isActive && 'bg-white text-ink-400 ring-1 ring-ink-200',
                )}
              >
                {isCompleted ? <HiCheck /> : stepNumber}
              </span>
              <span
                className={cn(
                  'max-w-[6.5rem] text-center text-xs font-semibold',
                  isActive || isCompleted ? 'text-ink-800' : 'text-ink-400',
                )}
              >
                {step}
              </span>
            </div>
            {stepNumber < steps.length && (
              <span
                className={cn(
                  'mx-2 mb-5 h-0.5 w-10 rounded-full transition-colors duration-300 sm:w-20',
                  isCompleted ? 'bg-primary-600' : 'bg-ink-200',
                )}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

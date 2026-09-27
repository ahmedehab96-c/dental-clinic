import { useEffect, useState } from 'react'

/**
 * Returns `value`, but only updates after it's stopped changing for
 * `delay`ms — used to avoid firing an API request on every keystroke.
 */
export function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

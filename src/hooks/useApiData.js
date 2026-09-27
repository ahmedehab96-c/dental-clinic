import { useEffect, useState } from 'react'

/**
 * Runs an async fetcher and tracks { data, loading, error, notFound }.
 * `deps` controls when it re-runs (e.g. [slug]) — pass a fresh fetcher
 * closure each render (as every call site here does) rather than a
 * memoized one; only `deps` decides when a new request fires. Guards
 * against setting state after unmount/re-run so a slow, stale request
 * can't clobber a newer one's result.
 *
 * @param {() => Promise<any>} fetcher
 * @param {any[]} deps
 */
export function useApiData(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    setState((prev) => ({ ...prev, loading: true, error: null }))

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null })
      })
      .catch((error) => {
        if (!cancelled) setState({ data: null, loading: false, error })
      })

    return () => {
      cancelled = true
    }
    // `deps` (caller-supplied) drives when this re-runs, not `fetcher` itself.
    // eslint-disable-next-line
  }, deps)

  return { ...state, notFound: state.error?.status === 404 }
}

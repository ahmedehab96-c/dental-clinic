import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as authApi from '@/services/api/auth'
import { getAuthToken, setAuthToken, clearAuthToken } from '@/services/api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // Starts true only when there's a token to verify — a guest never waits
  // on a request that was always going to be skipped.
  const [loading, setLoading] = useState(Boolean(getAuthToken()))

  useEffect(() => {
    const token = getAuthToken()
    if (!token) return

    let cancelled = false
    authApi
      .me()
      .then((freshUser) => {
        if (!cancelled) setUser(freshUser)
      })
      .catch(() => {
        // Token is invalid/expired — drop it rather than keep retrying on
        // every future request with a header that will just 401 again.
        if (!cancelled) {
          clearAuthToken()
          setUser(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (payload) => {
    const { user: loggedInUser, token } = await authApi.login(payload)
    setAuthToken(token)
    setUser(loggedInUser)
    return loggedInUser
  }, [])

  const register = useCallback(async (payload) => {
    const { user: newUser, token } = await authApi.register(payload)
    setAuthToken(token)
    setUser(newUser)
    return newUser
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // Even if the server call fails (e.g. the token already expired),
      // the local session still needs to end.
    } finally {
      clearAuthToken()
      setUser(null)
    }
  }, [])

  const refreshUser = useCallback(async () => {
    const freshUser = await authApi.me()
    setUser(freshUser)
    return freshUser
  }, [])

  // Mirrors login/register: call the API, then adopt its response as the
  // new user state directly — the PATCH already returns the updated user,
  // so there's no need for a follow-up refreshUser() round-trip.
  const updateProfile = useCallback(async (payload) => {
    const updatedUser = await authApi.updateProfile(payload)
    setUser(updatedUser)
    return updatedUser
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), loading, login, register, logout, refreshUser, updateProfile }),
    [user, loading, login, register, logout, refreshUser, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within an AuthProvider')
  return ctx
}

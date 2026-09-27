import { useAuthContext } from '@/context/AuthContext'

// Thin re-export so components import `useAuth` from hooks/, matching the
// project's existing `useLanguage` convention, while AuthContext.jsx owns
// the actual provider/state.
export function useAuth() {
  return useAuthContext()
}

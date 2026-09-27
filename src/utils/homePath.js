const HOME_BY_ROLE = { admin: '/admin', doctor: '/doctor' }

/**
 * Where "my dashboard" points for a signed-in user. `user` is always the
 * server-returned account (login / `/me` response), so the role here is the
 * one Laravel authorizes against — patients keep the /dashboard entry point.
 */
export function homePathFor(user) {
  return HOME_BY_ROLE[user?.role] ?? '/dashboard'
}

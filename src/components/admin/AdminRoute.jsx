import RoleRoute from '@/components/auth/RoleRoute'

/**
 * Guards /admin/*. UX only — Laravel's `role:admin` middleware is the real
 * security boundary on every admin endpoint.
 */
export default function AdminRoute() {
  return <RoleRoute role="admin" deniedKey="admin.accessDenied" />
}

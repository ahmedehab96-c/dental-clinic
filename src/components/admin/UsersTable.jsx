import { HiOutlineEye, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2'
import RoleBadge from '@/components/admin/RoleBadge'
import { useLanguage } from '@/context/LanguageContext'

export default function UsersTable({ users, currentUserId, onView, onEdit, onDelete }) {
  const { t } = useLanguage()

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] text-start text-sm">
        <thead>
          <tr className="border-b border-ink-100 text-xs font-semibold text-ink-500">
            <th className="px-4 py-3 text-start">{t('admin.users.table.name')}</th>
            <th className="px-4 py-3 text-start">{t('admin.users.table.email')}</th>
            <th className="px-4 py-3 text-start">{t('admin.users.table.phone')}</th>
            <th className="px-4 py-3 text-start">{t('admin.users.table.role')}</th>
            <th className="px-4 py-3 text-start">{t('admin.users.table.appointments')}</th>
            <th className="px-4 py-3 text-start">{t('admin.users.table.createdAt')}</th>
            <th className="px-4 py-3 text-start">{t('admin.users.table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isSelf = user.id === currentUserId
            return (
              <tr key={user.id} className="border-b border-ink-50 align-top last:border-0">
                <td className="px-4 py-3.5 font-medium text-ink-800">
                  {user.name}
                  {isSelf && <span className="ms-2 text-xs font-normal text-ink-400">({t('admin.users.you')})</span>}
                </td>
                <td className="px-4 py-3.5 text-ink-600" dir="ltr">{user.email}</td>
                <td className="px-4 py-3.5 text-ink-600" dir="ltr">{user.phone || '—'}</td>
                <td className="px-4 py-3.5">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-4 py-3.5 text-ink-600">{user.appointmentsCount}</td>
                <td className="px-4 py-3.5 text-ink-600 whitespace-nowrap">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onView(user)}
                      aria-label={t('admin.appointments.actions.view')}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-200 text-ink-600 transition-colors hover:border-primary-300 hover:text-primary-700"
                    >
                      <HiOutlineEye className="text-sm" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(user)}
                      aria-label={t('admin.users.actions.edit')}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-200 text-ink-600 transition-colors hover:border-primary-300 hover:text-primary-700"
                    >
                      <HiOutlinePencilSquare className="text-sm" />
                    </button>
                    {!isSelf && (
                      <button
                        type="button"
                        onClick={() => onDelete(user)}
                        aria-label={t('admin.users.actions.delete')}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-200 text-red-600 transition-colors hover:border-red-300 hover:bg-red-50"
                      >
                        <HiOutlineTrash className="text-sm" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

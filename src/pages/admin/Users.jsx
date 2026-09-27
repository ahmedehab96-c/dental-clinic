import { useEffect, useState } from 'react'
import { HiOutlinePlus } from 'react-icons/hi2'
import Button from '@/components/ui/Button'
import AsyncState from '@/components/ui/AsyncState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Pagination from '@/components/admin/Pagination'
import UsersFilters from '@/components/admin/UsersFilters'
import UsersTable from '@/components/admin/UsersTable'
import UserDetailsModal from '@/components/admin/UserDetailsModal'
import UserFormModal from '@/components/admin/UserFormModal'
import { useApiData } from '@/hooks/useApiData'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useAuth } from '@/hooks/useAuth'
import { fetchAdminUsers, deleteAdminUser } from '@/services/api/adminUsers'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'

const PER_PAGE = 10

export default function AdminUsers() {
  const { t } = useLanguage()
  usePageTitle(t('admin.sidebar.users'))
  const { user: currentUser, refreshUser } = useAuth()

  const [page, setPage] = useState(1)
  const [role, setRole] = useState('')
  const [sort, setSort] = useState('newest')
  const [searchInput, setSearchInput] = useState('')
  const search = useDebouncedValue(searchInput, 400)

  useEffect(() => {
    setPage(1)
  }, [role, sort, search])

  const { data: result, loading, error } = useApiData(
    () => fetchAdminUsers({ page, perPage: PER_PAGE, search, role, sort }),
    [page, role, sort, search],
  )

  const [users, setUsers] = useState([])
  useEffect(() => {
    setUsers(result?.users ?? [])
  }, [result])

  const [viewing, setViewing] = useState(null)
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [banner, setBanner] = useState(null)

  const hasActiveFilters = Boolean(role || searchInput || sort !== 'newest')
  const clearFilters = () => {
    setRole('')
    setSort('newest')
    setSearchInput('')
  }

  const openAddForm = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEditForm = (user) => {
    setEditing(user)
    setFormOpen(true)
  }

  const handleSaved = (saved, wasEdit) => {
    setFormOpen(false)
    setUsers((prev) =>
      wasEdit ? prev.map((entry) => (entry.id === saved.id ? saved : entry)) : [saved, ...prev],
    )
    // Keep the topbar's name/email in sync when an admin edits their own account.
    if (wasEdit && saved.id === currentUser?.id) refreshUser().catch(() => {})
    setBanner({
      type: 'success',
      message: t(wasEdit ? 'admin.users.updateSuccess' : 'admin.users.createSuccess'),
    })
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteAdminUser(pendingDelete.id)
      setUsers((prev) => prev.filter((entry) => entry.id !== pendingDelete.id))
      setBanner({ type: 'success', message: t('admin.users.deleteSuccess') })
    } catch (error) {
      setBanner({
        type: 'error',
        message: error.status === 422 ? t('admin.users.deleteBlocked') : t('admin.users.deleteError'),
      })
    } finally {
      setPendingDelete(null)
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink-900">{t('admin.users.title')}</h1>
          <p className="mt-1 text-sm text-ink-500">{t('admin.users.subtitle')}</p>
        </div>
        <Button type="button" variant="primary" size="md" icon={<HiOutlinePlus />} iconPosition="start" onClick={openAddForm}>
          {t('admin.users.addButton')}
        </Button>
      </div>

      {banner && (
        <div
          role="alert"
          className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
            banner.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-600'
          }`}
        >
          {banner.message}
        </div>
      )}

      <UsersFilters
        search={searchInput}
        onSearchChange={setSearchInput}
        role={role}
        onRoleChange={setRole}
        sort={sort}
        onSortChange={setSort}
        hasActiveFilters={hasActiveFilters}
        onClear={clearFilters}
      />

      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
        {loading && <AsyncState status="loading" />}
        {!loading && error && <AsyncState status="error" />}
        {!loading && !error && users.length === 0 && (
          <AsyncState
            status="empty"
            message={hasActiveFilters ? t('admin.users.noSearchResults') : t('admin.users.empty')}
            actionLabel={hasActiveFilters ? t('admin.appointments.filters.clear') : undefined}
            onAction={hasActiveFilters ? clearFilters : undefined}
          />
        )}

        {!loading && !error && users.length > 0 && (
          <>
            <UsersTable
              users={users}
              currentUserId={currentUser?.id}
              onView={setViewing}
              onEdit={openEditForm}
              onDelete={setPendingDelete}
            />
            <Pagination
              currentPage={result?.meta.currentPage ?? 1}
              lastPage={result?.meta.lastPage ?? 1}
              totalLabel={t('admin.users.pagination.totalCount').replace('{count}', result?.meta.total ?? 0)}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <UserDetailsModal user={viewing} onClose={() => setViewing(null)} />

      <UserFormModal
        open={formOpen}
        user={editing}
        currentUserId={currentUser?.id}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t('admin.users.deleteConfirm.title')}
        message={t('admin.users.deleteConfirm.message')}
        confirmLabel={t('admin.users.deleteConfirm.confirmButton')}
        cancelLabel={t('admin.users.deleteConfirm.dismissButton')}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
        loading={isDeleting}
      />
    </div>
  )
}

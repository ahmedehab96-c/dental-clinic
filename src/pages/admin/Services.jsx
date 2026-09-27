import { useEffect, useState } from 'react'
import { HiOutlinePlus } from 'react-icons/hi2'
import Button from '@/components/ui/Button'
import AsyncState from '@/components/ui/AsyncState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Pagination from '@/components/admin/Pagination'
import ServicesFilters from '@/components/admin/ServicesFilters'
import ServicesTable from '@/components/admin/ServicesTable'
import ServiceDetailsModal from '@/components/admin/ServiceDetailsModal'
import ServiceFormModal from '@/components/admin/ServiceFormModal'
import { useApiData } from '@/hooks/useApiData'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { fetchAdminServices, deleteAdminService } from '@/services/api/adminServices'
import { fetchAdminDoctors } from '@/services/api/adminDoctors'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'

const PER_PAGE = 10
const fetchAllDoctors = () => fetchAdminDoctors({ perPage: 100 })

export default function AdminServices() {
  const { t } = useLanguage()
  usePageTitle(t('admin.sidebar.services'))

  const [page, setPage] = useState(1)
  const [isActive, setIsActive] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const search = useDebouncedValue(searchInput, 400)

  useEffect(() => {
    setPage(1)
  }, [isActive, search])

  const { data: result, loading, error } = useApiData(
    () => fetchAdminServices({ page, perPage: PER_PAGE, search, isActive }),
    [page, isActive, search],
  )
  const { data: doctorsResult } = useApiData(fetchAllDoctors, [])

  const [services, setServices] = useState([])
  useEffect(() => {
    setServices(result?.services ?? [])
  }, [result])

  const [viewing, setViewing] = useState(null)
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [banner, setBanner] = useState(null)

  const hasActiveFilters = Boolean(isActive || searchInput)
  const clearFilters = () => {
    setIsActive('')
    setSearchInput('')
  }

  const openAddForm = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEditForm = (service) => {
    setEditing(service)
    setFormOpen(true)
  }

  const handleSaved = (saved, wasEdit) => {
    setFormOpen(false)
    setServices((prev) =>
      wasEdit ? prev.map((entry) => (entry.id === saved.id ? saved : entry)) : [saved, ...prev],
    )
    setBanner({
      type: 'success',
      message: t(wasEdit ? 'admin.services.updateSuccess' : 'admin.services.createSuccess'),
    })
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteAdminService(pendingDelete.slug)
      setServices((prev) => prev.filter((entry) => entry.id !== pendingDelete.id))
      setBanner({ type: 'success', message: t('admin.services.deleteSuccess') })
      setPendingDelete(null)
    } catch (error) {
      setBanner({
        type: 'error',
        message: error.status === 422 ? t('admin.services.deleteBlocked') : t('admin.services.deleteError'),
      })
      setPendingDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink-900">{t('admin.services.title')}</h1>
          <p className="mt-1 text-sm text-ink-500">{t('admin.services.subtitle')}</p>
        </div>
        <Button type="button" variant="primary" size="md" icon={<HiOutlinePlus />} iconPosition="start" onClick={openAddForm}>
          {t('admin.services.addButton')}
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

      <ServicesFilters
        search={searchInput}
        onSearchChange={setSearchInput}
        isActive={isActive}
        onIsActiveChange={setIsActive}
        hasActiveFilters={hasActiveFilters}
        onClear={clearFilters}
      />

      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
        {loading && <AsyncState status="loading" />}
        {!loading && error && <AsyncState status="error" />}
        {!loading && !error && services.length === 0 && (
          <AsyncState
            status="empty"
            message={hasActiveFilters ? t('admin.services.noSearchResults') : t('admin.services.empty')}
            actionLabel={hasActiveFilters ? t('admin.appointments.filters.clear') : undefined}
            onAction={hasActiveFilters ? clearFilters : undefined}
          />
        )}

        {!loading && !error && services.length > 0 && (
          <>
            <ServicesTable services={services} onView={setViewing} onEdit={openEditForm} onDelete={setPendingDelete} />
            <Pagination
              currentPage={result?.meta.currentPage ?? 1}
              lastPage={result?.meta.lastPage ?? 1}
              totalLabel={t('admin.services.pagination.totalCount').replace('{count}', result?.meta.total ?? 0)}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <ServiceDetailsModal service={viewing} onClose={() => setViewing(null)} />

      <ServiceFormModal
        open={formOpen}
        service={editing}
        doctors={doctorsResult?.doctors ?? []}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t('admin.services.deleteConfirm.title')}
        message={t('admin.services.deleteConfirm.message')}
        confirmLabel={t('admin.services.deleteConfirm.confirmButton')}
        cancelLabel={t('admin.services.deleteConfirm.dismissButton')}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
        loading={isDeleting}
      />
    </div>
  )
}

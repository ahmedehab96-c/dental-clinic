import { useEffect, useState } from 'react'
import { HiOutlinePlus } from 'react-icons/hi2'
import Button from '@/components/ui/Button'
import AsyncState from '@/components/ui/AsyncState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Pagination from '@/components/admin/Pagination'
import DoctorsFilters from '@/components/admin/DoctorsFilters'
import DoctorsTable from '@/components/admin/DoctorsTable'
import DoctorDetailsModal from '@/components/admin/DoctorDetailsModal'
import DoctorFormModal from '@/components/admin/DoctorFormModal'
import { useApiData } from '@/hooks/useApiData'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { fetchAdminDoctors, deleteAdminDoctor } from '@/services/api/adminDoctors'
import { fetchServices } from '@/services/api/services'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'

const PER_PAGE = 10
const fetchAllServices = () => fetchServices({ perPage: 100 })

export default function AdminDoctors() {
  const { t } = useLanguage()
  usePageTitle(t('admin.sidebar.doctors'))

  const [page, setPage] = useState(1)
  const [isActive, setIsActive] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const search = useDebouncedValue(searchInput, 400)

  useEffect(() => {
    setPage(1)
  }, [isActive, search])

  const { data: result, loading, error } = useApiData(
    () => fetchAdminDoctors({ page, perPage: PER_PAGE, search, isActive }),
    [page, isActive, search],
  )
  const { data: services } = useApiData(fetchAllServices, [])

  const [doctors, setDoctors] = useState([])
  useEffect(() => {
    setDoctors(result?.doctors ?? [])
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
  const openEditForm = (doctor) => {
    setEditing(doctor)
    setFormOpen(true)
  }

  const handleSaved = (saved, wasEdit) => {
    setFormOpen(false)
    setDoctors((prev) =>
      wasEdit ? prev.map((entry) => (entry.id === saved.id ? saved : entry)) : [saved, ...prev],
    )
    setBanner({
      type: 'success',
      message: t(wasEdit ? 'admin.doctors.updateSuccess' : 'admin.doctors.createSuccess'),
    })
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteAdminDoctor(pendingDelete.slug)
      setDoctors((prev) => prev.filter((entry) => entry.id !== pendingDelete.id))
      setBanner({ type: 'success', message: t('admin.doctors.deleteSuccess') })
      setPendingDelete(null)
    } catch (error) {
      setBanner({
        type: 'error',
        message: error.status === 422 ? t('admin.doctors.deleteBlocked') : t('admin.doctors.deleteError'),
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
          <h1 className="font-heading text-2xl font-bold text-ink-900">{t('admin.doctors.title')}</h1>
          <p className="mt-1 text-sm text-ink-500">{t('admin.doctors.subtitle')}</p>
        </div>
        <Button type="button" variant="primary" size="md" icon={<HiOutlinePlus />} iconPosition="start" onClick={openAddForm}>
          {t('admin.doctors.addButton')}
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

      <DoctorsFilters
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
        {!loading && !error && doctors.length === 0 && (
          <AsyncState
            status="empty"
            message={hasActiveFilters ? t('admin.doctors.noSearchResults') : t('admin.doctors.empty')}
            actionLabel={hasActiveFilters ? t('admin.appointments.filters.clear') : undefined}
            onAction={hasActiveFilters ? clearFilters : undefined}
          />
        )}

        {!loading && !error && doctors.length > 0 && (
          <>
            <DoctorsTable doctors={doctors} onView={setViewing} onEdit={openEditForm} onDelete={setPendingDelete} />
            <Pagination
              currentPage={result?.meta.currentPage ?? 1}
              lastPage={result?.meta.lastPage ?? 1}
              totalLabel={t('admin.doctors.pagination.totalCount').replace('{count}', result?.meta.total ?? 0)}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <DoctorDetailsModal doctor={viewing} onClose={() => setViewing(null)} />

      <DoctorFormModal
        open={formOpen}
        doctor={editing}
        services={services ?? []}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t('admin.doctors.deleteConfirm.title')}
        message={t('admin.doctors.deleteConfirm.message')}
        confirmLabel={t('admin.doctors.deleteConfirm.confirmButton')}
        cancelLabel={t('admin.doctors.deleteConfirm.dismissButton')}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
        loading={isDeleting}
      />
    </div>
  )
}

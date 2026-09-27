import { useEffect, useState } from 'react'
import { HiOutlinePlus } from 'react-icons/hi2'
import Button from '@/components/ui/Button'
import AsyncState from '@/components/ui/AsyncState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Pagination from '@/components/admin/Pagination'
import GalleryFilters from '@/components/admin/GalleryFilters'
import GalleryCasesTable from '@/components/admin/GalleryCasesTable'
import GalleryCaseDetailsModal from '@/components/admin/GalleryCaseDetailsModal'
import GalleryCaseFormModal from '@/components/admin/GalleryCaseFormModal'
import { useApiData } from '@/hooks/useApiData'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { fetchAdminGalleryCases, deleteAdminGalleryCase } from '@/services/api/adminGallery'
import { fetchAdminServices } from '@/services/api/adminServices'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'

const PER_PAGE = 10
const fetchAllServices = () => fetchAdminServices({ perPage: 100 })

export default function AdminGallery() {
  const { t } = useLanguage()
  usePageTitle(t('admin.sidebar.gallery'))

  const [page, setPage] = useState(1)
  const [service, setService] = useState('')
  const [isPublished, setIsPublished] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const search = useDebouncedValue(searchInput, 400)

  useEffect(() => {
    setPage(1)
  }, [service, isPublished, search])

  const { data: result, loading, error } = useApiData(
    () => fetchAdminGalleryCases({ page, perPage: PER_PAGE, search, service, isPublished }),
    [page, service, isPublished, search],
  )
  const { data: servicesResult } = useApiData(fetchAllServices, [])

  const [cases, setCases] = useState([])
  useEffect(() => {
    setCases(result?.cases ?? [])
  }, [result])

  const [viewing, setViewing] = useState(null)
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [banner, setBanner] = useState(null)

  const hasActiveFilters = Boolean(service || isPublished || searchInput)
  const clearFilters = () => {
    setService('')
    setIsPublished('')
    setSearchInput('')
  }

  const openAddForm = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEditForm = (item) => {
    setEditing(item)
    setFormOpen(true)
  }

  const handleSaved = (saved, wasEdit) => {
    setFormOpen(false)
    setCases((prev) =>
      wasEdit ? prev.map((entry) => (entry.id === saved.id ? saved : entry)) : [saved, ...prev],
    )
    setBanner({
      type: 'success',
      message: t(wasEdit ? 'admin.gallery.updateSuccess' : 'admin.gallery.createSuccess'),
    })
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteAdminGalleryCase(pendingDelete.id)
      setCases((prev) => prev.filter((entry) => entry.id !== pendingDelete.id))
      setBanner({ type: 'success', message: t('admin.gallery.deleteSuccess') })
      setPendingDelete(null)
    } catch {
      setBanner({ type: 'error', message: t('admin.gallery.deleteError') })
      setPendingDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink-900">{t('admin.gallery.title')}</h1>
          <p className="mt-1 text-sm text-ink-500">{t('admin.gallery.subtitle')}</p>
        </div>
        <Button type="button" variant="primary" size="md" icon={<HiOutlinePlus />} iconPosition="start" onClick={openAddForm}>
          {t('admin.gallery.addButton')}
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

      <GalleryFilters
        search={searchInput}
        onSearchChange={setSearchInput}
        service={service}
        onServiceChange={setService}
        services={servicesResult?.services ?? []}
        isPublished={isPublished}
        onIsPublishedChange={setIsPublished}
        hasActiveFilters={hasActiveFilters}
        onClear={clearFilters}
      />

      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
        {loading && <AsyncState status="loading" />}
        {!loading && error && <AsyncState status="error" />}
        {!loading && !error && cases.length === 0 && (
          <AsyncState
            status="empty"
            message={hasActiveFilters ? t('admin.gallery.noSearchResults') : t('admin.gallery.empty')}
            actionLabel={hasActiveFilters ? t('admin.appointments.filters.clear') : undefined}
            onAction={hasActiveFilters ? clearFilters : undefined}
          />
        )}

        {!loading && !error && cases.length > 0 && (
          <>
            <GalleryCasesTable cases={cases} onView={setViewing} onEdit={openEditForm} onDelete={setPendingDelete} />
            <Pagination
              currentPage={result?.meta.currentPage ?? 1}
              lastPage={result?.meta.lastPage ?? 1}
              totalLabel={t('admin.gallery.pagination.totalCount').replace('{count}', result?.meta.total ?? 0)}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <GalleryCaseDetailsModal item={viewing} onClose={() => setViewing(null)} />

      <GalleryCaseFormModal
        open={formOpen}
        item={editing}
        services={servicesResult?.services ?? []}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t('admin.gallery.deleteConfirm.title')}
        message={t('admin.gallery.deleteConfirm.message')}
        confirmLabel={t('admin.gallery.deleteConfirm.confirmButton')}
        cancelLabel={t('admin.gallery.deleteConfirm.dismissButton')}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
        loading={isDeleting}
      />
    </div>
  )
}

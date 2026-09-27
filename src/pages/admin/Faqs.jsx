import { useEffect, useState } from 'react'
import { HiOutlinePlus } from 'react-icons/hi2'
import Button from '@/components/ui/Button'
import AsyncState from '@/components/ui/AsyncState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Pagination from '@/components/admin/Pagination'
import FaqsFilters from '@/components/admin/FaqsFilters'
import FaqsTable from '@/components/admin/FaqsTable'
import FaqDetailsModal from '@/components/admin/FaqDetailsModal'
import FaqFormModal from '@/components/admin/FaqFormModal'
import { useApiData } from '@/hooks/useApiData'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { fetchAdminFaqs, deleteAdminFaq } from '@/services/api/adminFaqs'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'

const PER_PAGE = 10

export default function AdminFaqs() {
  const { t } = useLanguage()
  usePageTitle(t('admin.sidebar.faqs'))

  const [page, setPage] = useState(1)
  const [isPublished, setIsPublished] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const search = useDebouncedValue(searchInput, 400)

  useEffect(() => {
    setPage(1)
  }, [isPublished, search])

  const { data: result, loading, error } = useApiData(
    () => fetchAdminFaqs({ page, perPage: PER_PAGE, search, isPublished }),
    [page, isPublished, search],
  )

  const [faqs, setFaqs] = useState([])
  useEffect(() => {
    setFaqs(result?.faqs ?? [])
  }, [result])

  const [viewing, setViewing] = useState(null)
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [banner, setBanner] = useState(null)

  const hasActiveFilters = Boolean(isPublished || searchInput)
  const clearFilters = () => {
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
    setFaqs((prev) =>
      wasEdit ? prev.map((entry) => (entry.id === saved.id ? saved : entry)) : [saved, ...prev],
    )
    setBanner({
      type: 'success',
      message: t(wasEdit ? 'admin.faqs.updateSuccess' : 'admin.faqs.createSuccess'),
    })
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteAdminFaq(pendingDelete.id)
      setFaqs((prev) => prev.filter((entry) => entry.id !== pendingDelete.id))
      setBanner({ type: 'success', message: t('admin.faqs.deleteSuccess') })
      setPendingDelete(null)
    } catch {
      setBanner({ type: 'error', message: t('admin.faqs.deleteError') })
      setPendingDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink-900">{t('admin.faqs.title')}</h1>
          <p className="mt-1 text-sm text-ink-500">{t('admin.faqs.subtitle')}</p>
        </div>
        <Button type="button" variant="primary" size="md" icon={<HiOutlinePlus />} iconPosition="start" onClick={openAddForm}>
          {t('admin.faqs.addButton')}
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

      <FaqsFilters
        search={searchInput}
        onSearchChange={setSearchInput}
        isPublished={isPublished}
        onIsPublishedChange={setIsPublished}
        hasActiveFilters={hasActiveFilters}
        onClear={clearFilters}
      />

      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
        {loading && <AsyncState status="loading" />}
        {!loading && error && <AsyncState status="error" />}
        {!loading && !error && faqs.length === 0 && (
          <AsyncState
            status="empty"
            message={hasActiveFilters ? t('admin.faqs.noSearchResults') : t('admin.faqs.empty')}
            actionLabel={hasActiveFilters ? t('admin.appointments.filters.clear') : undefined}
            onAction={hasActiveFilters ? clearFilters : undefined}
          />
        )}

        {!loading && !error && faqs.length > 0 && (
          <>
            <FaqsTable faqs={faqs} onView={setViewing} onEdit={openEditForm} onDelete={setPendingDelete} />
            <Pagination
              currentPage={result?.meta.currentPage ?? 1}
              lastPage={result?.meta.lastPage ?? 1}
              totalLabel={t('admin.faqs.pagination.totalCount').replace('{count}', result?.meta.total ?? 0)}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <FaqDetailsModal item={viewing} onClose={() => setViewing(null)} />

      <FaqFormModal open={formOpen} item={editing} onClose={() => setFormOpen(false)} onSaved={handleSaved} />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t('admin.faqs.deleteConfirm.title')}
        message={t('admin.faqs.deleteConfirm.message')}
        confirmLabel={t('admin.faqs.deleteConfirm.confirmButton')}
        cancelLabel={t('admin.faqs.deleteConfirm.dismissButton')}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
        loading={isDeleting}
      />
    </div>
  )
}

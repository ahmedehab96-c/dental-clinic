import { useEffect, useState } from 'react'
import { HiOutlinePlus } from 'react-icons/hi2'
import Button from '@/components/ui/Button'
import AsyncState from '@/components/ui/AsyncState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Pagination from '@/components/admin/Pagination'
import TestimonialsFilters from '@/components/admin/TestimonialsFilters'
import TestimonialsTable from '@/components/admin/TestimonialsTable'
import TestimonialDetailsModal from '@/components/admin/TestimonialDetailsModal'
import TestimonialFormModal from '@/components/admin/TestimonialFormModal'
import { useApiData } from '@/hooks/useApiData'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { fetchAdminTestimonials, deleteAdminTestimonial } from '@/services/api/adminTestimonials'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'

const PER_PAGE = 10

export default function AdminTestimonials() {
  const { t } = useLanguage()
  usePageTitle(t('admin.sidebar.testimonials'))

  const [page, setPage] = useState(1)
  const [rating, setRating] = useState('')
  const [isPublished, setIsPublished] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const search = useDebouncedValue(searchInput, 400)

  useEffect(() => {
    setPage(1)
  }, [rating, isPublished, search])

  const { data: result, loading, error } = useApiData(
    () => fetchAdminTestimonials({ page, perPage: PER_PAGE, search, rating, isPublished }),
    [page, rating, isPublished, search],
  )

  const [testimonials, setTestimonials] = useState([])
  useEffect(() => {
    setTestimonials(result?.testimonials ?? [])
  }, [result])

  const [viewing, setViewing] = useState(null)
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [banner, setBanner] = useState(null)

  const hasActiveFilters = Boolean(rating || isPublished || searchInput)
  const clearFilters = () => {
    setRating('')
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
    setTestimonials((prev) =>
      wasEdit ? prev.map((entry) => (entry.id === saved.id ? saved : entry)) : [saved, ...prev],
    )
    setBanner({
      type: 'success',
      message: t(wasEdit ? 'admin.testimonials.updateSuccess' : 'admin.testimonials.createSuccess'),
    })
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteAdminTestimonial(pendingDelete.id)
      setTestimonials((prev) => prev.filter((entry) => entry.id !== pendingDelete.id))
      setBanner({ type: 'success', message: t('admin.testimonials.deleteSuccess') })
      setPendingDelete(null)
    } catch {
      setBanner({ type: 'error', message: t('admin.testimonials.deleteError') })
      setPendingDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink-900">{t('admin.testimonials.title')}</h1>
          <p className="mt-1 text-sm text-ink-500">{t('admin.testimonials.subtitle')}</p>
        </div>
        <Button type="button" variant="primary" size="md" icon={<HiOutlinePlus />} iconPosition="start" onClick={openAddForm}>
          {t('admin.testimonials.addButton')}
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

      <TestimonialsFilters
        search={searchInput}
        onSearchChange={setSearchInput}
        rating={rating}
        onRatingChange={setRating}
        isPublished={isPublished}
        onIsPublishedChange={setIsPublished}
        hasActiveFilters={hasActiveFilters}
        onClear={clearFilters}
      />

      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
        {loading && <AsyncState status="loading" />}
        {!loading && error && <AsyncState status="error" />}
        {!loading && !error && testimonials.length === 0 && (
          <AsyncState
            status="empty"
            message={hasActiveFilters ? t('admin.testimonials.noSearchResults') : t('admin.testimonials.empty')}
            actionLabel={hasActiveFilters ? t('admin.appointments.filters.clear') : undefined}
            onAction={hasActiveFilters ? clearFilters : undefined}
          />
        )}

        {!loading && !error && testimonials.length > 0 && (
          <>
            <TestimonialsTable testimonials={testimonials} onView={setViewing} onEdit={openEditForm} onDelete={setPendingDelete} />
            <Pagination
              currentPage={result?.meta.currentPage ?? 1}
              lastPage={result?.meta.lastPage ?? 1}
              totalLabel={t('admin.testimonials.pagination.totalCount').replace('{count}', result?.meta.total ?? 0)}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <TestimonialDetailsModal item={viewing} onClose={() => setViewing(null)} />

      <TestimonialFormModal open={formOpen} item={editing} onClose={() => setFormOpen(false)} onSaved={handleSaved} />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t('admin.testimonials.deleteConfirm.title')}
        message={t('admin.testimonials.deleteConfirm.message')}
        confirmLabel={t('admin.testimonials.deleteConfirm.confirmButton')}
        cancelLabel={t('admin.testimonials.deleteConfirm.dismissButton')}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
        loading={isDeleting}
      />
    </div>
  )
}

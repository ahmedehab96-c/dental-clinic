import { useEffect, useState } from 'react'
import { HiOutlinePlus } from 'react-icons/hi2'
import Button from '@/components/ui/Button'
import AsyncState from '@/components/ui/AsyncState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Pagination from '@/components/admin/Pagination'
import BlogFilters from '@/components/admin/BlogFilters'
import BlogPostsTable from '@/components/admin/BlogPostsTable'
import BlogPostDetailsModal from '@/components/admin/BlogPostDetailsModal'
import BlogPostFormModal from '@/components/admin/BlogPostFormModal'
import { useApiData } from '@/hooks/useApiData'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { fetchAdminPosts, fetchAdminBlogCategories, deleteAdminPost } from '@/services/api/adminBlog'
import { useLanguage } from '@/context/LanguageContext'
import { usePageTitle } from '@/hooks/usePageTitle'

const PER_PAGE = 10

export default function AdminBlog() {
  const { t } = useLanguage()
  usePageTitle(t('admin.sidebar.blog'))

  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const search = useDebouncedValue(searchInput, 400)

  useEffect(() => {
    setPage(1)
  }, [category, status, search])

  const { data: result, loading, error } = useApiData(
    () => fetchAdminPosts({ page, perPage: PER_PAGE, search, category, status }),
    [page, category, status, search],
  )
  const { data: categories } = useApiData(fetchAdminBlogCategories, [])

  const [posts, setPosts] = useState([])
  useEffect(() => {
    setPosts(result?.posts ?? [])
  }, [result])

  const [viewing, setViewing] = useState(null)
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [banner, setBanner] = useState(null)

  const hasActiveFilters = Boolean(category || status || searchInput)
  const clearFilters = () => {
    setCategory('')
    setStatus('')
    setSearchInput('')
  }

  const openAddForm = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEditForm = (post) => {
    setEditing(post)
    setFormOpen(true)
  }

  const handleSaved = (saved, wasEdit) => {
    setFormOpen(false)
    setPosts((prev) =>
      wasEdit ? prev.map((entry) => (entry.id === saved.id ? saved : entry)) : [saved, ...prev],
    )
    setBanner({
      type: 'success',
      message: t(wasEdit ? 'admin.blog.updateSuccess' : 'admin.blog.createSuccess'),
    })
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteAdminPost(pendingDelete.slug)
      setPosts((prev) => prev.filter((entry) => entry.id !== pendingDelete.id))
      setBanner({ type: 'success', message: t('admin.blog.deleteSuccess') })
      setPendingDelete(null)
    } catch {
      setBanner({ type: 'error', message: t('admin.blog.deleteError') })
      setPendingDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink-900">{t('admin.blog.title')}</h1>
          <p className="mt-1 text-sm text-ink-500">{t('admin.blog.subtitle')}</p>
        </div>
        <Button type="button" variant="primary" size="md" icon={<HiOutlinePlus />} iconPosition="start" onClick={openAddForm}>
          {t('admin.blog.addButton')}
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

      <BlogFilters
        search={searchInput}
        onSearchChange={setSearchInput}
        category={category}
        onCategoryChange={setCategory}
        categories={categories ?? []}
        status={status}
        onStatusChange={setStatus}
        hasActiveFilters={hasActiveFilters}
        onClear={clearFilters}
      />

      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
        {loading && <AsyncState status="loading" />}
        {!loading && error && <AsyncState status="error" />}
        {!loading && !error && posts.length === 0 && (
          <AsyncState
            status="empty"
            message={hasActiveFilters ? t('admin.blog.noSearchResults') : t('admin.blog.empty')}
            actionLabel={hasActiveFilters ? t('admin.appointments.filters.clear') : undefined}
            onAction={hasActiveFilters ? clearFilters : undefined}
          />
        )}

        {!loading && !error && posts.length > 0 && (
          <>
            <BlogPostsTable posts={posts} onView={setViewing} onEdit={openEditForm} onDelete={setPendingDelete} />
            <Pagination
              currentPage={result?.meta.currentPage ?? 1}
              lastPage={result?.meta.lastPage ?? 1}
              totalLabel={t('admin.blog.pagination.totalCount').replace('{count}', result?.meta.total ?? 0)}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <BlogPostDetailsModal post={viewing} onClose={() => setViewing(null)} />

      <BlogPostFormModal
        open={formOpen}
        post={editing}
        categories={categories ?? []}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t('admin.blog.deleteConfirm.title')}
        message={t('admin.blog.deleteConfirm.message')}
        confirmLabel={t('admin.blog.deleteConfirm.confirmButton')}
        cancelLabel={t('admin.blog.deleteConfirm.dismissButton')}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
        loading={isDeleting}
      />
    </div>
  )
}

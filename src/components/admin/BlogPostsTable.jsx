import { HiOutlineEye, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2'
import PostStatusBadge from '@/components/admin/PostStatusBadge'
import { useLanguage } from '@/context/LanguageContext'

export default function BlogPostsTable({ posts, onView, onEdit, onDelete }) {
  const { t, tr } = useLanguage()

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[960px] text-start text-sm">
        <thead>
          <tr className="border-b border-ink-100 text-xs font-semibold text-ink-500">
            <th className="px-4 py-3 text-start">{t('admin.blog.table.image')}</th>
            <th className="px-4 py-3 text-start">{t('admin.blog.table.titleAr')}</th>
            <th className="px-4 py-3 text-start">{t('admin.blog.table.titleEn')}</th>
            <th className="px-4 py-3 text-start">{t('admin.blog.table.category')}</th>
            <th className="px-4 py-3 text-start">{t('admin.blog.table.author')}</th>
            <th className="px-4 py-3 text-start">{t('admin.blog.table.status')}</th>
            <th className="px-4 py-3 text-start">{t('admin.blog.table.publishedAt')}</th>
            <th className="px-4 py-3 text-start">{t('admin.blog.table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b border-ink-50 align-top last:border-0">
              <td className="px-4 py-3.5">
                <img src={post.image} alt="" className="h-11 w-11 rounded-xl object-cover ring-1 ring-ink-100" />
              </td>
              <td className="px-4 py-3.5 font-medium text-ink-800" dir="rtl">
                <span className="line-clamp-2 max-w-[14rem]">{post.title?.ar}</span>
              </td>
              <td className="px-4 py-3.5 font-medium text-ink-800" dir="ltr">
                <span className="line-clamp-2 max-w-[14rem]">{post.title?.en}</span>
              </td>
              <td className="px-4 py-3.5 text-ink-600">{post.category ? tr(post.category.label) : '—'}</td>
              <td className="px-4 py-3.5 text-ink-600">{post.author ? tr(post.author.name) : t('admin.blog.noAuthor')}</td>
              <td className="px-4 py-3.5">
                <PostStatusBadge status={post.status} />
              </td>
              <td className="px-4 py-3.5 text-ink-600 whitespace-nowrap">
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '—'}
              </td>
              <td className="px-4 py-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onView(post)}
                    aria-label={t('admin.appointments.actions.view')}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-200 text-ink-600 transition-colors hover:border-primary-300 hover:text-primary-700"
                  >
                    <HiOutlineEye className="text-sm" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(post)}
                    aria-label={t('admin.blog.actions.edit')}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-200 text-ink-600 transition-colors hover:border-primary-300 hover:text-primary-700"
                  >
                    <HiOutlinePencilSquare className="text-sm" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(post)}
                    aria-label={t('admin.blog.actions.delete')}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-200 text-red-600 transition-colors hover:border-red-300 hover:bg-red-50"
                  >
                    <HiOutlineTrash className="text-sm" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

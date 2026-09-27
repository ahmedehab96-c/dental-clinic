import { HiOutlineEye, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2'
import ActiveStatusBadge from '@/components/admin/ActiveStatusBadge'
import { useLanguage } from '@/context/LanguageContext'

export default function GalleryCasesTable({ cases, onView, onEdit, onDelete }) {
  const { t, tr } = useLanguage()

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] text-start text-sm">
        <thead>
          <tr className="border-b border-ink-100 text-xs font-semibold text-ink-500">
            <th className="px-4 py-3 text-start">{t('admin.gallery.table.before')}</th>
            <th className="px-4 py-3 text-start">{t('admin.gallery.table.after')}</th>
            <th className="px-4 py-3 text-start">{t('admin.gallery.table.titleAr')}</th>
            <th className="px-4 py-3 text-start">{t('admin.gallery.table.titleEn')}</th>
            <th className="px-4 py-3 text-start">{t('admin.gallery.table.service')}</th>
            <th className="px-4 py-3 text-start">{t('admin.gallery.table.status')}</th>
            <th className="px-4 py-3 text-start">{t('admin.gallery.table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((item) => (
            <tr key={item.id} className="border-b border-ink-50 align-top last:border-0">
              <td className="px-4 py-3.5">
                <img src={item.beforeImage} alt="" className="h-11 w-11 rounded-xl object-cover ring-1 ring-ink-100" />
              </td>
              <td className="px-4 py-3.5">
                <img src={item.afterImage} alt="" className="h-11 w-11 rounded-xl object-cover ring-1 ring-ink-100" />
              </td>
              <td className="px-4 py-3.5 font-medium text-ink-800" dir="rtl">
                <span className="line-clamp-2 max-w-[12rem]">{item.title?.ar}</span>
              </td>
              <td className="px-4 py-3.5 font-medium text-ink-800" dir="ltr">
                <span className="line-clamp-2 max-w-[12rem]">{item.title?.en}</span>
              </td>
              <td className="px-4 py-3.5 text-ink-600">{item.service ? tr(item.service.name) : '—'}</td>
              <td className="px-4 py-3.5">
                <ActiveStatusBadge isActive={item.isPublished} />
              </td>
              <td className="px-4 py-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onView(item)}
                    aria-label={t('admin.appointments.actions.view')}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-200 text-ink-600 transition-colors hover:border-primary-300 hover:text-primary-700"
                  >
                    <HiOutlineEye className="text-sm" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    aria-label={t('admin.gallery.actions.edit')}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-200 text-ink-600 transition-colors hover:border-primary-300 hover:text-primary-700"
                  >
                    <HiOutlinePencilSquare className="text-sm" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item)}
                    aria-label={t('admin.gallery.actions.delete')}
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

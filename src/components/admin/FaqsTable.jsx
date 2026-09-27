import { HiOutlineEye, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2'
import ActiveStatusBadge from '@/components/admin/ActiveStatusBadge'
import { useLanguage } from '@/context/LanguageContext'

export default function FaqsTable({ faqs, onView, onEdit, onDelete }) {
  const { t } = useLanguage()

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] text-start text-sm">
        <thead>
          <tr className="border-b border-ink-100 text-xs font-semibold text-ink-500">
            <th className="px-4 py-3 text-start">{t('admin.faqs.table.order')}</th>
            <th className="px-4 py-3 text-start">{t('admin.faqs.table.questionAr')}</th>
            <th className="px-4 py-3 text-start">{t('admin.faqs.table.questionEn')}</th>
            <th className="px-4 py-3 text-start">{t('admin.faqs.table.status')}</th>
            <th className="px-4 py-3 text-start">{t('admin.faqs.table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {faqs.map((item) => (
            <tr key={item.id} className="border-b border-ink-50 align-top last:border-0">
              <td className="px-4 py-3.5 text-ink-500">{item.sortOrder}</td>
              <td className="px-4 py-3.5 font-medium text-ink-800" dir="rtl">
                <span className="line-clamp-2 max-w-[18rem]">{item.question?.ar}</span>
              </td>
              <td className="px-4 py-3.5 font-medium text-ink-800" dir="ltr">
                <span className="line-clamp-2 max-w-[18rem]">{item.question?.en}</span>
              </td>
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
                    aria-label={t('admin.faqs.actions.edit')}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-200 text-ink-600 transition-colors hover:border-primary-300 hover:text-primary-700"
                  >
                    <HiOutlinePencilSquare className="text-sm" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item)}
                    aria-label={t('admin.faqs.actions.delete')}
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

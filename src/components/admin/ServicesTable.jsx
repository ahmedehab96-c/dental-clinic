import { HiOutlineEye, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2'
import ActiveStatusBadge from '@/components/admin/ActiveStatusBadge'
import { useLanguage } from '@/context/LanguageContext'

export default function ServicesTable({ services, onView, onEdit, onDelete }) {
  const { t, tr } = useLanguage()

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] text-start text-sm">
        <thead>
          <tr className="border-b border-ink-100 text-xs font-semibold text-ink-500">
            <th className="px-4 py-3 text-start">{t('admin.services.table.image')}</th>
            <th className="px-4 py-3 text-start">{t('admin.services.table.name')}</th>
            <th className="px-4 py-3 text-start">{t('admin.services.table.shortDescription')}</th>
            <th className="px-4 py-3 text-start">{t('admin.services.table.price')}</th>
            <th className="px-4 py-3 text-start">{t('admin.services.table.duration')}</th>
            <th className="px-4 py-3 text-start">{t('admin.services.table.doctors')}</th>
            <th className="px-4 py-3 text-start">{t('admin.services.table.status')}</th>
            <th className="px-4 py-3 text-start">{t('admin.services.table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id} className="border-b border-ink-50 align-top last:border-0">
              <td className="px-4 py-3.5">
                <img
                  src={service.image}
                  alt=""
                  className="h-11 w-11 rounded-xl object-cover ring-1 ring-ink-100"
                />
              </td>
              <td className="px-4 py-3.5 font-medium text-ink-800">{tr(service.name)}</td>
              <td className="px-4 py-3.5 text-ink-600">
                <span className="line-clamp-2 max-w-[16rem]">{tr(service.shortDescription)}</span>
              </td>
              <td className="px-4 py-3.5 text-ink-600 whitespace-nowrap">
                {service.priceFrom} {t('common.currency')}
              </td>
              <td className="px-4 py-3.5 text-ink-600">{tr(service.duration)}</td>
              <td className="px-4 py-3.5 text-ink-600">
                {service.doctorsCount > 0 ? (
                  service.doctorsCount
                ) : (
                  <span className="text-ink-400">{t('admin.services.noDoctors')}</span>
                )}
              </td>
              <td className="px-4 py-3.5">
                <ActiveStatusBadge isActive={service.isActive} />
              </td>
              <td className="px-4 py-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onView(service)}
                    aria-label={t('admin.appointments.actions.view')}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-200 text-ink-600 transition-colors hover:border-primary-300 hover:text-primary-700"
                  >
                    <HiOutlineEye className="text-sm" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(service)}
                    aria-label={t('admin.services.actions.edit')}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-200 text-ink-600 transition-colors hover:border-primary-300 hover:text-primary-700"
                  >
                    <HiOutlinePencilSquare className="text-sm" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(service)}
                    aria-label={t('admin.services.actions.delete')}
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

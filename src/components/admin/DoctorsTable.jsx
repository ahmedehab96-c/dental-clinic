import { HiOutlineEye, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2'
import ActiveStatusBadge from '@/components/admin/ActiveStatusBadge'
import { useLanguage } from '@/context/LanguageContext'

export default function DoctorsTable({ doctors, onView, onEdit, onDelete }) {
  const { t, tr } = useLanguage()

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] text-start text-sm">
        <thead>
          <tr className="border-b border-ink-100 text-xs font-semibold text-ink-500">
            <th className="px-4 py-3 text-start">{t('admin.doctors.table.photo')}</th>
            <th className="px-4 py-3 text-start">{t('admin.doctors.table.name')}</th>
            <th className="px-4 py-3 text-start">{t('admin.doctors.table.specialty')}</th>
            <th className="px-4 py-3 text-start">{t('admin.doctors.table.email')}</th>
            <th className="px-4 py-3 text-start">{t('admin.doctors.table.phone')}</th>
            <th className="px-4 py-3 text-start">{t('admin.doctors.table.services')}</th>
            <th className="px-4 py-3 text-start">{t('admin.doctors.table.status')}</th>
            <th className="px-4 py-3 text-start">{t('admin.doctors.table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.id} className="border-b border-ink-50 align-top last:border-0">
              <td className="px-4 py-3.5">
                <img
                  src={doctor.photo}
                  alt=""
                  className="h-11 w-11 rounded-full object-cover ring-1 ring-ink-100"
                />
              </td>
              <td className="px-4 py-3.5 font-medium text-ink-800">{tr(doctor.name)}</td>
              <td className="px-4 py-3.5 text-ink-600">{tr(doctor.specialty)}</td>
              <td className="px-4 py-3.5 text-ink-600" dir="ltr">{doctor.email || '—'}</td>
              <td className="px-4 py-3.5 text-ink-600" dir="ltr">{doctor.phone || '—'}</td>
              <td className="px-4 py-3.5 text-ink-600">
                {doctor.services.length > 0 ? (
                  <span className="line-clamp-2 max-w-[12rem]">
                    {doctor.services.map((service) => tr(service.name)).join('، ')}
                  </span>
                ) : (
                  <span className="text-ink-400">{t('admin.doctors.noServices')}</span>
                )}
              </td>
              <td className="px-4 py-3.5">
                <ActiveStatusBadge isActive={doctor.isActive} />
              </td>
              <td className="px-4 py-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onView(doctor)}
                    aria-label={t('admin.appointments.actions.view')}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-200 text-ink-600 transition-colors hover:border-primary-300 hover:text-primary-700"
                  >
                    <HiOutlineEye className="text-sm" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(doctor)}
                    aria-label={t('admin.doctors.actions.edit')}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-200 text-ink-600 transition-colors hover:border-primary-300 hover:text-primary-700"
                  >
                    <HiOutlinePencilSquare className="text-sm" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(doctor)}
                    aria-label={t('admin.doctors.actions.delete')}
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

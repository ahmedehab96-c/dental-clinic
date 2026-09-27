import { HiOutlineEye } from 'react-icons/hi2'
import StatusBadge from '@/components/ui/StatusBadge'
import AppointmentStatusActions from '@/components/admin/AppointmentStatusActions'
import { useLanguage } from '@/context/LanguageContext'
import { formatDate } from '@/utils/formatDate'

export default function AppointmentsTable({ appointments, doctorsById, servicesById, updatingId, updatingTo, onView, onChangeStatus, hideDoctor = false }) {
  const { t, tr, language } = useLanguage()

  const nameFor = (appointment) => {
    const doctor = appointment.doctor ? doctorsById[appointment.doctor.id] : null
    return doctor ? tr(doctor.name) : null
  }
  const serviceNameFor = (appointment) => {
    const service = servicesById[appointment.service?.id]
    return service ? tr(service.name) : null
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] text-start text-sm">
        <thead>
          <tr className="border-b border-ink-100 text-xs font-semibold text-ink-500">
            <th className="px-4 py-3 text-start">{t('admin.appointments.table.patient')}</th>
            <th className="px-4 py-3 text-start">{t('admin.appointments.table.phone')}</th>
            {!hideDoctor && <th className="px-4 py-3 text-start">{t('admin.appointments.table.doctor')}</th>}
            <th className="px-4 py-3 text-start">{t('admin.appointments.table.service')}</th>
            <th className="px-4 py-3 text-start">{t('admin.appointments.table.date')}</th>
            <th className="px-4 py-3 text-start">{t('admin.appointments.table.time')}</th>
            <th className="px-4 py-3 text-start">{t('admin.appointments.table.status')}</th>
            <th className="px-4 py-3 text-start">{t('admin.appointments.table.createdAt')}</th>
            <th className="px-4 py-3 text-start">{t('admin.appointments.table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id} className="border-b border-ink-50 align-top last:border-0">
              <td className="px-4 py-3.5 font-medium text-ink-800">{appointment.patient?.name}</td>
              <td className="px-4 py-3.5 text-ink-600" dir="ltr">{appointment.patient?.phone}</td>
              {!hideDoctor && (
                <td className="px-4 py-3.5 text-ink-600">{nameFor(appointment) || t('appointmentsPage.noDoctorPreference')}</td>
              )}
              <td className="px-4 py-3.5 text-ink-600">{serviceNameFor(appointment) || '—'}</td>
              <td className="px-4 py-3.5 text-ink-600">{formatDate(appointment.date, language)}</td>
              <td className="px-4 py-3.5 text-ink-600" dir="ltr">{appointment.time}</td>
              <td className="px-4 py-3.5">
                <StatusBadge status={appointment.status} />
              </td>
              <td className="px-4 py-3.5 text-ink-500">{appointment.createdAt ? formatDate(appointment.createdAt, language) : '—'}</td>
              <td className="px-4 py-3.5">
                <div className="flex flex-col items-start gap-2">
                  <button
                    type="button"
                    onClick={() => onView(appointment)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600 transition-colors hover:border-primary-300 hover:text-primary-700"
                  >
                    <HiOutlineEye className="text-sm" />
                    {t('admin.appointments.actions.view')}
                  </button>
                  <AppointmentStatusActions
                    status={appointment.status}
                    updatingTo={updatingId === appointment.id ? updatingTo : null}
                    onChangeStatus={(target) => onChangeStatus(appointment, target)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

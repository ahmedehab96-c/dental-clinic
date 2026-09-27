import AdminLayout from '@/layouts/AdminLayout'
import { doctorNavLinks } from '@/data/doctorNavLinks'

// Same dashboard shell as the admin panel, with the doctor's own navigation.
export default function DoctorLayout() {
  return <AdminLayout links={doctorNavLinks} panelLabelKey="doctorPanel.sidebar.panelLabel" basePath="/doctor" />
}

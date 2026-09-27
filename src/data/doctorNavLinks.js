import { HiOutlineSquares2X2, HiOutlineCalendarDays, HiOutlineUserCircle, HiOutlineBell } from 'react-icons/hi2'

// Doctor panel sidebar — rendered by the shared AdminSidebar. The overview
// entry keeps key 'dashboard' so the shared breadcrumbs treat it as home.
export const doctorNavLinks = [
  { key: 'dashboard', labelKey: 'doctorPanel.sidebar.overview', path: '/doctor', icon: HiOutlineSquares2X2, end: true },
  { key: 'appointments', labelKey: 'doctorPanel.sidebar.appointments', path: '/doctor/appointments', icon: HiOutlineCalendarDays },
  { key: 'profile', labelKey: 'doctorPanel.sidebar.profile', path: '/doctor/profile', icon: HiOutlineUserCircle },
  { key: 'notifications', labelKey: 'notifications.title', path: '/doctor/notifications', icon: HiOutlineBell },
]

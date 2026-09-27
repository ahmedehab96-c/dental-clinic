import {
  HiOutlineSquares2X2,
  HiOutlineCalendarDays,
  HiOutlineUserGroup,
  HiOutlineSparkles,
  HiOutlineNewspaper,
  HiOutlineChatBubbleLeftRight,
  HiOutlinePhoto,
  HiOutlineQuestionMarkCircle,
  HiOutlineCog6Tooth,
  HiOutlineUsers,
  HiOutlineBell,
} from 'react-icons/hi2'

// Sidebar structure — CRUD pages behind most of these don't exist yet
// (foundation phase only), so they resolve to the app's normal not-found
// route until built. The sidebar still lists every section up front.
export const adminNavLinks = [
  { key: 'dashboard', labelKey: 'admin.sidebar.dashboard', path: '/admin', icon: HiOutlineSquares2X2, end: true },
  { key: 'appointments', labelKey: 'admin.sidebar.appointments', path: '/admin/appointments', icon: HiOutlineCalendarDays },
  { key: 'doctors', labelKey: 'admin.sidebar.doctors', path: '/admin/doctors', icon: HiOutlineUserGroup },
  { key: 'services', labelKey: 'admin.sidebar.services', path: '/admin/services', icon: HiOutlineSparkles },
  { key: 'blog', labelKey: 'admin.sidebar.blog', path: '/admin/blog', icon: HiOutlineNewspaper },
  { key: 'testimonials', labelKey: 'admin.sidebar.testimonials', path: '/admin/testimonials', icon: HiOutlineChatBubbleLeftRight },
  { key: 'gallery', labelKey: 'admin.sidebar.gallery', path: '/admin/gallery', icon: HiOutlinePhoto },
  { key: 'faqs', labelKey: 'admin.sidebar.faqs', path: '/admin/faqs', icon: HiOutlineQuestionMarkCircle },
  { key: 'clinicSettings', labelKey: 'admin.sidebar.clinicSettings', path: '/admin/clinic-settings', icon: HiOutlineCog6Tooth },
  { key: 'users', labelKey: 'admin.sidebar.users', path: '/admin/users', icon: HiOutlineUsers },
  { key: 'notifications', labelKey: 'notifications.title', path: '/admin/notifications', icon: HiOutlineBell },
]

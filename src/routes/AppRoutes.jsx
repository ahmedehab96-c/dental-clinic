import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import AdminLayout from '@/layouts/AdminLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AdminRoute from '@/components/admin/AdminRoute'
import RoleRoute from '@/components/auth/RoleRoute'
import DoctorLayout from '@/layouts/DoctorLayout'
import Home from '@/pages/Home'

// Home loads eagerly (it's the landing route); everything else is code-split
// per route so a visitor never downloads pages they don't open.
const About = lazy(() => import('@/pages/About'))
const Services = lazy(() => import('@/pages/Services'))
const ServiceDetails = lazy(() => import('@/pages/ServiceDetails'))
const Doctors = lazy(() => import('@/pages/Doctors'))
const DoctorDetails = lazy(() => import('@/pages/DoctorDetails'))
const Gallery = lazy(() => import('@/pages/Gallery'))
const Blog = lazy(() => import('@/pages/Blog'))
const BlogDetails = lazy(() => import('@/pages/BlogDetails'))
const Contact = lazy(() => import('@/pages/Contact'))
const BookAppointment = lazy(() => import('@/pages/BookAppointment'))
const Login = lazy(() => import('@/pages/auth/Login'))
const Register = lazy(() => import('@/pages/auth/Register'))
const Dashboard = lazy(() => import('@/pages/patient/Dashboard'))
const Appointments = lazy(() => import('@/pages/patient/Appointments'))
const Profile = lazy(() => import('@/pages/patient/Profile'))
const PatientNotifications = lazy(() => import('@/pages/patient/Notifications'))
const PanelNotifications = lazy(() => import('@/pages/panel/Notifications'))
const ComingSoon = lazy(() => import('@/pages/ComingSoon'))
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'))
const AdminAppointments = lazy(() => import('@/pages/admin/Appointments'))
const AdminDoctors = lazy(() => import('@/pages/admin/Doctors'))
const AdminServices = lazy(() => import('@/pages/admin/Services'))
const AdminBlog = lazy(() => import('@/pages/admin/Blog'))
const AdminGallery = lazy(() => import('@/pages/admin/Gallery'))
const AdminTestimonials = lazy(() => import('@/pages/admin/Testimonials'))
const AdminFaqs = lazy(() => import('@/pages/admin/Faqs'))
const AdminUsers = lazy(() => import('@/pages/admin/Users'))
const AdminComingSoon = lazy(() => import('@/pages/admin/ComingSoon'))
const DoctorDashboard = lazy(() => import('@/pages/doctor/Dashboard'))
const DoctorAppointments = lazy(() => import('@/pages/doctor/Appointments'))
const DoctorProfile = lazy(() => import('@/pages/doctor/Profile'))

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/services', element: <Services /> },
      { path: '/services/:slug', element: <ServiceDetails /> },
      { path: '/doctors', element: <Doctors /> },
      { path: '/doctors/:slug', element: <DoctorDetails /> },
      { path: '/gallery', element: <Gallery /> },
      { path: '/blog', element: <Blog /> },
      { path: '/blog/:slug', element: <BlogDetails /> },
      { path: '/contact', element: <Contact /> },
      { path: '/book-appointment', element: <BookAppointment /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/appointments', element: <Appointments /> },
          { path: '/profile', element: <Profile /> },
          { path: '/notifications', element: <PatientNotifications /> },
        ],
      },
      { path: '*', element: <ComingSoon variant="notFound" /> },
    ],
  },
  {
    // Its own layout (sidebar + topbar), never the public Navbar/Footer.
    // AdminRoute is the client-side UX gate; Laravel's `role:admin`
    // middleware is the real security boundary on every request it makes.
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'appointments', element: <AdminAppointments /> },
          { path: 'doctors', element: <AdminDoctors /> },
          { path: 'services', element: <AdminServices /> },
          { path: 'blog', element: <AdminBlog /> },
          { path: 'gallery', element: <AdminGallery /> },
          { path: 'testimonials', element: <AdminTestimonials /> },
          { path: 'faqs', element: <AdminFaqs /> },
          { path: 'users', element: <AdminUsers /> },
          { path: 'notifications', element: <PanelNotifications /> },
          // Every other sidebar section — CRUD pages come in a later phase.
          { path: '*', element: <AdminComingSoon /> },
        ],
      },
    ],
  },
  {
    // Doctor panel — same dashboard shell as /admin with its own navigation.
    // RoleRoute is UX only; Laravel's `role:doctor` middleware plus per-
    // appointment ownership checks are the real boundary.
    path: '/doctor',
    element: <RoleRoute role="doctor" deniedKey="doctorPanel.accessDenied" />,
    children: [
      {
        element: <DoctorLayout />,
        children: [
          { index: true, element: <DoctorDashboard /> },
          { path: 'appointments', element: <DoctorAppointments /> },
          { path: 'profile', element: <DoctorProfile /> },
          { path: 'notifications', element: <PanelNotifications /> },
        ],
      },
    ],
  },
])

export default function AppRoutes() {
  return <RouterProvider router={router} />
}

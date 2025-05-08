import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';

// Layouts
import Layout from './_layout';
import AdminLayout from './Admin/_AdminLayout';

// Routes
import HomeRoute from './HomeRoute';
import AuthRoute from './AuthRoute';
import CalendarRoute from './Admin/CalendarRoute';
import CarsRoute from './Admin/CarsRoute';
import AppointmentsRoute from './Admin/AppointmentsRoute';
import ProfileRoute from './ProfileRoute';
import AboutRoute from './AboutRoute';
import ContactRoute from './ContactRoute';
import ServicesRoute from './ServicesRoute';

// Admin Routes
import AdminRoute from './Admin/AdminRoute';
import ErrorPage from './ErrorPage';
// Loaders
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomeRoute />,
      },
      {
        path: 'about',
        element: <AboutRoute />,
      },
      {
        path: 'contact',
        element: <ContactRoute />,
      },
      {
        path: 'services',
        element: <ServicesRoute />,
      },
      {
        path: 'profile',
        element: <ProtectedRoute element={<ProfileRoute />} allowedRoles={['user', 'admin']} />,
      },
      {
        path: 'auth',
        element: <AuthRoute />,
      },
      {
        path: 'admin',
        element: <ProtectedRoute element={<AdminLayout />} allowedRoles={['admin']} />,
        children: [
          {
            index: true,
            element: <AdminRoute />,
          },
          {
            path: 'appointments',
            element: <ProtectedRoute element={<AppointmentsRoute />} allowedRoles={['user', 'admin']} />,
          },
          {
            path: 'cars',
            element: <ProtectedRoute element={<CarsRoute />} allowedRoles={['user', 'admin']} />,
          },
          {
            path: 'calendar',
            element: <ProtectedRoute element={<CalendarRoute />} allowedRoles={['user', 'admin']} />,
          },
        ],
      },
    ],
  },
]);

import { createBrowserRouter } from 'react-router-dom';
import Layout from './_layout';
import ProtectedRoute from '@/components/ProtectedRoute';

// Routes
import HomeRoute from './HomeRoute';
import AuthRoute from './AuthRoute';
import CalendarRoute from './CalendarRoute';
import CarsRoute from './CarsRoute';
import AppointmentsRoute from './AppointmentsRoute';

// Loaders
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <h1>Error Page</h1>,
    children: [
      {
        index: true,
        element: <HomeRoute />,
      },
      {
        path: 'about',
        element: <h1>About Page</h1>,
      },
      {
        path: 'contact',
        element: <h1>Contact Page</h1>,
      },
      {
        path: 'services',
        element: <ProtectedRoute element={<h1>Services Page</h1>} allowedRoles={['user', 'admin']} />,
      },
      {
        path: 'auth',
        element: <AuthRoute />,
      },
      {
        path: 'calendar',
        element: <ProtectedRoute element={<CalendarRoute />} allowedRoles={['user', 'admin']} />,
      },
      {
        path: 'cars',
        element: <ProtectedRoute element={<CarsRoute />} allowedRoles={['user', 'admin']} />,
      },
      {
        path: 'appointments',
        element: <ProtectedRoute element={<AppointmentsRoute />} allowedRoles={['user', 'admin']} />,
      },
      {
        path: 'admin',
        element: <ProtectedRoute element={<h1>Admin Dashboard</h1>} allowedRoles={['admin']} />,
      },
    ],
  },
]);

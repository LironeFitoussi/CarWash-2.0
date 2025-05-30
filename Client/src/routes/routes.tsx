import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';

// Layouts
import Layout from './_layout';
import AdminLayout from './Admin/_AdminLayout';

// Routes
import HomeRoute from './HomeRoute';
import AuthRoute from './AuthRoute';
import ProfileRoute from './ProfileRoute';
import DashboardRoute from './DashboardRoute';
import IncomeRoute from './IncomeRoute';
import ExpensesRoute from './ExpensesRoute';
import TransactionsRoute from './TransactionsRoute';

// Admin Routes
import AdminRoute from './Admin/AdminRoute';
import ErrorPage from './ErrorPage';
import AdminCategoriesRoute from './AdminCategoriesRoute';

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
        path: 'dashboard',
        element: <ProtectedRoute element={<DashboardRoute />} allowedRoles={['user', 'admin']} />,
      },
      {
        path: 'income',
        element: <ProtectedRoute element={<IncomeRoute />} allowedRoles={['user', 'admin']} />,
      },
      {
        path: 'expenses',
        element: <ProtectedRoute element={<ExpensesRoute />} allowedRoles={['user', 'admin']} />,
      },
      {
        path: 'transactions',
        element: <ProtectedRoute element={<TransactionsRoute />} allowedRoles={['user', 'admin']} />,
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
            path: 'categories',
            element: <ProtectedRoute element={<AdminCategoriesRoute />} allowedRoles={['admin']} />,
          },
          {
            path: 'accounts',
            element: <ProtectedRoute element={<div>Accounts Management - Coming Soon</div>} allowedRoles={['admin']} />,
          },
          {
            path: 'budgets',
            element: <ProtectedRoute element={<div>Budgets Management - Coming Soon</div>} allowedRoles={['admin']} />,
          },
          {
            path: 'users',
            element: <ProtectedRoute element={<div>Users Management - Coming Soon</div>} allowedRoles={['admin']} />,
          },
          {
            path: 'analytics',
            element: <ProtectedRoute element={<div>Analytics - Coming Soon</div>} allowedRoles={['admin']} />,
          },
        ],
      },
    ],
  },
]);

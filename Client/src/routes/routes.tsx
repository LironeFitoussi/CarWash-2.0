import { createBrowserRouter } from 'react-router-dom';
import Layout from './_layout';

// Routes
import HomeRoute from './HomeRoute';
import AuthRoute from './AuthRoute';


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
        element: <h1>Services Page</h1>,
      },
      {
        path: 'auth',
        element: <AuthRoute />,
      },
    ],
  },
]);

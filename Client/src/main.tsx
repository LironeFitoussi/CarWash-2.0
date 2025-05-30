import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import './index.css';
import './i18n'; 
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';
import { Auth0Provider } from '@auth0/auth0-react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { AuthSync } from './components/AuthSync';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: 'openid profile email'
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthSync />
          <RouterProvider router={router} />
          <Toaster 
            position="top-right"
            richColors
            closeButton
          />
        </QueryClientProvider>
      </Provider>
    </Auth0Provider>
);

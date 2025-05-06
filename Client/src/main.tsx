import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';
import { Auth0Provider } from '@auth0/auth0-react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/`
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </Provider>
    </Auth0Provider>
  </React.StrictMode>,
);

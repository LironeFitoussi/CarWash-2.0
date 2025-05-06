import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserByEmail } from '@/store/slices/userSlice';
import { resetSync } from '@/store/slices/authSyncSlice';

export function AuthSync() {
  const { user, isAuthenticated, isLoading: isAuth0Loading } = useAuth();
  const dispatch = useAppDispatch();
  const syncAttempted = useRef(false);
  const { isInitialSyncComplete } = useAppSelector((state) => state.authSync);

  useEffect(() => {
    // Reset sync state when auth state changes
    if (!isAuthenticated) {
      dispatch(resetSync());
      syncAttempted.current = false;
      return;
    }

    // Don't proceed if still loading Auth0
    if (isAuth0Loading) {
      console.log('Auth0 still loading, waiting...');
      return;
    }

    // Only sync if we haven't attempted it yet and have user data
    if (!syncAttempted.current && user?.email && !isInitialSyncComplete) {
      // console.log('Starting initial sync for:', user.email);
      syncAttempted.current = true;
      dispatch(fetchUserByEmail({
        email: user.email,
        firstName: user.given_name || '',
        lastName: user.family_name || ''
      }));
    }
  }, [isAuthenticated, isAuth0Loading, user, dispatch, isInitialSyncComplete]);

  return null; // This is a utility component, it doesn't render anything
} 
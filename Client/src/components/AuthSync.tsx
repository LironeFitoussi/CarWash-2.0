import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/store/hooks';
import { fetchUserByEmail } from '@/store/slices/userSlice';

export function AuthSync() {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      // When user is authenticated, sync with our backend
      dispatch(fetchUserByEmail({
        email: user.email,
        firstName: user.given_name || '',
        lastName: user.family_name || ''
      }));
    }
  }, [isAuthenticated, user, dispatch]);

  return null; // This is a utility component, it doesn't render anything
} 
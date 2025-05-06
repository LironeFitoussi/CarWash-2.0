import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchUserByEmail, resetUser } from '../store/slices/userSlice';
import { AppDispatch } from '../store';

export const useUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user: auth0User, isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const userData = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (isAuthenticated && auth0User?.email) {
      dispatch(fetchUserByEmail(auth0User.email));
    } else if (!isAuthenticated) {
      dispatch(resetUser());
    }
  }, [isAuthenticated, auth0User?.email, dispatch]);

  return {
    isLoading: auth0Loading || userData.isLoading,
    isAuthenticated,
    user: userData,
    error: userData.error,
  };
}; 
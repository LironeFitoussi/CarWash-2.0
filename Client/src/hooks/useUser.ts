import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { fetchUserByEmail, resetUser } from '../store/slices/userSlice';

// React Query
import { useQuery } from '@tanstack/react-query';

// API
import { getUserRegex, createUser } from '@/api/userService';

// Types
import type { User, CreateUser } from '@/types';

export const useUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user: auth0User, isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const userData = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (isAuthenticated && auth0User?.email) {
      dispatch(fetchUserByEmail({
        email: auth0User.email,
        firstName: '',
        lastName: ''
      }));
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

export const useUserRegex = (regex: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users', regex],
    queryFn: () => getUserRegex(regex),
  });

  return {
    data: data as User[],
    isLoading,
    error,
  };
};

export const useUserCreate = (user: CreateUser) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: () => createUser(user),
  });
 
  return {
    data,
    isLoading,
    error,
  };
}


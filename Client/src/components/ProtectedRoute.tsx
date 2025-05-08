import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from './Atoms/LoadingSpinner';

interface ProtectedRouteProps {
  element: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, allowedRoles = [] }) => {
  const location = useLocation();
  const { role, id, isLoading: isUserLoading } = useSelector((state: RootState) => state.user);
  const { isInitialSyncComplete } = useSelector((state: RootState) => state.authSync);
  const { isLoading: isAuth0Loading, isAuthenticated } = useAuth();

  // Show loading state while either Auth0 or user data is being fetched
  if (isAuth0Loading || isUserLoading || (isAuthenticated && !isInitialSyncComplete)) {
    return <LoadingSpinner />;
  }

  // Check if user is authenticated with Auth0
  if (!isAuthenticated) {
    console.log('Not authenticated with Auth0');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check if we have user data from our backend
  if (!id || !role) {
    console.log('No user data from backend', { id, role });
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Only check roles after all loading is complete and we have user data
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    console.log('Role not allowed:', { userRole: role, allowedRoles });
    return <Navigate to="/" replace />;
  }

  // console.log('Access granted:', { userRole: role, allowedRoles });
  // If all checks pass, render the protected component
  return <>{element}</>;
};

export default ProtectedRoute; 
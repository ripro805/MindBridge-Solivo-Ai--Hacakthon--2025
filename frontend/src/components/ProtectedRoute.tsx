import { Navigate } from 'react-router-dom';
import { authAPI } from '@/services/api';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authAPI.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

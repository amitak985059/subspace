import React from 'react';
import { useAuthenticationStatus } from '@nhost/react';
import { LoadingSpinner } from './LoadingSpinner';
import { LoginForm } from './LoginForm';

interface AuthGateProps {
  children: React.ReactNode;
}

export const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuthenticationStatus();

  // Enhanced debugging
  console.log('AuthGate - Auth status:', { 
    isLoading, 
    isAuthenticated,
    timestamp: new Date().toISOString()
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <>{children}</>;
}
import React, { useEffect, useState } from 'react';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';

export const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [nhostStatus, setNhostStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check Nhost connectivity
    const checkNhostStatus = async () => {
      try {
        // Try to reach the Nhost GraphQL endpoint
        const response = await fetch(`https://tsbwjtsnekcocprbjdtr.nhost.run/v1/graphql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: '{ __typename }'
          })
        });
        
        if (response.ok) {
          setNhostStatus('online');
        } else {
          console.error('Nhost connectivity check failed with status:', response.status);
          setNhostStatus('offline');
        }
      } catch (error) {
        console.error('Nhost connectivity check failed:', error);
        setNhostStatus('offline');
      }
    };

    checkNhostStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline || nhostStatus === 'offline') {
    return (
      <div className="fixed top-20 right-4 bg-red-50 border border-red-100 rounded-lg p-4 flex items-center space-x-2 shadow-lg z-50">
        <WifiOff className="w-5 h-5text-red-500" />
        <div>
          <p className="text-red-300 font-medium text-sm">Connection Issue</p>
          <p className="text-red-600 text-xs">
            {!isOnline ? 'No internet connection' : 'Cannot reach Nhost servers'}
          </p>
        </div>
      </div>
      
    );
  }

  return null;
};
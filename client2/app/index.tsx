import React from 'react';
import { useAuth } from '../src/contexts/AuthContext';
import { router } from 'expo-router';

export default function Index() {
  const { loggedIn, loading } = useAuth();

  React.useEffect(() => {
    if (!loading) {
      if (loggedIn) {
        router.replace('/home/HomeScreen');
      } else {
        router.replace('/auth/signin');
      }
    }
  }, [loggedIn, loading]);

  // Show nothing while checking auth state and redirecting
  return null;
}

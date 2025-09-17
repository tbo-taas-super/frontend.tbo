
'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function InactivityLogout() {
  useEffect(() => {
    let lastActivity = Date.now();
     const inactivityLimit = 20 * 60 * 1000; 

    const updateActivity = () => {
      console.log('Activity detected:', Date.now()); // Debug log
      lastActivity = Date.now();
    };

    // Add event listeners for user activity
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('keypress', updateActivity);
    window.addEventListener('scroll', updateActivity);

    // Check for inactivity every 5 seconds
    const interval = setInterval(async () => {
      if (Date.now() - lastActivity > inactivityLimit) {
        try {
          console.log('Logging out due to inactivity'); // Debug log
          await signOut({ callbackUrl: '/signin' });
        } catch (error) {
          console.error('Auto-logout failed:', error);
        }
      }
    }, 5 * 1000); // Check every 5 seconds

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('keypress', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      clearInterval(interval);
    };
  }, []);

  return null; 
}

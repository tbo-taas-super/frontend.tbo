'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/@core/utils/constants';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Extract token from URL (if present)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    
    if (token) {
      // Store the token and user data
      localStorage.setItem('authToken', token);
      
      // Redirect to the stored path or home
      const preAuthPath = localStorage.getItem('preAuthPath') || '/';
      localStorage.removeItem('preAuthPath');
      router.push(preAuthPath);
    } else if (error) {
      // Handle error
      console.error('Google auth error:', error);
      router.push('/signin?error=google_auth_failed');
    } else {
      // If no token or error, try to get user data from backend
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user-me`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        // Store user data as needed
        const preAuthPath = localStorage.getItem('preAuthPath') || '/';
        localStorage.removeItem('preAuthPath');
        router.push(preAuthPath);
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      router.push('/signin?error=auth_failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>Completing authentication...</p>
        {/* You can add a spinner here */}
      </div>
    </div>
  );
}
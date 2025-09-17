'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GoogleAuthService } from '@/@core/services/user';

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      router.replace(`/signup?error=${error}`);
      return;
    }

    if (code) {
      const handleAuth = async () => {
        try {
          const { token } = await GoogleAuthService.handleCallback(code);
          localStorage.setItem('authToken', token);
          
          const returnTo = sessionStorage.getItem('preAuthRoute') || '/dashboard';
          router.replace(returnTo);
        } catch (error) {
          console.error('Authentication failed:', error);
          router.replace('/signup?error=auth_failed');
        }
      };
      handleAuth();
    } else {
      router.replace('/signup');
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-4">Authenticating...</h1>
        <p>Please wait while we verify your credentials.</p>
      </div>
    </div>
  );
}
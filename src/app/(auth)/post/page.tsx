'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PostAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');
    if (token) {
      localStorage.setItem('auth_token', token);
      router.push('/dashboard');
    } else {
      router.push('/signin');
    }
  }, []);

  return <p>Redirecting...</p>;
};

export default PostAuth;

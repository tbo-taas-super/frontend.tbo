import { cookies } from 'next/headers';

export const getAuthToken = () => {
  return cookies().get('auth_token')?.value;
};

export const setAuthToken = (token: string) => {
  cookies().set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });
};

export const removeAuthToken = () => {
  cookies().delete('auth_token');
};
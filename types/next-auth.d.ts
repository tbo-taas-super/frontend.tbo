// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: number;
    accountType: string;
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    isPasswordChange: boolean;
  }

  interface Session {
    user: {
      id: number;
      accountType: string;
      accessToken: string;
      tokenType: string;
      expiresIn: number;
      isPasswordChange: boolean;
    } & DefaultSession['user'];
  }

  interface JWT {
    id: number;
    accountType: string;
    accessToken: string;
    tokenType: string;
    expiresIn: number;
  }
}

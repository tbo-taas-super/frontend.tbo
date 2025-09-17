import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { API_BASE_URL } from "@/@core/utils/constants";

interface APIResponse {
  status: boolean;
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    name: string;
    email: string;
    account_type: string;
    isPasswordChange: boolean; // Add this field
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
    async authorize(credentials) {
      if (!credentials) {
        return null;
      }

  const res = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    body: JSON.stringify(credentials),
    headers: { 'Content-Type': 'application/json' },
  });

  const data = (await res.json()) as APIResponse;

  if (res.ok && data.status) {
    return {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      accountType: data.user.account_type,
      accessToken: data.access_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in,
      isPasswordChange: data.user.isPasswordChange, // Add this field
    };
  }

  return null;
}
    }),
  ],
  pages: {
    signIn: '/signin',
  },
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.name = user.name;
      token.email = user.email;
      token.accountType = user.accountType;
      token.accessToken = user.accessToken;
      token.tokenType = user.tokenType;
      token.expiresIn = user.expiresIn;
      token.isPasswordChange = user.isPasswordChange;
    }
    return token;
  },
  async session({ session, token }) {
    session.user.id = token.id as number;
    session.user.name = token.name as string;
    session.user.email = token.email as string;
    session.user.accountType = token.accountType as string;
    session.user.accessToken = token.accessToken as string;
    session.user.tokenType = token.tokenType as string;
    session.user.expiresIn = token.expiresIn as number;
    session.user.isPasswordChange = token.isPasswordChange as boolean;
    return session;
  },
},
  session: {
    maxAge: 20 * 60, // 20 minutes in seconds
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

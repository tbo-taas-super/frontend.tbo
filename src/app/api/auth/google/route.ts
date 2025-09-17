import { NextResponse } from 'next/server';
import { authService } from '@/@core/services/user';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    const authResponse = await authService.loginWithGoogle(token);
    return NextResponse.json(authResponse);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}
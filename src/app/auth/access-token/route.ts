// src/app/auth/access-token/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from '@auth0/nextjs-auth0/app-session';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(req, {
      audience: 'https://server.lolaprint.us/api',
    });

    if (!session?.accessToken) {
      return NextResponse.json({ error: 'No access token available' }, { status: 401 });
    }

    return NextResponse.json({ access_token: session.accessToken });
  } catch (error) {
    console.error('Access token error:', error);
    return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
  }
}

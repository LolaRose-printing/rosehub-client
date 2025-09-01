import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { cookies, headers } from 'next/headers';

export async function GET() {
  try {
    // Get the session using the cookies and headers
    const session = await getSession();
    
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: 'No access token available' },
        { status: 401 }
      );
    }

    return NextResponse.json({ access_token: session.accessToken });
  } catch (error) {
    console.error('Access token error:', error);
    return NextResponse.json(
      { error: 'Failed to get access token' },
      { status: 500 }
    );
  }
}
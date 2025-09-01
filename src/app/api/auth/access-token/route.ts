import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies(); // ✅ await here
    const tokenCookie = cookieStore.get('auth_access_token');

    if (!tokenCookie) {
      return NextResponse.json({ error: 'No access token available' }, { status: 401 });
    }

    return NextResponse.json({ access_token: tokenCookie.value });
  } catch (error) {
    console.error('Access token error:', error);
    return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function GET(request: NextRequest) {
  try {
    const cookieStore = cookies(); // ✅ remove await
    const tokenCookie = cookieStore.get('auth_access_token'); // ✅ this is correct

    if (!tokenCookie) {
      return NextResponse.json({ error: 'No access token available' }, { status: 401 });
    }

    return NextResponse.json({ 
      accessToken: tokenCookie.value // use a consistent key name
    });
  } catch (error) {
    console.error('Access token error:', error);
    return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
  }
}

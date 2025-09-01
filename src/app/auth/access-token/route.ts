import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // ✅ Await cookies() before using
    const cookieStore = await cookies();

    // Retrieve the JWT access token from cookies
    const tokenCookie = cookieStore.get('auth_access_token');

    if (!tokenCookie) {
      return NextResponse.json(
        { error: 'No access token available' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { access_token: tokenCookie.value },
      { status: 200 }
    );

  } catch (error) {
    console.error('Access token error:', error);
    return NextResponse.json(
      { error: 'Failed to get access token' },
      { status: 500 }
    );
  }
}

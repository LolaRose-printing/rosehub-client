import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Get the cookie store
    const cookieStore = cookies();
    
    // Retrieve the JWT access token from cookies
    const tokenCookie = cookieStore.get('auth_access_token');

    // If no token exists, return 401
    if (!tokenCookie) {
      return NextResponse.json(
        { error: 'No access token available' },
        { status: 401 }
      );
    }

    // Return the token in JSON format
    return NextResponse.json(
      { access_token: tokenCookie.value },
      { status: 200 }
    );

  } catch (error) {
    console.error('Access token error:', error);

    // Return a 500 error if something fails
    return NextResponse.json(
      { error: 'Failed to get access token' },
      { status: 500 }
    );
  }
}

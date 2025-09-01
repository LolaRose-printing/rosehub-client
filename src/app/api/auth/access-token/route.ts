import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('auth_access_token');
    
    if (!tokenCookie) {
      return Response.json({ error: 'No access token available' }, { status: 401 });
    }
    
    return Response.json({ 
      access_token: tokenCookie.value 
    });
  } catch (error) {
    console.error('Access token error:', error);
    return Response.json({ error: 'Failed to get access token' }, { status: 500 });
  }
}
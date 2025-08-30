// app/auth/access-token/route.ts
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get('auth_access_token');
    
    if (!tokenCookie) {
      return new Response(JSON.stringify({ error: 'No access token available' }), { status: 401 });
    }
    
    return new Response(JSON.stringify({ access_token: tokenCookie.value }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Access token error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get access token' }), { status: 500 });
  }
}

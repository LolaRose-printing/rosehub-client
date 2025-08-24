import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('auth_user');
    
    if (!userCookie) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const user = JSON.parse(userCookie.value);
    return Response.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    return Response.json({ error: 'Profile fetch failed' }, { status: 500 });
  }
}
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
    const roles = user['https://rosehub.com/roles'] || user.roles || [];
    
    // Проверяем админ роль
    if (!roles.includes('admin')) {
      return Response.json({ 
        error: 'Access denied', 
        message: 'Admin role required',
        userRoles: roles 
      }, { status: 403 });
    }
    
    return Response.json({ 
      message: 'Admin access granted',
      userRoles: roles,
      user: {
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Admin check error:', error);
    return Response.json({ error: 'Admin check failed' }, { status: 500 });
  }
}
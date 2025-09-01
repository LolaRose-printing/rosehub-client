import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const domain = process.env.AUTH0_DOMAIN;
    const clientId = process.env.AUTH0_CLIENT_ID;
    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3001';
    
    if (!domain || !clientId) {
      throw new Error('Auth0 configuration missing');
    }
    
    // Clear auth cookies
    const response = NextResponse.redirect(`https://${domain}/v2/logout?client_id=${clientId}&returnTo=${encodeURIComponent(baseUrl)}/auth`);
    
    response.cookies.delete('auth_user');
    response.cookies.delete('auth_access_token');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return Response.json({ error: 'Logout failed' }, { status: 500 });
  }
}
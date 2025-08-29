import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    
    if (error) {
      console.error('Auth0 callback error:', error);
      return NextResponse.redirect(new URL('/auth?error=' + error, request.url));
    }
    
    if (!code) {
      throw new Error('No authorization code received');
    }
    
    console.log('Attempting token exchange with:', {
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_CLIENT_ID,
      baseUrl: process.env.AUTH0_BASE_URL,
      hasClientSecret: !!process.env.AUTH0_CLIENT_SECRET
    });

    // FIX: Use AUTH0_BASE_URL instead of APP_BASE_URL
    const redirectUri = `${process.env.AUTH0_BASE_URL}/api/auth/callback`;
    console.log('Using redirect_uri:', redirectUri);

    // Exchange authorization code for tokens
    const tokenResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.AUTH0_CLIENT_ID!,
        client_secret: process.env.AUTH0_CLIENT_SECRET!,
        code: code,
        redirect_uri: redirectUri,
        audience: process.env.AUTH0_AUDIENCE || 'rosehub-api',
      }),
    });
    
    // Get detailed error information
    const responseText = await tokenResponse.text();
    console.log('Token response status:', tokenResponse.status);
    console.log('Token response text:', responseText);
    
    if (!tokenResponse.ok) {
      throw new Error(`Failed to exchange code for tokens: ${responseText}`);
    }
    
    const tokens = JSON.parse(responseText);
    console.log('Tokens received successfully');
    
    // Get user info
    const userResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });
    
    if (!userResponse.ok) {
      const userError = await userResponse.text();
      throw new Error(`Failed to get user info: ${userError}`);
    }
    
    const user = await userResponse.json();
    console.log('User info received:', user.email);
    
    // Decode ID token to get roles
    let roles = [];
    if (tokens.id_token) {
      try {
        const base64Payload = tokens.id_token.split('.')[1];
        const decodedPayload = JSON.parse(Buffer.from(base64Payload, 'base64').toString());
        roles = decodedPayload['https://rosehub.com/roles'] || [];
        console.log('Roles from ID token:', roles);
      } catch (error) {
        console.log('Failed to decode ID token for roles:', error);
      }
    }
    
    // Add roles to user object
    user['https://rosehub.com/roles'] = roles;
    
    // Temporary solution: assign admin role for specific emails
    const adminEmails = ['esemenchenko0@gmail.com'];
    if (adminEmails.includes(user.email)) {
      user['https://rosehub.com/roles'] = ['admin'];
      console.log('Assigned admin role to:', user.email);
    }
    
    // Create response and set session cookie
    const response = NextResponse.redirect(new URL('/', request.url));
    
    // Set auth cookies
    response.cookies.set('auth_user', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    response.cookies.set('auth_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in || 3600,
    });
    
    console.log('Authentication successful, redirecting to /');
    return response;
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(new URL('/auth?error=callback_failed', request.url));
  }
}

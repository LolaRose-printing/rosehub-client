import { NextRequest, NextResponse } from 'next/server';

// Decode base64 URL-safe string
function decodeBase64Url(base64Url: string) {
  base64Url = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64Url.padEnd(base64Url.length + (4 - (base64Url.length % 4)) % 4, '=');
  return atob(padded);
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error) {
      console.error('Auth0 callback error:', error);
      return NextResponse.redirect(new URL(`/auth?error=${error}`, request.url));
    }

    if (!code) {
      throw new Error('No authorization code received');
    }

    // Exchange code for tokens
    const tokenResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.AUTH0_CLIENT_ID!,
        client_secret: process.env.AUTH0_CLIENT_SECRET!,
        code: code,
        redirect_uri: process.env.AUTH0_REDIRECT_URI!,
        audience: process.env.AUTH0_AUDIENCE!,
      }),
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.error('Token exchange failed:', errText);
      throw new Error('Failed to exchange code for tokens');
    }

    const tokens = await tokenResponse.json();

    // Fetch user info
    const userResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const user = await userResponse.json();

    // Decode ID token to get roles
    let roles: string[] = [];
    if (tokens.id_token) {
      try {
        const base64Payload = tokens.id_token.split('.')[1];
        const decodedPayload = JSON.parse(decodeBase64Url(base64Payload));
        roles = decodedPayload['https://rosehub.com/roles'] || [];
      } catch (err) {
        console.log('Failed to decode ID token for roles:', err);
      }
    }

    user['https://rosehub.com/roles'] = roles;

    // Temporary admin override for specific emails
    const adminEmails = ['esemenchenko0@gmail.com'];
    if (adminEmails.includes(user.email)) {
      user['https://rosehub.com/roles'] = ['admin'];
    }

    // Set cookies and redirect to homepage
    const response = NextResponse.redirect(new URL('/', request.url));

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

    return response;
  } catch (err) {
    console.error('Callback error:', err);
    return NextResponse.redirect(new URL('/auth?error=callback_failed', request.url));
  }
}

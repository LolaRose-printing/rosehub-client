import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error) {
      console.error('Auth0 callback error:', error);
      return NextResponse.redirect(new URL(`/auth?error=${error}`, request.url));
    }

    if (!code) {
      throw new Error('No authorization code received');
    }

    const domain = process.env.AUTH0_DOMAIN!;
    const clientId = process.env.AUTH0_CLIENT_ID!;
    const clientSecret = process.env.AUTH0_CLIENT_SECRET!;
    const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE!;

    // Force production redirect or fallback to NEXT_PUBLIC_BASE_URL
    const redirectBase = process.env.NODE_ENV === 'production'
      ? 'https://client.lolaprint.us'
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    const redirectUri = `${redirectBase}/api/auth/callback`;

    // Exchange code for tokens
    const tokenResponse = await fetch(`https://${domain}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        audience,
      }),
    });

    const responseText = await tokenResponse.text();
    if (!tokenResponse.ok) throw new Error(`Token exchange failed: ${responseText}`);
    const tokens = JSON.parse(responseText);

    // Get user info
    const userResponse = await fetch(`https://${domain}/userinfo`, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userResponse.ok) throw new Error(await userResponse.text());
    const user = await userResponse.json();

    // Decode roles from ID token
    let roles: string[] = [];
    if (tokens.id_token) {
      try {
        const payload = JSON.parse(Buffer.from(tokens.id_token.split('.')[1], 'base64').toString());
        roles = payload['https://rosehub.com/roles'] || [];
      } catch (err) {
        console.warn('Failed to decode roles:', err);
      }
    }
    user['https://rosehub.com/roles'] = roles;

    // Temporary admin assignment
    if (['esemenchenko0@gmail.com'].includes(user.email)) {
      user['https://rosehub.com/roles'] = ['admin'];
    }

    // Set cookies and redirect to home
    const response = NextResponse.redirect(new URL('/', redirectBase));
    response.cookies.set('auth_user', JSON.stringify(user), {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });
    response.cookies.set('auth_access_token', tokens.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: tokens.expires_in || 3600,
    });

    return response;
  } catch (err) {
    console.error('Callback error:', err);
    const redirectBase = process.env.NODE_ENV === 'production'
      ? 'https://client.lolaprint.us'
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    return NextResponse.redirect(new URL('/auth?error=callback_failed', redirectBase));
  }
}

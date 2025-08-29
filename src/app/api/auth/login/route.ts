import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      throw new Error(`Auth0 callback error: ${error}`);
    }

    if (!code) {
      throw new Error('No authorization code received');
    }

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
        redirect_uri: `${process.env.AUTH0_BASE_URL}/api/auth/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      throw new Error(`Token exchange failed: ${errorData}`);
    }

    const tokens = await tokenResponse.json();

    // Redirect to success page or set cookies
    return NextResponse.redirect(`${process.env.AUTH0_BASE_URL}/auth/success`);

  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(`${process.env.AUTH0_BASE_URL}/auth?error=callback_failed`);
  }
}

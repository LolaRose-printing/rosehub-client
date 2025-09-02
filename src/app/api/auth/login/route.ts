import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const domain = process.env.AUTH0_DOMAIN;
    const clientId = process.env.AUTH0_CLIENT_ID;
    const redirectUri = process.env.AUTH0_REDIRECT_URI;
    const audience = process.env.AUTH0_AUDIENCE;
    const scope = process.env.AUTH0_SCOPE;

    if (!domain || !clientId || !redirectUri || !audience) {
      throw new Error('Auth0 configuration missing');
    }

    const state = generateRandomString(32);
    const nonce = generateRandomString(32);

    const loginUrl = `https://${domain}/authorize?` + new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope,
      audience,
      state,
      nonce
    }).toString();

    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ error: 'Login failed' }, { status: 500 });
  }
}

function generateRandomString(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

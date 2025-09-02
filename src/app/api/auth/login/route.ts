import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const domain = process.env.AUTH0_ISSUER_BASE_URL;
    const clientId = process.env.AUTH0_CLIENT_ID;
    const baseUrl = process.env.APP_BASE_URL; // 🔥 FIXED here
    const audience = process.env.AUTH0_AUDIENCE;

    if (!domain || !clientId || !baseUrl) {
      throw new Error('Auth0 configuration missing');
    }

    // Generate state and nonce for security
    const state = generateRandomString(32);
    const nonce = generateRandomString(32);

    const loginUrl =
      `${domain}/authorize?` +
      new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: `${baseUrl}/api/auth/callback`,
        scope: process.env.AUTH0_SCOPE || 'openid profile email',
        audience: audience || '',
        state,
        nonce,
      }).toString();

    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

function generateRandomString(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('');
}

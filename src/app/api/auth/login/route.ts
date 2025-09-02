export async function GET(request: NextRequest) {
  try {
    // Server-side variables (no NEXT_PUBLIC_)
    const domain = process.env.AUTH0_DOMAIN;
    const clientId = process.env.AUTH0_CLIENT_ID;
    const audience = process.env.AUTH0_AUDIENCE;
    const baseUrl = process.env.APP_BASE_URL;

    console.log("AUTH0_DOMAIN:", domain);
    console.log("AUTH0_CLIENT_ID:", clientId);
    console.log("APP_BASE_URL:", baseUrl);

    if (!domain || !clientId || !baseUrl) {
      throw new Error('Auth0 configuration missing');
    }

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

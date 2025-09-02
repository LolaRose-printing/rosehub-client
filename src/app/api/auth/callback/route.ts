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
        redirect_uri: `${process.env.APP_BASE_URL}/api/auth/callback`,
        audience: 'rosehub-api',
      }),
    });
    
    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens');
    }
    
    const tokens = await tokenResponse.json();
    
    // Get user info
    const userResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });
    
    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }
    
    const user = await userResponse.json();
    
    // Decode ID token to get roles
    let roles = [];
    if (tokens.id_token) {
      try {
        const base64Payload = tokens.id_token.split('.')[1];
        const decodedPayload = JSON.parse(atob(base64Payload));
        roles = decodedPayload['https://rosehub.com/roles'] || [];
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
    
    return response;
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(new URL('/auth?error=callback_failed', request.url));
  }
}import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    
    if (error) {
      console.error('Auth0 callback error:', error);
      return NextResponse.redirect(new URL('/auth?error=' + error, process.env.APP_BASE_URL));
    }
    
    if (!code) {
      throw new Error('No authorization code received');
    }
    
    // Validate state parameter (important for security)
    const storedState = request.cookies.get('auth_state')?.value;
    if (!storedState || storedState !== state) {
      throw new Error('Invalid state parameter');
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
        redirect_uri: `${process.env.APP_BASE_URL}/api/auth/callback`,
        audience: process.env.AUTH0_AUDIENCE!,  // ✅ Use environment variable
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', tokenResponse.status, errorText);
      throw new Error('Failed to exchange code for tokens');
    }
    
    const tokens = await tokenResponse.json();
    
    // Get user info
    const userResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });
    
    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }
    
    const user = await userResponse.json();
    
    // Decode ID token to get roles
    let roles = [];
    if (tokens.id_token) {
      try {
        const base64Payload = tokens.id_token.split('.')[1];
        const decodedPayload = JSON.parse(Buffer.from(base64Payload, 'base64').toString());
        roles = decodedPayload['https://rosehub.com/roles'] || [];
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
    }
    
    // Create response and set session cookie
    const response = NextResponse.redirect(new URL('/', process.env.APP_BASE_URL!));
    
    // Set auth cookies
    response.cookies.set('auth_user', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    response.cookies.set('auth_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in || 3600,
      path: '/',
    });
    
    // Clear the state cookie
    response.cookies.delete('auth_state');
    response.cookies.delete('auth_nonce');
    
    return response;
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(new URL('/auth?error=callback_failed', process.env.APP_BASE_URL!));
  }
}
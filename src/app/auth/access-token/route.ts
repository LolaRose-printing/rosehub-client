import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Create a new request with the full URL
    const url = new URL(req.url);
    const fullUrl = `${url.origin}/auth/access-token`;
    const newReq = new Request(fullUrl, {
      headers: req.headers,
      method: 'GET',
    });

    const { accessToken } = await getAccessToken(newReq);

    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token available' },
        { status: 401 }
      );
    }

    return NextResponse.json({ access_token: accessToken });
  } catch (error) {
    console.error('Access token error:', error);
    return NextResponse.json(
      { error: 'Failed to get access token' },
      { status: 500 }
    );
  }
}
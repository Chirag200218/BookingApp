// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import path from 'path';

export async function middleware(req: NextRequest) {
    const { pathname } = new URL(req.url);

    // Check if the request is a POST request to /api/bookseats
  if (pathname === '/api/bookSeats' && (req.method === 'POST' || req.method === 'PATCH')) {
    let token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Please Login into application' }, { status: 401 });
    }
  
    try {
      // Verify the token
      // Decode the token using the JWT secret key
      if (token.startsWith('Bearer')) {
          token = token.replace('Bearer ', '')
      }
      const secret = new TextEncoder().encode(process.env.JWT_SECRET); // Convert secret to a format that jose can handle
      const { payload } = await jwtVerify(token, secret);

      // Attach the user to the request
      //@ts-ignore
      req['user'] = payload;
  
      // Proceed to the next middleware or the API route handler
      return NextResponse.next();
    } catch (error) {
      console.error('Error verifying token:', error);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
  }

  return NextResponse.next();
}
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    // Return a NextResponse with a message and status code
     let token = req.cookies.get('auth_token')?.value;
        if (!token) {
          return NextResponse.json({ error: 'Please Login into application' }, { status: 401 });
        }
        try {
          // Verify the token
          if (token.startsWith('Bearer')) {
              token = token.replace('Bearer ', '')
          }
          const secret = new TextEncoder().encode(process.env.JWT_SECRET); // Convert secret to a format that jose can handle
          const { payload } = await jwtVerify(token, secret);
    
          // Attach the user to the request
          //@ts-ignore
          req['user'] = payload;
      
          // Proceed to the next middleware or the API route handler
          return NextResponse.json({ data: "User authenticated" }, { status: 200 });
        } catch (error) {
          console.error('Error verifying token:', error);
          return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
        }
    
}

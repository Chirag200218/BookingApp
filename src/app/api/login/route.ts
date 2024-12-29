import bcrypt from 'bcryptjs'; // To hash the password securely
import jwt from 'jsonwebtoken'; // For creating the JWT token
import { db } from '../../../../lib/prisma'; // Assuming you have a Prisma client to handle user lookup
import { NextResponse } from 'next/server'; // To handle response in Next.js API

// Define the expected shape of the request body for the login
interface LoginRequestBody {
  email: string;
  password: string;
}

// Define the type for the user object
interface User {
  id: number;
  email: string;
  password: string;
  name: string;
}

export async function POST(req: Request, res: Response) {
    const body = await req.json();
    const { email, password }: LoginRequestBody = body;

    // Input validation: Check if both email and password are provided
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: 'Email and password are required' }),
        { status: 400 }
      );
    }

    try {
      // Find the user by email from the database
      const user: User | null = await db.user.findUnique({
        where: { email },
      });

      if (!user) {
        return new Response(
          JSON.stringify({  message: 'User not found' }),
          { status: 404 }
        );
      }

      // Compare the provided password with the hashed password stored in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return new Response(
          JSON.stringify({  message: 'Invalid credentials' }),
          { status: 401 }
        );
        
      }

      // Create a JWT token with the user information (excluding the password)
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!, // The JWT secret must be defined in your environment variables
        { expiresIn: '1h' } // Set token expiration to 1 hour
      );


       // Set the JWT token as an HTTP-only cookie
      const response = NextResponse.json({ message: 'Login successful', name: user.name, email: user.email });
      response.cookies.set('auth_token', token, {
        httpOnly: true, // Ensures the cookie can't be accessed via JavaScript
        secure: process.env.NODE_ENV === 'production', // Ensure the cookie is only sent over HTTPS in production
        maxAge: 3600, // Cookie expiration time (1 hour)
        path: '/', // The cookie will be available for the entire domain
        sameSite: 'strict', // Restricts the cookie to same-site requests
      });


      return  response
    } catch (error) {
      console.error(error);
      return new Response(
        JSON.stringify({  message: 'Internal server error', error }),
        { status: 500 }
      );
    }  
}
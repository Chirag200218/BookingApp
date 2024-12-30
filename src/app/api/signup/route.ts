import { NextApiRequest, NextApiResponse } from 'next'; // For type-safe request and response
import bcrypt from 'bcryptjs'; // To hash the password securely
import { db } from '../../../../lib/prisma'; // Assuming you have a Prisma client to handle user creation

// Define the expected body type for the POST request
interface SignupRequestBody {
  email: string;
  password: string;
  fullName: string;
}

export async function POST(req: Request) {
    const body = await req.json();
    const { email, password, fullName }: SignupRequestBody = body;
    // Basic input validation
    if (!email || !password || !fullName) {
      return new Response(
        JSON.stringify({ message: 'All fields are required' }),
        { status: 400 }
      );
    }

    try {
      // Check if the email already exists in the database
      const userExists = await db.user.findUnique({
        where: { email },
      });

      if (userExists) {
        return new Response(
          JSON.stringify({  message: 'Email already exists' }),
          { status: 400 }
        );
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Save the new user to the database
      const newUser = await db.user.create({
        data: {
          email,
          password: hashedPassword,
          name:fullName
        }
      });

      // Return success response
      return new Response(
        JSON.stringify({  message: 'User created successfully', user: newUser }),
        { status: 201 }
      );
    } catch (error) {
      console.log(error)
      return new Response(
        JSON.stringify({  message: 'Something went wrong', error }),
        { status: 500 }
      );
    }
  
}

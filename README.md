# Booking App

## Overview

The **Booking App** is a web-based application designed to allow users to easily book seats for events or other reserved spaces. It features an intuitive user interface where users can select available seats, make bookings, and view their reserved seats.

The app also includes user authentication with secure login functionality, leveraging **JWT (JSON Web Tokens)** for session management, allowing users to stay logged in across page reloads.

## Features

- **User Authentication:** 
  - Users can log in securely with their email and password.
  - JWT tokens are used for secure session management.
  
- **Seat Booking:** 
  - Users can view available seats and reserve them in real-time.
  
- **Real-Time Updates:** 
  - Seat availability is updated dynamically as users reserve seats.
  
- **Responsive Design:** 
  - The app is fully responsive, making it accessible on both mobile and desktop devices.
  
- **Cookie Management:** 
  - The app uses HTTP-only cookies to securely store the JWT token.
  
- **Error Handling:** 
  - Users receive clear error messages for invalid credentials or booking attempts.

## Tech Stack

### Frontend:
- **React.js (Next.js 14)**: Used for building the user interface and server-side logic.
- **TailwindCSS**: For styling the application, providing a responsive and customizable design.
- **SWR**: For data fetching and handling real-time updates.

### Backend:
- **Node.js**: Server-side environment for handling API requests and business logic.
- **Next.js API Routes**: For creating API endpoints directly within the Next.js framework.
- **Prisma ORM**: For interacting with the database in a type-safe manner.
- **bcryptjs**: For securely hashing passwords before storing them in the database.
- **JWT (JSON Web Tokens)**: For secure user authentication and managing sessions.

### Database:
- **PostgreSQL**: The database used for storing user data and booking information.
- **Prisma ORM**: Used for database interactions with PostgreSQL.


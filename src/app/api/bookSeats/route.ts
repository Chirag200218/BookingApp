// /app/api/bookSeats/route.ts

import { NextResponse } from 'next/server';
import { db } from '../../../../lib/prisma'; // Import Prisma client

interface Seat {
  id: number;            // The unique identifier for the seat
  reserved: boolean;     // Whether the seat is reserved or not
  userEmail: string | null; // The email of the user who reserved the seat, or null if not reserved
  row: number;           // The row number where the seat is located
}

export async function GET() {
    try {
      // Fetch seats sorted by ID, assuming `row` and `reserved` are already set in the DB
      let seats:Seat[] = await db.seats.findMany({
        orderBy: { id: 'asc' },
      });
      
      let availableSeats = seats.filter(seat => !seat.reserved);
      
      return NextResponse.json({
        seats,
        availableSeats: availableSeats.length,
        bookedSeats: seats.length - availableSeats.length,
      });
    } catch (error) {
      console.error('Error fetching seat details:', error);
      return NextResponse.json({ error: 'Failed to fetch seats' }, { status: 500 });
    }
}


// Define the handler for POST requests to book seats
export async function POST(req: Request) {
  try {
    const { seats, email } = await req.json(); // Parse the incoming JSON body

    if (!seats || seats.length === 0) {
      return NextResponse.json({ error: 'No seats provided' }, { status: 400 });
    }

      let remainingSeatsToBook = seats;
         let totalSeats:Seat[] = await await db.seats.findMany({
             orderBy: {
               id: 'asc', // This will sort the results by `id` in ascending order
             },
         });
          
         let unreservedSeats = [];
         for (let i = 0; i < totalSeats.length; i++) {
           if (!totalSeats[i].reserved) {
             unreservedSeats.push(i);
           }
         }
         if(unreservedSeats.length<remainingSeatsToBook){
          return NextResponse.json({ error: 'Not enough seats available' }, { status: 400 });
         }
         let bookedTickets =[];
     
         for (let row = 0; row <=11; row++) {
             
             const rowSeats = totalSeats.filter(seat => seat.row === (row===0?12:row) && seat.reserved==false);
             if (rowSeats.length >= remainingSeatsToBook) {
                 // Enough seats available in this row, book them
                 
                for (let i = 0; i < 7 && remainingSeatsToBook > 0; i++) {
                    if (!rowSeats[i].reserved) {
                    rowSeats[i].reserved = true;
                    bookedTickets.push(rowSeats[i]);
                    remainingSeatsToBook--;
                    }
                }
                if (remainingSeatsToBook === 0) break;
             }
         }
     
         
         if(remainingSeatsToBook!=0){
             let startingSeat = findSeatsWithMinimumGap(totalSeats,remainingSeatsToBook);
             if(startingSeat!=null){
                 for (let i = startingSeat; i < totalSeats.length && remainingSeatsToBook>0; i++) {
                     if(totalSeats[i].reserved==false){
                         totalSeats[i].reserved = true;
                         bookedTickets.push(totalSeats[i]);
                         remainingSeatsToBook--;
                     }
                 }
             }
         }
     
        try {
            const updatedSeats = await db.seats.updateMany({
              where: {
                id: {
                  in: bookedTickets.map(ticket => ticket.id), // Find by array of IDs
                },
              },
              data: {
                reserved: true, // Set reserved to true
                userEmail: email, // Set userEmail to the provided email
              },
            });
        
          } catch (error) {
            console.error('Error updating seats:', error);
          }

    return NextResponse.json({ message: 'Seats booked successfully', bookedSeats: bookedTickets });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: 'Failed to book seats', details: error }, { status: 500 });
  }
}

// Define the PATCH method for resetting the seat's userEmail and reserved status
export async function PATCH(req: Request) {
    try {
      
      const seatIds = [...await db.seats.findMany({
        where: {
          reserved: true, // Filter to get unreserved seats
        },
        orderBy: {
          id: 'asc', // Optional: Order the results by ID in ascending order (or by any other field you prefer)
        },
      })].map((seatDetails)=>{
        return seatDetails.id;
      });
      console.log(seatIds)
      // Update the seats: reset reserved to false and userEmail to null
       await db.seats.updateMany({
        where: {
          id: { in: seatIds }, // Update only seats with the provided IDs
        },
        data: {
          reserved: false,  // Reset reserved status to false
          userEmail: null,  // Reset userEmail to null
        },
      });
  
      return NextResponse.json({ message: 'Seats have been reset successfully' });
    } catch (error) {
      console.error('Error resetting seats:', error);
      return NextResponse.json({ error: 'Failed to reset seats', details: error }, { status: 500 });
    }
}

// Function to find the seats with minimum gap
function findSeatsWithMinimumGap(seats:any, k:any) {
    let n = seats.length;
  
    // Step 1: Find all unreserved seats
    let unreservedSeats = [];
    for (let i = 0; i < n; i++) {
      if (!seats[i].reserved) {
        unreservedSeats.push(i);
      }
    }
  
    // If there are fewer than k unreserved seats, return null
    if (unreservedSeats.length < k) {
      return null;
    }
  
    // Step 2: Sliding Window to find the block of k seats with minimum gap
    let minGap = Infinity;
    let bestStartIndex = -1;
  
    // Sliding window through unreserved seats array
    for (let i = 0; i <= unreservedSeats.length - k; i++) {
      let currentSeats = unreservedSeats.slice(i, i + k);
      let maxGap = 0;
  
      // Calculate the gaps between consecutive seats
      for (let j = 0; j < currentSeats.length - 1; j++) {
        maxGap = Math.max(maxGap, currentSeats[j + 1] - currentSeats[j]);
      }
  
      // Update if we found a smaller gap
      if (maxGap < minGap) {
        minGap = maxGap;
        bestStartIndex = currentSeats[0];
      }
    }
  
    // Return the starting index of the best block of k seats with minimum gap
    return bestStartIndex;
}
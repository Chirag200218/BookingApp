"use client";
import React from "react";
import useTicketWindow from "../hooks/useTicketWindow";
import { useUserContext } from "../context/userContext";
const TicketWindow = () => {
  const { seats, availableSeats, bookedSeats } = useTicketWindow();
  const { user } = useUserContext();
  return (
    <div className="h-full w-full max-w-[40rem] px-4">
      <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-semibold my-4">
        Ticket Window
      </h2>

      <div className="grid grid-cols-7 gap-4 sm:grid-cols-7 md:grid-cols-7 lg:grid-cols-7 max-w-full p-3 bg-white">
        {seats.length > 0 ? (
          seats.map((seatDetails: any, index: number) => (
            <div
              key={`${seatDetails.id}`}
              className={`flex items-center justify-center text-white text-xs sm:text-sm md:text-base font-bold rounded-lg h-12 ${
                seatDetails.reserved
                  ? seatDetails.userEmail === user?.email
                    ? "bg-orange-500"
                    : "bg-yellow-500"
                  : "bg-green-500"
              }`}
            >
              {seatDetails.id}
            </div>
          ))
        ) : (
          <div className="text-center">Loading...</div>
        )}
      </div>

      <div className="w-full h-10 flex items-center justify-center mt-4 gap-1 md:gap-4">
        <p className="bg-yellow-500 p-2 w-1/3 h-full my-2 text-xs md:text-sm font-semibold rounded-md flex items-center justify-center">
          Total Booked: {bookedSeats.length}
        </p>
        <p className="bg-orange-500 p-2 w-1/3 h-full my-2 text-xs md:text-sm font-semibold rounded-md flex items-center justify-center">
          Booked by you:
          {
            bookedSeats.filter((seat: any) => seat.userEmail === user?.email)
              .length
          }
        </p>
        <p className="bg-green-500 p-2 w-1/3 h-full my-2 text-xs md:text-sm font-semibold rounded-md flex items-center justify-center">
          Available: {availableSeats.length}
        </p>
      </div>
    </div>
  );
};

export default TicketWindow;

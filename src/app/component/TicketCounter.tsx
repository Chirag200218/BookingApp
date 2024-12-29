"use client";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { mutate } from "swr";
import { useUserContext } from "../context/userContext";

const TicketCounter = () => {
  const { user } = useUserContext(); // Access the user from context
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookedSeats, setBookedSeats] = useState([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numberOfSeats = parseInt(inputValue, 10);

    // Validate input: Check if the number is between 1 and 7
    if (isNaN(numberOfSeats) || numberOfSeats < 1 || numberOfSeats > 7) {
      toast.error(
        "Please enter a valid number. You can book at most 7 seats at a time."
      );
      return; // Prevent booking if the input is invalid
    }

    try {
      setLoading(true);
      // Send the seat numbers to the new API route for booking seats
      const response = await fetch("/api/bookSeats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ seats: numberOfSeats, email: user?.email }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        mutate("/api/bookSeats");
        toast.success(data.message); // Show success message
        setBookedSeats(data.bookedSeats); // Update the booked seats state
      } else {
        toast.error(data.error); // Show error message if booking fails
      }
      setInputValue(""); // Reset the input field after submission
      setLoading(false);
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/bookSeats", {
        method: "PATCH", // Use PATCH method for partial updates
        headers: {
          "Content-Type": "application/json", // Specify that you're sending JSON data
        },
        credentials: "include", // Include credentials for the request
      });

      // Check if the response is successful
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error); // Show error message if the request fails
        setLoading(false);
        return;
      }
      mutate("/api/bookSeats");
      setLoading(false);
      // Optionally, handle the response data if needed
      toast.success("Seats have been reset successfully");
    } catch (error) {
      console.error("Error resetting seats:", error);
    }
  };

  return (
    <>
      <div className="h-full w-11/12 max-w-[32rem] border-2 border-red p-4">
        <div className="flex items-center space-x-2 py-3">
          <p className="font-semibold">
            {bookedSeats.length > 0 ? "Booked Seats" : "Book Seats"}
          </p>
          {bookedSeats.map((seats: any) => {
            return (
              <div
                key={seats.id}
                className="bg-yellow-400 text-white px-3 py-2 rounded-lg"
              >
                {seats.id}
              </div>
            );
          })}
          {/* <div className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"></div> */}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="border border-gray-300 px-4 py-2 w-full rounded-lg"
              placeholder="Enter number of seats"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg transform transition duration-200 ease-in-out active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Submit
            </button>
          </div>

          {/* Reset button */}
          <div className="flex justify-start">
            <button
              type="button"
              onClick={handleReset}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg w-full transform transition duration-200 ease-in-out active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Reset booking
            </button>
          </div>
        </form>
      </div>
      <ToastContainer autoClose={2000} />
    </>
  );
};

export default TicketCounter;

"use client";
import useSWR from "swr";

// The fetch function to be used by SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function useTicketWindow() {
  // Use SWR to fetch the data from your API
  const { data, error } = useSWR("/api/bookSeats", fetcher);

  // If the request fails, we handle it here
  if (error) {
    console.error("Failed to fetch ticket window data:", error);
    return {
      seats: [],
      availableSeats: [],
      bookedSeats: [],
    };
  }

  // If no data is available yet, we return default values while loading
  if (!data) {
    return {
      seats: [],
      availableSeats: [],
      bookedSeats: [],
    };
  }

  // Return the fetched data
  return {
    seats: data.seats,
    availableSeats: data.availableSeats,
    bookedSeats: data.bookedSeats,
  };
}

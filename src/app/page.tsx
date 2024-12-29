"use client";
import useSWR from "swr";
import Header from "./component/Header";
import TicketCounter from "./component/TicketCounter";
import TicketWindow from "./component/TicketWindow";
import { useEffect } from "react";

// Create a fetcher function for useSWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const res = useSWR("/api/verify", fetcher);
  useEffect(() => {
    if (res.error) {
      localStorage.removeItem("user");
    }
  }, [res]);

  return (
    <div className="h-full max-w-screen bg-blue-50">
      <Header />
      <div
        id="container"
        className="min-h-screen h-full w-full flex flex-col gap-8 lg:flex-row lg:gap-4 justify-evenly items-center py-4"
      >
        <TicketWindow />
        <TicketCounter />
      </div>
    </div>
  );
}

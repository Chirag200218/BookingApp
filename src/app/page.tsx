"use client";
import useSWR from "swr";
import Header from "./component/Header";
import TicketCounter from "./component/TicketCounter";
import TicketWindow from "./component/TicketWindow";

export default function Home() {
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

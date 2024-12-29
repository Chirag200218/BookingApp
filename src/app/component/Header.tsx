"use client";
import Image from "next/image";
import React from "react";
import { useUserContext } from "../context/userContext";
import Link from "next/link";

const Header = () => {
  const { user } = useUserContext(); // Access the user from context

  return (
    <div className="h-12 w-full flex items-center justify-between shadow-lg border-b-1 border-gray-50">
      <h1 className="text-black text-lg sm:text-2xl md:text-3xl font-semibold my-4 px-4">
        Booking App
      </h1>
      <div className="flex items-center space-x-2 px-4">
        <Image src="/user.png" alt="userImage" height={24} width={24} />
        {user == null ? (
          <Link className="text-blue-600 font-bold" href="/login">
            Login
          </Link>
        ) : (
          <p className="text-black">{user.name}</p>
        )}
      </div>
    </div>
  );
};

export default Header;

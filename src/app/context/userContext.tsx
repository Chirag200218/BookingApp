"use client";
import { useRouter } from "next/navigation";
// context/UserContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import useSWR from "swr";

// Define the user type
interface User {
  name: string;
  email: string;
}

// Create the context with a default value of `null` (no user logged in)
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

// Create a fetcher function for useSWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const res = useSWR("/api/verify", fetcher);
  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    if (!userInfo || res.error) {
      // If no token or user info in local storage, clear the local storage
      localStorage.removeItem("user");
    } else {
      // Sync user data with local storage
      setUser(JSON.parse(userInfo)); // Assuming you're using useContext or local state
    }
  }, [res]);

  useEffect(() => {
    // Save user info to localStorage whenever it changes
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts != null && parts.length === 2)
    return parts?.pop()?.split(";").shift();
  return null;
}

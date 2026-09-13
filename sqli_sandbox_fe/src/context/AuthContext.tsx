"use client";
import React, { createContext, useContext, useState } from "react";

type User = { username: string; isAdmin: boolean } | null;

interface AuthContextType {
  user: User;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // IMPORTANT: Starting with 'null' guarantees the app loads logged out.
  const [user, setUser] = useState<User>(null);

  return (
    // IMPORTANT: Passing BOTH user and setUser to the provider prevents the TypeError.
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider component...");
  return context;
};

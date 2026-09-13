"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Sending the raw username input directly to the vulnerable backend endpoint
      const res = await fetch(`http://localhost:3001/users?username=${encodeURIComponent(username)}`);
      const json = await res.json();

      if (json.success && json.data && json.data.length > 0) {
        // SQLi triggers here! If the payload returns the admin user first, we are in.
        const loggedInUser = json.data[0];
        setUser({ username: loggedInUser.username, isAdmin: !!loggedInUser.isAdmin });
        setUsername("");
        setPassword("");
      } else {
        alert("Login failed: User not found.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Error connecting to backend.");
    }
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-zinc-900 text-white shadow-md">
      <div className="flex gap-6 items-center">
        <Link href="/" className="text-xl font-bold text-blue-400">PwnAcademy</Link>
        <Link href="/courses" className="hover:text-blue-300 transition">Courses</Link>
      </div>

      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span>Welcome, <strong>{user.username}</strong> {user.isAdmin && <span className="text-red-400">(Admin)</span>}</span>
            <Button variant="destructive" onClick={() => setUser(null)}>Logout</Button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="flex gap-2">
            <Input 
              placeholder="Username" 
              className="text-black bg-white"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
            <Input 
              type="password" 
              placeholder="Password" 
              className="text-black bg-white"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <Button type="submit">Login</Button>
          </form>
        )}
      </div>
    </nav>
  );
}

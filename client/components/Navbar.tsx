"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useSocket } from "../context/SocketContext";
import { useToast } from "../context/ToastContext";
import Button from "./ui/Button";

const AuthLinks = () => (
  <div className="hidden md:flex items-center space-x-4">
    <Link href="/login">
      <Button variant="ghost">Login</Button>
    </Link>
    <Link href="/signup">
      <Button>Sign Up</Button>
    </Link>
  </div>
);

const AuthenticatedNav = () => {
  const pathname = usePathname();
  const { socket } = useSocket();
  const { showToast } = useToast();

  useEffect(() => {
    if (!socket) return;

    const handleNewBooking = (data: { message: string }) => {
      console.log("New booking request received:", data);
      showToast(data.message, "info");
    };

    socket.on("newBookingRequest", handleNewBooking);

    return () => {
      socket.off("newBookingRequest", handleNewBooking);
    };
  }, [socket, showToast]);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/profile", label: "Profile" },
    { href: "/dashboard/find-mentor", label: "Find a Mentor" },
    { href: "/dashboard/my-bookings", label: "My Bookings" },
  ];

  return (
    <>
      <div className="hidden md:flex items-center space-x-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === link.href
                ? "bg-sky-100 text-sky-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="w-24">
        <Button onClick={() => signOut({ callbackUrl: "/" })}>Log Out</Button>
      </div>
    </>
  );
};

const PublicNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
      <div className="hidden md:flex items-center space-x-2">
        <Link href="/login">
          <Button variant="ghost" className="text-slate-800">
            Login
          </Button>
        </Link>
        <Link href="/signup">
          <Button>Sign Up</Button>
        </Link>
      </div>
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-slate-800 hover:text-indigo-600 focus:outline-none"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>
    </>
  );
};

export default function Navbar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-sky-600">
              SkillSync
            </Link>
          </div>
          {isAuthenticated ? <AuthenticatedNav /> : <PublicNav />}
        </div>
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useSocket } from "@/context/SocketContext";
import { useToast } from "@/context/ToastContext";
import { useEffect, useState } from "react";
import Image from "next/image";

// --- HELPER FUNCTION: getInitials ---
const getInitials = (name: string = ""): string => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const Icon = ({ d }: { d: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
  </svg>
);

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { socket } = useSocket();
  const { showToast } = useToast();
  const [newMessageBookings, setNewMessageBookings] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) return;
    const handleNotification = ({
      bookingId,
      senderName,
    }: {
      bookingId: string;
      senderName: string;
    }) => {
      if (!pathname.includes(bookingId)) {
        setNewMessageBookings((prev) => [...new Set([...prev, bookingId])]);
        showToast(`New message from ${senderName}`, "info");
      }
    };
    socket.on("newMessageNotification", handleNotification);
    return () => {
      socket.off("newMessageNotification", handleNotification);
    };
  }, [socket, showToast, pathname]);

  const mentorLinks = [
    { href: "/dashboard", label: "Overview", icon: "M9 17v-2a4 4 0 00-4-4H3" },
    {
      href: "/dashboard/my-bookings",
      label: "Bookings",
      icon: "M8 7V3m8 4V3m-9 8h10",
    },
    {
      href: "/dashboard/profile",
      label: "My Profile",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
  ];
  const menteeLinks = [
    {
      href: "/dashboard",
      label: "Home",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3",
    },
    {
      href: "/dashboard/find-mentor",
      label: "Find a Mentor",
      icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    },
    {
      href: "/dashboard/my-bookings",
      label: "My Bookings",
      icon: "M8 7V3m8 4V3m-9 8h10",
    },
    {
      href: "/dashboard/profile",
      label: "My Profile",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
  ];
  const links = session?.user?.role === "mentor" ? mentorLinks : menteeLinks;

  return (
    <div className="flex flex-col h-full bg-white shadow-md w-64">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-sky-600">SkillSync</h1>
      </div>
      <nav className="flex-grow p-4">
        {links.map((link) => {
          const hasNotification =
            link.href === "/dashboard/my-bookings" &&
            newMessageBookings.length > 0;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                if (link.href === "/dashboard/my-bookings") {
                  setNewMessageBookings([]);
                }
              }}
              className={`relative flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                pathname === link.href
                  ? "bg-sky-100 text-sky-600 font-semibold"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon d={link.icon} />
              <span>{link.label}</span>
              {hasNotification && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-sky-500 border-2 border-white"></span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          {/* --- THIS IS THE CORRECTED AVATAR LOGIC --- */}
          {(session?.user as any)?.avatar ? (
            <Image
              src={(session?.user as any).avatar}
              alt="User Avatar"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center font-bold text-sky-800 text-lg border-2 border-sky-200">
              {getInitials(session?.user?.name)}
            </div>
          )}
          <div>
            <p className="font-semibold text-slate-700 truncate">
              {session?.user?.name}
            </p>
            <p className="text-xs text-slate-500 capitalize">
              {session?.user?.role}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full mt-4 flex items-center justify-center gap-4 px-4 py-3 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          Logout
        </button>
      </div>
    </div>
  );
}

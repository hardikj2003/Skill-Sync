"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import { useToast } from "../../../context/ToastContext";
import Button from "../../../components/ui/Button";
import BookingCardSkeleton from "@/components/skeleton/BookingCardSkeleton";

// (Interfaces and helper components like formatDate, StatusBadge remain the same)
interface Booking {
  _id: string;
  mentee: { _id: string; name: string; email: string };
  mentor: { _id: string; name: string; email: string };
  sessionDate: string;
  sessionTimeSlot: string;
  status: "pending" | "confirmed" | "rejected" | "completed";
  createdAt: string;
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const StatusBadge = ({ status }: { status: Booking["status"] }) => {
  const styles = {
    pending: {
      dot: "bg-yellow-400",
      text: "text-yellow-700",
      bg: "bg-yellow-100",
    },
    confirmed: {
      dot: "bg-green-400",
      text: "text-green-700",
      bg: "bg-green-100",
    },
    rejected: { dot: "bg-red-400", text: "text-red-700", bg: "bg-red-100" },
    completed: { dot: "bg-sky-400", text: "text-sky-700", bg: "bg-sky-100" },
  };
  const currentStyle = styles[status];

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${currentStyle.bg} ${currentStyle.text}`}
    >
      <span className={`h-2 w-2 rounded-full ${currentStyle.dot}`}></span>
      <span className="capitalize">{status}</span>
    </div>
  );
};
const ActionButton = ({
  onClick,
  href,
  icon,
  tooltip,
  color,
}: {
  onClick?: () => void;
  href?: string;
  icon: React.ReactNode;
  tooltip: string;
  color: string;
}) => {
  const commonClasses = `relative group h-10 w-10 flex items-center justify-center rounded-full transition-colors ${color}`;

  const content = (
    <>
      {icon}
      <span className="absolute bottom-full mb-2 w-max bg-slate-700 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {tooltip}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={commonClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={commonClasses}>
      {content}
    </button>
  );
};

export default function MyBookingsPage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // --- REFACTORED FETCH LOGIC ---
  const fetchBookings = useCallback(async () => {
    if (session) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${session.user.token}` },
        };
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
          config
        );
        setBookings(data);
      } catch (err) {
        setError("Failed to fetch your bookings.");
        showToast("Failed to fetch your bookings.", "error");
      } finally {
        setIsLoading(false);
      }
    }
  }, [session, showToast]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // --- UPDATED STATUS HANDLER ---
  const handleUpdateStatus = async (
    bookingId: string,
    newStatus: "confirmed" | "rejected" | "completed"
  ) => {
    if (!session) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${session.user.token}` },
      };
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}`,
        { status: newStatus },
        config
      );
      showToast(`Booking status updated to ${newStatus}!`, "success");
      fetchBookings();
    } catch (err) {
      showToast(`Failed to update booking status.`, "error");
    }
  };

  // Memoize the categorized bookings (no changes here)
  const categorizedBookings = useMemo(() => {
    const pending = bookings.filter((b) => b.status === "pending");
    const upcoming = bookings.filter((b) => b.status === "confirmed");
    const past = bookings.filter(
      (b) => b.status === "completed" || b.status === "rejected"
    );
    return { pending, upcoming, past };
  }, [bookings]);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 w-1/3 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-4 w-1/2 bg-slate-200 rounded mt-4 animate-pulse"></div>
          {/* List Skeleton */}
          <div className="mt-10 space-y-4">
            <BookingCardSkeleton />
            <BookingCardSkeleton />
            <BookingCardSkeleton />
          </div>
        </div>
      </div>
    );
  }
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800">My Bookings</h1>
        <p className="text-slate-500 mt-2">Manage your mentorship sessions.</p>

        {/* Pending Requests Section (No changes) */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-slate-700">
            Pending Requests
          </h2>
          {categorizedBookings.pending.length > 0 ? (
            <div className="mt-4 grid gap-4">
              {categorizedBookings.pending.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white p-4 rounded-lg shadow border flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">
                      {session?.user.role === "mentor"
                        ? `Request from ${booking.mentee.name}`
                        : `Request to ${booking.mentor.name}`}
                    </p>
                    <p className="text-sm text-slate-500">
                      {formatDate(booking.createdAt)} at{" "}
                      {booking.sessionTimeSlot}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={booking.status} />
                    {session?.user.role === "mentor" && (
                      <div className="flex gap-2">
                        <Button
                          className="bg-green-600 hover:bg-green-700 !px-3 !py-1"
                          onClick={() =>
                            handleUpdateStatus(booking._id, "confirmed")
                          }
                        >
                          Confirm
                        </Button>
                        <Button
                          className="bg-red-600 hover:bg-red-700 !px-3 !py-1"
                          onClick={() =>
                            handleUpdateStatus(booking._id, "rejected")
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-slate-500">No pending requests.</p>
          )}
        </div>

        {/* Upcoming Sessions Section (No changes) */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-slate-700">
            Upcoming Sessions
          </h2>
          {categorizedBookings.upcoming.length > 0 ? (
            <div className="mt-4 grid gap-4">
              {categorizedBookings.upcoming.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white p-4 rounded-lg shadow border flex justify-between items-center"
                >
                  {/* ... session details ... */}
                  <div>
                    <p className="font-semibold">
                      Session with{" "}
                      {session?.user.role === "mentor"
                        ? booking.mentee.name
                        : booking.mentor.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {formatDate(booking.sessionDate)} at{" "}
                      {booking.sessionTimeSlot}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={booking.status} />
                    <ActionButton
                      href={`/dashboard/chat/${booking._id}`}
                      tooltip="Go to Chat"
                      color="bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-sky-600"
                      icon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      }
                    />
                    <ActionButton
                      onClick={() =>
                        handleUpdateStatus(booking._id, "completed")
                      }
                      tooltip="Mark as Complete"
                      color="bg-slate-100 hover:bg-green-100 text-slate-600 hover:text-green-600"
                      icon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-slate-500">No upcoming sessions.</p>
          )}
        </div>

        {/* Past Sessions Section (No changes) */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-slate-700">
            Past Sessions
          </h2>
          {categorizedBookings.past.length > 0 ? (
            <div className="mt-4 grid gap-4">
              {categorizedBookings.past.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white p-4 rounded-lg shadow border flex justify-between items-center opacity-70"
                >
                  <div>
                    <p className="font-semibold">
                      Session with{" "}
                      {session?.user.role === "mentor"
                        ? booking.mentee.name
                        : booking.mentor.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      On {formatDate(booking.sessionDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={booking.status} />
                    {/* This is the "Button Swap" logic */}
                    {booking.status === "completed" && (
                      <Link href={`/dashboard/summarize/${booking._id}`}>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 !px-3 !py-1">
                          Summarize Session
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-slate-500">No past sessions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

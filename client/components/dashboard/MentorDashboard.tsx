"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import { useToast } from "../../context/ToastContext";
import Button from "../ui/Button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Re-using the Booking type
interface Booking {
  _id: string;
  mentee: { _id: string; name: string };
  status: "pending" | "confirmed" | "rejected" | "completed";
  createdAt: string;
}

// A simple stat card component for the dashboard
const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: string;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 hover:shadow-sky-100 transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
      </div>
      <div className="bg-sky-100 text-sky-600 p-3 rounded-full">
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  </div>
);

const MentorDashboardSkeleton = () => (
  <div className="p-8 animate-pulse">
    <div className="max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="h-10 w-1/3 bg-slate-200 rounded"></div>
      <div className="h-4 w-1/2 bg-slate-200 rounded mt-4"></div>

      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="h-28 bg-slate-200 rounded-xl"></div>
        <div className="h-28 bg-slate-200 rounded-xl"></div>
        <div className="h-28 bg-slate-200 rounded-xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Chart Skeleton */}
        <div className="lg:col-span-2 h-80 bg-slate-200 rounded-xl"></div>
        {/* Requests Skeleton */}
        <div className="h-80 bg-slate-200 rounded-xl"></div>
      </div>
    </div>
  </div>
);

const weeklyData = [
  { day: "Mon", sessions: 2 },
  { day: "Tue", sessions: 1 },
  { day: "Wed", sessions: 3 },
  { day: "Thu", sessions: 0 },
  { day: "Fri", sessions: 4 },
  { day: "Sat", sessions: 1 },
  { day: "Sun", sessions: 0 },
];

export default function MentorDashboard() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
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
          showToast("Failed to load dashboard data.", "error");
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchBookings();
  }, [session, showToast]);

  const pendingRequests = bookings.filter((b) => b.status === "pending");
  const upcomingSessions = bookings.filter((b) => b.status === "confirmed");

  const handleUpdateStatus = async (
    bookingId: string,
    newStatus: "confirmed" | "rejected"
  ) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${session!.user.token}` },
      };
      const { data: updatedBooking } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}`,
        { status: newStatus },
        config
      );
      setBookings(
        bookings.map((b) => (b._id === bookingId ? updatedBooking : b))
      );
      showToast(`Booking ${newStatus} successfully!`, "success");
    } catch (err) {
      showToast(`Failed to ${newStatus} the booking.`, "error");
    }
  };

  if (isLoading) return <MentorDashboardSkeleton />;


  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800">Mentor Overview</h1>
        <p className="text-slate-500 mt-2">
          Manage your schedule, requests, and earnings.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <StatCard
            title="Pending Requests"
            value={pendingRequests.length}
            icon="🔔"
          />
          <StatCard
            title="Upcoming Sessions"
            value={upcomingSessions.length}
            icon="📅"
          />
          <StatCard title="Total Earnings" value="$0.00" icon="💰" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Weekly Activity Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">
              Weekly Activity
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={weeklyData}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#64748b" }} />
                <YAxis allowDecimals={false} tick={{ fill: "#64748b" }} />
                <Tooltip cursor={{ fill: "rgba(239, 246, 255, 0.5)" }} />
                <Bar
                  dataKey="sessions"
                  fill="#0ea5e9"
                  name="Sessions"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pending Requests Quick View */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-700">
              New Requests
            </h2>
            <div className="mt-4 space-y-4">
              {pendingRequests.length > 0 ? (
                pendingRequests.slice(0, 3).map((req) => (
                  <div
                    key={req._id}
                    className="p-3 rounded-lg border bg-slate-50"
                  >
                    <p className="text-sm">
                      Request from{" "}
                      <span className="font-semibold">{req.mentee.name}</span>
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                        onClick={() => handleUpdateStatus(req._id, "confirmed")}
                      >
                        Confirm
                      </button>
                      <button
                        className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
                        onClick={() => handleUpdateStatus(req._id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No pending requests.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useMemo } from "react";
import DashboardLoading from "@/app/dashboard/Loading";

const getSkillData = (bookings: any[]) => {
  const skillCount = new Map<string, number>();
  bookings.forEach((booking) => {
    if (booking.mentor?.expertise) {
      booking.mentor.expertise.forEach((skill: string) => {
        skillCount.set(skill, (skillCount.get(skill) || 0) + 1);
      });
    }
  });
  return Array.from(skillCount.entries()).map(([name, sessions]) => ({
    name,
    sessions,
  }));
};

interface Booking {
  _id: string;
  mentor: { _id: string; name: string; email: string };
  status: "pending" | "confirmed" | "rejected" | "completed";
  sessionDate: string;
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

export default function MenteeDashboard() {
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

  const upcomingSessions = bookings.filter((b) => b.status === "confirmed");
  const skillData = useMemo(
    () => getSkillData(bookings.filter((b) => b.status === "completed")),
    [bookings]
  );

  if (isLoading) return <DashboardLoading />;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome, {session?.user?.name}!
        </h1>
        <p className="text-slate-500 mt-2">
          Let's continue your learning journey.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Main Action Card */}
          <div className="lg:col-span-2 bg-sky-500 text-white p-8 rounded-xl shadow-lg bg-gradient-to-br from-sky-500 to-sky-600">
            <h2 className="text-3xl font-bold">Find Your Next Mentor</h2>
            <p className="mt-2 opacity-90 max-w-lg">
              Unlock new skills by connecting with our world-class experts. What
              do you want to learn today?
            </p>
            <Link href="/dashboard/find-mentor">
              <button className="mt-6 bg-white text-sky-600 font-semibold px-6 py-2 rounded-lg shadow hover:bg-slate-100 transition-colors">
                Browse Mentors
              </button>
            </Link>
          </div>

          {/* Upcoming Session Quick View */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-700">
              Next Session
            </h2>
            {upcomingSessions.length > 0 ? (
              <div className="mt-4">
                <p className="font-semibold text-slate-800">
                  {upcomingSessions[0].mentor.name}
                </p>
                <p className="text-sm text-slate-500">
                  On {formatDate(upcomingSessions[0].sessionDate)}
                </p>
                <Link href={`/dashboard/chat/${upcomingSessions[0]._id}`}>
                  <button className="w-full mt-4 text-center bg-slate-100 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">
                    Go to Chat
                  </button>
                </Link>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                No upcoming sessions. Time to book!
              </p>
            )}
          </div>
        </div>

        {/* New Feature: Skill Progress Chart */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-slate-100">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">
            Your Skill Progress
          </h2>
          {skillData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={skillData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fill: "#64748b" }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  tick={{ fill: "#64748b" }}
                />
                <Tooltip cursor={{ fill: "rgba(239, 246, 255, 0.5)" }} />
                <Bar
                  dataKey="sessions"
                  fill="#0ea5e9"
                  name="Sessions"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-500">
              Complete sessions to see your skill progress here!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

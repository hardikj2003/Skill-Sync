"use client";

import { useSession } from "next-auth/react";
import MentorDashboard from "@/components/dashboard/MentorDashboard";
import MenteeDashboard from "@/components/dashboard/MenteeDashboard";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (status === "authenticated") {
    if (session.user.role === "mentor") {
      return <MentorDashboard />;
    } else {
      return <MenteeDashboard />;
    }
  }
  return null;
}

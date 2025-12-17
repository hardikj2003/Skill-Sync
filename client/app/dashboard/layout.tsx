import React from "react";
import Sidebar from "@/components/Sidebar";
import { SocketProvider } from "@/context/SocketContext";
import { ToastProvider } from "@/context/ToastContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <SocketProvider>
        <div className="flex h-screen bg-slate-100">
          <Sidebar /> 
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </SocketProvider>
    </ToastProvider>
  );
}

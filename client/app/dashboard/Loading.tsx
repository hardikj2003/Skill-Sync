"use client";

import React from "react";
import DottedLoading from "@/components/ui/DottedLoading";

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <DottedLoading />
    </div>
  );
}

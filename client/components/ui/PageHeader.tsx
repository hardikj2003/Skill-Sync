"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4 mb-8">
      {/* The Back Button */}
      <button
        onClick={() => router.back()}
        className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-white rounded-full shadow-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        aria-label="Go back to previous page"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Title and Description */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
        {description && <p className="text-slate-500 mt-1">{description}</p>}
      </div>
    </div>
  );
};

export default PageHeader;

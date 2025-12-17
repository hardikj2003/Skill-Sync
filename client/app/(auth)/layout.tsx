import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="relative flex w-full max-w-4xl min-h-[75vh] bg-white shadow-2xl rounded-3xl overflow-hidden">
        {/* Branding Column - Redesigned */}
        <div className="hidden md:flex flex-col justify-between w-1/2 p-12 bg-slate-50 border-r border-slate-200">
          <div className="flex items-center gap-3">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-sky-500"
            >
              <path
                d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 7L12 12L22 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 12V22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xl font-bold tracking-wider text-slate-800">
              SkillSync
            </span>
          </div>
          <div>
            <h1 className="text-4xl font-bold leading-tight tracking-tighter text-slate-800">
              Unlock Your Potential.
            </h1>
            <p className="mt-4 text-lg text-slate-500">
              Connect, learn, and grow with micro-mentorship from world-class
              experts.
            </p>
          </div>
          <div className="text-sm text-slate-400">
            © {new Date().getFullYear()} SkillSync Inc. All Rights Reserved.
          </div>
        </div>

        {/* Form Column */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";

const DottedLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center space-x-2 py-10">
      <span className="loading-bounce rounded-full w-4 h-4 bg-black inline-block"></span>
      <span className="loading-bounce animate-bounce-delay-150 rounded-full w-4 h-4 bg-black inline-block"></span>
      <span className="loading-bounce animate-bounce-delay-300 rounded-full w-4 h-4 bg-black inline-block"></span>
    </div>
  );
};

export default DottedLoading;

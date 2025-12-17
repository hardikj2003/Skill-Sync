// File: client/src/components/features/MentorSearch.tsx
"use client";

import { useState, useEffect } from 'react';

type MentorSearchProps = {
  onSearch: (searchTerm: string, skillFilter: string) => void;
};

export default function MentorSearch({ onSearch }: MentorSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

  // Debounce logic: Wait 500ms after typing stops before searching
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm, skillFilter);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, skillFilter, onSearch]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Name Search Input */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-1">
            Search by Name
          </label>
          <input
            type="text"
            id="search"
            placeholder="e.g. John Doe"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Skill Filter Input */}
        <div className="flex-1">
          <label htmlFor="skill" className="block text-sm font-medium text-slate-700 mb-1">
            Filter by Skill
          </label>
          <input
            type="text"
            id="skill"
            placeholder="e.g. React, Python"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
}
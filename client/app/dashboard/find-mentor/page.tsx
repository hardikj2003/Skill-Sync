"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import MentorCard from "@/components/MentorCard";
import MentorSearch from "@/components/features/MentorSearch";
import MentorCardSkeleton from "@/components/skeleton/MentorCardSkeleton";

// Define the Mentor type
interface Mentor {
  _id: string;
  name: string;
  email: string;
  expertise: string[];
  title?: string;
  image: string;
}



// Pagination Button Component
const PaginationButton = ({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="h-10 w-10 flex items-center justify-center bg-white rounded-full shadow border border-slate-200 text-slate-500 transition-colors
                   hover:bg-slate-100 hover:text-slate-700
                   disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {children}
  </button>
);

export default function FindMentorPage() {
  const { data: session } = useSession();

  // State for data
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // State for pagination & filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchState, setSearchState] = useState("");
  const [skillState, setSkillState] = useState("");

  // The main fetch function
  const fetchMentors = useCallback(
    async (page: number, search: string, skill: string) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", "9");
        if (search) params.append("search", search);
        if (skill) params.append("skill", skill);

        const url = `${
          process.env.NEXT_PUBLIC_API_URL
        }/api/users/mentors?${params.toString()}`;

        const { data } = await axios.get(url);

        setMentors(data.mentors);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to fetch mentors. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Initial fetch on mount
  useEffect(() => {
    fetchMentors(1, "", "");
  }, [fetchMentors]);

  // --- THE FIX IS HERE ---
  // We wrap this in useCallback so the function reference stays stable.
  // This prevents the MentorSearch useEffect from triggering an infinite loop.
  const handleSearch = useCallback(
    (searchTerm: string, skillFilter: string) => {
      setSearchState(searchTerm);
      setSkillState(skillFilter);
      setCurrentPage(1);

      // We call fetchMentors directly here
      fetchMentors(1, searchTerm, skillFilter);
    },
    [fetchMentors]
  );

  // Handler for Pagination
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchMentors(newPage, searchState, skillState);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="p-8 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Find Your Mentor
          </h1>
          <p className="text-slate-500 mt-2">
            Browse our list of experts and find the perfect match for your
            learning goals.
          </p>
        </div>

        <MentorSearch onSearch={handleSearch} />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <MentorCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mt-8 text-center">
            {error}
          </div>
        ) : (
          <>
            {mentors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {mentors.map((mentor) => (
                  <MentorCard key={mentor._id} mentor={mentor} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200 mt-8 shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                  <svg
                    className="w-8 h-8 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-800">
                  No mentors found
                </h3>
                <p className="mt-1 text-slate-500 max-w-sm mx-auto">
                  We couldn't find any mentors matching "{searchState}"{" "}
                  {skillState && `with skill "${skillState}"`}.
                </p>
                <button
                  onClick={() => handleSearch("", "")}
                  className="mt-4 text-primary hover:underline font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {mentors.length > 0 && totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-6">
                <PaginationButton
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </PaginationButton>

                <div className="flex flex-col items-center">
                  <span className="text-slate-800 font-bold text-sm">
                    Page {currentPage}
                  </span>
                  <span className="text-slate-400 text-xs">
                    of {totalPages}
                  </span>
                </div>

                <PaginationButton
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </PaginationButton>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

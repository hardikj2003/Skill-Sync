"use client";

import React from "react";
import Link from "next/link";
import StarRating from "./ui/StarRating"; // Import the new component

// Define the shape of the mentor prop
interface Mentor {
  _id: string;
  name: string;
  email: string;
  expertise: string[];
  averageRating?: number; // Optional, as not all mentors may have ratings
  reviewCount?: number;   // Optional
}

interface MentorCardProps {
  mentor: Mentor;
}

const MentorCard: React.FC<MentorCardProps> = ({ mentor }) => {
  return (
    // The entire card is now a link to the mentor's detailed profile page.
    <Link
      href={`/dashboard/mentor/${mentor._id}`}
      className="block bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden group transition-all duration-300 hover:shadow-sky-100 hover:-translate-y-1"
    >
      <div className="p-6">
        <div className="flex items-center gap-4">
          {/* Avatar Placeholder */}
          <div className="flex-shrink-0 w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-2xl">
            {mentor.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
              {mentor.name}
            </h3>
            <p className="text-sm text-slate-500 mt-1">{mentor.email}</p>
            {/* --- RATING DISPLAY --- */}
            {mentor.averageRating !== undefined && mentor.reviewCount !== undefined ? (
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={mentor.averageRating} />
                <span className="text-xs text-slate-500">
                  ({mentor.reviewCount} {mentor.reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            ) : (
              <div className="mt-2">
                <p className="text-xs text-slate-400 italic">No reviews yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Expertise Badges */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">
            Expertise
          </h4>
          <div className="flex flex-wrap gap-2">
            {mentor.expertise && mentor.expertise.length > 0 ? (
              mentor.expertise.slice(0, 3).map(
                (
                  skill,
                  index // Show max 3 skills
                ) => (
                  <span
                    key={index}
                    className="inline-block bg-slate-100 text-slate-700 rounded-full px-3 py-1 text-xs font-medium"
                  >
                    {skill}
                  </span>
                )
              )
            ) : (
              <p className="text-xs text-slate-400">No expertise listed.</p>
            )}
          </div>
        </div>
      </div>
      <div className="bg-slate-50 group-hover:bg-sky-50 transition-colors text-center px-6 py-2 text-sm font-semibold text-slate-600 group-hover:text-sky-600">
        View Profile & Book
      </div>
    </Link>
  );
};

export default MentorCard;

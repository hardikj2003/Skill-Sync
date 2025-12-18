import React from "react";

interface StarRatingProps {
  rating: number;
  totalStars?: number;
}

const StarRating = ({ rating, totalStars = 5 }: StarRatingProps) => {
  const filledStars = Math.round(rating);

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const starNumber = index + 1;
        return (
          <svg
            key={starNumber}
            className={`w-5 h-5 ${
              starNumber <= filledStars ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        );
      })}
    </div>
  );
};

export default StarRating;

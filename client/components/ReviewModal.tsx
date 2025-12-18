"use client";

import { useState } from "react";
import Button from "./ui/Button";

interface Booking {
  _id: string;
  mentor: {
    name: string;
  };
}

interface ReviewModalProps {
  booking: Booking;
  onClose: () => void;
  onSubmit: (bookingId: string, rating: number, comment: string) => void;
}

const ReviewModal = ({ booking, onClose, onSubmit }: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }
    onSubmit(booking._id, rating, comment);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">
          Leave a Review for {booking.mentor.name}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">
              Your Rating
            </label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="comment"
              className="block text-lg font-medium mb-2"
            >
              Your Comment
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows={4}
              placeholder="Tell us about your experience..."
            ></textarea>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-black"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Submit Review
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;

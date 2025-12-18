"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Button from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import ProfilePageSkeleton from "@/components/skeleton/ProfilePageSkeleton";
import PageHeader from "@/components/ui/PageHeader";
import StarRating from "@/components/ui/StarRating";

// --- TYPE DEFINITIONS ---
interface Review {
  _id: string;
  mentee: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface MentorProfile {
  _id: string;
  name: string;
  email: string;
  expertise: string[];
  avatar: string;
  bio: string;
  availability: { day: string; slots: { start: string; end: string }[] }[];
  reviews: Review[];
  averageRating: number;
}

// --- HELPER FUNCTIONS & COMPONENTS ---

// Calculates the actual date for the next occurrence of a given weekday
const getNextDateForDay = (dayName: string): Date => {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const targetDay = days.indexOf(dayName.toLowerCase());

  const today = new Date();
  const currentDay = today.getDay();

  let dayDifference = targetDay - currentDay;
  if (dayDifference <= 0) {
    dayDifference += 7; // Ensures the date is always in the future
  }

  const nextDate = new Date();
  nextDate.setDate(today.getDate() + dayDifference);
  nextDate.setHours(0, 0, 0, 0); // Standardize to the start of the day

  return nextDate;
};

// A reusable loading spinner component
const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

// The redesigned, multi-state booking modal
const BookingModal = ({
  mentor,
  slot,
  day,
  onClose,
  onConfirm,
  isLoading,
  isSuccess,
}: any) => {
  const [message, setMessage] = useState("");

  const handleConfirm = () => {
    onConfirm({
      mentorId: mentor._id,
      sessionDate: day,
      sessionTimeSlot: `${slot.start} - ${slot.end}`,
      userMessage: message,
    });
  };

  return (
    <div className="fixed inset-0 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md transform transition-all">
        {isSuccess ? (
          // --- SUCCESS STATE ---
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mt-4">
              Request Sent!
            </h2>
            <p className="text-slate-600 mt-2">
              Your session request has been sent to {mentor.name}. You'll be
              notified when they respond.
            </p>
            <div className="mt-6">
              <Button onClick={onClose}>Done</Button>
            </div>
          </div>
        ) : (
          // --- DEFAULT & LOADING STATE ---
          <>
            <h2 className="text-2xl font-bold text-slate-800">
              Confirm Booking
            </h2>
            <p className="text-slate-600 mt-2">
              You are booking a session with{" "}
              <span className="font-semibold">{mentor.name}</span>.
            </p>
            <div className="mt-4 bg-slate-100 p-4 rounded-md">
              <p>
                <strong>Day:</strong> {day}
              </p>
              <p>
                <strong>Time:</strong> {slot.start} - {slot.end}
              </p>
            </div>
            <div className="mt-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message to mentor (optional)
              </label>
              <textarea
                id="message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="e.g., I'd like help with React hooks..."
                disabled={isLoading}
              />
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <Button
                onClick={onClose}
                className="bg-slate-500 hover:bg-slate-600"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isLoading}
                className="flex items-center justify-center min-w-[150px]"
              >
                {isLoading && <Spinner />}
                {isLoading ? "Sending..." : "Confirm Session"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// --- THE MAIN PAGE COMPONENT ---
export default function MentorProfilePage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const params = useParams();
  const mentorId = params.mentorId;
  const router = useRouter();

  const [mentor, setMentor] = useState<MentorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Mock data for mentor availability until the backend feature is fully implemented
  const mockAvailability = [
    {
      day: "Monday",
      slots: [
        { start: "10:00", end: "10:30" },
        { start: "14:00", end: "14:30" },
      ],
    },
    {
      day: "Wednesday",
      slots: [
        { start: "11:00", end: "11:30" },
        { start: "11:30", end: "12:00" },
      ],
    },
    {
      day: "Friday",
      slots: [
        { start: "16:00", end: "16:30" },
        { start: "16:30", end: "17:00" },
      ],
    },
  ];

  useEffect(() => {
    const fetchMentorAndReviews = async () => {
      if (session && mentorId) {
        setIsLoading(true);
        try {
          // Fetch mentor profile
          const mentorConfig = {
            headers: { Authorization: `Bearer ${session.user.token}` },
          };
          const { data: mentorData } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/mentors/${mentorId}`,
            mentorConfig
          );
          if (!mentorData.availability || mentorData.availability.length === 0) {
            mentorData.availability = mockAvailability;
          }
          setMentor(mentorData);

          // Fetch reviews
          const { data: reviewsData } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/mentor/${mentorId}`
          );
          setReviews(reviewsData);

          // Calculate average rating
          if (reviewsData.length > 0) {
            const totalRating = reviewsData.reduce(
              (acc: number, review: Review) => acc + review.rating,
              0
            );
            setAverageRating(totalRating / reviewsData.length);
          }
        } catch (err) {
          showToast("Failed to fetch mentor data.", "error");
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchMentorAndReviews();
  }, [session, mentorId, showToast]);

  const handleSlotClick = (slot: any, day: string) => {
    setSelectedSlot(slot);
    setSelectedDay(day);
    setShowModal(true);
  };

  const handleBookingConfirm = async (bookingDetails: any) => {
    setIsBooking(true);
    try {
      const realSessionDate = getNextDateForDay(bookingDetails.sessionDate);
      const payload = { ...bookingDetails, sessionDate: realSessionDate };
      const config = {
        headers: { Authorization: `Bearer ${session!.user.token}` },
      };
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
        payload,
        config
      );
      setBookingSuccess(true);
    } catch (error) {
      showToast("Failed to send booking request. Please try again.", "error");
      setShowModal(false);
    } finally {
      setIsBooking(false);
    }
  };

  const closeAndResetModal = () => {
    setShowModal(false);
    setTimeout(() => {
      if (bookingSuccess) {
        router.push("/dashboard/my-bookings");
      }
      setBookingSuccess(false);
    }, 300); // Delay allows for modal close animation
  };

  const getInitials = (name: string = ""): string => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (isLoading) return <ProfilePageSkeleton />;
  if (!mentor)
    return (
      <div className="p-8 text-center text-red-500">Mentor not found.</div>
    );

  return (
    <>
      {showModal && (
        <BookingModal
          mentor={mentor}
          slot={selectedSlot}
          day={selectedDay}
          onClose={closeAndResetModal}
          onConfirm={handleBookingConfirm}
          isLoading={isBooking}
          isSuccess={bookingSuccess}
        />
      )}
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <PageHeader title="Mentor Profile" description="Book a Session" />
          <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            {/* Profile Header */}
            <div className="flex items-center gap-6">
              {mentor.avatar ? (
                <img
                  src={mentor.avatar}
                  alt="..."
                  className="flex-shrink-0 w-24 h-24 rounded-full ..."
                />
              ) : (
                <div className="flex-shrink-0 w-24 h-24 rounded-full bg-sky-100 flex items-center justify-center ...">
                  {getInitials(mentor.name)}
                </div>
              )}
              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">
                  {mentor.name}
                </h1>
                <p className="text-slate-500 mt-1">{mentor.email}</p>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <StarRating rating={averageRating} />
                    <span className="text-slate-600 font-bold">
                      {averageRating.toFixed(1)}
                    </span>
                    <span className="text-slate-500">
                      ({reviews.length} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                Expertise
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {mentor.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-sky-100 text-sky-800 rounded-full px-3 py-1 text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          {reviews.length > 0 && (
            <div className="mt-8 bg-white p-8 rounded-xl shadow-lg border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-700">Reviews</h2>
              <div className="mt-6 space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="flex gap-4">
                    <div className="flex-shrink-0">
                      {review.mentee.avatar ? (
                        <img
                          src={review.mentee.avatar}
                          alt={review.mentee.name}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                          {getInitials(review.mentee.name)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">
                        {review.mentee.name}
                      </p>
                      <div className="flex items-center gap-2 my-1">
                        <StarRating rating={review.rating} />
                        <span className="text-xs text-slate-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-600">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Availability Section */}
          <div className="mt-8 bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-700">
              Available Time Slots
            </h2>
            <p className="text-slate-500 mt-1">
              Select a time to request a session.
            </p>
            <div className="mt-6 space-y-4">
              {mentor.availability && mentor.availability.length > 0 ? (
                mentor.availability.map((daySchedule, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-slate-600">
                      {daySchedule.day}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-3">
                      {daySchedule.slots.map((slot, sIndex) => (
                        <button
                          key={sIndex}
                          onClick={() => handleSlotClick(slot, daySchedule.day)}
                          className="px-4 py-2 bg-white border border-sky-500 text-sky-600 rounded-lg font-semibold hover:bg-sky-50 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                          {slot.start} - {slot.end}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">
                  This mentor has not set their availability yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

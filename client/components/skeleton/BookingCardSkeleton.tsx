const BookingCardSkeleton = () => (
    <div className="bg-white p-4 rounded-lg shadow border flex justify-between items-center animate-pulse">
        <div className="space-y-3">
            <div className="h-5 w-48 bg-slate-200 rounded"></div>
            <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
        <div className="flex items-center gap-2">
            <div className="h-7 w-20 bg-slate-200 rounded-full"></div>
            <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
        </div>
    </div>
);

export default BookingCardSkeleton;
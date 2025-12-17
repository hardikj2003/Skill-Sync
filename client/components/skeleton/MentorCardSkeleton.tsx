const MentorCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-200"></div>
            <div className="space-y-2">
                <div className="h-6 w-32 bg-slate-200 rounded"></div>
                <div className="h-4 w-40 bg-slate-200 rounded"></div>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="h-3 w-16 bg-slate-200 rounded mb-3"></div>
            <div className="flex flex-wrap gap-2">
                <div className="h-6 w-20 bg-slate-100 rounded-full"></div>
                <div className="h-6 w-24 bg-slate-100 rounded-full"></div>
            </div>
        </div>
      </div>
       <div className="bg-slate-50 px-6 py-4">
         <div className="h-5 w-full bg-slate-200 rounded"></div>
       </div>
    </div>
);

export default MentorCardSkeleton;
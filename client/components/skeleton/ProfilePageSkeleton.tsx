const ProfilePageSkeleton = () => (
    <div className="p-8 animate-pulse">
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                <div className="flex items-center gap-6">
                    <div className="flex-shrink-0 w-24 h-24 rounded-full bg-slate-200"></div>
                    <div className="space-y-3">
                        <div className="h-10 w-64 bg-slate-200 rounded"></div>
                        <div className="h-5 w-48 bg-slate-200 rounded"></div>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100">
                    <div className="h-4 w-24 bg-slate-200 rounded mb-3"></div>
                    <div className="flex flex-wrap gap-2">
                        <div className="h-8 w-24 bg-slate-100 rounded-full"></div>
                        <div className="h-8 w-32 bg-slate-100 rounded-full"></div>
                        <div className="h-8 w-28 bg-slate-100 rounded-full"></div>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                <div className="h-8 w-1/2 bg-slate-200 rounded"></div>
                <div className="h-4 w-2/3 bg-slate-200 rounded mt-3"></div>
                <div className="mt-6 space-y-4">
                    <div className="h-5 w-24 bg-slate-200 rounded"></div>
                    <div className="flex flex-wrap gap-3">
                        <div className="h-10 w-32 bg-slate-100 rounded-lg"></div>
                        <div className="h-10 w-32 bg-slate-100 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default ProfilePageSkeleton;
export default function Loading() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-2xl mx-auto animate-pulse">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-xl bg-gray-200 flex-shrink-0"></div>
        <div>
          <div className="h-6 bg-gray-200 rounded-md w-48 mb-1.5"></div>
          <div className="h-4 bg-gray-200 rounded-md w-64"></div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Account Skeleton */}
        <div className="bg-white rounded-2xl border border-[#E0E0EC] p-6">
          <div className="h-5 bg-gray-200 rounded-md w-24 mb-4"></div>
          <div className="space-y-4">
            <div>
              <div className="h-4 bg-gray-200 rounded-md w-20 mb-2"></div>
              <div className="h-11 bg-gray-100 border border-gray-200 rounded-xl w-full"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded-md w-24 mb-2"></div>
              <div className="h-11 bg-gray-100 border border-gray-200 rounded-xl w-full"></div>
            </div>
          </div>
        </div>

        {/* Teaching Profile Skeleton */}
        <div className="bg-white rounded-2xl border border-[#E0E0EC] p-6">
          <div className="h-5 bg-gray-200 rounded-md w-36 mb-4"></div>
          <div className="space-y-5">
            <div>
              <div className="h-4 bg-gray-200 rounded-md w-16 mb-2"></div>
              <div className="flex gap-2">
                <div className="h-9 bg-gray-200 rounded-lg w-20"></div>
                <div className="h-9 bg-gray-200 rounded-lg w-20"></div>
                <div className="h-9 bg-gray-200 rounded-lg w-24"></div>
              </div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded-md w-32 mb-2"></div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 w-10 bg-gray-200 rounded-lg"></div>)}
              </div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded-md w-32 mb-2"></div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-8 w-24 bg-gray-200 rounded-lg"></div>)}
              </div>
            </div>
          </div>
        </div>

        {/* Language Skeleton */}
        <div className="bg-white rounded-2xl border border-[#E0E0EC] p-6">
          <div className="h-5 bg-gray-200 rounded-md w-48 mb-1"></div>
          <div className="h-4 bg-gray-200 rounded-md w-64 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-12 w-full bg-gray-100 rounded-xl"></div>)}
          </div>
        </div>

        {/* Save button skeleton */}
        <div className="h-12 bg-[#E85D1E]/20 rounded-xl w-full"></div>
      </div>
    </div>
  );
}

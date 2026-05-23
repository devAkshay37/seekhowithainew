export default function Loading() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-xl bg-gray-200 flex-shrink-0"></div>
        <div>
          <div className="h-6 bg-gray-200 rounded-md w-48 mb-1.5"></div>
          <div className="h-4 bg-gray-200 rounded-md w-64"></div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-[#E0E0EC] p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <div className="h-4 bg-gray-200 rounded-md w-16 mb-2"></div>
            <div className="h-11 bg-gray-100 border border-gray-200 rounded-xl w-full"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded-md w-16 mb-2"></div>
            <div className="h-11 bg-gray-100 border border-gray-200 rounded-xl w-full"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded-md w-16 mb-2"></div>
            <div className="h-11 bg-gray-100 border border-gray-200 rounded-xl w-full"></div>
          </div>
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded-md w-24 mb-2"></div>
          <div className="h-11 bg-gray-100 border border-gray-200 rounded-xl w-full"></div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <div className="h-4 bg-gray-200 rounded-md w-20 mb-2"></div>
            <div className="h-11 bg-gray-100 border border-gray-200 rounded-xl w-full"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded-md w-20 mb-2"></div>
            <div className="h-11 bg-gray-100 border border-gray-200 rounded-xl w-full"></div>
          </div>
        </div>
        <div className="h-12 bg-[#E85D1E]/20 rounded-xl w-full mt-2"></div>
      </div>
    </div>
  );
}

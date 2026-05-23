export default function Loading() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-8 bg-gray-200 rounded-lg w-40 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-md w-32 mt-1"></div>
        </div>
        <div className="w-36 h-10 bg-[#E85D1E]/20 rounded-xl"></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white/50 border border-[#E0E0EC] rounded-2xl p-5">
            <div className="w-10 h-10 bg-gray-200 rounded-xl mb-3 flex-shrink-0"></div>
            <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded-md w-2/3 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded-md w-1/2 mb-4"></div>
            <div className="flex items-center justify-between mt-1">
              <div className="h-3 bg-gray-200 rounded-md w-1/4"></div>
              <div className="h-5 bg-gray-200 rounded-full w-12"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    // Mirrors: <div className="px-4 sm:px-6 lg:px-8 py-8 w-[90%] mx-auto">
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-[90%] mx-auto animate-pulse">
      {/* Mirrors: <div className="flex justify-center items-center pt-5 lg:pt-24 relative"> */}
      <div className="flex justify-center items-center pt-5 lg:pt-24 relative">
        {/* Mirrors: <section className="mb-2 w-full"> > <div className="flex flex-col gap-4 py-2"> */}
        <section className="mb-2 w-full">
          <div className="flex flex-col gap-4 py-2">
            {/* ── TeachPack Form skeleton ── */}
            {/* Mirrors: <div className="w-full lg:w-[80%] mx-auto pb-2"> */}
            <div className="w-full lg:w-[80%] mx-auto pb-2">
              <div className="w-full">
                <div className="relative pt-10 md:pt-0">
                  {/* Top Tab — label + 3 inline selects */}
                  <div className="flex flex-col border border-[#E0E0EC] border-b-0 rounded-t-[1.25rem] bg-white w-full px-3 py-2 relative z-10 mb-[-1px]">
                    {/* Label */}
                    <div className="h-5 bg-gray-200 rounded-md w-32 mb-3 mt-1 mx-3" />
                    {/* 3 selects in a row */}
                    <div className="flex flex-wrap items-center gap-y-1 px-1">
                      <div className="h-8 bg-gray-200 rounded-md w-28" />
                      <div className="w-px h-3.5 bg-gray-200 mx-2 hidden sm:block" />
                      <div className="h-8 bg-gray-200 rounded-md w-36" />
                      <div className="w-px h-3.5 bg-gray-200 mx-2 hidden sm:block" />
                      <div className="h-8 bg-gray-200 rounded-md w-32" />
                    </div>
                  </div>
                  {/* Main Box — topic input + pills + submit */}
                  <div className="border border-[#E0E0EC] bg-white rounded-b-[1.25rem] shadow-md flex flex-col pt-1 pb-3 px-3">
                    {/* Topic input area */}
                    <div className="h-12 bg-gray-200 rounded-xl mx-2 my-3" />
                    {/* Pills row */}
                    <div className="flex flex-wrap items-center gap-2.5 px-2">
                      <div className="h-9 bg-gray-200 rounded-full w-28" />
                      <div className="h-9 bg-gray-200 rounded-full w-28" />
                      <div className="h-9 bg-gray-200 rounded-full w-24" />
                      {/* Submit button */}
                      <div className="h-9 bg-gray-200 rounded-full w-44 sm:ml-auto" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* ── 4 Tool Cards skeleton ── */}
            {/* Mirrors: <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                // Mirrors: <Link className="flex flex-col w-full text-left bg-white border-2 rounded-[24px] p-2 ...">
                <div key={i} className="flex flex-col w-full bg-white border-2 border-gray-100 rounded-[24px] p-2">
                  <div className="flex items-center gap-2">
                    {/* Icon container */}
                    <div className="w-9 h-9 rounded-2xl bg-gray-200 shrink-0" />
                    {/* Name */}
                    <div className="h-5 bg-gray-200 rounded-md flex-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


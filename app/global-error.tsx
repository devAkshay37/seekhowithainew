'use client';

import { AlertCircle, RotateCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="antialiased font-sans">
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#fff8f0] text-center">
          <div className="w-16 h-16 bg-red-50 border border-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="font-jakarta text-2xl font-bold text-[#0F0F1A] mb-2">A critical error occurred</h2>
          <p className="text-[#6B6B8A] mb-8 max-w-md">
            The application experienced a fatal error. Please try again or refresh the page.
          </p>
          
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 bg-[#E85D1E] text-white font-medium px-6 py-3 rounded-xl hover:bg-[#d05018] shadow-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}

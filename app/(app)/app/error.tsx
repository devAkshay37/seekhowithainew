'use client';

import { useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const posthog = usePostHog();

  useEffect(() => {
    // Log the error to PostHog
    posthog.capture('app_error', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error, posthog]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="font-jakarta text-2xl font-bold text-[#0F0F1A] mb-2">Something went wrong!</h2>
      <p className="text-[#6B6B8A] mb-8 max-w-md">
        We encountered an error while trying to process your request. Our team has been notified.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => reset()}
          className="flex items-center justify-center gap-2 bg-[#E85D1E] text-white font-medium px-6 py-3 rounded-xl hover:bg-[#d05018] transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
        <Link 
          href="/app"
          className="flex items-center justify-center gap-2 bg-white border border-[#E0E0EC] text-[#0F0F1A] font-medium px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  labels: string[];
}

export function GeneratingAnimation({ labels }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-[#E0E0EC] p-10 text-center">
      <div className="w-16 h-16 brand-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
        <Sparkles className="w-8 h-8 text-white" />
      </div>
      <h3 className="font-jakarta font-semibold text-[#0F0F1A] text-lg mb-2">Generating with AI…</h3>
      <p className="text-[#6B6B8A] text-sm mb-8">This takes about 10–20 seconds</p>

      {/* Steps */}
      <div className="max-w-xs mx-auto space-y-3">
        {labels.map((label, i) => (
          <ProgressStep key={label} label={label} delay={i * 1500} />
        ))}
      </div>
    </div>
  );
}

function ProgressStep({ label, delay }: { label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (ref.current) {
        ref.current.style.opacity = '1';
        ref.current.style.transform = 'translateY(0)';
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{ opacity: 0, transform: 'translateY(8px)', transition: 'opacity 0.4s ease, transform 0.4s ease' }}
      className="flex items-center gap-3 px-4 py-2.5 bg-[#F5F5F7] rounded-xl text-left"
    >
      <div className="w-2 h-2 rounded-full bg-[#E85D1E] generating-pulse flex-shrink-0" />
      <p className="text-sm text-[#0F0F1A] font-medium">{label}</p>
    </div>
  );
}

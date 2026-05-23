import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { appVersion, DATE_WITH_YEAR } from '@/const/variables';

const entries = [
  {
    version: '0.1.0',
    date: DATE_WITH_YEAR,
    title: 'First Release',
    changes: [
      { type: 'new', text: 'AI-powered TeachPack generation' },
      { type: 'new', text: 'Last-minute preparation with quick revision cards' },
      { type: 'new', text: 'Interactive mind map generation for visual concept learning' },
      { type: 'new', text: 'Difficulty-Level Quiz Creator (Easy, Medium, and Hard) with PDF Download' },
      { type: 'new', text: 'SEL-structured classroom activity generator' },
      { type: 'new', text: 'Curriculum support for CBSE, ICSE, and State Boards' },
      { type: 'new', text: 'Class 1–8 coverage' },
      { type: 'new', text: 'Multi-language teacher notes in English, Hindi, Marathi, and Gujarati' },
      { type: 'new', text: 'Mobile-responsive and user-friendly UI/UX design' },
    ],
  },
];

const dotColor = {
  new: '#0d6f72',
  improvement: '#c07000',
  fix: '#d94f3a',
} as const;

export default function ChangelogPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 lg:py-5 pt-[80px] max-w-[680px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/app/settings/profile" className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-jakarta text-xl font-bold text-heading">Changelog</h1>
          <p className="text-sm text-muted-foreground">What&apos;s new in SeekhoWithAI</p>
        </div>
      </div>

      {/* Entries */}
      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.version} className="bg-white border border-[#e8d8c0] rounded-[12px] p-6">
            {/* Version + Date row */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold tracking-[0.08em] uppercase" style={{ color: '#0d6f72' }}>
                {appVersion.entry}  {appVersion.version}
              </span>
              <span className="text-[11px]" style={{ color: '#b8a090' }}>{entry.date}</span>
            </div>
            {/* Title */}
            <h2 className="text-[16px] font-bold mb-4" style={{ color: '#1a0f00' }}>{entry.title}</h2>
            {/* Divider */}
            <div className="border-t border-[#e8d8c0] mb-4" />
            {/* Change list */}
            <ul className="space-y-2">
              {entry.changes.map((change, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full"
                    style={{ backgroundColor: dotColor[change.type as keyof typeof dotColor] }} />
                  <span className="text-[13px]" style={{ color: '#2a1a08' }}>{change.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

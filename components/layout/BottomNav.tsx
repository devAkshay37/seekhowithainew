'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Brain, FileText, User } from 'lucide-react';

const tabs = [
  { href: '/app', label: 'Home', icon: LayoutDashboard },
  { href: '/app/teachpack', label: 'TeachPack', icon: BookOpen },
  { href: '/app/mindmap', label: 'Mindmap', icon: Brain },
  { href: '/app/quiz', label: 'Quiz', icon: FileText },
  { href: '/app/settings/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E0E0EC] safe-area-pb">
        <div className="flex items-stretch h-16">
          {tabs.map(({ href, label, icon: Icon }) => {
            const isActive = href === '/app' ? pathname === '/app' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px] transition-colors ${isActive ? 'text-[#E85D1E]' : 'text-[#6B6B8A]'}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

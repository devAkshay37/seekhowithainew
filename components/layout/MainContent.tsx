'use client';

import { ReactNode } from 'react';
import { useSidebar } from './SidebarContext';

export function MainContent({ children }: { children: ReactNode }) {
  const { sidebarOpen } = useSidebar();

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'lg:ml-72' : 'lg:ml-0'
      }`}
    >
      {children}
    </div>
  );
}

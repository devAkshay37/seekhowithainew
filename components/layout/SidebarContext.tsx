'use client';
 
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface SidebarContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  sidebarOpen: false,
  setSidebarOpen: () => { },
  toggleSidebar: () => { },
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Determine if the sidebar should be closed by default
    // Using 1024px as the breakpoint for desktop (lg in Tailwind)
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    
    // Check if it's a TeachPack details page (e.g., /app/teachpack/[id])
    const pathSegments = pathname.split('/').filter(Boolean);
    const isTeachPackDetails = pathSegments.length >= 3 && pathSegments[1] === 'teachpack' && pathSegments[2] !== 'new';

    if (!isDesktop || isTeachPackDetails) {
      setSidebarOpen(false);
    } else {
      // On desktop and not teachpack details, open by default
      setSidebarOpen(true);
    }
  }, [pathname]);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}

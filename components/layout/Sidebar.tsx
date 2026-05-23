'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Zap,
  Brain,
  FileText,
  Activity,
  Settings,
  LogOut,
  User,
  SidebarOpen,
  SidebarClose,
  Clock,
  Loader2
} from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useSidebar } from './SidebarContext';

const toolTypeLabels: Record<string, string> = {
  teachpack: 'TeachPack',
  lastminprep: 'Last Min Prep',
  mindmap: 'Mindmap',
  quiz: 'Quiz',
  activity: 'Activity',
};

const toolTypeHref: Record<string, string> = {
  teachpack: '/app/teachpack',
  lastminprep: '/app/lastminprep',
  mindmap: '/app/mindmap',
  quiz: '/app/quiz',
  activity: '/app/activity',
};

const toolTypeIcons: Record<string, React.ElementType> = {
  teachpack: BookOpen,
  lastminprep: Zap,
  mindmap: Brain,
  quiz: FileText,
  activity: Activity,
};

interface RecentItem {
  id: string;
  title: string;
  subject?: string;
  type: string;
  created_at: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

export function SidebarCom() {
  const router = useRouter();
  const supabase = createClient();
  const { sidebarOpen, toggleSidebar } = useSidebar();

  const [open, setOpen] = useState(false);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch recent items
  useEffect(() => {
    if (!sidebarOpen) return;

    async function fetchRecent() {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const [
        { data: packs },
        { data: preps },
        { data: maps },
        { data: quizzes },
        { data: activities }
      ] = await Promise.all([
        supabase.from('teachpacks').select('id, topic, subject, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('lastminpreps').select('id, topic, subject, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('mindmaps').select('id, topic, subject, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('quizzes').select('id, subject, created_at, topics').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('activities').select('id, topic, subject, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
      ]);

      const all: RecentItem[] = [
        ...(packs || []).map(p => ({ id: p.id, type: 'teachpack', title: p.topic, subject: p.subject, created_at: p.created_at })),
        ...(preps || []).map(p => ({ id: p.id, type: 'lastminprep', title: p.topic, subject: p.subject, created_at: p.created_at })),
        ...(maps || []).map(m => ({ id: m.id, type: 'mindmap', title: m.topic, subject: m.subject, created_at: m.created_at })),
        ...(quizzes || []).map(q => ({ id: q.id, type: 'quiz', title: q.topics?.[0] || q.subject, subject: q.subject, created_at: q.created_at })),
        ...(activities || []).map(a => ({ id: a.id, type: 'activity', title: a.topic, subject: a.subject, created_at: a.created_at })),
      ]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 15);

      setRecentItems(all);
      setLoading(false);
    }

    fetchRecent();
  }, [sidebarOpen, supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/auth/login');
  }

  return (
    <>
      {/* TOP NAVBAR */}
      <aside className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b">
        <div className="flex items-center justify-between w-full px-4 sm:px-6 py-2">

          {/* LEFT SECTION */}
          <div className="flex items-center">

            {/* ICON */}
            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center w-10 h-10 rounded-xl text-[#8a6848] hover:bg-[#f5ede0]/60 transition"
            >
              {sidebarOpen ? <SidebarClose /> : <SidebarOpen />}
            </button>

            {/* LOGO (dynamic position) */}
            <div
              className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'sm:ml-[15rem] ml-4' : 'ml-5'
                }`}
            >
              <Link href="/app" className="flex items-center">
                <Image src="/logo/SeekhoWithAI-Logowith-Wordmark.svg" alt="SeekhoWithAI" width={160} height={36} className="h-8 w-auto" />
              </Link>
            </div>

          </div>

          {/* RIGHT SECTION */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center justify-center w-10 h-10 rounded-xl text-[#8a6848] hover:bg-[#f5ede0]/60 transition"
            >
              <User className="w-5 h-5" />
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-44 bg-background border border-border rounded-xl shadow-lg overflow-hidden">
                <Link
                  href="/app/settings/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#f5ede0]"
                  onClick={() => setOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#f5ede0]"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>

        </div>
      </aside>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 sm:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`flex fixed top-0 left-0 z-40 h-full w-[90%] sm:w-72 bg-background border-r transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col w-full h-full pt-14">
          <div className="flex flex-col gap-1 px-3 pb-2">
            <div className="px-1 py-1">
              <h2 className="text-sm font-semibold text-[#8a6848]">Saved history</h2>
            </div>

            <Link href="/app/teachpack" className="flex items-center gap-3 p-1 rounded-xl hover:bg-blue-50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-medium text-[15px] text-gray-800">TeachPack</span>
            </Link>

            <Link href="/app/lastminprep" className="flex items-center gap-3 p-1 rounded-xl hover:bg-yellow-200 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-yellow-600" />
              </div>
              <span className="font-medium text-[15px] text-gray-800">Last Min Prep</span>
            </Link>

            <Link href="/app/mindmap" className="flex items-center gap-3 p-1 rounded-xl hover:bg-purple-100 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                <Brain className="w-4 h-4 text-purple-600" />
              </div>
              <span className="font-medium text-[15px] text-gray-800">Mindmap</span>
            </Link>

            <Link href="/app/quiz" className="flex items-center gap-3 p-1 rounded-xl hover:bg-green-50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-green-600" />
              </div>
              <span className="font-medium text-[15px] text-gray-800">Quiz</span>
            </Link>

            <Link href="/app/activity" className="flex items-center gap-3 p-1 rounded-xl hover:bg-orange-200 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 text-orange-600" />
              </div>
              <span className="font-medium text-[15px] text-gray-800">Activity</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 px-5 px-1 py-1">
            <Clock className="w-4 h-4 text-[#8a6848]" />
            <h2 className="text-sm font-semibold text-[#8a6848]">Recent</h2>
          </div>


          <div className="flex-1 overflow-y-auto p-3">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin" />
              </div>
            ) : recentItems.length === 0 ? (
              <p className="text-sm text-center mt-10">No recent items</p>
            ) : (
              recentItems.map(item => {
                const Icon = toolTypeIcons[item.type];
                return (
                  <Link
                    key={item.id}
                    href={`${toolTypeHref[item.type]}/${item.id}`}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 min-w-0 w-full"
                  >
                    <Icon className="w-4 h-4 mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate w-full">{item.title}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {toolTypeLabels[item.type]} · {formatDate(item.created_at)}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
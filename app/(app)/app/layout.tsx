import { createClient } from '@/lib/supabase/server';
import { SidebarCom } from '@/components/layout/Sidebar';
import { redirect } from 'next/navigation';
import { PostHogSessionTracker } from './PostHogSessionTracker';
import { SidebarProvider } from '@/components/layout/SidebarContext';
import { MainContent } from '@/components/layout/MainContent';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    await supabase.from('profiles').insert({ id: user.id, full_name: user.user_metadata?.full_name || user.email || '' });
    const { data: newProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    profile = newProfile;
  }

  if (profile && !profile.onboarding_complete) {
    redirect('/onboarding');
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <SidebarCom />
        {/* Main content area - shifts when sidebar is open */}
        <MainContent>
          <main className="min-h-screen pt-0 sm:pt-16 lg:pt-16 pb-20 lg:pb-0">
            {children}
          </main>
          {/* <BottomNav /> */}
        </MainContent>
        {profile && (
          <PostHogSessionTracker
            user={{
              id: user.id,
              email: user.email,
              fullName: profile.full_name,
              createdAt: profile.created_at
            }}
          />
        )}
      </div>
    </SidebarProvider>
  );
}

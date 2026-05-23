import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Plus, BookOpen, Star, ArrowLeft } from 'lucide-react';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function TeachPackListPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: packs } = await supabase
    .from('teachpacks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      <Link href="/app" className="inline-flex items-center gap-2 text-sm text-[#6B6B8A] hover:text-[#0F0F1A] transition-colors mb-4 group">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Dashboard
      </Link>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-jakarta text-2xl font-bold text-[#0F0F1A]">My TeachPacks</h1>
          <p className="text-sm text-[#6B6B8A] mt-1">{packs?.length || 0} saved packs</p>
        </div>
        <Link href="/app" className="flex items-center gap-2 bg-[#E85D1E] text-white font-medium text-sm px-4 py-2.5 rounded-xl hover:bg-[#d05018] transition-colors">
          <Plus className="w-4 h-4" /> New TeachPack
        </Link>
      </div>

      {!packs?.length ? (
        <div className="border-2 border-dashed border-[#E0E0EC] rounded-2xl p-14 text-center">
          <BookOpen className="w-12 h-12 text-[#E0E0EC] mx-auto mb-4" />
          <h3 className="font-jakarta font-semibold text-[#0F0F1A] mb-2">No TeachPacks yet</h3>
          <p className="text-[#6B6B8A] text-sm mb-6">Generate your first complete lesson package in seconds.</p>
          <Link href="/app" className="inline-flex items-center gap-2 bg-[#E85D1E] text-white font-medium text-sm px-5 py-2.5 rounded-xl hover:bg-[#d05018] transition-colors">
            <Plus className="w-4 h-4" /> Create TeachPack
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {packs.map((pack) => (
            <Link key={pack.id} href={`/app/teachpack/${pack.id}`} className="bg-white border border-[#E0E0EC] rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-[#f5ede0] rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-teal" />
                </div>
                {pack.is_starred && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
              </div>
              <h3 className="font-jakarta font-semibold text-[#0F0F1A] text-sm mb-1.5 line-clamp-2">{pack.topic}</h3>
              <p className="text-[#6B6B8A] text-xs mb-3">Class {pack.class} · {pack.subject} · {pack.board}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#6B6B8A]">{formatDate(pack.created_at)}</span>
                <span className="text-[10px] bg-[#F5F5F7] text-[#6B6B8A] px-2 py-1 rounded-full">{pack.duration} min</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Save, Check } from 'lucide-react';
import Link from 'next/link';
import type { Profile } from '@/types';
import { appVersion } from '@/const/variables';

const BOARDS = ['CBSE', 'ICSE', 'State Board'];
const CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8'];
const SUBJECTS = ['Maths', 'EVS', 'Science', 'Hindi Vyakran', 'English Grammar', 'Computer', 'SST', 'Other'];
const LANGUAGES = ['English', 'Hindi', 'Marathi', 'Gujarati'];

export default function ProfileSettingsPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setProfile(data as Profile);
    }
    load();
  }, []);

  function toggleItem(field: 'classes' | 'subjects', item: string) {
    if (!profile) return;
    const current = profile[field] || [];
    setProfile({
      ...profile,
      [field]: current.includes(item) ? current.filter((i: string) => i !== item) : [...current, item],
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true); setError('');
    try {
      const { error: err } = await supabase.from('profiles').update({
        full_name: profile.full_name,
        school_name: profile.school_name,
        board: profile.board,
        classes: profile.classes,
        subjects: profile.subjects,
        language_preference: profile.language_preference,
      }).eq('id', profile.id);
      if (err) throw err;
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (!profile) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-[#E85D1E] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 lg:py-5 pt-[80px] max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/app" className="p-2 rounded-xl hover:bg-[#E0E0EC] transition-colors text-[#6B6B8A]"><ArrowLeft className="w-4 h-4" /></Link>
        <div><h1 className="font-jakarta text-xl font-bold text-[#0F0F1A]">Profile & Settings</h1>
          <p className="text-sm text-[#6B6B8A]">Update your teaching profile and preferences</p></div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Account */}
        <div className="bg-white rounded-2xl border border-[#E0E0EC] p-6">
          <h2 className="font-jakarta font-semibold text-[#0F0F1A] mb-4">Account</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Full Name</label>
              <input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} className="w-full border border-[#E0E0EC] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D1E]/30 focus:border-[#E85D1E]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">School Name</label>
              <input value={profile.school_name || ''} onChange={(e) => setProfile({ ...profile, school_name: e.target.value })} className="w-full border border-[#E0E0EC] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D1E]/30 focus:border-[#E85D1E]" />
            </div>
          </div>
        </div>

        {/* Teaching Profile */}
        <div className="bg-white rounded-2xl border border-[#E0E0EC] p-6">
          <h2 className="font-jakarta font-semibold text-[#0F0F1A] mb-4">Teaching Profile</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#0F0F1A] mb-2">Board</label>
              <div className="flex gap-2 flex-wrap">
                {BOARDS.map((b) => (
                  <button key={b} type="button" onClick={() => setProfile({ ...profile, board: b as Profile['board'] })} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${profile.board === b ? 'bg-[#E85D1E] text-white border-[#E85D1E]' : 'border-[#E0E0EC] text-[#0F0F1A] hover:border-[#E85D1E]/50'}`}>{b}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F0F1A] mb-2">Classes You Teach</label>
              <div className="flex flex-wrap gap-2">
                {CLASSES.map((c) => (
                  <button key={c} type="button" onClick={() => toggleItem('classes', c)} className={`w-10 h-10 rounded-lg text-sm font-medium border transition-colors ${profile.classes?.includes(c) ? 'bg-[#E85D1E] text-white border-[#E85D1E]' : 'border-[#E0E0EC] text-[#0F0F1A] hover:border-[#E85D1E]/50'}`}>{c}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F0F1A] mb-2">Subjects You Teach</label>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map((s) => (
                  <button key={s} type="button" onClick={() => toggleItem('subjects', s)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${profile.subjects?.includes(s) ? 'bg-[#E85D1E] text-white border-[#E85D1E]' : 'border-[#E0E0EC] text-[#0F0F1A] hover:border-[#E85D1E]/50'}`}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Language Preference */}
        <div className="bg-white rounded-2xl border border-[#E0E0EC] p-6">
          <h2 className="font-jakarta font-semibold text-[#0F0F1A] mb-1">Teacher Notes Language</h2>
          <p className="text-sm text-[#6B6B8A] mb-4">Used for Teacher Notes in TeachPacks</p>
          <div className="space-y-2">
            {LANGUAGES.map((lang) => (
              <button key={lang} type="button" onClick={() => setProfile({ ...profile, language_preference: lang as Profile['language_preference'] })} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border transition-colors bg-card ${profile.language_preference === lang ? 'border-saffron bg-[#f5ede0]' : 'hover:border-teal/50'}`}>
                <span className={`font-semibold ${profile.language_preference === lang ? 'text-saffron' : 'text-foreground'}`}>{lang}</span>
                {profile.language_preference === lang && <Check className="w-4 h-4 text-saffron" />}
              </button>
            ))}
          </div>
        </div>

        <button id="save-settings"
          onClick={handleSave} disabled={saving} className="w-full bg-saffron text-white font-semibold py-3 rounded-xl hover:bg-[#a06000] disabled:bg-[#e8c898] transition-colors flex items-center justify-center gap-2"
        >
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : saving ? 'Saving…' : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </form>

      <div className="text-center mt-10">
        <Link href="/app/changelog"
          className="text-[12px] font-normal text-[#b8a090] hover:text-[#0d6f72] hover:underline transition-colors cursor-pointer">
          {appVersion.entry}  {appVersion.version}
        </Link>
      </div>
    </div>
  );
}


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { TeachPackForm } from '@/components/tools/teachpack/TeachPackForm';
import { TeachPackView } from '@/components/tools/teachpack/TeachPackView';
import { GeneratingAnimation } from '@/components/shared/GeneratingAnimation';
import type { TeachPackContent, TeachPackFormInput, AddOn, Profile } from '@/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePostHog } from 'posthog-js/react';
import { trackGenerationCompletion } from '@/lib/posthog-utils';

interface Props {
  profile: Profile;
}

export function NewTeachPackClient({ profile }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [status, setStatus] = useState<'form' | 'generating' | 'result'>('form');
  const [content, setContent] = useState<TeachPackContent | null>(null);
  const [formData, setFormData] = useState<TeachPackFormInput | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const posthog = usePostHog();

  async function handleGenerate(data: TeachPackFormInput) {
    posthog.capture('teachpack_generation_started', {
      board: data.board,
      class: data.class,
      subject: data.subject,
      chapter: data.topic,
      language: data.language,
      tool: 'TeachPack'
    });

    setFormData(data);
    setStatus('generating');
    setError('');
    const startTime = Date.now();
    try {
      const res = await fetch('/api/generate/teachpack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Generation failed');
      const { content: generatedContent } = await res.json();

      const timeTaken = (Date.now() - startTime) / 1000;
      const sectionsCount = generatedContent ? Object.keys(generatedContent).length : 5;
      trackGenerationCompletion(supabase, posthog, 'TeachPack', data, timeTaken, sectionsCount);

      setContent(generatedContent);
      setStatus('result');
    } catch (err: any) {
      posthog.capture('teachpack_generation_failed', {
        tool: 'TeachPack',
        error: err.message || 'Unknown error'
      });
      setError('Failed to generate TeachPack. Please try again.');
      setStatus('form');
    }
  }

  async function handleSave(finalContent: TeachPackContent, addons: AddOn[]) {
    if (!formData) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: insertError } = await supabase.from('teachpacks').insert({
        user_id: user.id,
        title: formData.topic,
        board: formData.board,
        class: formData.class,
        subject: formData.subject,
        topic: formData.topic,
        duration: formData.duration,
        language: formData.language,
        content: finalContent,
        addons,
        is_starred: false,
      }).select().single();

      if (insertError) {
        console.error('Supabase Insert Error:', insertError);
        throw insertError;
      }

      if (data) {
        posthog.capture('teachpack_saved', {
          teachpack_id: data.id,
          tool: 'TeachPack'
        });
        router.push(`/app/teachpack/${data.id}`);
      }
    } catch (err: any) {
      console.error('Full save error details:', err);
      setError(err.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/app/teachpack" className="p-2 rounded-xl hover:bg-[#E0E0EC] transition-colors text-[#6B6B8A]">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-jakarta text-xl font-bold text-[#0F0F1A]">New TeachPack</h1>
          <p className="text-sm text-[#6B6B8A]">Generate a complete lesson content package</p>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

      {status === 'form' && <div className="bg-white rounded-2xl border border-[#E0E0EC] p-6"><TeachPackForm profile={profile} onSubmit={handleGenerate} loading={false} /></div>}
      {status === 'generating' && (
        <GeneratingAnimation labels={['Analysing topic…', 'Building lesson flow…', 'Writing objectives…', 'Crafting questions…', 'Adding teacher notes…']} />
      )}
      {status === 'result' && content && formData && (
        <TeachPackView
          content={content}
          formData={formData}
          onSave={handleSave}
          saving={saving}
          onRegenerate={() => { setStatus('form'); setContent(null); }}
        />
      )}
    </div>
  );
}

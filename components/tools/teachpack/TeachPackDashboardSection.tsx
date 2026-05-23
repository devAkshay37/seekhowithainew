'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { TeachPackForm } from './TeachPackForm';
import type { TeachPackFormInput, Profile } from '@/types';

export default function TeachPackDashboardSection({
  profile,
}: {
  profile: Profile;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(data: TeachPackFormInput) {
    try {
      setLoading(true);

      const res = await fetch('/api/generate/teachpack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to generate TeachPack');

      const { content } = await res.json();

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: savedData, error: insertError } = await supabase.from('teachpacks').insert({
        user_id: user.id,
        title: data.topic,
        board: data.board,
        class: data.class,
        subject: data.subject,
        topic: data.topic,
        duration: data.duration,
        language: data.language,
        content: content,
        addons: [],
        is_starred: false,
      }).select().single();

      if (insertError) throw insertError;

      router.push(`/app/teachpack/${savedData.id}`);

    } catch (err) {
      console.error('Error generating/saving TeachPack:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <TeachPackForm
      profile={profile}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}
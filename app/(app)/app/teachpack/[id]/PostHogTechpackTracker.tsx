'use client';

import { useEffect, useRef } from 'react';
import { usePostHog } from 'posthog-js/react';

export function PostHogTechpackTracker({ id }: { id: string }) {
  const posthog = usePostHog();
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      posthog.capture('teachpack_opened', { teachpack_id: id, tool: 'TeachPack' });
      tracked.current = true;
    }
  }, [posthog, id]);

  return null;
}

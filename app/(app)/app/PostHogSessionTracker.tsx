'use client';

import { useEffect, useRef } from 'react';
import { usePostHog } from 'posthog-js/react';

interface UserProps {
  id: string;
  email?: string;
  fullName?: string;
  createdAt?: string;
}

export function PostHogSessionTracker({ user }: { user: UserProps }) {
  const posthog = usePostHog();
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current && user.id) {
      posthog.identify(user.id, { email: user.email, fullName: user.fullName });
      if (user.createdAt) {
        const signupDate = new Date(user.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - signupDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        posthog.capture('session_started', { day_number: diffDays });
      }
      tracked.current = true;
    }
  }, [posthog, user]);

  return null;
}

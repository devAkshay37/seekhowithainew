'use client';

import { useEffect, useRef } from 'react';
import { usePostHog } from 'posthog-js/react';

export function LandingTracker() {
  const posthog = usePostHog();
  const trackedView = useRef(false);

  useEffect(() => {
    if (!trackedView.current) {
      posthog.capture('page_viewed', { page: 'landing' });
      trackedView.current = true;
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const a = target.closest('a');
      if (!a) return;

      if (a.classList.contains('btn-nav-ghost')) {
        posthog.capture('cta_clicked', { section: 'hero', label: 'Sign In' });
      } else if (a.classList.contains('btn-nav')) {
        posthog.capture('cta_clicked', { section: 'hero', label: 'Get Started' });
      } else if (a.classList.contains('btn-primary')) {
        posthog.capture('cta_clicked', { section: 'hero', label: 'Get Started' });
      } else if (a.classList.contains('btn-dual-t')) {
        posthog.capture('cta_clicked', { section: 'dual_teacher', label: 'Get Started' });
      } else if (a.classList.contains('btn-dual-o')) {
        posthog.capture('cta_clicked', { section: 'dual_owner', label: 'Request Demo' });
        posthog.capture('demo_requested', { source: 'landing_dual' });
      } else if (a.classList.contains('btn-cta') || a.closest('.cta-form')) {
        posthog.capture('cta_clicked', { section: 'final', label: 'Get Started' });
      } else if (a.classList.contains('plan-btn')) {
        posthog.capture('cta_clicked', { section: 'final', label: 'Get Started' });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [posthog]);

  return null;
}

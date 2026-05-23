import posthog from 'posthog-js'

if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: '2026-01-30',
    autocapture: true,        // Required for accurate $pageleave / bounce rate
    capture_pageleave: true,  // Explicitly enable $pageleave events
  })
}

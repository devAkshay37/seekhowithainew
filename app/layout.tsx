import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Geist } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { PostHogProvider } from './providers';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '600', '800'],
  display: 'swap',
});

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://seekhowithai.com'),
  title: 'SeekhoWithAI - Teach smarter, every day',
  description: 'AI-powered lesson plans, quizzes, and teaching packs built for Indian classrooms in seconds.',
  keywords: ['teacher tools', 'AI education', 'lesson planning', 'TeachPack', 'quiz generator', 'India'],
  openGraph: {
    title: 'SeekhoWithAI - Teach smarter, every day',
    description: 'AI-powered lesson plans, quizzes, and teaching packs built for Indian classrooms in seconds.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SeekhoWithAI - Teach smarter, every day',
    description: 'AI-powered lesson plans, quizzes, and teaching packs built for Indian classrooms in seconds.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicons/favicon.ico', type: 'image/x-icon' },
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/favicons/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/favicons/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SeekhoWithAI',
  },
  other: {
    'theme-color': '#fff8f0',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#fff8f0" />
      </head>
      <body className={`${plusJakartaSans.variable} ${geistSans.variable} antialiased`}>
        <PostHogProvider>
          {children}
        </PostHogProvider>
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
      </body>
    </html>
  );
}


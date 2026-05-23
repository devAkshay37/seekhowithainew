import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import TestimonialSlider from './_components/TestimonialSlider';
import { LandingTracker } from './_components/LandingTracker';
import { formatDate } from '@/const/functions';
import { DATE_NO_YEAR_WITH_CURRENT_YEAR, DATE_WITH_YEAR, PRICE } from '@/const/variables';
import './landing.css';

const formattedDateWithoutYear =
  formatDate(DATE_NO_YEAR_WITH_CURRENT_YEAR) || '31st March';
const formattedDateWithYear = formatDate(DATE_WITH_YEAR, true) || '31st March 2025';

export const metadata: Metadata = {
  title: 'SeekhoWithAI - AI-Powered Teaching, Reimagined',
  description:
    'SeekhoWithAI brings together a full suite of AI teaching tools - Techpack creation, Mind Maps, Last-Minute Prep, Assessments & Smart Slides - all in one place, in your language. Free for teachers.',
  keywords: [
    'AI teaching tools',
    'lesson plan generator',
    'Techpack',
    'CBSE lesson plans',
    'ICSE teaching',
    'Indian teacher tools',
    'Mind Map generator',
    'assessment builder',
    'SeekhoWithAI',
    'AI for teachers India',
  ],
  openGraph: {
    title: 'SeekhoWithAI - AI-Powered Teaching, Reimagined',
    description:
      `One platform. Every tool a teacher needs. AI teaching tools for Indian classrooms - Techpack, Mind Maps, Assessments, Smart Slides & more. Free till ${formattedDateWithoutYear}.`,
    type: 'website',
    locale: 'en_IN',
    url: 'https://seekhowithai.com',
    siteName: 'SeekhoWithAI',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'SeekhoWithAI - AI-Powered Teaching, Reimagined',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SeekhoWithAI - AI-Powered Teaching, Reimagined',
    description: 'One platform. Every tool a teacher needs. Free for Indian teachers.',
    images: ['/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://seekhowithai.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function HomePage() {
  return (
    <>
      <LandingTracker />
      {/* NAV */}
      <nav>
        <a className="nav-logo" href="#">
          <Image
            src="/logo/SeekhoWithAI-Logowith-Wordmark.svg"
            alt="SeekhoWithAI"
            width={160}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </a>
        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="nav-actions">
          <a href="/auth/login" className="btn-nav-ghost">Sign In</a>
          <a href="/auth/sign-up" className="btn-nav">Get Started →</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-kicker"><div className="kicker-dot"></div>Early Access - Now Open</div>
          <h1>One platform.<br /><span className="hl">Every tool</span> a<br />teacher needs.</h1>
          <p className="hero-sub">SeekhoWithAI brings together a full suite of AI teaching tools - from Techpack creation to Mind Maps and Last-Minute Prep - all in one place, in your language.</p>
          <div className="hero-tools">
            <div className="tool-pill">📦 Techpack Creator</div>
            <div className="tool-pill">🗺️ Mind Map</div>
            <div className="tool-pill">⚡ Last-Min Prep</div>
            <div className="tool-pill">📝 Assessments</div>
            <div className="tool-pill">🖥️ Smart Slides</div>
            <div className="tool-pill">+more</div>
          </div>
          <div className="hero-form">
            <a href="/auth/sign-up" className="btn-primary">Get Started Free →</a>
          </div>
          <p className="hero-note">
            Free till {formattedDateWithoutYear} · No credit card · For Class 1–8 teachers
          </p>
        </div>

        <div className="hero-right">
          <div className="stack-scene">
            <div className="s-dot"></div><div className="s-dot"></div><div className="s-dot"></div>
            <div className="s-dot"></div><div className="s-dot"></div>

            <div className="stack-card sc1">
              <div className="sc-row">
                <div className="sc-icon">📦</div>
                <div className="sc-body"><div className="sc-label">Techpack Creator</div><div className="sc-desc">Full lesson packages in minutes</div></div>
                <div className="sc-badge">Active</div>
              </div>
              <div className="sc-bar"><div className="sc-bar-fill"></div></div>
            </div>

            <div className="stack-card sc2">
              <div className="sc-row">
                <div className="sc-icon">🗺️</div>
                <div className="sc-body"><div className="sc-label">Mind Map Creator</div><div className="sc-desc">Visual topic breakdowns</div></div>
                <div className="sc-badge">Ready</div>
              </div>
              <div className="sc-bar"><div className="sc-bar-fill"></div></div>
            </div>

            <div className="stack-card sc3">
              <div className="sc-row">
                <div className="sc-icon">⚡</div>
                <div className="sc-body"><div className="sc-label">Last-Min Prep</div><div className="sc-desc">Class-ready in 60 seconds</div></div>
                <div className="sc-badge">⚡ Fast</div>
              </div>
              <div className="sc-bar"><div className="sc-bar-fill"></div></div>
            </div>

            <div className="stack-card sc4">
              <div className="sc-row">
                <div className="sc-icon">📝</div>
                <div className="sc-body"><div className="sc-label">Assessment Builder</div><div className="sc-desc">Tests, quizzes &amp; rubrics</div></div>
                <div className="sc-badge">New</div>
              </div>
              <div className="sc-bar"><div className="sc-bar-fill"></div></div>
            </div>

            <div className="stack-card sc5">
              <div className="sc-row">
                <div className="sc-icon">🖥️</div>
                <div className="sc-body"><div className="sc-label">Smart Slides</div><div className="sc-desc">Board-ready presentations</div></div>
                <div className="sc-badge">Soon</div>
              </div>
              <div className="sc-bar"><div className="sc-bar-fill"></div></div>
            </div>
          </div>
        </div>

        <div className="scroll-hint"><div className="scroll-line"></div>Scroll to explore</div>
      </section>

      {/* PRESS */}
      <div className="press-section hidden">
        <div className="press-inner">
          <span className="press-label">Recognized by</span>
          <div className="press-logos">
            <div className="press-badge">
              <div className="press-badge-name">CBSE Connect</div>
              <div className="press-badge-star">★ ★ ★ ★ ★</div>
              <div className="press-badge-quote">&quot;Changes the way teachers prepare&quot;</div>
            </div>
            <div className="press-badge">
              <div className="press-badge-name">EduTech India</div>
              <div className="press-badge-star">★ ★ ★ ★ ★</div>
              <div className="press-badge-quote">&quot;A must-have for every school&quot;</div>
            </div>
            <div className="press-badge">
              <div className="press-badge-name">iBiz Finals 2024</div>
              <div className="press-badge-star">🏆 Finalist</div>
              <div className="press-badge-quote">&quot;300+ signups in one pitch&quot;</div>
            </div>
            <div className="press-badge">
              <div className="press-badge-name">StartupShala</div>
              <div className="press-badge-star">★ ★ ★ ★ ★</div>
              <div className="press-badge-quote">&quot;Built for Bharat&apos;s classrooms&quot;</div>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how">
        <div className="section-inner">
          <span className="kicker-tag teal">How it works</span>
          <h2 className="section-h2">From topic to <span className="hl">Techpack</span> in 3 steps.</h2>
          <p className="section-sub">No setup. No complexity. Pick your chapter, pick your language, and receive a complete teaching package - instantly.</p>
          <div className="steps-grid reveal">
            <div className="step-card">
              <div className="step-num">01</div>
              <div className="step-icon-wrap">📚</div>
              <div className="step-title">Enter your topic &amp; class</div>
              <p className="step-desc">Tell SeekhoWithAI the subject, class level (1–8), and board. Works with CBSE, ICSE, and State Boards - natively in English, Marathi, and Gujarati.</p>
              <span className="step-arrow">→</span>
            </div>
            <div className="step-card">
              <div className="step-num">02</div>
              <div className="step-icon-wrap">✨</div>
              <div className="step-title">AI builds your Techpack</div>
              <p className="step-desc">Lesson plan, activities, assessments, slides, and notes - generated in seconds, structured exactly the way teachers need them.</p>
              <span className="step-arrow">→</span>
            </div>
            <div className="step-card">
              <div className="step-num">03</div>
              <div className="step-icon-wrap">📤</div>
              <div className="step-title">Edit, export &amp; teach</div>
              <p className="step-desc">Tweak anything, export to Word, PDF, or PowerPoint. Works offline too - your Techpacks are always ready, internet or not.</p>
              <span className="step-arrow">✓</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section" id="features">
        <div className="section-inner">
          <span className="kicker-tag teal">Built for real classrooms</span>
          <h2 className="section-h2">Everything a teacher needs.<br /><span className="hl">Nothing they don&apos;t.</span></h2>

          <div className="feature-block reveal">
            <div className="feature-text">
              <div className="feat-number">01 - Techpacks</div>
              <h3 className="feat-h3">Structured lessons, <span className="hl">ready in minutes.</span></h3>
              <p className="feat-desc">Complete multi-format teaching packages - lesson plans, activities, Q&amp;A sets, and slides. All organised, all editable, all yours.</p>
              <div className="chips">
                <div className="chip teal"><div className="chip-dot"></div>Lesson Plan</div>
                <div className="chip teal"><div className="chip-dot"></div>Activities</div>
                <div className="chip teal"><div className="chip-dot"></div>Assessments</div>
                <div className="chip teal"><div className="chip-dot"></div>Slides</div>
                <div className="chip teal"><div className="chip-dot"></div>Answer Key</div>
              </div>
            </div>
            <div className="feature-visual">
              <div className="mockup">
                <div className="mockup-top">
                  <div className="mockup-title">📦 Techpack - Ch.4: Fractions</div>
                  <div className="mockup-pill">✓ Ready</div>
                </div>
                <div className="mockup-row"><div className="mockup-ico">📋</div><div><div className="mockup-line-title">Lesson Plan (45 min)</div><div className="mockup-line-sub">Intro → Concept → Practice → Wrap-up</div></div></div>
                <div className="mockup-row"><div className="mockup-ico">🎯</div><div><div className="mockup-line-title">8 Activities + 15 Questions</div><div className="mockup-line-sub">MCQ · Fill in blanks · Word problems</div></div></div>
                <div className="mockup-row"><div className="mockup-ico">🗺️</div><div><div className="mockup-line-title">Mind Map</div><div className="mockup-line-sub">Visual concept breakdown</div></div></div>
                <div className="mockup-bar"><div className="mockup-fill"></div></div>
              </div>
            </div>
          </div>

          <div className="feature-block rev reveal">
            <div className="feature-text">
              <div className="feat-number">02 - Multilingual</div>
              <h3 className="feat-h3">Marathi. Gujarati. English. <span className="hl">Your language.</span></h3>
              <p className="feat-desc">India&apos;s classrooms speak many languages. SeekhoWithAI generates Techpacks natively - so every teacher can teach the way their students understand best.</p>
              <div className="chips">
                <div className="chip saffron"><div className="chip-dot"></div>मराठी</div>
                <div className="chip saffron"><div className="chip-dot"></div>ગુજરાતી</div>
                <div className="chip teal"><div className="chip-dot"></div>English</div>
                <div className="chip cream"><div className="chip-dot"></div>+ More coming</div>
              </div>
            </div>
            <div className="feature-visual">
              <div className="mockup-langs">
                <div className="lang-pill"><div className="lang-top"><div className="lang-name">🇮🇳 मराठी</div><div className="lang-ok">✓ Ready</div></div><div className="lang-bar"><div className="lang-fill" style={{ width: '92%' }}></div></div></div>
                <div className="lang-pill"><div className="lang-top"><div className="lang-name">🇮🇳 ગુજરાતી</div><div className="lang-ok">✓ Ready</div></div><div className="lang-bar"><div className="lang-fill" style={{ width: '86%' }}></div></div></div>
                <div className="lang-pill"><div className="lang-top"><div className="lang-name">🇬🇧 English</div><div className="lang-ok">✓ Ready</div></div><div className="lang-bar"><div className="lang-fill" style={{ width: '100%' }}></div></div></div>
                <div className="lang-pill" style={{ opacity: 0.5 }}><div className="lang-top"><div className="lang-name">🔜 Hindi · Tamil · Telugu</div><div className="lang-soon">Coming soon</div></div><div className="lang-bar"><div className="lang-fill" style={{ width: '28%', background: 'var(--cream-dk)' }}></div></div></div>
              </div>
            </div>
          </div>

          <div className="feature-block reveal">
            <div className="feature-text">
              <div className="feat-number">03 - Planning</div>
              <h3 className="feat-h3">Plan your whole week <span className="hl">in one session.</span></h3>
              <p className="feat-desc">Schedule Techpacks across classes and subjects, then export everything at once. Works the way schools actually run - by timetable, by period, by class.</p>
              <div className="chips">
                <div className="chip teal"><div className="chip-dot"></div>Weekly planner</div>
                <div className="chip teal"><div className="chip-dot"></div>Batch export</div>
                <div className="chip teal"><div className="chip-dot"></div>HOD dashboard</div>
              </div>
            </div>
            <div className="feature-visual">
              <div className="mockup-sched">
                <div className="sched-row"><div className="sched-time">Mon 8:30</div><div className="sched-label">Class 5 - Maths: Fractions</div><div className="sched-tag tag-ready">Ready</div></div>
                <div className="sched-row"><div className="sched-time">Mon 10:00</div><div className="sched-label">Class 7 - Science: Photosynthesis</div><div className="sched-tag tag-ready">Ready</div></div>
                <div className="sched-row"><div className="sched-time">Tue 9:00</div><div className="sched-label">Class 6 - English: Tenses</div><div className="sched-tag tag-done">Exported</div></div>
                <div className="sched-row"><div className="sched-time">Wed 11:00</div><div className="sched-label">Class 8 - Computer: HTML Basics</div><div className="sched-tag tag-gen">Generating…</div></div>
                <div className="sched-row" style={{ opacity: 0.45 }}><div className="sched-time">Thu 8:30</div><div className="sched-label">Class 4 - EVS: Water Cycle</div><div className="sched-tag tag-gen">Queued</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="inside-section">
        <div className="section-inner">
          <div className="reveal">
            <span className="kicker-tag saffron">What&apos;s inside every Techpack</span>
            <h2 className="section-h2">Everything a great lesson needs.<br /><span className="hl">Nothing you don&apos;t.</span></h2>
            <p className="section-sub" style={{ marginTop: '8px' }}>Every Techpack is a complete, ready-to-teach package - not a template, not a prompt. Built for Class 1 to 8.</p>
          </div>
          <div className="inside-grid reveal">
            <div className="inside-card">
              <div className="inside-icon">📋</div>
              <div className="inside-title">Lesson Plan</div>
              <div className="inside-desc">Structured, time-boxed plan with learning objectives and teaching flow. Ready to follow, easy to adapt.</div>
            </div>
            <div className="inside-card">
              <div className="inside-icon">🎯</div>
              <div className="inside-title">Student Activities</div>
              <div className="inside-desc">Hands-on classroom activities matched to the chapter. Individual, pair, and group formats included.</div>
            </div>
            <div className="inside-card">
              <div className="inside-icon">❓</div>
              <div className="inside-title">Quiz &amp; Assessments</div>
              <div className="inside-desc">MCQs, fill-in-the-blanks, and short answers across recall and application levels. Answer key included.</div>
            </div>
            <div className="inside-card">
              <div className="inside-icon">📖</div>
              <div className="inside-title">Teacher Explanation</div>
              <div className="inside-desc">A clear explanation of the concept in your language - so you can walk into class fully confident, every time.</div>
            </div>
            <div className="inside-card">
              <div className="inside-icon">🗺️</div>
              <div className="inside-title">Mind Map</div>
              <div className="inside-desc">Auto-generated visual map of the chapter - great for introducing topics or wrapping up a unit.</div>
            </div>
            <div className="inside-card">
              <div className="inside-icon">📝</div>
              <div className="inside-title">Homework</div>
              <div className="inside-desc">Chapter-aligned homework ready to assign, with enough variety to keep students engaged beyond the classroom.</div>
            </div>
            <div className="inside-card coming">
              <div className="inside-icon" style={{ background: 'var(--cream-dk)' }}>🖥️</div>
              <div className="inside-title">Smart Panel PPT <span className="soon-badge">Coming soon</span></div>
              <div className="inside-desc">Presentation-ready slides optimised for classroom smart panels and projectors. Export as PPTX.</div>
            </div>
            <div className="inside-card">
              <div className="inside-icon">📌</div>
              <div className="inside-title">Lesson Recap</div>
              <div className="inside-desc">A crisp end-of-class summary students can take home - in plain, simple language they&apos;ll actually read.</div>
            </div>
            <div className="inside-card">
              <div className="inside-icon">📅</div>
              <div className="inside-title">Exam Notes</div>
              <div className="inside-desc">Key points, definitions, and formulas condensed for revision. Saves you making separate study sheets before exams.</div>
            </div>
          </div>
        </div>
      </section>

      {/* DUAL AUDIENCE */}
      <section className="dual-section">
        <div className="dual-grid">
          <div className="dual-card dual-teacher reveal">
            <div className="dual-eyebrow" style={{ color: 'var(--teal)' }}>For Teachers</div>
            <div className="dual-title" style={{ color: 'var(--ink)' }}>Stop spending your evenings on lesson prep.</div>
            <div className="dual-desc" style={{ color: 'var(--ink-2)' }}>You became a teacher to inspire students - not to spend 3 hours every night making worksheets. SeekhoWithAI gives you that time back.</div>
            <div className="dual-list">
              <div className="dual-item" style={{ color: 'var(--ink-2)' }}><div className="dual-check check-t">✓</div>Full Techpack ready in under 30 seconds</div>
              <div className="dual-item" style={{ color: 'var(--ink-2)' }}><div className="dual-check check-t">✓</div>Works for every subject, Class 1 to 8</div>
              <div className="dual-item" style={{ color: 'var(--ink-2)' }}><div className="dual-check check-t">✓</div>Edit anything - it&apos;s your content</div>
              <div className="dual-item" style={{ color: 'var(--ink-2)' }}><div className="dual-check check-t">✓</div>Save and reuse across years</div>
            </div>
            <a href="/auth/sign-up" className="btn-dual-t">Start Teaching Smarter →</a>
          </div>
          <div className="dual-card dual-owner reveal">
            <div className="dual-eyebrow" style={{ color: 'rgba(255,255,255,0.5)' }}>For School Owners &amp; HODs</div>
            <div className="dual-title" style={{ color: '#fff' }}>Standardise teaching quality across every classroom.</div>
            <div className="dual-desc" style={{ color: 'rgba(255,255,255,0.7)' }}>Give every teacher in your school the tools to prepare like your best teacher. Consistent quality, less burnout, happier parents.</div>
            <div className="dual-list">
              <div className="dual-item" style={{ color: 'rgba(255,255,255,0.82)' }}><div className="dual-check check-o">✓</div>School-wide deployment in one day</div>
              <div className="dual-item" style={{ color: 'rgba(255,255,255,0.82)' }}><div className="dual-check check-o">✓</div>HOD dashboard - see all teacher activity</div>
              <div className="dual-item" style={{ color: 'rgba(255,255,255,0.82)' }}><div className="dual-check check-o">✓</div>Custom syllabus and school branding</div>
              <div className="dual-item" style={{ color: 'rgba(255,255,255,0.82)' }}><div className="dual-check check-o">✓</div>Usage reports and insights</div>
            </div>
            <a href="/auth/sign-up" className="btn-dual-o">Request a School Demo →</a>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - client component */}
      <TestimonialSlider />

      {/* PRICING */}
      <section className="pricing-section" id="pricing">
        <div className="section-inner">
          <div className="reveal" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="kicker-tag teal">Simple pricing</span>
            <h2 className="section-h2">
              Free till {formattedDateWithoutYear}.<br />
              <span className="hl">₹{PRICE} after that.</span>
            </h2>
            <p className="section-sub" style={{ textAlign: 'center' }}>Sign up now and get full access at no cost. Early users lock in the best deal - no strings attached.</p>
          </div>
          <div className="pricing-grid reveal">
            <div className="pricing-card">
              <div className="plan-name">Early Access</div>
              <div className="plan-price"><sup>₹</sup>0</div>
              <div className="plan-note">Free for all signups before {formattedDateWithYear}</div>
              <div className="plan-features">
                <div className="plan-feature"><span className="plan-check">✓</span> Full access to all tools</div>
                <div className="plan-feature"><span className="plan-check">✓</span> Unlimited Techpacks</div>
                <div className="plan-feature"><span className="plan-check">✓</span> All export formats</div>
                <div className="plan-feature"><span className="plan-check">✓</span> CBSE, ICSE &amp; State Boards</div>
                <div className="plan-feature"><span className="plan-check">✓</span> English, Marathi &amp; Gujarati</div>
                <div className="plan-feature"><span className="plan-check">✓</span> Class 1 to 8</div>
              </div>
              <a href="/auth/sign-up" className="plan-btn plan-btn-saffron">Claim Free Access →</a>
            </div>
            <div className="pricing-card featured">
              <div className="pricing-badge">After {formattedDateWithoutYear}</div>
              <div className="plan-name">Pro</div>
              <div className="plan-price"><sup>₹</sup>{PRICE}</div>
              <div className="plan-note">For signups after {formattedDateWithYear}</div>
              <div className="plan-features">
                <div className="plan-feature"><span className="plan-check">✓</span> Everything in Early Access</div>
                <div className="plan-feature"><span className="plan-check">✓</span> Priority support</div>
                <div className="plan-feature"><span className="plan-check">✓</span> Smart Panel PPT (when live)</div>
                <div className="plan-feature"><span className="plan-check">✓</span> All new features as they launch</div>
                <div className="plan-feature"><span className="plan-check">✓</span> School admin dashboard</div>
              </div>
              <a href="/auth/sign-up" className="plan-btn plan-btn-saffron">
                Sign up free before {formattedDateWithoutYear}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section" id="faq">
        <div className="section-inner">
          <div className="reveal" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="kicker-tag cream">Questions</span>
            <h2 className="section-h2">Frequently asked</h2>
          </div>
          <div className="faq-grid reveal">
            <div className="faq-item">
              <div className="faq-q">Is this aligned to NCERT and Indian boards?</div>
              <div className="faq-a">Yes. SeekhoWithAI is built specifically for Indian K-12 education. It supports CBSE, ICSE, and major State Boards with curriculum-accurate content - not generic AI output.</div>
            </div>
            <div className="faq-item">
              <div className="faq-q">Which classes does SeekhoWithAI support?</div>
              <div className="faq-a">SeekhoWithAI is built for Class 1 to 8. Every Techpack, activity, and assessment is designed for primary and upper-primary level teaching.</div>
            </div>
            <div className="faq-item">
              <div className="faq-q">Can I edit the generated content?</div>
              <div className="faq-a">Everything is fully editable. Think of it as a very smart first draft - you own it, you edit it, you teach with it. The AI does the heavy lifting, you add the expertise.</div>
            </div>
            <div className="faq-item">
              <div className="faq-q">What formats can I export to?</div>
              <div className="faq-a">Word (.docx), PDF, and Google Docs. Smart Panel PPT is coming soon. All export formats are available on Early Access and Pro plans.</div>
            </div>
            <div className="faq-item">
              <div className="faq-q">Does it work for all subjects?</div>
              <div className="faq-a">Yes - Maths, Science, English, Social Studies, Hindi, EVS, Computer, and more. If your subject and chapter are in the syllabus for Class 1–8, SeekhoWithAI can generate a Techpack for it.</div>
            </div>
            <div className="faq-item">
              <div className="faq-q">What languages does it support?</div>
              <div className="faq-a">Teacher notes and content can be generated in English, Marathi, and Gujarati right now. Hindi, Tamil, and Telugu are on the roadmap and coming soon.</div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-section" id="waitlist">
        <div className="cta-inner reveal">
          <div className="cta-counter"><div className="count-dot"></div>420+ teachers already on the waitlist</div>
          <h2 className="cta-h2">Finally, a teaching tool<br /><span className="hl">worth celebrating.</span></h2>
          <p className="cta-sub">
            Be among the first to experience SeekhoWithAI. Free till {formattedDateWithoutYear} -
            for teachers, HODs, and school owners across India.
          </p>
          <div className="cta-form">
            <a href="/auth/sign-up" className="btn-cta">Get Started Free →</a>
          </div>
          <p className="cta-note">(We won&apos;t spam you. Just one email when we launch.)</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">Seekho<span>WithAI</span></div>
        <div className="footer-wit">Sadly, we can&apos;t lesson-plan your personal life.</div>
        <div className="footer-links">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <a href="#">Contact</a>
          <a href="#">hello@seekhowith.ai</a>
        </div>
      </footer>

      {/* Scroll Reveal Script */}
      <Script id="scroll-reveal" strategy="afterInteractive">{`
        const reveals = document.querySelectorAll('.reveal');
        const obs = new IntersectionObserver((entries) => {
          entries.forEach((e, i) => {
            if (e.isIntersecting) {
              setTimeout(() => e.target.classList.add('visible'), i * 80);
              obs.unobserve(e.target);
            }
          });
        }, { threshold: 0.08 });
        reveals.forEach(el => obs.observe(el));
      `}</Script>
    </>
  );
}

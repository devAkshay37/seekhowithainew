'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Sparkles, ArrowRight, BookOpen, Zap, Brain, FileText, Activity, Check } from 'lucide-react';
import { useEffect } from 'react';

const BOARDS = ['CBSE', 'ICSE', 'State Board'];
const CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8'];
const SUBJECTS = ['Maths', 'EVS', 'Science', 'Hindi Vyakran', 'English Grammar', 'Computer', 'SST', 'Other'];
const LANGUAGES = ['English', 'Hindi', 'Marathi', 'Gujarati'] as const;

const TOOLS = [
  { icon: BookOpen, name: 'TeachPack', desc: 'Full lesson content package', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Zap, name: 'Last Min Prep', desc: 'Rapid revision card', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { icon: Brain, name: 'Mindmap', desc: 'Visual concept map', color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: FileText, name: 'Quiz Creator', desc: 'Test paper generator', color: 'text-green-600', bg: 'bg-green-50' },
  { icon: Activity, name: 'Activity', desc: 'Classroom activities', color: 'text-orange-600', bg: 'bg-orange-50' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 2: Account
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Step 3: Teaching Profile
  const [schoolName, setSchoolName] = useState('');
  const [board, setBoard] = useState('CBSE');
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [customSubject, setCustomSubject] = useState('');

  // Step 4: Language
  const [language, setLanguage] = useState<string>('English');

  const [sessionUser, setSessionUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setSessionUser(data.user);
        if (data.user.user_metadata?.full_name && !fullName) {
          setFullName(data.user.user_metadata.full_name);
        }
      }
    });
  }, [supabase.auth, fullName]);

  const activeUserId = sessionUser?.id || (typeof window !== 'undefined' ? localStorage.getItem('onboarding_user_id') : null);

  const handleGetStarted = () => {
    if (sessionUser) {
      if (typeof window !== 'undefined') localStorage.setItem('onboarding_user_id', sessionUser.id);
      setStep(3); // skip account creation
    } else {
      setStep(2);
    }
  };

  async function handleCreateAccount() {
    setLoading(true);
    setError('');
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (signUpError) throw signUpError;
      if (data.user) {
        localStorage.setItem('onboarding_user_id', data.user.id);
        setStep(3);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleTeachingProfile() {
    setLoading(true);
    setError('');
    try {
      const allSubjects = customSubject
        ? [...selectedSubjects, customSubject]
        : selectedSubjects;
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ school_name: schoolName, board, classes: selectedClasses, subjects: allSubjects, full_name: fullName })
        .eq('id', activeUserId);
      if (updateError) throw updateError;
      setStep(4);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Profile update failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleLanguageAndFinish() {
    setLoading(true);
    setError('');
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ language_preference: language })
        .eq('id', activeUserId);
      if (updateError) throw updateError;
      setStep(5);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleComplete() {
    setLoading(true);
    try {
      await supabase
        .from('profiles')
        .update({ onboarding_complete: true })
        .eq('id', activeUserId);
      if (typeof window !== 'undefined') localStorage.removeItem('onboarding_user_id');
      router.push('/app/teachpack/new');
    } catch {
      router.push('/app');
    } finally {
      setLoading(false);
    }
  }

  function toggleItem(items: string[], setItems: (v: string[]) => void, item: string) {
    setItems(items.includes(item) ? items.filter((i) => i !== item) : [...items, item]);
  }

  const firstName = fullName.split(' ')[0];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-teal flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-jakarta font-bold text-xl text-heading">SeekhoWithAI</span>
          </div>
        </div>

        {/* Progress dots */}
        {step < 5 && (
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-2 rounded-full transition-all ${s <= step ? 'w-8 bg-teal' : 'w-2 bg-[#E0E0EC]'}`} />
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-[#E0E0EC] p-8 fade-in">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
          )}

          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-teal rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="font-jakarta text-2xl font-bold text-heading mb-2">Welcome to SeekhoWithAI</h1>
              <p className="text-[#8a6848] mb-8">Your AI teaching companion. Transform any lesson into a complete, classroom-ready experience in seconds.</p>
              <button onClick={handleGetStarted} className="w-full bg-saffron text-white font-semibold py-3 rounded-xl hover:bg-[#a06000] transition-colors flex items-center justify-center gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
              {!sessionUser && (
                <p className="text-[#8a6848] text-sm mt-4">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-saffron font-medium hover:underline">Sign In</Link>
                </p>
              )}
            </div>
          )}

          {/* Step 2: Create Account */}
          {step === 2 && (
            <div>
              <h2 className="font-jakarta text-xl font-bold text-heading mb-1">Create your account</h2>
              <p className="text-[#8a6848] text-sm mb-6">Let's set you up in 2 minutes.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">Full Name</label>
                  <input id="full-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Priya Sharma" className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">Email</label>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">Password</label>
                  <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-colors" />
                </div>
              </div>
              <button onClick={handleCreateAccount} disabled={!fullName || !email || !password || loading} className="w-full mt-6 bg-saffron text-white font-semibold py-3 rounded-xl hover:bg-[#a06000] transition-colors disabled:opacity-50 disabled:bg-[#e8c898] disabled:text-white disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? 'Creating account…' : <><>Continue</> <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          )}

          {/* Step 3: Teaching Profile */}
          {step === 3 && (
            <div>
              <h2 className="font-jakarta text-xl font-bold text-heading mb-1">Your Teaching Profile</h2>
              <p className="text-[#8a6848] text-sm mb-6">We'll use this to personalise your content.</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">Full Name</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Priya Sharma" className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">School Name</label>
                  <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="Your school's name" className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">Board</label>
                  <div className="flex gap-2 flex-wrap">
                    {BOARDS.map((b) => (
                      <button key={b} onClick={() => setBoard(b)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${board === b ? 'bg-saffron text-white border-saffron' : 'border-border text-foreground hover:border-teal/50 bg-card'}`}>{b}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">Classes You Teach</label>
                  <div className="flex flex-wrap gap-2">
                    {CLASSES.map((c) => (
                      <button key={c} onClick={() => toggleItem(selectedClasses, setSelectedClasses, c)} className={`w-10 h-10 rounded-lg text-sm font-medium border transition-colors ${selectedClasses.includes(c) ? 'bg-saffron text-white border-saffron' : 'border-border text-foreground hover:border-teal/50 bg-card'}`}>{c}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">Subjects You Teach</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {SUBJECTS.map((s) => (
                      <button key={s} onClick={() => toggleItem(selectedSubjects, setSelectedSubjects, s)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${selectedSubjects.includes(s) ? 'bg-saffron text-white border-saffron' : 'border-border text-foreground hover:border-teal/50 bg-card'}`}>{s}</button>
                    ))}
                  </div>
                  <input type="text" value={customSubject} onChange={(e) => setCustomSubject(e.target.value)} placeholder="+ Add custom subject" className="w-full border border-dashed border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal transition-colors" />
                </div>
              </div>
              <button onClick={handleTeachingProfile} disabled={loading || !fullName.trim()} className="w-full mt-6 bg-saffron text-white font-semibold py-3 rounded-xl hover:bg-[#a06000] disabled:bg-[#e8c898] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? 'Saving…' : <><>Continue</> <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          )}

          {/* Step 4: Language Preference */}
          {step === 4 && (
            <div>
              <h2 className="font-jakarta text-xl font-bold text-heading mb-1">Teacher Notes Language</h2>
              <p className="text-[#8a6848] text-sm mb-6">In which language should Teacher Notes be generated?</p>
              <div className="space-y-3">
                {LANGUAGES.map((lang) => (
                  <button key={lang} onClick={() => setLanguage(lang)} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-border bg-card transition-colors ${language === lang ? 'bg-[#f5ede0] border-saffron' : 'hover:border-teal/50'}`}>
                    <span className={`font-semibold ${language === lang ? 'text-saffron' : 'text-foreground'}`}>{lang}</span>
                    {language === lang && <Check className="w-4 h-4 text-saffron" />}
                  </button>
                ))}
              </div>
              <p className="text-[#8a6848] text-xs mt-3">This applies to Teacher Notes in your TeachPacks. You can change this anytime.</p>
              <button onClick={handleLanguageAndFinish} disabled={loading} className="w-full mt-6 bg-saffron text-white font-semibold py-3 rounded-xl hover:bg-[#a06000] disabled:bg-[#e8c898] transition-colors flex items-center justify-center gap-2">
                {loading ? 'Saving…' : <><>Almost done!</> <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          )}

          {/* Step 5: Ready */}
          {step === 5 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-[#f5ede0] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-saffron" />
              </div>
              <h2 className="font-jakarta text-2xl font-bold text-heading mb-2">
                Welcome, {firstName || 'Teacher'}! 🎉
              </h2>
              <p className="text-[#8a6848] mb-8">You're all set. Here's what you can create:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {TOOLS.map(({ icon: Icon, name, desc, color, bg }) => (
                  <div key={name} className="border border-border rounded-xl p-3 text-left">
                    <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center mb-2`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <p className="font-jakarta font-semibold text-xs text-heading">{name}</p>
                    <p className="text-[#8a6848] text-xs mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
              <button onClick={handleComplete} disabled={loading} className="w-full bg-saffron text-white font-semibold py-3 rounded-xl hover:bg-[#a06000] disabled:bg-[#e8c898] transition-colors flex items-center justify-center gap-2">
                {loading ? 'Loading…' : <><>Start your first TeachPack</> <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-[#0F0F1A] font-sans selection:bg-[#E85D1E]/20">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-[#6B6B8A] hover:text-[#0F0F1A] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold font-jakarta tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-[#6B6B8A] mb-12">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <div className="prose prose-slate max-w-none prose-headings:font-jakarta prose-a:text-[#E85D1E]">
          <h2>1. Introduction</h2>
          <p>Welcome to SeekhoWithAI. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at hello@seekhowith.ai.</p>
          
          <h2>2. Information We Collect</h2>
          <p>We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, or otherwise when you contact us.</p>
          <ul>
            <li><strong>Personal Information Provided by You.</strong> The personal information that we collect depends on the context of your interactions with us and the website, the choices you make and the products and features you use. The personal information we collect may include the following: names; phone numbers; email addresses; usernames; passwords; contact preferences; educational details; and other similar information.</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
          <ul>
            <li>To facilitate account creation and logon process.</li>
            <li>To post testimonials.</li>
            <li>Request feedback.</li>
            <li>To protect our Services.</li>
          </ul>

          <h2>4. Will Your Information Be Shared With Anyone?</h2>
          <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>

          <h2>5. How Long Do We Keep Your Information?</h2>
          <p>We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.</p>

          <h2>6. How Do We Keep Your Information Safe?</h2>
          <p>We aim to protect your personal information through a system of organizational and technical security measures.</p>

          <h2>7. Contact Us</h2>
          <p>If you have questions or comments about this notice, you may email us at hello@seekhowith.ai.</p>
        </div>
      </div>
    </div>
  );
}

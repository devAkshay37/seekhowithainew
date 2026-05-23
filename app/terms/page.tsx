import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white text-[#0F0F1A] font-sans selection:bg-[#E85D1E]/20">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-[#6B6B8A] hover:text-[#0F0F1A] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold font-jakarta tracking-tight mb-4">Terms of Service</h1>
        <p className="text-[#6B6B8A] mb-12">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <div className="prose prose-slate max-w-none prose-headings:font-jakarta prose-a:text-[#E85D1E]">
          <h2>1. Agreement to Terms</h2>
          <p>By accessing or using SeekhoWithAI, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.</p>
          
          <h2>2. Intellectual Property Rights</h2>
          <p>Unless otherwise indicated, the Site and Services are our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site and the trademarks, service marks, and logos contained therein are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.</p>

          <h2>3. User Representations</h2>
          <p>By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Service.</p>

          <h2>4. User Registration</h2>
          <p>You may be required to register with the Site. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.</p>

          <h2>5. Prohibited Activities</h2>
          <p>You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>

          <h2>6. Limitation of Liability</h2>
          <p>In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site, even if we have been advised of the possibility of such damages.</p>

          <h2>7. Contact Us</h2>
          <p>In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: hello@seekhowith.ai.</p>
        </div>
      </div>
    </div>
  );
}

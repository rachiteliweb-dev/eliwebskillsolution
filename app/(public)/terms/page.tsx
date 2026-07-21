"use client";

import Link from "next/link";
import { Footer } from "@/components/footer";
import { FileText, ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-body">
      {/* Hero */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <FileText className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-500">Legal</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading mb-4">
            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Service</span>
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
            Please read these terms carefully before using the EliWeb Skill Solution platform.
          </p>
          <p className="text-sm text-[var(--muted-foreground)] mt-4">
            <strong>Last updated:</strong> July 21, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-10">

            <div className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              <h2 className="text-xl font-bold font-heading text-[var(--foreground)]">1. Acceptance of Terms</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                By accessing or using the EliWeb Skill Solution website, platform, and services (collectively, the &quot;Service&quot;), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              <h2 className="text-xl font-bold font-heading text-[var(--foreground)]">2. User Accounts</h2>
              <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> You must provide accurate, complete, and current information when creating an account.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> You may not use as a username the name of another person or entity or that is not lawfully available for use, a name or trademark that is subject to any rights of another person or entity other than you without appropriate authorization.</li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              <h2 className="text-xl font-bold font-heading text-[var(--foreground)]">3. Course Enrollment and Access</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                When you enroll in a course, you get a license from us to view it via the EliWeb Skill Solution platform and no other use. You may not download, record, distribute, or share the content in any way. 
              </p>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                Most courses offer lifetime access, meaning you will have access to the course content as long as the platform exists and you retain your account in good standing. We reserve the right to revoke any license to access and use courses at any point in time in the event where we decide or are obligated to disable access to a course due to legal or policy reasons.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              <h2 className="text-xl font-bold font-heading text-[var(--foreground)]">4. Intellectual Property</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                The Service and its original content, features, and functionality are and will remain the exclusive property of EliWeb Skill Solution and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of EliWeb Skill Solution.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              <h2 className="text-xl font-bold font-heading text-[var(--foreground)]">5. User Conduct</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                You agree not to use the Service to:
              </p>
              <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> Post or transmit any content that is unlawful, threatening, abusive, harassing, defamatory, libelous, deceptive, fraudulent, invasive of another&apos;s privacy, tortious, contains explicit or graphic descriptions or accounts of sexual acts, or otherwise violates our rules or policies.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> Victimize, harass, degrade, or intimidate an individual or group of individuals on the basis of religion, gender, sexual orientation, race, ethnicity, age, or disability.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> Infringe on any patent, trademark, trade secret, copyright, right of publicity, or other proprietary right of any party.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> Constitute unauthorized or unsolicited advertising, junk or bulk email (also known as &quot;spamming&quot;), chain letters, any other form of unauthorized solicitation, or any form of lottery or gambling.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> Contain software viruses or any other computer code, files, or programs that are designed or intended to disrupt, damage, or limit the functioning of any software, hardware, or telecommunications equipment or to damage or obtain unauthorized access to any data or other information of any third party.</li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              <h2 className="text-xl font-bold font-heading text-[var(--foreground)]">6. Termination</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              <h2 className="text-xl font-bold font-heading text-[var(--foreground)]">7. Limitation of Liability</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                In no event shall EliWeb Skill Solution, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-200 dark:border-blue-500/20 shadow-sm space-y-3">
              <h2 className="text-xl font-bold font-heading text-[var(--foreground)]">8. Contact Us</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="text-sm text-[var(--muted-foreground)] space-y-1">
                <p><strong>EliWeb Skill Solution</strong> (a subsidiary of EliWeb.in)</p>
                <p>Email: <strong>support@eliweb.in</strong></p>
                <p>Phone: <strong>+91 98765 43210</strong></p>
                <p>Address: Pune, Maharashtra, India</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

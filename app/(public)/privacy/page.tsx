"use client";

import Link from "next/link";
import { Footer } from "@/components/footer";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-500">Legal</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading mb-4">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Policy</span>
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
            Your privacy is important to us. This policy explains how EliWeb Skill Solution collects, uses, and protects your personal information.
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
              <h2 className="text-xl font-bold font-heading text-[var(--foreground)]">1. Information We Collect</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                We collect the following types of information when you use our platform:
              </p>
              <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> <strong>Personal Information:</strong> Name, email address, phone number, and billing details provided during registration or course enrollment.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> <strong>Usage Data:</strong> Pages visited, courses viewed, time spent on the platform, and interaction patterns.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> <strong>Device Information:</strong> Browser type, IP address, device type, and operating system for analytics and security purposes.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> <strong>Payment Information:</strong> UPI transaction IDs, bank transfer receipts, and payment confirmation details submitted during course purchases.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> <strong>Communication Data:</strong> Messages sent through our contact forms, support tickets, and feedback submissions.</li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              <h2 className="text-xl font-bold font-heading text-[var(--foreground)]">2. How We Use Your Information</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                Your information is used for the following purposes:
              </p>
              <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> To create and manage your account on the platform.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> To process course enrollments and verify payment receipts.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> To provide, maintain, and improve our educational services.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> To send course updates, progress notifications, and relevant announcements.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> To respond to your inquiries and provide customer support.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> To analyze usage patterns and improve the user experience.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> To prevent fraud, unauthorized access, and ensure platform security.</li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              <h2 className="text-xl font-bold font-heading text-[var(--foreground)]">3. Data Sharing & Third Parties</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                We do <strong>not</strong> sell, rent, or trade your personal information to any third parties. We may share limited data with:
              </p>
              <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> <strong>Service Providers:</strong> Trusted partners who help us operate our platform (e.g., hosting, email delivery, analytics) under strict data protection agreements.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> <strong>Legal Requirements:</strong> When required by law, court order, or governmental authority.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of the transaction.</li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              <h2 className="text-xl font-bold font-heading text-[var(--foreground)]">4. Cookies & Tracking Technologies</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                We use cookies and similar tracking technologies to enhance your browsing experience. These include:
              </p>
              <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> <strong>Essential Cookies:</strong> Required for the platform to function properly (e.g., authentication, session management).</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> <strong>Analytics Cookies:</strong> Help us understand how users interact with our platform to improve the experience.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> <strong>Preference Cookies:</strong> Remember your settings and preferences (e.g., theme, language).</li>
              </ul>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                You can manage cookie preferences through your browser settings. Disabling essential cookies may affect platform functionality.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              <h2 className="text-xl font-bold font-heading text-[var(--foreground)]">5. Data Security</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                We implement industry-standard security measures to protect your personal data, including:
              </p>
              <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> SSL/TLS encryption for all data transmissions.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> Secure password hashing and storage.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> Regular security audits and vulnerability assessments.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> Access controls limiting data access to authorized personnel only.</li>
              </ul>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                While we strive to protect your information, no method of transmission over the internet is 100% secure. We encourage you to use strong, unique passwords for your account.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              <h2 className="text-xl font-bold font-heading text-[var(--foreground)]">6. Your Rights</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                You have the following rights regarding your personal data:
              </p>
              <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> <strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> <strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> <strong>Deletion:</strong> Request deletion of your personal data, subject to legal retention requirements.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> <strong>Opt-out:</strong> Unsubscribe from marketing communications at any time.</li>
              </ul>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                To exercise any of these rights, please contact us at <strong>support@eliweb.in</strong>.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              <h2 className="text-xl font-bold font-heading text-[var(--foreground)]">7. Children&apos;s Privacy</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                Our platform is not intended for children under the age of 13. We do not knowingly collect personal information from children. If we discover that we have inadvertently collected data from a child under 13, we will delete it promptly.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              <h2 className="text-xl font-bold font-heading text-[var(--foreground)]">8. Changes to This Policy</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated &quot;Last updated&quot; date. We encourage you to review this page periodically for any updates. Continued use of the platform after changes constitutes acceptance of the updated policy.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-200 dark:border-blue-500/20 shadow-sm space-y-3">
              <h2 className="text-xl font-bold font-heading text-[var(--foreground)]">9. Contact Us</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                If you have any questions or concerns about this Privacy Policy, please contact us:
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

"use client";

import Link from "next/link";
import { Footer } from "@/components/footer";
import { Receipt, ArrowLeft } from "lucide-react";

export default function RefundPolicyPage() {
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
            <Receipt className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-500">Legal</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading mb-4">
            Refund <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Policy</span>
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
            Information regarding our refund policy, eligibility criteria, and how to request a refund for our courses.
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
              <h2 className="text-xl font-bold font-heading text-[var(--foreground)]">1. Overview</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                At EliWeb Skill Solution, we are committed to providing high-quality educational content. However, we understand that sometimes a course might not be the right fit for you. We offer a transparent refund policy to ensure you have a satisfactory learning experience.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              <h2 className="text-xl font-bold font-heading text-[var(--foreground)]">2. 7-Day Money-Back Guarantee</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                We offer a 7-day money-back guarantee for most of our standard courses. If you are not completely satisfied with your purchase, you may request a full refund within 7 days of your initial payment, subject to the conditions outlined below.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              <h2 className="text-xl font-bold font-heading text-[var(--foreground)]">3. Refund Eligibility Criteria</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                To be eligible for a refund, you must meet the following criteria:
              </p>
              <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> <strong>Timeframe:</strong> Your refund request must be submitted within 7 days of the original purchase date.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> <strong>Course Progress:</strong> You must not have completed or viewed more than 25% of the total course content.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> <strong>Downloads:</strong> You must not have downloaded significant portions of the offline course materials, resources, or project files.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> <strong>Certificates:</strong> You must not have completed the course and claimed a certificate of completion.</li>
              </ul>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed text-amber-600 dark:text-amber-400">
                Note: We monitor course progress, video watch time, and file downloads to evaluate refund eligibility.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              <h2 className="text-xl font-bold font-heading text-[var(--foreground)]">4. Non-Refundable Items</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                The following purchases are generally <strong>not eligible</strong> for refunds:
              </p>
              <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> Mentorship programs, 1-on-1 coaching sessions, or mock interviews that have already been scheduled or conducted.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> Subscriptions (if applicable) after the billing cycle has started, though you can cancel future renewals.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> Purchases made during special promotional sales with explicit "no refund" terms stated at checkout.</li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              <h2 className="text-xl font-bold font-heading text-[var(--foreground)]">5. How to Request a Refund</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                To initiate a refund request, please follow these steps:
              </p>
              <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                <li className="flex gap-2"><span className="text-blue-500 font-bold">1.</span> Send an email to <strong>support@eliweb.in</strong> from the email address associated with your account.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">2.</span> Include "Refund Request - [Course Name]" in the subject line.</li>
                <li className="flex gap-2"><span className="text-blue-500 font-bold">3.</span> Provide your full name, the email address used for the purchase, the transaction ID (if available), and a brief reason for requesting the refund to help us improve our courses.</li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              <h2 className="text-xl font-bold font-heading text-[var(--foreground)]">6. Processing Time</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                Once we receive your refund request, our team will review it against our eligibility criteria. We aim to process requests within 3-5 business days. If approved, the refund will be issued to your original payment method. Please allow up to 7-10 additional business days for the funds to appear in your account, depending on your bank or payment provider.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              <h2 className="text-xl font-bold font-heading text-[var(--foreground)]">7. Abuse of the Refund Policy</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                Refunds are designed to remove the risk from purchasing courses, not to allow for free content consumption. If we determine that you are abusing our refund policy (e.g., repeatedly purchasing and refunding courses, or downloading all materials before requesting a refund), we reserve the right to restrict your account from future refunds, ban your account entirely, and/or restrict your future use of the Services.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-200 dark:border-blue-500/20 shadow-sm space-y-3">
              <h2 className="text-xl font-bold font-heading text-[var(--foreground)]">8. Contact Us</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                If you have any questions about our refund policy, please contact our support team:
              </p>
              <div className="text-sm text-[var(--muted-foreground)] space-y-1">
                <p><strong>EliWeb Skill Solution</strong> (a subsidiary of EliWeb.in)</p>
                <p>Email: <strong>support@eliweb.in</strong></p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

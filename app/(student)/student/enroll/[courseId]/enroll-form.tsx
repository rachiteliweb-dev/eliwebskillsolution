"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Course, PaymentSettings } from "@prisma/client";
import { submitEnrollment } from "@/lib/actions/enroll";
import { FileUpload } from "@/components/file-upload";
import { ArrowLeft, Loader2, CreditCard, Send, CheckCircle, HelpCircle, AlertCircle } from "lucide-react";
import Image from "next/image";

interface EnrollFormProps {
  course: Course;
  paymentSettings: PaymentSettings;
}

export default function EnrollForm({ course, paymentSettings }: EnrollFormProps) {
  const router = useRouter();

  const [transactionRef, setTransactionRef] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const priceFormatted = (course.price / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshotUrl) {
      setError("Please upload the payment transaction receipt screenshot");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await submitEnrollment(course.id, transactionRef, screenshotUrl);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
        setTimeout(() => {
          router.push("/student");
          router.refresh();
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link
        href={`/courses/${course.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Course Detail
      </Link>

      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl">
          Purchase Enrollment
        </h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Complete your payment manually and submit reference details to request access to the course.
        </p>
      </div>

      {success ? (
        <div className="backdrop-blur-md bg-[var(--card)]/60 border border-[var(--border)] rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-2xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-450 mb-2">
            <CheckCircle className="h-10 w-10 animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Payment Submission Successful!</h2>
          <p className="text-slate-450 text-sm max-w-md leading-normal">
            Your transaction reference and payment receipt screenshot have been submitted. An administrator will verify the payment and activate your access shortly. Redirecting you to dashboard...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: QR Code & Bank Transfer Details */}
          <div className="md:col-span-6 space-y-6">
            <div className="backdrop-blur-md bg-[var(--card)]/60 border border-[var(--border)] rounded-2xl p-6 shadow-xl space-y-6">
              <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-indigo-400" /> Payment Instructions
              </h2>

              <div className="relative aspect-square w-full max-w-[260px] mx-auto rounded-xl overflow-hidden border border-[var(--border)] bg-white p-3 flex justify-center items-center shadow-lg">
                <Image
                  src={paymentSettings.qrCodeImageUrl}
                  alt="Payment QR Code"
                  width={240}
                  height={240}
                  className="object-contain"
                  unoptimized
                />
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-slate-350">
                <div className="bg-[var(--background)]/60 border border-slate-900 rounded-xl p-4 flex flex-col gap-1 font-medium">
                  <span className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider font-bold">UPI ID / Payment ID</span>
                  <span className="text-[var(--foreground)] font-mono text-base select-all">{paymentSettings.upiId}</span>
                </div>

                <div className="bg-[var(--background)]/60 border border-slate-900 rounded-xl p-4 space-y-2">
                  <span className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider block font-bold">Guidelines</span>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-normal">
                    {paymentSettings.instructions}
                  </p>
                </div>

                <div className="flex gap-2 items-center bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-4 text-xs text-indigo-455">
                  <HelpCircle className="h-4 w-4 shrink-0 text-indigo-400" />
                  <span>
                    Course: <strong className="text-indigo-400">{course.title}</strong><br />
                    Amount Payable: <strong className="text-[var(--foreground)]">{priceFormatted}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Submit Verification Details Form */}
          <div className="md:col-span-6">
            <div className="backdrop-blur-md bg-[var(--card)]/60 border border-[var(--border)] rounded-2xl p-6 shadow-xl">
              <h3 className="text-base font-bold text-[var(--foreground)] mb-6">Submit Verification Details</h3>

              {error && (
                <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/35 p-3 text-xs text-red-400 flex items-start gap-1.5">
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label htmlFor="transactionRef" className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Transaction ID / Reference Number
                  </label>
                  <input
                    id="transactionRef"
                    type="text"
                    required
                    placeholder="e.g. UPI Ref, Bank Txn Code, Ref ID"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] block mb-1">
                    Upload Payment Receipt Screenshot
                  </label>
                  <FileUpload
                    endpoint="paymentScreenshot"
                    onChange={(url) => setScreenshotUrl(url || "")}
                    value={screenshotUrl}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Submit Verification <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

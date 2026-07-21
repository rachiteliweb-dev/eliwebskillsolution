"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { approveEnrollment, rejectEnrollment } from "@/lib/actions/admin";
import { FileCheck, ArrowLeft, Loader2, Check, X, ShieldAlert, Eye, User, CreditCard, ExternalLink, Clipboard, Calendar } from "lucide-react";
import Image from "next/image";

interface PendingEnrollment {
  id: string;
  createdAt: Date;
  student: { name: string; email: string };
  course: { title: string; price: string | number };
  payments: { id: string; screenshotUrl: string; transactionRef: string; createdAt: Date }[];
}

interface ApprovalsListProps {
  initialEnrollments: any[];
}

export default function ApprovalsList({ initialEnrollments }: ApprovalsListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const handleApprove = (enrollmentId: string, paymentId: string) => {
    if (!confirm("Are you sure you want to approve this enrollment?")) return;

    startTransition(async () => {
      const res = await approveEnrollment(enrollmentId, paymentId);
      if (res?.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    });
  };

  const handleReject = (enrollmentId: string, paymentId: string) => {
    if (!confirm("Are you sure you want to reject this enrollment?")) return;

    startTransition(async () => {
      const res = await rejectEnrollment(enrollmentId, paymentId);
      if (res?.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="border-b border-[var(--border)] pb-8 mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl font-heading">
          Pending Enrollment Approvals
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Review manual UPI or bank transfer screenshots and approve or reject access requests.
        </p>
      </div>

      {initialEnrollments.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-16 bg-[var(--card)] border border-[var(--border)] rounded-2xl max-w-xl mx-auto shadow-[var(--shadow-card)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] text-[var(--primary)] mb-6">
            <FileCheck className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-[var(--foreground)] mb-2 font-heading">Queue is empty</h3>
          <p className="text-[var(--muted-foreground)] text-sm max-w-sm">
            All student payment submissions have been verified. There are no pending approvals.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {initialEnrollments.map((item) => {
            const payment = item.payments[0];
            const coursePrice = (item.course.price / 100).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            });

            if (!payment) return null;

            return (
              <div
                key={item.id}
                className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-[var(--shadow-card)] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
              >
                {/* Course & Student Details */}
                <div className="lg:col-span-4 space-y-4">
                  <div>
                    <span className="text-[10px] text-[var(--primary)] font-bold uppercase tracking-wider">Course Enrollment Request</span>
                    <h3 className="text-lg font-extrabold text-[var(--foreground)] mt-1 leading-snug font-heading">{item.course.title}</h3>
                    <p className="text-base font-bold text-[var(--secondary-foreground)] mt-1">{coursePrice}</p>
                  </div>

                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                      <User className="h-3.5 w-3.5" />
                      <span>
                        Student: <strong className="text-[var(--foreground)]">{item.student.name}</strong>
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-[var(--muted-foreground)] pl-5.5 select-all">{item.student.email}</p>
                    <div className="flex items-center gap-2 text-[10px] text-[var(--muted-foreground)] pl-0.5 pt-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Requested: {new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Receipt / Reference Details */}
                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Txn ID Card */}
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex flex-col justify-between space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] font-bold uppercase tracking-wider">
                      <CreditCard className="h-3.5 w-3.5" /> Reference ID
                    </div>
                    <p className="text-sm font-mono text-[var(--primary)] break-all select-all font-semibold">
                      {payment.transactionRef}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(payment.transactionRef);
                      }}
                      className="text-[9px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center gap-1 transition-colors self-start border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 rounded"
                    >
                      <Clipboard className="h-2.5 w-2.5" /> Copy ID
                    </button>
                  </div>

                  {/* Screenshot Thumbnail Card */}
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center group shadow-md">
                    <Image
                      src={payment.screenshotUrl}
                      alt="Payment Receipt Screenshot"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-[var(--background)]/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button
                        onClick={() => setSelectedReceipt(payment.screenshotUrl)}
                        className="flex items-center gap-1 text-xs font-bold bg-[var(--primary)] text-[var(--primary-foreground)] px-3 py-1.5 rounded-lg shadow-md hover:scale-105 transition-transform"
                      >
                        <Eye className="h-3.5 w-3.5" /> View Receipt
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="lg:col-span-3 flex flex-row lg:flex-col gap-3">
                  <button
                    onClick={() => handleApprove(item.id, payment.id)}
                    disabled={isPending}
                    className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md disabled:opacity-50 transition-colors"
                  >
                    {isPending ? (
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    ) : (
                      <>
                        <Check className="h-4 w-4" /> Approve Enrollment
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleReject(item.id, payment.id)}
                    disabled={isPending}
                    className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-red-500 hover:bg-red-500/10 hover:border-red-500/20 text-xs font-bold disabled:opacity-50 transition-colors"
                  >
                    {isPending ? (
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    ) : (
                      <>
                        <X className="h-4 w-4" /> Reject Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Size Screenshot Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--background)]/95 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--surface)]">
              <h3 className="text-sm font-bold text-[var(--foreground)]">Payment Receipt Details</h3>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Receipt Preview */}
            <div className="relative aspect-auto max-h-[70vh] min-h-[400px] w-full bg-[var(--surface)] flex justify-center items-center p-4">
              <img
                src={selectedReceipt}
                alt="Receipt Full Size"
                className="max-h-[65vh] max-w-full object-contain rounded border border-[var(--border)]"
              />
            </div>

            {/* Modal Footer link */}
            <div className="px-6 py-3.5 border-t border-[var(--border)] bg-[var(--surface)] flex justify-end">
              <a
                href={selectedReceipt}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[var(--primary)] hover:opacity-80 font-semibold"
              >
                Open in new tab <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
